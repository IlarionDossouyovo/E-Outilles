import { cookies } from 'next/headers'

export interface User {
  id: string
  email: string
  name?: string
  role: 'customer' | 'admin' | 'reseller'
  country?: string
}

// Demo users database (same as API)
export const users = [
  { id: '1', email: 'demo@e-outilles.com', password: 'demo123', name: 'Demo User', role: 'customer' },
  { id: '2', email: 'admin@e-outilles.com', password: 'admin123', name: 'Admin', role: 'admin' },
]

// Get current session (server-side)
export async function getSession(): Promise<User | null> {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('session')
    if (!sessionCookie) return null
    return JSON.parse(sessionCookie.value)
  } catch {
    return null
  }
}

// Check role
export function hasRole(user: User | null, role: string): boolean {
  if (!user) return false
  return user.role === role || user.role === 'admin'
}
