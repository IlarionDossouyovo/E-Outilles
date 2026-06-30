'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

// Pages with their navigation
const pages = [
  { path: '/', label: 'Accueil', icon: '🏠' },
  { path: '/search', label: 'Produits', icon: '🔍' },
  { path: '/categories', label: 'Catégories', icon: '📂' },
  { path: '/chat', label: 'Assistant', icon: '💬' },
  { path: '/blog', label: 'Blog', icon: '📝' },
  { path: '/cart', label: 'Panier', icon: '🛒' },
  { path: '/wishlist', label: 'Favoris', icon: '❤️' },
  { path: '/checkout', label: 'Commander', icon: '💳' },
  { path: '/admin', label: 'Admin', icon: '⚙️' },
  { path: '/profile', label: 'Profil', icon: '👤' },
  { path: '/about', label: 'À propos', icon: 'ℹ️' },
  { path: '/contact', label: 'Contact', icon: '📞' },
  { path: '/services', label: 'Services', icon: '🛠️' },
  { path: '/auth/login', label: 'Connexion', icon: '🔑' },
  { path: '/auth/register', label: 'Inscription', icon: '📝' },
]

export function useNavigation() {
  const pathname = usePathname()
  
  const currentIndex = pages.findIndex(p => p.path === pathname)
  
  const prevPage = currentIndex > 0 ? pages[currentIndex - 1] : null
  const nextPage = currentIndex < pages.length - 1 ? pages[currentIndex + 1] : null
  
  return { prevPage, nextPage, currentIndex, totalPages: pages.length }
}

export function NavigationArrows({ showLabels = true }: { showLabels?: boolean }) {
  const pathname = usePathname()
  const currentIndex = pages.findIndex(p => p.path === pathname)
  
  // Find closest pages
  const allPages = pages.filter(p => !p.path.startsWith('/auth') && !p.path.startsWith('/admin'))
  const idx = allPages.findIndex(p => p.path === pathname)
  
  if (idx === -1) return null
  
  const prevPage = idx > 0 ? allPages[idx - 1] : allPages[allPages.length - 1]
  const nextPage = idx < allPages.length - 1 ? allPages[idx + 1] : allPages[0]
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-ingco-dark border-t border-ingco-gray p-3 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link 
          href={prevPage.path}
          className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
        >
          <span>◀</span>
          {showLabels && <span className="hidden md:inline text-sm">{prevPage.label}</span>}
        </Link>
        
        <div className="text-gray-500 text-sm">
          {idx + 1} / {allPages.length}
        </div>
        
        <Link 
          href={nextPage.path}
          className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
        >
          {showLabels && <span className="hidden md:inline text-sm">{nextPage.label}</span>}
          <span>▶</span>
        </Link>
      </div>
    </div>
  )
}

export function Breadcrumb({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav className="flex items-center gap-2 text-sm text-gray-400 mb-4">
      <Link href="/" className="hover:text-ingco-yellow">Accueil</Link>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-2">
          <span>›</span>
          {item.href ? (
            <Link href={item.href} className="hover:text-ingco-yellow">{item.label}</Link>
          ) : (
            <span className="text-white">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}