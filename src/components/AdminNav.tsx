'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getSessionAction } from '@/app/actions'

const SECTIONS = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/products', label: 'Produits' },
  { href: '/admin/add-product', label: 'Ajouter' },
  { href: '/admin/orders', label: 'Commandes' },
  { href: '/admin/customers', label: 'Clients' },
  { href: '/admin/newsletter', label: 'Newsletter' },
  { href: '/admin/settings', label: 'Parametres' },
]

export default function AdminNav() {
  const pathname = usePathname() || '/admin'
  const [isFounder, setIsFounder] = useState(false)

  useEffect(() => {
    getSessionAction()
      .then((result) => setIsFounder(Boolean(result.user?.isFounder)))
      .catch(() => {})
  }, [])

  const sections = isFounder
    ? [...SECTIONS, { href: '/agent', label: 'Agents IA' }]
    : SECTIONS

  return (
    <div className="hidden md:flex items-center gap-6">
      {sections.map((s) => {
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
