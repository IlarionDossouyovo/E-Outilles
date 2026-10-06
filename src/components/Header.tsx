'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import Logo from '@/components/Logo'
import AuthButton from '@/components/AuthButton'
import { Icon } from '@/components/Icons'
import { useCartStore } from '@/lib/store/cart'
import { useWishlistStore } from '@/lib/store/wishlist'

interface NavItem {
  href: string
  label: string
}

const NAV: NavItem[] = [
  { href: '/categories', label: 'Catégories' },
  { href: '/search', label: 'Produits' },
  { href: '/formations', label: 'Formations' },
  { href: '/revendeurs', label: 'Revendeurs' },
  { href: '/blog', label: 'Blog' },
  { href: '/services', label: 'Services' },
  { href: '/contact', label: 'Contact' },
]

export default function Header() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)

  const cartCount = useCartStore((s) => s.items.reduce((n, i) => n + i.quantity, 0))
  const wishlistCount = useWishlistStore((s) => s.items.length)

  useEffect(() => {
    setMounted(true)
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close the mobile panel whenever the route changes.
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`)

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 border-b ${
        scrolled
          ? 'bg-ingco-black/95 backdrop-blur-md border-ingco-gray shadow-lg shadow-black/40'
          : 'bg-ingco-black/70 backdrop-blur-sm border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3 shrink-0">
            <Logo variant="horizontal" size={40} />
          </div>

          {/* Desktop navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2" aria-label="Navigation principale">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`link-underline relative px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive(item.href)
                    ? 'is-active text-ingco-yellow font-semibold'
                    : 'text-gray-300 hover:text-ingco-yellow'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/search"
              aria-label="Rechercher"
              className="p-2 rounded-lg text-gray-300 hover:text-ingco-yellow hover:bg-ingco-gray/60 transition-colors"
            >
              <Icon name="search" className="w-5 h-5" />
            </Link>

            <Link
              href="/wishlist"
              aria-label="Favoris"
              className="relative p-2 rounded-lg text-gray-300 hover:text-ingco-yellow hover:bg-ingco-gray/60 transition-colors"
            >
              <Icon name="heart" className="w-5 h-5" />
              {mounted && wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-ingco-yellow text-ingco-black text-[10px] font-bold min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center animate-pop-in">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link
              href="/cart"
              aria-label="Panier"
              className="relative p-2 rounded-lg text-gray-300 hover:text-ingco-yellow hover:bg-ingco-gray/60 transition-colors"
            >
              <Icon name="cart" className="w-5 h-5" />
              {mounted && cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-ingco-yellow text-ingco-black text-[10px] font-bold min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center animate-pop-in">
                  {cartCount}
                </span>
              )}
            </Link>

            <div className="hidden sm:block">
              <AuthButton />
            </div>

            <Link
              href="/cart"
              className="hidden md:inline-flex items-center gap-2 bg-ingco-yellow text-ingco-black px-4 py-2 rounded-xl font-semibold text-sm hover:bg-yellow-400 hover:shadow-lg hover:shadow-ingco-yellow/30 transition-all"
            >
              Commander
            </Link>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
              aria-expanded={open}
              className="lg:hidden p-2 rounded-lg text-gray-200 hover:bg-ingco-gray/60 transition-colors"
            >
              <div className="w-6 h-5 flex flex-col justify-between">
                <span className={`block h-0.5 bg-current transition-transform duration-300 ${open ? 'rotate-45 translate-y-2' : ''}`} />
                <span className={`block h-0.5 bg-current transition-opacity duration-300 ${open ? 'opacity-0' : ''}`} />
                <span className={`block h-0.5 bg-current transition-transform duration-300 ${open ? '-rotate-45 -translate-y-2' : ''}`} />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile panel */}
      <div
        className={`lg:hidden overflow-hidden bg-ingco-dark border-t border-ingco-gray transition-[max-height,opacity] duration-300 ${
          open ? 'max-h-[80vh] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 py-4 space-y-1">
          {NAV.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              style={{ transitionDelay: `${i * 25}ms` }}
              className={`block px-3 py-3 rounded-xl transition-colors ${
                isActive(item.href)
                  ? 'bg-ingco-yellow/10 text-ingco-yellow font-semibold'
                  : 'text-gray-300 hover:bg-ingco-gray/60 hover:text-ingco-yellow'
              }`}
            >
              {item.label}
            </Link>
          ))}
          <div className="pt-3 mt-2 border-t border-ingco-gray flex items-center gap-3">
            <div className="flex-1">
              <AuthButton />
            </div>
            <Link
              href="/cart"
              className="inline-flex items-center gap-2 bg-ingco-yellow text-ingco-black px-5 py-2.5 rounded-xl font-semibold"
            >
              <Icon name="cart" className="w-5 h-5" /> Panier
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
