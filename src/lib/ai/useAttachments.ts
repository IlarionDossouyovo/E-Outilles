'use client'

import { useCallback, useState } from 'react'

// Client-side attachment helper for photo / document analysis.
// Reads files as base64 (no data: prefix) for the /api/chat media payload.

export interface Attachment {
  id: string
  name: string
  mimeType: string
  data: string
  previewUrl: string
  isImage: boolean
}

const ALLOWED = /^(image\/(png|jpe?g|webp|gif|heic|heif)|application\/pdf)$/i
const MAX_BYTES = 6 * 1024 * 1024 // 6 MB, matches the API limit
const MAX_FILES = 3

function readAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = String(reader.result || '')
      // Strip the "data:<mime>;base64," prefix.
      resolve(result.includes(',') ? result.slice(result.indexOf(',') + 1) : result)
    }
    reader.onerror = () => reject(new Error('Lecture du fichier impossible'))
    reader.readAsDataURL(file)
  })
}

export function useAttachments() {
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [error, setError] = useState('')

  const addFiles = useCallback(async (files: FileList | File[]) => {
    setError('')
    const list = Array.from(files)
    const accepted: Attachment[] = []

    for (const file of list) {
      if (attachments.length + accepted.length >= MAX_FILES) {
        setError(`Maximum ${MAX_FILES} pièces jointes.`)
        break
      }
      if (!ALLOWED.test(file.type)) {
        setError('Format non pris en charge (image PNG/JPG/WEBP ou PDF).')
        continue
      }
      if (file.size > MAX_BYTES) {
        setError('Fichier trop volumineux (max 6 Mo).')
        continue
      }
      const data = await readAsBase64(file)
      accepted.push({
        id: `${file.name}-${file.size}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        name: file.name,
        mimeType: file.type,
        data,
        previewUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : '',
        isImage: file.type.startsWith('image/'),
      })
    }

    if (accepted.length) setAttachments((prev) => [...prev, ...accepted])
  }, [attachments.length])

  const remove = useCallback((id: string) => {
    setAttachments((prev) => {
      const target = prev.find((a) => a.id === id)
      if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl)
      return prev.filter((a) => a.id !== id)
    })
  }, [])

  const clear = useCallback(() => {
    setAttachments((prev) => {
      prev.forEach((a) => a.previewUrl && URL.revokeObjectURL(a.previewUrl))
      return []
    })
    setError('')
  }, [])

  return { attachments, addFiles, remove, clear, error, setError }
}
