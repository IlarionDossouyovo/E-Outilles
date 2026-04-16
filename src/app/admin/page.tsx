import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin Dashboard | E-Outilles',
  description: 'Tableau de bord administration E-Outilles',
}

// Mock data for dashboard
const stats = {
  totalOrders: 1247,
  totalRevenue: 89450,
  activeProducts: 523,
  subscribers: 3421
}

const recentOrders = [
  { id: 'ORD-001', customer: 'Jean Kouassi', amount: 459.99, status: 'pending', date: '2026-04-16' },
  { id: 'ORD-002', customer: 'Marie Diallo', amount: 189.00, status: 'shipped', date: '2026-04-15' },
  { id: 'ORD-003', customer: 'Paul Okonkwo', amount: 899.50, status: 'delivered', date: '2026-04-15' },
  { id: 'ORD-004', customer: 'Anne Mensah', amount: 234.00, status: 'processing', date: '2026-04-14' },
  { id: 'ORD-005', customer: 'Pierre Ngoma', amount: 567.00, status: 'pending', date: '2026-04-14' },
]

const topProducts = [
  { name: 'Perceuse visseuse INGCO 20V', sales: 89, revenue: 8011 },
  { name: 'Marteau perforateur SDS Max', sales: 45, revenue: 11249 },
  { name: 'Kit claves mechaniciens 50pcs', sales: 67, revenue: 5359 },
  { name: 'Tronconneuse thermique 45cm', sales: 34, revenue: 10196 },
  { name: 'Multimetre digital pro', sales: 78, revenue: 4679 },
]

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-500',
  processing: 'bg-blue-500',
  shipped: 'bg-purple-500',
  delivered: 'bg-green-500'
}

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-ingco-black pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Dashboard Admin</h1>
          <p className="text-gray-400">Gestion de votre boutique E-Outilles</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-ingco-gray rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-400 text-sm">Commandes totales</span>
              <span className="w-10 h-10 bg-ingco-yellow/20 rounded-xl flex items-center justify-center">📦</span>
            </div>
            <div className="text-3xl font-bold text-white">{stats.totalOrders.toLocaleString()}</div>
            <div className="text-green-500 text-sm mt-1">+12% ce mois</div>
          </div>

          <div className="bg-ingco-gray rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-400 text-sm">Chiffre affaires</span>
              <span className="w-10 h-10 bg-ingco-yellow/20 rounded-xl flex items-center justify-center">💰</span>
            </div>
            <div className="text-3xl font-bold text-ingco-yellow">{stats.totalRevenue.toLocaleString()}€</div>
            <div className="text-green-500 text-sm mt-1">+8% ce mois</div>
          </div>

          <div className="bg-ingco-gray rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-400 text-sm">Produits actifs</span>
              <span className="w-10 h-10 bg-ingco-yellow/20 rounded-xl flex items-center justify-center">🛠️</span>
            </div>
            <div className="text-3xl font-bold text-white">{stats.activeProducts}</div>
            <div className="text-gray-500 text-sm mt-1">5 nouveaux ce mois</div>
          </div>

          <div className="bg-ingco-gray rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-400 text-sm">Abonnes newsletter</span>
              <span className="w-10 h-10 bg-ingco-yellow/20 rounded-xl flex items-center justify-center">📧</span>
            </div>
            <div className="text-3xl font-bold text-white">{stats.subscribers.toLocaleString()}</div>
            <div className="text-green-500 text-sm mt-1">+156 ce mois</div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <div className="bg-ingco-gray rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Commandes recentes</h2>
              <button className="text-ingco-yellow text-sm hover:underline">Voir tout</button>
            </div>
            
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 bg-ingco-dark rounded-xl">
                  <div>
                    <div className="text-white font-medium">{order.customer}</div>
                    <div className="text-gray-500 text-sm">{order.id} • {order.date}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-bold">{order.amount}€</div>
                    <span className={`text-xs px-2 py-1 rounded-full text-white ${statusColors[order.status]}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-ingco-gray rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Produits les plus vendus</h2>
              <button className="text-ingco-yellow text-sm hover:underline">Voir tout</button>
            </div>
            
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-ingco-dark rounded-xl">
                  <div className="flex items-center gap-4">
                    <span className="w-8 h-8 bg-ingco-yellow/20 rounded-lg flex items-center justify-center text-ingco-yellow font-bold">
                      {index + 1}
                    </span>
                    <div>
                      <div className="text-white font-medium">{product.name}</div>
                      <div className="text-gray-500 text-sm">{product.sales} ventes</div>
                    </div>
                  </div>
                  <div className="text-ingco-yellow font-bold">{product.revenue}€</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="bg-ingco-gray p-4 rounded-xl text-center hover:bg-ingco-dark transition-colors">
            <span className="text-2xl block mb-2">➕</span>
            <span className="text-white text-sm">Ajouter produit</span>
          </button>
          <button className="bg-ingco-gray p-4 rounded-xl text-center hover:bg-ingco-dark transition-colors">
            <span className="text-2xl block mb-2">📦</span>
            <span className="text-white text-sm">Gerer commandes</span>
          </button>
          <button className="bg-ingco-gray p-4 rounded-xl text-center hover:bg-ingco-dark transition-colors">
            <span className="text-2xl block mb-2">📧</span>
            <span className="text-white text-sm">Envoyer newsletter</span>
          </button>
          <button className="bg-ingco-gray p-4 rounded-xl text-center hover:bg-ingco-dark transition-colors">
            <span className="text-2xl block mb-2">⚙️</span>
            <span className="text-white text-sm">Parametres</span>
          </button>
        </div>
      </div>
    </div>
  )
}
