import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    total_transactions: 142847,
    total_value: 389500000000,
    avg_price_sqm: 14250
  })
}
