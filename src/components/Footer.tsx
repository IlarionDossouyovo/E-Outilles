import Link from 'next/link'
import Logo from '@/components/Logo'

const CATEGORIES = [
  { href: '/categories/construction', label: 'Construction & BTP' },
  { href: '/categories/electricite', label: 'Électricité' },
  { href: '/categories/garage', label: 'Garage Auto' },
  { href: '/categories/jardinage', label: 'Jardinage' },
  { href: '/categories/outils-sans-fil', label: 'Outils sans fil' },
]

const ENTREPRISE = [
  { href: '/about', label: 'À propos' },
  { href: '/revendeurs', label: 'Devenir revendeur' },
  { href: '/blog', label: 'Blog' },
  { href: '/services', label: 'Services' },
  { href: '/contact', label: 'Contact' },
]

const AIDE = [
  { href: '/chat', label: 'Assistant IA' },
  { href: '/telecharger', label: "Télécharger l'app" },
  { href: '/formations', label: 'Formations' },
  { href: '/wishlist', label: 'Mes favoris' },
]

const PAIEMENTS = ['Visa', 'Mastercard', 'PayPal', 'MTN', 'Orange', 'Flutterwave']

export default function Footer() {
  return (
    <footer className="bg-ingco-dark border-t border-ingco-gray pt-14 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div className="col-span-2 md:col-span-1">
            <Logo variant="horizontal" size={40} />
            <p className="text-gray-500 text-sm mt-4">
              Votre partenaire dropshipping international pour outillage professionnel INGCO.
            </p>
            <Link
              href="/telecharger"
              className="inline-flex items-center gap-3 mt-4 bg-ingco-gray rounded-xl p-2 pr-4 hover:bg-ingco-yellow/10 transition-colors group"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/api/qrcode" alt="QR code application E-Outilles" className="w-16 h-16 rounded-lg bg-white p-1" />
              <span className="text-sm">
                <span className="block text-white font-semibold group-hover:text-ingco-yellow transition-colors">
                  Télécharger l&apos;app
                </span>
                <span className="block text-gray-500 text-xs">Scannez le QR code</span>
              </span>
            </Link>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Catégories</h4>
            <ul className="space-y-2 text-gray-500 text-sm">
              {CATEGORIES.map((c) => (
                <li key={c.href}>
                  <Link href={c.href} className="hover:text-ingco-yellow transition-colors">{c.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Entreprise</h4>
            <ul className="space-y-2 text-gray-500 text-sm">
              {ENTREPRISE.map((c) => (
                <li key={c.href}>
                  <Link href={c.href} className="hover:text-ingco-yellow transition-colors">{c.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Aide</h4>
            <ul className="space-y-2 text-gray-500 text-sm">
              {AIDE.map((c) => (
                <li key={c.href}>
                  <Link href={c.href} className="hover:text-ingco-yellow transition-colors">{c.label}</Link>
                </li>
              ))}
            </ul>
            <h4 className="text-white font-semibold mt-6 mb-3">Paiements</h4>
            <div className="flex flex-wrap gap-2">
              {PAIEMENTS.map((p) => (
                <span key={p} className="bg-ingco-gray px-3 py-1 rounded text-xs text-gray-400">{p}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-ingco-gray pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm text-center md:text-left">
            © 2026 E-Outilles. Tous droits réservés. Projet dropshipping INGCO.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link href="/legal" className="text-gray-500 hover:text-ingco-yellow transition-colors">Mentions légales</Link>
            <Link href="/privacy" className="text-gray-500 hover:text-ingco-yellow transition-colors">RGPD</Link>
            <Link href="/terms" className="text-gray-500 hover:text-ingco-yellow transition-colors">CGV</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
