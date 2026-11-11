// Reseller applications. POST is public (the /revendeurs form); GET is
// admin-only so the team can actually read and process the requests.
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { requireAdmin } from '@/lib/security/auth'

export async function GET() {
  const admin = await requireAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
  }

  try {
    const requests = await prisma.resellerRequest.findMany({
      orderBy: { createdAt: 'desc' },
    })
    const counts = requests.reduce<Record<string, number>>((acc, r) => {
      acc[r.status] = (acc[r.status] || 0) + 1
      return acc
    }, {})
    return NextResponse.json({ requests, counts, total: requests.length })
  } catch (error) {
    console.error('Reseller list error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { company, name, email, phone, address, city, message } = await request.json()

    if (!company || !name || !email) {
      return NextResponse.json(
        { error: 'Entreprise, nom et email requis' },
        { status: 400 }
      )
    }

    const resellerRequest = await prisma.resellerRequest.create({
      data: {
        company: String(company).trim(),
        name: String(name).trim(),
        email: String(email).trim().toLowerCase(),
        phone: phone || null,
        address: address || null,
        city: city || null,
        message: message || null,
      },
    })

    return NextResponse.json({ success: true, id: resellerRequest.id }, { status: 201 })
  } catch (error) {
    console.error('Reseller request error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
