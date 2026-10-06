// Central AI provider layer for E-Outilles.
// Google AI (Gemini) is preferred when GOOGLE_AI_API_KEY is set, then Ollama
// (local), and finally a deterministic demo responder so the app never breaks.

export type ChatRole = 'system' | 'user' | 'assistant'

export interface ChatTurn {
  role: ChatRole
  content: string
}

export interface GenerateOptions {
  messages: ChatTurn[]
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

export const GOOGLE_AI_MODEL = process.env.GOOGLE_AI_MODEL || 'gemini-flash-lite-latest'
// Tried in order until one succeeds (models are retired or overloaded).
const GOOGLE_MODEL_CANDIDATES = Array.from(
  new Set([
    GOOGLE_AI_MODEL,
    'gemini-flash-lite-latest',
    'gemini-flash-latest',
    'gemini-3.8-flash',
    'gemini-3.1-flash-lite',
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

  const body: Record<string, unknown> = {
    contents: turns.map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    })),
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
    throw new Error(`Google AI ${model} error ${res.status}: ${detail.slice(0, 200)}`)
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

// Tries each candidate model until one responds, so a retired model never
// breaks the assistant.
async function generateWithGoogle(options: GenerateOptions): Promise<string> {
  let lastError: unknown = null
  for (const model of GOOGLE_MODEL_CANDIDATES) {
    try {
      return await generateWithGoogleModel(model, options)
    } catch (err) {
      lastError = err
    }
  }
  throw lastError instanceof Error ? lastError : new Error('Google AI unavailable')
}

async function generateWithOllama(options: GenerateOptions): Promise<string> {
  const res = await fetch(`${OLLAMA_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      messages: options.messages,
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
export async function generateText(
  options: GenerateOptions,
  fallback?: string
): Promise<GenerateResult> {
  if (isGoogleAIConfigured()) {
    try {
      return { text: await generateWithGoogle(options), provider: 'google', model: GOOGLE_AI_MODEL }
    } catch (err) {
      console.error('Google AI failed, trying fallback:', err)
    }
  }

  if (isOllamaConfigured()) {
    try {
      return { text: await generateWithOllama(options), provider: 'ollama', model: OLLAMA_MODEL }
    } catch (err) {
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
