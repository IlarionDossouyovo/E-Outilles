import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/security/auth'
import { isFounderEmail } from '@/lib/security/founder'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

async function probeBrevo(key: string) {
  try {
    const res = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: { 'api-key': key, 'content-type': 'application/json' },
      body: JSON.stringify({
        sender: { name: 'E-Outilles', email: 'electronbusiness07@gmail.com' },
        to: [{ email: 'electronbusiness07@gmail.com' }],
        subject: '[E-Outilles] probe brevo',
        htmlContent: '<p>probe</p>',
      }),
    })
    return { ok: res.ok, status: res.status, body: (await res.text()).slice(0, 200) }
  } catch (e) {
    return { ok: false, error: String(e).slice(0, 200) }
  }
}

async function probeSmtp() {
  try {
    const nodemailer = await import('nodemailer')
    const port = Number(process.env.SMTP_PORT) || 587
    const t = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: port === 465,
      auth: process.env.SMTP_USER
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD }
        : undefined,
    })
    const r = await t.sendMail({
      from: 'E-Outilles <electronbusiness07@gmail.com>',
      to: 'electronbusiness07@gmail.com',
      subject: '[E-Outilles] probe smtp',
      text: 'probe',
    })
    return { ok: true, messageId: r.messageId }
  } catch (e: any) {
    return {
      ok: false,
      code: e?.code,
      responseCode: e?.responseCode,
      error: String(e?.message || e).slice(0, 300),
    }
  }
}

export async function GET(_request: NextRequest) {
  const user = await getSession()
  if (!user || !isFounderEmail(user.email)) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }
  const [brevo, smtp] = await Promise.all([
    process.env.BREVO_API_KEY ? probeBrevo(process.env.BREVO_API_KEY) : { skipped: true },
    probeSmtp(),
  ])
  return NextResponse.json({
    env: {
      smtpHost: process.env.SMTP_HOST,
      smtpPort: process.env.SMTP_PORT,
      smtpUser: Boolean(process.env.SMTP_USER),
      smtpPassword: Boolean(process.env.SMTP_PASSWORD),
      brevo: Boolean(process.env.BREVO_API_KEY),
      resend: Boolean(process.env.RESEND_API_KEY),
      fromEmail: process.env.FROM_EMAIL,
    },
    brevo,
    smtp,
  })
}
