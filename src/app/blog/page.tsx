import { Metadata } from 'next'
import Link from 'next/link'
import prisma from '@/lib/db/prisma'
import { NavigationArrows } from '@/components/NavigationArrows'

export const metadata: Metadata = {
  title: 'Blog E-Outilles | Conseils et Guide Outillage Professionnel',
  description: 'Blog expert: guides achat outils, conseils metiers BTP, electricite, garage. Decouvrez les meilleures pratiques pour votre activite.',
}

// Icons for categories
const categoryIcons: Record<string, string> = {
  'Construction': '🏗️',
  'Électricité': '⚡',
  'Garage': '🚗',
  'Jardinage': '🌿',
  'Conseils': '🛠️'
}

const categories = ['Tous', 'Construction', 'Électricité', 'Garage', 'Jardinage', 'Conseils']

// Icons for categories
const categoryIconsMap: Record<string, string> = {
  'Tous': '🏷️',
  'Construction': '🏗️',
  'Électricité': '⚡',
  'Garage': '🚗',
  'Jardinage': '🌿',
  'Conseils': '🛠️'
}

async function getBlogPosts(category?: string) {
  try {
    // First, get ALL posts to debug
    const allPosts = await prisma.blogPost.findMany()
    console.log('Total blog posts in DB:', allPosts.length)
    
    const where = category && category !== 'Tous' 
      ? { published: true, category } 
      : { published: true }
    
    const posts = await prisma.blogPost.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    })
    console.log('Filtered posts:', posts.length, 'category:', category)
    return posts
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
        {/* Header with Back Button */}
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center gap-2 text-ingco-yellow hover:text-yellow-400 transition-colors">
            <span>←</span> Retour à l'accueil
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-white">Blog </span>
            <span className="text-ingco-yellow">E-Outilles</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Conseils experts, guides d'achat et actualites pour les professionnels de l'outillage
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat) => {
            const isActive = (category || 'Tous') === cat
            return (
              <Link
                key={cat}
                href={cat === 'Tous' ? '/blog' : `/blog?category=${encodeURIComponent(cat)}`}
                className={`px-5 py-2 rounded-full font-medium transition-colors ${
                  isActive
                    ? 'bg-ingco-yellow text-ingco-black' 
                    : 'bg-ingco-gray text-gray-400 hover:text-ingco-yellow hover:bg-gray-700'
                }`}
              >
                <span className="mr-1">{categoryIconsMap[cat]}</span>{cat}
              </Link>
            )
          })}
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.length > 0 ? blogPosts.map((post) => (
            <article
              key={post.id}
              className="bg-ingco-gray rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-ingco-yellow/10 transition-all hover:-translate-y-2 group"
            >
              <Link href={`/blog/${post.slug}`}>
                <div className="h-48 bg-ingco-dark flex items-center justify-center text-6xl group-hover:scale-110 transition-transform">
                  {categoryIcons[post.category || 'Conseils'] || '📝'}
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
                  <h2 className="text-xl font-bold text-white mb-2 group-hover:text-ingco-yellow transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    {post.excerpt || post.content?.slice(0, 100)}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 text-xs">
                      {new Date(post.createdAt).toLocaleDateString('fr-FR')}
                    </span>
                    <span className="text-ingco-yellow text-sm group-hover:translate-x-2 transition-transform">
                      Lire →
                    </span>
                  </div>
                </div>
              </Link>
            </article>
          )) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-400">Aucun article pour le moment.</p>
              <Link href="/contact" className="text-ingco-yellow hover:underline mt-2 inline-block">
                Soumettre un article →
              </Link>
            </div>
          )}
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

        {/* Navigation Arrows */}
        <NavigationArrows />
      </div>
    </div>
  )
}
