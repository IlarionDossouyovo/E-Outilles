import type { Metadata } from 'next'
import AuthProvider from '@/components/AuthProvider'
import './globals.css'
import ChatWidget from '@/lib/ai/ChatWidget'

export const metadata: Metadata = {
  title: 'E-Outilles | Outillage Professionnel Dropshipping',
  description: 'E-Outilles - Votre partenaire dropshipping international pour outillage professionnel INGCO.Livraison mondiale, qualité professionnelle.',
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className="bg-ingco-black text-white antialiased">
        <AuthProvider>
          {children}
          <ChatWidget />
        </AuthProvider>
      </body>
    </html>
  )
}