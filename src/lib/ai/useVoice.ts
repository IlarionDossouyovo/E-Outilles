'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

// Premium voice layer: voice output (TTS) + voice input (speech recognition).
// Tries the server TTS (Google AI Gemini) first, then falls back to the browser
// Web Speech API so voice works even without a Google AI key.
//
// Both output and input follow the active locale (see LanguageProvider) so a
// visitor browsing in English hears and dictates in English. Input supports
// one-shot dictation and continuous "handsfree" mode; output supports a queue
// so consecutive replies are read in order.

type SpeechRecognitionLike = {
  lang: string
  continuous: boolean
  interimResults: boolean
  start: () => void
  stop: () => void
  onresult:
    | ((event: {
        resultIndex: number
        results: ArrayLike<{ isFinal: boolean; 0: { transcript: string } } & ArrayLike<{ transcript: string }>>
      }) => void)
    | null
  onerror: ((event?: { error?: string }) => void) | null
  onend: (() => void) | null
}

interface VoiceOptions {
  voice?: string
  lang?: string
  rate?: number
  pitch?: number
}

function getRecognitionCtor() {
  if (typeof window === 'undefined') return undefined
  const w = window as unknown as {
    SpeechRecognition?: new () => SpeechRecognitionLike
    webkitSpeechRecognition?: new () => SpeechRecognitionLike
  }
  return w.SpeechRecognition || w.webkitSpeechRecognition
}

// Strips markdown so the synthesiser does not read "asterisk" and "hash".
export function cleanForSpeech(text: string): string {
  return text
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[*_#>~]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

// Reads the active locale from <html lang> (set by LanguageProvider) so the
// voice layer stays decoupled from the i18n module and works everywhere.
function activeLangTag(fallback = 'fr-FR'): string {
  if (typeof document === 'undefined') return fallback
  return document.documentElement.lang || fallback
}

export function useVoice() {
  const [speaking, setSpeaking] = useState(false)
  const [listening, setListening] = useState(false)
  const [handsFree, setHandsFree] = useState(false)
  const [supported, setSupported] = useState({ speak: false, listen: false })
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null)
  // Keep the latest callback so continuous mode always uses fresh state.
  const onResultRef = useRef<((transcript: string) => void) | null>(null)
  // Queue of texts waiting to be spoken (so back-to-back replies are ordered).
  const queueRef = useRef<string[]>([])
  const queueActiveRef = useRef(false)

  useEffect(() => {
    const hasSpeechSynthesis = typeof window !== 'undefined' && 'speechSynthesis' in window
    setSupported({ speak: hasSpeechSynthesis, listen: Boolean(getRecognitionCtor()) })
  }, [])

  const stop = useCallback(() => {
    queueRef.current = []
    queueActiveRef.current = false
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }
    setSpeaking(false)
  }, [])

  const speakWithWebSpeech = useCallback(
    (text: string, options?: VoiceOptions): Promise<void> =>
      new Promise((resolve) => {
        if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
          resolve()
          return
        }
        const utterance = new SpeechSynthesisUtterance(text)
        const lang = options?.lang || activeLangTag()
        utterance.lang = lang
        utterance.rate = options?.rate ?? 1
        utterance.pitch = options?.pitch ?? 1
        // Prefer a voice matching the active language for a natural result.
        const base = lang.split('-')[0].toLowerCase()
        const voices = window.speechSynthesis.getVoices()
        const match = voices.find((v) => v.lang.toLowerCase().startsWith(base))
        if (match) utterance.voice = match
        utterance.onend = () => resolve()
        utterance.onerror = () => resolve()
        window.speechSynthesis.speak(utterance)
      }),
    []
  )

  const speakOne = useCallback(
    async (text: string, options?: VoiceOptions) => {
      const clean = cleanForSpeech(text)
      if (!clean) return

      try {
        const res = await fetch('/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: clean, voice: options?.voice, lang: options?.lang || activeLangTag() }),
        })

        const contentType = res.headers.get('content-type') || ''
        if (res.ok && contentType.startsWith('audio')) {
          const blob = await res.blob()
          const url = URL.createObjectURL(blob)
          const audio = new Audio(url)
          audioRef.current = audio
          await new Promise<void>((resolve) => {
            audio.onended = () => {
              URL.revokeObjectURL(url)
              resolve()
            }
            audio.onerror = () => {
              URL.revokeObjectURL(url)
              resolve()
            }
            audio.play().catch(() => resolve())
          })
          return
        }
      } catch {
        // fall through to Web Speech
      }

      await speakWithWebSpeech(clean, options)
    },
    [speakWithWebSpeech]
  )

  // Drains the queue one item at a time so replies are never spoken over each other.
  const drainQueue = useCallback(async () => {
    if (queueActiveRef.current) return
    queueActiveRef.current = true
    setSpeaking(true)
    while (queueRef.current.length > 0) {
      const next = queueRef.current.shift() as string
      await speakOne(next)
    }
    queueActiveRef.current = false
    setSpeaking(false)
  }, [speakOne])

  const speak = useCallback(
    (text: string, options?: VoiceOptions) => {
      const clean = cleanForSpeech(text)
      if (!clean) return
      queueRef.current.push(clean)
      void drainQueue()
    },
    [drainQueue]
  )

  // One-shot dictation: stops after the first final result.
  const listen = useCallback((onResult: (transcript: string) => void) => {
    const Ctor = getRecognitionCtor()
    if (!Ctor) return

    const recognition = new Ctor()
    recognition.lang = activeLangTag()
    recognition.continuous = false
    recognition.interimResults = false
    recognition.onresult = (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript || ''
      if (transcript) onResult(transcript)
    }
    recognition.onerror = () => setListening(false)
    recognition.onend = () => setListening(false)
    recognitionRef.current = recognition
    setListening(true)
    recognition.start()
  }, [])

  // Continuous handsfree dictation: fires onResult for each final phrase and
  // keeps listening until stopped. Great for long spoken requests.
  const startHandsFree = useCallback((onResult: (transcript: string) => void) => {
    const Ctor = getRecognitionCtor()
    if (!Ctor) return

    onResultRef.current = onResult
    const recognition = new Ctor()
    recognition.lang = activeLangTag()
    recognition.continuous = true
    recognition.interimResults = false
    recognition.onresult = (event) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]
        if (result.isFinal) {
          const transcript = result[0]?.transcript?.trim()
          if (transcript) onResultRef.current?.(transcript)
        }
      }
    }
    recognition.onerror = () => setListening(false)
    recognition.onend = () => setListening(false)
    recognitionRef.current = recognition
    setListening(true)
    setHandsFree(true)
    recognition.start()
  }, [])

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop()
    recognitionRef.current = null
    setListening(false)
    setHandsFree(false)
  }, [])

  useEffect(() => stop, [stop])

  return {
    speak,
    stop,
    speaking,
    listen,
    startHandsFree,
    stopListening,
    listening,
    handsFree,
    supported,
  }
}
