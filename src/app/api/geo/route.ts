import { NextRequest, NextResponse } from 'next/server'
import { localeForCountry, DEFAULT_LOCALE, type Locale } from '@/lib/i18n/config'

// Country -> locale detection for the automatic page translation.
//
// The country is derived from edge/CDN headers when the app is deployed behind
// a proxy that sets them (Vercel, Render, Cloudflare). On a bare local server
// none of these headers exist, so the client falls back to its browser locale.
export const dynamic = 'force-dynamic'

const COUNTRY_HEADERS = [
  'x-vercel-ip-country',
  'cf-ipcountry',
  'x-country-code',
  'x-geo-country',
]

function detectCountry(request: NextRequest): string | null {
  for (const header of COUNTRY_HEADERS) {
    const value = request.headers.get(header)
    if (value && value !== 'XX' && value !== 'T1') return value.toUpperCase()
  }
  return null
}

export async function GET(request: NextRequest) {
  const country = detectCountry(request)
  const locale: Locale = (country && localeForCountry(country)) || DEFAULT_LOCALE

  return NextResponse.json(
    { country, locale, detected: Boolean(country) },
    { headers: { 'Cache-Control': 'no-store' } }
  )
}
