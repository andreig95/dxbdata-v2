'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface Transaction {
  id: string
  instance_date: string
  building_name_en: string
  property_type_en: string
  property_sub_type_en: string
  actual_worth: number
  meter_sale_price: number
  procedure_area: number
}

interface Props {
  areaName: string
  initialData?: Transaction[]
  initialTotal?: number
}

function formatPrice(price: number): string {
  if (price >= 1000000) return `AED ${(price / 1000000).toFixed(2)}M`
  if (price >= 1000) return `AED ${Math.round(price / 1000)}K`
  return `AED ${price.toLocaleString()}`
}

function formatNumber(num: number): string {
  return num.toLocaleString()
}

export function TransactionsTable({ areaName, initialData = [], initialTotal = 0 }: Props) {
  const [transactions, setTransactions] = useState<Transaction[]>(initialData)
  const [total, setTotal] = useState(initialTotal)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const pageSize = 10
  const totalPages = Math.ceil(total / pageSize)

  useEffect(() => {
    if (page === 1 && initialData.length > 0) {
      return // Use initial data for first page
    }
    
    const fetchTransactions = async () => {
      setLoading(true)
      try {
        const offset = (page - 1) * pageSize
        const res = await fetch(`/api/transactions?area=${encodeURIComponent(areaName)}&limit=${pageSize}&offset=${offset}`)
        const data = await res.json()
        setTransactions(data.data || [])
        setTotal(data.total || 0)
      } catch (e) {
        console.error('Failed to fetch transactions', e)
      } finally {
        setLoading(false)
      }
    }
    
    fetchTransactions()
  }, [page, areaName, initialData])

  return (
    <Card className="border-slate-800 bg-slate-900/50">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-white">Recent Transactions in {areaName}</CardTitle>
        <div className="text-sm text-slate-500">
          {total > 0 && `${formatNumber(total)} total transactions`}
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="py-8 text-center">
            <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent"></div>
            <p className="mt-2 text-slate-500">Loading...</p>
          </div>
        ) : transactions.length === 0 ? (
          <p className="text-slate-500 py-8 text-center">No transactions found</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-800 text-left text-sm text-slate-500">
                    <th className="pb-3 font-medium">Date</th>
                    <th className="pb-3 font-medium">Building</th>
                    <th className="pb-3 font-medium">Type</th>
                    <th className="pb-3 font-medium">Size</th>
                    <th className="pb-3 font-medium text-right">Price</th>
                    <th className="pb-3 font-medium text-right">Per sqft</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx, idx) => (
                    <tr key={tx.id || idx} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                      <td className="py-3 text-sm text-slate-400">
                        {tx.instance_date ? new Date(tx.instance_date).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: 'short',
                          year: '2-digit'
                        }) : '-'}
                      </td>
                      <td className="py-3">
                        <span className="text-sm text-white">{tx.building_name_en || '-'}</span>
                      </td>
                      <td className="py-3">
                        <Badge variant="outline" className="border-slate-700 text-slate-400">
                          {tx.property_sub_type_en || tx.property_type_en || '-'}
                        </Badge>
                      </td>
                      <td className="py-3 text-sm text-slate-400">
                        {tx.procedure_area ? `${formatNumber(Math.round(tx.procedure_area * 10.764))} sqft` : '-'}
                      </td>
                      <td className="py-3 text-right">
                        <span className="text-sm font-medium text-emerald-400">
                          {tx.actual_worth ? formatPrice(tx.actual_worth) : '-'}
                        </span>
                      </td>
                      <td className="py-3 text-right text-sm text-slate-400">
                        {tx.meter_sale_price ? formatNumber(Math.round(tx.meter_sale_price / 10.764)) : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-between border-t border-slate-800 pt-4">
                <div className="text-sm text-slate-500">
                  Page {page} of {totalPages}
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(1)}
                    disabled={page === 1}
                    className="border-slate-700 hover:bg-slate-800 disabled:opacity-30"
                  >
                    <ChevronsLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="border-slate-700 hover:bg-slate-800 disabled:opacity-30"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  
                  {/* Page numbers */}
                  <div className="flex items-center gap-1 mx-2">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum: number
                      if (totalPages <= 5) {
                        pageNum = i + 1
                      } else if (page <= 3) {
                        pageNum = i + 1
                      } else if (page >= totalPages - 2) {
                        pageNum = totalPages - 4 + i
                      } else {
                        pageNum = page - 2 + i
                      }
                      
                      return (
                        <Button
                          key={pageNum}
                          variant={page === pageNum ? "default" : "outline"}
                          size="sm"
                          onClick={() => setPage(pageNum)}
                          className={page === pageNum 
                            ? "bg-cyan-600 hover:bg-cyan-700" 
                            : "border-slate-700 hover:bg-slate-800"
                          }
                        >
                          {pageNum}
                        </Button>
                      )
                    })}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="border-slate-700 hover:bg-slate-800 disabled:opacity-30"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(totalPages)}
                    disabled={page === totalPages}
                    className="border-slate-700 hover:bg-slate-800 disabled:opacity-30"
                  >
                    <ChevronsRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
