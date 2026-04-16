'use client'

import { useWishlistStore } from '@/lib/store/wishlist'
import { useCartStore } from '@/lib/store/cart'
import Link from 'next/link'

export default function WishlistPage() {
  const { items, removeItem } = useWishlistStore()
  const addItem = useCartStore(state => state.addItem)

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-ingco-black pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="text-6xl mb-6">❤️</div>
          <h1 className="text-3xl font-bold text-white mb-4">Votre liste de favoris est vide</h1>
          <p className="text-gray-400 mb-8">Ajoutez des produits pour les retrouver facilement</p>
          <Link 
            href="/"
            className="bg-ingco-yellow text-ingco-black px-8 py-3 rounded-xl font-bold hover:bg-yellow-400 transition-colors inline-block"
          >
            Explorer le catalogue
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-ingco-black pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-white mb-8">Mes Favoris ({items.length})</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div key={item.id} className="bg-ingco-gray rounded-2xl overflow-hidden">
              <div className="h-48 bg-ingco-dark flex items-center justify-center text-6xl">
                {item.image}
              </div>
              <div className="p-4">
                <span className="text-xs text-ingco-yellow uppercase">{item.category}</span>
                <h3 className="text-white font-bold mt-1">{item.name}</h3>
                <p className="text-ingco-yellow font-bold text-xl mt-2">{item.price}€</p>
                <div className="flex gap-2 mt-4">
                  <button 
                    onClick={() => addItem(item)}
                    className="flex-1 bg-ingco-yellow text-ingco-black py-2 rounded-lg font-medium hover:bg-yellow-400 transition-colors"
                  >
                    Ajouter au panier
                  </button>
                  <button 
                    onClick={() => removeItem(item.id)}
                    className="px-4 border border-red-500 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
