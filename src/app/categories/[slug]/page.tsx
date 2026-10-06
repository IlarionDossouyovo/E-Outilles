import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import prisma from '@/lib/db/prisma'
import Logo from '@/components/Logo'
import { NavigationArrows, Breadcrumb, Icon } from '@/components/Icons'
import { categoryImage, categoryMeta, subcategoriesFor } from '@/lib/catalog'
import { CATEGORY_META } from '@/lib/catalog'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return CATEGORY_META.map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const cat = await prisma.category.findUnique({ where: { slug } })
  if (!cat) return { title: 'Catégorie non trouvée' }
  return {
    title: `${cat.name} | Catégories E-Outilles`,
    description: cat.description || `Découvrez la gamme ${cat.name} chez E-Outilles.`,
  }
}

function firstImage(images: string): string | null {
  try {
    const parsed = JSON.parse(images)
    return Array.isArray(parsed) && parsed.length > 0 ? parsed[0] : null
  } catch {
    return null
  }
}

export default async function CategoryDetailPage({ params }: Props) {
  const { slug } = await params
  const category = await prisma.category.findUnique({
    where: { slug },
    include: { _count: { select: { products: true } }, children: true },
  })

  if (!category) notFound()

  const products = await prisma.product.findMany({
    where: { categoryId: category.id },
    orderBy: { createdAt: 'desc' },
    take: 24,
  })

  const meta = categoryMeta(slug)
  const subs = subcategoriesFor(slug)
  const posts = await prisma.blogPost.findMany({
    where: { published: true, category: category.name },
    orderBy: { createdAt: 'desc' },
    take: 3,
  })

  return (
    <div className="min-h-screen bg-ingco-black">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-ingco-black/95 backdrop-blur-md border-b border-ingco-gray">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Logo variant="horizontal" size={40} />
          <div className="flex items-center gap-5">
            <Link href="/categories" className="text-gray-300 hover:text-ingco-yellow text-sm">Catégories</Link>
            <Link href="/cart" className="text-gray-300 hover:text-ingco-yellow" aria-label="Panier">
              <Icon name="cart" className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-24 pb-10">
        <div className="max-w-7xl mx-auto px-4">
          <Breadcrumb items={[{ label: 'Catégories', href: '/categories' }, { label: category.name }]} />
          <div className="relative rounded-3xl overflow-hidden border border-white/5 animate-fade-in-up"
            style={{ background: `linear-gradient(135deg, ${meta?.color || category.color || '#FFC400'}33, #121212)` }}>
            <div className="grid sm:grid-cols-[auto,1fr] items-center gap-6 p-6 sm:p-10">
              <div className="w-28 h-28 sm:w-40 sm:h-40 rounded-2xl bg-ingco-black/60 flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={categoryImage(slug)} alt={category.name} className="w-24 h-24 sm:w-32 sm:h-32 object-contain animate-float" />
              </div>
              <div>
                <span className="text-ingco-yellow text-sm font-semibold uppercase tracking-wide">Catégorie</span>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mt-1 mb-3">{category.name}</h1>
                <p className="text-gray-300 max-w-2xl">{category.description}</p>
                <p className="text-ingco-yellow font-bold mt-3">{category._count.products} produits disponibles</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sub-categories */}
      {subs.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 pb-8">
          <h2 className="text-white font-bold text-xl mb-4">Sous-catégories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {subs.map((sub, i) => (
              <div
                id={sub.toLowerCase().replace(/\s+/g, '-')}
                key={sub}
                className="card-premium bg-ingco-gray rounded-2xl p-5 border border-white/5 animate-fade-in-up"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <Icon name="wrench" className="w-6 h-6 text-ingco-yellow mb-2 card-icon" />
                <p className="text-white font-semibold text-sm">{sub}</p>
                <Link href={`/search?category=${slug}`} className="text-ingco-yellow text-xs hover:underline">
                  Voir les produits
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Products */}
      <section className="max-w-7xl mx-auto px-4 pb-10">
        <h2 className="text-white font-bold text-xl mb-4">Produits {category.name}</h2>
        {products.length === 0 ? (
          <div className="bg-ingco-gray rounded-2xl p-10 text-center text-gray-400">
            Aucun produit dans cette catégorie pour le moment.
            <div className="mt-4">
              <Link href="/search" className="text-ingco-yellow hover:underline">Parcourir tout le catalogue</Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((p, i) => {
              const img = firstImage(p.images)
              return (
                <Link
                  key={p.id}
                  href={`/produit-detail-page/${p.slug}`}
                  className="card-premium bg-ingco-gray rounded-2xl p-4 border border-white/5 animate-fade-in-up group"
                  style={{ animationDelay: `${Math.min(i * 0.04, 0.4)}s` }}
                >
                  <div className="h-28 flex items-center justify-center mb-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img || categoryImage(slug)} alt={p.name} className="max-h-28 object-contain card-icon" />
                  </div>
                  <p className="text-white text-sm font-semibold line-clamp-2 group-hover:text-ingco-yellow transition-colors">{p.name}</p>
                  <p className="text-ingco-yellow font-bold mt-1">{p.price.toFixed(2)}€</p>
                  {p.stock <= 0 && <span className="text-red-400 text-xs">Rupture de stock</span>}
                </Link>
              )
            })}
          </div>
        )}
      </section>

      {/* Related blog posts */}
      {posts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 pb-12">
          <h2 className="text-white font-bold text-xl mb-4">Articles liés</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="card-premium bg-ingco-gray rounded-2xl overflow-hidden border border-white/5 animate-fade-in-up"
              >
                {post.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={post.image} alt={post.title} className="w-full h-36 object-cover" />
                )}
                <div className="p-4">
                  <span className="text-ingco-yellow text-xs uppercase">{post.category}</span>
                  <h3 className="text-white font-semibold mt-1 line-clamp-2">{post.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className="max-w-7xl mx-auto px-4 pb-16">
        <NavigationArrows current="/categories" />
      </div>
    </div>
  )
}
