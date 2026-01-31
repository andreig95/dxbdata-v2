import Link from 'next/link'
import { Search, TrendingUp, TrendingDown, ArrowUpDown } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { getAreas, formatPrice, formatNumber } from '@/lib/api'

// Generate random YoY change for demo (will be replaced with real data)
function getYoYChange(areaName: string): number {
  const seed = areaName.split('').reduce((a, b) => a + b.charCodeAt(0), 0)
  return Math.round((((seed % 40) - 10) + Math.random() * 5) * 10) / 10
}

export const dynamic = 'force-dynamic'

export default async function AreasPage() {
  let areas: Awaited<ReturnType<typeof getAreas>> = []
  let error: string | null = null

  try {
    areas = await getAreas()
  } catch (e) {
    error = 'Failed to load areas. Please try again later.'
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <section className="border-b border-slate-800 bg-slate-900/50">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <h1 className="text-3xl font-bold text-white">Dubai Areas</h1>
          <p className="mt-2 text-slate-400">
            Explore {areas.length} neighborhoods with transaction data and market insights
          </p>

          {/* Search & Filters */}
          <div className="mt-6 flex flex-wrap gap-4">
            <div className="relative flex-1 min-w-[250px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <Input
                type="search"
                placeholder="Search areas..."
                className="pl-10 bg-slate-900 border-slate-700"
              />
            </div>
            <div className="flex gap-2">
              <Badge variant="outline" className="cursor-pointer border-slate-700 hover:bg-slate-800 px-4 py-2">
                <ArrowUpDown className="mr-1 h-3 w-3" /> By Transactions
              </Badge>
              <Badge variant="outline" className="cursor-pointer border-slate-700 hover:bg-slate-800 px-4 py-2">
                <TrendingUp className="mr-1 h-3 w-3" /> By Growth
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Areas Grid */}
      <section className="mx-auto max-w-7xl px-4 py-8">
        {error ? (
          <div className="text-center py-12">
            <p className="text-red-400">{error}</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {areas.map((area) => {
              const yoyChange = getYoYChange(area.area_name_en)
              const slug = area.area_name_en.toLowerCase().replace(/ /g, '-')
              
              return (
                <Link key={area.area_name_en} href={`/areas/${encodeURIComponent(slug)}`}>
                  <Card className="h-full border-slate-800 bg-slate-900/50 transition-all hover:border-cyan-500/50 hover:bg-slate-900 hover:shadow-lg hover:shadow-cyan-500/5">
                    <CardContent className="p-5">
                      {/* Header */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h3 className="font-semibold text-white truncate">{area.area_name_en}</h3>
                          <p className="mt-0.5 text-sm text-slate-500">
                            {formatNumber(area.transaction_count)} transactions
                          </p>
                        </div>
                        <Badge 
                          variant="outline"
                          className={`shrink-0 ${
                            yoyChange >= 0 
                              ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400' 
                              : 'border-red-500/50 bg-red-500/10 text-red-400'
                          }`}
                        >
                          {yoyChange >= 0 ? (
                            <TrendingUp className="mr-1 h-3 w-3" />
                          ) : (
                            <TrendingDown className="mr-1 h-3 w-3" />
                          )}
                          {yoyChange >= 0 ? '+' : ''}{yoyChange}%
                        </Badge>
                      </div>

                      {/* Stats */}
                      <div className="mt-4 grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-slate-500 uppercase tracking-wide">Avg Price</p>
                          <p className="mt-1 text-lg font-semibold text-white">
                            {formatPrice(area.avg_price || 0)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 uppercase tracking-wide">Per sqm</p>
                          <p className="mt-1 text-lg font-semibold text-cyan-400">
                            {formatNumber(Math.round(area.avg_price_sqm || 0))}
                          </p>
                        </div>
                      </div>

                      {/* Mini chart placeholder */}
                      <div className="mt-4 flex items-end gap-0.5 h-8">
                        {[...Array(12)].map((_, i) => {
                          const height = 30 + Math.random() * 70
                          return (
                            <div
                              key={i}
                              className="flex-1 rounded-sm bg-slate-700"
                              style={{ height: `${height}%` }}
                            />
                          )
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        )}

        {/* Load More */}
        {areas.length > 0 && (
          <div className="mt-8 text-center">
            <p className="text-sm text-slate-500">
              Showing {areas.length} areas
            </p>
          </div>
        )}
      </section>
    </main>
  )
}
