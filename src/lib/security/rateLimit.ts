import { NextRequest, NextResponse } from 'next/server'

// Simple in-memory rate limiter (use Redis in production)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

const RATE_LIMIT = 100 // requests
const RATE_WINDOW = 60 * 1000 // 1 minute

export function checkRateLimit(request: NextRequest): boolean {
  const ip = request.headers.get('x-forwarded-for') || 'unknown'
  const now = Date.now()
  
  const record = rateLimitMap.get(ip)
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_WINDOW })
    return true
  }
  
  if (record.count >= RATE_LIMIT) {
    return false
  }
  
  record.count++
  return true
}

// CSP Policy
export function getCSPHeader(): string {
  return [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google.com https://www.gstatic.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: https: blob:",
    "font-src 'self' https://fonts.gstatic.com",
    "connect-src 'self' https://api.stripe.com https://api.flutterwave.com",
    "frame-src 'self' https://js.stripe.com https://www.paypal.com",
  ].join('; ')
}
