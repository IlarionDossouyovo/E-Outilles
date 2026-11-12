'use client'

import { useCallback } from 'react'

// Returns an onMouseMove handler that writes the cursor position into the
// element's `--mx`/`--my` custom properties, which drive the radial
// `.spotlight` highlight (see globals.css). Spread the result onto any
// positioned element that carries the `spotlight` class.
export function useSpotlight() {
  return useCallback((event: React.MouseEvent<HTMLElement>) => {
    const node = event.currentTarget
    const rect = node.getBoundingClientRect()
    node.style.setProperty('--mx', `${event.clientX - rect.left}px`)
    node.style.setProperty('--my', `${event.clientY - rect.top}px`)
  }, [])
}
