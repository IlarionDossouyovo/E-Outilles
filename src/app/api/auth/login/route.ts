import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

// Demo users database
const users = [
  { id: '1', email: 'demo@e-outilles.com', password: 'demo123', name: 'Demo User', role: 'customer' },
  { id: '2', email: 'admin@e-outilles.com', password: 'admin123', name: 'Admin', role: 'admin' },
]

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email et mot de passe requis' },
        { status: 400 }
      )
    }

    // Find user
    const user = users.find(u => u.email === email && u.password === password)

    if (!user) {
      return NextResponse.json(
        { error: 'Email ou mot de passe incorrect' },
        { status: 401 }
      )
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
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    })

    return NextResponse.json({
      success: true,
      user: { id: user.id, email: user.email, name: user.name, role: user.role }
    })

  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}