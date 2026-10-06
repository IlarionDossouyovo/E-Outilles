'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

// Voice output (TTS) + voice input (speech recognition) hook.
// Tries the server TTS (Google AI) first, then falls back to the browser
// Web Speech API so voice works even without a Google AI key.

type SpeechRecognitionLike = {
  lang: string
  continuous: boolean
  interimResults: boolean
  start: () => void
  stop: () => void
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null
  onerror: (() => void) | null
  onend: (() => void) | null
}

export function useVoice() {
  const [speaking, setSpeaking] = useState(false)
  const [listening, setListening] = useState(false)
  const [supported, setSupported] = useState({ speak: false, listen: false })
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null)

  useEffect(() => {
    const hasSpeechSynthesis = typeof window !== 'undefined' && 'speechSynthesis' in window
    const SpeechRecognitionCtor =
      typeof window !== 'undefined'
        ? (window as unknown as { SpeechRecognition?: new () => SpeechRecognitionLike; webkitSpeechRecognition?: new () => SpeechRecognitionLike }).SpeechRecognition ||
          (window as unknown as { webkitSpeechRecognition?: new () => SpeechRecognitionLike }).webkitSpeechRecognition
        : undefined
    setSupported({ speak: hasSpeechSynthesis, listen: Boolean(SpeechRecognitionCtor) })
  }, [])

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }
    setSpeaking(false)
  }, [])

  const speakWithWebSpeech = useCallback((text: string, lang = 'fr-FR') => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = lang
    utterance.rate = 1
    utterance.pitch = 1
    utterance.onend = () => setSpeaking(false)
    utterance.onerror = () => setSpeaking(false)
    window.speechSynthesis.speak(utterance)
  }, [])

  const speak = useCallback(
    async (text: string, options?: { voice?: string; lang?: string }) => {
      const clean = text.replace(/[*_#`>]/g, '').trim()
      if (!clean) return
      stop()
      setSpeaking(true)

      try {
        const res = await fetch('/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: clean, voice: options?.voice }),
        })

        const contentType = res.headers.get('content-type') || ''
        if (res.ok && contentType.startsWith('audio')) {
          const blob = await res.blob()
          const url = URL.createObjectURL(blob)
          const audio = new Audio(url)
          audioRef.current = audio
          audio.onended = () => {
            URL.revokeObjectURL(url)
            setSpeaking(false)
          }
          audio.onerror = () => {
            URL.revokeObjectURL(url)
            speakWithWebSpeech(clean, options?.lang)
          }
          await audio.play()
          return
        }
      } catch {
        // fall through to Web Speech
      }

      speakWithWebSpeech(clean, options?.lang)
    },
    [stop, speakWithWebSpeech]
  )

  const listen = useCallback(
    (onResult: (transcript: string) => void) => {
      const SpeechRecognitionCtor =
        typeof window !== 'undefined'
          ? (window as unknown as { SpeechRecognition?: new () => SpeechRecognitionLike; webkitSpeechRecognition?: new () => SpeechRecognitionLike }).SpeechRecognition ||
            (window as unknown as { webkitSpeechRecognition?: new () => SpeechRecognitionLike }).webkitSpeechRecognition
          : undefined
      if (!SpeechRecognitionCtor) return

      const recognition = new SpeechRecognitionCtor()
      recognition.lang = 'fr-FR'
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
    },
    []
  )

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop()
    setListening(false)
  }, [])

  useEffect(() => stop, [stop])

  return { speak, stop, speaking, listen, stopListening, listening, supported }
}
