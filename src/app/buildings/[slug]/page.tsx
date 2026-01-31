import Link from 'next/link'
import { ArrowLeft, Building2, TrendingUp, Calendar, Ruler, MapPin } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatPrice, formatNumber } from '@/lib/api'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ slug: string }>
}

async function getBuildingData(buildingSlug: string) {
  try {
    // Fetch transactions and find matching building
    const res = await fetch('https://dxbdata.xyz/api/transactions?limit=500&sort=instance_date&order=DESC', {
      next: { revalidate: 60 }
    })
    if (!res.ok) return null
    const data = await res.json()
    
    // Find transactions for this building
    const transactions = (data.data || []).filter((tx: any) => {
      const txSlug = (tx.building_name_en || '').toLowerCase().replace(/[^a-z0-9]+/g, '-')
      return txSlug === buildingSlug || txSlug.includes(buildingSlug) || buildingSlug.includes(txSlug)
    })
    
    if (transactions.length === 0) return null
    
    const buildingName = transactions[0].building_name_en
    const area = transactions[0].area_name_en
    const developer = transactions[0].master_project_en || 'Unknown'
    
    // Calculate stats
    const totalValue = transactions.reduce((sum: number, tx: any) => sum + (tx.actual_worth || 0), 0)
    const avgPrice = totalValue / transactions.length
    const avgPriceSqm = transactions.reduce((sum: number, tx: any) => sum + (tx.meter_sale_price || 0), 0) / transactions.length
    const avgSize = transactions.reduce((sum: number, tx: any) => sum + (tx.procedure_area || 0), 0) / transactions.length
    
    // Unit type breakdown
    const unitTypes: Record<string, number> = {}
    transactions.forEach((tx: any) => {
      const type = tx.property_sub_type_en || tx.rooms_en || 'Other'
      unitTypes[type] = (unitTypes[type] || 0) + 1
    })
    
    return {
      name: buildingName,
      area,
      developer,
      transactions,
      stats: {
        totalTransactions: transactions.length,
        avgPrice,
        avgPriceSqm,
        avgSize,
        minPrice: Math.min(...transactions.map((tx: any) => tx.actual_worth || Infinity)),
        maxPrice: Math.max(...transactions.map((tx: any) => tx.actual_worth || 0)),
      },
      unitTypes: Object.entries(unitTypes)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6)
    }
  } catch {
    return null
  }
}

export default async function BuildingDetailPage({ params }: PageProps) {
  const { slug } = await params
  const building = await getBuildingData(slug)

  if (!building) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <Link href="/buildings" className="inline-flex items-center text-sm text-slate-400 hover:text-white mb-4">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Buildings
          </Link>
          <div className="text-center py-12">
            <Building2 className="h-16 w-16 mx-auto text-slate-700 mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">Building Not Found</h1>
            <p className="text-slate-400">No transaction data found for this building.</p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <section className="border-b border-slate-800 bg-slate-900/50">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <Link href="/buildings" className="inline-flex items-center text-sm text-slate-400 hover:text-white mb-4">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Buildings
          </Link>
          
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-purple-500/10">
                <Building2 className="h-8 w-8 text-purple-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">{building.name}</h1>
                <div className="flex items-center gap-3 mt-2">
                  <Badge variant="outline" className="border-slate-700">
                    <MapPin className="mr-1 h-3 w-3" />
                    {building.area}
                  </Badge>
                  <span className="text-sm text-slate-500">by {building.developer}</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" className="border-slate-700 hover:bg-slate-800">
                Set Price Alert
              </Button>
              <Button className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:opacity-90">
                Compare
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-slate-800 bg-slate-900/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Transactions</p>
                  <p className="mt-1 text-2xl font-bold text-white">
                    {formatNumber(building.stats.totalTransactions)}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-cyan-500/50" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-800 bg-slate-900/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Avg Price</p>
                  <p className="mt-1 text-2xl font-bold text-emerald-400">
                    {formatPrice(building.stats.avgPrice)}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-emerald-500/50" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-800 bg-slate-900/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Avg per sqm</p>
                  <p className="mt-1 text-2xl font-bold text-cyan-400">
                    AED {formatNumber(Math.round(building.stats.avgPriceSqm))}
                  </p>
                </div>
                <Ruler className="h-8 w-8 text-purple-500/50" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-800 bg-slate-900/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Avg Size</p>
                  <p className="mt-1 text-2xl font-bold text-white">
                    {formatNumber(Math.round(building.stats.avgSize))} sqm
                  </p>
                </div>
                <Building2 className="h-8 w-8 text-slate-500/50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Price Range */}
        <Card className="mt-6 border-slate-800 bg-slate-900/50">
          <CardContent className="p-6">
            <h3 className="text-sm text-slate-500 mb-3">Price Range</h3>
            <div className="flex items-center gap-4">
              <div>
                <p className="text-xs text-slate-500">Min</p>
                <p className="text-lg font-semibold text-white">{formatPrice(building.stats.minPrice)}</p>
              </div>
              <div className="flex-1 h-2 bg-slate-800 rounded-full relative">
                <div className="absolute inset-y-0 left-0 right-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full" />
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500">Max</p>
                <p className="text-lg font-semibold text-white">{formatPrice(building.stats.maxPrice)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Unit Types */}
        {building.unitTypes.length > 0 && (
          <Card className="mt-6 border-slate-800 bg-slate-900/50">
            <CardHeader>
              <CardTitle className="text-white">Unit Types</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {building.unitTypes.map(([type, count]) => (
                  <Badge key={type} variant="outline" className="border-slate-700 px-3 py-1">
                    {type}: <span className="ml-1 text-cyan-400">{count}</span>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Transactions */}
        <Card className="mt-6 border-slate-800 bg-slate-900/50">
          <CardHeader>
            <CardTitle className="text-white">Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-800 text-left text-sm text-slate-500">
                    <th className="pb-3 font-medium">Date</th>
                    <th className="pb-3 font-medium">Type</th>
                    <th className="pb-3 font-medium">Size</th>
                    <th className="pb-3 font-medium text-right">Price</th>
                    <th className="pb-3 font-medium text-right">Per sqm</th>
                  </tr>
                </thead>
                <tbody>
                  {building.transactions.slice(0, 15).map((tx: any, idx: number) => (
                    <tr key={idx} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                      <td className="py-3 text-sm text-slate-400">
                        {tx.instance_date ? new Date(tx.instance_date).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: 'short',
                          year: '2-digit'
                        }) : '-'}
                      </td>
                      <td className="py-3">
                        <Badge variant="outline" className="border-slate-700 text-slate-400">
                          {tx.property_sub_type_en || tx.rooms_en || '-'}
                        </Badge>
                      </td>
                      <td className="py-3 text-sm text-slate-400">
                        {tx.procedure_area ? `${formatNumber(Math.round(tx.procedure_area))} sqm` : '-'}
                      </td>
                      <td className="py-3 text-right">
                        <span className="text-sm font-medium text-emerald-400">
                          {tx.actual_worth ? formatPrice(tx.actual_worth) : '-'}
                        </span>
                      </td>
                      <td className="py-3 text-right text-sm text-slate-400">
                        {tx.meter_sale_price ? formatNumber(Math.round(tx.meter_sale_price)) : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  )
}
