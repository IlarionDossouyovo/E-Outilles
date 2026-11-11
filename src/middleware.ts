import { NextRequest, NextResponse } from 'next/server'
import { SESSION_COOKIE, verifySessionToken } from '@/lib/security/session'
import { isFounderEmail } from '@/lib/security/founder'
import {
  DEFAULT_LOCALE,
  isLocale,
  localeForCountry,
  localeForLanguageTag,
} from '@/lib/i18n/config'

// Route prefixes that require a signed-in user, with the minimum role.
// "admin" routes accept the admin role only; "founder" routes are reserved to
// the company founder (the AI agent system is founder-only).
const RULES: { prefix: string; role?: 'admin' | 'founder' }[] = [
  { prefix: '/admin', role: 'admin' },
  { prefix: '/agent', role: 'founder' },
  { prefix: '/vendeur' },
]

// Locale cookie shared with LanguageProvider and the server components that
// translate database content. Written here so the very first request already
// carries the visitor's language, instead of waiting for a client-side call.
const LOCALE_COOKIE = 'eo_locale'

const COUNTRY_HEADERS = ['x-vercel-ip-country', 'cf-ipcountry', 'x-country-code', 'x-geo-country']

function detectLocale(request: NextRequest): string {
  const query = request.nextUrl.searchParams.get('lang')
  if (isLocale(query)) return query

  const stored = request.cookies.get(LOCALE_COOKIE)?.value
  if (isLocale(stored)) return stored

  for (const header of COUNTRY_HEADERS) {
    const value = request.headers.get(header)
    if (value && value !== 'XX' && value !== 'T1') {
      return localeForCountry(value) || DEFAULT_LOCALE
    }
  }

  const accept = request.headers.get('accept-language')
  if (accept) {
    for (const part of accept.split(',')) {
      const locale = localeForLanguageTag(part.split(';')[0].trim())
      if (locale) return locale
    }
  }

  return DEFAULT_LOCALE
}

function withLocaleCookie(response: NextResponse, locale: string): NextResponse {
  response.cookies.set(LOCALE_COOKIE, locale, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
  })
  // <html lang> is rendered statically as "fr" (see src/app/layout.tsx); this
  // header carries the detected locale to crawlers and proxies in the meantime.
  response.headers.set('Content-Language', locale)
  return response
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const locale = detectLocale(request)
  const rule = RULES.find((r) => pathname === r.prefix || pathname.startsWith(`${r.prefix}/`))

  if (!rule) return withLocaleCookie(NextResponse.next(), locale)

  const user = await verifySessionToken(request.cookies.get(SESSION_COOKIE)?.value)

  if (!user) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/login'
    url.search = `?redirect=${encodeURIComponent(pathname)}`
    return NextResponse.redirect(url)
  }

  if (rule.role === 'founder' && !isFounderEmail(user.email)) {
    // Signed-in but not the founder: send to the account page with a notice.
    const url = request.nextUrl.clone()
    url.pathname = '/profile'
    url.search = '?error=founder_only'
    return NextResponse.redirect(url)
  }

  if (rule.role === 'admin' && user.role !== 'admin' && !isFounderEmail(user.email)) {
    // Send a signed-in non-admin to their account page with a notice, rather
    // than to the homepage where the error param is silently dropped. The
    // founder is an admin by definition, even if the role column lags behind.
    const url = request.nextUrl.clone()
    url.pathname = '/profile'
    url.search = '?error=acces_refuse'
    return NextResponse.redirect(url)
  }

  return withLocaleCookie(NextResponse.next(), locale)
}

export const config = {
  // Run on pages only: skip Next internals, the API (it detects the country
  // itself) and any static file (paths containing a dot), so locale detection
  // adds no work to assets while still covering /admin, /blog, /products pages.
  matcher: ['/((?!_next/|api/|.*\\..*).*)'],
}
