// Developer data for DXBData

export interface Developer {
  id: string
  name: string
  logo: string
  established: number
  description: string
  totalProjects: number
  completedProjects: number
  ongoingProjects: number
  onTimeDelivery: number
  priceRange: { min: number; max: number }
  popularAreas: string[]
  notableProjects: string[]
  rating: number
  reviews: number
}

export const DEVELOPERS: Developer[] = [
  {
    id: 'emaar',
    name: 'Emaar Properties',
    logo: '🏛️',
    established: 1997,
    description: "One of the world's largest real estate developers, creator of Burj Khalifa and Dubai Mall.",
    totalProjects: 85,
    completedProjects: 65,
    ongoingProjects: 15,
    onTimeDelivery: 92,
    priceRange: { min: 1500000, max: 50000000 },
    popularAreas: ['Downtown Dubai', 'Dubai Marina', 'Dubai Hills Estate', 'Emaar Beachfront', 'Dubai Creek Harbour'],
    notableProjects: ['Burj Khalifa', 'Dubai Mall', 'Dubai Fountain', 'Address Hotels'],
    rating: 4.5,
    reviews: 2847
  },
  {
    id: 'damac',
    name: 'DAMAC Properties',
    logo: '🌟',
    established: 2002,
    description: 'Luxury developer known for branded residences with Versace, Fendi, and Trump.',
    totalProjects: 45,
    completedProjects: 32,
    ongoingProjects: 10,
    onTimeDelivery: 78,
    priceRange: { min: 800000, max: 30000000 },
    popularAreas: ['Business Bay', 'DAMAC Hills', 'JLT', 'Downtown Dubai'],
    notableProjects: ['DAMAC Hills', 'Aykon City', 'Cavalli Tower', 'Paramount Tower'],
    rating: 4.0,
    reviews: 1523
  },
  {
    id: 'nakheel',
    name: 'Nakheel',
    logo: '🌴',
    established: 2000,
    description: 'Government-owned developer behind Palm Jumeirah and The World islands.',
    totalProjects: 35,
    completedProjects: 28,
    ongoingProjects: 5,
    onTimeDelivery: 85,
    priceRange: { min: 1000000, max: 80000000 },
    popularAreas: ['Palm Jumeirah', 'JVC', 'Discovery Gardens', 'Dragon Mart'],
    notableProjects: ['Palm Jumeirah', 'The World Islands', 'Nakheel Mall', 'Ibn Battuta Mall'],
    rating: 4.3,
    reviews: 1892
  },
  {
    id: 'meraas',
    name: 'Meraas',
    logo: '✨',
    established: 2007,
    description: 'Innovative developer known for lifestyle destinations and unique concepts.',
    totalProjects: 25,
    completedProjects: 18,
    ongoingProjects: 5,
    onTimeDelivery: 90,
    priceRange: { min: 1200000, max: 25000000 },
    popularAreas: ['City Walk', 'La Mer', 'Bluewaters Island', 'Port de La Mer'],
    notableProjects: ['City Walk', 'La Mer', 'Bluewaters Island', 'Ain Dubai'],
    rating: 4.4,
    reviews: 956
  },
  {
    id: 'sobha',
    name: 'Sobha Realty',
    logo: '🏆',
    established: 1976,
    description: 'Backward-integrated developer known for quality craftsmanship and timely delivery.',
    totalProjects: 18,
    completedProjects: 12,
    ongoingProjects: 4,
    onTimeDelivery: 95,
    priceRange: { min: 1800000, max: 15000000 },
    popularAreas: ['Sobha Hartland', 'MBR City', 'Dubai Canal'],
    notableProjects: ['Sobha Hartland', 'District One', 'Creek Vistas'],
    rating: 4.6,
    reviews: 723
  },
  {
    id: 'select',
    name: 'Select Group',
    logo: '🔷',
    established: 2002,
    description: 'Premium developer focused on Dubai Marina and waterfront properties.',
    totalProjects: 15,
    completedProjects: 12,
    ongoingProjects: 2,
    onTimeDelivery: 88,
    priceRange: { min: 600000, max: 8000000 },
    popularAreas: ['Dubai Marina', 'Business Bay', 'JLT'],
    notableProjects: ['Marina Gate', 'Peninsula', 'No.9'],
    rating: 4.2,
    reviews: 534
  },
  {
    id: 'azizi',
    name: 'Azizi Developments',
    logo: '🏗️',
    established: 2007,
    description: 'Fast-growing developer known for affordable luxury in prime locations.',
    totalProjects: 30,
    completedProjects: 18,
    ongoingProjects: 10,
    onTimeDelivery: 75,
    priceRange: { min: 400000, max: 5000000 },
    popularAreas: ['Al Furjan', 'Palm Jumeirah', 'MBR City', 'Dubai Healthcare City'],
    notableProjects: ['Azizi Riviera', 'Azizi Venice', 'Mina'],
    rating: 3.9,
    reviews: 892
  },
  {
    id: 'danube',
    name: 'Danube Properties',
    logo: '🌊',
    established: 2014,
    description: 'Value-focused developer with flexible payment plans and affordable options.',
    totalProjects: 22,
    completedProjects: 15,
    ongoingProjects: 5,
    onTimeDelivery: 80,
    priceRange: { min: 300000, max: 3000000 },
    popularAreas: ['JVC', 'Arjan', 'Al Furjan', 'Dubai Science Park'],
    notableProjects: ['Bayz', 'Elitz', 'Fashionz', 'Glamz'],
    rating: 4.0,
    reviews: 1234
  },
  {
    id: 'omniyat',
    name: 'Omniyat',
    logo: '💎',
    established: 2005,
    description: 'Ultra-luxury developer known for architectural masterpieces and exclusive residences.',
    totalProjects: 12,
    completedProjects: 8,
    ongoingProjects: 3,
    onTimeDelivery: 85,
    priceRange: { min: 3000000, max: 100000000 },
    popularAreas: ['Business Bay', 'Palm Jumeirah', 'Marasi Marina'],
    notableProjects: ['The Opus', 'One Palm', 'Dorchester Collection'],
    rating: 4.7,
    reviews: 312
  },
  {
    id: 'ellington',
    name: 'Ellington Properties',
    logo: '🎨',
    established: 2014,
    description: 'Design-led developer focused on boutique, art-inspired residences.',
    totalProjects: 15,
    completedProjects: 10,
    ongoingProjects: 4,
    onTimeDelivery: 88,
    priceRange: { min: 800000, max: 8000000 },
    popularAreas: ['JVC', 'MBR City', 'Palm Jumeirah', 'Downtown Dubai'],
    notableProjects: ['Belgravia', 'DT1', 'The Crestmark'],
    rating: 4.3,
    reviews: 445
  },
  {
    id: 'binghatti',
    name: 'Binghatti Developers',
    logo: '🔺',
    established: 2008,
    description: 'Known for distinctive architecture and geometric designs.',
    totalProjects: 40,
    completedProjects: 30,
    ongoingProjects: 8,
    onTimeDelivery: 82,
    priceRange: { min: 500000, max: 4000000 },
    popularAreas: ['JVC', 'Business Bay', 'Dubai Silicon Oasis', 'Al Jaddaf'],
    notableProjects: ['Binghatti Stars', 'Binghatti Gateway', 'Mercedes Benz Places'],
    rating: 4.1,
    reviews: 678
  },
  {
    id: 'deyaar',
    name: 'Deyaar Development',
    logo: '🏢',
    established: 2002,
    description: 'One of Dubai\'s largest developers with diverse residential and commercial projects.',
    totalProjects: 25,
    completedProjects: 20,
    ongoingProjects: 4,
    onTimeDelivery: 83,
    priceRange: { min: 600000, max: 6000000 },
    popularAreas: ['Business Bay', 'Dubai Marina', 'Al Barsha', 'DIFC'],
    notableProjects: ['The Atria', 'Midtown', 'Mont Rose'],
    rating: 4.0,
    reviews: 543
  }
]

export function getDeveloperById(id: string): Developer | undefined {
  return DEVELOPERS.find(d => d.id === id)
}

export function getDevelopersByArea(area: string): Developer[] {
  const searchArea = area.toLowerCase()
  return DEVELOPERS.filter(d => 
    d.popularAreas.some(a => a.toLowerCase().includes(searchArea))
  )
}
