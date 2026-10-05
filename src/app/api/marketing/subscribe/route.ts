// Newsletter subscription (marketing alias of /api/newsletter)
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
    console.error('Newsletter subscribe error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
