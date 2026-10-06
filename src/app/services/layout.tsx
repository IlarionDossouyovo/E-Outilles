import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Nos Services | E-Outille',
  description: 'Services E-Outille : vente d\'outillage professionnel, formations, accompagnement revendeurs et livraison en Afrique de l\'Ouest.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
