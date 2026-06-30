import { NextRequest, NextResponse } from 'next/server'

const OLLAMA_URL = process.env.OLLAMA_API_URL || 'http://localhost:11434'
const CHAT_MODEL = process.env.OLLAMA_CHAT_MODEL || 'llama3.2:latest'

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    if (!message) {
      return NextResponse.json({ error: 'Message requis' }, { status: 400 })
    }

    const systemPrompt = `Tu es E-Outille Assistant, un assistant virtuel pour E-Outilles By ELECTRON, une boutique en ligne d'outils professionnels et équipements industriels. 

Tes tâches:
- Aider les clients à trouver les produits adaptés à leurs besoins
- Expliquer les caractéristiques techniques des outils
- Informer sur les prix, la disponibilité et les délais de livraison
- Conseiller sur le choix entre différents outils
- Répondre aux questions sur la garantie et le SAV

Tu dois être concis, précis et professionnel. Réponds en français.`

    const response = await fetch(`${OLLAMA_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: CHAT_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        stream: false
      })
    })

    if (!response.ok) {
      throw new Error('Ollama non disponible')
    }

    const data = await response.json()
    
    return NextResponse.json({ 
      response: data.message?.content || 'Désolé, je n\'ai pas pu générer de réponse.' 
    })

  } catch (error) {
    console.error('Chat error:', error)
    return NextResponse.json(
      { response: 'Désolé, le service IA est temporairement indisponible. Veuillez réessayer plus tard.' },
      { status: 500 }
    )
  }
}