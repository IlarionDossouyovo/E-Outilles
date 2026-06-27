import { NextResponse } from 'next/server'

export async function GET() {
  const googleClientId = process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3008/api/auth/callback/google'
  
  if (!googleClientId) {
    return NextResponse.json({ error: 'Google Client ID not configured' }, { status: 500 })
  }

  const scope = 'openid email profile'
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(scope)}&access_type=offline`
  
  return NextResponse.redirect(authUrl)
}
