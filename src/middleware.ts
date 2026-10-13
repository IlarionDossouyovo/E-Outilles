import { NextRequest, NextResponse } from 'next/server'
import { SESSION_COOKIE, verifySessionToken } from '@/lib/security/session'
import { isFounderEmail } from '@/lib/security/founder'

// Route prefixes that require a signed-in user, with the minimum role.
// "admin" routes accept the admin role only; "founder" routes are reserved to
// the company founder (the AI agent system is founder-only).
const RULES: { prefix: string; role?: 'admin' | 'founder' }[] = [
  { prefix: '/admin', role: 'admin' },
  { prefix: '/agent', role: 'founder' },
  { prefix: '/vendeur' },
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const rule = RULES.find((r) => pathname === r.prefix || pathname.startsWith(`${r.prefix}/`))
  if (!rule) return NextResponse.next()

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

  if (rule.role === 'admin' && user.role !== 'admin') {
    // Send a signed-in non-admin to their account page with a notice, rather
    // than to the homepage where the error param is silently dropped.
    const url = request.nextUrl.clone()
    url.pathname = '/profile'
    url.search = '?error=acces_refuse'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/agent/:path*', '/vendeur/:path*'],
}
