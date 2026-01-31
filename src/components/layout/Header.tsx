'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import { Search, Menu, X, TrendingUp, Building2, Users, Construction, Calculator, BarChart3, MapPin, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const navItems = [
  { name: 'Areas', href: '/areas', icon: TrendingUp },
  { name: 'Buildings', href: '/buildings', icon: Building2 },
  { name: 'Developers', href: '/developers', icon: Users },
  { name: 'Off-Plan', href: '/offplan', icon: Construction },
  { name: 'Calculator', href: '/calculator', icon: Calculator },
  { name: 'Insights', href: '/insights', icon: BarChart3 },
]

interface SearchResult {
  name: string
  slug: string
  type: 'area' | 'building' | 'developer'
  subtitle: string
  href: string
}

const typeIcons = {
  area: MapPin,
  building: Building2,
  developer: Users,
}

const typeColors = {
  area: 'text-cyan-400',
  building: 'text-purple-400',
  developer: 'text-emerald-400',
}

export function Header() {
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Debounced search
  useEffect(() => {
    if (searchQuery.length < 2) {
      setResults([])
      setShowResults(false)
      return
    }

    setLoading(true)
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&limit=8`)
        const data = await res.json()
        setResults(data.results || [])
        setShowResults(true)
        setSelectedIndex(-1)
      } catch (e) {
        console.error('Search failed', e)
      } finally {
        setLoading(false)
      }
    }, 200)

    return () => clearTimeout(timer)
  }, [searchQuery])

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showResults || results.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(i => Math.min(i + 1, results.length - 1))
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(i => Math.max(i - 1, -1))
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0 && results[selectedIndex]) {
          router.push(results[selectedIndex].href)
          setShowResults(false)
          setSearchQuery('')
        }
        break
      case 'Escape':
        setShowResults(false)
        break
    }
  }

  const handleResultClick = (href: string) => {
    router.push(href)
    setShowResults(false)
    setSearchQuery('')
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-purple-600">
              <span className="text-lg font-bold text-white">D</span>
            </div>
            <span className="hidden text-xl font-bold sm:block">
              <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                DXBData
              </span>
            </span>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden flex-1 max-w-xl md:block" ref={searchRef}>
            <div className="relative">
              {loading ? (
                <Loader2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-cyan-500 animate-spin" />
              ) : (
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              )}
              <Input
                ref={inputRef}
                type="search"
                placeholder="Search areas, buildings, developers..."
                className="w-full pl-10 bg-slate-900 border-slate-800 focus:border-cyan-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => results.length > 0 && setShowResults(true)}
                onKeyDown={handleKeyDown}
              />
              
              {/* Search Results Dropdown */}
              {showResults && results.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-700 rounded-lg shadow-xl overflow-hidden z-50">
                  {results.map((result, idx) => {
                    const Icon = typeIcons[result.type]
                    return (
                      <button
                        key={`${result.type}-${result.slug}`}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                          idx === selectedIndex 
                            ? 'bg-slate-800' 
                            : 'hover:bg-slate-800/50'
                        }`}
                        onClick={() => handleResultClick(result.href)}
                      >
                        <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 ${typeColors[result.type]}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white truncate">{result.name}</p>
                          <p className="text-xs text-slate-500 truncate">{result.subtitle}</p>
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full bg-slate-800 ${typeColors[result.type]}`}>
                          {result.type}
                        </span>
                      </button>
                    )
                  })}
                  <div className="px-4 py-2 text-xs text-slate-500 border-t border-slate-800">
                    Press ↑↓ to navigate, Enter to select, Esc to close
                  </div>
                </div>
              )}

              {/* No results */}
              {showResults && searchQuery.length >= 2 && results.length === 0 && !loading && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-700 rounded-lg shadow-xl p-4 text-center z-50">
                  <p className="text-sm text-slate-400">No results found for "{searchQuery}"</p>
                </div>
              )}
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-1.5 rounded-md px-3 py-2 text-sm text-slate-400 transition-colors hover:bg-slate-900 hover:text-white"
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="hidden sm:flex border-slate-700 hover:bg-slate-800">
              Sign In
            </Button>
            <Button size="sm" className="hidden sm:flex bg-gradient-to-r from-cyan-500 to-purple-600 hover:opacity-90">
              Get Started
            </Button>

            {/* Mobile Menu Button */}
            <button
              className="rounded-md p-2 text-slate-400 hover:bg-slate-900 hover:text-white lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="pb-3 md:hidden">
          <div className="relative">
            {loading ? (
              <Loader2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-cyan-500 animate-spin" />
            ) : (
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            )}
            <Input
              type="search"
              placeholder="Search..."
              className="w-full pl-10 bg-slate-900 border-slate-800"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => results.length > 0 && setShowResults(true)}
              onKeyDown={handleKeyDown}
            />
            
            {/* Mobile Search Results */}
            {showResults && results.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-700 rounded-lg shadow-xl overflow-hidden z-50">
                {results.slice(0, 5).map((result, idx) => {
                  const Icon = typeIcons[result.type]
                  return (
                    <button
                      key={`mobile-${result.type}-${result.slug}`}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                        idx === selectedIndex 
                          ? 'bg-slate-800' 
                          : 'hover:bg-slate-800/50'
                      }`}
                      onClick={() => handleResultClick(result.href)}
                    >
                      <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 ${typeColors[result.type]}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{result.name}</p>
                        <p className="text-xs text-slate-500 truncate">{result.subtitle}</p>
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="border-t border-slate-800 bg-slate-950 lg:hidden">
          <nav className="mx-auto max-w-7xl px-4 py-4">
            <div className="grid grid-cols-2 gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-3 text-sm text-slate-300 hover:bg-slate-800 hover:text-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <item.icon className="h-5 w-5 text-cyan-500" />
                  {item.name}
                </Link>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <Button variant="outline" className="flex-1 border-slate-700">Sign In</Button>
              <Button className="flex-1 bg-gradient-to-r from-cyan-500 to-purple-600">Get Started</Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
