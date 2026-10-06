'use client'

import Link from 'next/link'
import { NavigationArrows, Icon } from '@/components/Icons'
import Reveal from '@/components/Reveal'
import { categoryImage } from '@/lib/catalog'

// Données des catégories par métier - 15 catégories INGCO
const categories = [
  {
    id: 'power-tools',
    name: 'Outils Électriques',
    products: ['Perceuses', 'Meuleuses', 'Scies', 'Marteau perforateur'],
    blog: 'Guide outils électriques 2026',
    description: 'Outils électriques professionnels',
    color: 'from-red-500 to-red-700'
  },
  {
    id: 'cordless-tools',
    name: 'Outils Sans Fil',
    products: ['Perceuses visseuses', 'Clés à chocs', 'Scies circulaires'],
    blog: 'Avantages outils sans fil',
    description: 'Liberté sans fil pour pros',
    color: 'from-blue-600 to-blue-800'
  },
  {
    id: 'hand-tools',
    name: 'Outils à Main',
    products: ['Clés', 'Tournevis', 'Pinces', 'Marteaux'],
    blog: 'Trousse outils essentielle',
    description: 'Outils à main professionnels',
    color: 'from-blue-500 to-blue-700'
  },
  {
    id: 'air-tools',
    name: 'Outils à Air',
    products: ['Compresseurs', 'Clés à chocs pneumatiques', 'Pistolets'],
    blog: 'Guide compresseurs',
    description: 'Outils pneumatiques pros',
    color: 'from-sky-500 to-sky-700'
  },
  {
    id: 'measuring',
    name: 'Mesure & Niveau',
    products: ['Niveaux laser', 'Multimètres', 'Détecteurs'],
    blog: 'Précision mesures',
    description: 'Instruments de mesure',
    color: 'from-purple-500 to-purple-700'
  },
  {
    id: 'garden',
    name: 'Jardinage',
    products: ['Tondeuses', 'Tronçonneuses', 'Taille-haies'],
    blog: 'Entretien jardin pro',
    description: 'Équipement paysagement',
    color: 'from-green-500 to-green-700'
  },
  {
    id: 'automotive',
    name: 'Automobile',
    products: ['Crics', 'Chandelles', 'Clés à chocs'],
    blog: 'Outils mécanicien',
    description: 'Équipement garage auto',
    color: 'from-orange-500 to-orange-700'
  },
  {
    id: 'drilling',
    name: 'Forage & Découpe',
    products: ['Burins', 'Disques', 'Scies trépans'],
    blog: 'Guide forage professionnel',
    description: 'Accessoires forage',
    color: 'from-gray-500 to-gray-700'
  },
  {
    id: 'welding',
    name: 'Soudeuse & Welding',
    products: ['Machines à souder', 'Masques', 'Electrodes'],
    blog: 'Initiation soudure MMA',
    description: 'Équipement soudure',
    color: 'from-red-600 to-red-800'
  },
  {
    id: 'generators',
    name: 'Générateurs',
    products: ['Groupes électrogènes', 'Inverters'],
    blog: 'Choisir générateur',
    description: 'Alimentation électrique',
    color: 'from-yellow-600 to-yellow-800'
  },
  {
    id: 'construction',
    name: 'Construction',
    products: ['Vibreurs à béton', 'Aiguilles vibrantes'],
    blog: 'Outils chantier BTP',
    description: 'Équipement construction',
    color: 'from-amber-600 to-amber-800'
  },
  {
    id: 'pumps',
    name: 'Pompes & Eau',
    products: ['Pompes submersibles', 'Pompes surface'],
    blog: 'Gestion eaux',
    description: 'Pompes et irrigation',
    color: 'from-cyan-500 to-cyan-700'
  },
  {
    id: 'safety',
    name: 'Sécurité',
    products: ['Casques', 'Gants', 'Chaussures', 'Lunettes'],
    blog: 'EPI obligatoires',
    description: 'Équipements protection',
    color: 'from-yellow-500 to-yellow-700'
  },
  {
    id: 'storage',
    name: 'Rangement',
    products: ['Caisse à outils', 'Coffrets', 'Armoires'],
    blog: 'Organisation atelier',
    description: 'Rangement outils',
    color: 'from-teal-500 to-teal-700'
  },
  {
    id: 'accessories',
    name: 'Accessoires',
    products: ['Batteries', 'Chargeurs', 'Disques', 'Forets'],
    blog: 'Choisir accessoires',
    description: 'Accessoires tous outils',
    color: 'from-indigo-500 to-indigo-700'
  }
]

