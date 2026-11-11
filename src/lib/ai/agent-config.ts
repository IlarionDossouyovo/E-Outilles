// Persisted per-agent overrides, stored as a single JSON row in the Setting
// table. The registry in agents.ts stays the default (and the source of truth
// for ids/descriptions); the founder tunes instructions, tone, status and
// capabilities from /agent, and the chat API reads the merged result.

import { prisma } from '@/lib/db/prisma'
import {
  AGENTS,
  isAgentId,
  type AgentCapability,
  type AgentDefinition,
  type AgentId,
  type AgentTone,
} from '@/lib/ai/agents'

export interface AgentConfig {
  systemPrompt?: string
  tone?: AgentTone
  status?: 'online' | 'offline'
  capabilities?: AgentCapability[]
}

export type AgentConfigMap = Partial<Record<AgentId, AgentConfig>>

const CONFIG_KEY = 'ai.agents.config'

const TONES: AgentTone[] = ['chaleureux', 'expert', 'empathique', 'direct', 'institutionnel']
const CAPABILITIES: AgentCapability[] = ['text', 'vision', 'voice', 'reasoning', 'tools']
const STATUSES: AgentConfig['status'][] = ['online', 'offline']

// Cap the editable prompt so a single row can never grow unbounded.
const MAX_PROMPT = 6000

function sanitizeAgentConfig(input: unknown): AgentConfig {
  const out: AgentConfig = {}
  if (!input || typeof input !== 'object') return out
  const src = input as Record<string, unknown>

  if (typeof src.systemPrompt === 'string') {
    out.systemPrompt = src.systemPrompt.trim().slice(0, MAX_PROMPT)
  }
  if (typeof src.tone === 'string' && TONES.includes(src.tone as AgentTone)) {
    out.tone = src.tone as AgentTone
  }
  if (typeof src.status === 'string' && STATUSES.includes(src.status as AgentConfig['status'])) {
    out.status = src.status as AgentConfig['status']
  }
  if (Array.isArray(src.capabilities)) {
    out.capabilities = src.capabilities.filter(
      (c): c is AgentCapability => typeof c === 'string' && CAPABILITIES.includes(c as AgentCapability)
    )
  }
  return out
}

function sanitizeMap(input: unknown): AgentConfigMap {
  const out: AgentConfigMap = {}
  if (!input || typeof input !== 'object') return out
  for (const [id, cfg] of Object.entries(input as Record<string, unknown>)) {
    if (isAgentId(id)) out[id] = sanitizeAgentConfig(cfg)
  }
  return out
}

export async function getAgentConfigs(): Promise<AgentConfigMap> {
  try {
    const row = await prisma.setting.findUnique({ where: { key: CONFIG_KEY } })
    if (!row) return {}
    return sanitizeMap(JSON.parse(row.value))
  } catch {
    return {}
  }
}

async function persist(map: AgentConfigMap): Promise<void> {
  await prisma.setting.upsert({
    where: { key: CONFIG_KEY },
    update: { value: JSON.stringify(map) },
    create: { key: CONFIG_KEY, value: JSON.stringify(map) },
  })
}

// Merges one agent's patch into the stored map. An empty/undefined field clears
// the override so the agent falls back to the registry default.
export async function saveAgentConfig(id: AgentId, patch: unknown): Promise<AgentConfigMap> {
  const map = await getAgentConfigs()
  const clean = sanitizeAgentConfig(patch)
  if (Object.keys(clean).length === 0) {
    delete map[id]
  } else {
    map[id] = clean
  }
  await persist(map)
  return map
}

export async function resetAgentConfig(id: AgentId): Promise<AgentConfigMap> {
  const map = await getAgentConfigs()
  delete map[id]
  await persist(map)
  return map
}

// Applies stored overrides on top of a registry definition.
export function applyAgentConfig(agent: AgentDefinition, config?: AgentConfig): AgentDefinition {
  if (!config) return agent
  return {
    ...agent,
    systemPrompt: config.systemPrompt?.trim() ? config.systemPrompt : agent.systemPrompt,
    tone: config.tone ?? agent.tone,
    status: config.status ?? agent.status,
    capabilities: config.capabilities?.length ? config.capabilities : agent.capabilities,
  }
}

// The effective definition used by the chat API for one agent.
export async function effectiveAgent(agentId: AgentId): Promise<AgentDefinition> {
  const configs = await getAgentConfigs()
  return applyAgentConfig(AGENTS[agentId], configs[agentId])
}
