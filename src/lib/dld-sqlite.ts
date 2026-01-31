/**
 * DLD SQLite Database Client
 * Uses the imported Dubai Land Department transaction data
 * All measurements in sqft (converted from sqm: * 10.764 for area, / 10.764 for price)
 */

import Database from 'better-sqlite3'

const DB_PATH = process.env.DLD_DATABASE_PATH || '/var/www/dxbdata/data/dld.db'
const SQM_TO_SQFT = 10.764

let db: Database.Database | null = null

function getDb(): Database.Database | null {
  if (db) return db
  
  try {
    db = new Database(DB_PATH, { readonly: true })
    return db
  } catch (error) {
    console.error('[DLD DB] Failed to open database:', error)
    return null
  }
}

export interface Transaction {
  transaction_id: string
  instance_date: string
  area_name_en: string
  building_name_en: string
  project_name_en: string
  master_project_en: string
  property_type_en: string
  property_sub_type_en: string
  property_usage_en: string
  reg_type_en: string
  trans_group_en: string
  procedure_name_en: string
  rooms_en: string
  has_parking: number
  area_sqft: number
  actual_worth: number
  price_per_sqft: number
  nearest_metro_en: string
  nearest_mall_en: string
}

export interface QueryParams {
  area?: string
  building?: string
  search?: string // Combined search for area, building, project
  transGroup?: string
  propertyType?: string
  propertySubType?: string
  propertyUsage?: string // Residential or Commercial
  regType?: string // Ready or Off-plan
  fromDate?: string
  toDate?: string
  minPrice?: number
  maxPrice?: number
  minSize?: number // in sqft
  maxSize?: number // in sqft
  developer?: string // keyword search in project/master project
  limit?: number
  offset?: number
  sortBy?: string
  sortOrder?: 'ASC' | 'DESC'
}

export interface QueryResult {
  data: Transaction[]
  total: number
  source: 'sqlite' | 'sample'
}

