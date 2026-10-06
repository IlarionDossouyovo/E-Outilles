import type { Metadata } from 'next'
import prisma from '@/lib/db/prisma'

interface Props {
  params: Promise<{ id: string }>
}

// The product page itself is a client component, so its SEO metadata lives here.
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  try {
    const product = await prisma.product.findFirst({
      where: { OR: [{ id }, { slug: id }] },
      select: { name: true, slug: true, description: true, images: true, price: true, category: { select: { name: true } } },
    })
    if (product) {
      const description =
        product.description?.slice(0, 160) ||
        `${product.name}${product.category ? ` - ${product.category.name}` : ''} au meilleur prix chez E-Outille.`
      let image: string | undefined
      try {
        const parsed = JSON.parse(product.images)
        if (Array.isArray(parsed) && parsed.length > 0) image = parsed[0]
      } catch {
        // images is not valid JSON: fall back to the dynamic OG image.
      }
      return {
        title: `${product.name} | E-Outille`,
        description,
        alternates: { canonical: `/produit-detail-page/${product.slug}` },
        openGraph: {
          type: 'website',
          title: product.name,
          description,
          url: `/produit-detail-page/${product.slug}`,
          ...(image ? { images: [{ url: image }] } : {}),
        },
      }
    }
  } catch {
    // Database unavailable at build time: fall back to generic metadata.
  }
  return { title: 'Produit | E-Outille' }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
