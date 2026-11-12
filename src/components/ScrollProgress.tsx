'use client'

import { useEffect, useRef } from 'react'

// Reading-progress bar pinned to the top of the viewport. The width is driven
// by a transform scaleX so the animation stays on the compositor thread.
export default function ScrollProgress() {
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const bar = ref.current
    if (!bar) return
    let frame = 0
    const update = () => {
      frame = 0
      const doc = document.documentElement
      const scrollable = doc.scrollHeight - doc.clientHeight
      const ratio = scrollable > 0 ? doc.scrollTop / scrollable : 0
      bar.style.transform = `scaleX(${Math.min(Math.max(ratio, 0), 1)})`
    }
    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  return <div ref={ref} className="scroll-progress" style={{ width: '100%', transform: 'scaleX(0)' }} aria-hidden="true" />
}
