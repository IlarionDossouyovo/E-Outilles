import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')
  const error = searchParams.get('error')

  if (error) {
    return NextResponse.redirect(new URL('/auth/login?error=facebook_auth_failed', request.url))
  }

  if (!code) {
    return NextResponse.redirect(new URL('/auth/login?error=no_code', request.url))
  }

  const clientId = process.env.FACEBOOK_CLIENT_ID
  const clientSecret = process.env.FACEBOOK_CLIENT_SECRET
  const redirectUri = process.env.FACEBOOK_REDIRECT_URI || 'http://localhost:3008/api/auth/callback/facebook'

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(new URL('/auth/login?error=not_configured', request.url))
  }

  try {
    // Exchange code for token
    const tokenResponse = await fetch(`https://graph.facebook.com/v18.0/oauth/access_token?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&client_secret=${clientSecret}&code=${code}`)
    const tokens = await tokenResponse.json()

    if (tokens.access_token) {
      // Get user info
      const userResponse = await fetch(`https://graph.facebook.com/me?fields=id,name,email&access_token=${tokens.access_token}`)
      const user = await userResponse.json()

      const response = NextResponse.redirect(new URL('/profile?provider=facebook', request.url))
      response.cookies.set('auth_token', tokens.access_token, { httpOnly: true })
      response.cookies.set('auth_provider', 'facebook', { httpOnly: true })
      response.cookies.set('auth_email', user.email || '', { httpOnly: true })
      return response
    }

    return NextResponse.redirect(new URL('/auth/login?error=token_failed', request.url))
  } catch (err) {
    console.error('Facebook auth error:', err)
    return NextResponse.redirect(new URL('/auth/login?error=auth_failed', request.url))
  }
}
