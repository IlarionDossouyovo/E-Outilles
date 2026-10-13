import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/security/auth'
import { prisma } from '@/lib/db/prisma'
import { sendEmail } from '@/lib/email/sendEmail'

// Sends a campaign to active subscribers (admin-only).
// Emails are dispatched in small batches; per-recipient failures never abort
// the whole campaign, and the result reports how many were actually sent.
export async function POST(request: NextRequest) {
  const admin = await requireAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
  }

  const { subject, body } = await request.json().catch(() => ({}))
  const cleanSubject = String(subject || '').trim().slice(0, 200)
  const cleanBody = String(body || '').trim().slice(0, 20000)

  if (!cleanSubject || !cleanBody) {
    return NextResponse.json({ error: 'Objet et contenu requis' }, { status: 400 })
  }

  const subscribers = await prisma.subscriber.findMany({ where: { status: 'active' } })
  if (subscribers.length === 0) {
    return NextResponse.json({ ok: true, sent: 0, failed: 0, total: 0 })
  }

  const html = `<div style="font-family:Arial,sans-serif;color:#111;line-height:1.6">
${cleanBody.split('\n').map((line) => `<p>${line}</p>`).join('')}
<hr style="border:none;border-top:1px solid #eee;margin:24px 0" />
<p style="font-size:12px;color:#888">E-Outilles — vous recevez cet email car vous êtes inscrit à notre newsletter.</p>
</div>`

  let sent = 0
  let failed = 0
  const BATCH = 5
  for (let i = 0; i < subscribers.length; i += BATCH) {
    const batch = subscribers.slice(i, i + BATCH)
    const results = await Promise.all(
      batch.map((s) => sendEmail({ to: s.email, subject: cleanSubject, html }).catch(() => false))
    )
    for (const ok of results) ok ? sent++ : failed++
  }

  return NextResponse.json({ ok: true, sent, failed, total: subscribers.length })
}

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
