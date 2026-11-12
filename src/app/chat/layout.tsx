import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Assistant IA | E-Outille par ELECTRON',
  description:
    "Discutez avec l'assistant IA E-Outille : recommandations d'outillage INGCO, conseils techniques, suivi de commande et support client, par texte, voix ou photo.",
  alternates: { canonical: '/chat' },
  openGraph: {
    title: 'Assistant IA | E-Outille par ELECTRON',
    description:
      "Recommandations produits, conseils techniques et suivi de commande : l'assistant IA E-Outille répond par texte, voix ou photo.",
    url: '/chat',
    type: 'website',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
