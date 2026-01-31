// API client for DXBData backend

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://dxbdata.xyz/api'

export interface Transaction {
  id: string
  instance_date: string
  area_name_en: string
  building_name_en: string
  property_type_en: string
  property_sub_type_en: string
  reg_type_en: string
  rooms_en: string
  actual_worth: number
  meter_sale_price: number
  procedure_area: number
  project_name_en: string
  master_project_en: string
  nearest_metro_en: string
}

export interface Area {
  area_name_en: string
  transaction_count: number
  avg_price: number
  avg_price_sqm: number
}

export interface AreaStats {
  total_transactions: number
  avg_price: number
  avg_price_sqm: number
  buildings: number
}

export interface AreaDetail {
  stats: AreaStats
  nearby: { metros: { metro: string }[] }
  top_developers: { developer: string; count: number }[]
}

export interface MarketStats {
  total_transactions: number
  total_value: number
  avg_price_sqm: number
}

export interface Trend {
  month: string
  avg_price_sqm: number
  transaction_count: number
}

// Fetch all areas
export async function getAreas(): Promise<Area[]> {
  const res = await fetch(`${API_BASE}/areas`, { next: { revalidate: 3600 } })
  if (!res.ok) throw new Error('Failed to fetch areas')
  return res.json()
}

// Fetch area details
export async function getAreaDetail(name: string): Promise<AreaDetail> {
  const res = await fetch(`${API_BASE}/neighborhoods/${encodeURIComponent(name)}`, { next: { revalidate: 3600 } })
  if (!res.ok) throw new Error('Failed to fetch area details')
  return res.json()
}

// Fetch market stats
export async function getMarketStats(): Promise<MarketStats> {
  const res = await fetch(`${API_BASE}/stats`, { next: { revalidate: 3600 } })
  if (!res.ok) throw new Error('Failed to fetch stats')
  return res.json()
}

// Fetch trends
export async function getTrends(years: number = 1): Promise<Trend[]> {
  const res = await fetch(`${API_BASE}/trends?years=${years}`, { next: { revalidate: 3600 } })
  if (!res.ok) throw new Error('Failed to fetch trends')
  return res.json()
}

// Fetch transactions
export async function getTransactions(params: Record<string, string | number>): Promise<{ data: Transaction[], total: number }> {
  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      searchParams.set(key, String(value))
    }
  })
  const res = await fetch(`${API_BASE}/transactions?${searchParams.toString()}`, { next: { revalidate: 60 } })
  if (!res.ok) throw new Error('Failed to fetch transactions')
  return res.json()
}

// Format helpers
export function formatPrice(price: number): string {
  if (price >= 1000000) return `AED ${(price / 1000000).toFixed(2)}M`
  if (price >= 1000) return `AED ${Math.round(price / 1000)}K`
  return `AED ${price.toLocaleString()}`
}

export function formatNumber(num: number): string {
  return num.toLocaleString()
}
