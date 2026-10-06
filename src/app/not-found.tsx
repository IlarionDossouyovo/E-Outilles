import Link from 'next/link'
import { Icon } from '@/components/Icons'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-ingco-black flex items-center justify-center px-4 pt-24 pb-20">
      <div className="max-w-xl w-full text-center animate-fade-in-up">
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-ingco-gray border border-white/5 flex items-center justify-center">
          <Icon name="search" className="w-9 h-9 text-ingco-yellow" />
        </div>
        <p className="text-ingco-yellow font-bold tracking-widest text-sm uppercase">Erreur 404</p>
        <h1 className="text-3xl sm:text-4xl font-bold text-white mt-2 mb-3">Page introuvable</h1>
        <p className="text-gray-400 mb-8">
          La page que vous cherchez a peut-être été déplacée ou n&apos;existe plus.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-ingco-yellow text-black font-semibold px-6 py-3 rounded-xl hover:bg-yellow-400 transition-colors"
          >
            <Icon name="home" className="w-4 h-4" /> Retour à l&apos;accueil
          </Link>
          <Link
            href="/categories"
            className="inline-flex items-center gap-2 bg-ingco-gray text-white font-semibold px-6 py-3 rounded-xl border border-white/10 hover:border-ingco-yellow/50 transition-colors"
          >
            <Icon name="grid" className="w-4 h-4" /> Voir les catégories
          </Link>
          <Link
            href="/search"
            className="inline-flex items-center gap-2 bg-ingco-gray text-white font-semibold px-6 py-3 rounded-xl border border-white/10 hover:border-ingco-yellow/50 transition-colors"
          >
            <Icon name="search" className="w-4 h-4" /> Rechercher un produit
          </Link>
        </div>
      </div>
    </div>
  )
}
