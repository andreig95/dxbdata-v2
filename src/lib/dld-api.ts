/**
 * Dubai Land Department API Integration
 * 
 * To use real data:
 * 1. Register at https://www.dubaipulse.gov.ae/
 * 2. Request access to DLD Transactions dataset
 * 3. Get your API Key and API Secret
 * 4. Set environment variables:
 *    - DUBAI_PULSE_API_KEY
 *    - DUBAI_PULSE_API_SECRET
 */

const API_BASE = 'https://api.dubaipulse.gov.ae'
const DLD_TRANSACTIONS_ENDPOINT = '/shared/dld/dld_transactions-open-api'

// Cached access token
let accessToken: string | null = null
let tokenExpiry: number = 0

interface DLDTransaction {
  transaction_id: string
  instance_date: string
  area_name_en: string
  area_name_ar: string
  building_name_en: string
  building_name_ar: string
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
  procedure_area: number
  actual_worth: number
  meter_sale_price: number
  nearest_metro_en: string
  nearest_mall_en: string
  nearest_landmark_en: string
}

interface DLDApiResponse {
  success: boolean
  data: DLDTransaction[]
  total: number
  source: 'api' | 'sample'
  error?: string
}

/**
 * Get OAuth access token from Dubai Pulse
 */
async function getAccessToken(): Promise<string | null> {
  const apiKey = process.env.DUBAI_PULSE_API_KEY
  const apiSecret = process.env.DUBAI_PULSE_API_SECRET
  
  if (!apiKey || !apiSecret) {
    console.log('[DLD API] No credentials configured, using sample data')
    return null
  }
  
  // Check if we have a valid cached token
  if (accessToken && Date.now() < tokenExpiry) {
    return accessToken
  }
  
  try {
    const response = await fetch(
      `${API_BASE}/oauth/client_credential/accesstoken?grant_type=client_credentials`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `client_id=${apiKey}&client_secret=${apiSecret}`,
      }
    )
    
    if (!response.ok) {
      console.error('[DLD API] Failed to get access token:', response.status)
      return null
    }
    
    const data = await response.json()
    accessToken = data.access_token
    // Token typically valid for 1 hour, refresh 5 minutes early
    tokenExpiry = Date.now() + (data.expires_in - 300) * 1000
    
    console.log('[DLD API] Got access token, expires in', data.expires_in, 'seconds')
    return accessToken
  } catch (error) {
    console.error('[DLD API] Error getting access token:', error)
    return null
  }
}

/**
 * Fetch transactions from Dubai Pulse API
 */
export async function fetchDLDTransactions(params: {
  area?: string
  limit?: number
  offset?: number
  fromDate?: string
  toDate?: string
  transGroup?: string
  propertyType?: string
}): Promise<DLDApiResponse> {
  const token = await getAccessToken()
  
  if (!token) {
    // Return sample data if no API access
    return generateSampleData(params)
  }
  
  try {
    const queryParams = new URLSearchParams()
    if (params.limit) queryParams.set('limit', String(params.limit))
    if (params.offset) queryParams.set('offset', String(params.offset))
    if (params.area) queryParams.set('area_name_en', params.area)
    if (params.fromDate) queryParams.set('instance_date_gte', params.fromDate)
    if (params.toDate) queryParams.set('instance_date_lte', params.toDate)
    if (params.transGroup) queryParams.set('trans_group_en', params.transGroup)
    if (params.propertyType) queryParams.set('property_type_en', params.propertyType)
    
    const url = `${API_BASE}${DLD_TRANSACTIONS_ENDPOINT}?${queryParams.toString()}`
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    })
    
    if (!response.ok) {
      console.error('[DLD API] Request failed:', response.status)
      return generateSampleData(params)
    }
    
    const data = await response.json()
    
    return {
      success: true,
      data: data.result || data.data || [],
      total: data.total || data.result?.length || 0,
      source: 'api',
    }
  } catch (error) {
    console.error('[DLD API] Error fetching transactions:', error)
    return generateSampleData(params)
  }
}

/**
 * Fetch area statistics
 */
export async function fetchAreaStats(areaName: string): Promise<{
  totalTransactions: number
  avgPrice: number
  avgPricePerSqm: number
  totalValue: number
  source: 'api' | 'sample'
}> {
  const token = await getAccessToken()
  
  if (!token) {
    // Sample data based on area
    const stats = sampleAreaStats[areaName.toLowerCase()] || {
      totalTransactions: 500,
      avgPrice: 1500000,
      avgPricePerSqm: 14000,
      totalValue: 750000000,
    }
    return { ...stats, source: 'sample' }
  }
  
  // With real API, we'd aggregate from transactions
  // For now, return sample
  const stats = sampleAreaStats[areaName.toLowerCase()] || {
    totalTransactions: 500,
    avgPrice: 1500000,
    avgPricePerSqm: 14000,
    totalValue: 750000000,
  }
  return { ...stats, source: 'sample' }
}

