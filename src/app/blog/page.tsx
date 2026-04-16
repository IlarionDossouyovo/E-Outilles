import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog E-Outilles | Conseils et Guide Outillage Professionnel',
  description: 'Blog expert: guides achat outils, conseils metiers BTP, electricite, garage. Decouvrez les meilleures pratiques pour votre activite.',
}

const blogPosts = [
  {
    id: 'top-outils-chantier-2026',
    title: 'Top 10 Outils Chantier 2026',
    excerpt: 'Les outils indispensables pour les professionnels du BTP cette annee.',
    category: 'Construction',
    date: '2026-04-01',
    readTime: '8 min',
    image: '🏗️'
  },
  {
    id: 'securite-electrique-pro',
    title: 'Guide Securite Electrique Professionnelle',
    excerpt: 'Tout savoir sur les normes et equipements pour travailler en toute securite.',
    category: 'Electricite',
    date: '2026-03-15',
    readTime: '12 min',
    image: '⚡'
  },
  {
    id: 'equipement-garage-louable',
    title: 'Equipement Garage: Investissement Locatif',
    excerpt: 'Comment equiper votre garage pour proposer des services de location.',
    category: 'Garage',
    date: '2026-03-01',
    readTime: '6 min',
    image: '🚗'
  },
  {
    id: 'business-jardinage',
    title: 'Creer un Business Jardinage Professionnel',
    excerpt: 'Les outils essentiels pour debuter dans le paysagisme et l entretien espaces verts.',
    category: 'Jardinage',
    date: '2026-02-15',
    readTime: '10 min',
    image: '🌱'
  },
  {
    id: 'choix-perceuse-visseuse',
    title: 'Comment Choisir sa Perceuse Visseuse?',
    excerpt: 'Guide complet pour choisir le bon outil selon vos besoins.',
    category: 'Conseils',
    date: '2026-02-01',
    readTime: '15 min',
    image: '🔩'
  },
  {
    id: 'maintenance-outils',
    title: 'Entretien et Maintenance Outils Professionnels',
    excerpt: 'Conseils pour prolonger la vie de vos equipements INGCO.',
    category: 'Conseils',
    date: '2026-01-15',
    readTime: '7 min',
    image: '🛠️'
  }
]

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-ingco-black pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-white">Blog </span>
            <span className="text-ingco-yellow">E-Outilles</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Conseils experts, guides dachat et actualites pour les professionnels de loutillage
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {['Tous', 'Construction', 'Electricite', 'Garage', 'Jardinage', 'Conseils'].map((cat) => (
            <button
              key={cat}
              className={`px-5 py-2 rounded-full font-medium transition-colors ${
                cat === 'Tous' 
                  ? 'bg-ingco-yellow text-ingco-black' 
                  : 'bg-ingco-gray text-gray-400 hover:text-ingco-yellow'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <article
              key={post.id}
              className="bg-ingco-gray rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-ingco-yellow/10 transition-all hover:-translate-y-2 group cursor-pointer"
            >
              <div className="h-48 bg-ingco-dark flex items-center justify-center text-6xl group-hover:scale-110 transition-transform">
                {post.image}
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs text-ingco-yellow font-medium uppercase tracking-wide">
                    {post.category}
                  </span>
                  <span className="text-gray-500 text-xs">
                    {post.readTime}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-white mb-2 group-hover:text-ingco-yellow transition-colors">
                  {post.title}
                </h2>
                <p className="text-gray-400 text-sm mb-4">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 text-xs">
                    {new Date(post.date).toLocaleDateString('fr-FR')}
                  </span>
                  <span className="text-ingco-yellow text-sm group-hover:translate-x-2 transition-transform">
                    Lire →
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Newsletter CTA */}
        <div className="mt-16 bg-ingco-dark rounded-3xl p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            <span className="text-white">Restez </span>
            <span className="text-ingco-yellow">informé!</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto mb-6">
            Recevez nos conseils et offres exclusives directement dans votre boite mail
          </p>
          <form className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Votre email..."
              className="flex-1 bg-ingco-gray border border-ingco-dark rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-ingco-yellow focus:outline-none"
            />
            <button
              type="submit"
              className="bg-ingco-yellow text-ingco-black px-8 py-3 rounded-xl font-bold hover:bg-yellow-400 transition-colors"
            >
              S&apos;abonner
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
