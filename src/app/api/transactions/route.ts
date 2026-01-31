import { NextResponse } from 'next/server'

// Mock transactions generator
function generateTransactions(area: string, limit: number) {
  const buildings = [
    'Marina Gate', 'Cayan Tower', 'Princess Tower', 'The Address', 'Damac Heights',
    'Burj Vista', 'Opera Grand', 'Boulevard Point', 'Forte', 'The Residences',
    'Park Heights', 'Golf Vista', 'Mulberry', 'Collective', 'Sidra Villas'
  ]
  
  const types = ['Apartment', 'Villa', 'Townhouse', 'Penthouse', 'Studio']
  const subTypes = ['1 BR', '2 BR', '3 BR', '4 BR', '5+ BR']
  
  const transactions = []
  const now = new Date()
  
  for (let i = 0; i < limit; i++) {
    const daysAgo = Math.floor(Math.random() * 180)
    const date = new Date(now)
    date.setDate(date.getDate() - daysAgo)
    
    const propertyArea = 50 + Math.floor(Math.random() * 300)
    const pricePerSqm = 10000 + Math.floor(Math.random() * 25000)
    const price = propertyArea * pricePerSqm
    
    transactions.push({
      id: `TX${Date.now()}${i}`,
      instance_date: date.toISOString().split('T')[0],
      area_name_en: area || 'Dubai Marina',
      building_name_en: buildings[Math.floor(Math.random() * buildings.length)],
      property_type_en: types[Math.floor(Math.random() * types.length)],
      property_sub_type_en: subTypes[Math.floor(Math.random() * subTypes.length)],
      reg_type_en: Math.random() > 0.3 ? 'Sales' : 'Gift',
      rooms_en: `${1 + Math.floor(Math.random() * 5)}`,
      actual_worth: price,
      meter_sale_price: pricePerSqm,
      procedure_area: propertyArea,
      project_name_en: buildings[Math.floor(Math.random() * buildings.length)],
      master_project_en: area || 'Dubai Marina',
      nearest_metro_en: 'Dubai Marina Metro',
    })
  }
  
  // Sort by date descending
  transactions.sort((a, b) => new Date(b.instance_date).getTime() - new Date(a.instance_date).getTime())
  
  return transactions
}

// Store generated transactions to maintain consistency across paginated requests
const transactionCache = new Map<string, ReturnType<typeof generateTransactions>>()

function getOrGenerateTransactions(area: string) {
  const cacheKey = area.toLowerCase()
  if (!transactionCache.has(cacheKey)) {
    // Generate a larger set for pagination
    transactionCache.set(cacheKey, generateTransactions(area, 500))
  }
  return transactionCache.get(cacheKey)!
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const area = searchParams.get('area') || ''
  const limit = parseInt(searchParams.get('limit') || '20')
  const offset = parseInt(searchParams.get('offset') || '0')
  
  const allTransactions = getOrGenerateTransactions(area)
  const paginatedTransactions = allTransactions.slice(offset, offset + limit)
  
  return NextResponse.json({
    data: paginatedTransactions,
    total: allTransactions.length,
    page: Math.floor(offset / limit) + 1,
    pageSize: limit,
    totalPages: Math.ceil(allTransactions.length / limit)
  })
}
