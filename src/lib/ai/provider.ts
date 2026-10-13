// Central AI provider layer for E-Outilles.
// Google AI (Gemini) is preferred when GOOGLE_AI_API_KEY is set, then Ollama
// (local), and finally a deterministic demo responder so the app never breaks.

export type ChatRole = 'system' | 'user' | 'assistant'

export interface ChatTurn {
  role: ChatRole
  content: string
}

// An image or document attached to a user turn (base64, no data: prefix).
export interface InlineMedia {
  mimeType: string
  data: string
}

export interface GenerateOptions {
  messages: ChatTurn[]
  // Media attached to the LAST user turn (vision / document analysis).
  media?: InlineMedia[]
  temperature?: number
  maxOutputTokens?: number
  json?: boolean
  timeoutMs?: number
}

export interface GenerateResult {
  text: string
  provider: 'google' | 'ollama' | 'demo'
  model: string
}

const PLACEHOLDER_MARKERS = ['placeholder', 'votre', 'your_', 'xxx', 'changez', 'exemple']

function isPlaceholder(value: string | undefined): boolean {
  if (!value) return true
  const lower = value.toLowerCase()
  return PLACEHOLDER_MARKERS.some((marker) => lower.includes(marker))
}

export function isGoogleAIConfigured(): boolean {
  const key = process.env.GOOGLE_AI_API_KEY || process.env.GEMINI_API_KEY
  // Google AI keys start with "AIza" (API keys) or "AQ." (newer keys).
  return Boolean(key && /^(AIza|AQ\.)/.test(key) && !isPlaceholder(key))
}

export function isOllamaConfigured(): boolean {
  return Boolean(process.env.OLLAMA_API_URL)
}

// Pings the Ollama server so status pages can tell "configured" from
// "actually reachable". Short timeout: a dead host must not slow the page.
export async function isOllamaReachable(): Promise<boolean> {
  if (!isOllamaConfigured()) return false
  try {
    const res = await fetch(`${process.env.OLLAMA_API_URL}/api/tags`, {
      signal: AbortSignal.timeout(1500),
    })
    return res.ok
  } catch {
    return false
  }
}

export const GOOGLE_AI_MODEL = process.env.GOOGLE_AI_MODEL || 'gemini-3.1-flash-lite'
// Tried in order until one succeeds (models are retired or overloaded).
// NOTE: the "-latest" aliases are convenient but flaky (frequent 503); the
// pinned lite model is the reliable default.
const GOOGLE_MODEL_CANDIDATES = Array.from(
  new Set([
    GOOGLE_AI_MODEL,
    'gemini-3.1-flash-lite',
    'gemini-3.8-flash',
    'gemini-flash-latest',
    'gemini-flash-lite-latest',
  ])
)
const OLLAMA_URL = process.env.OLLAMA_API_URL || 'http://localhost:11434'
const OLLAMA_MODEL = process.env.OLLAMA_CHAT_MODEL || 'llama3.2:latest'

async function generateWithGoogleModel(
  model: string,
  options: GenerateOptions
): Promise<string> {
  const key = (process.env.GOOGLE_AI_API_KEY || process.env.GEMINI_API_KEY) as string
  const systemMessages = options.messages.filter((m) => m.role === 'system')
  const turns = options.messages.filter((m) => m.role !== 'system')
  const lastUserIndex = turns.map((m) => m.role).lastIndexOf('user')

  const body: Record<string, unknown> = {
    contents: turns.map((m, i) => {
      const parts: Record<string, unknown>[] = [{ text: m.content }]
      // Attach media (images / documents) to the final user turn.
      if (options.media?.length && i === lastUserIndex) {
        for (const item of options.media) {
          parts.push({ inlineData: { mimeType: item.mimeType, data: item.data } })
        }
      }
      return {
        role: m.role === 'assistant' ? 'model' : 'user',
        parts,
      }
    }),
    generationConfig: {
      temperature: options.temperature ?? 0.6,
      maxOutputTokens: options.maxOutputTokens ?? 1024,
      ...(options.json ? { responseMimeType: 'application/json' } : {}),
    },
  }

  if (systemMessages.length > 0) {
    body.systemInstruction = {
      parts: [{ text: systemMessages.map((m) => m.content).join('\n\n') }],
    }
  }

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(options.timeoutMs ?? 20000),
    }
  )

  if (!res.ok) {
    const detail = await res.text().catch(() => '')
    const error: GoogleError = new Error(`Google AI ${model} error ${res.status}: ${detail.slice(0, 200)}`)
    error.status = res.status
    throw error
  }

  const data = await res.json()
  const text =
    data?.candidates?.[0]?.content?.parts
      ?.filter((p: { thought?: boolean }) => !p.thought)
      .map((p: { text?: string }) => p.text || '')
      .join('') || ''
  if (!text) throw new Error('Google AI returned an empty response')
  return text
}

