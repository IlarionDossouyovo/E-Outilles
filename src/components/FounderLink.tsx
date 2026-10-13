'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { getSessionAction } from '@/app/actions'
import type { SessionUser } from '@/lib/security/session'

type FounderLinkProps = {
  className?: string
  children: React.ReactNode
  href?: string
  // Optional fallback rendered while the session is unknown (default: nothing).
  loadingFallback?: React.ReactNode
}

// Renders its children only for the founder. The /agent dashboard is
// founder-only (middleware), so non-founders must never see the link -
// otherwise admins click it and land on the "Accès refusé" notice.
export default function FounderLink({
  className,
  children,
  href = '/agent',
  loadingFallback = null,
}: FounderLinkProps) {
  const [user, setUser] = useState<SessionUser | null>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    getSessionAction()
      .then((result) => setUser(result.user))
      .catch(() => {})
      .finally(() => setLoaded(true))
  }, [])

  if (!loaded) return <>{loadingFallback}</>
  if (!user?.isFounder) return null

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  )
}
