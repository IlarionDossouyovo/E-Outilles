'use client'

import Link from 'next/link'
import { Icon } from '@/components/Icons'

interface BackButtonProps {
  href?: string
  label?: string
}

export default function BackButton({ href = '/', label = 'Retour' }: BackButtonProps) {
  if (href) {
    return (
      <Link 
        href={href}
        className="inline-flex items-center gap-2 text-ingco-yellow hover:text-yellow-400 transition-colors font-semibold"
      >
        <Icon name="arrow-left" className="w-4 h-4" />
        <span>{label}</span>
      </Link>
    )
  }

  return (
    <button 
      onClick={() => window.history.back()}
      className="inline-flex items-center gap-2 text-ingco-yellow hover:text-yellow-400 transition-colors font-semibold"
    >
      <Icon name="arrow-left" className="w-4 h-4" />
      <span>{label}</span>
    </button>
  )
}