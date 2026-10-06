import { NextRequest, NextResponse } from 'next/server'
import QRCode from 'qrcode'

// Generates a QR code (PNG) pointing to a given URL.
// Defaults to the site root so visitors can open/download the app.

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const requested = searchParams.get('url')
  const base =
    process.env.NEXT_PUBLIC_BASE_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    new URL(request.url).origin

  const target = requested || `${base}/`

  try {
    const png = await QRCode.toBuffer(target, {
      type: 'png',
      width: 512,
      margin: 2,
      color: { dark: '#121212', light: '#FFFFFF' },
      errorCorrectionLevel: 'M',
    })

    return new NextResponse(new Uint8Array(png), {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=86400',
        'Content-Disposition': 'inline; filename="e-outilles-qr.png"',
      },
    })
  } catch (error) {
    console.error('QR code error:', error)
    return NextResponse.json({ error: 'Impossible de générer le QR code' }, { status: 500 })
  }
}

export const runtime = 'nodejs'
