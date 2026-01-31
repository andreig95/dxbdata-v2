import { NextResponse } from 'next/server'

// Mock neighborhood details
const neighborhoodData: Record<string, {
  stats: { total_transactions: number; avg_price: number; avg_price_sqm: number; buildings: number }
  nearby: { metros: { metro: string }[] }
  top_developers: { developer: string; count: number }[]
}> = {
  'dubai marina': {
    stats: { total_transactions: 3240, avg_price: 1900000, avg_price_sqm: 18500, buildings: 245 },
    nearby: { metros: [{ metro: 'DAMAC Properties' }, { metro: 'Dubai Marina' }, { metro: 'Jumeirah Lakes Towers' }] },
    top_developers: [
      { developer: 'Emaar Properties', count: 28 },
      { developer: 'Select Group', count: 18 },
      { developer: 'DAMAC', count: 15 },
      { developer: 'Deyaar', count: 12 },
    ]
  },
  'downtown dubai': {
    stats: { total_transactions: 2890, avg_price: 2500000, avg_price_sqm: 22000, buildings: 180 },
    nearby: { metros: [{ metro: 'Burj Khalifa/Dubai Mall' }, { metro: 'Financial Centre' }] },
    top_developers: [
      { developer: 'Emaar Properties', count: 45 },
      { developer: 'Address Hotels', count: 8 },
    ]
  },
  'palm jumeirah': {
    stats: { total_transactions: 1560, avg_price: 4200000, avg_price_sqm: 28000, buildings: 85 },
    nearby: { metros: [{ metro: 'Palm Jumeirah' }] },
    top_developers: [
      { developer: 'Nakheel', count: 38 },
      { developer: 'Seven Tides', count: 12 },
      { developer: 'Omniyat', count: 8 },
    ]
  },
  'business bay': {
    stats: { total_transactions: 2100, avg_price: 1400000, avg_price_sqm: 16000, buildings: 320 },
    nearby: { metros: [{ metro: 'Business Bay' }, { metro: 'Burj Khalifa/Dubai Mall' }] },
    top_developers: [
      { developer: 'DAMAC', count: 35 },
      { developer: 'Omniyat', count: 22 },
      { developer: 'Bay Square', count: 18 },
    ]
  },
  'dubai hills': {
    stats: { total_transactions: 1890, avg_price: 2100000, avg_price_sqm: 15000, buildings: 120 },
    nearby: { metros: [{ metro: 'Mall of the Emirates' }, { metro: 'Dubai Hills Mall' }] },
    top_developers: [
      { developer: 'Emaar Properties', count: 52 },
      { developer: 'Meraas', count: 8 },
    ]
  },
  'jumeirah village circle': {
    stats: { total_transactions: 4500, avg_price: 800000, avg_price_sqm: 10500, buildings: 450 },
    nearby: { metros: [{ metro: 'Dubai Internet City' }, { metro: 'DMCC' }] },
    top_developers: [
      { developer: 'Nakheel', count: 65 },
      { developer: 'Ellington', count: 28 },
      { developer: 'Danube', count: 25 },
    ]
  },
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params
  const normalizedName = decodeURIComponent(name).toLowerCase()
  
  const data = neighborhoodData[normalizedName]
  
  if (data) {
    return NextResponse.json(data)
  }
  
  // Return generic data for unknown neighborhoods
  return NextResponse.json({
    stats: { total_transactions: 500, avg_price: 1500000, avg_price_sqm: 14000, buildings: 50 },
    nearby: { metros: [] },
    top_developers: [
      { developer: 'Various Developers', count: 10 },
    ]
  })
}
