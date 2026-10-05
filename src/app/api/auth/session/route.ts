import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { SESSION_COOKIE, verifySessionToken } from '@/lib/security/session'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const user = await verifySessionToken(cookieStore.get(SESSION_COOKIE)?.value)
    return NextResponse.json({ user })
  } catch {
    return NextResponse.json({ user: null })
  }
}