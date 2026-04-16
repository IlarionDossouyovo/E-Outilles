'use client'

import { useState } from 'react'
import { PaymentMethod } from '@/lib/payments/providers'

interface PaymentSelectorProps {
  methods: PaymentMethod[]
  currency: string
  onPaymentSelect: (methodId: string) => void
}

export default function PaymentSelector({ methods, currency, onPaymentSelect }: PaymentSelectorProps) {
  const [selected, setSelected] = useState<string | null>(null)

  const handleSelect = (methodId: string) => {
    setSelected(methodId)
    onPaymentSelect(methodId)
  }

  const groupedMethods = {
    international: methods.filter(m => ['visa', 'mastercard', 'paypal'].includes(m.id)),
    mobileMoney: methods.filter(m => ['mtn-momo', 'orange-money', 'moov-money'].includes(m.id)),
    africa: methods.filter(m => ['flutterwave', 'paystack'].includes(m.id)),
  }

  return (
    <div className="space-y-6">
      {/* International Cards */}
      {groupedMethods.international.length > 0 && (
        <div>
          <h3 className="text-gray-400 text-sm uppercase tracking-wide mb-3">Cartes & Paiement international</h3>
          <div className="grid grid-cols-2 gap-3">
            {groupedMethods.international.map((method) => (
              <button
                key={method.id}
                onClick={() => handleSelect(method.id)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  selected === method.id
                    ? 'border-ingco-yellow bg-ingco-yellow/10'
                    : 'border-ingco-gray hover:border-gray-500'
                }`}
              >
                <span className="text-2xl block mb-1">{method.icon}</span>
                <span className="text-white text-sm font-medium">{method.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Mobile Money */}
      {groupedMethods.mobileMoney.length > 0 && (
        <div>
          <h3 className="text-gray-400 text-sm uppercase tracking-wide mb-3">Mobile Money Africa</h3>
          <div className="grid grid-cols-3 gap-3">
            {groupedMethods.mobileMoney.map((method) => (
              <button
                key={method.id}
                onClick={() => handleSelect(method.id)}
                className={`p-3 rounded-xl border-2 transition-all ${
                  selected === method.id
                    ? 'border-ingco-yellow bg-ingco-yellow/10'
                    : 'border-ingco-gray hover:border-gray-500'
                }`}
              >
                <span className="text-2xl block mb-1">{method.icon}</span>
                <span className="text-white text-xs font-medium">{method.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Africa Payment Platforms */}
      {groupedMethods.africa.length > 0 && (
        <div>
          <h3 className="text-gray-400 text-sm uppercase tracking-wide mb-3">Plateformes paiement Afrique</h3>
          <div className="grid grid-cols-2 gap-3">
            {groupedMethods.africa.map((method) => (
              <button
                key={method.id}
                onClick={() => handleSelect(method.id)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  selected === method.id
                    ? 'border-ingco-yellow bg-ingco-yellow/10'
                    : 'border-ingco-gray hover:border-gray-500'
                }`}
              >
                <span className="text-2xl block mb-1">{method.icon}</span>
                <span className="text-white text-sm font-medium">{method.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Currency Display */}
      <div className="bg-ingco-dark rounded-xl p-4 flex justify-between items-center">
        <span className="text-gray-400">Devise detectede:</span>
        <span className="text-ingco-yellow font-bold">{currency}</span>
      </div>
    </div>
  )
}