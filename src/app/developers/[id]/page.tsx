import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Star, CheckCircle, Building2, MapPin, Calendar, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DEVELOPERS, getDeveloperById } from '@/lib/developers'
import { formatPrice, formatNumber } from '@/lib/api'

interface PageProps {
  params: Promise<{ id: string }>
}

export function generateStaticParams() {
  return DEVELOPERS.map((dev) => ({ id: dev.id }))
}

export default async function DeveloperDetailPage({ params }: PageProps) {
  const { id } = await params
  const developer = getDeveloperById(id)

  if (!developer) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <section className="border-b border-slate-800 bg-slate-900/50">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <Link href="/developers" className="inline-flex items-center text-sm text-slate-400 hover:text-white mb-4">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Developers
          </Link>
          
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="flex items-start gap-5">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 text-4xl">
                {developer.logo}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">{developer.name}</h1>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1 bg-amber-500/10 px-3 py-1 rounded-full">
                    <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                    <span className="font-semibold text-amber-400">{developer.rating}</span>
                    <span className="text-sm text-slate-500">({formatNumber(developer.reviews)} reviews)</span>
                  </div>
                  <Badge variant="outline" className="border-slate-700">
                    <Calendar className="mr-1 h-3 w-3" />
                    Est. {developer.established}
                  </Badge>
                </div>
                <p className="mt-3 text-slate-400 max-w-2xl">
                  {developer.description}
                </p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" className="border-slate-700 hover:bg-slate-800">
                Set Alert
              </Button>
              <Button className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:opacity-90">
                View Projects
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-slate-800 bg-slate-900/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Total Projects</p>
                  <p className="mt-1 text-3xl font-bold text-white">{developer.totalProjects}</p>
                </div>
                <Building2 className="h-10 w-10 text-purple-500/50" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-800 bg-slate-900/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Completed</p>
                  <p className="mt-1 text-3xl font-bold text-emerald-400">{developer.completedProjects}</p>
                </div>
                <CheckCircle className="h-10 w-10 text-emerald-500/50" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-800 bg-slate-900/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Ongoing</p>
                  <p className="mt-1 text-3xl font-bold text-cyan-400">{developer.ongoingProjects}</p>
                </div>
                <TrendingUp className="h-10 w-10 text-cyan-500/50" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-800 bg-slate-900/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">On-time Delivery</p>
                  <p className={`mt-1 text-3xl font-bold ${
                    developer.onTimeDelivery >= 90 ? 'text-emerald-400' : 
                    developer.onTimeDelivery >= 80 ? 'text-amber-400' : 'text-red-400'
                  }`}>
                    {developer.onTimeDelivery}%
                  </p>
                </div>
                <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                  developer.onTimeDelivery >= 90 ? 'bg-emerald-500/20' : 
                  developer.onTimeDelivery >= 80 ? 'bg-amber-500/20' : 'bg-red-500/20'
                }`}>
                  <CheckCircle className={`h-6 w-6 ${
                    developer.onTimeDelivery >= 90 ? 'text-emerald-400' : 
                    developer.onTimeDelivery >= 80 ? 'text-amber-400' : 'text-red-400'
                  }`} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Delivery Rate Bar */}
        <Card className="mt-6 border-slate-800 bg-slate-900/50">
          <CardContent className="p-6">
            <h3 className="font-semibold text-white mb-4">Delivery Track Record</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-400">On-time Delivery Rate</span>
                  <span className={
                    developer.onTimeDelivery >= 90 ? 'text-emerald-400' : 
                    developer.onTimeDelivery >= 80 ? 'text-amber-400' : 'text-red-400'
                  }>{developer.onTimeDelivery}%</span>
                </div>
                <div className="h-4 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${
                      developer.onTimeDelivery >= 90 ? 'bg-gradient-to-r from-emerald-600 to-emerald-400' : 
                      developer.onTimeDelivery >= 80 ? 'bg-gradient-to-r from-amber-600 to-amber-400' : 
                      'bg-gradient-to-r from-red-600 to-red-400'
                    }`}
                    style={{ width: `${developer.onTimeDelivery}%` }}
                  />
                </div>
              </div>
              <div className="flex items-center gap-6 text-sm text-slate-500">
                <span>✓ {developer.completedProjects} completed on time</span>
                <span>⏳ {developer.ongoingProjects} in progress</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Price Range */}
        <Card className="mt-6 border-slate-800 bg-slate-900/50">
          <CardHeader>
            <CardTitle className="text-white">Price Range</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <div>
                <p className="text-sm text-slate-500">Starting from</p>
                <p className="text-2xl font-bold text-white">{formatPrice(developer.priceRange.min)}</p>
              </div>
              <div className="flex-1 h-3 bg-slate-800 rounded-full relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-full" />
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-500">Up to</p>
                <p className="text-2xl font-bold text-white">{formatPrice(developer.priceRange.max)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Popular Areas */}
        <Card className="mt-6 border-slate-800 bg-slate-900/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <MapPin className="h-5 w-5 text-cyan-500" />
              Popular Areas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {developer.popularAreas.map((area) => (
                <Link key={area} href={`/areas/${area.toLowerCase().replace(/ /g, '-')}`}>
                  <Badge 
                    variant="outline" 
                    className="border-cyan-500/50 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 cursor-pointer px-4 py-2"
                  >
                    {area}
                  </Badge>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Notable Projects */}
        <Card className="mt-6 border-slate-800 bg-slate-900/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Building2 className="h-5 w-5 text-purple-500" />
              Notable Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {developer.notableProjects.map((project) => (
                <div 
                  key={project}
                  className="p-4 bg-slate-800/50 rounded-lg border border-slate-700 hover:border-purple-500/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-purple-400" />
                    </div>
                    <span className="font-medium text-white">{project}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Compare with Others */}
        <div className="mt-8 text-center">
          <p className="text-slate-500 mb-4">Want to compare with other developers?</p>
          <Button variant="outline" className="border-slate-700 hover:bg-slate-800">
            Compare Developers
          </Button>
        </div>
      </section>
    </main>
  )
}
