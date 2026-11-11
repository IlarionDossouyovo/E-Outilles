'use client'

import Link from 'next/link'
import { useId } from 'react'

// Premium E-Outille logo: a metallic gear ring around a stylised "E" fused with
// an electric lightning bolt, paired with a gradient wordmark. Rendered inline
// (no network request) so it scales crisply at any size and stays on-brand.
//
// Palette: ingco-yellow #FFC400 (with #FFD700/#FFB300 highlights) on the
// ingco-black #121212 background.

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
        <radialGradient id={`bg-${uid}`} cx="50%" cy="38%" r="78%">
          <stop offset="0%" stopColor="#1E1E1E" />
          <stop offset="100%" stopColor="#0B0B0B" />
        </radialGradient>
        <linearGradient id={steel} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#F2F2F2" />
          <stop offset="45%" stopColor="#C2C2C2" />
          <stop offset="100%" stopColor="#7C7C7C" />
        </linearGradient>
        <linearGradient id={yellow} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFDE59" />
          <stop offset="45%" stopColor="#FFC400" />
          <stop offset="100%" stopColor="#E8A200" />
        </linearGradient>
        <linearGradient id={bolt} x1="20%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%" stopColor="#FFF3B0" />
          <stop offset="55%" stopColor="#FFD400" />
          <stop offset="100%" stopColor="#FFAE00" />
        </linearGradient>
        <filter id={glow} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.2" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <rect width="128" height="128" rx="26" fill={`url(#bg-${uid})`} />
      <g transform="translate(64 64)">
        <g fill={`url(#${steel})`}>
          <rect x="-4.5" y="-49" width="9" height="11" rx="2" />
          <rect x="-4.5" y="38" width="9" height="11" rx="2" />
          <rect x="-49" y="-4.5" width="11" height="9" rx="2" />
          <rect x="38" y="-4.5" width="11" height="9" rx="2" />
          <rect x="-4" y="-45" width="8" height="10" rx="2" transform="rotate(30)" />
          <rect x="-4" y="35" width="8" height="10" rx="2" transform="rotate(30)" />
          <rect x="-4" y="-45" width="8" height="10" rx="2" transform="rotate(-30)" />
          <rect x="-4" y="35" width="8" height="10" rx="2" transform="rotate(-30)" />
          <rect x="-4" y="-44" width="8" height="9" rx="2" transform="rotate(60)" />
          <rect x="-4" y="35" width="8" height="9" rx="2" transform="rotate(60)" />
          <rect x="-4" y="-44" width="8" height="9" rx="2" transform="rotate(-60)" />
          <rect x="-4" y="35" width="8" height="9" rx="2" transform="rotate(-60)" />
        </g>
        <circle r="41" fill="none" stroke={`url(#${steel})`} strokeWidth="3.4" />
        <circle r="33" fill="none" stroke={`url(#${yellow})`} strokeWidth="2.4" />
        <path
          d="M-19 -18 H11 L16 -12 V-5 L10 1 H-6 V7 H13 L18 13 V20 H-19 V-18 Z"
          fill={`url(#${yellow})`}
          filter={`url(#${glow})`}
        />
        <path d="M9 -26 L-4 -4 H3 L-6 20 L12 -6 H4 L12 -26 Z" fill={`url(#${bolt})`} />
      </g>
    </svg>
  )

  const Wordmark = (
    <span className="flex flex-col leading-none">
      <span className="font-display font-black tracking-tight" style={{ fontSize: wordSize }}>
        <span className="text-white">E-</span>
        <span
          className="bg-clip-text text-transparent"
          style={{ backgroundImage: 'linear-gradient(120deg,#FFD700 0%,#FFC400 50%,#FFB300 100%)' }}
        >
          Outille
        </span>
      </span>
      <span
        className="text-gray-400 font-semibold uppercase"
        style={{ fontSize: Math.max(6, wordSize * 0.3), letterSpacing: '0.32em' }}
      >
        By Electron
      </span>
    </span>
  )

  return (
    <Link
      href="/"
      className={`flex items-center gap-2 group ${className}`}
      aria-label="E-Outille par ELECTRON — accueil"
    >
      <span className="transition-transform duration-300 group-hover:scale-105">{Icon}</span>
      {variant === 'horizontal' && Wordmark}
      {variant === 'stacked' && <span className="flex flex-col items-center gap-1">{Wordmark}</span>}
    </Link>
  )
}
