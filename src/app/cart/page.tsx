'use client'

import { useCartStore } from '@/lib/store/cart'
import Link from 'next/link'
import PageNavigation from '@/components/PageNavigation'
import Logo from '@/components/Logo'

export default function CartPage() {
  const { items, updateQuantity, removeItem, getTotal, clearCart } = useCartStore()

  // Navigation simple
  const Nav = () => (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-ingco-black/95 backdrop-blur-md border-b border-ingco-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Logo variant="horizontal" size={40} />
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-gray-300 hover:text-ingco-yellow transition-colors">Accueil</Link>
            <Link href="/search" className="text-gray-300 hover:text-ingco-yellow transition-colors">Produits</Link>
            <Link href="/about" className="text-gray-300 hover:text-ingco-yellow transition-colors">À propos</Link>
            <Link href="/contact" className="text-gray-300 hover:text-ingco-yellow transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </nav>
  )

  // Footer simple
  const Footer = () => (
    <footer className="bg-ingco-dark border-t border-ingco-gray py-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p className="text-gray-500 text-sm">© 2026 E-Outilles. Tous droits réservés.</p>
        <div className="flex gap-4 justify-center mt-4">
          <Link href="/about" className="text-gray-500 hover:text-ingco-yellow text-sm">À propos</Link>
          <Link href="/contact" className="text-gray-500 hover:text-ingco-yellow text-sm">Contact</Link>
          <Link href="/legal" className="text-gray-500 hover:text-ingco-yellow text-sm">Mentions légales</Link>
        </div>
      </div>
    </footer>
  )

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-ingco-black">
        <Nav />
        <div className="pt-24 pb-16 max-w-7xl mx-auto px-4 text-center">
          <PageNavigation />
          <div className="text-6xl mb-6">🛒</div>
          <h1 className="text-3xl font-bold text-white mb-4">Votre panier est vide</h1>
          <p className="text-gray-400 mb-8">Découvrez notre catalogue et ajoutez des produits</p>
          <Link 
            href="/search"
            className="bg-ingco-yellow text-ingco-black px-8 py-3 rounded-xl font-bold hover:bg-yellow-400 transition-colors inline-block"
          >
            Découvrir le catalogue
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-ingco-black">
      <Nav />
      <div className="pt-24 pb-16 max-w-7xl mx-auto px-4">
        <PageNavigation />
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
                  className="text-red-500 hover:text-red-400 text-xl"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="bg-ingco-gray rounded-2xl p-6 h-fit">
            <h2 className="text-xl font-bold text-white mb-4">Résumé</h2>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-400">
                <span>Sous-total</span>
                <span>{getTotal().toFixed(2)}€</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Livraison</span>
                <span className="text-green-500">Gratuit</span>
              </div>
              <div className="border-t border-ingco-dark pt-3 flex justify-between text-white font-bold text-xl">
                <span>Total</span>
                <span className="text-ingco-yellow">{getTotal().toFixed(2)}€</span>
              </div>
            </div>
            <Link href="/checkout" className="block w-full bg-ingco-yellow text-ingco-black py-3 rounded-xl font-bold hover:bg-yellow-400 transition-colors text-center">
              Passer la commande
            </Link>
            <button 
              onClick={clearCart}
              className="w-full mt-3 border border-red-500 text-red-500 py-2 rounded-xl hover:bg-red-500 hover:text-white transition-colors"
            >
              Vider le panier
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
