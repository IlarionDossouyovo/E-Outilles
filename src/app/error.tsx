'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Icon } from '@/components/Icons'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-ingco-black flex items-center justify-center px-4 pt-24 pb-20">
      <div className="max-w-xl w-full text-center animate-fade-in-up">
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-ingco-gray border border-white/5 flex items-center justify-center">
          <Icon name="warning" className="w-9 h-9 text-ingco-yellow" />
        </div>
        <p className="text-ingco-yellow font-bold tracking-widest text-sm uppercase">Erreur</p>
        <h1 className="text-3xl sm:text-4xl font-bold text-white mt-2 mb-3">Une erreur est survenue</h1>
        <p className="text-gray-400 mb-8">
          Impossible d&apos;afficher cette page pour le moment. Réessayez ou revenez à l&apos;accueil.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-2 bg-ingco-yellow text-black font-semibold px-6 py-3 rounded-xl hover:bg-yellow-400 transition-colors"
          >
            <Icon name="spinner" className="w-4 h-4" /> Réessayer
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-ingco-gray text-white font-semibold px-6 py-3 rounded-xl border border-white/10 hover:border-ingco-yellow/50 transition-colors"
          >
            <Icon name="home" className="w-4 h-4" /> Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    </div>
  )
}
