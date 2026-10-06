import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db/prisma'
import { SESSION_COOKIE, SESSION_MAX_AGE, createSessionToken, SessionUser } from '@/lib/security/session'

export async function POST(request: Request) {
  try {
    const { name, email, password, country } = await request.json()

    const cleanEmail = String(email || '').trim().toLowerCase()
    const cleanName = String(name || '').trim()

    if (!cleanName || !cleanEmail || !password) {
      return NextResponse.json(
        { error: 'Nom, email et mot de passe requis' },
        { status: 400 }
      )
    }

    if (String(password).length < 6) {
      return NextResponse.json(
        { error: 'Le mot de passe doit contenir au moins 6 caractères' },
        { status: 400 }
      )
    }

    const existing = await prisma.user.findUnique({ where: { email: cleanEmail } })
    if (existing) {
      return NextResponse.json(
        { error: 'Un compte existe déjà avec cet email' },
        { status: 409 }
      )
    }

    const hashed = await bcrypt.hash(String(password), 10)
    const user = await prisma.user.create({
      data: {
        name: cleanName,
        email: cleanEmail,
        password: hashed,
        country: country || null,
        role: 'customer',
      },
    })

    const sessionUser: SessionUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      country: user.country,
    }

    const cookieStore = await cookies()
    cookieStore.set(SESSION_COOKIE, await createSessionToken(sessionUser), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: SESSION_MAX_AGE,
      path: '/',
    })

    return NextResponse.json({ success: true, user: sessionUser }, { status: 201 })
  } catch (error) {
    console.error('Register error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
