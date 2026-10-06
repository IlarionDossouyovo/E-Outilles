'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import Logo from '@/components/Logo'

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

const FALLBACK_ICONS = ['🛠️', '⚡', '🔧', '🔩', '📏', '🌿', '🚗', '🧰', '🦺', '💧', '🔥', '⚙️']

const GRADIENTS = [
  'from-red-500/80 to-red-700/60',
  'from-blue-500/80 to-blue-700/60',
  'from-emerald-500/80 to-emerald-700/60',
  'from-purple-500/80 to-purple-700/60',
  'from-amber-500/80 to-amber-700/60',
  'from-cyan-500/80 to-cyan-700/60',
  'from-pink-500/80 to-pink-700/60',
  'from-indigo-500/80 to-indigo-700/60',
]

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
              <Link href="/chat" className="text-gray-300 hover:text-ingco-yellow transition-colors">Assistant</Link>
              <Link href="/cart" className="text-gray-300 hover:text-ingco-yellow transition-colors">🛒</Link>
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
            Trouvez tous vos outils professionnels par catégorie
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
              <span className="text-xl">{cat.icon || FALLBACK_ICONS[i % FALLBACK_ICONS.length]}</span>
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
                <div className="w-16 h-16 rounded-2xl bg-ingco-black flex items-center justify-center text-4xl card-icon">
                  {current.icon || '🛠️'}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">{current.name}</h2>
                  <p className="text-gray-400 text-sm">{current.description}</p>
                  <span className="inline-block mt-1 text-ingco-yellow text-sm font-semibold">
                    {countFor(current)} produits
                  </span>
                </div>
              </div>
              <Link
                href={`/search?category=${current.slug}`}
                className="bg-ingco-yellow text-ingco-black px-6 py-3 rounded-xl font-bold hover:bg-yellow-400 transition-all hover:scale-105 text-center"
              >
                Voir tous les produits →
              </Link>
            </div>

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
                          <span className="text-4xl card-icon">🔧</span>
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
      <section className="max-w-7xl mx-auto px-4 pb-16">
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
                href={`/search?category=${cat.slug}`}
                className={`card-premium bg-gradient-to-br ${GRADIENTS[i % GRADIENTS.length]} rounded-2xl p-5 sm:p-8 text-center border border-white/5 animate-fade-in-up stagger-${(i % 6) + 1}`}
              >
                <div className="text-4xl sm:text-6xl mb-3 card-icon">{cat.icon || FALLBACK_ICONS[i % FALLBACK_ICONS.length]}</div>
                <h3 className="text-white font-bold text-base sm:text-xl mb-1">{cat.name}</h3>
                <p className="text-white/70 text-xs sm:text-sm line-clamp-2">{cat.description}</p>
                <span className="inline-block mt-2 text-white/90 text-xs font-semibold bg-black/20 px-2 py-1 rounded-full">
                  {countFor(cat)} produits
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>

      <footer className="bg-ingco-gray py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-400 text-sm">
          <p>&copy; 2026 E-Outilles By ELECTRON. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  )
}
