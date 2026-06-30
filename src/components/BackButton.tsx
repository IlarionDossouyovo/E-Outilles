'use client'

import Link from 'next/link'

interface BackButtonProps {
  href?: string
  label?: string
}

export default function BackButton({ href = '/', label = '← Retour' }: BackButtonProps) {
  if (href) {
    return (
      <Link 
        href={href}
        className="inline-flex items-center gap-2 text-ingco-yellow hover:text-yellow-400 transition-colors font-semibold"
      >
        <span>←</span>
        <span>{label}</span>
      </Link>
    )
  }

  return (
    <button 
      onClick={() => window.history.back()}
      className="inline-flex items-center gap-2 text-ingco-yellow hover:text-yellow-400 transition-colors font-semibold"
    >
      <span>←</span>
      <span>{label}</span>
    </button>
  )
}