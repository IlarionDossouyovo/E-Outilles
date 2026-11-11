import { NextRequest, NextResponse } from 'next/server'
import { isGoogleAIConfigured, GOOGLE_AI_MODEL } from '@/lib/ai/provider'

// Server-side speech synthesis. Uses Google AI (Gemini TTS) when configured,
// otherwise reports that the client should fall back to the Web Speech API.

const TTS_MODEL = process.env.GOOGLE_AI_TTS_MODEL || 'gemini-3.8-flash-tts'
const DEFAULT_VOICE = process.env.GOOGLE_AI_TTS_VOICE || 'Kore'
// Ordered by quality/availability. The lite model keeps its own quota bucket,
// so a spent free-tier allowance on one model does not disable voice entirely.
const TTS_MODEL_CANDIDATES = Array.from(
  new Set([
    TTS_MODEL,
    'gemini-3.8-flash-tts',
    'gemini-3.8-flash-lite-tts',
    'gemini-2.5-flash-preview-tts',
  ])
)

// Maps a BCP-47 language tag to the language name Gemini should speak in, so a
// visitor browsing in English hears an English voice instead of a French one.
const LANGUAGE_NAMES: Record<string, string> = {
  fr: 'français',
  en: 'anglais',
  es: 'espagnol',
  pt: 'portugais',
}

// Wraps raw 16-bit little-endian PCM (what the preview TTS model returns) in a
// RIFF/WAV header so the browser <audio> element can play it. Without this the
// premium voice is silently dropped and the client falls back to Web Speech.
function pcm16ToWav(pcm: Buffer, sampleRate = 24000, channels = 1): Buffer {
  const bitsPerSample = 16
  const byteRate = (sampleRate * channels * bitsPerSample) / 8
  const blockAlign = (channels * bitsPerSample) / 8
  const header = Buffer.alloc(44)
  header.write('RIFF', 0)
  header.writeUInt32LE(36 + pcm.length, 4)
  header.write('WAVE', 8)
  header.write('fmt ', 12)
  header.writeUInt32LE(16, 16)
  header.writeUInt16LE(1, 20) // PCM
  header.writeUInt16LE(channels, 22)
  header.writeUInt32LE(sampleRate, 24)
  header.writeUInt32LE(byteRate, 28)
  header.writeUInt16LE(blockAlign, 32)
  header.writeUInt16LE(bitsPerSample, 34)
  header.write('data', 36)
  header.writeUInt32LE(pcm.length, 40)
  return Buffer.concat([header, pcm])
}

// The model reports its rate as "audio/L16;rate=24000".
function sampleRateFromMime(mimeType: string): number {
  const match = mimeType.match(/rate=(\d+)/)
  return match ? Number(match[1]) : 24000
}

// Distinct quota buckets per voice, so a spent allowance on one voice does not
// disable voice output entirely.
const VOICE_CANDIDATES = Array.from(new Set([DEFAULT_VOICE, 'Kore', 'Aoede', 'Puck']))

function languageName(lang?: string): string | null {
  if (!lang) return null
  const base = lang.toLowerCase().split('-')[0]
  return LANGUAGE_NAMES[base] ?? null
}

// The preview TTS models reject a bare transcript with 400 INVALID_ARGUMENT
// ("model tried to generate text") unless the prompt explicitly asks for audio.
// We also pin the spoken language when it is not French (the default market).
function ttsPrompt(text: string, model: string, lang?: string): string {
  const name = languageName(lang)
  const instruction =
    model.includes('preview-tts')
      ? `Lis ce texte à voix haute${name && name !== 'français' ? ` en ${name}` : ''} :\n`
      : name && name !== 'français'
        ? `Prononce la réponse suivante en ${name}, avec un ton naturel et professionnel :\n`
        : ''
  return `${instruction}${text}`
}

interface TtsPayload {
  text?: string
  voice?: string
  lang?: string
}

export async function POST(request: NextRequest) {
  try {
    const { text, voice, lang }: TtsPayload = await request.json()
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

    const requestedVoice = voice || DEFAULT_VOICE
    const voices = Array.from(new Set([requestedVoice, ...VOICE_CANDIDATES]))

    let lastError = ''
    for (const model of TTS_MODEL_CANDIDATES) {
      for (const voiceName of voices) {
        const payload = JSON.stringify({
          contents: [{ parts: [{ text: ttsPrompt(clean, model, lang) }] }],
          generationConfig: {
            responseModalities: ['AUDIO'],
            speechConfig: {
              voiceConfig: { prebuiltVoiceConfig: { voiceName } },
            },
          },
        })

        let res: Response
        try {
          res = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
              body: payload,
              signal: AbortSignal.timeout(25000),
            }
          )
        } catch (err) {
          lastError = `${model}/${voiceName}: ${(err as Error).message}`
          continue
        }

        if (!res.ok) {
          lastError = `${model}/${voiceName}: ${res.status}`
          // 429 (quota) and 404 (retired model) are model-level failures: move on
          // to the next model instead of retrying every voice on it.
          if (res.status === 429 || res.status === 404) break
          continue
        }

        const data = await res.json()
        const part = data?.candidates?.[0]?.content?.parts?.find(
          (p: { inlineData?: { data?: string; mimeType?: string } }) => p?.inlineData?.data
        )
        const base64Audio = part?.inlineData?.data
        const mimeType: string = part?.inlineData?.mimeType || 'audio/wav'

        if (!base64Audio) {
          lastError = `${model}/${voiceName}: aucun audio`
          continue
        }

        const raw = Buffer.from(base64Audio, 'base64')
        // The preview model returns headerless L16 PCM; wrap it so the browser
        // can play the premium voice instead of falling back to Web Speech.
        const isPcm = mimeType.includes('L16') || mimeType.includes('pcm')
        const audio = isPcm ? pcm16ToWav(raw, sampleRateFromMime(mimeType)) : raw
        const contentType = isPcm ? 'audio/wav' : mimeType

        return new NextResponse(new Uint8Array(audio), {
          status: 200,
          headers: {
            'Content-Type': contentType,
            'Cache-Control': 'no-store',
            'X-TTS-Provider': 'google',
            'X-TTS-Model': model,
            'X-TTS-Voice': voiceName,
          },
        })
      }
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