export function queryTransactions(params: QueryParams): QueryResult {
  const database = getDb()
  
  if (!database) {
    return { data: [], total: 0, source: 'sample' }
  }
  
  const conditions: string[] = []
  const values: (string | number)[] = []
  
  // Combined search - searches area, building, and project names
  if (params.search) {
    conditions.push(`(
      area_name_en LIKE ? OR 
      building_name_en LIKE ? OR 
      project_name_en LIKE ? OR
      master_project_en LIKE ?
    )`)
    const searchTerm = `%${params.search}%`
    values.push(searchTerm, searchTerm, searchTerm, searchTerm)
  }
  
  if (params.area && !params.search) {
    // Search across area, master_project, and project names
    conditions.push(`(
      area_name_en LIKE ? OR 
      master_project_en LIKE ? OR 
      project_name_en LIKE ?
    )`)
    const areaTerm = `%${params.area}%`
    values.push(areaTerm, areaTerm, areaTerm)
  }
  
  if (params.building && !params.search) {
    conditions.push('building_name_en LIKE ?')
    values.push(`%${params.building}%`)
  }
  
  if (params.transGroup) {
    conditions.push('trans_group_en = ?')
    values.push(params.transGroup)
  }
  
  if (params.propertyType) {
    conditions.push('property_type_en = ?')
    values.push(params.propertyType)
  }
  
  // Property sub-type filter (apartment, villa, office, etc.)
  if (params.propertySubType) {
    conditions.push('property_sub_type_en LIKE ?')
    values.push(`%${params.propertySubType}%`)
  }
  
  // Property usage filter (Residential or Commercial)
  if (params.propertyUsage) {
    conditions.push('property_usage_en = ?')
    values.push(params.propertyUsage)
  }
  
  // Registration type filter (Ready or Off-plan)
  if (params.regType) {
    conditions.push('reg_type_en = ?')
    values.push(params.regType)
  }
  
  if (params.fromDate) {
    conditions.push("instance_date >= ?")
    values.push(params.fromDate)
  }
  
  if (params.toDate) {
    conditions.push("instance_date <= ?")
    values.push(params.toDate)
  }
  
  if (params.minPrice) {
    conditions.push('actual_worth >= ?')
    values.push(params.minPrice)
  }
  
  if (params.maxPrice) {
    conditions.push('actual_worth <= ?')
    values.push(params.maxPrice)
  }
  
  // Size filters (convert sqft to sqm for the query since DB stores sqm)
  if (params.minSize) {
    conditions.push(`procedure_area >= ?`)
    values.push(params.minSize / SQM_TO_SQFT) // Convert sqft to sqm
  }
  
  if (params.maxSize) {
    conditions.push(`procedure_area <= ?`)
    values.push(params.maxSize / SQM_TO_SQFT) // Convert sqft to sqm
  }
  
  // Developer/keyword search in project names
  if (params.developer) {
    conditions.push(`(
      project_name_en LIKE ? OR 
      master_project_en LIKE ?
    )`)
    const devTerm = `%${params.developer}%`
    values.push(devTerm, devTerm)
  }
  
  conditions.push("area_name_en IS NOT NULL AND area_name_en != ''")
  
  const whereClause = conditions.length > 0 
    ? `WHERE ${conditions.join(' AND ')}` 
    : ''
  
  const sortBy = params.sortBy || 'instance_date'
  const sortOrder = params.sortOrder || 'DESC'
  const limit = params.limit || 20
  const offset = params.offset || 0
  
  const countSql = `SELECT COUNT(*) as count FROM transactions ${whereClause}`
  const countResult = database.prepare(countSql).get(...values) as { count: number }
  
  const dataSql = `
    SELECT 
      transaction_id, instance_date, area_name_en, building_name_en,
      project_name_en, master_project_en, property_type_en, property_sub_type_en,
      property_usage_en, reg_type_en, trans_group_en, procedure_name_en,
      rooms_en, has_parking, 
      ROUND(procedure_area * ${SQM_TO_SQFT}, 2) as area_sqft,
      actual_worth, 
      ROUND(meter_sale_price / ${SQM_TO_SQFT}, 2) as price_per_sqft,
      nearest_metro_en, nearest_mall_en
    FROM transactions 
    ${whereClause}
    ORDER BY ${sortBy} ${sortOrder}
    LIMIT ? OFFSET ?
  `
  
  const data = database.prepare(dataSql).all(...values, limit, offset) as Transaction[]
  
  return {
    data,
    total: countResult.count,
    source: 'sqlite',
  }
}

export function getAreaStats(areaName?: string): {
  areas: Array<{
    area_name_en: string
    transaction_count: number
    avg_price: number
    avg_price_sqft: number
    total_value: number
  }>
  source: 'sqlite' | 'sample'
} {
  const database = getDb()
  
  if (!database) {
    return { areas: [], source: 'sample' }
  }
  
  let sql = `
    SELECT 
      area_name_en,
      COUNT(*) as transaction_count,
      ROUND(AVG(actual_worth), 0) as avg_price,
      ROUND(AVG(meter_sale_price / ${SQM_TO_SQFT}), 0) as avg_price_sqft,
      ROUND(SUM(actual_worth), 0) as total_value
    FROM transactions 
    WHERE area_name_en IS NOT NULL 
      AND area_name_en != ''
      AND actual_worth > 0
      AND trans_group_en = 'Sales'
  `
  
  const values: string[] = []
  
  if (areaName) {
    sql += ` AND area_name_en LIKE ?`
    values.push(`%${areaName}%`)
  }
  
  sql += ` GROUP BY area_name_en ORDER BY transaction_count DESC`
  
  if (!areaName) {
    sql += ` LIMIT 50`
  }
  
  const areas = database.prepare(sql).all(...values) as Array<{
    area_name_en: string
    transaction_count: number
    avg_price: number
    avg_price_sqft: number
    total_value: number
  }>
  
  return { areas, source: 'sqlite' }
}

