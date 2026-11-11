// Email utility for E-Outilles
// Send confirmation emails using Resend API

import { Resend } from 'resend'

interface EmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

// Brevo (ex-SendGrid FR) transactional API. Returns true on a 2xx response.
async function sendWithBrevo(
  apiKey: string,
  fromEmail: string,
  { to, subject, html, text }: EmailOptions
): Promise<boolean> {
  // Brevo wants { name, email }; accept "Name <email>" or a bare address.
  const match = fromEmail.match(/^\s*(.*?)\s*<([^>]+)>\s*$/)
  const sender = match
    ? { name: match[1] || 'E-Outilles', email: match[2] }
    : { name: 'E-Outilles', email: fromEmail }

  try {
    const res = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: { 'api-key': apiKey, 'content-type': 'application/json', accept: 'application/json' },
      body: JSON.stringify({
        sender,
        to: [{ email: to }],
        subject,
        htmlContent: html,
        textContent: text || html.replace(/<[^>]*>/g, ''),
      }),
    })

    if (!res.ok) {
      console.error('❌ Brevo error:', res.status, await res.text().catch(() => ''))
      return false
    }
    console.log('✅ Email sent via Brevo')
    return true
  } catch (err) {
    console.error('❌ Failed to send email via Brevo:', err)
    return false
  }
}

export async function sendEmail({ to, subject, html, text }: EmailOptions): Promise<boolean> {
  const resendKey = process.env.RESEND_API_KEY
  const brevoKey = process.env.BREVO_API_KEY
  const fromEmail = process.env.FROM_EMAIL || 'E-Outilles <noreply@eoutilles.com>'
  
  // Brevo first: its sender is verified on this account, so it never fails on
  // an unverified domain the way Resend does with a public mailbox.
  if (brevoKey && brevoKey.startsWith('xkeysib-')) {
    if (await sendWithBrevo(brevoKey, fromEmail, { to, subject, html, text })) return true
  }

  // Resend fallback (requires a verified sending domain).
  if (resendKey && resendKey.startsWith('re_') && resendKey !== 're_placeholder_key') {
    try {
      const resend = new Resend(resendKey)
      
      const { data, error } = await resend.emails.send({
        from: fromEmail,
        to: [to],
        subject: subject,
        html: html,
        text: text || html.replace(/<[^>]*>/g, '')
      })

      if (error) {
        console.error('❌ Resend error:', error)
      } else {
        console.log('✅ Email sent via Resend:', data?.id)
        return true
      }
    } catch (err) {
      console.error('❌ Failed to send email via Resend:', err)
    }
  }

  // Fallback to SMTP or development mode
  const smtpHost = process.env.SMTP_HOST
  const smtpPort = process.env.SMTP_PORT || '1025'
  const smtpUser = process.env.SMTP_USER || ''
  const smtpPassword = process.env.SMTP_PASSWORD || ''

  // If no SMTP configured, log the email (development mode)
  if (!smtpHost || smtpHost === 'localhost') {
    console.log('📧 Email (development mode - logged only):')
    console.log(`To: ${to}`)
    console.log(`Subject: ${subject}`)
    console.log(`Body: ${html.substring(0, 200)}...`)
    return true
  }

  try {
    // Use nodemailer-like API (can be implemented with actual SMTP library)
    const response = await fetch(`http://${smtpHost}:${smtpPort}/api/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: fromEmail,
        to,
        subject,
        html
      })
    })

    return response.ok
  } catch (error) {
    console.error('Failed to send email:', error)
    return false
  }
}

// Order confirmation email template
export function createOrderConfirmationEmail(order: {
  id: string
  customerName: string
  total: number
  items: Array<{ name: string; quantity: number; price: number }>
}) {
  const itemsHtml = order.items
    .map(item => `<li>${item.name} x${item.quantity} - ${item.price}€</li>`)
    .join('')

  return `
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
        .items { background: #252525; padding: 15px; border-radius: 8px; margin: 20px 0; }
        .items li { padding: 8px 0; border-bottom: 1px solid #333; }
        .total { font-size: 24px; font-weight: bold; color: #FFC400; text-align: center; margin: 20px 0; }
        .footer { text-align: center; color: #888; font-size: 12px; margin-top: 30px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">⚡ E-Outilles</div>
        </div>
        <h1>✅ Commande confirmée!</h1>
        <p>Bonjour ${order.customerName},</p>
        <p>Nous avons bien reçu votre commande. Voici le récapitulatif:</p>
        
        <div class="items">
          <h3>📦 Produits commandés:</h3>
          <ul>${itemsHtml}</ul>
        </div>
        
        <div class="total">
          Total: ${order.total}€
        </div>
        
        <p>📞 Nous vous contacterons bientôt pour confirmer la livraison.</p>
        
        <div class="footer">
          <p>© 2026 E-Outilles - Votre partenaire dropshipping</p>
        </div>
      </div>
    </body>
    </html>
  `
}

// Send order confirmation
export async function sendOrderConfirmation(order: {
  id: string
  customerEmail: string
  customerName: string
  total: number
  items: Array<{ name: string; quantity: number; price: number }>
}) {
  const html = createOrderConfirmationEmail(order)
  
  return sendEmail({
    to: order.customerEmail,
    subject: `Confirmation de commande #${order.id}`,
    html
  })
}
