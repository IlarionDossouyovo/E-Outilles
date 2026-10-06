import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Devenir Revendeur | E-Outille',
  description: 'Rejoignez le réseau de revendeurs E-Outille et distribuez l\'outillage professionnel INGCO en Afrique de l\'Ouest.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
