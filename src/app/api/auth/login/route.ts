import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db/prisma'
import { SESSION_COOKIE, SESSION_MAX_AGE, createSessionToken, SessionUser } from '@/lib/security/session'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email et mot de passe requis' },
        { status: 400 }
      )
    }

    // Find user and verify hashed password
    const user = await prisma.user.findUnique({
      where: { email: String(email).trim().toLowerCase() }
    })

    if (!user || !(await bcrypt.compare(String(password), user.password))) {
      return NextResponse.json(
        { error: 'Email ou mot de passe incorrect' },
        { status: 401 }
      )
    }

    const sessionUser: SessionUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      country: user.country,
    }

    // Set signed session cookie
    const cookieStore = await cookies()
    cookieStore.set(SESSION_COOKIE, await createSessionToken(sessionUser), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: SESSION_MAX_AGE,
      path: '/'
    })

    return NextResponse.json({ success: true, user: sessionUser })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}