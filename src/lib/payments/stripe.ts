import { loadStripe, Stripe } from '@stripe/stripe-js'

// Stripe public key - use env variable in production
const STRIPE_PUBLIC_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder'

let stripePromise: Promise<Stripe | null>

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(STRIPE_PUBLIC_KEY)
  }
  return stripePromise
}

// Create checkout session
export async function createCheckoutSession(priceId: string, quantity: number = 1) {
  const response = await fetch('/api/payments/create-checkout-session', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ priceId, quantity }),
  })

  if (!response.ok) {
    throw new Error('Failed to create checkout session')
  }

  return response.json()
}

// Create payment intent for custom amounts
export async function createPaymentIntent(amount: number, currency: string = 'eur') {
  const response = await fetch('/api/payments/create-payment-intent', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ amount, currency }),
  })

  if (!response.ok) {
    throw new Error('Failed to create payment intent')
  }

  return response.json()
}