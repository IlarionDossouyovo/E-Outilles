'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useCartStore } from '@/lib/store/cart'
import { useWishlistStore } from '@/lib/store/wishlist'
import Logo from '@/components/Logo'

interface Product {
  id: string
  name: string
  slug: string
  description?: string | null
  price: number
  comparePrice?: number | null
  stock: number
  images: string
  features?: string | null
  category?: { name: string; slug: string; icon?: string | null } | null
}

export default function ProductPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [toast, setToast] = useState('')

  const addItem = useCartStore((s) => s.addItem)
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore()

  useEffect(() => {
    if (!params?.id) return
    fetch(`/api/products/${params.id}`)
      .then(async (res) => {
        if (!res.ok) throw new Error('not found')
        return res.json()
      })
      .then(setProduct)
      .catch(() => setProduct(null))
      .finally(() => setLoading(false))
  }, [params?.id])

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2000)
  }

  const handleAddToCart = () => {
    if (!product) return
    const payload = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images,
      category: product.category?.name || '',
    }
    for (let i = 0; i < quantity; i++) addItem(payload)
    showToast(`✓ ${product.name} ajouté au panier`)
  }

  const handleWishlist = () => {
    if (!product) return
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id)
      showToast('💔 Retiré des favoris')
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images,
        category: product.category?.name || '',
      })
      showToast('❤️ Ajouté aux favoris')
    }
  }

  const parseImages = (): string[] => {
    if (!product) return []
    try {
      const arr = JSON.parse(product.images || '[]')
      return Array.isArray(arr) ? arr : []
    } catch {
      return []
    }
  }

  const parseFeatures = (): string[] => {
    if (!product?.features) return []
    try {
      const arr = JSON.parse(product.features)
      return Array.isArray(arr) ? arr : []
    } catch {
      return []
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-ingco-black flex items-center justify-center">
        <div className="animate-spin text-4xl">⏳</div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-ingco-black flex flex-col items-center justify-center gap-4">
        <h1 className="text-3xl font-bold text-white">Produit non trouvé</h1>
        <Link href="/search" className="text-ingco-yellow hover:underline">← Retour au catalogue</Link>
      </div>
    )
  }

  const features = parseFeatures()
  const images = parseImages()

  return (
    <div className="min-h-screen bg-ingco-black">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-ingco-black/95 backdrop-blur-md border-b border-ingco-gray">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Logo variant="horizontal" size={40} />
          <div className="flex items-center gap-4">
            <Link href="/wishlist" className="text-xl">🤍</Link>
            <Link href="/cart" className="text-xl">🛒</Link>
          </div>
        </div>
      </nav>

      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-ingco-yellow text-ingco-black px-6 py-3 rounded-xl font-bold shadow-lg">
          {toast}
        </div>
      )}

      <div className="pt-24 pb-16 max-w-7xl mx-auto px-4">
        <Link href="/search" className="text-gray-400 hover:text-ingco-yellow text-sm">← Retour au catalogue</Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-6">
          <div className="bg-ingco-gray rounded-2xl flex items-center justify-center p-10 min-h-[320px]">
            {images[0] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={images[0]} alt={product.name} className="max-h-72 object-contain" />
            ) : (
              <span className="text-9xl">{product.category?.icon || '🔧'}</span>
            )}
          </div>

          <div>
            {product.category && (
              <span className="text-xs text-ingco-yellow uppercase">{product.category.name}</span>
            )}
            <h1 className="text-4xl font-bold text-white mt-2 mb-4">{product.name}</h1>
            <p className="text-gray-400 text-lg mb-6">{product.description}</p>

            <div className="flex items-center gap-3 mb-4">
              <span className="text-4xl font-bold text-ingco-yellow">{product.price.toFixed(2)}€</span>
              {product.comparePrice && (
                <span className="text-gray-500 line-through text-lg">{product.comparePrice.toFixed(2)}€</span>
              )}
            </div>

            <p className={`mb-6 text-sm ${product.stock > 0 ? 'text-green-500' : 'text-red-500'}`}>
              {product.stock > 0 ? `✓ En stock (${product.stock})` : '✗ Rupture de stock'}
            </p>

            {features.length > 0 && (
              <ul className="space-y-2 mb-6">
                {features.map((f, i) => (
                  <li key={i} className="text-gray-300 flex items-center gap-2">
                    <span className="text-ingco-yellow">•</span> {f}
                  </li>
                ))}
              </ul>
            )}

            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-10 h-10 rounded-lg bg-ingco-gray text-white text-xl"
              >
                −
              </button>
              <span className="text-white font-bold w-8 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="w-10 h-10 rounded-lg bg-ingco-gray text-white text-xl"
              >
                +
              </button>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="flex-1 bg-ingco-yellow text-ingco-black px-8 py-4 rounded-xl font-bold hover:bg-yellow-400 disabled:opacity-50"
              >
                Ajouter au panier
              </button>
              <button
                onClick={handleWishlist}
                className={`px-5 rounded-xl border ${isInWishlist(product.id) ? 'border-ingco-yellow text-ingco-yellow' : 'border-ingco-gray text-gray-400'}`}
              >
                {isInWishlist(product.id) ? '❤️' : '🤍'}
              </button>
            </div>

            <button
              onClick={() => { handleAddToCart(); router.push('/checkout') }}
              disabled={product.stock <= 0}
              className="w-full mt-3 border border-ingco-yellow text-ingco-yellow py-3 rounded-xl font-bold hover:bg-ingco-yellow hover:text-ingco-black disabled:opacity-50"
            >
              Commander maintenant
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
