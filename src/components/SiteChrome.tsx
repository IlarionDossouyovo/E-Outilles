'use client'

import { usePathname } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

// Routes that provide their own chrome (dashboards, auth screens).
const BARE_PREFIXES = ['/admin', '/agent', '/vendeur', '/auth']

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || '/'
  const bare = BARE_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))

  if (bare) {
    return (
      <div key={pathname} className="page-enter">
        {children}
      </div>
    )
  }

  return (
    <>
      <Header />
      <div key={pathname} className="page-enter flex min-h-screen flex-col">
        {children}
      </div>
      <Footer />
    </>
  )
}
