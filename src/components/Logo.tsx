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
        <linearGradient id={steel} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#E8E8E8" />
          <stop offset="50%" stopColor="#B8B8B8" />
          <stop offset="100%" stopColor="#888888" />
        </linearGradient>
        <linearGradient id={yellow} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFD700" />
          <stop offset="50%" stopColor="#FFC400" />
          <stop offset="100%" stopColor="#FFB300" />
        </linearGradient>
        <linearGradient id={bolt} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFDD00" />
          <stop offset="100%" stopColor="#FFAA00" />
        </linearGradient>
        <filter id={glow} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.4" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g transform="translate(34, 24)">
        <circle cx="30" cy="30" r="28" fill="none" stroke={`url(#${steel})`} strokeWidth="3" />
        <g fill={`url(#${steel})`}>
          <rect x="26" y="0" width="8" height="8" rx="1" />
          <rect x="26" y="52" width="8" height="8" rx="1" />
          <rect x="0" y="26" width="8" height="8" rx="1" />
          <rect x="52" y="26" width="8" height="8" rx="1" />
          <rect x="8" y="8" width="7" height="7" rx="1" transform="rotate(45 11.5 11.5)" />
          <rect x="45" y="8" width="7" height="7" rx="1" transform="rotate(45 48.5 11.5)" />
          <rect x="8" y="45" width="7" height="7" rx="1" transform="rotate(45 11.5 48.5)" />
          <rect x="45" y="45" width="7" height="7" rx="1" transform="rotate(45 48.5 48.5)" />
        </g>
        <circle cx="30" cy="30" r="18" fill="none" stroke={`url(#${yellow})`} strokeWidth="2" />
        <path
          d="M22 20 L40 20 L40 24 L27 24 L27 28 L38 28 L38 32 L27 32 L27 40 L42 40 L42 44 L22 44 Z"
          fill={`url(#${yellow})`}
          filter={`url(#${glow})`}
        />
        <path d="M36 18 L30 30 L34 30 L28 46 L40 28 L35 28 L38 18 Z" fill={`url(#${bolt})`} opacity="0.9" />
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
