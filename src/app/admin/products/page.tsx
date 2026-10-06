'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Logo from '@/components/Logo'
import { Icon } from '@/components/Icons'

interface Product {
  id: string
  name: string
  slug: string
  price: number
  comparePrice: number | null
  stock: number
  featured: boolean
  category: { name: string } | null
  createdAt: string
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<Product>>({})

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products')
      const data = await res.json()
      setProducts(data)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit?')) return
    
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setProducts(products.filter(p => p.id !== id))
      }
    } catch (error) {
      console.error('Error deleting product:', error)
    }
  }

  const handleToggleFeatured = async (product: Product) => {
    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: !product.featured })
      })
      if (res.ok) {
        setProducts(products.map(p => 
          p.id === product.id ? { ...p, featured: !p.featured } : p
        ))
      }
    } catch (error) {
      console.error('Error updating product:', error)
    }
  }

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.name?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-ingco-black">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-ingco-black/95 backdrop-blur-md border-b border-ingco-gray">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Logo variant="horizontal" size={40} />
            <span className="bg-ingco-yellow text-ingco-black text-xs px-2 py-1 rounded ml-2">Admin</span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-gray-300 hover:text-ingco-yellow">Accueil</Link>
            <Link href="/admin" className="text-ingco-yellow">Dashboard</Link>
            <Link href="/search" className="text-gray-300 hover:text-ingco-yellow">Produits</Link>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-400 text-sm flex items-center gap-2"><Icon name="user" className="w-4 h-4" /> Admin</span>
          </div>
        </div>
      </nav>

      <div className="pt-24 pb-16 max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/admin" className="text-gray-400 hover:text-ingco-yellow text-sm mb-2 inline-flex items-center gap-1">
              ← Retour Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-white">Gestion des Produits</h1>
            <p className="text-gray-400">{products.length} produits au total</p>
          </div>
          <Link 
            href="/admin/add-product" 
            className="bg-ingco-yellow text-ingco-black px-6 py-3 rounded-xl font-bold hover:bg-yellow-400 transition-colors"
          >
            + Ajouter un produit
          </Link>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Rechercher un produit..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-96 bg-ingco-gray border border-gray-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-ingco-yellow"
          />
        </div>

        {/* Products Table */}
        {loading ? (
          <div className="text-white text-center py-12">Chargement...</div>
        ) : (
          <div className="bg-ingco-gray rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-ingco-black">
                  <tr>
                    <th className="text-left text-gray-400 px-6 py-4">Produit</th>
                    <th className="text-left text-gray-400 px-6 py-4">Catégorie</th>
                    <th className="text-left text-gray-400 px-6 py-4">Prix</th>
                    <th className="text-left text-gray-400 px-6 py-4">Stock</th>
                    <th className="text-left text-gray-400 px-6 py-4">Statut</th>
                    <th className="text-right text-gray-400 px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-white/5">
                      <td className="px-6 py-4">
                        <div className="text-white font-medium">{product.name}</div>
                        <div className="text-gray-500 text-sm">{product.slug}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-300">{product.category?.name || 'Non catégorisé'}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-ingco-yellow font-bold">{product.price}€</span>
                        {product.comparePrice && (
                          <span className="text-gray-500 text-sm line-through ml-2">{product.comparePrice}€</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-sm ${
                          product.stock > 10 ? 'bg-green-500/20 text-green-400' :
                          product.stock > 0 ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {product.stock} en stock
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleToggleFeatured(product)}
                          className={`px-2 py-1 rounded text-sm ${
                            product.featured 
                              ? 'bg-ingco-yellow/20 text-ingco-yellow' 
                              : 'bg-gray-700 text-gray-400'
                          }`}
                        >
                          {product.featured ? 'Featured' : 'Standard'}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/add-product?id=${product.id}`}
                            className="text-gray-400 hover:text-white px-3 py-1"
                          >
                            <Icon name="settings" className="w-4 h-4" /> Modifier
                          </Link>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="text-red-400 hover:text-red-300 px-3 py-1"
                          >
                            <Icon name="warning" className="w-4 h-4" /> Supprimer
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {filteredProducts.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                Aucun produit trouvé
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
