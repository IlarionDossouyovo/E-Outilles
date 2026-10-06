// Newsletter subscription - public
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'

export async function POST(request: Request) {
  try {
    const { email, name, country } = await request.json()
    const cleanEmail = String(email || '').trim().toLowerCase()

    if (!cleanEmail || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(cleanEmail)) {
      return NextResponse.json({ error: 'Email invalide' }, { status: 400 })
    }

    const subscriber = await prisma.subscriber.upsert({
      where: { email: cleanEmail },
      update: { status: 'active', name: name || undefined, country: country || undefined },
      create: { email: cleanEmail, name: name || null, country: country || null },
    })

    return NextResponse.json({ success: true, subscriber }, { status: 201 })
  } catch (error) {
    console.error('Newsletter error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function GET() {
  const admin = await (await import('@/lib/security/auth')).requireAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
  }
  const subscribers = await prisma.subscriber.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json(subscribers)
}
