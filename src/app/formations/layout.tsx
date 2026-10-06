import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Formations Outillage | E-Outille',
  description: 'Formations professionnelles à l\'outillage INGCO : sécurité, utilisation et maintenance pour les métiers du BTP et de l\'industrie.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
