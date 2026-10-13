'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useVoice } from './useVoice'
import { useAttachments } from './useAttachments'
import { Icon } from '@/components/Icons'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  imageUrl?: string
  fileName?: string
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
  const [conversationId, setConversationId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { speak, stop, speaking, listen, stopListening, listening, supported } = useVoice()
  const { attachments, addFiles, remove, clear, error: attachError } = useAttachments()

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isOpen])

  const send = async (text: string) => {
    const clean = text.trim()
    if ((!clean && attachments.length === 0) || loading) return
    setInput('')
    setLoading(true)

    const history = messages.slice(-6).map((m) => ({ role: m.role, content: m.content }))
    const firstImage = attachments.find((a) => a.isImage)
    const media = attachments.map((a) => ({ mimeType: a.mimeType, data: a.data }))

    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), role: 'user', content: clean || 'Analyse ce document.', imageUrl: firstImage?.previewUrl, fileName: attachments[0]?.name },
    ])
    const sent = attachments
    clear()

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: clean, history, media, conversationId }),
      })
      const data = await res.json()
      const reply = data.error || data.response || "Désolé, je n'ai pas pu répondre."
      setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: reply }])
      if (data.conversationId) setConversationId(data.conversationId)
      if (voiceReplies && !data.error) speak(reply)
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 2).toString(), role: 'assistant', content: 'Désolé, une erreur est survenue.' },
      ])
    } finally {
      sent.forEach((a) => a.previewUrl && setTimeout(() => URL.revokeObjectURL(a.previewUrl), 1000))
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
    listen((transcript) => send(transcript))
  }

  const onPickFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) await addFiles(e.target.files)
    e.target.value = ''
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
        className={`fixed bottom-24 right-5 z-[99998] w-[360px] max-w-[calc(100vw-2.5rem)] h-[500px] max-h-[calc(100vh-8rem)] bg-ingco-dark rounded-2xl border-2 border-ingco-yellow shadow-2xl flex flex-col overflow-hidden transition-all duration-300 origin-bottom-right ${
          isOpen ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-90 pointer-events-none'
        }`}
      >
        <div className="px-4 py-3 bg-ingco-gray border-b border-ingco-dark flex items-center justify-between">
          <div>
            <h3 className="text-white font-bold flex items-center gap-2 text-sm">
              <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
              Assistant E-Outilles
            </h3>
            <p className="text-gray-400 text-[11px]">Voix & analyse photo · IA</p>
          </div>
          <div className="flex items-center gap-1">
            <Link href="/chat" title="Ouvrir en plein écran" className="text-gray-400 hover:text-ingco-yellow p-1">
              <Icon name="chat" className="w-4 h-4" />
            </Link>
            {supported.speak && (
              <button
                onClick={toggleVoiceReplies}
                title={voiceReplies ? 'Désactiver la voix' : 'Activer la voix'}
                className={`p-1 rounded-lg transition-colors ${
                  voiceReplies ? 'bg-ingco-yellow text-ingco-black' : 'bg-ingco-dark text-gray-400 hover:text-ingco-yellow'
                }`}
              >
                <Icon name={voiceReplies ? 'volume' : 'volume-off'} className="w-4 h-4" />
              </button>
            )}
          </div>
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
                {msg.imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={msg.imageUrl} alt={msg.fileName || 'pièce jointe'} className="rounded-lg mb-2 max-h-36 object-cover" />
                )}
                {msg.content}
                {msg.role === 'assistant' && supported.speak && (
                  <button onClick={() => speak(msg.content)} title="Écouter" className="mt-2 block text-ingco-yellow/80 hover:text-ingco-yellow">
                    <Icon name="volume" className="w-4 h-4" />
                  </button>
                )}
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

        {attachError && <p className="px-3 text-[11px] text-red-400">{attachError}</p>}

        {attachments.length > 0 && (
          <div className="px-3 pt-2 flex flex-wrap gap-2">
            {attachments.map((a) => (
              <div key={a.id} className="relative bg-ingco-gray rounded-lg p-1 pr-6 flex items-center gap-1 max-w-[160px]">
                {a.isImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={a.previewUrl} alt={a.name} className="w-8 h-8 rounded object-cover" />
                ) : (
                  <Icon name="paperclip" className="w-5 h-5 text-ingco-yellow" />
                )}
                <span className="text-[10px] truncate">{a.name}</span>
                <button onClick={() => remove(a.id)} className="absolute top-0.5 right-0.5 text-gray-400 hover:text-red-400" aria-label="Retirer">
                  <Icon name="x" className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

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
          <input ref={fileInputRef} type="file" accept="image/*,application/pdf" multiple className="hidden" onChange={onPickFiles} />
          <button
            onClick={() => fileInputRef.current?.click()}
            title="Joindre une photo ou un document"
            className="p-2 rounded-xl bg-ingco-gray text-gray-300 hover:text-ingco-yellow transition-colors"
          >
            <Icon name="paperclip" className="w-5 h-5" />
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send(input)}
            placeholder="Tapez votre message…"
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
              <Icon name="mic" className="w-5 h-5" />
            </button>
          )}
          <button
            onClick={() => send(input)}
            disabled={loading}
            className="bg-ingco-yellow text-ingco-black p-2 rounded-xl hover:bg-yellow-400 transition-colors disabled:opacity-50"
            aria-label="Envoyer"
          >
            <Icon name="send" className="w-5 h-5" />
          </button>
        </div>
      </div>
    </>
  )
}
