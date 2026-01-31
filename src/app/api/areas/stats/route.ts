import { NextResponse } from 'next/server'
import { fetchAreaStats } from '@/lib/dld-api'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const area = searchParams.get('area') || 'Dubai Marina'
  
  const stats = await fetchAreaStats(area)
  
  return NextResponse.json({
    area,
    ...stats,
  })
}
