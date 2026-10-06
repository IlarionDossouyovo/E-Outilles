'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import Logo from '@/components/Logo'
import { NavigationArrows, Icon } from '@/components/Icons'
import { categoryImage, subcategoriesFor } from '@/lib/catalog'

interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  icon: string | null
  color: string | null
  image: string | null
  _count?: { products: number }
}

interface Product {
  id: string
  name: string
  slug: string
  price: number
  images: string
  category?: { slug: string } | null
}

function firstImage(images: string): string | null {
  try {
    const parsed = JSON.parse(images)
    return Array.isArray(parsed) && parsed.length > 0 ? parsed[0] : null
  } catch {
    return null
  }
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/categories').then((r) => (r.ok ? r.json() : [])),
      fetch('/api/products').then((r) => (r.ok ? r.json() : [])),
    ])
      .then(([cats, prods]) => {
        const list = Array.isArray(cats) ? cats : []
        setCategories(list)
        setProducts(Array.isArray(prods) ? prods : [])
        setActiveCategory(list[0]?.slug ?? null)
      })
      .catch(() => setCategories([]))
      .finally(() => setLoading(false))
  }, [])

  const countFor = (cat: Category) =>
    cat._count?.products ?? products.filter((p) => p.category?.slug === cat.slug).length

  const current = useMemo(
    () => categories.find((c) => c.slug === activeCategory) ?? null,
    [categories, activeCategory]
  )

  const currentProducts = useMemo(
    () => products.filter((p) => p.category?.slug === activeCategory).slice(0, 4),
    [products, activeCategory]
  )

  return (
    <div className="min-h-screen bg-ingco-black">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-ingco-black/95 backdrop-blur-md border-b border-ingco-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Logo variant="horizontal" size={40} />
            <div className="hidden md:flex items-center gap-8">
              <Link href="/" className="text-gray-300 hover:text-ingco-yellow transition-colors">Accueil</Link>
              <Link href="/categories" className="text-ingco-yellow font-semibold">Catégories</Link>
              <Link href="/search" className="text-gray-300 hover:text-ingco-yellow transition-colors">Produits</Link>
              <Link href="/blog" className="text-gray-300 hover:text-ingco-yellow transition-colors">Blog</Link>
              <Link href="/cart" className="text-gray-300 hover:text-ingco-yellow transition-colors" aria-label="Panier">
                <Icon name="cart" className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <section className="pt-24 pb-12 bg-gradient-to-b from-ingco-gray to-ingco-black">
        <div className="max-w-7xl mx-auto px-4 text-center animate-fade-in-up">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Catégories de Produits
          </h1>
          <p className="text-gray-400 text-base sm:text-lg">
            Trouvez tous vos outils professionnels par catégorie et sous-catégorie
          </p>
        </div>
      </section>

      {/* Category tabs — horizontally scrollable on mobile */}
      <section className="max-w-7xl mx-auto px-4 pb-8">
        <div className="flex gap-3 overflow-x-auto pb-2 sm:flex-wrap sm:justify-center sm:overflow-visible">
          {categories.map((cat, i) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.slug)}
              className={`shrink-0 px-4 sm:px-6 py-3 rounded-xl flex items-center gap-2 transition-all duration-300 animate-pop-in ${
                activeCategory === cat.slug
                  ? 'bg-ingco-yellow text-ingco-black font-bold scale-105 shadow-lg shadow-ingco-yellow/20'
                  : 'bg-ingco-gray text-gray-300 hover:bg-gray-700 hover:-translate-y-0.5'
              }`}
              style={{ animationDelay: `${Math.min(i * 0.03, 0.3)}s` }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={categoryImage(cat.slug)} alt="" className="w-6 h-6 object-contain rounded" />
              <span className="text-sm sm:text-base whitespace-nowrap">{cat.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Active category detail */}
      {current && (
        <section className="max-w-7xl mx-auto px-4 pb-10 animate-fade-in">
          <div className="bg-ingco-gray rounded-3xl p-6 sm:p-8 border border-ingco-dark">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-ingco-black flex items-center justify-center overflow-hidden card-icon">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={categoryImage(current.slug)} alt={current.name} className="w-12 h-12 object-contain" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">{current.name}</h2>
                  <p className="text-gray-400 text-sm">{current.description}</p>
                  <span className="inline-block mt-1 text-ingco-yellow text-sm font-semibold">
                    {countFor(current)} produits
                  </span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Link
                  href={`/categories/${current.slug}`}
                  className="bg-ingco-gray border border-ingco-yellow/40 text-ingco-yellow px-6 py-3 rounded-xl font-bold hover:bg-ingco-yellow/10 transition-all text-center"
                >
                  Page catégorie
                </Link>
                <Link
                  href={`/search?category=${current.slug}`}
                  className="bg-ingco-yellow text-ingco-black px-6 py-3 rounded-xl font-bold hover:bg-yellow-400 transition-all hover:scale-105 text-center"
                >
                  Voir tous les produits
                </Link>
              </div>
            </div>

            {/* Sub-categories */}
            {subcategoriesFor(current.slug).length > 0 && (
              <div className="mb-6">
                <h3 className="text-white font-semibold mb-3 text-sm uppercase tracking-wide">Sous-catégories</h3>
                <div className="flex flex-wrap gap-2">
                  {subcategoriesFor(current.slug).map((sub) => (
                    <Link
                      key={sub}
                      href={`/categories/${current.slug}#${encodeURIComponent(sub.toLowerCase().replace(/\s+/g, '-'))}`}
                      className="px-4 py-2 rounded-full bg-ingco-black border border-white/10 text-gray-300 text-sm hover:border-ingco-yellow/50 hover:text-ingco-yellow transition-all"
                    >
                      {sub}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {currentProducts.length > 0 && (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {currentProducts.map((p, i) => {
                  const img = firstImage(p.images)
                  return (
                    <Link
                      key={p.id}
                      href={`/produit-detail-page/${p.slug}`}
                      className="card-premium bg-ingco-black rounded-2xl p-4 border border-ingco-dark animate-fade-in-up"
                      style={{ animationDelay: `${i * 0.06}s` }}
                    >
                      <div className="h-24 flex items-center justify-center mb-3">
                        {img ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={img} alt={p.name} className="max-h-24 object-contain card-icon" />
                        ) : (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={categoryImage(p.category?.slug)} alt={p.name} className="max-h-24 object-contain card-icon" />
                        )}
                      </div>
                      <p className="text-white text-sm font-semibold line-clamp-2">{p.name}</p>
                      <p className="text-ingco-yellow font-bold mt-1">{p.price.toFixed(2)}€</p>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        </section>
      )}

      {/* All categories grid — responsive */}
      <section className="max-w-7xl mx-auto px-4 pb-12">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-ingco-gray/60 rounded-2xl h-40 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {categories.map((cat, i) => (
              <Link
                key={cat.id}
                href={`/categories/${cat.slug}`}
                className="card-premium bg-ingco-gray rounded-2xl p-5 sm:p-6 border border-white/5 animate-fade-in-up group"
                style={{ animationDelay: `${Math.min(i * 0.05, 0.4)}s` }}
              >
                <div
                  className="w-full h-28 sm:h-32 rounded-xl mb-3 flex items-center justify-center overflow-hidden"
                  style={{ background: `linear-gradient(135deg, ${cat.color || '#FFC400'}22, transparent)` }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={categoryImage(cat.slug)} alt={cat.name} className="max-h-24 sm:max-h-28 object-contain card-icon" />
                </div>
                <h3 className="text-white font-bold text-base sm:text-lg mb-1 group-hover:text-ingco-yellow transition-colors">{cat.name}</h3>
                <p className="text-gray-500 text-xs sm:text-sm line-clamp-2 mb-2">{cat.description}</p>
                <span className="inline-block text-ingco-yellow text-xs font-semibold">
                  {countFor(cat)} produits
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>

      <div className="max-w-7xl mx-auto px-4 pb-16">
        <NavigationArrows current="/categories" />
      </div>

      <footer className="bg-ingco-gray py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-400 text-sm">
          <p>&copy; 2026 E-Outilles By ELECTRON. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  )
}
