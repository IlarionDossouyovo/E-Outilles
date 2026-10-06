import type { Metadata } from 'next'
import './globals.css'
import ChatWidget from '@/lib/ai/ChatWidget'
import ServiceWorkerRegister from '@/components/ServiceWorkerRegister'
import SiteChrome from '@/components/SiteChrome'

export const metadata: Metadata = {
  title: 'E-Outille par ELECTRON | Outillage Professionnel',
  description: 'E-Outille par ELECTRON - Votre partenaire dropshipping international pour outillage professionnel INGCO. Livraison mondiale, qualité professionnelle.',
  manifest: '/manifest.json',
  icons: {
    icon: '/logo/e-outilles-favicon.svg',
    apple: '/logo/e-outilles-icon.svg',
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
        <SiteChrome>{children}</SiteChrome>
        <ChatWidget />
        <ServiceWorkerRegister />
      </body>
    </html>
  )
}