'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Logo from '@/components/Logo'
import { Icon, type IconName } from '@/components/Icons'
import { useVoice } from '@/lib/ai/useVoice'
import { useAttachments } from '@/lib/ai/useAttachments'

interface Message {
  role: 'user' | 'assistant'
  content: string
  agentId?: string
  imageUrl?: string
  fileName?: string
}

interface ConversationSummary {
  id: string
  agentId: string
  title: string
  updatedAt: string
  messageCount: number
}

interface AgentOption {
  id: string
  name: string
  icon: string
  description: string
  capabilities: string[]
}

const FALLBACK_AGENTS: AgentOption[] = [
  { id: 'assistant', name: 'Assistant IA', icon: 'chat', description: 'Généraliste', capabilities: ['text', 'vision', 'voice'] },
  { id: 'sales', name: 'Vendeur Bot', icon: 'card', description: 'Vente & conseils', capabilities: ['text', 'voice'] },
  { id: 'support', name: 'Support Client', icon: 'phone', description: 'SAV & retours', capabilities: ['text', 'vision', 'voice'] },
  { id: 'tracking', name: 'Suivi Commande', icon: 'truck', description: 'Livraison', capabilities: ['text', 'voice'] },
  { id: 'catalog', name: 'Expert Catalogue', icon: 'tools', description: 'Fiches & compatibilité', capabilities: ['text', 'vision'] },
]

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Bonjour ! Je suis l'assistant E-Outille By ELECTRON. Comment puis-je vous aider ?", agentId: 'assistant' },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [agentId, setAgentId] = useState('assistant')
  const [agents, setAgents] = useState<AgentOption[]>(FALLBACK_AGENTS)
  const [isFounder, setIsFounder] = useState(false)
  const [voiceReplies, setVoiceReplies] = useState(false)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [conversations, setConversations] = useState<ConversationSummary[]>([])
  const [historyOpen, setHistoryOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const { speak, stop, speaking, listen, startHandsFree, stopListening, listening, handsFree, supported } = useVoice()
  const { attachments, addFiles, remove, clear, error: attachError, setError: setAttachError } = useAttachments()

  const activeAgent = agents.find((a) => a.id === agentId) || agents[0]
  const canUseVision = activeAgent?.capabilities.includes('vision')

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  // Load the agents allowed for this visitor (public vs founder-only).
  useEffect(() => {
    fetch('/api/ai/agents')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.agents?.length) {
          setAgents(data.agents)
          setIsFounder(Boolean(data.founder))
        }
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get('agent')
    if (requested) setAgentId(requested)
  }, [])

  const loadConversations = useCallback(() => {
    fetch('/api/conversations')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => data?.conversations && setConversations(data.conversations))
      .catch(() => {})
  }, [])

  // Restore the most recent conversation on first load.
  useEffect(() => {
    loadConversations()
    fetch('/api/conversations')
      .then((res) => (res.ok ? res.json() : null))
      .then(async (data) => {
        const latest = data?.conversations?.[0]
        if (!latest) return
        const detail = await fetch(`/api/conversations/${latest.id}`).then((r) => (r.ok ? r.json() : null))
        if (!detail?.messages?.length) return
        setConversationId(detail.id)
        setAgentId(detail.agentId)
        setMessages(
          detail.messages.map((m: { role: 'user' | 'assistant'; content: string; agentId?: string; attachmentName?: string | null }) => ({
            role: m.role,
            content: m.content,
            agentId: m.agentId,
            fileName: m.attachmentName || undefined,
          }))
        )
      })
      .catch(() => {})
  }, [loadConversations])

  const openConversation = useCallback(async (id: string) => {
    const detail = await fetch(`/api/conversations/${id}`).then((r) => (r.ok ? r.json() : null))
    if (!detail) return
    setConversationId(detail.id)
    setAgentId(detail.agentId)
    setMessages(
      detail.messages.map((m: { role: 'user' | 'assistant'; content: string; agentId?: string; attachmentName?: string | null }) => ({
        role: m.role,
        content: m.content,
        agentId: m.agentId,
        fileName: m.attachmentName || undefined,
      }))
    )
    setHistoryOpen(false)
  }, [])

  const newConversation = useCallback(() => {
    setConversationId(null)
    setMessages([
      { role: 'assistant', content: "Bonjour ! Je suis l'assistant E-Outille By ELECTRON. Comment puis-je vous aider ?", agentId: 'assistant' },
    ])
    setHistoryOpen(false)
  }, [])

  const sendMessage = useCallback(
    async (text?: string) => {
      const clean = (text ?? input).trim()
      if ((!clean && attachments.length === 0) || loading) return

      setInput('')
      setLoading(true)
      const history = messages.slice(-6).map((m) => ({ role: m.role, content: m.content }))
      const firstImage = attachments.find((a) => a.isImage)
      const media = attachments.map((a) => ({ mimeType: a.mimeType, data: a.data }))

      setMessages((prev) => [
        ...prev,
        { role: 'user', content: clean || 'Analyse ce document.', imageUrl: firstImage?.previewUrl, fileName: attachments[0]?.name },
      ])
      const sent = attachments
      clear()

      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: clean,
            history,
            agentId,
            media,
            conversationId,
            attachmentName: attachments[0]?.name,
          }),
        })
        const data = await res.json()
        const reply = data.error || data.response || "Désolé, je n'ai pas pu répondre."
        setMessages((prev) => [...prev, { role: 'assistant', content: reply, agentId: data.agentId }])
        if (data.conversationId) {
          setConversationId(data.conversationId)
          loadConversations()
        }
        if (voiceReplies && !data.error) speak(reply)
      } catch {
        setMessages((prev) => [...prev, { role: 'assistant', content: 'Désolé, une erreur est survenue.' }])
      } finally {
        // Revoke preview URLs we created for this message.
        sent.forEach((a) => a.previewUrl && setTimeout(() => URL.revokeObjectURL(a.previewUrl), 1000))
        setLoading(false)
      }
    },
    [input, attachments, loading, messages, agentId, voiceReplies, speak, clear, conversationId, loadConversations]
  )

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

  const toggleHandsFree = () => {
    if (handsFree) {
      stopListening()
      return
    }
    startHandsFree((transcript) => sendMessage(transcript))
  }

  const onPickFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) await addFiles(e.target.files)
    e.target.value = ''
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-ingco-black via-[#171717] to-ingco-black text-white p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between py-6 border-b border-ingco-gray mb-6">
          <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-ingco-yellow transition-colors">
            <Icon name="arrow-left" className="w-4 h-4" /> Retour
          </Link>
          <div className="flex items-center gap-2">
            <Logo variant="horizontal" size={36} />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setHistoryOpen((v) => !v)}
              title="Historique des conversations"
              className="flex items-center gap-1 text-sm px-3 py-2 rounded-lg bg-ingco-gray text-gray-300 hover:text-ingco-yellow transition-colors"
            >
              <Icon name="blog" className="w-4 h-4" />
              Historique{conversations.length > 0 ? ` (${conversations.length})` : ''}
            </button>
            <button
              onClick={newConversation}
              title="Nouvelle conversation"
              className="flex items-center gap-1 text-sm px-3 py-2 rounded-lg bg-ingco-gray text-gray-300 hover:text-ingco-yellow transition-colors"
            >
              <Icon name="chat" className="w-4 h-4" />
              Nouveau
            </button>
            {supported.speak && (
              <button
                onClick={toggleVoice}
                title={voiceReplies ? 'Désactiver la voix' : 'Activer la voix'}
                className={`flex items-center gap-1 text-sm px-3 py-2 rounded-lg transition-colors ${
                  voiceReplies ? 'bg-ingco-yellow text-ingco-black font-bold' : 'bg-ingco-gray text-gray-300 hover:text-ingco-yellow'
                }`}
              >
                <Icon name={voiceReplies ? 'volume' : 'volume-off'} className="w-4 h-4" />
                {speaking ? 'Parle…' : voiceReplies ? 'Voix ON' : 'Voix OFF'}
              </button>
            )}
          </div>
        </div>

        {historyOpen && (
          <div className="mb-4 bg-ingco-gray/60 border border-ingco-dark rounded-2xl p-3 max-h-60 overflow-y-auto">
            {conversations.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-3">Aucune conversation enregistrée pour l&apos;instant.</p>
            ) : (
              <ul className="space-y-1">
                {conversations.map((c) => (
                  <li key={c.id}>
                    <button
                      onClick={() => openConversation(c.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between gap-2 ${
                        c.id === conversationId ? 'bg-ingco-yellow text-ingco-black font-semibold' : 'text-gray-200 hover:bg-gray-700'
                      }`}
                    >
                      <span className="truncate">{c.title}</span>
                      <span className={`text-xs shrink-0 ${c.id === conversationId ? 'text-ingco-black/70' : 'text-gray-500'}`}>
                        {c.messageCount} msg
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {isFounder && (
          <div className="mb-4 text-xs text-purple-300 bg-purple-500/10 border border-purple-500/30 rounded-xl px-4 py-2">
            Accès fondateur : les {agents.length} agents internes de l&apos;entreprise sont disponibles.
          </div>
        )}

        {/* Agent selector */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-4">
          {agents.map((a) => (
            <button
              key={a.id}
              onClick={() => setAgentId(a.id)}
              title={a.description}
              className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all ${
                agentId === a.id
                  ? 'bg-ingco-yellow text-ingco-black font-bold scale-105'
                  : 'bg-ingco-gray text-gray-300 hover:bg-gray-700'
              }`}
            >
              <Icon name={a.icon as IconName} className="w-5 h-5" />
              <span className="whitespace-nowrap">{a.name}</span>
              {a.capabilities.includes('vision') && <Icon name="camera" className="w-4 h-4 opacity-70" />}
            </button>
          ))}
        </div>

        <div className="bg-ingco-gray/40 rounded-2xl p-4 mb-4 h-[54vh] overflow-y-auto space-y-4 border border-ingco-dark">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[82%] p-4 rounded-2xl animate-fade-in ${
                msg.role === 'user' ? 'bg-ingco-yellow text-ingco-black rounded-br-sm' : 'bg-ingco-gray text-white rounded-bl-sm'
              }`}>
                {msg.imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={msg.imageUrl} alt={msg.fileName || 'pièce jointe'} className="rounded-lg mb-2 max-h-48 object-cover" />
                )}
                {!msg.imageUrl && msg.fileName && (
                  <p className="text-xs mb-2 inline-flex items-center gap-1"><Icon name="paperclip" className="w-3 h-3" /> {msg.fileName}</p>
                )}
                <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
                {msg.role === 'assistant' && supported.speak && (
                  <button
                    onClick={() => speak(msg.content)}
                    title="Écouter"
                    className="mt-2 text-ingco-yellow/80 hover:text-ingco-yellow"
                  >
                    <Icon name="volume" className="w-4 h-4" />
                  </button>
                )}
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

        {attachError && (
          <div className="mb-2 text-xs text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
            {attachError}
            <button onClick={() => setAttachError('')} className="ml-2 underline">fermer</button>
          </div>
        )}

        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {attachments.map((a) => (
              <div key={a.id} className="relative bg-ingco-gray rounded-lg p-2 pr-8 flex items-center gap-2 max-w-[220px]">
                {a.isImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={a.previewUrl} alt={a.name} className="w-10 h-10 rounded object-cover" />
                ) : (
                  <Icon name="paperclip" className="w-6 h-6 text-ingco-yellow" />
                )}
                <span className="text-xs truncate">{a.name}</span>
                <button
                  onClick={() => remove(a.id)}
                  className="absolute top-1 right-1 text-gray-400 hover:text-red-400"
                  aria-label="Retirer"
                >
                  <Icon name="x" className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2 items-center">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,application/pdf"
            multiple
            className="hidden"
            onChange={onPickFiles}
          />
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={onPickFiles}
          />
          {canUseVision && (
            <>
              <button
                onClick={() => fileInputRef.current?.click()}
                title="Joindre une photo ou un document"
                className="p-3 rounded-xl bg-ingco-gray text-gray-300 hover:text-ingco-yellow transition-colors"
              >
                <Icon name="paperclip" className="w-5 h-5" />
              </button>
              <button
                onClick={() => cameraInputRef.current?.click()}
                title="Prendre une photo"
                className="p-3 rounded-xl bg-ingco-gray text-gray-300 hover:text-ingco-yellow transition-colors"
              >
                <Icon name="camera" className="w-5 h-5" />
              </button>
            </>
          )}
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={canUseVision ? 'Posez votre question ou envoyez une photo…' : 'Posez votre question…'}
            className="flex-1 bg-ingco-gray border border-ingco-dark rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-ingco-yellow"
            disabled={loading}
          />
          {supported.listen && (
            <>
              <button
                onClick={startListening}
                title="Dicter (une phrase)"
                className={`p-3 rounded-xl transition-colors ${
                  listening && !handsFree ? 'bg-red-500 text-white animate-pulse' : 'bg-ingco-gray text-gray-300 hover:text-ingco-yellow'
                }`}
              >
                <Icon name="mic" className="w-5 h-5" />
              </button>
              <button
                onClick={toggleHandsFree}
                title="Mode mains libres (conversation continue)"
                className={`p-3 rounded-xl transition-colors ${
                  handsFree ? 'bg-green-500 text-white animate-pulse' : 'bg-ingco-gray text-gray-300 hover:text-ingco-yellow'
                }`}
              >
                <Icon name="chat" className="w-5 h-5" />
              </button>
            </>
          )}
          <button
            onClick={() => sendMessage()}
            disabled={loading || (!input.trim() && attachments.length === 0)}
            className="bg-ingco-yellow hover:bg-yellow-400 disabled:bg-ingco-gray disabled:text-gray-500 text-ingco-black font-bold px-6 py-3 rounded-xl transition-all"
            aria-label="Envoyer"
          >
            <Icon name="send" className="w-5 h-5" />
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
