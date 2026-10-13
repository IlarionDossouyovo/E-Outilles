'use client'

import { useEffect, useState } from 'react'
import { Icon, type IconName } from '@/components/Icons'

// Public social links, driven by the marketing channels configured in
// /admin/marketing. Renders nothing until at least one is set, so an
// unconfigured store does not show dead icons.

const SOCIAL_ICON: Record<string, IconName> = {
  facebook: 'facebook',
  instagram: 'instagram',
  tiktok: 'tiktok',
  youtube: 'youtube',
  linkedin: 'linkedin',
  twitter: 'twitter',
  whatsappChannel: 'whatsapp',
  whatsapp: 'whatsapp',
}

interface Channel {
  id: string
  name: string
  kind: string
  value: string
}

export default function SocialLinks({ className = '' }: { className?: string }) {
  const [channels, setChannels] = useState<Channel[]>([])

  useEffect(() => {
    fetch('/api/marketing/channels')
      .then((r) => r.json())
      .then((d) => setChannels(Array.isArray(d.channels) ? d.channels : []))
      .catch(() => {})
  }, [])

  const socials = channels.filter((c) => SOCIAL_ICON[c.id] && c.value.startsWith('http'))
  if (socials.length === 0) return null

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {socials.map((c) => (
        <a
          key={c.id}
          href={c.value}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={c.name}
          title={c.name}
          className="w-9 h-9 rounded-lg bg-ingco-gray flex items-center justify-center text-gray-400 hover:text-ingco-yellow hover:bg-ingco-yellow/10 transition-colors"
        >
          <Icon name={SOCIAL_ICON[c.id]} className="w-4 h-4" />
        </a>
      ))}
    </div>
  )
}
