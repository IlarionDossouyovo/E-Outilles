// Simple auth placeholder - use NextAuth in production

export interface User {
  id: string
  email: string
  name?: string
  role: 'customer' | 'admin' | 'reseller'
  country?: string
}

// Mock user for development
export const mockUser: User = {
  id: '1',
  email: 'demo@e-outilles.com',
  name: 'Demo User',
  role: 'customer',
}

// Check if user is authenticated (placeholder)
export function getSession(): User | null {
  if (typeof window === 'undefined') return null
  const stored = localStorage.getItem('eoutilles_user')
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {
      return null
    }
  }
  return null
}

// Login placeholder
export function login(email: string, password: string): Promise<User> {
  return new Promise((resolve) => {
    // In production, call API
    const user: User = { id: '1', email, role: 'customer' }
    localStorage.setItem('eoutilles_user', JSON.stringify(user))
    resolve(user)
  })
}

// Logout
export function logout(): void {
  localStorage.removeItem('eoutilles_user')
}

// Check role
export function hasRole(user: User | null, role: string): boolean {
  if (!user) return false
  return user.role === role || user.role === 'admin'
}
