// Reseller application - public
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'

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
