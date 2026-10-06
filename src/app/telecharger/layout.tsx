import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Télécharger l\'Application | E-Outille',
  description: 'Installez l\'application E-Outille (PWA) pour commander votre outillage professionnel directement depuis votre téléphone.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
