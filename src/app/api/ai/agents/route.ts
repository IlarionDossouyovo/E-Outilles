import { NextResponse } from 'next/server'
import { AGENTS, AGENT_LIST, PUBLIC_AGENT_IDS } from '@/lib/ai/agents'
import { getSession } from '@/lib/security/auth'
import { isFounderEmail } from '@/lib/security/founder'

// Returns the agents the current visitor is allowed to use.
// Everyone gets the public agents; the founder additionally gets the internal
// company agents (management, marketing, finance, ops).
export async function GET() {
  const session = await getSession()
  const isFounder = isFounderEmail(session?.email)
  const allowed = isFounder ? AGENT_LIST : PUBLIC_AGENT_IDS.map((id) => AGENTS[id])

  return NextResponse.json({
    founder: isFounder,
    agents: allowed.map((a) => ({
      id: a.id,
      name: a.name,
      icon: a.icon,
      category: a.category,
      description: a.description,
      capabilities: a.capabilities,
      status: a.status,
    })),
  })
}

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
