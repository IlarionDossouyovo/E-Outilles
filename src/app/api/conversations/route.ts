import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { resolveIdentity, attachGuestCookie, ownerWhere } from '@/lib/ai/conversations'

// Lists the conversations belonging to the current visitor (user or guest).
export async function GET(request: NextRequest) {
  const { userId, guestId, isNewGuest } = await resolveIdentity(request)

  const conversations = await prisma.aiConversation.findMany({
    where: ownerWhere(userId, guestId),
    orderBy: { updatedAt: 'desc' },
    take: 30,
    select: {
      id: true,
      agentId: true,
      title: true,
      updatedAt: true,
      _count: { select: { messages: true } },
    },
  })

  const response = NextResponse.json({
    conversations: conversations.map((c) => ({
      id: c.id,
      agentId: c.agentId,
      title: c.title || 'Nouvelle conversation',
      updatedAt: c.updatedAt,
      messageCount: c._count.messages,
    })),
  })
  return isNewGuest ? attachGuestCookie(response, guestId) : response
}

// Deletes every conversation owned by the caller (privacy reset).
export async function DELETE(request: NextRequest) {
  const { userId, guestId } = await resolveIdentity(request)
  await prisma.aiConversation.deleteMany({ where: ownerWhere(userId, guestId) })
  return NextResponse.json({ ok: true })
}

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
