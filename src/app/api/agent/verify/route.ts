import { NextResponse } from 'next/server'
import { requireFounder } from '@/lib/security/auth'

// The AI agent dashboard exposes internal company data: it is reserved to the
// company founder. Access is decided by the signed-in session alone — the
// founder logs in with their e-mail/password and the page unlocks. No shared
// access code is required (the old AGENT_ACCESS_CODE second factor is gone).
export async function POST() {
  const founder = await requireFounder()
  if (!founder) {
    return NextResponse.json(
      { valid: false, error: "Accès réservé au fondateur de l'entreprise" },
      { status: 403 }
    )
  }
  return NextResponse.json({ valid: true })
}
