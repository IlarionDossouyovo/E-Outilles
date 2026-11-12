import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { requireFounder } from '@/lib/security/auth'

// Founder-only live counters for the AI agent dashboard. Everything here is
// derived from real rows (AiConversation / AiMessage) — no fabricated numbers.
export async function GET() {
  const founder = await requireFounder()
  if (!founder) {
    return NextResponse.json({ error: 'Accès réservé au fondateur' }, { status: 403 })
  }

  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

  const [totalConversations, conversationsLast7d, totalMessages, messagesLast7d, grouped] =
    await Promise.all([
      prisma.aiConversation.count(),
      prisma.aiConversation.count({ where: { createdAt: { gte: since } } }),
      prisma.aiMessage.count({ where: { role: 'user' } }),
      prisma.aiMessage.count({ where: { role: 'user', createdAt: { gte: since } } }),
      prisma.aiConversation.groupBy({ by: ['agentId'], _count: { _all: true } }),
    ])

  const byAgent: Record<string, number> = {}
  for (const row of grouped) {
    byAgent[row.agentId] = row._count._all
  }

  return NextResponse.json({
    totalConversations,
    conversationsLast7d,
    totalMessages,
    messagesLast7d,
    byAgent,
  })
}

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