export function getBuildingStats(areaName: string): {
  buildings: Array<{
    building_name_en: string
    transaction_count: number
    avg_price: number
    avg_price_sqft: number
  }>
  source: 'sqlite' | 'sample'
} {
  const database = getDb()
  
  if (!database) {
    return { buildings: [], source: 'sample' }
  }
  
  const sql = `
    SELECT 
      building_name_en,
      COUNT(*) as transaction_count,
      ROUND(AVG(actual_worth), 0) as avg_price,
      ROUND(AVG(meter_sale_price / ${SQM_TO_SQFT}), 0) as avg_price_sqft
    FROM transactions 
    WHERE area_name_en LIKE ?
      AND building_name_en IS NOT NULL 
      AND building_name_en != ''
      AND actual_worth > 0
      AND trans_group_en = 'Sales'
    GROUP BY building_name_en 
    ORDER BY transaction_count DESC
    LIMIT 20
  `
  
  const buildings = database.prepare(sql).all(`%${areaName}%`) as Array<{
    building_name_en: string
    transaction_count: number
    avg_price: number
    avg_price_sqft: number
  }>
  
  return { buildings, source: 'sqlite' }
}

export function getMarketStats(): {
  total_transactions: number
  total_value: number
  avg_price_sqft: number
  unique_areas: number
  date_range: { min: string, max: string }
  source: 'sqlite' | 'sample'
} {
  const database = getDb()
  
  if (!database) {
    return {
      total_transactions: 142847,
      total_value: 389500000000,
      avg_price_sqft: 1325,
      unique_areas: 187,
      date_range: { min: '2008-01-01', max: '2026-01-30' },
      source: 'sample',
    }
  }
  
  const stats = database.prepare(`
    SELECT 
      COUNT(*) as total_transactions,
      ROUND(SUM(actual_worth), 0) as total_value,
      ROUND(AVG(meter_sale_price / ${SQM_TO_SQFT}), 0) as avg_price_sqft,
      COUNT(DISTINCT area_name_en) as unique_areas,
      MIN(instance_date) as min_date,
      MAX(instance_date) as max_date
    FROM transactions
    WHERE trans_group_en = 'Sales' AND actual_worth > 0
  `).get() as {
    total_transactions: number
    total_value: number
    avg_price_sqft: number
    unique_areas: number
    min_date: string
    max_date: string
  }
  
  return {
    total_transactions: stats.total_transactions,
    total_value: stats.total_value,
    avg_price_sqft: stats.avg_price_sqft,
    unique_areas: stats.unique_areas,
    date_range: { min: stats.min_date, max: stats.max_date },
    source: 'sqlite',
  }
}

export function searchAll(query: string, limit: number = 10): {
  results: Array<{
    name: string
    type: 'area' | 'building' | 'project'
    count: number
  }>
  source: 'sqlite' | 'sample'
} {
  const database = getDb()
  
  if (!database || query.length < 2) {
    return { results: [], source: 'sample' }
  }
  
  const searchTerm = `%${query}%`
  
  const areas = database.prepare(`
    SELECT area_name_en as name, 'area' as type, COUNT(*) as count
    FROM transactions
    WHERE area_name_en LIKE ? AND area_name_en IS NOT NULL AND area_name_en != ''
    GROUP BY area_name_en
    ORDER BY count DESC
    LIMIT 5
  `).all(searchTerm) as Array<{ name: string, type: 'area', count: number }>
  
  const buildings = database.prepare(`
    SELECT building_name_en as name, 'building' as type, COUNT(*) as count
    FROM transactions
    WHERE building_name_en LIKE ? AND building_name_en IS NOT NULL AND building_name_en != ''
    GROUP BY building_name_en
    ORDER BY count DESC
    LIMIT 5
  `).all(searchTerm) as Array<{ name: string, type: 'building', count: number }>
  
  const results = [...areas, ...buildings]
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
  
  return { results, source: 'sqlite' }
}

export function isDatabaseAvailable(): boolean {
  return getDb() !== null
}
