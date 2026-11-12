// Product marketing assets: list the AI-generated kit for a product.
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { requireAdmin } from '@/lib/security/auth'

export const dynamic = 'force-dynamic'

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })

  const product = await prisma.product.findFirst({
    where: { OR: [{ id: params.id }, { slug: params.id }] },
    select: { id: true, name: true },
  })
  if (!product) return NextResponse.json({ error: 'Produit introuvable' }, { status: 404 })

  const [assets, jobs] = await Promise.all([
    prisma.productAsset.findMany({ where: { productId: product.id }, orderBy: { createdAt: 'desc' } }),
    prisma.publishJob.findMany({ where: { productId: product.id }, orderBy: { createdAt: 'desc' }, take: 50 }),
  ])

  return NextResponse.json({ product, assets, jobs })
}
