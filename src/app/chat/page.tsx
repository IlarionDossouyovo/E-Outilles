'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Logo from '@/components/Logo'
import { useVoice } from '@/lib/ai/useVoice'

interface Message {
  role: 'user' | 'assistant'
  content: string
  agentId?: string
}

const AGENT_OPTIONS = [
  { id: 'assistant', name: 'Assistant IA', icon: '🤖', desc: 'Généraliste' },
  { id: 'sales', name: 'Vendeur Bot', icon: '💼', desc: 'Vente & conseils' },
  { id: 'support', name: 'Support Client', icon: '🎧', desc: 'SAV & retours' },
  { id: 'tracking', name: 'Suivi Commande', icon: '📦', desc: 'Livraison' },
  { id: 'marketing', name: 'Marketing Bot', icon: '📢', desc: 'Contenus' },
  { id: 'analytics', name: 'Analyste Data', icon: '📊', desc: 'Chiffres' },
]

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Bonjour ! Je suis l'assistant E-Outille By ELECTRON. Comment puis-je vous aider ?", agentId: 'assistant' },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [agentId, setAgentId] = useState('assistant')
  const [voiceReplies, setVoiceReplies] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { speak, stop, speaking, listen, stopListening, listening, supported } = useVoice()

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get('agent')
    if (requested && AGENT_OPTIONS.some((a) => a.id === requested)) {
      setAgentId(requested)
    }
  }, [])

  const sendMessage = async (text?: string) => {
    const clean = (text ?? input).trim()
    if (!clean || loading) return

    setInput('')
    setLoading(true)
    const history = messages.slice(-6).map((m) => ({ role: m.role, content: m.content }))
    setMessages((prev) => [...prev, { role: 'user', content: clean }])

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: clean, history, agentId }),
      })
      const data = await res.json()
      const reply = data.response || "Désolé, je n'ai pas pu répondre."
      setMessages((prev) => [...prev, { role: 'assistant', content: reply, agentId: data.agentId }])
      if (voiceReplies) speak(reply)
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Désolé, une erreur est survenue.' }])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const toggleVoice = () => {
    if (voiceReplies) stop()
    setVoiceReplies((v) => !v)
  }

  const startListening = () => {
    if (listening) {
      stopListening()
      return
    }
    listen((transcript) => sendMessage(transcript))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-ingco-black via-[#171717] to-ingco-black text-white p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between py-6 border-b border-ingco-gray mb-6">
          <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-ingco-yellow transition-colors">
            <span>←</span> Retour
          </Link>
          <div className="flex items-center gap-2">
            <Logo variant="horizontal" size={36} />
          </div>
          {supported.speak ? (
            <button
              onClick={toggleVoice}
              className={`flex items-center gap-1 text-sm px-3 py-2 rounded-lg transition-colors ${
                voiceReplies ? 'bg-ingco-yellow text-ingco-black font-bold' : 'bg-ingco-gray text-gray-300 hover:text-ingco-yellow'
              }`}
            >
              {speaking ? '🔊 Voix active' : voiceReplies ? '🔈 Voix' : '🔇 Voix'}
            </button>
          ) : <span className="w-16" />}
        </div>

        {/* Agent selector */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-4">
          {AGENT_OPTIONS.map((a) => (
            <button
              key={a.id}
              onClick={() => setAgentId(a.id)}
              className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all ${
                agentId === a.id
                  ? 'bg-ingco-yellow text-ingco-black font-bold scale-105'
                  : 'bg-ingco-gray text-gray-300 hover:bg-gray-700'
              }`}
            >
              <span className="text-lg">{a.icon}</span>
              <span className="whitespace-nowrap">{a.name}</span>
            </button>
          ))}
        </div>

        <div className="bg-ingco-gray/40 rounded-2xl p-4 mb-4 h-[58vh] overflow-y-auto space-y-4 border border-ingco-dark">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[82%] p-4 rounded-2xl animate-fade-in ${
                msg.role === 'user' ? 'bg-ingco-yellow text-ingco-black rounded-br-sm' : 'bg-ingco-gray text-white rounded-bl-sm'
              }`}>
                <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-ingco-gray p-4 rounded-2xl">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-ingco-yellow rounded-full animate-bounce" />
                  <span className="w-2 h-2 bg-ingco-yellow rounded-full animate-bounce [animation-delay:0.15s]" />
                  <span className="w-2 h-2 bg-ingco-yellow rounded-full animate-bounce [animation-delay:0.3s]" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="flex gap-2 items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Posez votre question..."
            className="flex-1 bg-ingco-gray border border-ingco-dark rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-ingco-yellow"
            disabled={loading}
          />
          {supported.listen && (
            <button
              onClick={startListening}
              title="Dicter"
              className={`p-3 rounded-xl transition-colors ${
                listening ? 'bg-red-500 text-white animate-pulse' : 'bg-ingco-gray text-gray-300 hover:text-ingco-yellow'
              }`}
            >
              🎤
            </button>
          )}
          <button
            onClick={() => sendMessage()}
            disabled={loading || !input.trim()}
            className="bg-ingco-yellow hover:bg-yellow-400 disabled:bg-ingco-gray disabled:text-gray-500 text-ingco-black font-bold px-6 py-3 rounded-xl transition-all"
          >
            ➤
          </button>
        </div>

        <div className="mt-4 flex flex-wrap gap-2 justify-center">
          {['Comment commander ?', 'Délais de livraison ?', 'Garantie ?', 'Contact'].map((q) => (
            <button
              key={q}
              onClick={() => sendMessage(q)}
              className="bg-ingco-gray hover:bg-gray-700 px-3 py-1 rounded-full text-sm transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