// Sample area statistics
const sampleAreaStats: Record<string, {
  totalTransactions: number
  avgPrice: number
  avgPricePerSqm: number
  totalValue: number
}> = {
  'dubai marina': { totalTransactions: 3240, avgPrice: 1900000, avgPricePerSqm: 18500, totalValue: 6156000000 },
  'downtown dubai': { totalTransactions: 2890, avgPrice: 2500000, avgPricePerSqm: 22000, totalValue: 7225000000 },
  'palm jumeirah': { totalTransactions: 1560, avgPrice: 4200000, avgPricePerSqm: 28000, totalValue: 6552000000 },
  'business bay': { totalTransactions: 2100, avgPrice: 1400000, avgPricePerSqm: 16000, totalValue: 2940000000 },
  'dubai hills': { totalTransactions: 1890, avgPrice: 2100000, avgPricePerSqm: 15000, totalValue: 3969000000 },
  'jumeirah village circle': { totalTransactions: 4500, avgPrice: 800000, avgPricePerSqm: 10500, totalValue: 3600000000 },
}

/**
 * Generate sample transaction data (fallback when no API access)
 */
function generateSampleData(params: {
  area?: string
  limit?: number
  offset?: number
}): DLDApiResponse {
  const limit = params.limit || 20
  const offset = params.offset || 0
  const area = params.area || 'Dubai Marina'
  
  const buildings = [
    'Marina Gate', 'Cayan Tower', 'Princess Tower', 'The Address', 'Damac Heights',
    'Burj Vista', 'Opera Grand', 'Boulevard Point', 'Forte', 'The Residences',
    'Park Heights', 'Golf Vista', 'Mulberry', 'Collective', 'Sidra Villas',
    'Marina Promenade', 'Sparkle Towers', 'Azure Residences', 'Palm View'
  ]
  
  const propertyTypes = ['Unit', 'Villa', 'Land', 'Building']
  const subTypes = ['Apartment', 'Townhouse', 'Penthouse', 'Studio', 'Duplex', 'Office', 'Shop']
  const rooms = ['Studio', '1 B/R', '2 B/R', '3 B/R', '4 B/R', '5 B/R']
  const transGroups = ['Sales', 'Mortgage', 'Gift']
  
  const transactions: DLDTransaction[] = []
  const now = new Date()
  
  // Generate consistent data based on area + offset for pagination
  const seed = hashCode(area + offset)
  
  for (let i = 0; i < limit; i++) {
    const idx = offset + i
    const random = seededRandom(seed + idx)
    
    const daysAgo = Math.floor(random() * 365)
    const date = new Date(now)
    date.setDate(date.getDate() - daysAgo)
    
    const propertyArea = 50 + Math.floor(random() * 350)
    const pricePerSqm = 8000 + Math.floor(random() * 30000)
    const price = propertyArea * pricePerSqm
    
    transactions.push({
      transaction_id: `TX${date.getFullYear()}${String(idx).padStart(8, '0')}`,
      instance_date: date.toISOString().split('T')[0],
      area_name_en: area,
      area_name_ar: area,
      building_name_en: buildings[Math.floor(random() * buildings.length)],
      building_name_ar: '',
      project_name_en: buildings[Math.floor(random() * buildings.length)],
      master_project_en: area,
      property_type_en: propertyTypes[Math.floor(random() * propertyTypes.length)],
      property_sub_type_en: subTypes[Math.floor(random() * subTypes.length)],
      property_usage_en: random() > 0.2 ? 'Residential' : 'Commercial',
      reg_type_en: random() > 0.3 ? 'Ready' : 'Off-plan',
      trans_group_en: transGroups[Math.floor(random() * 10) < 7 ? 0 : Math.floor(random() * 3)],
      procedure_name_en: 'Sale',
      rooms_en: rooms[Math.floor(random() * rooms.length)],
      has_parking: random() > 0.3 ? 1 : 0,
      procedure_area: propertyArea,
      actual_worth: price,
      meter_sale_price: pricePerSqm,
      nearest_metro_en: 'Dubai Marina Metro',
      nearest_mall_en: 'Dubai Marina Mall',
      nearest_landmark_en: 'Marina Walk',
    })
  }
  
  // Sort by date descending
  transactions.sort((a, b) => 
    new Date(b.instance_date).getTime() - new Date(a.instance_date).getTime()
  )
  
  return {
    success: true,
    data: transactions,
    total: 5000 + Math.floor(seededRandom(hashCode(area))() * 10000),
    source: 'sample',
  }
}

// Helper functions for consistent random generation
function hashCode(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return Math.abs(hash)
}

function seededRandom(seed: number): () => number {
  return function() {
    seed = (seed * 9301 + 49297) % 233280
    return seed / 233280
  }
}

export type { DLDTransaction, DLDApiResponse }
