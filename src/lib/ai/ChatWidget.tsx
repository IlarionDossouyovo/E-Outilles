'use client'

import { useState, useRef, useEffect } from "react"
import { ChatMessage, quickResponses, generateResponse } from "./chatbot"

export default function ChatWidget() {
  console.log('ChatWidget rendering...')
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "1", role: "assistant", content: "Bonjour! Je suis assistant E-Outilles. Comment puis-je vous aider?", timestamp: new Date() }
  ])
  const [input, setInput] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = () => {
    if (!input.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])

    setTimeout(() => {
      const response: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: generateResponse(input),
        timestamp: new Date()
      }
      setMessages(prev => [...prev, response])
    }, 500)

    setInput("")
  }

  const handleQuickResponse = (key: string) => {
    const response: ChatMessage = {
      id: Date.now().toString(),
      role: "assistant",
      content: quickResponses[key],
      timestamp: new Date()
    }
    setMessages(prev => [...prev, response])
  }

  return (
    <>
      {/* Debug: show button always */}
      <button
        onClick={() => {
          console.log('Chat button clicked!')
          const newState = !isOpen
          console.log('Setting isOpen to:', newState)
          setIsOpen(newState)
        }}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          backgroundColor: '#FFC400',
          border: '3px solid white',
          zIndex: 99999,
          fontSize: '28px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
        }}
        aria-label="Ouvrir le chat AI"
      >
        💬
      </button>

      {/* Always render panel, toggle visibility */}
      <div style={{
        position: 'fixed',
        bottom: '100px',
        right: '20px',
        width: '350px',
        height: '450px',
        backgroundColor: '#1a1a1a',
        borderRadius: '16px',
        border: '2px solid #FFC400',
        zIndex: 99998,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
        visibility: isOpen ? 'visible' : 'hidden',
        opacity: isOpen ? 1 : 0,
        transition: 'all 0.3s ease'
      }}>
          <div style={{padding: '16px', borderBottom: '1px solid #2E2E2E', backgroundColor: '#2E2E2E', borderRadius: '16px 16px 0 0'}}>
            <h3 style={{color: 'white', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px'}}>
              <span style={{width: '12px', height: '12px', backgroundColor: '#FFC400', borderRadius: '50%', animation: 'pulse 1s infinite'}}></span>
              Assistant E-Outilles
            </h3>
            <p style={{color: '#888', fontSize: '12px'}}>Réponse instantanée</p>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] p-3 rounded-xl ${msg.role === "user" ? "bg-ingco-yellow text-ingco-black" : "bg-ingco-gray text-white"}`}>
                  {msg.content}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="px-4 py-2 flex gap-2 flex-wrap border-t border-ingco-gray">
            {Object.keys(quickResponses).slice(0, 4).map((key) => (
              <button
                key={key}
                onClick={() => handleQuickResponse(key)}
                className="text-xs bg-ingco-gray px-3 py-1 rounded-full text-gray-400 hover:text-ingco-yellow hover:bg-ingco-gray/80 transition-colors"
              >
                {key}
              </button>
            ))}
          </div>

          <div className="p-4 border-t border-ingco-gray flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              placeholder="Tapez votre message..."
              className="flex-1 bg-ingco-gray border border-ingco-dark rounded-xl px-4 py-2 text-white placeholder-gray-500 focus:border-ingco-yellow focus:outline-none"
            />
            <button
              onClick={handleSend}
              className="bg-ingco-yellow text-ingco-black p-2 rounded-xl hover:bg-yellow-400 transition-colors"
            >
              <svg style={{width: '20px', height: '20px'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
