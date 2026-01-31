import { NextResponse } from 'next/server'
import { queryTransactions } from '@/lib/dld-sqlite'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  
  // Parse all filter parameters
  const search = searchParams.get('search') || undefined
  const regType = searchParams.get('regType') || undefined
  const usage = searchParams.get('usage') || undefined
  const propertyType = searchParams.get('propertyType') || undefined
  const minSize = searchParams.get('minSize') ? Number(searchParams.get('minSize')) : undefined
  const maxSize = searchParams.get('maxSize') ? Number(searchParams.get('maxSize')) : undefined
  const minPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined
  const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined
  const developer = searchParams.get('developer') || undefined
  const limit = parseInt(searchParams.get('limit') || '20')
  const offset = parseInt(searchParams.get('offset') || '0')
  
  const result = queryTransactions({
    search,
    regType,
    propertyUsage: usage,
    propertySubType: propertyType,
    minSize,
    maxSize,
    minPrice,
    maxPrice,
    developer,
    transGroup: 'Sales', // Default to sales transactions
    limit,
    offset,
    sortBy: 'instance_date',
    sortOrder: 'DESC',
  })
  
  return NextResponse.json({
    data: result.data,
    total: result.total,
    page: Math.floor(offset / limit) + 1,
    pageSize: limit,
    totalPages: Math.ceil(result.total / limit),
    source: result.source,
  })
}
