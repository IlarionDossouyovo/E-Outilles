'use client'

import { useEffect, useRef, useState } from 'react'
import { useVoice } from './useVoice'
import { Icon } from '@/components/Icons'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

const QUICK_PROMPTS = [
  { label: 'Livraison', text: 'Quels sont vos délais de livraison ?' },
  { label: 'Produits', text: 'Quels outils recommandez-vous pour percer du béton ?' },
  { label: 'Paiement', text: 'Quels moyens de paiement acceptez-vous ?' },
  { label: 'Garantie', text: 'Quelle est la garantie sur vos outils ?' },
]

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { id: 'init', role: 'assistant', content: "Bonjour ! Je suis l'assistant E-Outilles. Comment puis-je vous aider ?" },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [voiceReplies, setVoiceReplies] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { speak, stop, speaking, listen, stopListening, listening, supported } = useVoice()

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isOpen])

  const send = async (text: string) => {
    const clean = text.trim()
    if (!clean || loading) return
    setInput('')
    setLoading(true)

    const history = messages.slice(-6).map((m) => ({ role: m.role, content: m.content }))
    setMessages((prev) => [...prev, { id: Date.now().toString(), role: 'user', content: clean }])

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: clean, history }),
      })
      const data = await res.json()
      const reply = data.response || 'Désolé, je n\'ai pas pu répondre.'
      setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: reply }])
      if (voiceReplies) speak(reply)
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 2).toString(), role: 'assistant', content: 'Désolé, une erreur est survenue.' },
      ])
    } finally {
      setLoading(false)
    }
  }

  const toggleVoiceReplies = () => {
    if (voiceReplies) stop()
    setVoiceReplies((v) => !v)
  }

  const startListening = () => {
    if (listening) {
      stopListening()
      return
    }
    listen((transcript) => {
      setInput(transcript)
      send(transcript)
    })
  }

  return (
    <>
      <button
        onClick={() => setIsOpen((v) => !v)}
        aria-label="Ouvrir le chat IA"
        className="fixed bottom-5 right-5 z-[99999] w-16 h-16 rounded-full bg-ingco-yellow text-ingco-black text-3xl flex items-center justify-center border-[3px] border-white shadow-xl hover:scale-110 active:scale-95 transition-transform animate-float"
      >
        {isOpen ? 'Fermer' : 'Chat'}
      </button>

      <div
        className={`fixed bottom-24 right-5 z-[99998] w-[350px] max-w-[calc(100vw-2.5rem)] h-[480px] max-h-[calc(100vh-8rem)] bg-ingco-dark rounded-2xl border-2 border-ingco-yellow shadow-2xl flex flex-col overflow-hidden transition-all duration-300 origin-bottom-right ${
          isOpen ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-90 pointer-events-none'
        }`}
      >
        <div className="px-4 py-3 bg-ingco-gray border-b border-ingco-dark flex items-center justify-between">
          <div>
            <h3 className="text-white font-bold flex items-center gap-2 text-sm">
              <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
              Assistant E-Outilles
            </h3>
            <p className="text-gray-400 text-[11px]">Réponse instantanée · IA</p>
          </div>
          {supported.speak && (
            <button
              onClick={toggleVoiceReplies}
              title={voiceReplies ? 'Désactiver la voix' : 'Activer la voix'}
              className={`text-lg px-2 py-1 rounded-lg transition-colors ${
                voiceReplies ? 'bg-ingco-yellow text-ingco-black' : 'bg-ingco-dark text-gray-400 hover:text-ingco-yellow'
              }`}
            >
              {speaking ? 'Voix active' : voiceReplies ? 'Voix' : 'Voix off'}
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed animate-fade-in ${
                  msg.role === 'user'
                    ? 'bg-ingco-yellow text-ingco-black rounded-br-sm'
                    : 'bg-ingco-gray text-white rounded-bl-sm'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-ingco-gray text-gray-300 p-3 rounded-2xl text-sm flex gap-1">
                <span className="animate-bounce">●</span>
                <span className="animate-bounce [animation-delay:0.15s]">●</span>
                <span className="animate-bounce [animation-delay:0.3s]">●</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="px-3 py-2 flex gap-2 flex-wrap border-t border-ingco-dark">
          {QUICK_PROMPTS.map((q) => (
            <button
              key={q.label}
              onClick={() => send(q.text)}
              className="text-[11px] bg-ingco-gray px-3 py-1 rounded-full text-gray-300 hover:text-ingco-yellow hover:bg-ingco-gray/80 transition-colors"
            >
              {q.label}
            </button>
          ))}
        </div>

        <div className="p-3 border-t border-ingco-dark flex gap-2 items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send(input)}
            placeholder="Tapez votre message..."
            className="flex-1 bg-ingco-gray border border-ingco-dark rounded-xl px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-ingco-yellow focus:outline-none"
          />
          {supported.listen && (
            <button
              onClick={startListening}
              title="Dicter un message"
              className={`p-2 rounded-xl transition-colors ${
                listening ? 'bg-red-500 text-white animate-pulse' : 'bg-ingco-gray text-gray-300 hover:text-ingco-yellow'
              }`}
            >
              <Icon name="phone" className="w-5 h-5" />
            </button>
          )}
          <button
            onClick={() => send(input)}
            disabled={loading}
            className="bg-ingco-yellow text-ingco-black p-2 rounded-xl hover:bg-yellow-400 transition-colors disabled:opacity-50"
            aria-label="Envoyer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </>
  )
}
