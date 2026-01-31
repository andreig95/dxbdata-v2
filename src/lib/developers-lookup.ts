/**
 * Developer Lookup Table
 * Maps master_project / project names to developers
 */

export const DEVELOPER_LOOKUP: Record<string, string> = {
  // Emaar Projects
  'DownTown Dubai': 'Emaar',
  'Downtown Dubai': 'Emaar',
  'Dubai Marina': 'Emaar',
  'Dubai Creek Harbour': 'Emaar',
  'Dubai Hills Estate': 'Emaar',
  'Arabian Ranches - 1': 'Emaar',
  'Arabian Ranches 2': 'Emaar',
  'Arabian Ranches 3': 'Emaar',
  'The Greens': 'Emaar',
  'Emirates Living': 'Emaar',
  'Emaar South': 'Emaar',
  'Emaar Beachfront': 'Emaar',
  'Dubai Harbour': 'Emaar',
  'The Valley': 'Emaar',
  
  // Nakheel Projects
  'Palm Jumeirah': 'Nakheel',
  'Jumeirah Village Circle': 'Nakheel',
  'Jumeirah Village Triangle': 'Nakheel',
  'Jumeirah Islands': 'Nakheel',
  'Jumeirah Park': 'Nakheel',
  'Jumeirah Heights': 'Nakheel',
  'Discovery Gardens': 'Nakheel',
  'International City Phase 1': 'Nakheel',
  'The Gardens': 'Nakheel',
  'Al Furjan': 'Nakheel',
  'Jumeriah Beach Residence  - JBR': 'Nakheel',
  'JBR': 'Nakheel',
  
  // DAMAC Projects
  'DAMAC HILLS': 'DAMAC',
  'DAMAC HILLS 2': 'DAMAC',
  'Damac Hills': 'DAMAC',
  'Damac Hills 2': 'DAMAC',
  'DAMAC Lagoons': 'DAMAC',
  'Akoya Oxygen': 'DAMAC',
  
  // Sobha Projects
  'SOBHA HARTLAND': 'Sobha',
  'Sobha Hartland': 'Sobha',
  'Sobha Reserve': 'Sobha',
  
  // Meraas Projects
  'City Walk': 'Meraas',
  'Bluewaters Island': 'Meraas',
  'La Mer': 'Meraas',
  'Port de La Mer': 'Meraas',
  
  // Dubai Properties
  'Business Bay': 'Dubai Properties',
  'Jumeirah Lakes Towers': 'DMCC',
  'Mudon': 'Dubai Properties',
  
  // Azizi
  'Azizi Riviera': 'Azizi',
  
  // MAG
  'MAG City': 'MAG',
  'MAG 5': 'MAG',
  
  // Danube
  'Lawnz': 'Danube',
  'Olivz': 'Danube',
  'Bayz': 'Danube',
  'Elitz': 'Danube',
  
  // Dubai South
  'Dubai South Residential District': 'Dubai South',
  'Dubai World Central': 'Dubai South',
  
  // Other Master Developers
  'Motor City': 'Union Properties',
  'Silicon Oasis': 'DSOA',
  'Dubai Land Residence Complex': 'Dubai Land',
  'TOWN SQUARE': 'Nshama',
  'Town Square': 'Nshama',
  'Meydan One Community': 'Meydan',
  'International Media Production Zone': 'IMPZ',
  'Arjan': 'Dubai Land',
  'Dubai Sports City': 'Dubai Sports City',
  
  // Binghatti
  'Binghatti Avenue': 'Binghatti',
  'Binghatti Stars': 'Binghatti',
  
  // Samana
  'Samana Golf Avenue': 'Samana',
  'Samana Hills': 'Samana',
  
  // Mohammed Bin Rashid District
  'Mohammed Bin Rashid AL Maktoum District 11': 'MBR City',
  'MBR City': 'MBR City',
}

/**
 * Get developer name from project/master project
 */
export function getDeveloper(masterProject?: string, projectName?: string): string | null {
  if (masterProject && DEVELOPER_LOOKUP[masterProject]) {
    return DEVELOPER_LOOKUP[masterProject]
  }
  
  if (projectName && DEVELOPER_LOOKUP[projectName]) {
    return DEVELOPER_LOOKUP[projectName]
  }
  
  // Try partial matching for common patterns
  const searchStr = (masterProject || projectName || '').toLowerCase()
  
  if (searchStr.includes('emaar') || searchStr.includes('downtown') || searchStr.includes('dubai hills') || searchStr.includes('creek harbour')) {
    return 'Emaar'
  }
  if (searchStr.includes('damac')) return 'DAMAC'
  if (searchStr.includes('sobha')) return 'Sobha'
  if (searchStr.includes('nakheel') || searchStr.includes('palm') || searchStr.includes('jvc') || searchStr.includes('jvt')) {
    return 'Nakheel'
  }
  if (searchStr.includes('meraas')) return 'Meraas'
  if (searchStr.includes('azizi')) return 'Azizi'
  if (searchStr.includes('danube')) return 'Danube'
  if (searchStr.includes('binghatti')) return 'Binghatti'
  if (searchStr.includes('samana')) return 'Samana'
  if (searchStr.includes('mag ')) return 'MAG'
  if (searchStr.includes('ellington')) return 'Ellington'
  if (searchStr.includes('select')) return 'Select Group'
  if (searchStr.includes('omniyat')) return 'Omniyat'
  
  return null
}
