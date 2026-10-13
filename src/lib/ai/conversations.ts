// Persistence for AI chat conversations.
// Anonymous visitors are tracked with an httpOnly cookie so their history
// survives reloads without requiring an account. Signed-in users get their
// history tied to their userId.

import { cookies } from 'next/headers'
import type { NextRequest } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { getSession } from '@/lib/security/auth'

export const GUEST_COOKIE = 'eo_guest'
const GUEST_MAX_AGE = 60 * 60 * 24 * 90 // 90 days

function makeGuestId(): string {
  return `g_${crypto.randomUUID()}`
}

// Reads the guest id from the request cookies (route handlers) and creates one
// when absent. The caller is responsible for setting it on the response.
export async function resolveIdentity(
  request: NextRequest
): Promise<{ userId: string | null; guestId: string; isNewGuest: boolean }> {
  const session = await getSession()
  const existing = request.cookies.get(GUEST_COOKIE)?.value
  const guestId = existing || makeGuestId()
  return { userId: session?.id ?? null, guestId, isNewGuest: !existing }
}

// Owner filter for a conversation lookup.
export function ownerWhere(userId: string | null, guestId: string) {
  return userId ? { userId } : { guestId }
}

// Attaches the guest cookie to a response when it was just created.
export function attachGuestCookie<T extends Response>(response: T, guestId: string): T {
  response.headers.append(
    'Set-Cookie',
    `${GUEST_COOKIE}=${guestId}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${GUEST_MAX_AGE}`
  )
  return response
}

// Returns the conversation if it belongs to the caller, otherwise null.
export async function getOwnedConversation(
  id: string,
  userId: string | null,
  guestId: string
) {
  return prisma.aiConversation.findFirst({
    where: { id, ...ownerWhere(userId, guestId) },
  })
}

export async function appendMessage(
  conversationId: string,
  data: {
    role: 'user' | 'assistant'
    content: string
    agentId?: string | null
    provider?: string | null
    hasAttachment?: boolean
    attachmentName?: string | null
  }
) {
  await prisma.aiMessage.create({
    data: {
      conversationId,
      role: data.role,
      content: data.content.slice(0, 20000),
      agentId: data.agentId ?? null,
      provider: data.provider ?? null,
      hasAttachment: data.hasAttachment ?? false,
      attachmentName: data.attachmentName ?? null,
    },
  })
  await prisma.aiConversation.update({
    where: { id: conversationId },
    data: { updatedAt: new Date() },
  })
}

// Sets a short title from the first user message when none exists yet.
export async function ensureTitle(conversationId: string, firstMessage: string) {
  const conv = await prisma.aiConversation.findUnique({ where: { id: conversationId } })
  if (!conv || conv.title) return
  const title = firstMessage.replace(/\s+/g, ' ').trim().slice(0, 60)
  if (!title) return
  await prisma.aiConversation.update({ where: { id: conversationId }, data: { title } })
}

// Cookie access for server components / actions (read-only).
export async function getGuestIdFromCookies(): Promise<string | null> {
  try {
    const store = await cookies()
    return store.get(GUEST_COOKIE)?.value ?? null
  } catch {
    return null
  }
}
