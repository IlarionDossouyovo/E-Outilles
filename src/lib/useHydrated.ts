'use client'

import { useEffect, useState } from 'react'

// Persisted stores (localStorage) only have data on the client. Rendering them
// during SSR produces an empty server output and a hydration mismatch, so
// consumers must gate that markup until after mount.
export function useHydrated(): boolean {
  const [hydrated, setHydrated] = useState(false)
  useEffect(() => setHydrated(true), [])
  return hydrated
}
