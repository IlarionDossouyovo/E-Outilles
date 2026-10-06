import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact | E-Outille',
  description: 'Contactez E-Outille par ELECTRON : questions produits, commandes, partenariats revendeurs et support.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
