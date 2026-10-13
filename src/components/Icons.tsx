import Link from 'next/link'
import type { ReactNode } from 'react'

// Real SVG icon set (no emoji) used across the app.

export type IconName =
  | 'home' | 'search' | 'grid' | 'chat' | 'blog' | 'cart' | 'heart' | 'card'
  | 'settings' | 'user' | 'info' | 'phone' | 'tools' | 'key' | 'logout'
  | 'download' | 'qr' | 'arrow-left' | 'arrow-right' | 'chevron-left' | 'chevron-right'
  | 'check' | 'warning' | 'spinner' | 'star' | 'truck' | 'shield' | 'wrench' | 'zap'
  | 'camera' | 'image' | 'mic' | 'volume' | 'volume-off' | 'paperclip' | 'x' | 'send'
  | 'share' | 'facebook' | 'instagram' | 'tiktok' | 'youtube' | 'linkedin' | 'twitter' | 'whatsapp' | 'megaphone'

const PATHS: Record<IconName, ReactNode> = {
  home: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10.5L12 3l9 7.5M5 9.5V21h5v-6h4v6h5V9.5" />,
  search: <><circle cx="11" cy="11" r="7" strokeWidth={2} /><path strokeLinecap="round" strokeWidth={2} d="M20 20l-3.5-3.5" /></>,
  grid: <><rect x="3" y="3" width="7" height="7" rx="1.5" strokeWidth={2} /><rect x="14" y="3" width="7" height="7" rx="1.5" strokeWidth={2} /><rect x="3" y="14" width="7" height="7" rx="1.5" strokeWidth={2} /><rect x="14" y="14" width="7" height="7" rx="1.5" strokeWidth={2} /></>,
  chat: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a8 8 0 01-11.5 7.2L4 21l1.8-5.5A8 8 0 1121 12z" />,
  blog: <><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 4h11l3 3v13H5z" /><path strokeLinecap="round" strokeWidth={2} d="M8 9h8M8 13h8M8 17h5" /></>,
  cart: <><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h2l2.4 11.2A2 2 0 009.36 17h8.3a2 2 0 001.95-1.55L21 8H6" /><circle cx="10" cy="20" r="1.5" strokeWidth={2} /><circle cx="18" cy="20" r="1.5" strokeWidth={2} /></>,
  heart: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 20s-7-4.4-9.2-9A5 5 0 0112 5.5 5 5 0 0121.2 11C19 15.6 12 20 12 20z" />,
  card: <><rect x="2" y="5" width="20" height="14" rx="2.5" strokeWidth={2} /><path strokeWidth={2} d="M2 10h20" /></>,
  settings: <><circle cx="12" cy="12" r="3" strokeWidth={2} /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.4 15a1.6 1.6 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.6 1.6 0 00-2.7 1.1V21a2 2 0 11-4 0v-.1A1.6 1.6 0 006.6 19.4l-.1.1a2 2 0 11-2.8-2.8l.1-.1A1.6 1.6 0 003 15a2 2 0 010-4 1.6 1.6 0 001.1-2.7l-.1-.1a2 2 0 112.8-2.8l.1.1A1.6 1.6 0 009.6 4.6V4a2 2 0 014 0v.1A1.6 1.6 0 0016.3 5.4l.1-.1a2 2 0 112.8 2.8l-.1.1A1.6 1.6 0 0021 11a2 2 0 010 4z" /></>,
  user: <><circle cx="12" cy="8" r="4" strokeWidth={2} /><path strokeLinecap="round" strokeWidth={2} d="M4 20c1.5-3.5 4.5-5 8-5s6.5 1.5 8 5" /></>,
  info: <><circle cx="12" cy="12" r="9" strokeWidth={2} /><path strokeLinecap="round" strokeWidth={2} d="M12 11v6M12 7.5v.5" /></>,
  phone: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3h3l2 5-2 1a12 12 0 005 5l1-2 5 2v3a2 2 0 01-2 2A16 16 0 013 5a2 2 0 012-2z" />,
  tools: <><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.7 6.3a4 4 0 01-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 005.4-5.4l-2.5 2.5-2.5-2.5 2-2.5z" /></>,
  key: <><circle cx="8" cy="14" r="4" strokeWidth={2} /><path strokeLinecap="round" strokeWidth={2} d="M11 11l9-9M17 5l2 2M14 8l2 2" /></>,
  logout: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 4h4a2 2 0 012 2v12a2 2 0 01-2 2h-4M10 17l-5-5 5-5M5 12h11" />,
  download: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v12m0 0l-4-4m4 4l4-4M4 19h16" />,
  qr: <><rect x="3" y="3" width="7" height="7" rx="1" strokeWidth={2} /><rect x="14" y="3" width="7" height="7" rx="1" strokeWidth={2} /><rect x="3" y="14" width="7" height="7" rx="1" strokeWidth={2} /><path strokeWidth={2} d="M14 14h3v3h-3zM20 14v.01M14 20h.01M17 20h4v1" /></>,
  'arrow-left': <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 12H5m0 0l6-6m-6 6l6 6" />,
  'arrow-right': <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14m0 0l-6-6m6 6l-6 6" />,
  'chevron-left': <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 6l-6 6 6 6" />,
  'chevron-right': <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 6l6 6-6 6" />,
  check: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12.5l4.5 4.5L19 7" />,
  warning: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3l9 16H3L12 3zm0 5v5m0 3v.5" />,
  spinner: <path strokeLinecap="round" strokeWidth={2} d="M12 3a9 9 0 109 9" />,
  star: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3.5l2.6 5.3 5.9.9-4.2 4.1 1 5.8-5.3-2.8-5.3 2.8 1-5.8L3.5 9.7l5.9-.9z" />,
  truck: <><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h11v9H3zM14 10h4l3 3v3h-7" /><circle cx="7" cy="18" r="1.6" strokeWidth={2} /><circle cx="17" cy="18" r="1.6" strokeWidth={2} /></>,
  shield: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6l7-3z" />,
  wrench: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.7 6.3a4 4 0 01-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 005.4-5.4l-2.5 2.5-2.5-2.5 2-2.5z" />,
  zap: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" />,
  camera: <><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h3l1.5-2h7L17 8h3a1 1 0 011 1v9a1 1 0 01-1 1H4a1 1 0 01-1-1V9a1 1 0 011-1z" /><circle cx="12" cy="13" r="3.2" strokeWidth={2} /></>,
  image: <><rect x="3" y="4" width="18" height="16" rx="2" strokeWidth={2} /><circle cx="8.5" cy="9.5" r="1.5" strokeWidth={2} /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 18l5-5 4 4 3-3 4 4" /></>,
  mic: <><rect x="9" y="3" width="6" height="11" rx="3" strokeWidth={2} /><path strokeLinecap="round" strokeWidth={2} d="M5 11a7 7 0 0014 0M12 18v3M8 21h8" /></>,
  volume: <><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5L6 9H3v6h3l5 4z" /><path strokeLinecap="round" strokeWidth={2} d="M15.5 8.5a5 5 0 010 7M18.5 6a9 9 0 010 12" /></>,
  'volume-off': <><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5L6 9H3v6h3l5 4z" /><path strokeLinecap="round" strokeWidth={2} d="M16 9l5 6M21 9l-5 6" /></>,
  paperclip: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 11.5l-8.5 8.5a5 5 0 01-7-7l8-8a3.5 3.5 0 015 5l-8 8a2 2 0 01-3-3l7-7" />,
  x: <path strokeLinecap="round" strokeWidth={2} d="M6 6l12 12M18 6L6 18" />,
  send: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />,
  share: <><circle cx="18" cy="5" r="2.5" strokeWidth={2} /><circle cx="6" cy="12" r="2.5" strokeWidth={2} /><circle cx="18" cy="19" r="2.5" strokeWidth={2} /><path strokeWidth={2} d="M8.2 10.8l7.6-4.2M8.2 13.2l7.6 4.2" /></>,
  megaphone: <><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 11v2a1 1 0 001 1h2l4 3V7L6 10H4a1 1 0 00-1 1z" /><path strokeLinecap="round" strokeWidth={2} d="M14 8a4 4 0 010 8M17 6a7 7 0 010 12" /></>,
  facebook: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 8.5V7a1.5 1.5 0 011.5-1.5H17V3h-2.5A3.5 3.5 0 0011 6.5v2H9v3h2V21h3v-9.5h2.2l.5-3H14z" />,
  instagram: <><rect x="3.5" y="3.5" width="17" height="17" rx="4.5" strokeWidth={2} /><circle cx="12" cy="12" r="3.8" strokeWidth={2} /><circle cx="17" cy="7" r="1" fill="currentColor" /></>,
  tiktok: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 4c.4 2.2 1.9 3.6 4 3.8v2.7c-1.5.1-2.9-.3-4-1.1v5.9a5.3 5.3 0 11-5.3-5.3c.3 0 .6 0 .9.1v2.8a2.5 2.5 0 101.7 2.4V4H15z" />,
  youtube: <><rect x="2.5" y="6" width="19" height="12" rx="3.5" strokeWidth={2} /><path strokeWidth={2} fill="currentColor" d="M10.5 9.5l4.5 2.5-4.5 2.5z" /></>,
  linkedin: <><rect x="3.5" y="3.5" width="17" height="17" rx="2.5" strokeWidth={2} /><path strokeLinecap="round" strokeWidth={2} d="M8 10.5V17M8 7.6v.1M12 17v-3.6a2 2 0 014 0V17" /></>,
  twitter: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4l7 9.2M4 20l6.4-6.4M20 4l-7 7.6M20 20l-6.6-8.6M4 4h3l13 16h-3L4 4z" />,
  whatsapp: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3a9 9 0 00-7.7 13.6L3 21l4.5-1.3A9 9 0 1012 3zm-2.5 4.5c.2 0 .4 0 .5.4l.7 1.6c.1.2 0 .4-.1.6l-.5.6c-.1.2-.2.3 0 .6a7 7 0 003.1 2.7c.3.1.4 0 .6-.1l.6-.7c.2-.2.3-.2.6-.1l1.6.8c.3.2.4.3.3.5-.1.9-1.2 1.7-2.2 1.7-2.6 0-6.5-3.9-6.5-6.4 0-1 .8-2 1.7-2.2z" />,
}

