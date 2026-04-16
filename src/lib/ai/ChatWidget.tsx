'use client'

import { useState, useRef, useEffect } from "react"
import { ChatMessage, quickResponses, generateResponse } from "./chatbot"

export default function ChatWidget() {
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
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-ingco-yellow rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-50"
      >
        {isOpen ? (
          <svg className="w-8 h-8 text-ingco-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-8 h-8 text-ingco-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 max-w-[90vw] h-[500px] bg-ingco-dark rounded-2xl shadow-2xl border border-ingco-gray z-50 flex flex-col">
          <div className="p-4 border-b border-ingco-gray bg-ingco-gray rounded-t-2xl">
            <h3 className="text-white font-bold flex items-center gap-2">
              <span className="w-3 h-3 bg-ingco-yellow rounded-full animate-pulse"></span>
              Assistant E-Outilles
            </h3>
            <p className="text-gray-500 text-xs">Reponse instantanee</p>
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
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  )
}
