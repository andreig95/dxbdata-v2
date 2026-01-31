'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Search, Menu, X, TrendingUp, Building2, Users, Construction, Calculator, BarChart3 } from 'lucide-react'
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

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

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
          <div className="hidden flex-1 max-w-xl md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <Input
                type="search"
                placeholder="Search areas, buildings, developers..."
                className="w-full pl-10 bg-slate-900 border-slate-800 focus:border-cyan-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
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
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full pl-10 bg-slate-900 border-slate-800"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
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
