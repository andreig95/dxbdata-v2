import { NextRequest, NextResponse } from 'next/server'
import Database from 'better-sqlite3'
import path from 'path'
import { getDeveloper } from '@/lib/developers-lookup'

const dbPath = path.join(process.cwd(), 'data', 'dld.db')

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const building = searchParams.get('building')
  const size = searchParams.get('size')
  const rooms = searchParams.get('rooms')
  const type = searchParams.get('type')
  
  if (!building) {
    return NextResponse.json({ error: 'Building required' }, { status: 400 })
  }
  
  try {
    const db = new Database(dbPath, { readonly: true })
    
    let query = `
      SELECT 
        transaction_id,
        instance_date,
        trans_group_en,
        procedure_name_en,
        property_sub_type_en,
        rooms_en,
        procedure_area,
        actual_worth,
        meter_sale_price,
        building_name_en,
        area_name_en,
        project_name_en,
        master_project_en,
        reg_type_en
      FROM transactions
      WHERE building_name_en = ?
    `
    const params: any[] = [building]
    
    if (size) {
      // Size comes in as sqft, convert to sqm for DB query
      const sizeSqft = parseFloat(size)
      const sizeSqm = sizeSqft / 10.764
      // Allow 2% tolerance for rounding differences
      const tolerance = sizeSqm * 0.02
      query += ` AND procedure_area BETWEEN ? AND ?`
      params.push(sizeSqm - tolerance, sizeSqm + tolerance)
    }
    
    if (rooms) {
      query += ` AND rooms_en = ?`
      params.push(rooms)
    }
    
    if (type) {
      query += ` AND property_sub_type_en = ?`
      params.push(type)
    }
    
    // Get in chronological order first for flip number calculation
    query += ` ORDER BY SUBSTR(instance_date, 7, 4) || SUBSTR(instance_date, 4, 2) || SUBSTR(instance_date, 1, 2) ASC`
    
    const transactions = db.prepare(query).all(...params) as any[]
    
    // Calculate flip gains in chronological order
    let flipHistory: any[] = []
    let previousPrice = 0
    
    transactions.forEach((tx: any, idx: number) => {
      const gain = idx > 0 && previousPrice > 0 ? tx.actual_worth - previousPrice : null
      const gainPct = gain !== null && previousPrice > 0 ? (gain / previousPrice) * 100 : null
      
      flipHistory.push({
        ...tx,
        flip_number: idx + 1,
        previous_price: idx > 0 ? previousPrice : null,
        gain,
        gain_pct: gainPct ? Math.round(gainPct * 10) / 10 : null
      })
      
      previousPrice = tx.actual_worth
    })
    
    // Reverse so newest is first
    flipHistory.reverse()
    
    // Summary stats (from original chronological order)
    const firstSale = transactions[0]
    const lastSale = transactions[transactions.length - 1]
    const totalAppreciation = lastSale && firstSale ? 
      ((lastSale.actual_worth - firstSale.actual_worth) / firstSale.actual_worth) * 100 : 0
    
    db.close()
    
    return NextResponse.json({
      property: {
        building: building,
        area: firstSale?.area_name_en,
        project: firstSale?.project_name_en,
        master_project: firstSale?.master_project_en,
        developer: getDeveloper(firstSale?.master_project_en, firstSale?.project_name_en),
        type: type || firstSale?.property_sub_type_en,
        rooms: rooms || firstSale?.rooms_en,
        size_sqm: firstSale?.procedure_area || (size ? parseFloat(size) / 10.764 : 0),
        size_sqft: size ? parseFloat(size) : Math.round((firstSale?.procedure_area || 0) * 10.764)
      },
      stats: {
        total_sales: transactions.length,
        first_sale_price: firstSale?.actual_worth,
        first_sale_date: firstSale?.instance_date,
        last_sale_price: lastSale?.actual_worth,
        last_sale_date: lastSale?.instance_date,
        total_appreciation_pct: Math.round(totalAppreciation * 10) / 10,
        developer_sale: firstSale?.trans_group_en === 'Sales' && firstSale?.reg_type_en === 'Ready'
      },
      transactions: flipHistory,
      source: 'sqlite'
    })
  } catch (error) {
    console.error('Property API error:', error)
    return NextResponse.json({ error: 'Failed to fetch property data' }, { status: 500 })
  }
}
