'use client'

import { useEffect, useState } from 'react'
import { NavigationArrows, Icon } from '@/components/Icons'
import { useCartStore } from '@/lib/store/cart'
import { useHydrated } from '@/lib/useHydrated'
import Link from 'next/link'
import PageNavigation from '@/components/PageNavigation'
import { readAttribution } from '@/components/marketing/MarketingTracker'
import { useTranslation } from '@/lib/i18n/LanguageProvider'

export default function CheckoutPage() {
  const { t } = useTranslation()
  const { items, getTotal, clearCart } = useCartStore()
  const hydrated = useHydrated()
  // Stripe readiness is resolved by the server: the secret key is not
  // available in the browser bundle, so a local check would always be false.
  const [stripeReady, setStripeReady] = useState(false)
  const [step, setStep] = useState(1) // 1: livraison, 2: paiement, 3: confirmation
  const [paymentMethod, setPaymentMethod] = useState('cod')
  const [loading, setLoading] = useState(false)
  const [orderId, setOrderId] = useState('')
  const [error, setError] = useState('')
  const [finalTotal, setFinalTotal] = useState(0)
  const [finalCount, setFinalCount] = useState(0)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: 'Benin',
    note: ''
  })

  const [momoData, setMomoData] = useState({
    operator: '',
    phone: ''
  })
  const [momoNotice, setMomoNotice] = useState('')
  const [merchantMomo, setMerchantMomo] = useState('')

  useEffect(() => {
    let active = true
    fetch('/api/payments/status')
      .then((r) => r.json())
      .then((d) => { if (active && d?.card) setStripeReady(true) })
      .catch(() => {})
    fetch('/api/marketing/channels')
      .then((r) => r.json())
      .then((d) => { if (active) setMerchantMomo(d?.mobileMoneyNumber || d?.phone || '') })
      .catch(() => {})
    return () => { active = false }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Step 1 (livraison) -> step 2 (paiement). Step 2 is the final submit.
    if (step < 2) {
      setStep(step + 1)
      return
    }

    if (paymentMethod === 'card' && !stripeReady) {
      setError('Le paiement par carte n’est pas encore activé. Choisissez le paiement à la livraison ou Mobile Money.')
      return
    }

    // Submit order
    setLoading(true)
    setError('')

    const orderData = {
      customerName: formData.name,
      customerEmail: formData.email,
      phone: formData.phone,
      shippingAddress: formData.address,
      shippingCity: formData.city,
      shippingCountry: formData.country,
      paymentMethod,
      notes: formData.note,
      // First-touch marketing attribution captured by MarketingTracker.
      ...readAttribution(),
      items: items.map(item => ({
        productId: item.id,
        quantity: item.quantity,
      })),
    }

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      })

      const result = await response.json()

      if (!response.ok) {
        setError(result.error || 'Erreur lors de la commande. Veuillez réessayer.')
        setLoading(false)
        return
      }

      setOrderId(result.orderId)
      setFinalTotal(result.order?.total ?? getTotal())
      setFinalCount(items.length)

      if (paymentMethod === 'card') {
        // Hand off to Stripe Checkout; the webhook marks the order as paid.
        const payRes = await fetch('/api/payments/stripe/create-checkout-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId: result.orderId, customerEmail: formData.email }),
        })
        const pay = await payRes.json()

        if (pay.url) {
          window.location.href = pay.url
          return
        }

        // Stripe not configured: fall back to offline confirmation.
        clearCart()
        setStep(3)
        return
      }

      if (paymentMethod === 'momo') {
        const op = momoData.operator ? momoData.operator.toUpperCase() : 'Mobile Money'
        setMomoNotice(
          `Instruction de paiement Mobile Money\n\n` +
          `1. Envoyez ${(result.order?.total ?? getTotal()).toFixed(2)} € au numéro marchand :\n` +
          `   ${merchantMomo || '+229 01 977 003 47'}\n` +
          `   Opérateur : ${op}\n` +
          `2. Votre numéro de payeur : ${momoData.phone || 'non renseigné'}\n\n` +
          `Indiquez le numéro de commande ${result.order?.id ?? orderId} en référence du transfert. ` +
          `Votre commande reste « en attente » jusqu'à confirmation du paiement (généralement sous 30 min).`
        )
      }

      clearCart()
      setStep(3)
    } catch (err) {
      console.error('Order error:', err)
      setError(t('co.error'))
    } finally {
      setLoading(false)
    }
  }



  // Étape 3: Confirmation
  if (step === 3) {
    return (
      <div className="min-h-screen bg-ingco-black">
        <div className="pt-24 pb-16 max-w-md mx-auto px-4 text-center">
          <div className="bg-ingco-gray rounded-3xl p-8">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Icon name="check" className="w-10 h-10 text-green-400" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-4">{t('co.confirmed')}</h1>
            <div className="bg-ingco-dark rounded-xl p-3 mb-4">
              <p className="text-gray-400 text-sm">{t('co.orderNumber')}</p>
              <p className="text-ingco-yellow font-bold text-lg">{orderId}</p>
            </div>
            <p className="text-gray-400 mb-6">
              {t('co.thanks').replace('{name}', formData.name).replace('{phone}', formData.phone)}
            </p>
            <div className="bg-ingco-dark rounded-xl p-4 mb-6 text-left">
              <p className="text-gray-400 text-sm">{t('co.paymentMode')}</p>
              <p className="text-white font-bold">
                {paymentMethod === 'cod' && t('co.payCod')}
                {paymentMethod === 'momo' && t('co.payMomo')}
                {paymentMethod === 'card' && t('co.payCard')}
              </p>
            </div>
            <div className="bg-ingco-dark rounded-xl p-4 mb-6 text-left">
              <p className="text-gray-400 text-sm">{t('co.summary')}</p>
              <p className="text-white font-bold">{t('co.items').replace('{count}', String(finalCount))}</p>
              <p className="text-ingco-yellow font-bold text-xl">{finalTotal.toFixed(2)}€</p>
            </div>
            {momoNotice && (
              <div className="bg-ingco-dark border border-ingco-yellow/40 rounded-xl p-4 mb-6 text-left">
                <p className="text-ingco-yellow font-bold mb-2 flex items-center gap-2">
                  <Icon name="phone" className="w-4 h-4" /> {t('co.paymentInstruction')}
                </p>
                <pre className="text-gray-300 text-sm whitespace-pre-wrap font-sans">{momoNotice}</pre>
              </div>
            )}
            <Link href="/" className="block bg-ingco-yellow text-ingco-black py-3 rounded-xl font-bold hover:bg-yellow-400">
              {t('co.backHome')}
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-ingco-black">
      <PageNavigation />
      <div className="pt-24 pb-16 max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-white mb-8">{t('co.title')}</h1>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className={`flex items-center gap-2 ${step >= 1 ? 'text-ingco-yellow' : 'text-gray-500'}`}>
            <span className="w-8 h-8 rounded-full bg-ingco-yellow/20 flex items-center justify-center">1</span>
            <span className="hidden sm:inline">{t('co.step.delivery')}</span>
          </div>
          <div className="w-8 h-0.5 bg-ingco-gray"></div>
          <div className={`flex items-center gap-2 ${step >= 2 ? 'text-ingco-yellow' : 'text-gray-500'}`}>
            <span className="w-8 h-8 rounded-full bg-ingco-yellow/20 flex items-center justify-center">2</span>
            <span className="hidden sm:inline">{t('co.step.payment')}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-ingco-gray rounded-2xl p-6">
              {step === 1 && (
                <>
                  <h2 className="text-xl font-bold text-white mb-6">{t('co.shipping.title')}</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="text-gray-400 text-sm mb-2 block">{t('co.name')}</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-ingco-black border border-ingco-dark rounded-xl px-4 py-3 text-white focus:border-ingco-yellow focus:outline-none"
                        placeholder={t('co.namePh')}
                      />
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm mb-2 block">{t('co.email')}</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full bg-ingco-black border border-ingco-dark rounded-xl px-4 py-3 text-white focus:border-ingco-yellow focus:outline-none"
                        placeholder="votre@email.com"
                      />
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm mb-2 block">{t('co.phone')}</label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full bg-ingco-black border border-ingco-dark rounded-xl px-4 py-3 text-white focus:border-ingco-yellow focus:outline-none"
                        placeholder="+229 XX XXX XX XX"
                      />
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm mb-2 block">{t('co.address')}</label>
                      <input
                        type="text"
                        required
                        value={formData.address}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                        className="w-full bg-ingco-black border border-ingco-dark rounded-xl px-4 py-3 text-white focus:border-ingco-yellow focus:outline-none"
                        placeholder={t('co.addressPh')}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-gray-400 text-sm mb-2 block">{t('co.city')}</label>
                        <input
                          type="text"
                          required
                          value={formData.city}
                          onChange={(e) => setFormData({...formData, city: e.target.value})}
                          className="w-full bg-ingco-black border border-ingco-dark rounded-xl px-4 py-3 text-white focus:border-ingco-yellow focus:outline-none"
                          placeholder="Cotonou"
                        />
                      </div>
                      <div>
                        <label className="text-gray-400 text-sm mb-2 block">{t('co.country')}</label>
                        <select
                          value={formData.country}
                          onChange={(e) => setFormData({...formData, country: e.target.value})}
                          className="w-full bg-ingco-black border border-ingco-dark rounded-xl px-4 py-3 text-white focus:border-ingco-yellow focus:outline-none"
                        >
                          <option value="Benin">Bénin</option>
                          <option value="SN">Sénégal</option>
                          <option value="CI">Côte d'Ivoire</option>
                          <option value="CM">Cameroun</option>
                          <option value="FR">France</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm mb-2 block">{t('co.note')}</label>
                      <textarea
                        value={formData.note}
                        onChange={(e) => setFormData({...formData, note: e.target.value})}
                        className="w-full bg-ingco-black border border-ingco-dark rounded-xl px-4 py-3 text-white focus:border-ingco-yellow focus:outline-none"
                        rows={3}
                        placeholder={t('co.notePh')}
                      />
                    </div>
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <h2 className="text-xl font-bold text-white mb-6">{t('co.payment.title')}</h2>
                  <div className="space-y-3">
                    <div 
                      onClick={() => setPaymentMethod('cod')}
                      className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer border-2 transition-all ${paymentMethod === 'cod' ? 'bg-ingco-black border-ingco-yellow' : 'bg-ingco-black border-ingco-dark hover:border-gray-600'}`}
                    >
                      <input type="radio" name="payment" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="w-5 h-5 accent-ingco-yellow" />
                      <div className="flex-1">
                        <p className="text-white font-bold">{t('co.cod')}</p>
                        <p className="text-gray-400 text-sm">{t('co.codText')}</p>
                        <p className="text-green-400 text-xs mt-1">{t('co.fees')}</p>
                        {paymentMethod === 'cod' && <span className="inline-block mt-2 text-xs bg-ingco-yellow/20 text-ingco-yellow px-2 py-1 rounded">{t('co.selected')}</span>}
                      </div>
                      <Icon name="truck" className="w-6 h-6 text-ingco-yellow" />
                    </div>
                    <div 
                      onClick={() => setPaymentMethod('momo')}
                      className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer border-2 transition-all ${paymentMethod === 'momo' ? 'bg-ingco-black border-ingco-yellow' : 'bg-ingco-black border-ingco-dark hover:border-gray-600'}`}
                    >
                      <input type="radio" name="payment" checked={paymentMethod === 'momo'} onChange={() => setPaymentMethod('momo')} className="w-5 h-5 accent-ingco-yellow" />
                      <div className="flex-1">
                        <p className="text-white font-bold">{t('co.momo')}</p>
                        <p className="text-gray-400 text-sm">{t('co.momoText')}</p>
                      </div>
                      <Icon name="phone" className="w-6 h-6 text-ingco-yellow" />
                    </div>
                    <div 
                      onClick={() => stripeReady && setPaymentMethod('card')}
                      className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                        !stripeReady
                          ? 'bg-ingco-black border-ingco-dark opacity-50 cursor-not-allowed'
                          : paymentMethod === 'card'
                            ? 'bg-ingco-black border-ingco-yellow cursor-pointer'
                            : 'bg-ingco-black border-ingco-dark hover:border-gray-600 cursor-pointer'
                      }`}
                    >
                      <input type="radio" name="payment" disabled={!stripeReady} checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} className="w-5 h-5 accent-ingco-yellow" />
                      <div className="flex-1">
                        <p className="text-white font-bold">{t('co.card')}</p>
                        <p className="text-gray-400 text-sm">{t('co.cardText')}</p>
                        {stripeReady
                          ? <p className="text-green-400 text-xs mt-1">{t('co.cardStripe')}</p>
                          : <p className="text-yellow-400 text-xs mt-1">{t('co.cardSoon')}</p>}
                        {paymentMethod === 'card' && stripeReady && <span className="inline-block mt-2 text-xs bg-ingco-yellow/20 text-ingco-yellow px-2 py-1 rounded">{t('co.selected')}</span>}
                      </div>
                      <Icon name="card" className="w-6 h-6 text-ingco-yellow" />
                    </div>
                  </div>

                  {/* Mobile Money Form */}
                  {paymentMethod === 'momo' && (
                    <div className="mt-6 p-4 bg-ingco-black rounded-xl border border-ingco-dark">
                      <h3 className="text-white font-bold mb-4">{t('co.momoDetails')}</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="text-gray-400 text-sm mb-2 block">{t('co.operator')}</label>
                          <select 
                            className="w-full bg-ingco-dark border border-ingco-gray rounded-xl px-4 py-3 text-white"
                            value={momoData.operator}
                            onChange={(e) => setMomoData({...momoData, operator: e.target.value})}
                          >
                            <option value="">{t('co.operatorSelect')}</option>
                            <option value="mtn">MTN Mobile Money</option>
                            <option value="moov">Moov Money</option>
                            <option value="orange">Orange Money</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-gray-400 text-sm mb-2 block">{t('co.momoNumber')}</label>
                          <input
                            type="tel"
                            placeholder="+229 XX XXX XX XX"
                            className="w-full bg-ingco-dark border border-ingco-gray rounded-xl px-4 py-3 text-white focus:border-ingco-yellow focus:outline-none"
                            value={momoData.phone}
                            onChange={(e) => setMomoData({...momoData, phone: e.target.value})}
                          />
                        </div>
                        <p className="text-gray-400 text-sm">
                          {t('co.momoCode')}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Card Payment Form */}
                  {paymentMethod === 'card' && stripeReady && (
                    <div className="mt-6 p-4 bg-ingco-black rounded-xl border border-ingco-dark">
                      <h3 className="text-white font-bold mb-4">{t('co.secure')}</h3>
                      <p className="text-gray-300 text-sm">
                        {t('co.secureText')}
                      </p>
                      <div className="flex items-center gap-2 mt-4">
                        <Icon name="shield" className="w-4 h-4 text-green-400" />
                        <span className="text-gray-400 text-sm">{t('co.secureShort')}</span>
                      </div>
                    </div>
                  )}
                </>
              )}

              <button 
                type="submit" 
                disabled={loading}
                className="w-full mt-6 bg-ingco-yellow text-ingco-black py-4 rounded-xl font-bold hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? t('co.processing') : step === 1 ? t('co.continue') : t('co.confirm')}
              </button>
              {error && (
                <div className="mt-4 bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-xl text-sm">
                  {error}
                </div>
              )}
            </form>
          </div>

          {/* Summary */}
          <div className="bg-ingco-dark border-2 border-ingco-gray rounded-2xl p-6 h-fit sticky top-24">
            <div className="flex items-center gap-2 mb-4">
              <Icon name="cart" className="w-5 h-5 text-ingco-yellow" />
              <h2 className="text-xl font-bold text-white">{t('co.order')}</h2>
            </div>
            <div className="space-y-3 mb-4 max-h-40 overflow-y-auto">
              {hydrated && items.map((item) => (
                <div key={item.id} className="flex justify-between items-center text-sm bg-ingco-black/50 p-2 rounded-lg">
                  <div className="flex-1 mr-2">
                    <span className="text-gray-200">{item.name}</span>
                    <span className="text-gray-500 text-xs ml-2">x{item.quantity}</span>
                  </div>
                  <span className="text-ingco-yellow font-bold">{(item.price * item.quantity).toFixed(2)}€</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-700 pt-3 space-y-2">
              <div className="flex justify-between text-gray-400">
                <span>{t('co.subtotal')}</span>
                <span className="text-gray-300">{(hydrated ? getTotal() : 0).toFixed(2)}€</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>{t('co.shipping')}</span>
                <span className="text-green-400 font-medium flex items-center gap-1"><Icon name="check" className="w-4 h-4" /> {t('co.free')}</span>
              </div>
              <div className="flex justify-between text-white font-bold text-xl pt-2 border-t border-gray-700">
                <span>{t('co.total')}</span>
                <span className="text-ingco-yellow">{(hydrated ? getTotal() : 0).toFixed(2)}€</span>
              </div>
            </div>
            <Link href="/cart" className="inline-flex items-center justify-center gap-1 w-full text-gray-500 mt-4 text-sm hover:text-ingco-yellow transition-colors">
              <Icon name="arrow-left" className="w-4 h-4" /> {t('co.backToCart')}
            </Link>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 pb-8">
        <NavigationArrows current="/checkout" />
      </div>

    </div>
  )
}