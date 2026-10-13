import type { Metadata } from 'next'
import Link from 'next/link'
import { Icon } from '@/components/Icons'
import Reveal from '@/components/Reveal'
import PageNavigation from '@/components/PageNavigation'
import { FOUNDER, founderMailto, founderTel, founderWhatsApp } from '@/lib/founder'

export const metadata: Metadata = {
  title: 'Le Fondateur | E-Outilles par ELECTRON',
  description:
    "Rencontrez Ilarion Dossouyovo, fondateur et PDG d'E-Outilles : parcours, vision et engagement pour rendre l'outillage professionnel INGCO accessible aux artisans d'Afrique de l'Ouest.",
  alternates: { canonical: '/fondateur' },
  openGraph: {
    type: 'profile',
    title: 'Ilarion Dossouyovo - Fondateur & PDG | E-Outilles',
    description:
      "De l'idée au terrain : rendre l'outillage professionnel accessible à chaque artisan africain.",
    url: '/fondateur',
  },
}

const STATS = [
  { value: FOUNDER.since, label: 'Année de création' },
  { value: '500+', label: 'Produits INGCO' },
  { value: '50+', label: 'Pays livrés' },
  { value: '200+', label: 'Revendeurs partenaires' },
]

export default function FounderPage() {
  return (
    <div className="min-h-screen bg-ingco-black">
      <div className="pt-24 max-w-7xl mx-auto px-4">
        <PageNavigation />
      </div>

      {/* Hero */}
      <section className="pt-16 pb-16 md:pt-24 md:pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-ingco-yellow/10 via-transparent to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid md:grid-cols-[auto,1fr] gap-10 items-center">
            <Reveal className="flex justify-center">
              <div className="relative">
                <div className="w-40 h-40 md:w-52 md:h-52 rounded-3xl bg-gradient-to-br from-ingco-yellow to-yellow-600 flex items-center justify-center shadow-2xl shadow-ingco-yellow/20">
                  <span className="text-6xl md:text-7xl font-black text-black tracking-tight">
                    {FOUNDER.initials}
                  </span>
                </div>
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-ingco-gray border border-ingco-yellow/40 text-ingco-yellow text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap">
                  {FOUNDER.role}
                </div>
              </div>
            </Reveal>

            <Reveal delay={1} className="text-center md:text-left">
              <p className="text-ingco-yellow font-bold tracking-widest text-sm uppercase mb-3">
                Le fondateur
              </p>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">{FOUNDER.name}</h1>
              <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto md:mx-0 mb-6">
                {FOUNDER.tagline}
              </p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-gray-400 mb-8">
                <span className="inline-flex items-center gap-2">
                  <Icon name="grid" className="w-4 h-4 text-ingco-yellow" /> {FOUNDER.company}
                </span>
                <span className="inline-flex items-center gap-2">
                  <Icon name="info" className="w-4 h-4 text-ingco-yellow" /> {FOUNDER.location}
                </span>
              </div>
              <div className="flex flex-wrap justify-center md:justify-start gap-3">
                <a
                  href={founderMailto()}
                  className="inline-flex items-center gap-2 bg-ingco-yellow text-black font-semibold px-6 py-3 rounded-xl hover:bg-yellow-400 transition-colors"
                >
                  <Icon name="chat" className="w-4 h-4" /> Contacter
                </a>
                <a
                  href={founderWhatsApp()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-ingco-gray text-white font-semibold px-6 py-3 rounded-xl border border-white/10 hover:border-ingco-yellow/50 transition-colors"
                >
                  <Icon name="phone" className="w-4 h-4" /> WhatsApp
                </a>
                <Link
                  href="/revendeurs"
                  className="inline-flex items-center gap-2 bg-ingco-gray text-white font-semibold px-6 py-3 rounded-xl border border-white/10 hover:border-ingco-yellow/50 transition-colors"
                >
                  Devenir revendeur <Icon name="arrow-right" className="w-4 h-4" />
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="bg-ingco-gray rounded-3xl p-8 md:p-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {STATS.map((s) => (
                <div key={s.label} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-ingco-yellow">{s.value}</div>
                  <div className="text-gray-500 text-sm mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Bio */}
      <section className="pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">Son parcours</h2>
            <div className="space-y-4 text-gray-400 leading-relaxed">
              {FOUNDER.bio.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Timeline */}
      <section className="pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">Les grandes étapes</h2>
          </Reveal>
          <ol className="relative border-l border-ingco-gray ml-3 space-y-8">
            {FOUNDER.milestones.map((m, i) => (
              <Reveal key={`${m.year}-${i}`} delay={Math.min(i + 1, 6)} className="ml-6">
                <span className="absolute -left-[9px] mt-1 w-4 h-4 rounded-full bg-ingco-yellow border-4 border-ingco-black" />
                <div className="bg-ingco-dark rounded-2xl p-5">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-ingco-yellow font-bold">{m.year}</span>
                    <span className="text-white font-semibold">{m.title}</span>
                  </div>
                  <p className="text-gray-400 text-sm">{m.description}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Expertise */}
      <section className="pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-10">
              Ses domaines d&apos;expertise
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FOUNDER.expertise.map((e, i) => (
              <Reveal key={e.title} delay={Math.min(i + 1, 6)}>
                <div className="h-full bg-ingco-gray rounded-2xl p-6 card-premium">
                  <div className="w-12 h-12 bg-ingco-yellow/15 rounded-xl flex items-center justify-center mb-4">
                    <Icon name={e.icon} className="w-6 h-6 text-ingco-yellow" />
                  </div>
                  <h3 className="text-white font-bold mb-2">{e.title}</h3>
                  <p className="text-gray-400 text-sm">{e.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Vision quote */}
      <section className="pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <blockquote className="bg-gradient-to-r from-ingco-yellow/20 to-transparent rounded-3xl p-8 md:p-12 border-l-4 border-ingco-yellow">
              <Icon name="star" className="w-8 h-8 text-ingco-yellow mb-4" />
              <p className="text-xl md:text-2xl text-white font-medium leading-relaxed mb-4">
                « {FOUNDER.vision} »
              </p>
              <footer className="text-gray-400">
                — {FOUNDER.name}, {FOUNDER.role}
              </footer>
            </blockquote>
          </Reveal>
        </div>
      </section>

      {/* Values */}
      <section className="pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-10">
              Ses valeurs
            </h2>
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {FOUNDER.values.map((v, i) => (
              <Reveal key={v.title} delay={Math.min(i + 1, 6)} className="text-center">
                <Icon name={v.icon} className="w-8 h-8 text-ingco-yellow mx-auto mb-3" />
                <h3 className="text-white font-semibold">{v.title}</h3>
                <p className="text-gray-500 text-sm mt-1">{v.description}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="bg-ingco-gray rounded-3xl p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              Travaillons ensemble
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto mb-8">
              Une question sur un produit, un projet de revente ou un partenariat ? Le fondateur et
              son équipe vous répondent.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <a
                href={founderMailto()}
                className="inline-flex items-center gap-2 bg-ingco-yellow text-black font-semibold px-6 py-3 rounded-xl hover:bg-yellow-400 transition-colors"
              >
                <Icon name="chat" className="w-4 h-4" /> {FOUNDER.email}
              </a>
              <a
                href={founderTel()}
                className="inline-flex items-center gap-2 bg-ingco-dark text-white font-semibold px-6 py-3 rounded-xl border border-white/10 hover:border-ingco-yellow/50 transition-colors"
              >
                <Icon name="phone" className="w-4 h-4" /> {FOUNDER.phone}
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-ingco-dark text-white font-semibold px-6 py-3 rounded-xl border border-white/10 hover:border-ingco-yellow/50 transition-colors"
              >
                Formulaire de contact <Icon name="arrow-right" className="w-4 h-4" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  )
}
