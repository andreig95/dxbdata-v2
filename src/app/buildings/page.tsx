import Link from 'next/link'
import { Search, Building2, TrendingUp, MapPin } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { formatPrice, formatNumber } from '@/lib/api'

export const dynamic = 'force-dynamic'

// Fetch buildings from API (grouped by building name)
async function getBuildings() {
  try {
    const res = await fetch('https://dxbdata.xyz/api/transactions?limit=1000&sort=instance_date&order=DESC', { 
      next: { revalidate: 3600 } 
    })
    if (!res.ok) return []
    const data = await res.json()
    
    // Group by building name
    const buildingMap = new Map<string, {
      name: string
      area: string
      transactions: number
      totalValue: number
      avgPrice: number
      avgPriceSqm: number
      lastTransaction: string
    }>()
    
    for (const tx of data.data || []) {
      if (!tx.building_name_en) continue
      const key = tx.building_name_en
      const existing = buildingMap.get(key)
      
      if (existing) {
        existing.transactions++
        existing.totalValue += tx.actual_worth || 0
        existing.avgPrice = existing.totalValue / existing.transactions
        if (tx.meter_sale_price) {
          existing.avgPriceSqm = (existing.avgPriceSqm * (existing.transactions - 1) + tx.meter_sale_price) / existing.transactions
        }
      } else {
        buildingMap.set(key, {
          name: tx.building_name_en,
          area: tx.area_name_en || 'Unknown',
          transactions: 1,
          totalValue: tx.actual_worth || 0,
          avgPrice: tx.actual_worth || 0,
          avgPriceSqm: tx.meter_sale_price || 0,
          lastTransaction: tx.instance_date
        })
      }
    }
    
    return Array.from(buildingMap.values())
      .sort((a, b) => b.transactions - a.transactions)
      .slice(0, 100)
  } catch {
    return []
  }
}

export default async function BuildingsPage() {
  const buildings = await getBuildings()

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <section className="border-b border-slate-800 bg-slate-900/50">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <h1 className="text-3xl font-bold text-white">Dubai Buildings</h1>
          <p className="mt-2 text-slate-400">
            Explore transaction data for {buildings.length}+ buildings across Dubai
          </p>

          {/* Search */}
          <div className="mt-6 flex flex-wrap gap-4">
            <div className="relative flex-1 min-w-[250px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <Input
                type="search"
                placeholder="Search buildings..."
                className="pl-10 bg-slate-900 border-slate-700"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Buildings Grid */}
      <section className="mx-auto max-w-7xl px-4 py-8">
        {buildings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-400">Loading buildings...</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {buildings.map((building, idx) => {
              const slug = building.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
              
              return (
                <Link key={idx} href={`/buildings/${encodeURIComponent(slug)}`}>
                  <Card className="h-full border-slate-800 bg-slate-900/50 transition-all hover:border-purple-500/50 hover:bg-slate-900">
                    <CardContent className="p-5">
                      {/* Header */}
                      <div className="flex items-start gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500/10 shrink-0">
                          <Building2 className="h-6 w-6 text-purple-400" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-semibold text-white truncate">{building.name}</h3>
                          <div className="flex items-center gap-1 mt-0.5">
                            <MapPin className="h-3 w-3 text-slate-500" />
                            <p className="text-sm text-slate-500 truncate">{building.area}</p>
                          </div>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="mt-4 grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-slate-500 uppercase tracking-wide">Transactions</p>
                          <p className="mt-1 text-lg font-semibold text-white">
                            {formatNumber(building.transactions)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 uppercase tracking-wide">Avg Price</p>
                          <p className="mt-1 text-lg font-semibold text-emerald-400">
                            {formatPrice(building.avgPrice)}
                          </p>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-800">
                        <Badge variant="outline" className="border-slate-700 text-slate-400">
                          {formatNumber(Math.round(building.avgPriceSqm))} /sqm
                        </Badge>
                        <span className="text-xs text-slate-500">
                          Last: {new Date(building.lastTransaction).toLocaleDateString('en-GB', { 
                            month: 'short', 
                            year: '2-digit' 
                          })}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        )}
      </section>
    </main>
  )
}