// Produits vedettes
const featuredProducts = [
  { id: 1, name: 'Perceuse visseuse INGCO 20V', price: 89.99, image: '/products/perceuse-visseuse.svg', category: 'construction' },
  { id: 2, name: 'Marteau perforateur SDS Max 1500W', price: 249.99, image: '/products/marteau-perforateur.svg', category: 'construction' },
  { id: 3, name: 'Multimètre digital professionnel', price: 59.99, image: '/products/multimetre.svg', category: 'electricite' },
  { id: 4, name: 'Kit clés mécaniciennes 50pcs', price: 79.99, image: '/products/kit-cles.svg', category: 'garage' },
  { id: 5, name: 'Tondeuse thermique pro 160cc', price: 399.99, image: '/products/tondeuse.svg', category: 'jardinage' },
  { id: 6, name: 'Tronçonneuse thermique 45cm', price: 299.99, image: '/products/tronconneuse.svg', category: 'jardinage' },
]

export default function Home() {
  return (
    <div className="bg-ingco-black">
      {/* HERO */}
      <section className="relative overflow-hidden min-h-[92vh] flex items-center pt-28 pb-20">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-950/20 to-black">
          <div className="absolute inset-0 opacity-40">
            <div
              className="absolute inset-0 animate-grid"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(255,196,0,0.18) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255,196,0,0.18) 1px, transparent 1px)
                `,
                backgroundSize: '32px 32px',
              }}
            />
          </div>
          <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-gradient-to-br from-yellow-500/25 to-transparent rounded-full blur-[120px] animate-float" />
          <div
            className="absolute -bottom-32 -right-32 w-[600px] h-[600px] bg-gradient-to-tl from-purple-600/25 to-transparent rounded-full blur-[120px] animate-float"
            style={{ animationDelay: '1.5s' }}
          />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-blue-500/20 to-transparent rounded-full blur-[100px] animate-glow" />
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            <div className="text-center lg:text-left">
              <div className="animate-fade-in-up inline-flex items-center gap-2 bg-ingco-gray/50 backdrop-blur rounded-full px-4 py-2 mb-6 border border-white/5">
                <span className="w-2 h-2 bg-ingco-yellow rounded-full animate-pulse" />
                <span className="text-gray-300 text-sm">Distribution officielle INGCO · Afrique de l&apos;Ouest</span>
              </div>

              <h1 className="animate-fade-in-up stagger-1 text-4xl md:text-6xl xl:text-7xl font-extrabold leading-[1.05] mb-6">
                <span className="text-white">L&apos;outillage </span>
                <span className="bg-gradient-to-r from-ingco-yellow via-yellow-300 to-ingco-yellow bg-clip-text text-transparent text-shadow-glow">
                  professionnel
                </span>
                <br />
                <span className="text-white">accessible à tous</span>
              </h1>

              <p className="animate-fade-in-up stagger-2 text-gray-400 text-lg md:text-xl max-w-2xl mx-auto lg:mx-0 mb-8">
                Votre partenaire dropshipping international pour outillage professionnel.
                Qualité INGCO, livraison mondiale, prix fabricant.
              </p>

              <div className="animate-fade-in-up stagger-3 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  href="/search"
                  className="group inline-flex items-center justify-center gap-2 bg-ingco-yellow text-ingco-black px-8 py-4 rounded-xl font-bold text-lg hover:bg-yellow-400 transition-all hover:scale-[1.03] hover:shadow-xl hover:shadow-ingco-yellow/30"
                >
                  Découvrir le catalogue
                  <Icon name="arrow-right" className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/revendeurs"
                  className="inline-flex items-center justify-center gap-2 border border-ingco-gray text-white px-8 py-4 rounded-xl font-bold text-lg hover:border-ingco-yellow hover:text-ingco-yellow hover:bg-ingco-yellow/5 transition-all"
                >
                  Devenir revendeur
                </Link>
              </div>

              <div className="animate-fade-in-up stagger-4 grid grid-cols-2 md:grid-cols-4 gap-6 mt-14">
                {[
                  { value: '500+', label: 'Produits' },
                  { value: '50+', label: 'Pays livrés' },
                  { value: '24h', label: 'Livraison' },
                  { value: '100%', label: 'Satisfait ou remboursé' },
                ].map((stat) => (
                  <div key={stat.label} className="text-center lg:text-left">
                    <div className="text-3xl md:text-4xl font-extrabold text-ingco-yellow">{stat.value}</div>
                    <div className="text-gray-500 text-sm">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="hidden lg:block relative animate-fade-in stagger-2">
              <div className="relative rounded-3xl border border-white/5 bg-gradient-to-br from-ingco-gray/60 to-ingco-dark/60 backdrop-blur p-8 animate-float">
                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-ingco-yellow/20 to-transparent blur-2xl -z-10" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={categoryImage('power-tools')}
                  alt="Outillage professionnel INGCO"
                  className="w-full max-h-[340px] object-contain drop-shadow-2xl"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-ingco-gray/90 backdrop-blur rounded-2xl p-4 border border-white/5 shadow-xl animate-fade-in-up stagger-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-ingco-yellow/20 flex items-center justify-center">
                    <Icon name="truck" className="w-5 h-5 text-ingco-yellow" />
                  </div>
                  <div>
                    <div className="text-white font-semibold text-sm">Livraison mondiale</div>
                    <div className="text-gray-500 text-xs">Sans stock, sans frontière</div>
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 bg-ingco-gray/90 backdrop-blur rounded-2xl p-4 border border-white/5 shadow-xl animate-fade-in-up stagger-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                    <Icon name="check" className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <div className="text-white font-semibold text-sm">Qualité certifiée</div>
                    <div className="text-gray-500 text-xs">Garantie fabricant</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST BAND */}
      <section className="border-y border-ingco-gray bg-ingco-dark/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {([
            { icon: 'truck', title: 'Dropshipping mondial', text: 'Livraison directe, sans stock' },
            { icon: 'chat', title: 'IA Marketing', text: 'Campagnes automatisées' },
            { icon: 'card', title: 'Paiements locaux', text: 'MTN, Orange, Flutterwave' },
            { icon: 'shield', title: 'Paiement sécurisé', text: 'Stripe & 3D Secure' },
          ] as const).map((f, i) => (
            <Reveal key={f.title} delay={i * 80} className="flex items-center gap-3">
              <div className="w-11 h-11 shrink-0 rounded-xl bg-ingco-yellow/15 flex items-center justify-center">
                <Icon name={f.icon} className="w-5 h-5 text-ingco-yellow" />
              </div>
              <div>
                <div className="text-white font-semibold text-sm">{f.title}</div>
                <div className="text-gray-500 text-xs">{f.text}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section id="categories" className="py-20 md:py-28 bg-ingco-dark scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center mb-14">
            <span className="text-ingco-yellow text-sm font-semibold uppercase tracking-widest">Catalogue</span>
            <h2 className="text-3xl md:text-5xl font-extrabold mt-3 mb-4">
              <span className="text-white">Parcourir par </span>
              <span className="text-ingco-yellow">métier</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Des solutions spécialisées pour chaque secteur d&apos;activité
            </p>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, i) => (
              <Reveal key={category.id} delay={(i % 4) * 80}>
                <Link
                  href={`/categories/${category.id}`}
                  className="card-premium group h-full bg-ingco-gray rounded-2xl p-6 border border-white/5 hover:border-ingco-yellow/30 block"
                >
                  <div className="w-full h-24 mb-4 flex items-center justify-center rounded-xl bg-ingco-dark overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={categoryImage(category.id)}
                      alt={category.name}
                      loading="lazy"
                      className="card-icon max-h-20 object-contain"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-ingco-yellow transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-gray-500 text-sm mb-4">{category.description}</p>

                  <div className="border-t border-ingco-dark pt-4">
                    <p className="text-xs text-gray-500 mb-2">Produits clés</p>
                    <div className="flex flex-wrap gap-2">
                      {category.products.slice(0, 3).map((product, idx) => (
                        <span key={idx} className="text-xs bg-ingco-dark px-2 py-1 rounded text-gray-400">
                          {product}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-2 text-ingco-yellow text-sm font-medium">
                    <span className="line-clamp-1">Blog: {category.blog}</span>
                    <Icon name="arrow-right" className="w-4 h-4 shrink-0 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED */}
      <section id="products" className="py-20 md:py-28 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center mb-14">
            <span className="text-ingco-yellow text-sm font-semibold uppercase tracking-widest">Best-sellers</span>
            <h2 className="text-3xl md:text-5xl font-extrabold mt-3 mb-4">
              <span className="text-white">Produits </span>
              <span className="text-ingco-yellow">vedettes</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Les meilleures ventes de notre catalogue professionnel
            </p>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product, i) => (
              <Reveal key={product.id} delay={(i % 3) * 100}>
                <div className="card-premium group h-full bg-ingco-gray rounded-2xl overflow-hidden border border-white/5 hover:border-ingco-yellow/30">
                  <Link href={`/categories/${product.category}`} className="block h-48 bg-ingco-dark flex items-center justify-center overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                      className="card-icon max-h-40 object-contain"
                    />
                  </Link>
                  <div className="p-6">
                    <Link href={`/categories/${product.category}`} className="text-xs text-ingco-yellow mb-2 uppercase tracking-wide hover:underline block">
                      {categories.find((c) => c.id === product.category)?.name}
                    </Link>
                    <h3 className="text-lg font-bold text-white mb-3 line-clamp-2">{product.name}</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-extrabold text-ingco-yellow">{product.price}€</span>
                      <Link
                        href={`/categories/${product.category}`}
                        className="inline-flex items-center gap-1.5 bg-ingco-yellow text-ingco-black px-4 py-2 rounded-lg font-semibold text-sm hover:bg-yellow-400 transition-colors"
                      >
                        Voir <Icon name="arrow-right" className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal className="text-center mt-12">
            <Link href="/search" className="inline-flex items-center gap-2 border border-ingco-yellow text-ingco-yellow px-8 py-3 rounded-xl font-semibold hover:bg-ingco-yellow hover:text-ingco-black transition-all">
              Voir tous les produits <Icon name="arrow-right" className="w-4 h-4" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-ingco-yellow/15 via-transparent to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <Reveal className="bg-ingco-gray rounded-3xl p-8 md:p-16 text-center border border-white/5 relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-ingco-yellow/10 rounded-full blur-3xl" />
            <h2 className="text-3xl md:text-5xl font-extrabold mb-4 relative">
              <span className="text-white">Prêt à démarrer votre </span>
              <span className="text-ingco-yellow">activité dropshipping ?</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto mb-8 relative">
              Rejoignez notre réseau de revendeurs et accédez à des marges avantageuses,
              un catalogue de 500+ produits et un support client dédié.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center relative">
              <Link
                href="/auth/register"
                className="inline-flex items-center justify-center gap-2 bg-ingco-yellow text-ingco-black px-8 py-4 rounded-xl font-bold text-lg hover:bg-yellow-400 transition-all hover:scale-[1.03]"
              >
                Créer mon compte revendeur <Icon name="arrow-right" className="w-5 h-5" />
              </Link>
              <Link
                href="/auth/login"
                className="inline-flex items-center justify-center border border-ingco-gray text-white px-8 py-4 rounded-xl font-bold text-lg hover:border-ingco-yellow hover:text-ingco-yellow transition-all"
              >
                Me connecter
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 pb-12">
        <NavigationArrows current="/" />
      </div>
    </div>
  )
}
