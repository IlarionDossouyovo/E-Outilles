'use client'

import { useState } from 'react'
import { useCartStore } from '@/lib/store/cart'
import { useWishlistStore } from '@/lib/store/wishlist'
import Link from 'next/link'

// Mock products database
const allProducts = [
  { id: '1', name: 'Perceuse visseuse INGCO 20V', price: 89.99, category: 'Construction', image: '🔩' },
  { id: '2', name: 'Marteau perforateur SDS Max 1500W', price: 249.99, category: 'Construction', image: '⚒️' },
  { id: '3', name: 'Meuleuse angulaire 125mm', price: 79.99, category: 'Construction', image: '⚙️' },
  { id: '4', name: 'Multimetre digital professionnel', price: 59.99, category: 'Electricite', image: '📊' },
  { id: '5', name: 'Pinces isolees professionnelles', price: 45.99, category: 'Electricite', image: '🔌' },
  { id: '6', name: 'Testeur de tension sans contact', price: 29.99, category: 'Electricite', image: '📡' },
  { id: '7', name: 'Kit cles mecaniciennes 50pcs', price: 79.99, category: 'Garage', image: '🔧' },
  { id: '8', name: 'Cric hydraulique 3T', price: 149.99, category: 'Garage', image: '🚗' },
  { id: '9', name: 'Compresseur portable 50L', price: 299.99, category: 'Garage', image: '💨' },
  { id: '10', name: 'Tondeuse thermique pro 160cc', price: 399.99, category: 'Jardinage', image: '🌿' },
  { id: '11', name: 'Tronconneuse thermique 45cm', price: 299.99, category: 'Jardinage', image: '🪚' },
  { id: '12', name: 'Systeme irrigation automatique', price: 189.99, category: 'Jardinage', image: '💧' },
]

const categories = ['Tous', 'Construction', 'Electricite', 'Garage', 'Jardinage']

export default function SearchPage() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('Tous')
  const [sortBy, setSortBy] = useState('name')
  
  const addItem = useCartStore(state => state.addItem)
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore()

  const filteredProducts = allProducts
    .filter(p => 
      (category === 'Tous' || p.category === category) &&
      p.name.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price
      if (sortBy === 'price-desc') return b.price - a.price
      return a.name.localeCompare(b.name)
    })

  return (
    <div className="min-h-screen bg-ingco-black pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-white mb-8">Recherche</h1>

        {/* Search Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un produit..."
              className="w-full bg-ingco-gray border border-ingco-dark rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-ingco-yellow focus:outline-none"
            />
          </div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-ingco-gray border border-ingco-dark rounded-xl px-4 py-3 text-white focus:border-ingco-yellow focus:outline-none"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-ingco-gray border border-ingco-dark rounded-xl px-4 py-3 text-white focus:border-ingco-yellow focus:outline-none"
          >
            <option value="name">Nom A-Z</option>
            <option value="price-asc">Prix croissant</option>
            <option value="price-desc">Prix decroissant</option>
          </select>
        </div>

        {/* Results Count */}
        <p className="text-gray-400 mb-6">{filteredProducts.length} produit(s) trouve(s)</p>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-ingco-gray rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-ingco-yellow/10 transition-all hover:-translate-y-2 group">
              <div className="h-40 bg-ingco-dark flex items-center justify-center text-5xl group-hover:scale-110 transition-transform">
                {product.image}
              </div>
              <div className="p-4">
                <span className="text-xs text-ingco-yellow uppercase">{product.category}</span>
                <h3 className="text-white font-bold mt-1">{product.name}</h3>
                <p className="text-ingco-yellow font-bold text-xl mt-2">{product.price}€</p>
                <div className="flex gap-2 mt-4">
                  <button 
                    onClick={() => addItem(product)}
                    className="flex-1 bg-ingco-yellow text-ingco-black py-2 rounded-lg font-medium hover:bg-yellow-400 transition-colors"
                  >
                    Ajouter
                  </button>
                  <button 
                    onClick={() => isInWishlist(product.id) ? removeFromWishlist(product.id) : addToWishlist(product)}
                    className={`px-3 rounded-lg border transition-colors ${
                      isInWishlist(product.id) 
                        ? 'border-ingco-yellow text-ingco-yellow' 
                        : 'border-ingco-gray text-gray-400 hover:border-ingco-yellow hover:text-ingco-yellow'
                    }`}
                  >
                    {isInWishlist(product.id) ? '❤️' : '🤍'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-gray-400">Aucun produit ne correspond a votre recherche</p>
            <Link href="/" className="text-ingco-yellow hover:underline mt-4 inline-block">
              Retour au catalogue
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
