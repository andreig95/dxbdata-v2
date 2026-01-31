import Link from 'next/link'
import { Search, Users, Star, CheckCircle, Building2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { DEVELOPERS } from '@/lib/developers'
import { formatPrice } from '@/lib/api'

export default function DevelopersPage() {
  // Sort by rating by default
  const developers = [...DEVELOPERS].sort((a, b) => b.rating - a.rating)

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <section className="border-b border-slate-800 bg-slate-900/50">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <h1 className="text-3xl font-bold text-white">Dubai Developers</h1>
          <p className="mt-2 text-slate-400">
            Compare {developers.length} developers by track record, delivery rates, and ratings
          </p>

          {/* Search */}
          <div className="mt-6 flex flex-wrap gap-4">
            <div className="relative flex-1 min-w-[250px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <Input
                type="search"
                placeholder="Search developers..."
                className="pl-10 bg-slate-900 border-slate-700"
              />
            </div>
            <div className="flex gap-2">
              <Badge variant="outline" className="cursor-pointer border-cyan-500/50 bg-cyan-500/10 text-cyan-400 px-4 py-2">
                <Star className="mr-1 h-3 w-3" /> By Rating
              </Badge>
              <Badge variant="outline" className="cursor-pointer border-slate-700 hover:bg-slate-800 px-4 py-2">
                <CheckCircle className="mr-1 h-3 w-3" /> By Delivery
              </Badge>
              <Badge variant="outline" className="cursor-pointer border-slate-700 hover:bg-slate-800 px-4 py-2">
                <Building2 className="mr-1 h-3 w-3" /> By Projects
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Developers Grid */}
      <section className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {developers.map((dev) => (
            <Link key={dev.id} href={`/developers/${dev.id}`}>
              <Card className="h-full border-slate-800 bg-slate-900/50 transition-all hover:border-cyan-500/50 hover:bg-slate-900 hover:shadow-lg hover:shadow-cyan-500/5">
                <CardContent className="p-6">
                  {/* Header */}
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 text-2xl">
                      {dev.logo}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-white text-lg">{dev.name}</h3>
                      <p className="text-sm text-slate-500">Est. {dev.established}</p>
                    </div>
                    <div className="flex items-center gap-1 bg-amber-500/10 px-2 py-1 rounded">
                      <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                      <span className="font-semibold text-amber-400">{dev.rating}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="mt-4 text-sm text-slate-400 line-clamp-2">
                    {dev.description}
                  </p>

                  {/* Stats */}
                  <div className="mt-4 grid grid-cols-3 gap-3">
                    <div className="text-center p-2 bg-slate-800/50 rounded-lg">
                      <p className="text-lg font-bold text-white">{dev.totalProjects}</p>
                      <p className="text-xs text-slate-500">Projects</p>
                    </div>
                    <div className="text-center p-2 bg-slate-800/50 rounded-lg">
                      <p className="text-lg font-bold text-white">{dev.completedProjects}</p>
                      <p className="text-xs text-slate-500">Completed</p>
                    </div>
                    <div className="text-center p-2 bg-slate-800/50 rounded-lg">
                      <p className={`text-lg font-bold ${
                        dev.onTimeDelivery >= 90 ? 'text-emerald-400' : 
                        dev.onTimeDelivery >= 80 ? 'text-amber-400' : 'text-red-400'
                      }`}>
                        {dev.onTimeDelivery}%
                      </p>
                      <p className="text-xs text-slate-500">On-time</p>
                    </div>
                  </div>

                  {/* On-time Delivery Bar */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-500">On-time Delivery Rate</span>
                      <span className={
                        dev.onTimeDelivery >= 90 ? 'text-emerald-400' : 
                        dev.onTimeDelivery >= 80 ? 'text-amber-400' : 'text-red-400'
                      }>
                        {dev.onTimeDelivery}%
                      </span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all ${
                          dev.onTimeDelivery >= 90 ? 'bg-emerald-500' : 
                          dev.onTimeDelivery >= 80 ? 'bg-amber-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${dev.onTimeDelivery}%` }}
                      />
                    </div>
                  </div>

                  {/* Price Range */}
                  <div className="mt-4 pt-4 border-t border-slate-800">
                    <p className="text-xs text-slate-500 mb-1">Price Range</p>
                    <p className="text-sm font-medium text-white">
                      {formatPrice(dev.priceRange.min)} – {formatPrice(dev.priceRange.max)}
                    </p>
                  </div>

                  {/* Areas */}
                  <div className="mt-3 flex flex-wrap gap-1">
                    {dev.popularAreas.slice(0, 3).map((area) => (
                      <Badge key={area} variant="outline" className="border-slate-700 text-slate-400 text-xs">
                        {area}
                      </Badge>
                    ))}
                    {dev.popularAreas.length > 3 && (
                      <Badge variant="outline" className="border-slate-700 text-slate-500 text-xs">
                        +{dev.popularAreas.length - 3}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}
