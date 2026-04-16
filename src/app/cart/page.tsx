'use client'

import { useCartStore } from '@/lib/store/cart'
import Link from 'next/link'

export default function CartPage() {
  const { items, updateQuantity, removeItem, getTotal, clearCart } = useCartStore()

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-ingco-black pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="text-6xl mb-6">🛒</div>
          <h1 className="text-3xl font-bold text-white mb-4">Votre panier est vide</h1>
          <p className="text-gray-400 mb-8">Decouvrez notre catalogue et ajoutez des produits</p>
          <Link 
            href="/"
            className="bg-ingco-yellow text-ingco-black px-8 py-3 rounded-xl font-bold hover:bg-yellow-400 transition-colors inline-block"
          >
            Retour au catalogue
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-ingco-black pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-white mb-8">Mon Panier</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="bg-ingco-gray rounded-2xl p-4 flex gap-4">
                <div className="w-24 h-24 bg-ingco-dark rounded-xl flex items-center justify-center text-4xl">
                  {item.image}
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-bold">{item.name}</h3>
                  <p className="text-ingco-yellow font-bold">{item.price}€</p>
                  <div className="flex items-center gap-3 mt-2">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 bg-ingco-dark rounded-lg text-white hover:bg-gray-700"
                    >
                      -
                    </button>
                    <span className="text-white">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 bg-ingco-dark rounded-lg text-white hover:bg-gray-700"
                    >
                      +
                    </button>
                  </div>
                </div>
                <button 
                  onClick={() => removeItem(item.id)}
                  className="text-red-500 hover:text-red-400"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="bg-ingco-gray rounded-2xl p-6 h-fit">
            <h2 className="text-xl font-bold text-white mb-4">Resume</h2>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-400">
                <span>Sous-total</span>
                <span>{getTotal().toFixed(2)}€</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Livraison</span>
                <span>Gratuit</span>
              </div>
              <div className="border-t border-ingco-dark pt-3 flex justify-between text-white font-bold text-xl">
                <span>Total</span>
                <span className="text-ingco-yellow">{getTotal().toFixed(2)}€</span>
              </div>
            </div>
            <button className="w-full bg-ingco-yellow text-ingco-black py-3 rounded-xl font-bold hover:bg-yellow-400 transition-colors">
              Passer la commande
            </button>
            <button 
              onClick={clearCart}
              className="w-full mt-3 border border-red-500 text-red-500 py-2 rounded-xl hover:bg-red-500 hover:text-white transition-colors"
            >
              Vider le panier
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
