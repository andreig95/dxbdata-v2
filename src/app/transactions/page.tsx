'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { 
  Search, ChevronLeft, ChevronRight, 
  ChevronsLeft, ChevronsRight, X, Building2, MapPin, SlidersHorizontal
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

// Filter options
const REGISTRATION_TYPES = [
  { value: '', label: 'All' },
  { value: 'Ready', label: 'Ready' },
  { value: 'Off-plan', label: 'Off-plan' },
]

const PROPERTY_USAGE = [
  { value: '', label: 'All' },
  { value: 'Residential', label: 'Residential' },
  { value: 'Commercial', label: 'Commercial' },
]

const RESIDENTIAL_TYPES = [
  { value: 'Apartment', label: 'Apartment' },
  { value: 'Villa', label: 'Villa' },
  { value: 'Townhouse', label: 'Townhouse' },
  { value: 'Penthouse', label: 'Penthouse' },
  { value: 'Hotel Apartment', label: 'Hotel Apartment' },
  { value: 'Land', label: 'Land' },
  { value: 'Building', label: 'Building' },
]

const COMMERCIAL_TYPES = [
  { value: 'Office', label: 'Office' },
  { value: 'Shop', label: 'Shop' },
  { value: 'Warehouse', label: 'Warehouse' },
  { value: 'Villa', label: 'Villa' },
  { value: 'Labour Camp', label: 'Labour Camp' },
  { value: 'Building', label: 'Building' },
  { value: 'Factory', label: 'Factory' },
  { value: 'Mixed Use Land', label: 'Mixed Use Land' },
  { value: 'Industrial Land', label: 'Industrial Land' },
  { value: 'Showroom', label: 'Showroom' },
  { value: 'Other Commercial', label: 'Other Commercial' },
]

interface Transaction {
  transaction_id: string
  instance_date: string
  area_name_en: string
  building_name_en: string
  project_name_en: string
  property_type_en: string
  property_sub_type_en: string
  property_usage_en: string
  reg_type_en: string
  rooms_en: string
  area_sqft: number
  actual_worth: number
  price_per_sqft: number
  trans_group_en: string
}

interface Filters {
  search: string
  regType: string
  usage: string
  propertyType: string
  minSize: string
  maxSize: string
  minPrice: string
  maxPrice: string
  developer: string
}

function formatPrice(price: number): string {
  if (price >= 1000000) return `AED ${(price / 1000000).toFixed(2)}M`
  if (price >= 1000) return `AED ${Math.round(price / 1000)}K`
  return `AED ${price.toLocaleString()}`
}

function formatNumber(num: number): string {
  return num.toLocaleString()
}

// Loading fallback component
function TransactionsLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent"></div>
        <p className="mt-3 text-slate-500">Loading transactions...</p>
      </div>
    </div>
  )
}

