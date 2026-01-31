import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, TrendingUp, TrendingDown, Building2, Train, Users, Calendar } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getAreas, getAreaDetail, getTransactions, formatPrice, formatNumber } from '@/lib/api'
import { TransactionsTable } from '@/components/TransactionsTable'

interface PageProps {
  params: Promise<{ slug: string }>
}

// Dynamic page - no static generation
export const dynamic = 'force-dynamic'

export default async function AreaDetailPage({ params }: PageProps) {
  const { slug } = await params
  const areaName = slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
  
  let areaDetail: Awaited<ReturnType<typeof getAreaDetail>> | null = null
  let transactions: Awaited<ReturnType<typeof getTransactions>>['data'] = []
  let areas: Awaited<ReturnType<typeof getAreas>> = []
  let error: string | null = null

  try {
    ;[areaDetail, areas] = await Promise.all([
      getAreaDetail(areaName),
      getAreas(),
    ])
    
    const txResult = await getTransactions({ 
      area: areaName, 
      limit: 10, 
      sort: 'instance_date', 
      order: 'DESC' 
    })
    transactions = txResult.data || []
  } catch (e) {
    error = 'Failed to load area data'
  }

  // Find this area in the list for transaction count
  const thisArea = areas.find(a => a.area_name_en.toLowerCase() === areaName.toLowerCase())
  
  if (!areaDetail && !error) {
    notFound()
  }

  // Mock YoY change
  const yoyChange = 12.5
  
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <section className="border-b border-slate-800 bg-slate-900/50">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <Link href="/areas" className="inline-flex items-center text-sm text-slate-400 hover:text-white mb-4">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Areas
          </Link>
          
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-white">{areaName}</h1>
                <Badge 
                  className={yoyChange >= 0 
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50' 
                    : 'bg-red-500/20 text-red-400 border-red-500/50'
                  }
                >
                  {yoyChange >= 0 ? <TrendingUp className="mr-1 h-3 w-3" /> : <TrendingDown className="mr-1 h-3 w-3" />}
                  {yoyChange >= 0 ? '+' : ''}{yoyChange}% YoY
                </Badge>
              </div>
              <p className="mt-2 text-slate-400">
                {thisArea ? formatNumber(thisArea.transaction_count) : '0'} total transactions
              </p>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" className="border-slate-700 hover:bg-slate-800">
                Set Alert
              </Button>
              <Button className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:opacity-90">
                View All Transactions
              </Button>
            </div>
          </div>
        </div>
      </section>

      {error ? (
        <div className="mx-auto max-w-7xl px-4 py-12 text-center">
          <p className="text-red-400">{error}</p>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <section className="mx-auto max-w-7xl px-4 py-8">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card className="border-slate-800 bg-slate-900/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-500">Total Transactions</p>
                      <p className="mt-1 text-2xl font-bold text-white">
                        {formatNumber(areaDetail?.stats?.total_transactions || thisArea?.transaction_count || 0)}
                      </p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-cyan-500/10">
                      <Calendar className="h-6 w-6 text-cyan-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-800 bg-slate-900/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-500">Average Price</p>
                      <p className="mt-1 text-2xl font-bold text-white">
                        {formatPrice(areaDetail?.stats?.avg_price || thisArea?.avg_price || 0)}
                      </p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-500/10">
                      <TrendingUp className="h-6 w-6 text-emerald-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-800 bg-slate-900/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-500">Price per sqm</p>
                      <p className="mt-1 text-2xl font-bold text-cyan-400">
                        AED {formatNumber(Math.round(areaDetail?.stats?.avg_price_sqm || thisArea?.avg_price_sqm || 0))}
                      </p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500/10">
                      <Building2 className="h-6 w-6 text-purple-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-800 bg-slate-900/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-500">Buildings</p>
                      <p className="mt-1 text-2xl font-bold text-white">
                        {areaDetail?.stats?.buildings || 0}
                      </p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-500/10">
                      <Building2 className="h-6 w-6 text-amber-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Main Content */}
          <section className="mx-auto max-w-7xl px-4 pb-12">
            <Tabs defaultValue="transactions" className="w-full">
              <TabsList className="bg-slate-900 border border-slate-800">
                <TabsTrigger value="transactions">Recent Transactions</TabsTrigger>
                <TabsTrigger value="buildings">Top Buildings</TabsTrigger>
                <TabsTrigger value="developers">Developers</TabsTrigger>
              </TabsList>

              <TabsContent value="transactions" className="mt-6">
                <TransactionsTable 
                  areaName={areaName} 
                  initialData={transactions}
                  initialTotal={areaDetail?.stats?.total_transactions || thisArea?.transaction_count || 500}
                />
              </TabsContent>

              <TabsContent value="buildings" className="mt-6">
                <Card className="border-slate-800 bg-slate-900/50">
                  <CardHeader>
                    <CardTitle className="text-white">Top Buildings in {areaName}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-500 py-8 text-center">Building data coming soon</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="developers" className="mt-6">
                <Card className="border-slate-800 bg-slate-900/50">
                  <CardHeader>
                    <CardTitle className="text-white">Active Developers in {areaName}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {areaDetail?.top_developers && areaDetail.top_developers.length > 0 ? (
                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {areaDetail.top_developers.slice(0, 6).map((dev, idx) => (
                          <div 
                            key={dev.developer || idx}
                            className="flex items-center gap-3 rounded-lg bg-slate-800/50 p-4"
                          >
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/20">
                              <Users className="h-5 w-5 text-purple-400" />
                            </div>
                            <div>
                              <p className="font-medium text-white">{dev.developer || 'Unknown'}</p>
                              <p className="text-sm text-slate-500">{dev.count || 0} projects</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-500 py-8 text-center">No developer data available</p>
                    )}
                  </CardContent>
                </Card>

                {/* Nearby Metros */}
                {areaDetail?.nearby?.metros && areaDetail.nearby.metros.length > 0 && (
                  <Card className="mt-6 border-slate-800 bg-slate-900/50">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Train className="h-5 w-5 text-cyan-500" />
                        Nearby Metro Stations
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {areaDetail.nearby.metros.map((m, idx) => (
                          <Badge key={idx} variant="outline" className="border-cyan-500/50 text-cyan-400">
                            {m.metro}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </section>
        </>
      )}
    </main>
  )
}
