'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import Logo from '@/components/Logo'
import { Icon } from '@/components/Icons'
import { FOUNDER } from '@/lib/founder'

const founder = FOUNDER

// Agents IA — source unique de vérité partagée avec l'API (/api/chat).
import { AGENT_LIST } from '@/lib/ai/agents'

const allAgents = AGENT_LIST.map((a, index) => ({
  id: index + 1,
  agentId: a.id,
  name: a.name,
  status: a.status,
  type: a.category,
  icon: a.icon,
  conversations: 0,
  category: a.category,
  department: a.department,
  description: a.description,
  features: a.features,
  color: a.color,
}))

const TONES = ['chaleureux', 'expert', 'empathique', 'direct', 'institutionnel'] as const
const CAPS = ['text', 'vision', 'voice', 'reasoning', 'tools'] as const

type AgentConfigView = {
  systemPrompt: string
  defaultSystemPrompt: string
  tone: string
  status: 'online' | 'offline'
  capabilities: string[]
  customized: boolean
}

export default function AgentDashboard() {
  const [accessGranted, setAccessGranted] = useState(false)
  const [accessError, setAccessError] = useState('')
  const [configAgent, setConfigAgent] = useState<typeof allAgents[number] | null>(null)
  const [configs, setConfigs] = useState<Record<string, AgentConfigView>>({})
  const [draft, setDraft] = useState<AgentConfigView | null>(null)
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')
  const [stats, setStats] = useState({
    totalConversations: 0,
    conversationsLast7d: 0,
    totalMessages: 0,
    messagesLast7d: 0,
    byAgent: {} as Record<string, number>,
  })

  // Access is validated server-side from the signed-in founder session: no
  // shared code is required. A founder is unlocked automatically; anyone else
  // is rejected by /api/agent/verify (403).
  useEffect(() => {
    if (sessionStorage.getItem('agent_access') === 'granted') {
      setAccessGranted(true)
      return
    }
    fetch('/api/agent/verify', { method: 'POST' })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}))
        if (res.ok && data.valid) {
          sessionStorage.setItem('agent_access', 'granted')
          setAccessGranted(true)
        } else {
          setAccessError(data.error || "Accès réservé au fondateur de l'entreprise")
        }
      })
      .catch(() => setAccessError('Erreur de connexion au serveur'))
  }, [])

  // Live agent counters derived from the real AiConversation / AiMessage rows.
  useEffect(() => {
    if (!accessGranted) return
    fetch('/api/agents/stats')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!data) return
        setStats({
          totalConversations: data.totalConversations ?? 0,
          conversationsLast7d: data.conversationsLast7d ?? 0,
          totalMessages: data.totalMessages ?? 0,
          messagesLast7d: data.messagesLast7d ?? 0,
          byAgent: data.byAgent ?? {},
        })
      })
      .catch((err) => console.error('Error fetching agent stats:', err))
  }, [accessGranted])

  // Load the founder's per-agent overrides once access is granted.
  useEffect(() => {
    if (!accessGranted) return
    fetch('/api/agents/config')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!data?.agents) return
        const map: Record<string, AgentConfigView> = {}
        for (const a of data.agents) {
          map[a.id] = {
            systemPrompt: a.systemPrompt,
            defaultSystemPrompt: a.defaultSystemPrompt,
            tone: a.tone,
            status: a.status,
            capabilities: a.capabilities,
            customized: a.customized,
          }
        }
        setConfigs(map)
      })
      .catch(() => {})
  }, [accessGranted])

  // Agents with the live status and real conversation counts applied, so the
  // badges and counters reflect the actual configuration and usage.
  const liveAgents = useMemo(
    () =>
      allAgents.map((a) => ({
        ...a,
        status: configs[a.agentId]?.status ?? a.status,
        conversations: stats.byAgent[a.agentId] ?? 0,
      })),
    [configs, stats.byAgent]
  )
  const agents = liveAgents.filter((a) => a.category === 'principal')
  const extraAgents = liveAgents.filter((a) => a.category !== 'principal')

  const totalAgents = liveAgents.length
  const activeAgents = liveAgents.filter((a) => a.status === 'online').length
  const offlineAgents = totalAgents - activeAgents

  const openConfig = (agentId: string) => {
    const cfg = configs[agentId]
    if (!cfg) return
    setSaveMsg('')
    setDraft({ ...cfg, capabilities: [...cfg.capabilities] })
  }

  const saveConfig = async () => {
    if (!configAgent || !draft) return
    setSaving(true)
    setSaveMsg('')
    try {
      const res = await fetch('/api/agents/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: configAgent.agentId, config: draft }),
      })
      if (!res.ok) throw new Error()
      setConfigs((prev) => ({ ...prev, [configAgent.agentId]: { ...draft } }))
      setSaveMsg('Configuration enregistrée')
    } catch {
      setSaveMsg("Échec de l'enregistrement")
    } finally {
      setSaving(false)
    }
  }

  const resetConfig = async () => {
    if (!configAgent) return
    setSaving(true)
    try {
      const res = await fetch(`/api/agents/config?id=${configAgent.agentId}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      const cfg = configs[configAgent.agentId]
      setDraft({
        ...cfg,
        systemPrompt: cfg.defaultSystemPrompt,
        tone: 'chaleureux',
        status: 'online',
        capabilities: ['text', 'vision', 'voice', 'reasoning'],
        customized: false,
      })
      setSaveMsg('Réinitialisé au modèle par défaut')
    } catch {
      setSaveMsg('Échec de la réinitialisation')
    } finally {
      setSaving(false)
    }
  }

  // Page d'accès si pas autorisé
  if (!accessGranted) {
    return (
      <div className="min-h-screen bg-ingco-black flex items-center justify-center p-4">
        <div className="bg-ingco-gray rounded-2xl p-8 max-w-md w-full text-center">
          <Icon name="shield" className="w-12 h-12 text-ingco-yellow mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white">Accès Réservé</h1>
          <p className="text-gray-400 mt-2">
            Ce tableau de bord est strictement réservé au fondateur de l&apos;entreprise.
          </p>
          <p className="text-gray-500 text-sm mt-4">
            {accessError || 'Vérification de votre session en cours…'}
          </p>
          <div className="flex flex-col gap-2 mt-6">
            <Link href="/auth/login" className="w-full bg-ingco-yellow text-ingco-black py-3 rounded-xl font-bold hover:bg-yellow-400">
              Se connecter
            </Link>
            <Link href="/" className="block text-center text-gray-500 text-sm hover:text-ingco-yellow">
              <span className="inline-flex items-center gap-1"><Icon name="arrow-left" className="w-4 h-4" /> Retour à l&apos;accueil</span>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-ingco-black">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-ingco-black/95 backdrop-blur-md border-b border-ingco-gray">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Logo variant="horizontal" size={40} />
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-gray-300 hover:text-ingco-yellow">Accueil</Link>
            <Link href="/admin" className="text-gray-300 hover:text-ingco-yellow">Admin</Link>
            <Link href="/agent" className="text-ingco-yellow">Agents IA</Link>
            <Link href="/chat" className="text-gray-300 hover:text-ingco-yellow">Chat</Link>
          </div>
        </div>
      </nav>

      <div className="pt-24 pb-16 max-w-7xl mx-auto px-4">
        {/* Navigation Arrows */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/admin" className="flex items-center gap-2 text-gray-400 hover:text-ingco-yellow transition-colors bg-ingco-gray px-4 py-2 rounded-lg">
            <Icon name="arrow-left" className="w-4 h-4" /> Retour Admin
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/chat" className="bg-ingco-yellow text-ingco-black px-3 py-2 rounded-lg text-sm font-semibold hover:bg-yellow-400">Chat IA</Link>
            <span className="text-gray-600">|</span>
            <Link href="/admin" className="text-gray-400 hover:text-ingco-yellow text-sm">Dashboard</Link>
          </div>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white flex items-center gap-3"><Icon name="chat" className="w-8 h-8 text-ingco-yellow" /> Tableau de Bord Agents IA</h1>
          <p className="text-gray-400">Gestion des assistants virtuels et automatisations</p>
        </div>

        {/* Founder Section with Logo */}
        <div className="bg-gradient-to-r from-ingco-yellow via-amber-500 to-ingco-yellow rounded-2xl p-8 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2 animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-yellow-500/30 animate-pulse">
                <span className="text-6xl font-bold text-black">E</span>
              </div>
              <div className="absolute -bottom-2 -right-2 bg-ingco-black text-ingco-yellow text-xs px-2 py-1 rounded font-semibold">CEO</div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl font-bold text-white">{founder.name}</h2>
              <p className="text-black/80 font-semibold text-lg">{founder.role}</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-3">
                <a href={`mailto:${founder.email}`} className="flex items-center gap-2 text-black/70 hover:text-black transition-colors">
                  <Icon name="chat" className="w-4 h-4" /> {founder.email}
                </a>
                <a href={`tel:${founder.phone}`} className="flex items-center gap-2 text-black/70 hover:text-black transition-colors">
                  <Icon name="phone" className="w-4 h-4" /> {founder.phone}
                </a>
              </div>
            </div>
            <div className="text-center md:text-right">
              <p className="text-black/70 text-sm">Fondé en {founder.since}</p>
              <p className="text-white font-medium mt-2 max-w-xs">{founder.vision}</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-ingco-gray rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-400 text-sm">Total Agents</span>
              <span className="w-10 h-10 bg-ingco-yellow/20 rounded-xl flex items-center justify-center"><Icon name="chat" className="w-5 h-5 text-ingco-yellow" /></span>
            </div>
            <div className="text-3xl font-bold text-white">{totalAgents}</div>
            <div className="text-gray-500 text-sm mt-1">Configurés</div>
          </div>

          <div className="bg-ingco-gray rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-400 text-sm">Agents actifs</span>
              <span className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center"><Icon name="check" className="w-5 h-5 text-green-500" /></span>
            </div>
            <div className="text-3xl font-bold text-green-500">{activeAgents}/{totalAgents}</div>
            <div className="text-gray-500 text-sm mt-1">En ligne</div>
          </div>

          <div className="bg-ingco-gray rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-400 text-sm">Conversations</span>
              <span className="w-10 h-10 bg-ingco-yellow/20 rounded-xl flex items-center justify-center"><Icon name="chat" className="w-5 h-5 text-ingco-yellow" /></span>
            </div>
            <div className="text-3xl font-bold text-white">{stats.totalConversations}</div>
            <div className="text-gray-500 text-sm mt-1">
              {stats.conversationsLast7d} cette semaine · {stats.totalMessages} messages
            </div>
          </div>

          <div className="bg-ingco-gray rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-400 text-sm">Hors ligne</span>
              <span className="w-10 h-10 bg-gray-500/20 rounded-xl flex items-center justify-center"><Icon name="user" className="w-5 h-5 text-gray-400" /></span>
            </div>
            <div className="text-3xl font-bold text-gray-400">{offlineAgents}</div>
            <div className="text-gray-500 text-sm mt-1">À activer</div>
          </div>
        </div>

        {/* Agents List with Animation */}
        <div className="bg-ingco-gray rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><Icon name="chat" className="w-5 h-5 text-ingco-yellow" /> Agents IA Disponibles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {agents.map((agent, index) => (
              <div 
                key={agent.id} 
                className="bg-ingco-dark p-4 rounded-xl hover:scale-105 hover:shadow-xl hover:shadow-ingco-yellow/20 transition-all duration-300 cursor-pointer group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start gap-4">
                  <div className="group-hover:scale-110 transition-transform duration-300"><Icon name={agent.icon as never} className="w-8 h-8 text-ingco-yellow" /></div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-white font-semibold group-hover:text-ingco-yellow transition-colors">{agent.name}</h3>
                      <span className={`text-xs px-2 py-1 rounded ${agent.status === 'online' ? 'bg-green-500/20 text-green-500' : 'bg-gray-500/20 text-gray-500'}`}>
                        {agent.status === 'online' ? 'En ligne' : 'Hors ligne'}
                      </span>
                    </div>
                    <p className="text-ingco-yellow/80 text-sm font-medium mt-1">{agent.department}</p>
                    <p className="text-gray-500 text-sm mt-1">{agent.description}</p>
                    <ul className="text-gray-500 text-sm mt-2 space-y-0.5">
                      {agent.features.slice(0, 3).map((f: string, i: number) => (
                        <li key={i}>• {f}</li>
                      ))}
                    </ul>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-gray-400 text-sm">
                        {agent.status === 'online' ? 'Actif' : 'Inactif'} · {agent.conversations} conv.
                      </span>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => { setConfigAgent(agent); openConfig(agent.agentId) }}
                          className="text-gray-300 text-sm hover:text-ingco-yellow flex items-center gap-1"
                        >
                          <Icon name="settings" className="w-4 h-4" /> Config
                        </button>
                        <Link href={`/chat?agent=${agent.agentId}`} className="text-ingco-yellow text-sm hover:underline">
                          Tester <Icon name="arrow-right" className="w-4 h-4 inline" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Extra Agents - Management & Marketing */}
        <div className="bg-ingco-gray rounded-2xl p-6 mt-8">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><Icon name="settings" className="w-5 h-5 text-ingco-yellow" /> Agents Avancés (Management &amp; Marketing)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {extraAgents.map((agent, index) => (
              <div 
                key={agent.id} 
                className={`bg-gradient-to-r ${agent.color} p-4 rounded-xl hover:scale-105 hover:shadow-2xl transition-all duration-300 cursor-pointer group`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start gap-3">
                  <div className="group-hover:scale-110 transition-transform duration-300"><Icon name={agent.icon as never} className="w-6 h-6 text-white" /></div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-white font-semibold group-hover:text-white">{agent.name}</h3>
                      <span className={`text-xs px-2 py-1 rounded bg-white/20 ${agent.status === 'online' ? 'text-green-300' : 'text-gray-300'}`}>
                        {agent.status === 'online' ? 'En ligne' : 'Hors ligne'}
                      </span>
                    </div>
                    <p className="text-white/80 text-sm mt-1">{agent.description}</p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {agent.features.slice(0, 2).map((f, i) => (
                        <span key={i} className="text-xs bg-white/20 px-2 py-1 rounded text-white">{f}</span>
                      ))}
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-white/60 text-xs">{agent.conversations} conv.</span>
                      <button
                        onClick={() => { setConfigAgent(agent); openConfig(agent.agentId) }}
                        className="text-xs text-white underline"
                      >
                        Config <Icon name="arrow-right" className="w-4 h-4 inline" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions with Animation */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          <Link href="/chat" className="bg-ingco-gray rounded-xl p-4 hover:bg-gray-700 hover:scale-110 transition-all duration-300 block text-center">
            <Icon name="chat" className="w-6 h-6 text-ingco-yellow mx-auto mb-1" />
            <h3 className="text-white font-bold text-sm">Assistant</h3>
          </Link>

          <Link href="/admin" className="bg-ingco-gray rounded-xl p-4 hover:bg-gray-700 transition-colors block text-center">
            <Icon name="grid" className="w-6 h-6 text-ingco-yellow mx-auto mb-1" />
            <h3 className="text-white font-bold text-sm">Dashboard</h3>
          </Link>

          <Link href="/admin/orders" className="bg-ingco-gray rounded-xl p-4 hover:bg-gray-700 transition-colors block text-center">
            <Icon name="truck" className="w-6 h-6 text-ingco-yellow mx-auto mb-1" />
            <h3 className="text-white font-bold text-sm">Commandes</h3>
          </Link>

          <Link href="/" className="bg-ingco-gray rounded-xl p-4 hover:bg-gray-700 transition-colors block text-center">
            <Icon name="home" className="w-6 h-6 text-ingco-yellow mx-auto mb-1" />
            <h3 className="text-white font-bold text-sm">Accueil</h3>
          </Link>
        </div>
      </div>

      {configAgent && draft && (
        <div
          className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setConfigAgent(null)}
        >
          <div
            className="bg-ingco-gray rounded-2xl p-6 max-w-lg w-full max-h-[88vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <Icon name={configAgent.icon as never} className="w-8 h-8 text-ingco-yellow" />
                <div>
                  <h3 className="text-lg font-bold text-white">{configAgent.name}</h3>
                  <p className="text-gray-400 text-xs">{configAgent.description}</p>
                </div>
              </div>
              <button onClick={() => setConfigAgent(null)} className="text-gray-400 hover:text-white" aria-label="Fermer">
                <Icon name="x" className="w-5 h-5" />
              </button>
            </div>

            {/* Statut */}
            <div className="mb-4">
              <p className="text-ingco-yellow text-sm font-semibold mb-2">Statut</p>
              <div className="flex gap-2">
                {(['online', 'offline'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setDraft({ ...draft, status: st })}
                    className={`flex-1 py-2 rounded-lg text-sm font-semibold border transition-colors ${
                      draft.status === st
                        ? 'bg-ingco-yellow text-ingco-black border-ingco-yellow'
                        : 'bg-ingco-dark text-gray-300 border-ingco-gray hover:border-ingco-yellow'
                    }`}
                  >
                    {st === 'online' ? 'En ligne' : 'Hors ligne'}
                  </button>
                ))}
              </div>
            </div>

            {/* Ton */}
            <div className="mb-4">
              <p className="text-ingco-yellow text-sm font-semibold mb-2">Ton du raisonnement</p>
              <select
                value={draft.tone}
                onChange={(e) => setDraft({ ...draft, tone: e.target.value })}
                className="w-full bg-ingco-dark text-white px-3 py-2 rounded-lg border border-ingco-gray focus:border-ingco-yellow outline-none"
              >
                {TONES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            {/* Capacités */}
            <div className="mb-4">
              <p className="text-ingco-yellow text-sm font-semibold mb-2">Capacités</p>
              <div className="flex flex-wrap gap-2">
                {CAPS.map((c) => {
                  const on = draft.capabilities.includes(c)
                  return (
                    <button
                      key={c}
                      onClick={() =>
                        setDraft({
                          ...draft,
                          capabilities: on
                            ? draft.capabilities.filter((x) => x !== c)
                            : [...draft.capabilities, c],
                        })
                      }
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                        on
                          ? 'bg-ingco-yellow text-ingco-black border-ingco-yellow'
                          : 'bg-ingco-dark text-gray-400 border-ingco-gray hover:border-ingco-yellow'
                      }`}
                    >
                      {c}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Instructions / prompt système */}
            <div className="mb-2">
              <div className="flex items-center justify-between mb-2">
                <p className="text-ingco-yellow text-sm font-semibold">Instructions du système (prompt)</p>
                {configs[configAgent.agentId]?.customized && (
                  <span className="text-xs text-amber-400">Personnalisé</span>
                )}
              </div>
              <textarea
                value={draft.systemPrompt}
                onChange={(e) => setDraft({ ...draft, systemPrompt: e.target.value })}
                rows={10}
                spellCheck={false}
                className="w-full bg-ingco-dark text-gray-200 text-xs font-mono px-3 py-2 rounded-lg border border-ingco-gray focus:border-ingco-yellow outline-none resize-y"
              />
              <p className="text-gray-500 text-xs mt-1">
                Décrivez la mission, le périmètre et les règles de l&apos;agent. Les garde-fous
                (anti-hallucination, ton humain, langue du visiteur) restent appliqués automatiquement.
              </p>
            </div>

            {saveMsg && (
              <p className={`text-sm mb-3 ${saveMsg.includes('Échec') ? 'text-red-400' : 'text-green-400'}`}>
                {saveMsg}
              </p>
            )}

            <div className="flex flex-wrap gap-2 mt-4">
              <button
                onClick={saveConfig}
                disabled={saving}
                className="flex-1 bg-ingco-yellow text-ingco-black py-3 rounded-xl font-bold hover:bg-yellow-400 disabled:opacity-50"
              >
                {saving ? 'Enregistrement...' : 'Enregistrer'}
              </button>
              <button
                onClick={resetConfig}
                disabled={saving}
                className="px-4 py-3 rounded-xl font-semibold bg-ingco-dark text-gray-300 border border-ingco-gray hover:border-ingco-yellow disabled:opacity-50"
              >
                Réinitialiser
              </button>
              <Link
                href={`/chat?agent=${configAgent.agentId}`}
                className="px-4 py-3 rounded-xl font-semibold bg-ingco-dark text-ingco-yellow border border-ingco-gray hover:border-ingco-yellow"
              >
                Tester
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}