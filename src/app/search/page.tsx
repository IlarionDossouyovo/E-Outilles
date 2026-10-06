'use client'

import { useState, useEffect } from 'react'
import { useCartStore } from '@/lib/store/cart'
import { useWishlistStore } from '@/lib/store/wishlist'
import Link from 'next/link'
import Logo from '@/components/Logo'
import { NavigationArrows, Icon } from '@/components/Icons'
import { categoryImage } from '@/lib/catalog'

export const dynamic = 'force-dynamic'

interface Product {
  id: string
  name: string
  slug: string
  price: number
  comparePrice?: number | null
  images: string
  stock?: number
  category?: { name: string; slug: string } | null
}

function firstImage(images: string): string | null {
  try {
    const parsed = JSON.parse(images)
    return Array.isArray(parsed) && parsed.length > 0 ? parsed[0] : null
  } catch {
    return null
  }
}

export default function SearchPage({ searchParams }: { searchParams: { category?: string } }) {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<{ name: string; slug: string }[]>([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState(searchParams?.category || 'Tous')
  const [sortBy, setSortBy] = useState('name')
  const [toast, setToast] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/categories')
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setCategories(Array.isArray(data) ? data : []))
      .catch(() => setCategories([]))
  }, [])

  useEffect(() => {
    setLoading(true)
    const categoryParam = category === 'Tous' ? '' : category
    fetch(`/api/products?category=${encodeURIComponent(categoryParam)}`)
      .then((res) => res.json())
      .then((data) => setProducts(Array.isArray(data) ? data : data.products || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }, [category])

  const addItem = useCartStore((state) => state.addItem)
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore()
  const { items: cartItems } = useCartStore()
  const { items: wishlistItems } = useWishlistStore()
  const showToast = (message: string) => {
    setToast(message)
    setTimeout(() => setToast(''), 2000)
  }

  const filteredProducts = products
    .filter(
      (p) =>
        (category === 'Tous' || p.category?.name === category || p.category?.slug === category.toLowerCase()) &&
        p.name.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price
      if (sortBy === 'price-desc') return b.price - a.price
      return a.name.localeCompare(b.name)
    })

  return (
    <div className="min-h-screen bg-ingco-black">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-ingco-black/95 backdrop-blur-md border-b border-ingco-gray">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Logo variant="horizontal" size={40} />
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-gray-300 hover:text-ingco-yellow">Accueil</Link>
            <Link href="/search" className="text-ingco-yellow">Produits</Link>
            <Link href="/categories" className="text-gray-300 hover:text-ingco-yellow">Catégories</Link>
            <Link href="/about" className="text-gray-300 hover:text-ingco-yellow">À propos</Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/wishlist" className="relative" aria-label="Favoris">
              <Icon name="heart" className="w-5 h-5 text-gray-300 hover:text-ingco-yellow" />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-ingco-yellow text-ingco-black text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {wishlistItems.length}
                </span>
              )}
            </Link>
            <Link href="/cart" className="relative" aria-label="Panier">
              <Icon name="cart" className="w-5 h-5 text-gray-300 hover:text-ingco-yellow" />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-ingco-yellow text-ingco-black text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </Link>
          </div>
        </div>
      </nav>

      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-ingco-yellow text-ingco-black px-6 py-3 rounded-xl font-bold shadow-lg animate-pop-in">
          {toast}
        </div>
      )}

      <div className="pt-24 pb-16 max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-white mb-8">Produits</h1>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Icon name="search" className="w-5 h-5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un outil..."
              className="w-full bg-ingco-gray border border-ingco-dark rounded-xl pl-10 pr-4 py-3 text-white focus:border-ingco-yellow focus:outline-none"
            />
          </div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-ingco-gray border border-ingco-dark rounded-xl px-4 py-3 text-white focus:border-ingco-yellow focus:outline-none"
          >
            <option value="Tous">Toutes les catégories</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>{c.name}</option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-ingco-gray border border-ingco-dark rounded-xl px-4 py-3 text-white focus:border-ingco-yellow focus:outline-none"
          >
            <option value="name">Nom A-Z</option>
            <option value="price-asc">Prix croissant</option>
            <option value="price-desc">Prix décroissant</option>
          </select>
        </div>

        <p className="text-gray-400 mb-6">{filteredProducts.length} produit(s)</p>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-ingco-gray/60 rounded-2xl h-64 animate-pulse" />
            ))
          ) : (
            filteredProducts.map((product, i) => {
              const img = firstImage(product.images)
              return (
                <div
                  key={product.id}
                  className="card-premium bg-ingco-gray rounded-2xl overflow-hidden animate-fade-in-up group border border-white/5"
                  style={{ animationDelay: `${Math.min(i * 0.04, 0.4)}s` }}
                >
                  <Link href={`/produit-detail-page/${product.slug || product.id}`}>
                    <div className="h-40 bg-ingco-dark flex items-center justify-center overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img || categoryImage(product.category?.slug)}
                        alt={product.name}
                        className="max-h-36 object-contain card-icon"
                      />
                    </div>
                  </Link>
                  <div className="p-4">
                    <Link href={`/categories/${product.category?.slug}`} className="text-xs text-ingco-yellow uppercase hover:underline">
                      {product.category?.name || 'Catégorie'}
                    </Link>
                    <Link href={`/produit-detail-page/${product.slug || product.id}`}>
                      <h3 className="text-white font-bold mt-1 line-clamp-2 group-hover:text-ingco-yellow transition-colors">{product.name}</h3>
                    </Link>
                    <div className="flex items-center gap-2 mt-2">
                      <p className="text-ingco-yellow font-bold text-xl">{product.price.toFixed(2)}€</p>
                      {product.comparePrice && (
                        <p className="text-gray-500 line-through text-sm">{product.comparePrice.toFixed(2)}€</p>
                      )}
                    </div>
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() =>
                          addItem({
                            id: product.id,
                            name: product.name,
                            price: product.price,
                            image: product.images,
                            category: product.category?.name || '',
                          })
                        }
                        className="flex-1 bg-ingco-yellow text-ingco-black py-2 rounded-lg font-medium hover:bg-yellow-400 transition-colors"
                      >
                        Ajouter
                      </button>
                      <button
                        onClick={() => {
                          if (isInWishlist(product.id)) {
                            removeFromWishlist(product.id)
                            showToast('Retiré des favoris')
                          } else {
                            addToWishlist({
                              id: product.id,
                              name: product.name,
                              price: product.price,
                              image: product.images,
                              category: product.category?.name || '',
                            })
                            showToast('Ajouté aux favoris')
                          }
                        }}
                        aria-label="Favoris"
                        className={`px-3 rounded-lg border ${isInWishlist(product.id) ? 'border-ingco-yellow text-ingco-yellow' : 'border-ingco-gray text-gray-400'}`}
                      >
                        <Icon name="heart" className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <Icon name="search" className="w-14 h-14 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">Aucun produit trouvé</p>
            <Link href="/search" className="text-ingco-yellow hover:underline mt-4 inline-block">Voir tout</Link>
          </div>
        )}

        <div className="mt-12">
          <NavigationArrows current="/search" />
        </div>
      </div>
    </div>
  )
}
