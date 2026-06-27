import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')
  const error = searchParams.get('error')

  if (error) {
    return NextResponse.redirect(new URL('/auth/login?error=google_auth_failed', request.url))
  }

  if (!code) {
    return NextResponse.redirect(new URL('/auth/login?error=no_code', request.url))
  }

  // Exchange code for token
  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3008/api/auth/callback/google'

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(new URL('/auth/login?error=not_configured', request.url))
  }

  try {
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
      }),
    })

    const tokens = await tokenResponse.json()

    if (tokens.access_token) {
      // Get user info
      const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      })
      const user = await userResponse.json()

      // Store user in localStorage (client will handle this)
      const response = NextResponse.redirect(new URL('/profile?provider=google', request.url))
      response.cookies.set('auth_token', tokens.access_token, { httpOnly: true })
      response.cookies.set('auth_provider', 'google', { httpOnly: true })
      response.cookies.set('auth_email', user.email, { httpOnly: true })
      return response
    }

    return NextResponse.redirect(new URL('/auth/login?error=token_failed', request.url))
  } catch (err) {
    console.error('Google auth error:', err)
    return NextResponse.redirect(new URL('/auth/login?error=auth_failed', request.url))
  }
}
