import { NextResponse } from 'next/server'

// Mock data for search
const areas = [
  { name: 'Dubai Marina', slug: 'dubai-marina', type: 'area', transactions: 3240 },
  { name: 'Downtown Dubai', slug: 'downtown-dubai', type: 'area', transactions: 2890 },
  { name: 'Palm Jumeirah', slug: 'palm-jumeirah', type: 'area', transactions: 1560 },
  { name: 'Business Bay', slug: 'business-bay', type: 'area', transactions: 2100 },
  { name: 'Jumeirah Village Circle', slug: 'jumeirah-village-circle', type: 'area', transactions: 4500 },
  { name: 'Dubai Hills', slug: 'dubai-hills', type: 'area', transactions: 1890 },
  { name: 'Jumeirah Lake Towers', slug: 'jumeirah-lake-towers', type: 'area', transactions: 1780 },
  { name: 'Dubai Creek Harbour', slug: 'dubai-creek-harbour', type: 'area', transactions: 980 },
  { name: 'Mohammed Bin Rashid City', slug: 'mohammed-bin-rashid-city', type: 'area', transactions: 1450 },
  { name: 'Arabian Ranches', slug: 'arabian-ranches', type: 'area', transactions: 890 },
  { name: 'Jumeirah Beach Residence', slug: 'jumeirah-beach-residence', type: 'area', transactions: 1650 },
  { name: 'Dubai Silicon Oasis', slug: 'dubai-silicon-oasis', type: 'area', transactions: 1200 },
  { name: 'Al Barsha', slug: 'al-barsha', type: 'area', transactions: 780 },
  { name: 'DIFC', slug: 'difc', type: 'area', transactions: 450 },
  { name: 'Emaar Beachfront', slug: 'emaar-beachfront', type: 'area', transactions: 680 },
  { name: 'City Walk', slug: 'city-walk', type: 'area', transactions: 320 },
  { name: 'Dubai Sports City', slug: 'dubai-sports-city', type: 'area', transactions: 950 },
  { name: 'Motor City', slug: 'motor-city', type: 'area', transactions: 720 },
  { name: 'Discovery Gardens', slug: 'discovery-gardens', type: 'area', transactions: 680 },
  { name: 'International City', slug: 'international-city', type: 'area', transactions: 2100 },
]

const buildings = [
  { name: 'Burj Khalifa', slug: 'burj-khalifa', type: 'building', area: 'Downtown Dubai' },
  { name: 'Marina Gate', slug: 'marina-gate', type: 'building', area: 'Dubai Marina' },
  { name: 'Cayan Tower', slug: 'cayan-tower', type: 'building', area: 'Dubai Marina' },
  { name: 'Princess Tower', slug: 'princess-tower', type: 'building', area: 'Dubai Marina' },
  { name: 'The Address Downtown', slug: 'the-address-downtown', type: 'building', area: 'Downtown Dubai' },
  { name: 'Damac Heights', slug: 'damac-heights', type: 'building', area: 'Dubai Marina' },
  { name: 'Index Tower', slug: 'index-tower', type: 'building', area: 'DIFC' },
  { name: 'Park Heights', slug: 'park-heights', type: 'building', area: 'Dubai Hills' },
  { name: 'Creek Rise', slug: 'creek-rise', type: 'building', area: 'Dubai Creek Harbour' },
  { name: 'Boulevard Point', slug: 'boulevard-point', type: 'building', area: 'Downtown Dubai' },
  { name: 'Forte', slug: 'forte', type: 'building', area: 'Downtown Dubai' },
  { name: 'Opera Grand', slug: 'opera-grand', type: 'building', area: 'Downtown Dubai' },
  { name: 'One at Palm Jumeirah', slug: 'one-at-palm-jumeirah', type: 'building', area: 'Palm Jumeirah' },
  { name: 'Atlantis The Royal', slug: 'atlantis-the-royal', type: 'building', area: 'Palm Jumeirah' },
  { name: 'FIVE Palm Jumeirah', slug: 'five-palm-jumeirah', type: 'building', area: 'Palm Jumeirah' },
]

const developers = [
  { name: 'Emaar Properties', slug: 'emaar', type: 'developer', projects: 85 },
  { name: 'DAMAC Properties', slug: 'damac', type: 'developer', projects: 45 },
  { name: 'Nakheel', slug: 'nakheel', type: 'developer', projects: 35 },
  { name: 'Sobha Realty', slug: 'sobha', type: 'developer', projects: 18 },
  { name: 'Meraas', slug: 'meraas', type: 'developer', projects: 22 },
  { name: 'Dubai Properties', slug: 'dubai-properties', type: 'developer', projects: 28 },
  { name: 'Deyaar', slug: 'deyaar', type: 'developer', projects: 15 },
  { name: 'Select Group', slug: 'select-group', type: 'developer', projects: 12 },
  { name: 'Omniyat', slug: 'omniyat', type: 'developer', projects: 8 },
  { name: 'Ellington Properties', slug: 'ellington', type: 'developer', projects: 14 },
  { name: 'Azizi Developments', slug: 'azizi', type: 'developer', projects: 32 },
  { name: 'Danube Properties', slug: 'danube', type: 'developer', projects: 25 },
]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')?.toLowerCase() || ''
  const limit = parseInt(searchParams.get('limit') || '10')

  if (!query || query.length < 2) {
    return NextResponse.json({ results: [], query: '' })
  }

  const results: Array<{
    name: string
    slug: string
    type: 'area' | 'building' | 'developer'
    subtitle: string
    href: string
  }> = []

  // Search areas
  areas
    .filter(a => a.name.toLowerCase().includes(query))
    .slice(0, 5)
    .forEach(a => {
      results.push({
        name: a.name,
        slug: a.slug,
        type: 'area',
        subtitle: `${a.transactions.toLocaleString()} transactions`,
        href: `/areas/${a.slug}`
      })
    })

  // Search buildings
  buildings
    .filter(b => b.name.toLowerCase().includes(query))
    .slice(0, 5)
    .forEach(b => {
      results.push({
        name: b.name,
        slug: b.slug,
        type: 'building',
        subtitle: b.area,
        href: `/buildings/${b.slug}`
      })
    })

  // Search developers
  developers
    .filter(d => d.name.toLowerCase().includes(query))
    .slice(0, 5)
    .forEach(d => {
      results.push({
        name: d.name,
        slug: d.slug,
        type: 'developer',
        subtitle: `${d.projects} projects`,
        href: `/developers/${d.slug}`
      })
    })

  // Sort by relevance (exact match first, then starts with, then contains)
  results.sort((a, b) => {
    const aLower = a.name.toLowerCase()
    const bLower = b.name.toLowerCase()
    
    if (aLower === query && bLower !== query) return -1
    if (bLower === query && aLower !== query) return 1
    if (aLower.startsWith(query) && !bLower.startsWith(query)) return -1
    if (bLower.startsWith(query) && !aLower.startsWith(query)) return 1
    return 0
  })

  return NextResponse.json({
    results: results.slice(0, limit),
    query,
    total: results.length
  })
}
