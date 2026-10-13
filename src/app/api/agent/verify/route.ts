import { NextRequest, NextResponse } from 'next/server'
import { timingSafeEqual } from 'crypto'
import { requireAdmin } from '@/lib/security/auth'

// Constant-time comparison to avoid leaking the access code via timing.
function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a)
  const bufB = Buffer.from(b)
  if (bufA.length !== bufB.length) return false
  return timingSafeEqual(bufA, bufB)
}

export async function POST(request: NextRequest) {
  // The agent dashboard exposes internal automation data: admins only.
  const admin = await requireAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
  }

  const { code } = await request.json().catch(() => ({ code: '' }))
  const expected = process.env.AGENT_ACCESS_CODE

  // A signed-in admin is trusted; the code is only a second factor when set.
  if (!expected) {
    return NextResponse.json({ valid: true })
  }

  if (!code || !safeEqual(String(code), expected)) {
    return NextResponse.json({ valid: false }, { status: 401 })
  }

  return NextResponse.json({ valid: true })
}
