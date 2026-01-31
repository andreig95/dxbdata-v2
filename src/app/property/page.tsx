'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Building2, TrendingUp, TrendingDown, Calendar, ArrowRight, Sparkles, ChevronDown, ChevronUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

function formatPrice(price: number): string {
  if (price >= 1000000) return `AED ${(price / 1000000).toFixed(2)}M`
  if (price >= 1000) return `AED ${Math.round(price / 1000)}K`
  return `AED ${price?.toLocaleString() || 0}`
}

function formatNumber(num: number): string {
  return num?.toLocaleString() || '0'
}

function parseDate(dateStr: string): string {
  if (!dateStr) return '-'
  const parts = dateStr.split('-')
  if (parts.length === 3) {
    const [day, month, year] = parts
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return `${day} ${months[parseInt(month) - 1]} ${year}`
  }
  return dateStr
}

export default function PropertyHistoryPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showAll, setShowAll] = useState(false)
  
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    fetch(`/api/property?${params.toString()}`)
      .then(res => res.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <div className="mx-auto max-w-4xl px-4 py-12 text-center">
          <div className="animate-pulse text-slate-400">Loading property history...</div>
        </div>
      </main>
    )
  }

  if (!data || data.error || !data.transactions?.length) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <div className="mx-auto max-w-4xl px-4 py-12">
          <Link href="/buildings" className="inline-flex items-center text-sm text-slate-400 hover:text-white mb-4">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back
          </Link>
          <div className="text-center py-12">
            <Building2 className="h-16 w-16 mx-auto text-slate-700 mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">Property Not Found</h1>
            <p className="text-slate-400">No transaction history found for this property.</p>
          </div>
        </div>
      </main>
    )
  }

  const { property, stats, transactions } = data
  const totalCount = transactions.length
  const hasMore = totalCount > 5
  // transactions are already newest-first from API
  const displayTransactions = showAll ? transactions : transactions.slice(0, 5)

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <section className="border-b border-slate-800 bg-slate-900/50">
        <div className="mx-auto max-w-4xl px-4 py-8">
          <Link href={`/buildings/${encodeURIComponent(property.building)}`} className="inline-flex items-center text-sm text-slate-400 hover:text-white mb-4">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to {property.building}
          </Link>
          
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20">
              <Sparkles className="h-7 w-7 text-purple-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Property Transaction History</h1>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/50">
                  {property.building}
                </Badge>
                {property.rooms && (
                  <Badge variant="outline" className="border-slate-700">
                    {property.rooms}
                  </Badge>
                )}
                {property.type && (
                  <Badge variant="outline" className="border-slate-700">
                    {property.type}
                  </Badge>
                )}
                <Badge variant="outline" className="border-slate-700">
                  {formatNumber(property.size_sqft)} sqft
                </Badge>
              </div>
              {/* Area & Developer Info */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-sm">
                {property.area && (
                  <span className="text-slate-400">
                    <span className="text-slate-500">Area:</span> <span className="text-white">{property.area}</span>
                  </span>
                )}
                {property.master_project && (
                  <span className="text-slate-400">
                    <span className="text-slate-500">Project:</span> <span className="text-white">{property.master_project}</span>
                  </span>
                )}
                {property.developer && (
                  <span className="text-slate-400">
                    <span className="text-slate-500">Developer:</span> <span className="text-cyan-400 font-medium">{property.developer}</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Summary Stats */}
      <section className="mx-auto max-w-4xl px-4 py-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="border-slate-800 bg-slate-900/50">
            <CardContent className="p-5">
              <p className="text-sm text-slate-500">Times Sold</p>
              <p className="mt-1 text-3xl font-bold text-white">{stats.total_sales}</p>
            </CardContent>
          </Card>
          
          <Card className="border-slate-800 bg-slate-900/50">
            <CardContent className="p-5">
              <p className="text-sm text-slate-500">First Sale → Last Sale</p>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-lg font-semibold text-slate-400">{formatPrice(stats.first_sale_price)}</span>
                <ArrowRight className="h-4 w-4 text-slate-600" />
                <span className="text-lg font-semibold text-emerald-400">{formatPrice(stats.last_sale_price)}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-slate-800 bg-slate-900/50">
            <CardContent className="p-5">
              <p className="text-sm text-slate-500">Total Appreciation</p>
              <div className="mt-1 flex items-center gap-2">
                {stats.total_appreciation_pct >= 0 ? (
                  <TrendingUp className="h-6 w-6 text-emerald-400" />
                ) : (
                  <TrendingDown className="h-6 w-6 text-red-400" />
                )}
                <span className={`text-3xl font-bold ${stats.total_appreciation_pct >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {stats.total_appreciation_pct >= 0 ? '+' : ''}{stats.total_appreciation_pct}%
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Transaction Timeline */}
      <section className="mx-auto max-w-4xl px-4 pb-12">
        <Card className="border-slate-800 bg-slate-900/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <Calendar className="h-5 w-5 text-cyan-500" />
              Transaction Timeline
            </CardTitle>
            {hasMore && (
              <span className="text-sm text-slate-500">
                Showing {showAll ? 'all' : 'latest 5'} of {totalCount}
              </span>
            )}
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {displayTransactions.map((tx: any, idx: number) => {
                const isLatest = tx.flip_number === totalCount
                const isFirst = tx.flip_number === 1
                
                return (
                  <div key={idx} className="relative">
                    {/* Timeline line */}
                    {idx < displayTransactions.length - 1 && (
                      <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-slate-800" />
                    )}
                    
                    <div className="flex gap-4">
                      {/* Timeline dot */}
                      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 ${
                        isLatest 
                          ? 'border-purple-500 bg-purple-500/20' 
                          : isFirst 
                            ? 'border-cyan-500 bg-cyan-500/20'
                            : 'border-slate-700 bg-slate-800'
                      }`}>
                        <span className="text-sm font-bold text-white">#{tx.flip_number}</span>
                      </div>
                      
                      {/* Transaction details */}
                      <div className="flex-1 rounded-lg bg-slate-800/50 p-4">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div>
                            <p className="text-sm text-slate-500">{parseDate(tx.instance_date)}</p>
                            <p className="mt-1 text-xl font-bold text-white">{formatPrice(tx.actual_worth)}</p>
                            <p className="text-sm text-slate-500">
                              {formatNumber(Math.round((tx.meter_sale_price || 0) / 10.764))} AED/sqft
                            </p>
                          </div>
                          
                          {tx.gain !== null && (
                            <div className="text-right">
                              <Badge className={`${tx.gain >= 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                                {tx.gain >= 0 ? '+' : ''}{formatPrice(tx.gain)}
                              </Badge>
                              <p className={`mt-1 text-sm font-medium ${tx.gain >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                {tx.gain >= 0 ? '+' : ''}{tx.gain_pct}%
                              </p>
                            </div>
                          )}
                        </div>
                        
                        <div className="mt-3 flex flex-wrap gap-2">
                          <Badge variant="outline" className="border-slate-700 text-xs">
                            {tx.trans_group_en || 'Sale'}
                          </Badge>
                          <Badge variant="outline" className="border-slate-700 text-xs">
                            {tx.reg_type_en || 'Ready'}
                          </Badge>
                          {isLatest && (
                            <Badge className="bg-purple-500/20 text-purple-400 text-xs">
                              Latest Sale
                            </Badge>
                          )}
                          {isFirst && (
                            <Badge className="bg-cyan-500/20 text-cyan-400 text-xs">
                              First Sale
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            
            {/* Show More/Less Button */}
            {hasMore && (
              <div className="mt-6 text-center">
                <Button
                  variant="outline"
                  className="border-slate-700 hover:bg-slate-800"
                  onClick={() => setShowAll(!showAll)}
                >
                  {showAll ? (
                    <>
                      <ChevronUp className="mr-2 h-4 w-4" />
                      Show Less
                    </>
                  ) : (
                    <>
                      <ChevronDown className="mr-2 h-4 w-4" />
                      Show All {totalCount} Transactions
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </main>
  )
}
