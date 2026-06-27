'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

// Demo users database
const users = [
  { id: '1', email: 'demo@e-outilles.com', password: 'demo123', name: 'Demo User', role: 'customer' },
  { id: '2', email: 'admin@e-outilles.com', password: 'admin123', name: 'Admin', role: 'admin' },
]

export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Email et mot de passe requis' }
  }

  const user = users.find(u => u.email === email && u.password === password)

  if (!user) {
    return { error: 'Email ou mot de passe incorrect' }
  }

  // Set session cookie
  const cookieStore = await cookies()
  cookieStore.set('session', JSON.stringify({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role
  }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/'
  })

  return { success: true, user }
}

export async function logoutAction() {
  const cookieStore = await cookies()
  cookieStore.delete('session')
  return { success: true }
}

export async function getSessionAction() {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get('session')
  
  if (!sessionCookie) {
    return { user: null }
  }
  
  try {
    const user = JSON.parse(sessionCookie.value)
    return { user }
  } catch {
    return { user: null }
  }
}