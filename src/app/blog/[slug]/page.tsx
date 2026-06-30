import { Metadata } from 'next'
import Link from 'next/link'
import prisma from '@/lib/db/prisma'
import { notFound } from 'next/navigation'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await prisma.blogPost.findUnique({ where: { slug } })
  if (!post) return { title: 'Article non trouvé' }
  
  return {
    title: `${post.title} | Blog E-Outilles`,
    description: post.excerpt || post.content?.slice(0, 160)
  }
}

const categoryIcons: Record<string, string> = {
  'Construction': '🏗️',
  'Électricité': '⚡',
  'Garage': '🚗',
  'Jardinage': '🌿',
  'Conseils': '🛠️'
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = await prisma.blogPost.findUnique({ 
    where: { slug } 
  })
  
  if (!post) {
    notFound()
  }

  // Simple markdown-like rendering
  const content = post.content
    ?.replace(/^## (.+)$/gm, '<h2 class="text-2xl font-bold text-white mt-8 mb-4">$1</h2>')
    ?.replace(/^### (.+)$/gm, '<h3 class="text-xl font-semibold text-yellow-400 mt-6 mb-3">$1</h3>')
    ?.replace(/\*\*(.+?)\*\*/g, '<strong class="text-yellow-400">$1</strong>')
    ?.replace(/^- (.+)$/gm, '<li class="ml-4 mb-2">• $1</li>')
    ?.replace(/\n\n/g, '</p><p class="mb-4">')
    ?? ''

  return (
    <div className="min-h-screen bg-ingco-black pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/blog" className="inline-flex items-center gap-2 text-ingco-yellow hover:text-yellow-400 transition-colors">
            <span>←</span> Retour au blog
          </Link>
        </div>

        {/* Article Header */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">{categoryIcons[post.category || 'Conseils'] || '📝'}</span>
            <span className="text-ingco-yellow font-medium">{post.category}</span>
            <span className="text-gray-500">•</span>
            <span className="text-gray-500">{new Date(post.createdAt).toLocaleDateString('fr-FR')}</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {post.title}
          </h1>
          
          {post.excerpt && (
            <p className="text-gray-400 text-lg">{post.excerpt}</p>
          )}
          
          {post.author && (
            <p className="text-gray-500 mt-4">Par {post.author}</p>
          )}
        </header>

        {/* Featured Image */}
        <div className="bg-ingco-dark rounded-2xl p-12 mb-8 text-center text-8xl">
          {categoryIcons[post.category || 'Conseils'] || '📝'}
        </div>

        {/* Article Content */}
        <article className="prose prose-invert max-w-none">
          <div 
            className="text-gray-300 leading-relaxed"
            dangerouslySetInnerHTML={{ 
              __html: content || '<p>Aucun contenu disponible.</p>' 
            }}
          />
        </article>

        {/* Share & Tags */}
        <div className="mt-12 pt-8 border-t border-ingco-gray">
          <div className="flex flex-wrap gap-2">
            <span className="text-gray-500 mr-2">Partager:</span>
            <button className="px-4 py-2 bg-blue-600 rounded-lg text-white hover:bg-blue-700">
              Facebook
            </button>
            <button className="px-4 py-2 bg-sky-500 rounded-lg text-white hover:bg-sky-600">
              Twitter
            </button>
            <button className="px-4 py-2 bg-linkedin rounded-lg text-white hover:bg-linkedin">
              LinkedIn
            </button>
          </div>
        </div>

        {/* Related Posts */}
        <div className="mt-12">
          <h3 className="text-xl font-bold text-white mb-4">Articles similaires</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {await prisma.blogPost.findMany({
              where: { 
                id: { not: post.id },
                category: post.category
              },
              take: 2
            }).then(posts => posts.map(p => (
              <Link 
                key={p.id}
                href={`/blog/${p.slug}`}
                className="block bg-ingco-gray rounded-xl p-4 hover:bg-gray-700 transition-colors"
              >
                <span className="text-2xl mr-2">{categoryIcons[p.category || 'Conseils']}</span>
                <span className="text-white">{p.title}</span>
              </Link>
            )))}
          </div>
        </div>
      </div>
    </div>
  )
}