export function Icon({ name, className = 'w-5 h-5' }: { name: IconName; className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      {PATHS[name]}
    </svg>
  )
}

const PAGES = [
  { path: '/', label: 'Accueil', icon: 'home' as IconName },
  { path: '/search', label: 'Produits', icon: 'search' as IconName },
  { path: '/categories', label: 'Catégories', icon: 'grid' as IconName },
  { path: '/blog', label: 'Blog', icon: 'blog' as IconName },
  { path: '/chat', label: 'Assistant', icon: 'chat' as IconName },
  { path: '/cart', label: 'Panier', icon: 'cart' as IconName },
  { path: '/wishlist', label: 'Favoris', icon: 'heart' as IconName },
  { path: '/checkout', label: 'Commander', icon: 'card' as IconName },
  { path: '/profile', label: 'Profil', icon: 'user' as IconName },
  { path: '/telecharger', label: "Télécharger l'app", icon: 'download' as IconName },
  { path: '/services', label: 'Services', icon: 'tools' as IconName },
  { path: '/formations', label: 'Formations', icon: 'star' as IconName },
  { path: '/revendeurs', label: 'Revendeurs', icon: 'truck' as IconName },
  { path: '/about', label: 'À propos', icon: 'info' as IconName },
  { path: '/contact', label: 'Contact', icon: 'phone' as IconName },
]

