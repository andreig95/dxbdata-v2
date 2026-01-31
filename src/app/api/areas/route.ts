import { NextResponse } from 'next/server'

// Mock area data
const areas = [
  { area_name_en: 'Dubai Marina', transaction_count: 3240, avg_price: 1900000, avg_price_sqm: 18500 },
  { area_name_en: 'Downtown Dubai', transaction_count: 2890, avg_price: 2500000, avg_price_sqm: 22000 },
  { area_name_en: 'Palm Jumeirah', transaction_count: 1560, avg_price: 4200000, avg_price_sqm: 28000 },
  { area_name_en: 'Business Bay', transaction_count: 2100, avg_price: 1400000, avg_price_sqm: 16000 },
  { area_name_en: 'Jumeirah Village Circle', transaction_count: 4500, avg_price: 800000, avg_price_sqm: 10500 },
  { area_name_en: 'Dubai Hills', transaction_count: 1890, avg_price: 2100000, avg_price_sqm: 15000 },
  { area_name_en: 'Jumeirah Lake Towers', transaction_count: 1780, avg_price: 1100000, avg_price_sqm: 12000 },
  { area_name_en: 'Dubai Creek Harbour', transaction_count: 980, avg_price: 1800000, avg_price_sqm: 19500 },
  { area_name_en: 'Mohammed Bin Rashid City', transaction_count: 1450, avg_price: 3500000, avg_price_sqm: 17500 },
  { area_name_en: 'Arabian Ranches', transaction_count: 890, avg_price: 4800000, avg_price_sqm: 12500 },
  { area_name_en: 'Jumeirah Beach Residence', transaction_count: 1650, avg_price: 2300000, avg_price_sqm: 20000 },
  { area_name_en: 'Dubai Silicon Oasis', transaction_count: 1200, avg_price: 650000, avg_price_sqm: 8500 },
  { area_name_en: 'Al Barsha', transaction_count: 780, avg_price: 1200000, avg_price_sqm: 11000 },
  { area_name_en: 'DIFC', transaction_count: 450, avg_price: 3800000, avg_price_sqm: 32000 },
  { area_name_en: 'Emaar Beachfront', transaction_count: 680, avg_price: 3200000, avg_price_sqm: 26000 },
]

export async function GET() {
  return NextResponse.json(areas)
}
