import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'À propos | E-Outille par ELECTRON',
  description: 'Découvrez E-Outille par ELECTRON, votre partenaire en outillage professionnel INGCO : mission, valeurs et engagement qualité.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
