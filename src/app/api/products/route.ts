// API Products - E-Outilles
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { requireAdmin } from '@/lib/security/auth'
import { searchTerms } from '@/lib/search'
import { enqueueProductKit } from '@/lib/marketing/queue'
import { parseImages } from '@/lib/images'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')
  const search = searchParams.get('search')

  try {
    const where: Record<string, unknown> = {}
    
    // Only filter by category if it's not empty
    if (category && category.trim() !== '') {
      where.category = { slug: category }
    }
    
    if (search && search.trim() !== '') {
      const terms = searchTerms(search)
      if (terms.length > 0) {
        where.OR = terms.flatMap((term) => [
          { name: term },
          { description: term },
          { sku: term },
        ])
      }
    }

    const products = await prisma.product.findMany({
      where,
      include: { category: true },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(products)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const admin = await requireAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
  }

  try {
    const body = await request.json()
    const { name, slug, description, price, comparePrice, sku, stock, images, features, categoryId } = body

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price: parseFloat(price),
        comparePrice: comparePrice ? parseFloat(comparePrice) : null,
        sku,
        stock: parseInt(stock) || 0,
        images: JSON.stringify(images || []),
        features: features ? JSON.stringify(features) : null,
        categoryId
      }
    })

    // Auto-launch: a product added with an image gets its AI marketing kit
    // queued, then published across every configured channel by the worker.
    if (parseImages(product.images).length > 0) {
      try {
        await enqueueProductKit(product.id, { channels: body.channels })
      } catch (err) {
        console.error('Failed to queue marketing kit:', err)
      }
    }

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
}