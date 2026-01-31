import { NextResponse } from 'next/server'
import { fetchDLDTransactions } from '@/lib/dld-api'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const area = searchParams.get('area') || ''
  const limit = parseInt(searchParams.get('limit') || '20')
  const offset = parseInt(searchParams.get('offset') || '0')
  const fromDate = searchParams.get('from') || undefined
  const toDate = searchParams.get('to') || undefined
  const transGroup = searchParams.get('type') || undefined // Sales, Mortgage, Gift
  const propertyType = searchParams.get('property') || undefined
  
  const result = await fetchDLDTransactions({
    area,
    limit,
    offset,
    fromDate,
    toDate,
    transGroup,
    propertyType,
  })
  
  return NextResponse.json({
    data: result.data,
    total: result.total,
    page: Math.floor(offset / limit) + 1,
    pageSize: limit,
    totalPages: Math.ceil(result.total / limit),
    source: result.source, // 'api' or 'sample' - shows data source
  })
}
