'use client'

import { useEffect, useRef, useState } from 'react'

type CountUpProps = {
  to: number
  from?: number
  duration?: number
  suffix?: string
  prefix?: string
  className?: string
}

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

// Counts from `from` to `to` once the element scrolls into view. Uses
// requestAnimationFrame with an ease-out curve. The final value is rendered on
// the server (and whenever JS/motion is unavailable) so the markup never shows
// a stale "0"; the animation only kicks in on the client.
export default function CountUp({
  to,
  from = 0,
  duration = 1600,
  suffix = '',
  prefix = '',
  className = '',
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement | null>(null)
  const [value, setValue] = useState(to)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    if (typeof IntersectionObserver === 'undefined' || prefersReducedMotion()) {
      setValue(to)
      return
    }
    setValue(from)
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setStarted(true)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.4 }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [to, from])

  useEffect(() => {
    if (!started) return
    let frame = 0
    const start = performance.now()
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(from + (to - from) * eased)
      if (progress < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [started, from, to, duration])

  const rounded = Math.round(value)
  return (
    <span ref={ref} className={className}>
      {prefix}
      {rounded.toLocaleString('fr-FR')}
      {suffix}
    </span>
  )
}
