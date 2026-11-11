'use client'

import Link from 'next/link'
import { useId } from 'react'

// Premium E-Outille logo: a metallic gear ring around a stylised "E" fused with
// an electric lightning bolt, paired with a gradient wordmark. Rendered inline
// (no network request) so it scales crisply at any size and stays on-brand.
//
// Palette: ingco-yellow #FFC400 (with #FFF0AE/#E39A00 highlights) and a steel
// grey ring on the ingco-black #121212 background. The wordmark steps down one
// size on small screens so the header never overflows on mobile.

interface LogoProps {
  variant?: 'horizontal' | 'icon' | 'stacked'
  size?: number
  className?: string
}

export default function Logo({ variant = 'horizontal', size = 40, className = '' }: LogoProps) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '')
  const yellow = `yellow-${uid}`
  const bolt = `bolt-${uid}`
  const steel = `steel-${uid}`
  const glow = `glow-${uid}`
  const bg = `bg-${uid}`
  const edge = `edge-${uid}`
  const sweep = `sweep-${uid}`
  const halo = `halo-${uid}`

  const iconSize = variant === 'icon' ? size : size * 0.62
  const wordSize = Math.max(14, size * 0.5)

  const Icon = (
    <svg
      width={iconSize}
      height={iconSize}
      viewBox="0 0 128 128"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={bg} cx="42%" cy="30%" r="88%">
          <stop offset="0%" stopColor="#262626" />
          <stop offset="55%" stopColor="#141414" />
          <stop offset="100%" stopColor="#080808" />
        </radialGradient>
        <linearGradient id={edge} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFE680" stopOpacity="0.85" />
          <stop offset="45%" stopColor="#FFC400" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#FFB300" stopOpacity="0.7" />
        </linearGradient>
        <linearGradient id={steel} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="42%" stopColor="#CFCFCF" />
          <stop offset="100%" stopColor="#6E6E6E" />
        </linearGradient>
        <linearGradient id={yellow} x1="8%" y1="0%" x2="92%" y2="100%">
          <stop offset="0%" stopColor="#FFF0AE" />
          <stop offset="42%" stopColor="#FFC400" />
          <stop offset="100%" stopColor="#E39A00" />
        </linearGradient>
        <linearGradient id={bolt} x1="18%" y1="0%" x2="82%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="38%" stopColor="#FFF6C2" />
          <stop offset="100%" stopColor="#FFC400" />
        </linearGradient>
        <linearGradient id={sweep} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.14" />
          <stop offset="52%" stopColor="#FFFFFF" stopOpacity="0.03" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
        <radialGradient id={halo} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFC400" stopOpacity="0.34" />
          <stop offset="100%" stopColor="#FFC400" stopOpacity="0" />
        </radialGradient>
        <filter id={glow} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="1.6" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <rect width="128" height="128" rx="28" fill={`url(#${bg})`} />
      <rect x="1.6" y="1.6" width="124.8" height="124.8" rx="26.4" fill="none" stroke={`url(#${edge})`} strokeWidth="2" />
      <path d="M6 40 Q64 -6 122 34 L122 6 Q122 4 120 4 L8 4 Q6 4 6 6 Z" fill={`url(#${sweep})`} />

      <g transform="translate(64 64)">
        <circle r="52" fill={`url(#${halo})`} />
        <g fill={`url(#${steel})`}>
          <rect x="-4.6" y="-49" width="9.2" height="12" rx="2.4" />
          <rect x="-4.6" y="37" width="9.2" height="12" rx="2.4" />
          <rect x="-49" y="-4.6" width="12" height="9.2" rx="2.4" />
          <rect x="37" y="-4.6" width="12" height="9.2" rx="2.4" />
          <rect x="-4.2" y="-45" width="8.4" height="11" rx="2.2" transform="rotate(30)" />
          <rect x="-4.2" y="34" width="8.4" height="11" rx="2.2" transform="rotate(30)" />
          <rect x="-4.2" y="-45" width="8.4" height="11" rx="2.2" transform="rotate(-30)" />
          <rect x="-4.2" y="34" width="8.4" height="11" rx="2.2" transform="rotate(-30)" />
          <rect x="-4.2" y="-44" width="8.4" height="10" rx="2.2" transform="rotate(60)" />
          <rect x="-4.2" y="34" width="8.4" height="10" rx="2.2" transform="rotate(60)" />
          <rect x="-4.2" y="-44" width="8.4" height="10" rx="2.2" transform="rotate(-60)" />
          <rect x="-4.2" y="34" width="8.4" height="10" rx="2.2" transform="rotate(-60)" />
        </g>
        <circle r="41" fill="none" stroke={`url(#${steel})`} strokeWidth="3.4" />
        <circle r="41" fill="none" stroke="#FFFFFF" strokeOpacity="0.22" strokeWidth="1" strokeDasharray="30 130" strokeLinecap="round" />
        <circle r="33" fill="none" stroke={`url(#${yellow})`} strokeWidth="2.6" />
        <path
          d="M-19 -18 H11 L16 -12 V-5 L10 1 H-6 V7 H13 L18 13 V20 H-19 V-18 Z"
          fill={`url(#${yellow})`}
          filter={`url(#${glow})`}
        />
        <path d="M-19 -18 H11 L16 -12 V-5 L10 1 H-6 V7 H13 L18 13 V20 H-19 V-18 Z" fill="none" stroke="#FFE9A8" strokeOpacity="0.55" strokeWidth="0.8" />
        <path d="M9 -26 L-4 -4 H3 L-6 20 L12 -6 H4 L12 -26 Z" fill={`url(#${bolt})`} />
        <path d="M9 -26 L-4 -4 H3 L-6 20" fill="none" stroke="#FFFFFF" strokeOpacity="0.75" strokeWidth="0.7" strokeLinecap="round" />
      </g>
    </svg>
  )

  const Wordmark = (
    <span className="flex flex-col leading-none min-w-0">
      <span className="font-display font-black tracking-tight" style={{ fontSize: wordSize }}>
        <span className="text-white">E-</span>
        <span
          className="bg-clip-text text-transparent"
          style={{ backgroundImage: 'linear-gradient(120deg,#FFF0AE 0%,#FFC400 50%,#E39A00 100%)' }}
        >
          Outille
        </span>
      </span>
      <span
        className="text-gray-400 font-semibold uppercase truncate"
        style={{ fontSize: Math.max(6, wordSize * 0.3), letterSpacing: '0.32em' }}
      >
        By Electron
      </span>
    </span>
  )

  return (
    <Link
      href="/"
      className={`flex items-center gap-2 group min-w-0 ${className}`}
      aria-label="E-Outille par ELECTRON — accueil"
    >
      <span className="transition-transform duration-300 group-hover:scale-105">{Icon}</span>
      {variant === 'horizontal' && Wordmark}
      {variant === 'stacked' && <span className="flex flex-col items-center gap-1">{Wordmark}</span>}
    </Link>
  )
}