// Main content component that uses useSearchParams
function TransactionsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [searchSuggestions, setSearchSuggestions] = useState<Array<{name: string, type: string, count: number}>>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  
  const [filters, setFilters] = useState<Filters>({
    search: searchParams.get('q') || '',
    regType: searchParams.get('reg') || '',
    usage: searchParams.get('usage') || '',
    propertyType: searchParams.get('type') || '',
    minSize: searchParams.get('minSize') || '',
    maxSize: searchParams.get('maxSize') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    developer: searchParams.get('developer') || '',
  })
  
  const pageSize = 20
  const totalPages = Math.ceil(total / pageSize)

  // Fetch transactions
  const fetchTransactions = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.set('limit', String(pageSize))
      params.set('offset', String((page - 1) * pageSize))
      
      if (filters.search) params.set('search', filters.search)
      if (filters.regType) params.set('regType', filters.regType)
      if (filters.usage) params.set('usage', filters.usage)
      if (filters.propertyType) params.set('propertyType', filters.propertyType)
      if (filters.minSize) params.set('minSize', filters.minSize)
      if (filters.maxSize) params.set('maxSize', filters.maxSize)
      if (filters.minPrice) params.set('minPrice', filters.minPrice)
      if (filters.maxPrice) params.set('maxPrice', filters.maxPrice)
      if (filters.developer) params.set('developer', filters.developer)
      
      const res = await fetch(`/api/transactions/search?${params.toString()}`)
      const data = await res.json()
      setTransactions(data.data || [])
      setTotal(data.total || 0)
    } catch (e) {
      console.error('Failed to fetch transactions', e)
    } finally {
      setLoading(false)
    }
  }, [page, filters])

  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

  // Search suggestions
  const fetchSuggestions = async (query: string) => {
    if (query.length < 2) {
      setSearchSuggestions([])
      return
    }
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=8`)
      const data = await res.json()
      setSearchSuggestions(data.results || [])
    } catch (e) {
      console.error('Failed to fetch suggestions', e)
    }
  }

  const handleSearchChange = (value: string) => {
    setFilters(f => ({ ...f, search: value }))
    fetchSuggestions(value)
    setShowSuggestions(true)
  }

  const handleSuggestionClick = (suggestion: { name: string, type: string }) => {
    setFilters(f => ({ ...f, search: suggestion.name }))
    setShowSuggestions(false)
    setPage(1)
  }

  const handleSearch = () => {
    setPage(1)
    setShowSuggestions(false)
    fetchTransactions()
  }

  const handleFilterChange = (key: keyof Filters, value: string) => {
    setFilters(f => ({ ...f, [key]: value }))
  }

  const applyFilters = () => {
    setPage(1)
    setShowFilters(false)
    fetchTransactions()
  }

  const clearFilters = () => {
    setFilters({
      search: '',
      regType: '',
      usage: '',
      propertyType: '',
      minSize: '',
      maxSize: '',
      minPrice: '',
      maxPrice: '',
      developer: '',
    })
    setPage(1)
  }

  const activeFiltersCount = [
    filters.regType, filters.usage, filters.propertyType,
    filters.minSize, filters.maxSize, filters.minPrice, filters.maxPrice, filters.developer
  ].filter(Boolean).length

  const propertyTypes = filters.usage === 'Commercial' ? COMMERCIAL_TYPES : RESIDENTIAL_TYPES

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-sm sticky top-0 z-20">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => router.push('/')}
              className="text-slate-400 hover:text-white"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            <div>
              <h1 className="text-xl font-bold text-white">Explore Transactions</h1>
              <p className="text-sm text-slate-500">Search and filter Dubai real estate transactions</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6">
        {/* Search Bar */}
        <div className="relative mb-6">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
              <Input
                type="text"
                placeholder="Search by area, building, or project name..."
                value={filters.search}
                onChange={(e) => handleSearchChange(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                onFocus={() => filters.search.length >= 2 && setShowSuggestions(true)}
                className="pl-10 h-12 bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-cyan-500"
              />
              
              {/* Search Suggestions Dropdown */}
              {showSuggestions && searchSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-slate-900 border border-slate-700 rounded-lg shadow-xl z-30 max-h-80 overflow-y-auto">
                  {searchSuggestions.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => handleSuggestionClick(s)}
                      className="w-full px-4 py-3 flex items-center gap-3 hover:bg-slate-800 text-left border-b border-slate-800 last:border-0"
                    >
                      {s.type === 'area' ? (
                        <MapPin className="h-4 w-4 text-cyan-500 flex-shrink-0" />
                      ) : (
                        <Building2 className="h-4 w-4 text-purple-500 flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="text-white truncate">{s.name}</div>
                        <div className="text-xs text-slate-500">{s.type} • {formatNumber(s.count)} transactions</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <Button 
              onClick={handleSearch}
              className="h-12 px-6 bg-gradient-to-r from-cyan-500 to-purple-600 hover:opacity-90"
            >
              Search
            </Button>
            
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className={`h-12 px-4 border-slate-700 hover:bg-slate-800 ${showFilters ? 'bg-slate-800' : ''}`}
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
              {activeFiltersCount > 0 && (
                <Badge className="ml-2 bg-cyan-500 text-white">{activeFiltersCount}</Badge>
              )}
            </Button>
          </div>

          {/* Click outside to close suggestions */}
          {showSuggestions && (
            <div 
              className="fixed inset-0 z-20" 
              onClick={() => setShowSuggestions(false)}
            />
          )}
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <Card className="mb-6 border-slate-800 bg-slate-900/50">
            <CardContent className="p-6">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {/* Registration Type */}
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Property Status</label>
                  <select
                    value={filters.regType}
                    onChange={(e) => handleFilterChange('regType', e.target.value)}
                    className="w-full h-10 px-3 rounded-md bg-slate-800 border border-slate-700 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                  >
                    {REGISTRATION_TYPES.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                {/* Property Usage */}
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Category</label>
                  <select
                    value={filters.usage}
                    onChange={(e) => {
                      handleFilterChange('usage', e.target.value)
                      handleFilterChange('propertyType', '') // Reset property type when usage changes
                    }}
                    className="w-full h-10 px-3 rounded-md bg-slate-800 border border-slate-700 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                  >
                    {PROPERTY_USAGE.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                {/* Property Type */}
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Property Type</label>
                  <select
                    value={filters.propertyType}
                    onChange={(e) => handleFilterChange('propertyType', e.target.value)}
                    className="w-full h-10 px-3 rounded-md bg-slate-800 border border-slate-700 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                  >
                    <option value="">All Types</option>
                    {propertyTypes.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                {/* Developer */}
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Developer / Keyword</label>
                  <Input
                    type="text"
                    placeholder="e.g. Emaar, DAMAC..."
                    value={filters.developer}
                    onChange={(e) => handleFilterChange('developer', e.target.value)}
                    className="h-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                  />
                </div>

                {/* Size Range */}
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Size (sqft)</label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={filters.minSize}
                      onChange={(e) => handleFilterChange('minSize', e.target.value)}
                      className="h-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                    />
                    <Input
                      type="number"
                      placeholder="Max"
                      value={filters.maxSize}
                      onChange={(e) => handleFilterChange('maxSize', e.target.value)}
                      className="h-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                    />
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Price (AED)</label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={filters.minPrice}
                      onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                      className="h-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                    />
                    <Input
                      type="number"
                      placeholder="Max"
                      value={filters.maxPrice}
                      onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                      className="h-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                    />
                  </div>
                </div>
              </div>

              {/* Filter Actions */}
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-800">
                <Button
                  variant="ghost"
                  onClick={clearFilters}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear All
                </Button>
                <Button
                  onClick={applyFilters}
                  className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:opacity-90"
                >
                  Apply Filters
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Active Filters Tags */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {filters.regType && (
              <Badge variant="outline" className="border-cyan-500/50 text-cyan-400 pr-1">
                {filters.regType}
                <button onClick={() => handleFilterChange('regType', '')} className="ml-2 hover:text-white">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {filters.usage && (
              <Badge variant="outline" className="border-purple-500/50 text-purple-400 pr-1">
                {filters.usage}
                <button onClick={() => handleFilterChange('usage', '')} className="ml-2 hover:text-white">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {filters.propertyType && (
              <Badge variant="outline" className="border-emerald-500/50 text-emerald-400 pr-1">
                {filters.propertyType}
                <button onClick={() => handleFilterChange('propertyType', '')} className="ml-2 hover:text-white">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {filters.developer && (
              <Badge variant="outline" className="border-amber-500/50 text-amber-400 pr-1">
                Developer: {filters.developer}
                <button onClick={() => handleFilterChange('developer', '')} className="ml-2 hover:text-white">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {(filters.minPrice || filters.maxPrice) && (
              <Badge variant="outline" className="border-slate-500/50 text-slate-400 pr-1">
                Price: {filters.minPrice ? `${formatPrice(Number(filters.minPrice))}` : 'Any'} - {filters.maxPrice ? formatPrice(Number(filters.maxPrice)) : 'Any'}
                <button onClick={() => { handleFilterChange('minPrice', ''); handleFilterChange('maxPrice', ''); }} className="ml-2 hover:text-white">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {(filters.minSize || filters.maxSize) && (
              <Badge variant="outline" className="border-slate-500/50 text-slate-400 pr-1">
                Size: {filters.minSize || 'Any'} - {filters.maxSize || 'Any'} sqft
                <button onClick={() => { handleFilterChange('minSize', ''); handleFilterChange('maxSize', ''); }} className="ml-2 hover:text-white">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
          </div>
        )}

        {/* Results Summary */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-slate-500">
            {loading ? 'Loading...' : `${formatNumber(total)} transactions found`}
          </div>
        </div>

        {/* Transactions Table */}
        <Card className="border-slate-800 bg-slate-900/50">
          <CardContent className="p-0">
            {loading ? (
              <div className="py-16 text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent"></div>
                <p className="mt-3 text-slate-500">Loading transactions...</p>
              </div>
            ) : transactions.length === 0 ? (
              <div className="py-16 text-center">
                <Building2 className="h-12 w-12 mx-auto text-slate-700 mb-3" />
                <p className="text-slate-500">No transactions found</p>
                <p className="text-sm text-slate-600 mt-1">Try adjusting your search or filters</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-800 text-left text-sm text-slate-500 bg-slate-900/50">
                        <th className="px-4 py-3 font-medium">Date</th>
                        <th className="px-4 py-3 font-medium">Location</th>
                        <th className="px-4 py-3 font-medium">Type</th>
                        <th className="px-4 py-3 font-medium">Status</th>
                        <th className="px-4 py-3 font-medium">Size</th>
                        <th className="px-4 py-3 font-medium text-right">Price</th>
                        <th className="px-4 py-3 font-medium text-right">Price/sqft</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((tx, idx) => (
                        <tr 
                          key={tx.transaction_id || idx} 
                          className="border-b border-slate-800/50 hover:bg-slate-800/30 cursor-pointer transition-colors"
                        >
                          <td className="px-4 py-3 text-sm text-slate-400">
                            {tx.instance_date ? new Date(tx.instance_date).toLocaleDateString('en-GB', {
                              day: '2-digit',
                              month: 'short',
                              year: '2-digit'
                            }) : '-'}
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-sm text-white font-medium">{tx.building_name_en || tx.project_name_en || '-'}</div>
                            <div className="text-xs text-slate-500">{tx.area_name_en || '-'}</div>
                          </td>
                          <td className="px-4 py-3">
                            <Badge variant="outline" className="border-slate-700 text-slate-400 text-xs">
                              {tx.property_sub_type_en || tx.property_type_en || '-'}
                            </Badge>
                            {tx.rooms_en && tx.rooms_en !== '-' && (
                              <span className="ml-2 text-xs text-slate-500">{tx.rooms_en}</span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <Badge 
                              variant="outline" 
                              className={tx.reg_type_en === 'Off-plan' 
                                ? 'border-amber-500/50 text-amber-400 text-xs' 
                                : 'border-emerald-500/50 text-emerald-400 text-xs'
                              }
                            >
                              {tx.reg_type_en || '-'}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-400">
                            {tx.area_sqft ? `${formatNumber(Math.round(tx.area_sqft))} sqft` : '-'}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <span className="text-sm font-semibold text-emerald-400">
                              {tx.actual_worth ? formatPrice(tx.actual_worth) : '-'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right text-sm text-slate-400">
                            {tx.price_per_sqft ? `${formatNumber(Math.round(tx.price_per_sqft))}` : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between border-t border-slate-800 px-4 py-4">
                    <div className="text-sm text-slate-500">
                      Page {page} of {formatNumber(totalPages)} ({formatNumber(total)} results)
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
      </div>
    </div>
  )
}

// Main page component wrapped in Suspense
export default function TransactionsPage() {
  return (
    <Suspense fallback={<TransactionsLoading />}>
      <TransactionsContent />
    </Suspense>
  )
}
