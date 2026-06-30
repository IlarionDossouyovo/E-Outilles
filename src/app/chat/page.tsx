'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Bonjour! Je suis l\'assistant E-Outille By ELECTRON. Comment puis-je vous aider?' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || loading) return

    const userMessage = input.trim()
    setInput('')
    setLoading(true)

    setMessages(prev => [...prev, { role: 'user', content: userMessage }])

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage })
      })

      const data = await response.json()
      
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }])
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Désolé, une erreur est survenue.' }])
    }

    setLoading(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-4">
      <div className="max-w-3xl mx-auto">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between py-6 border-b border-gray-700 mb-6">
          <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-yellow-400 transition-colors">
            <span>←</span> Retour
          </Link>
          <h1 className="text-2xl font-bold text-yellow-400">🤖 Assistant</h1>
          <div className="w-16"></div>
        </div>

        {/* Messages */}
        <div className="bg-gray-800/50 rounded-xl p-4 mb-4 h-[60vh] overflow-y-auto space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-4 rounded-lg ${
                msg.role === 'user' 
                  ? 'bg-yellow-500 text-black' 
                  : 'bg-gray-700 text-white'
              }`}>
                <p className="whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-700 p-4 rounded-lg">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                  <span className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Posez votre question..."
            className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-yellow-500"
            disabled={loading}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="bg-yellow-500 hover:bg-yellow-400 disabled:bg-gray-600 text-black font-bold px-6 py-3 rounded-lg transition-colors"
          >
            ➤
          </button>
        </div>

        {/* Quick Actions */}
        <div className="mt-4 flex flex-wrap gap-2 justify-center">
          {['Comment commander?', 'Livraison?', 'Garantie?', 'Contact'].map((q) => (
            <button
              key={q}
              onClick={() => { setInput(q); setTimeout(sendMessage, 100) }}
              className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded-full text-sm"
            >
              {q}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}