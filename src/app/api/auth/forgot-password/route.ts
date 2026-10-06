import { NextResponse } from 'next/server'
import { randomBytes, createHash } from 'crypto'
import { prisma } from '@/lib/db/prisma'
import { sendEmail } from '@/lib/email/sendEmail'

const RESET_TTL_MS = 60 * 60 * 1000 // 1 hour

export async function POST(request: Request) {
  try {
    const { email } = await request.json()
    const cleanEmail = String(email || '').trim().toLowerCase()

    // Always return the same response to avoid leaking which emails exist.
    if (!cleanEmail) {
      return NextResponse.json({ success: true })
    }

    const user = await prisma.user.findUnique({ where: { email: cleanEmail } })

    if (user) {
      const token = randomBytes(32).toString('hex')
      const tokenHash = createHash('sha256').update(token).digest('hex')

      await prisma.user.update({
        where: { id: user.id },
        data: {
          resetTokenHash: tokenHash,
          resetTokenExpiry: new Date(Date.now() + RESET_TTL_MS),
        },
      })

      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3003'
      const resetUrl = `${baseUrl}/auth/reset-password?token=${token}`

      await sendEmail({
        to: user.email,
        subject: 'Réinitialisation de votre mot de passe E-Outilles',
        html: `
          <div style="font-family:Inter,Arial,sans-serif;max-width:520px;margin:auto">
            <h2 style="color:#121212">Réinitialisation de mot de passe</h2>
            <p>Bonjour ${user.name || ''},</p>
            <p>Vous avez demandé à réinitialiser votre mot de passe. Ce lien est valable 1 heure :</p>
            <p><a href="${resetUrl}" style="background:#FFC400;color:#121212;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:bold">Réinitialiser mon mot de passe</a></p>
            <p style="color:#666;font-size:13px">Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.</p>
          </div>`,
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