// Tries each candidate model until one responds, so a retired or overloaded
// model never breaks the assistant. Only model-availability errors are retried
// across candidates: auth errors and network timeouts affect every model
// equally, so retrying them just multiplies latency before the caller falls back.
interface GoogleError extends Error {
  status?: number
}
const RETRYABLE_GOOGLE_STATUS = new Set([404, 429, 503])

async function generateWithGoogle(options: GenerateOptions): Promise<string> {
  let lastError: unknown = null
  for (const model of GOOGLE_MODEL_CANDIDATES) {
    try {
      return await generateWithGoogleModel(model, options)
    } catch (err) {
      lastError = err
      const status = (err as GoogleError)?.status
      if (!(status !== undefined && RETRYABLE_GOOGLE_STATUS.has(status))) break
    }
  }
  throw lastError instanceof Error ? lastError : new Error('Google AI unavailable')
}

async function generateWithOllama(options: GenerateOptions): Promise<string> {
  const messages = options.messages.map((m, i) => {
    const base: Record<string, unknown> = { role: m.role, content: m.content }
    // Ollama expects raw base64 images on the message itself.
    if (options.media?.length && m.role === 'user' && i === options.messages.length - 1) {
      base.images = options.media.map((item) => item.data)
    }
    return base
  })

  const res = await fetch(`${OLLAMA_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      messages,
      stream: false,
      options: { temperature: options.temperature ?? 0.6 },
      ...(options.json ? { format: 'json' } : {}),
    }),
    signal: AbortSignal.timeout(options.timeoutMs ?? 20000),
  })

  if (!res.ok) throw new Error(`Ollama error ${res.status}`)
  const data = await res.json()
  const text = data?.message?.content || ''
  if (!text) throw new Error('Ollama returned an empty response')
  return text
}

// Ordered provider chain. Google AI -> Ollama. The caller supplies a demo
// fallback via `fallback`.
//
// A short circuit breaker prevents a provider that just failed (unreachable
// host, invalid key) from blocking every request for the full timeout. After a
// failure we skip it for COOLDOWN_MS so the assistant stays responsive and
// falls through to the next provider immediately.
const COOLDOWN_MS = 60_000
let googleDownUntil = 0
let ollamaDownUntil = 0
const now = () => Date.now()

export async function generateText(
  options: GenerateOptions,
  fallback?: string
): Promise<GenerateResult> {
  if (isGoogleAIConfigured() && now() >= googleDownUntil) {
    try {
      const text = await generateWithGoogle(options)
      googleDownUntil = 0
      return { text, provider: 'google', model: GOOGLE_AI_MODEL }
    } catch (err) {
      googleDownUntil = now() + COOLDOWN_MS
      console.error('Google AI failed, trying fallback:', err)
    }
  }

  if (isOllamaConfigured() && now() >= ollamaDownUntil) {
    try {
      const text = await generateWithOllama(options)
      ollamaDownUntil = 0
      return { text, provider: 'ollama', model: OLLAMA_MODEL }
    } catch (err) {
      ollamaDownUntil = now() + COOLDOWN_MS
      console.error('Ollama failed, using demo fallback:', err)
    }
  }

  return { text: fallback ?? '', provider: 'demo', model: 'demo' }
}

export function extractJson<T>(text: string): T | null {
  const cleaned = text.replace(/```json/gi, '').replace(/```/g, '').trim()
  try {
    return JSON.parse(cleaned) as T
  } catch {
    const start = cleaned.indexOf('{')
    const end = cleaned.lastIndexOf('}')
    if (start !== -1 && end > start) {
      try {
        return JSON.parse(cleaned.slice(start, end + 1)) as T
      } catch {
        return null
      }
    }
    return null
  }
}
