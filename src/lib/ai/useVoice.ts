'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

// Premium voice layer: voice output (TTS) + voice input (speech recognition).
// Tries the server TTS (Google AI) first, then falls back to the browser
// Web Speech API so voice works even without a Google AI key.
//
// Input supports both one-shot dictation and continuous "handsfree" mode.

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

export function useVoice() {
  const [speaking, setSpeaking] = useState(false)
  const [listening, setListening] = useState(false)
  const [handsFree, setHandsFree] = useState(false)
  const [supported, setSupported] = useState({ speak: false, listen: false })
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null)
  // Keep the latest callback so continuous mode always uses fresh state.
  const onResultRef = useRef<((transcript: string) => void) | null>(null)

  useEffect(() => {
    const hasSpeechSynthesis = typeof window !== 'undefined' && 'speechSynthesis' in window
    setSupported({ speak: hasSpeechSynthesis, listen: Boolean(getRecognitionCtor()) })
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

  const speakWithWebSpeech = useCallback((text: string, options?: VoiceOptions) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = options?.lang || 'fr-FR'
    utterance.rate = options?.rate ?? 1
    utterance.pitch = options?.pitch ?? 1
    // Prefer a French voice when available for a more natural result.
    const voices = window.speechSynthesis.getVoices()
    const fr = voices.find((v) => /^fr/i.test(v.lang))
    if (fr) utterance.voice = fr
    utterance.onend = () => setSpeaking(false)
    utterance.onerror = () => setSpeaking(false)
    window.speechSynthesis.speak(utterance)
  }, [])

  const speak = useCallback(
    async (text: string, options?: VoiceOptions) => {
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
            speakWithWebSpeech(clean, options)
          }
          await audio.play()
          return
        }
      } catch {
        // fall through to Web Speech
      }

      speakWithWebSpeech(clean, options)
    },
    [stop, speakWithWebSpeech]
  )

  // One-shot dictation: stops after the first final result.
  const listen = useCallback((onResult: (transcript: string) => void) => {
    const Ctor = getRecognitionCtor()
    if (!Ctor) return

    const recognition = new Ctor()
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
  }, [])

  // Continuous handsfree dictation: fires onResult for each final phrase and
  // keeps listening until stopped. Great for long spoken requests.
  const startHandsFree = useCallback((onResult: (transcript: string) => void) => {
    const Ctor = getRecognitionCtor()
    if (!Ctor) return

    onResultRef.current = onResult
    const recognition = new Ctor()
    recognition.lang = 'fr-FR'
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
