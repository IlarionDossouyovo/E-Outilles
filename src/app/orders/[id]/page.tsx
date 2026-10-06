'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Logo from '@/components/Logo'
import { NavigationArrows, Icon } from '@/components/Icons'

interface OrderItem {
  id: string
  quantity: number
  price: number
  product?: { name: string; images: string; slug: string } | null
}

interface Order {
  id: string
  status: string
  total: number
  shippingAddress?: string | null
  shippingCity?: string | null
  shippingCountry?: string | null
  paymentMethod?: string | null
  notes?: string | null
  createdAt: string
  items: OrderItem[]
}

const statusLabels: Record<string, string> = {
  pending: 'En attente',
  processing: 'En préparation',
  paid: 'Payée',
  shipped: 'Expédiée',
  delivered: 'Livrée',
  cancelled: 'Annulée',
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-600',
  processing: 'bg-blue-600',
  paid: 'bg-green-600',
  shipped: 'bg-indigo-600',
  delivered: 'bg-emerald-600',
  cancelled: 'bg-red-600',
}

function firstImage(images?: string): string | null {
  if (!images) return null
  try {
    const parsed = JSON.parse(images)
    return Array.isArray(parsed) && parsed.length > 0 ? parsed[0] : null
  } catch {
    return null
  }
}

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!params?.id) return
    fetch(`/api/orders/${params.id}`)
      .then(async (res) => {
        if (res.status === 401) {
          router.push(`/auth/login?redirect=/orders/${params.id}`)
          return null
        }
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Erreur')
        return data as Order
      })
      .then((data) => data && setOrder(data))
      .catch((e) => setError(e.message || 'Commande introuvable'))
      .finally(() => setLoading(false))
  }, [params?.id, router])

  return (
    <div className="min-h-screen bg-ingco-black pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-6">
          <Link href="/profile" className="inline-flex items-center gap-2 text-ingco-yellow hover:text-yellow-400 transition-colors">
            <Icon name="arrow-left" className="w-4 h-4" /> Mes commandes
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Icon name="spinner" className="w-10 h-10 text-ingco-yellow animate-spin" />
          </div>
        ) : error || !order ? (
          <div className="bg-ingco-gray rounded-2xl p-10 text-center">
            <Icon name="warning" className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">Commande introuvable</h1>
            <p className="text-gray-400 mb-6">{error}</p>
            <Link href="/profile" className="text-ingco-yellow hover:underline">Retour au profil</Link>
          </div>
        ) : (
          <>
            <div className="bg-ingco-gray rounded-2xl p-6 sm:p-8 mb-6 animate-fade-in-up">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-white">Commande</h1>
                  <p className="text-gray-500 text-sm break-all">{order.id}</p>
                  <p className="text-gray-400 text-sm mt-1">
                    {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                      day: 'numeric', month: 'long', year: 'numeric',
                    })}
                  </p>
                </div>
                <span className={`self-start px-4 py-2 rounded-full text-white text-sm font-semibold ${statusColors[order.status] || 'bg-gray-500'}`}>
                  {statusLabels[order.status] || order.status}
                </span>
              </div>
            </div>

            <div className="bg-ingco-gray rounded-2xl p-6 sm:p-8 mb-6 animate-fade-in-up">
              <h2 className="text-lg font-bold text-white mb-4">Articles</h2>
              <div className="space-y-4">
                {order.items.map((item) => {
                  const img = firstImage(item.product?.images)
                  return (
                    <div key={item.id} className="flex items-center gap-4 border-b border-white/5 pb-4 last:border-0 last:pb-0">
                      <div className="w-16 h-16 bg-ingco-black rounded-xl flex items-center justify-center shrink-0 overflow-hidden">
                        {img ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={img} alt={item.product?.name || ''} className="max-h-14 object-contain" />
                        ) : (
                          <Icon name="tools" className="w-6 h-6 text-gray-500" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-semibold">{item.product?.name || 'Produit'}</p>
                        <p className="text-gray-500 text-sm">Quantité : {item.quantity}</p>
                      </div>
                      <p className="text-ingco-yellow font-bold">{(item.price * item.quantity).toFixed(2)}€</p>
                    </div>
                  )
                })}
              </div>
              <div className="flex justify-between items-center mt-6 pt-4 border-t border-white/10">
                <span className="text-white font-bold">Total</span>
                <span className="text-ingco-yellow font-bold text-2xl">{order.total.toFixed(2)}€</span>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="bg-ingco-gray rounded-2xl p-6 animate-fade-in-up">
                <h2 className="text-lg font-bold text-white mb-4">Livraison</h2>
                <p className="text-gray-300">{order.shippingAddress || '—'}</p>
                <p className="text-gray-300">{order.shippingCity} {order.shippingCountry}</p>
              </div>
              <div className="bg-ingco-gray rounded-2xl p-6 animate-fade-in-up">
                <h2 className="text-lg font-bold text-white mb-4">Paiement</h2>
                <p className="text-gray-300">{order.paymentMethod || '—'}</p>
                {order.notes && <p className="text-gray-500 text-sm mt-2">{order.notes}</p>}
              </div>
            </div>

            <div className="mt-10">
              <NavigationArrows current="/profile" />
            </div>
          </>
        )}
      </div>
    </div>
  )
}
