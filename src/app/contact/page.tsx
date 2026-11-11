'use client'

import { useState } from 'react'
import { NavigationArrows, Icon } from '@/components/Icons'
import Reveal from '@/components/Reveal'
import Link from 'next/link'
import PageNavigation from '@/components/PageNavigation'
import { useTranslation } from '@/lib/i18n/LanguageProvider'

export default function Contact() {
  const { t } = useTranslation()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      if (response.ok) {
        setSubmitted(true)
      } else {
        const data = await response.json()
        setError(data.error || 'Erreur lors de l\'envoi du message')
      }
    } catch (err) {
      setError('Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-ingco-black">
      {/* Navigation */}

      <div className="pt-24 max-w-7xl mx-auto px-4">
        <PageNavigation />
      </div>

      {/* Hero Section */}
      <section className="pb-16 md:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="text-white">{t('contact.title')}</span>
            </h1>
            <p className="text-gray-400 text-lg">
              {t('contact.subtitle')}
            </p>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Informations de contact */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-8">{t('contact.details')}</h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-ingco-yellow/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon name="chat" className="w-5 h-5 text-ingco-yellow" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Email</h3>
                    <p className="text-gray-400">contact@eoutilles.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-ingco-yellow/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon name="phone" className="w-5 h-5 text-ingco-yellow" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">{t('contact.whatsapp')}</h3>
                    <p className="text-gray-400">+229 01 977 003 47</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-ingco-yellow/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon name="grid" className="w-5 h-5 text-ingco-yellow" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">{t('contact.zone')}</h3>
                    <p className="text-gray-400">Cotonou, Benin</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-ingco-yellow/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon name="info" className="w-5 h-5 text-ingco-yellow" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">{t('contact.hours')}</h3>
                    <p className="text-gray-400">Lun-Ven: 9h-18h (GMT)</p>
                  </div>
                </div>
              </div>

              {/* FAQ rapide */}
              <div className="mt-12 p-6 bg-ingco-dark rounded-2xl">
                <h3 className="text-white font-bold mb-4">{t('contact.faq')}</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-ingco-yellow font-semibold">{t('contact.faq.reseller')}</p>
                    <p className="text-gray-400">{t('contact.faq.resellerA')}</p>
                  </div>
                  <div>
                    <p className="text-ingco-yellow font-semibold">{t('contact.faq.delays')}</p>
                    <p className="text-gray-400">{t('contact.faq.delaysA')}</p>
                  </div>
                  <div>
                    <p className="text-ingco-yellow font-semibold">{t('contact.faq.margins')}</p>
                    <p className="text-gray-400">{t('contact.faq.marginsA')}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Formulaire de contact */}
            <div className="bg-ingco-dark rounded-3xl p-8">
              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Icon name="check" className="w-10 h-10 text-green-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-4">{t('contact.form.success')}</h2>
                  <p className="text-gray-400 mb-8">{t('contact.form.successText')}</p>
                  <button 
                    onClick={() => setSubmitted(false)}
                    className="text-ingco-yellow hover:underline"
                  >
                    {t('contact.form.another')}
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-white mb-8">{t('contact.form.title')}</h2>
                  
                  {error && (
                    <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-xl mb-6">
                      {error}
                    </div>
                  )}
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className="block text-gray-300 mb-2">{t('contact.form.name')}</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-ingco-black border border-ingco-gray rounded-xl px-4 py-3 text-white focus:border-ingco-yellow focus:outline-none"
                        placeholder={t('contact.form.namePh')}
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 mb-2">Email</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full bg-ingco-black border border-ingco-gray rounded-xl px-4 py-3 text-white focus:border-ingco-yellow focus:outline-none"
                        placeholder="votre@email.com"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 mb-2">{t('contact.form.subject')}</label>
                      <select
                        required
                        value={formData.subject}
                        onChange={(e) => setFormData({...formData, subject: e.target.value})}
                        className="w-full bg-ingco-black border border-ingco-gray rounded-xl px-4 py-3 text-white focus:border-ingco-yellow focus:outline-none"
                      >
                        <option value="">{t('contact.form.subjectPh')}</option>
                        <option value="partnership">{t('contact.subject.partnership')}</option>
                        <option value="order">{t('contact.subject.order')}</option>
                        <option value="product">{t('contact.subject.product')}</option>
                        <option value="payment">{t('contact.subject.payment')}</option>
                        <option value="other">{t('contact.subject.other')}</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-300 mb-2">{t('contact.form.message')}</label>
                      <textarea
                        required
                        rows={5}
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        className="w-full bg-ingco-black border border-ingco-gray rounded-xl px-4 py-3 text-white focus:border-ingco-yellow focus:outline-none resize-none"
                        placeholder={t('contact.form.messagePh')}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-ingco-yellow text-ingco-black py-4 rounded-xl font-bold hover:bg-yellow-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? t('contact.form.sending') : t('contact.form.send')}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <div className="max-w-7xl mx-auto px-4 pb-8">
        <NavigationArrows current="/contact" />
      </div>

    </div>
  )
}