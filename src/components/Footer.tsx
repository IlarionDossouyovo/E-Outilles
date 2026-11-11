import Link from 'next/link'
import Logo from '@/components/Logo'
import SocialLinks from '@/components/marketing/SocialLinks'
import { useLanguage } from '@/lib/i18n/LanguageProvider'
import { LocalizedText } from '@/components/LocalizedText'

// Slugs must match the Category.slug values in the database (see prisma/seed).
const CATEGORIES = [
  { href: '/categories/construction', label: 'Construction & BTP' },
  { href: '/categories/power-tools', label: 'Outils Électriques' },
  { href: '/categories/cordless-tools', label: 'Outils Sans Fil' },
  { href: '/categories/hand-tools', label: 'Outils à Main' },
  { href: '/categories/automotive', label: 'Garage Auto' },
  { href: '/categories/garden', label: 'Jardinage' },
]

const ENTREPRISE = [
  { href: '/about', key: 'footer.about' },
  { href: '/fondateur', key: 'nav.founder' },
  { href: '/revendeurs', key: 'footer.becomeReseller' },
  { href: '/blog', key: 'nav.blog' },
  { href: '/services', key: 'nav.services' },
  { href: '/contact', key: 'nav.contact' },
]

const AIDE = [
  { href: '/chat', key: 'nav.chat' },
  { href: '/telecharger', key: 'footer.download' },
  { href: '/formations', key: 'nav.formations' },
  { href: '/wishlist', key: 'footer.wishlist' },
]

const PAIEMENTS = ['Visa', 'Mastercard', 'PayPal', 'MTN', 'Orange', 'Flutterwave']

export default function Footer() {
  const { t } = useLanguage()
  return (
    <footer className="bg-ingco-dark border-t border-ingco-gray pt-14 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div className="col-span-2 md:col-span-1">
            <Logo variant="horizontal" size={40} />
            <p className="text-gray-500 text-sm mt-4">
              {t('footer.tagline')}
            </p>
            <Link
              href="/telecharger"
              className="inline-flex items-center gap-3 mt-4 bg-ingco-gray rounded-xl p-2 pr-4 hover:bg-ingco-yellow/10 transition-colors group"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/api/qrcode" alt="QR code application E-Outilles" className="w-16 h-16 rounded-lg bg-white p-1" />
              <span className="text-sm">
                <span className="block text-white font-semibold group-hover:text-ingco-yellow transition-colors">
                  {t('footer.download')}
                </span>
                <span className="block text-gray-500 text-xs">{t('footer.scanQr')}</span>
              </span>
            </Link>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">{t('footer.categories')}</h4>
            <ul className="space-y-2 text-gray-500 text-sm">
              {CATEGORIES.map((c) => (
                <li key={c.href}>
                  <Link href={c.href} className="hover:text-ingco-yellow transition-colors"><LocalizedText text={c.label} /></Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">{t('footer.company')}</h4>
            <ul className="space-y-2 text-gray-500 text-sm">
              {ENTREPRISE.map((c) => (
                <li key={c.href}>
                  <Link href={c.href} className="hover:text-ingco-yellow transition-colors">{t(c.key)}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">{t('footer.help')}</h4>
            <ul className="space-y-2 text-gray-500 text-sm">
              {AIDE.map((c) => (
                <li key={c.href}>
                  <Link href={c.href} className="hover:text-ingco-yellow transition-colors">{t(c.key)}</Link>
                </li>
              ))}
            </ul>
            <h4 className="text-white font-semibold mt-6 mb-3">{t('footer.payments')}</h4>
            <div className="flex flex-wrap gap-2">
              {PAIEMENTS.map((p) => (
                <span key={p} className="bg-ingco-gray px-3 py-1 rounded text-xs text-gray-400">{p}</span>
              ))}
            </div>
            <h4 className="text-white font-semibold mt-6 mb-3">{t('footer.follow')}</h4>
            <SocialLinks />
          </div>
        </div>

        <div className="border-t border-ingco-gray pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm text-center md:text-left">
            © 2026 E-Outilles. {t('footer.rights')} {t('footer.project')}
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link href="/profile" className="text-gray-500 hover:text-ingco-yellow transition-colors">{t('footer.clientArea')}</Link>
            <Link href="/vendeur" className="text-gray-500 hover:text-ingco-yellow transition-colors">{t('footer.vendorArea')}</Link>
            <Link href="/legal" className="text-gray-500 hover:text-ingco-yellow transition-colors">{t('footer.legal')}</Link>
            <Link href="/privacy" className="text-gray-500 hover:text-ingco-yellow transition-colors">{t('footer.gdpr')}</Link>
            <Link href="/terms" className="text-gray-500 hover:text-ingco-yellow transition-colors">{t('footer.terms')}</Link>
            <Link href="/admin" className="text-gray-500 hover:text-ingco-yellow transition-colors">{t('footer.admin')}</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
