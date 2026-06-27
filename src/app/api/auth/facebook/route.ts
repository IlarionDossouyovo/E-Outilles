import { NextResponse } from 'next/server'

export async function GET() {
  const fbClientId = process.env.FACEBOOK_CLIENT_ID || process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_ID
  const redirectUri = process.env.FACEBOOK_REDIRECT_URI || 'http://localhost:3008/api/auth/callback/facebook'
  
  if (!fbClientId) {
    return NextResponse.json({ error: 'Facebook Client ID not configured' }, { status: 500 })
  }

  const scope = 'email,public_profile'
  const authUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${fbClientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${scope}`
  
  return NextResponse.redirect(authUrl)
}