// Prev/next navigation arrows between main pages. `current` lets a page
// (e.g. a product or blog detail) specify its position in the flow.
export function NavigationArrows({
  current,
  showLabels = true,
  className = '',
}: {
  current?: string
  showLabels?: boolean
  className?: string
}) {
  const idx = PAGES.findIndex((p) => p.path === (current ?? ''))
  const activeIdx = idx === -1 ? 0 : idx
  const prev = PAGES[(activeIdx - 1 + PAGES.length) % PAGES.length]
  const next = PAGES[(activeIdx + 1) % PAGES.length]

  return (
    <div className={`flex items-center justify-between gap-3 ${className}`}>
      <Link
        href={prev.path}
        className="group flex items-center gap-2 px-3 sm:px-4 py-2.5 bg-ingco-gray rounded-xl border border-white/5 hover:border-ingco-yellow/40 hover:bg-ingco-yellow/10 transition-all"
        aria-label={`Page précédente : ${prev.label}`}
      >
        <Icon name="chevron-left" className="w-5 h-5 text-ingco-yellow group-hover:-translate-x-0.5 transition-transform" />
        <Icon name={prev.icon} className="w-4 h-4 text-gray-400 hidden sm:block" />
        {showLabels && <span className="hidden md:inline text-sm text-gray-300 group-hover:text-white">{prev.label}</span>}
      </Link>

      <Link
        href={next.path}
        className="group flex items-center gap-2 px-3 sm:px-4 py-2.5 bg-ingco-gray rounded-xl border border-white/5 hover:border-ingco-yellow/40 hover:bg-ingco-yellow/10 transition-all"
        aria-label={`Page suivante : ${next.label}`}
      >
        {showLabels && <span className="hidden md:inline text-sm text-gray-300 group-hover:text-white">{next.label}</span>}
        <Icon name={next.icon} className="w-4 h-4 text-gray-400 hidden sm:block" />
        <Icon name="chevron-right" className="w-5 h-5 text-ingco-yellow group-hover:translate-x-0.5 transition-transform" />
      </Link>
    </div>
  )
}

export function Breadcrumb({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav className="flex items-center flex-wrap gap-2 text-sm text-gray-400 mb-4" aria-label="Fil d'Ariane">
      <Link href="/" className="hover:text-ingco-yellow inline-flex items-center gap-1">
        <Icon name="home" className="w-4 h-4" /> Accueil
      </Link>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-2">
          <Icon name="chevron-right" className="w-3.5 h-3.5 text-gray-600" />
          {item.href ? (
            <Link href={item.href} className="hover:text-ingco-yellow">{item.label}</Link>
          ) : (
            <span className="text-white">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}
