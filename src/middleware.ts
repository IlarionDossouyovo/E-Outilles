import { NextRequest, NextResponse } from 'next/server'
import { SESSION_COOKIE, verifySessionToken } from '@/lib/security/session'

// Route prefixes that require a signed-in user, with the minimum role.
// "admin" routes also accept the admin role only; "auth" routes accept any user.
const RULES: { prefix: string; role?: 'admin' }[] = [
  { prefix: '/admin', role: 'admin' },
  { prefix: '/agent', role: 'admin' },
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

  if (rule.role === 'admin' && user.role !== 'admin') {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    url.search = '?error=acces_refuse'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/agent/:path*', '/vendeur/:path*'],
}
