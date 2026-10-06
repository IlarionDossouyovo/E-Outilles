import { Metadata } from 'next'
import Link from 'next/link'
import prisma from '@/lib/db/prisma'
import { NavigationArrows, Icon } from '@/components/Icons'
import NewsletterForm from '@/components/NewsletterForm'
import { blogCategoryImage } from '@/lib/catalog'

export const metadata: Metadata = {
  title: 'Blog E-Outilles | Conseils et Guides Outillage Professionnel',
  description:
    'Blog expert : guides achat outils, conseils métiers BTP, électricité, garage. Découvrez les meilleures pratiques pour votre activité.',
}

const CATEGORIES = [
  'Tous',
  'Construction',
  'Électricité',
  'Garage',
  'Jardinage',
  'Conseils',
  'Services',
  'Outils Sans Fil',
  'Outils à Air',
  'Soudeuse',
  'Générateurs',
  'Automobile',
  'Sécurité',
  'Accessoires',
]

async function getBlogPosts(category?: string) {
  try {
    const allPosts = await prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
    })
    if (category && category !== 'Tous') {
      return allPosts.filter((p) => p.category === category)
    }
    return allPosts
  } catch (error) {
    console.error('Blog fetch error:', error)
    return []
  }
}

export default async function BlogPage({ searchParams }: { searchParams: { category?: string } }) {
  const category = searchParams?.category
  const blogPosts = await getBlogPosts(category)

  return (
    <div className="min-h-screen bg-ingco-black pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center gap-2 text-ingco-yellow hover:text-yellow-400 transition-colors">
            <Icon name="arrow-left" className="w-4 h-4" /> Retour à l&apos;accueil
          </Link>
        </div>

        <div className="text-center mb-12 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-white">Blog </span>
            <span className="text-ingco-yellow">E-Outilles</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Conseils experts, guides d&apos;achat et actualités pour les professionnels de l&apos;outillage
          </p>
        </div>

        {/* Category filter with real images */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {CATEGORIES.map((cat) => {
            const isActive = (category || 'Tous') === cat
            return (
              <Link
                key={cat}
                href={cat === 'Tous' ? '/blog' : `/blog?category=${encodeURIComponent(cat)}`}
                className={`px-4 py-2 rounded-full font-medium transition-all flex items-center gap-2 ${
                  isActive
                    ? 'bg-ingco-yellow text-ingco-black'
                    : 'bg-ingco-gray text-gray-400 hover:text-ingco-yellow hover:bg-gray-700'
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={blogCategoryImage(cat)} alt="" className="w-6 h-6 object-cover rounded-full" />
                {cat}
              </Link>
            )
          })}
        </div>

        {/* Blog grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.length > 0 ? (
            blogPosts.map((post, i) => (
              <article
                key={post.id}
                className="card-premium bg-ingco-gray rounded-2xl overflow-hidden animate-fade-in-up group border border-white/5"
                style={{ animationDelay: `${Math.min(i * 0.05, 0.4)}s` }}
              >
                <Link href={`/blog/${post.slug}`}>
                  <div className="h-48 bg-ingco-dark overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={post.image || blogCategoryImage(post.category)}
                      alt={post.title}
                      className="w-full h-48 object-cover card-icon"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-xs text-ingco-yellow font-medium uppercase tracking-wide">
                        {post.category}
                      </span>
                      <span className="text-gray-500 text-xs">
                        {Math.max(1, Math.ceil((post.content?.length || 500) / 1000))} min
                      </span>
                    </div>
                    <h2 className="text-xl font-bold text-white mb-2 group-hover:text-ingco-yellow transition-colors line-clamp-2">
                      {post.title}
                    </h2>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                      {post.excerpt || post.content?.slice(0, 100)}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 text-xs">
                        {new Date(post.createdAt).toLocaleDateString('fr-FR')}
                      </span>
                      <span className="text-ingco-yellow text-sm inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        Lire <Icon name="arrow-right" className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              </article>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-400">Aucun article pour le moment.</p>
              <Link href="/contact" className="text-ingco-yellow hover:underline mt-2 inline-block">
                Soumettre un article
              </Link>
            </div>
          )}
        </div>

        {/* Newsletter CTA */}
        <div className="mt-16 bg-ingco-dark rounded-3xl p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            <span className="text-white">Restez </span>
            <span className="text-ingco-yellow">informé !</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto mb-6">
            Recevez nos conseils et offres exclusives directement dans votre boîte mail
          </p>
          <NewsletterForm />
        </div>

        <div className="mt-12">
          <NavigationArrows current="/blog" />
        </div>
      </div>
    </div>
  )
}
