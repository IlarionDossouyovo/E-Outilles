'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

// First-touch UTM attribution. On the first page view that carries UTM params
// we remember them in sessionStorage (so they survive internal navigation),
// then report a single hit per page to /api/marketing/track. We also remember
// the first external referrer, which is what a campaign link looks like when
// no UTM is present.
const STORAGE_KEY = 'eoutilles.attribution'

export interface Attribution {
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  utmContent?: string
  referrer?: string
}

function isExternal(referrer: string): boolean {
  try {
    const url = new URL(referrer)
    return url.host !== window.location.host
  } catch {
    return false
  }
}

export function readAttribution(): Attribution {
  if (typeof window === 'undefined') return {}
  try {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '{}') as Attribution
  } catch {
    return {}
  }
}

export default function MarketingTracker() {
  const pathname = usePathname()

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search)
      const stored = readAttribution()

      // First touch wins: only fill fields that are still empty.
      const next: Attribution = { ...stored }
      const QS_MAP: [keyof Attribution, string][] = [
        ['utmSource', 'utm_source'],
        ['utmMedium', 'utm_medium'],
        ['utmCampaign', 'utm_campaign'],
        ['utmContent', 'utm_content'],
      ]
      for (const [key, qsKey] of QS_MAP) {
        const value = params.get(qsKey)
        if (value && !next[key]) next[key] = value.slice(0, 120)
      }
      const ref = document.referrer
      if (ref && !next.referrer && isExternal(ref)) next.referrer = ref.slice(0, 120)

      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next))

      // Report the view (fire and forget; keepalive survives navigations).
      fetch('/api/marketing/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: pathname, ...next }),
        keepalive: true,
      }).catch(() => {})
    } catch {
      // Analytics must never break the page.
    }
  }, [pathname])

  return null
}
