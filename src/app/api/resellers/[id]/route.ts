import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { requireAdmin } from '@/lib/security/auth'

const STATUSES = ['new', 'contacted', 'approved', 'rejected']

// Admin-only: update the processing status of a reseller application.
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const admin = await requireAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
  }

  try {
    const { status } = await request.json()
    if (!STATUSES.includes(status)) {
      return NextResponse.json({ error: 'Statut invalide' }, { status: 400 })
    }

    const updated = await prisma.resellerRequest.update({
      where: { id: params.id },
      data: { status },
    })
    return NextResponse.json({ success: true, request: updated })
  } catch (error) {
    console.error('Reseller update error:', error)
    return NextResponse.json({ error: 'Demande introuvable' }, { status: 404 })
  }
}
