import { NextRequest, NextResponse } from 'next/server'
import { AGENTS, AGENT_LIST, isAgentId } from '@/lib/ai/agents'
import {
  applyAgentConfig,
  getAgentConfigs,
  resetAgentConfig,
  saveAgentConfig,
} from '@/lib/ai/agent-config'
import { requireFounder } from '@/lib/security/auth'

// Founder-only agent configuration: read every agent with its effective
// (merged) definition, update one agent, or reset it to the registry default.
export async function GET() {
  const founder = await requireFounder()
  if (!founder) {
    return NextResponse.json({ error: 'Accès réservé au fondateur' }, { status: 403 })
  }

  const configs = await getAgentConfigs()
  return NextResponse.json({
    agents: AGENT_LIST.map((a) => {
      const override = configs[a.id]
      const effective = applyAgentConfig(a, override)
      return {
        id: a.id,
        name: a.name,
        description: a.description,
        department: a.department,
        category: a.category,
        icon: a.icon,
        defaultSystemPrompt: a.systemPrompt,
        defaultTone: a.tone,
        defaultStatus: a.status,
        defaultCapabilities: a.capabilities,
        systemPrompt: effective.systemPrompt,
        tone: effective.tone,
        status: effective.status,
        capabilities: effective.capabilities,
        customized: Boolean(override && Object.keys(override).length > 0),
      }
    }),
  })
}

export async function PUT(request: NextRequest) {
  const founder = await requireFounder()
  if (!founder) {
    return NextResponse.json({ error: 'Accès réservé au fondateur' }, { status: 403 })
  }

  const body = await request.json().catch(() => ({}))
  const id = body?.id
  if (!isAgentId(id)) {
    return NextResponse.json({ error: 'Agent inconnu' }, { status: 400 })
  }

  const configs = await saveAgentConfig(id, body?.config)
  return NextResponse.json({ ok: true, agent: AGENTS[id].id, config: configs[id] ?? null })
}

export async function DELETE(request: NextRequest) {
  const founder = await requireFounder()
  if (!founder) {
    return NextResponse.json({ error: 'Accès réservé au fondateur' }, { status: 403 })
  }

  const id = request.nextUrl.searchParams.get('id')
  if (!isAgentId(id)) {
    return NextResponse.json({ error: 'Agent inconnu' }, { status: 400 })
  }

  await resetAgentConfig(id)
  return NextResponse.json({ ok: true })
}

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
