import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/layout/Header'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'DXBData - Dubai Real Estate Transaction Intelligence',
  description: 'Access real transaction data from Dubai Land Department. Analyze market trends, compare areas, track developers, and make data-driven investment decisions.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-slate-950 text-slate-100 antialiased`}>
        <Header />
        {children}
      </body>
    </html>
  )
}
