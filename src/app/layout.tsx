import type { Metadata, Viewport } from 'next'
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

export const viewport: Viewport = {
  themeColor: '#FFC400',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // The element stays statically rendered with lang="fr" so reading cookies()
  // here never opts pages out of prerendering. A tiny head script corrects the
  // attribute before first paint from the locale the middleware already
  // resolved (?lang= > cookie > browser), so crawlers and assistive tech see the
  // visitor's language immediately instead of after hydration.
  const htmlLangBootstrap = `(function(){try{
var m=document.cookie.match(/(?:^|;\\s*)eo_locale=([^;]+)/);var c=m?decodeURIComponent(m[1]):null;
var q=new URLSearchParams(location.search).get('lang');
var l=localStorage.getItem('eoutilles.locale');
var p={fr:'fr-FR',en:'en-US',es:'es-ES',pt:'pt-PT'};
var v=[q,l,c].find(function(x){return x&&p[x]});
if(!v){var n=(navigator.language||'').slice(0,2).toLowerCase();if(p[n])v=n}
if(v)document.documentElement.lang=p[v];
}catch(e){}})()`

  return (
    <html lang="fr">
      <head>
        <script dangerouslySetInnerHTML={{ __html: htmlLangBootstrap }} />
      </head>
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