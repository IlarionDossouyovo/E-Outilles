import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { resolveIdentity, getOwnedConversation } from '@/lib/ai/conversations'

// Returns a single conversation with its messages (owner only).
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const { userId, guestId } = await resolveIdentity(request)
  const conversation = await getOwnedConversation(params.id, userId, guestId)
  if (!conversation) {
    return NextResponse.json({ error: 'Conversation introuvable' }, { status: 404 })
  }

  const messages = await prisma.aiMessage.findMany({
    where: { conversationId: conversation.id },
    orderBy: { createdAt: 'asc' },
    select: {
      id: true,
      role: true,
      content: true,
      agentId: true,
      provider: true,
      hasAttachment: true,
      attachmentName: true,
      createdAt: true,
    },
  })

  return NextResponse.json({
    id: conversation.id,
    agentId: conversation.agentId,
    title: conversation.title || 'Nouvelle conversation',
    messages,
  })
}

// Deletes a single conversation (owner only).
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const { userId, guestId } = await resolveIdentity(request)
  const conversation = await getOwnedConversation(params.id, userId, guestId)
  if (!conversation) {
    return NextResponse.json({ error: 'Conversation introuvable' }, { status: 404 })
  }
  await prisma.aiConversation.delete({ where: { id: conversation.id } })
  return NextResponse.json({ ok: true })
}

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
