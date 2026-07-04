'use client'

import { useState, useEffect } from 'react'
import { useCartStore } from '@/lib/store/cart'
import { useWishlistStore } from '@/lib/store/wishlist'
import Link from 'next/link'
import PageNavigation from '@/components/PageNavigation'
import Logo from '@/components/Logo'

// Force dynamic for SSR
export const dynamic = 'force-dynamic'

// Category icons
const categoryIcons: Record<string, string> = {
  'construction': '🏗️',
  'electricite': '⚡',
  'garage': '🚗',
  'jardinage': '🌿'
}

const categories = ['Tous', 'Construction', 'Électricité', 'Garage', 'Jardinage']

export default function SearchPage({ searchParams }: { searchParams: { category?: string } }) {
  const [products, setProducts] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState(searchParams?.category || 'Tous')
  const [sortBy, setSortBy] = useState('name')
  const [toast, setToast] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const categoryParam = category === 'Tous' ? '' : category
    fetch(`/api/products?category=${encodeURIComponent(categoryParam)}`)
      .then(res => res.json())
      .then(data => setProducts(Array.isArray(data) ? data : data.products || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }, [category])
  
  const addItem = useCartStore(state => state.addItem)
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore()
  const { items: cartItems } = useCartStore()
  const { items: wishlistItems } = useWishlistStore()
  const showToast = (message: string) => {
    setToast(message)
    setTimeout(() => setToast(''), 2000)
  }
  
  const filteredProducts = products
    .filter(p => (category === 'Tous' || p.category?.name === category || p.category?.slug === category?.toLowerCase()) && p.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price
      if (sortBy === 'price-desc') return b.price - a.price
      return a.name.localeCompare(b.name)
    })

  const Nav = () => (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-ingco-black/95 backdrop-blur-md border-b border-ingco-gray">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Logo variant="horizontal" size={40} />
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-gray-300 hover:text-ingco-yellow">Accueil</Link>
          <Link href="/search" className="text-ingco-yellow">Produits</Link>
          <Link href="/about" className="text-gray-300 hover:text-ingco-yellow">À propos</Link>
          <Link href="/contact" className="text-gray-300 hover:text-ingco-yellow">Contact</Link>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/wishlist" className="relative">
            <span className="text-xl">🤍</span>
            {wishlistItems.length > 0 && <span className="absolute -top-2 -right-2 bg-ingco-yellow text-ingco-black text-xs w-5 h-5 rounded-full flex items-center justify-center">{wishlistItems.length}</span>}
          </Link>
          <Link href="/cart" className="relative">
            <span className="text-xl">🛒</span>
            {cartItems.length > 0 && <span className="absolute -top-2 -right-2 bg-ingco-yellow text-ingco-black text-xs w-5 h-5 rounded-full flex items-center justify-center">{cartItems.length}</span>}
          </Link>
        </div>
      </div>
    </nav>
  )

  const Footer = () => (
    <footer className="bg-ingco-dark border-t border-ingco-gray py-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p className="text-gray-500 text-sm">© 2026 E-Outilles.</p>
      </div>
    </footer>
  )

  const handleAddToCart = (product: any) => {
    addItem(product)
    showToast(`✓ ${product.name} ajouté au panier!`)
  }

  const handleWishlist = (product: any) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id)
      showToast(`💔 Retiré des favoris`)
    } else {
      addToWishlist(product)
      showToast(`❤️ ${product.name} ajouté aux favoris!`)
    }
  }

  return (
    <div className="min-h-screen bg-ingco-black">
      <Nav />
      
      {/* Toast */}
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-ingco-yellow text-ingco-black px-6 py-3 rounded-xl font-bold shadow-lg animate-pulse">
          {toast}
        </div>
      )}
      
      <div className="pt-24 pb-16 max-w-7xl mx-auto px-4">
        <PageNavigation />
        <h1 className="text-3xl font-bold text-white mb-8">Produits</h1>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher..."
              className="w-full bg-ingco-gray border border-ingco-dark rounded-xl px-4 py-3 text-white"
            />
          </div>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="bg-ingco-gray border border-ingco-dark rounded-xl px-4 py-3 text-white">
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="bg-ingco-gray border border-ingco-dark rounded-xl px-4 py-3 text-white">
            <option value="name">Nom A-Z</option>
            <option value="price-asc">Prix ↑</option>
            <option value="price-desc">Prix ↓</option>
          </select>
        </div>

        <p className="text-gray-400 mb-6">{filteredProducts.length} produit(s)</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading ? (
            <div className="col-span-full text-center py-12">
              <div className="animate-spin text-4xl">⏳</div>
              <p className="text-gray-400 mt-4">Chargement...</p>
            </div>
          ) : filteredProducts.map((product) => (
            <Link key={product.id} href={`/produit-detail-page/${product.id}`} className="block bg-ingco-gray rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-ingco-yellow/10 transition-all hover:-translate-y-2 group">
              <div className="h-40 bg-ingco-dark flex items-center justify-center text-5xl">
                {product.category?.icon || '🔧'}
              </div>
              <div className="p-4">
                <span className="text-xs text-ingco-yellow uppercase">{product.category?.name || 'Catégorie'}</span>
                <h3 className="text-white font-bold mt-1">{product.name}</h3>
                <div className="flex items-center gap-2 mt-2">
                  <p className="text-ingco-yellow font-bold text-xl">{product.price}€</p>
                  {product.comparePrice && (
                    <p className="text-gray-500 line-through text-sm">{product.comparePrice}€</p>
                  )}
                </div>
                <div className="flex gap-2 mt-4" onClick={(e) => e.preventDefault()}>
                  <button 
                    onClick={() => handleAddToCart(product)}
                    className="flex-1 bg-ingco-yellow text-ingco-black py-2 rounded-lg font-medium hover:bg-yellow-400"
                  >
                    Ajouter
                  </button>
                  <button 
                    onClick={() => handleWishlist(product)}
                    className={`px-3 rounded-lg border ${isInWishlist(product.id) ? 'border-ingco-yellow text-ingco-yellow' : 'border-ingco-gray text-gray-400'}`}
                  >
                    {isInWishlist(product.id) ? '❤️' : '🤍'}
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-gray-400">Aucun produit trouvé</p>
            <Link href="/search" className="text-ingco-yellow hover:underline mt-4 inline-block">Voir tout</Link>
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}