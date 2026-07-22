import { NextRequest, NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email/sendEmail'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, subject, message } = body

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Tous les champs sont requis' },
        { status: 400 }
      )
    }

    // Create email content
    const adminHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; background: #121212; color: #fff; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: #1a1a1a; border-radius: 12px; padding: 30px; }
          .header { text-align: center; border-bottom: 2px solid #FFC400; padding-bottom: 20px; margin-bottom: 20px; }
          .logo { color: #FFC400; font-size: 28px; font-weight: bold; }
          h1 { color: #FFC400; }
          .field { margin: 15px 0; padding: 15px; background: #252525; border-radius: 8px; }
          .label { color: #FFC400; font-weight: bold; }
          .footer { text-align: center; color: #888; font-size: 12px; margin-top: 30px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">⚡ E-Outilles</div>
          </div>
          <h1>📬 Nouveau message de contact</h1>
          
          <div class="field">
            <div class="label">Nom:</div>
            <div>${name}</div>
          </div>
          
          <div class="field">
            <div class="label">Email:</div>
            <div>${email}</div>
          </div>
          
          <div class="field">
            <div class="label">Sujet:</div>
            <div>${subject}</div>
          </div>
          
          <div class="field">
            <div class="label">Message:</div>
            <div>${message}</div>
          </div>
          
          <div class="footer">
            <p>© 2026 E-Outilles - Votre partenaire dropshipping</p>
          </div>
        </div>
      </body>
      </html>
    `

    // Send email to admin
    const adminEmailSent = await sendEmail({
      to: 'admin@eoutilles.com',
      subject: `[E-Outelles] Nouveau message: ${subject}`,
      html: adminHtml
    })

    // Send confirmation to user
    const userHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; background: #121212; color: #fff; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: #1a1a1a; border-radius: 12px; padding: 30px; }
          .header { text-align: center; border-bottom: 2px solid #FFC400; padding-bottom: 20px; margin-bottom: 20px; }
          .logo { color: #FFC400; font-size: 28px; font-weight: bold; }
          h1 { color: #FFC400; }
          .footer { text-align: center; color: #888; font-size: 12px; margin-top: 30px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">⚡ E-Outilles</div>
          </div>
          <h1>✅ Message reçu!</h1>
          <p>Bonjour ${name},</p>
          <p>Nous avons bien reçu votre message. Notre équipe vous répondra dans les plus brefs délais.</p>
          <p>Ci-dessous le résumé de votre message:</p>
          <p><strong>Sujet:</strong> ${subject}</p>
          <p><strong>Message:</strong> ${message}</p>
          <div class="footer">
            <p>© 2026 E-Outilles - Votre partenaire dropshipping</p>
          </div>
        </div>
      </body>
      </html>
    `

    const userEmailSent = await sendEmail({
      to: email,
      subject: 'Confirmation - Votre message à E-Outilles',
      html: userHtml
    })

    if (adminEmailSent || userEmailSent) {
      return NextResponse.json(
        { success: true, message: 'Message envoyé avec succès!' },
        { status: 200 }
      )
    } else {
      return NextResponse.json(
        { error: "Erreur lors de l'envoi du message" },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Contact API error:', error)
    return NextResponse.json(
      { error: 'Erreur serveur interne' },
      { status: 500 }
    )
  }
}
