// API Products - E-Outilles
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'

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
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } }
      ]
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

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
}