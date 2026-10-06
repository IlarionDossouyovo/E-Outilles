import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Recherche de Produits | E-Outille',
  description: 'Recherchez parmi plus de 70 outils professionnels INGCO : perceuses, meuleuses, compresseurs, générateurs et accessoires.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
