import { NextResponse } from 'next/server'
import { queryTransactions } from '@/lib/dld-sqlite'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const area = searchParams.get('area') || undefined
  const limit = parseInt(searchParams.get('limit') || '20')
  const offset = parseInt(searchParams.get('offset') || '0')
  const fromDate = searchParams.get('from') || undefined
  const toDate = searchParams.get('to') || undefined
  const transGroup = searchParams.get('type') || undefined // Sales, Mortgage, Gift
  const propertyType = searchParams.get('property') || undefined
  
  const result = queryTransactions({
    area,
    limit,
    offset,
    fromDate,
    toDate,
    transGroup,
    propertyType,
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
