import { Metadata } from 'next'
import Link from 'next/link'
import prisma from '@/lib/db/prisma'
import { notFound } from 'next/navigation'
import { NavigationArrows, Breadcrumb, Icon } from '@/components/Icons'
import { blogCategoryImage } from '@/lib/catalog'

function ShareButtons({ title, slug }: { title: string; slug: string }) {
  const base = process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_APP_URL || 'https://e-outilles.com'
  const url = `${base.replace(/\/$/, '')}/blog/${slug}`
  const enc = encodeURIComponent
  const links = [
    { label: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`, cls: 'bg-blue-600 hover:bg-blue-700' },
    { label: 'WhatsApp', href: `https://wa.me/?text=${enc(title + ' ' + url)}`, cls: 'bg-green-600 hover:bg-green-700' },
    { label: 'X', href: `https://twitter.com/intent/tweet?text=${enc(title)}&url=${enc(url)}`, cls: 'bg-sky-500 hover:bg-sky-600' },
    { label: 'LinkedIn', href: `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`, cls: 'bg-linkedin hover:opacity-90' },
  ]
  return (
    <div className="flex flex-wrap gap-2">
      <span className="text-gray-500 mr-2">Partager :</span>
      {links.map((l) => (
        <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer"
           className={`px-4 py-2 rounded-lg text-white transition-colors ${l.cls}`}>
          {l.label}
        </a>
      ))}
      <a href={`/api/qrcode?url=${enc(url)}`} download="article-qr.png"
         className="px-4 py-2 bg-ingco-gray rounded-lg text-white hover:bg-gray-700 inline-flex items-center gap-2">
        <Icon name="qr" className="w-4 h-4" /> QR
      </a>
    </div>
  )
}

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
        <Breadcrumb items={[{ label: 'Blog', href: '/blog' }, { label: post.category || 'Article' }]} />

        {/* Article Header */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={blogCategoryImage(post.category)} alt="" className="w-8 h-8 object-cover rounded-full" />
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
        <div className="bg-ingco-dark rounded-2xl overflow-hidden mb-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.image || blogCategoryImage(post.category)}
            alt={post.title}
            className="w-full h-64 md:h-80 object-cover"
          />
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
          <ShareButtons title={post.title} slug={post.slug} />
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
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={blogCategoryImage(p.category)} alt="" className="w-10 h-10 object-cover rounded-lg inline-block mr-3 align-middle" />
                <span className="text-white align-middle">{p.title}</span>
              </Link>
            )))}
          </div>
        </div>

        <div className="mt-12">
          <NavigationArrows current="/blog" />
        </div>
      </div>
    </div>
  )
}