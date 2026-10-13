'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const SECTIONS = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/products', label: 'Produits' },
  { href: '/admin/add-product', label: 'Ajouter' },
  { href: '/admin/orders', label: 'Commandes' },
  { href: '/admin/customers', label: 'Clients' },
  { href: '/admin/newsletter', label: 'Newsletter' },
  { href: '/admin/settings', label: 'Parametres' },
  { href: '/agent', label: 'Agents IA' },
]

export default function AdminNav() {
  const pathname = usePathname() || '/admin'

  return (
    <div className="hidden md:flex items-center gap-6">
      {SECTIONS.map((s) => {
        const active = pathname === s.href || pathname.startsWith(`${s.href}/`)
        return (
          <Link
            key={s.href}
            href={s.href}
            className={active ? 'text-ingco-yellow' : 'text-gray-300 hover:text-ingco-yellow'}
          >
            {s.label}
          </Link>
        )
      })}
    </div>
  )
}
