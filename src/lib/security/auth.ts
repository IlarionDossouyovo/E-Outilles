import { cookies } from 'next/headers'
import { prisma } from '@/lib/db/prisma'
import { SESSION_COOKIE, SessionUser, verifySessionToken } from '@/lib/security/session'

export type { SessionUser as User }

// Get current session (server-side, verifies signature)
export async function getSession(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies()
    return verifySessionToken(cookieStore.get(SESSION_COOKIE)?.value)
  } catch {
    return null
  }
}

// Get the current user record from the database
export async function getCurrentUser() {
  const session = await getSession()
  if (!session) return null
  return prisma.user.findUnique({ where: { id: session.id } })
}

// Check role. Admins pass every check.
export function hasRole(user: SessionUser | null, role: string): boolean {
  if (!user) return false
  return user.role === role || user.role === 'admin'
}

// Require an authenticated admin, returns the user or null
export async function requireAdmin(): Promise<SessionUser | null> {
  const user = await getSession()
  if (!user || user.role !== 'admin') return null
  return user
}
