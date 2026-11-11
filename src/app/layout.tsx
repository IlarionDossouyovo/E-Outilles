import type { Metadata } from 'next'
import './globals.css'
import ChatWidget from '@/lib/ai/ChatWidget'
import ServiceWorkerRegister from '@/components/ServiceWorkerRegister'
import SiteChrome from '@/components/SiteChrome'
import MarketingTracker from '@/components/marketing/MarketingTracker'
import { LanguageProvider } from '@/lib/i18n/LanguageProvider'

const SITE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_APP_URL || 'https://e-outilles.com'

const SITE_TITLE = 'E-Outille par ELECTRON | Outillage Professionnel'
const SITE_DESCRIPTION =
  'E-Outille par ELECTRON - Votre partenaire dropshipping international pour outillage professionnel INGCO. Livraison mondiale, qualité professionnelle.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/logo/e-outilles-favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    type: 'website',
    siteName: 'E-Outille',
    locale: 'fr_FR',
    url: '/',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className="bg-ingco-black text-white antialiased">
        <LanguageProvider>
          <SiteChrome>{children}</SiteChrome>
          <ChatWidget />
          <ServiceWorkerRegister />
          <MarketingTracker />
        </LanguageProvider>
      </body>
    </html>
  )
}