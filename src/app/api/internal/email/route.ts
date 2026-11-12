import { NextRequest, NextResponse } from 'next/server'
import { deliverEmail } from '@/lib/email/sendEmail'

// Internal relay target. Vercel functions have rotating egress IPs that Brevo
// rejects, while Render keeps a stable allowlisted IP. A deployment that cannot
// reach the provider forwards here and this host delivers the message.
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  const expected = process.env.EMAIL_RELAY_TOKEN
  const provided = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '')

  if (!expected || provided !== expected) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  let payload: { to?: string; subject?: string; html?: string; text?: string }
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 })
  }

  const { to, subject, html, text } = payload
  if (!to || !subject || !html) {
    return NextResponse.json({ error: 'to, subject and html are required' }, { status: 400 })
  }

  const delivered = await deliverEmail({ to, subject, html, text })
  return NextResponse.json({ delivered }, { status: delivered ? 200 : 502 })
}
