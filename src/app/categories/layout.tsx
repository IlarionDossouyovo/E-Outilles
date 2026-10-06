import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Catégories d\'Outillage | E-Outille',
  description: 'Parcourez toutes les catégories d\'outillage professionnel INGCO : électroportatif, outillage à main, jardinage, soudage et plus.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
