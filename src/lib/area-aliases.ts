/**
 * Area Aliases
 * Maps common/marketing names to actual DLD database names
 */

export const AREA_ALIASES: Record<string, string> = {
  // Emaar Beachfront is listed as Dubai Harbour in DLD
  'emaar beachfront': 'Dubai Harbour',
  'emaar-beachfront': 'Dubai Harbour',
  
  // Common variations
  'jvc': 'Jumeirah Village Circle',
  'jvt': 'Jumeirah Village Triangle',
  'jlt': 'Jumeirah Lakes Towers',
  'jbr': 'Jumeriah Beach Residence  - JBR',
  'downtown': 'DownTown Dubai',
  'dubai hills': 'Dubai Hills Estate',
  'damac hills': 'DAMAC HILLS',
  'damac hills 2': 'DAMAC HILLS 2',
  'sobha hartland': 'SOBHA HARTLAND',
  'town square': 'TOWN SQUARE',
  'mbr city': 'Meydan One Community',
}

/**
 * Resolve area name to DLD database name
 */
export function resolveAreaName(slug: string): string {
  const normalized = slug.toLowerCase().replace(/-/g, ' ')
  
  // Check if there's an alias
  if (AREA_ALIASES[normalized]) {
    return AREA_ALIASES[normalized]
  }
  
  // Also check with dashes
  if (AREA_ALIASES[slug.toLowerCase()]) {
    return AREA_ALIASES[slug.toLowerCase()]
  }
  
  // Default: convert slug to title case
  return slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

/**
 * Get display name for an area (for UI)
 */
export function getAreaDisplayName(slug: string): string {
  // For display, use the marketing name
  return slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}
