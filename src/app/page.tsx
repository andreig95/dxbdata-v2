import Link from 'next/link'
import { ArrowRight, TrendingUp, Building2, Users, MapPin, BarChart3, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

// Mock data - will be replaced with real API calls
const marketStats = {
  totalTransactions: 142847,
  totalValue: 389.5, // billions
  avgPriceSqm: 14250,
  activeAreas: 187,
}

const trendingAreas = [
  { name: 'Dubai Marina', transactions: 3240, avgPrice: 1850000, change: 12.5 },
  { name: 'Downtown Dubai', transactions: 2890, avgPrice: 2450000, change: 8.3 },
  { name: 'Palm Jumeirah', transactions: 1560, avgPrice: 4200000, change: 15.2 },
  { name: 'Business Bay', transactions: 2100, avgPrice: 1450000, change: 6.8 },
  { name: 'JVC', transactions: 4500, avgPrice: 850000, change: -2.1 },
  { name: 'Dubai Hills', transactions: 1890, avgPrice: 2100000, change: 18.5 },
]

const topDevelopers = [
  { name: 'Emaar', projects: 85, onTime: 92 },
  { name: 'DAMAC', projects: 45, onTime: 78 },
  { name: 'Nakheel', projects: 35, onTime: 85 },
  { name: 'Sobha', projects: 18, onTime: 95 },
]

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/20 via-transparent to-transparent" />
        <div className="mx-auto max-w-7xl px-4 py-20 sm:py-28">
          <div className="text-center">
            <Badge variant="outline" className="mb-6 border-cyan-500/50 text-cyan-400">
              <Zap className="mr-1 h-3 w-3" /> Real-time Dubai Transaction Data
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
              Dubai Real Estate
              <span className="block bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                Transaction Intelligence
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">
              Access real transaction data from Dubai Land Department. Analyze market trends, 
              compare areas, track developers, and make data-driven investment decisions.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:opacity-90">
                Explore Transactions
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="border-slate-700 hover:bg-slate-800">
                View Market Report
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-slate-800 bg-slate-900/50">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-cyan-400">
                {marketStats.totalTransactions.toLocaleString()}
              </div>
              <div className="mt-1 text-sm text-slate-500">Total Transactions</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-cyan-400">
                AED {marketStats.totalValue}B
              </div>
              <div className="mt-1 text-sm text-slate-500">Total Value</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-cyan-400">
                {marketStats.avgPriceSqm.toLocaleString()}
              </div>
              <div className="mt-1 text-sm text-slate-500">Avg Price/sqm</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-cyan-400">
                {marketStats.activeAreas}
              </div>
              <div className="mt-1 text-sm text-slate-500">Active Areas</div>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Areas */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Trending Areas</h2>
            <p className="mt-1 text-slate-500">Most active areas by transaction volume</p>
          </div>
          <Link href="/areas">
            <Button variant="ghost" className="text-cyan-400 hover:text-cyan-300">
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {trendingAreas.map((area) => (
            <Link key={area.name} href={`/areas/${area.name.toLowerCase().replace(/ /g, '-')}`}>
              <Card className="border-slate-800 bg-slate-900/50 transition-all hover:border-cyan-500/50 hover:bg-slate-900">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-white">{area.name}</h3>
                      <p className="mt-1 text-sm text-slate-500">
                        {area.transactions.toLocaleString()} transactions
                      </p>
                    </div>
                    <Badge 
                      variant={area.change >= 0 ? 'default' : 'destructive'}
                      className={area.change >= 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}
                    >
                      {area.change >= 0 ? '+' : ''}{area.change}%
                    </Badge>
                  </div>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-white">
                      AED {(area.avgPrice / 1000000).toFixed(1)}M
                    </span>
                    <span className="text-sm text-slate-500">avg price</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="border-y border-slate-800 bg-slate-900/30 py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-12 text-center">
            <h2 className="text-2xl font-bold text-white">Everything You Need</h2>
            <p className="mt-2 text-slate-500">Comprehensive tools for real estate research</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="border-slate-800 bg-slate-950">
              <CardHeader>
                <MapPin className="h-10 w-10 text-cyan-500" />
                <CardTitle className="text-white">Area Intelligence</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-400">
                Deep dive into 180+ neighborhoods with price trends, transaction history, and market insights.
              </CardContent>
            </Card>

            <Card className="border-slate-800 bg-slate-950">
              <CardHeader>
                <Building2 className="h-10 w-10 text-purple-500" />
                <CardTitle className="text-white">Building Analytics</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-400">
                Track every building with historical transactions, price/sqft trends, and flip analysis.
              </CardContent>
            </Card>

            <Card className="border-slate-800 bg-slate-950">
              <CardHeader>
                <Users className="h-10 w-10 text-emerald-500" />
                <CardTitle className="text-white">Developer Profiles</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-400">
                Compare developers by track record, on-time delivery rates, and price appreciation.
              </CardContent>
            </Card>

            <Card className="border-slate-800 bg-slate-950">
              <CardHeader>
                <BarChart3 className="h-10 w-10 text-amber-500" />
                <CardTitle className="text-white">Investment Tools</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-400">
                Mortgage calculator, ROI estimator, flip analyzer, and area comparison tools.
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Top Developers */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Top Developers</h2>
            <p className="mt-1 text-slate-500">Ranked by delivery track record</p>
          </div>
          <Link href="/developers">
            <Button variant="ghost" className="text-cyan-400 hover:text-cyan-300">
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {topDevelopers.map((dev) => (
            <Link key={dev.name} href={`/developers/${dev.name.toLowerCase()}`}>
              <Card className="border-slate-800 bg-slate-900/50 transition-all hover:border-purple-500/50 hover:bg-slate-900">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500/20 to-cyan-500/20">
                      <span className="text-lg font-bold text-white">{dev.name[0]}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{dev.name}</h3>
                      <p className="text-sm text-slate-500">{dev.projects} projects</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">On-time delivery</span>
                      <span className={`font-semibold ${dev.onTime >= 90 ? 'text-emerald-400' : dev.onTime >= 80 ? 'text-amber-400' : 'text-red-400'}`}>
                        {dev.onTime}%
                      </span>
                    </div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800">
                      <div 
                        className={`h-full rounded-full ${dev.onTime >= 90 ? 'bg-emerald-500' : dev.onTime >= 80 ? 'bg-amber-500' : 'bg-red-500'}`}
                        style={{ width: `${dev.onTime}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-slate-800 bg-gradient-to-r from-cyan-900/20 to-purple-900/20 py-16">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-3xl font-bold text-white">Ready to dive in?</h2>
          <p className="mx-auto mt-4 max-w-xl text-slate-400">
            Start exploring Dubai&apos;s real estate market with the most comprehensive transaction data available.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:opacity-90">
              Get Started Free
            </Button>
            <Button size="lg" variant="outline" className="border-slate-600 hover:bg-slate-800">
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-12">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-purple-600">
                <span className="font-bold text-white">D</span>
              </div>
              <span className="font-bold text-white">DXBData</span>
            </div>
            <div className="flex gap-6 text-sm text-slate-500">
              <Link href="/about" className="hover:text-white">About</Link>
              <Link href="/contact" className="hover:text-white">Contact</Link>
              <Link href="/privacy" className="hover:text-white">Privacy</Link>
              <Link href="/terms" className="hover:text-white">Terms</Link>
            </div>
            <p className="text-sm text-slate-600">
              © 2026 DXBData. Data from Dubai Land Department.
            </p>
          </div>
        </div>
      </footer>
    </main>
  )
}
