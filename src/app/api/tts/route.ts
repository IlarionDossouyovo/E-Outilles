import { NextRequest, NextResponse } from 'next/server'
import { isGoogleAIConfigured, GOOGLE_AI_MODEL } from '@/lib/ai/provider'

// Server-side speech synthesis. Uses Google AI (Gemini TTS) when configured,
// otherwise reports that the client should fall back to the Web Speech API.

const TTS_MODEL = process.env.GOOGLE_AI_TTS_MODEL || 'gemini-3.8-flash-tts'
const DEFAULT_VOICE = process.env.GOOGLE_AI_TTS_VOICE || 'Kore'
const TTS_MODEL_CANDIDATES = Array.from(
  new Set([TTS_MODEL, 'gemini-2.5-flash-preview-tts', 'gemini-3.8-flash-tts'])
)

interface TtsPayload {
  text?: string
  voice?: string
}

export async function POST(request: NextRequest) {
  try {
    const { text, voice }: TtsPayload = await request.json()
    const clean = (text || '').toString().trim()

    if (!clean) {
      return NextResponse.json({ error: 'Texte requis' }, { status: 400 })
    }
    if (clean.length > 4000) {
      return NextResponse.json({ error: 'Texte trop long (max 4000 caractères)' }, { status: 400 })
    }

    if (!isGoogleAIConfigured()) {
      return NextResponse.json(
        { fallback: 'webspeech', reason: 'Google AI non configuré' },
        { status: 200 }
      )
    }

    const key = (process.env.GOOGLE_AI_API_KEY || process.env.GEMINI_API_KEY) as string
    const payload = JSON.stringify({
      contents: [{ parts: [{ text: clean }] }],
      generationConfig: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: voice || DEFAULT_VOICE } },
        },
      },
    })

    let lastError = ''
    for (const model of TTS_MODEL_CANDIDATES) {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
          body: payload,
          signal: AbortSignal.timeout(25000),
        }
      )

      if (!res.ok) {
        lastError = `${model}: ${res.status}`
        continue
      }

      const data = await res.json()
      const part = data?.candidates?.[0]?.content?.parts?.find(
        (p: { inlineData?: { data?: string; mimeType?: string } }) => p?.inlineData?.data
      )
      const base64Audio = part?.inlineData?.data
      const mimeType = part?.inlineData?.mimeType || 'audio/L16;rate=24000'

      if (!base64Audio) {
        lastError = `${model}: aucun audio`
        continue
      }

      const audio = Buffer.from(base64Audio, 'base64')
      return new NextResponse(audio, {
        status: 200,
        headers: {
          'Content-Type': mimeType,
          'Cache-Control': 'no-store',
          'X-TTS-Provider': 'google',
          'X-TTS-Model': model,
        },
      })
    }

    console.error('Google TTS failed:', lastError)
    return NextResponse.json({ fallback: 'webspeech', reason: 'Erreur du service TTS' }, { status: 200 })
  } catch (error) {
    console.error('TTS error:', error)
    return NextResponse.json({ fallback: 'webspeech', reason: 'Erreur serveur TTS' }, { status: 200 })
  }
}

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
