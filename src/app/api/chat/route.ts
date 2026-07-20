import { NextRequest, NextResponse } from 'next/server'

const OLLAMA_URL = process.env.OLLAMA_API_URL || 'http://localhost:11434'
const CHAT_MODEL = process.env.OLLAMA_CHAT_MODEL || 'llama3.2:latest'

// Demo responses for when AI is not available
const demoResponses: Record<string, string> = {
  'default': "Bonjour ! Je suis l'assistant E-Outilles. Je peux vous aider à trouver les outils professionnels qu'il vous faut. N'hésitez pas à me poser vos questions sur nos produits, prix ou livraison !",
  'perceuse': 'Nous avons plusieurs perceuses professionnelles. La Perceuse visseuse INGCO 20V à 89.99€ est notre bestseller ! Elle est puissante, endurante et parfaite pour les travaux courants.',
  'marteau': 'Notre marteau perforateur SDS Max 18V à 289.99€ est idéal pour les travaux de perforation dans le béton. Il est équipé d\'un moteur brushless performant !',
  'prix': 'Nos prix sont compétitifs et incluent la livraison au Benin ! Pour les gros achats, nous proposons des remises spéciales. Contactez-nous pour un devis personnalisé.',
  'livraison': 'Nous livrons dans tout le Benin ! Livraison gratuite à Cotonou, 48h dans les grandes villes. Suivi de commande en temps réel par WhatsApp.',
  'garantie': 'Tous nos outils sont garantis 1 an minimum. Nous assurons également le SAV et la pièce de rechange pour toutes nos marques.',
  'contact': 'Vous pouvez nous contacter par WhatsApp au +229 01 977 003 47 ou par email à contact@e-outilles.com',
  'default_fr': "Bonjour ! Je suis l'assistant E-Outilles. Je peux vous aider à trouver les outils professionnels qu'il vous faut. N'hésitez pas à me poser vos questions sur nos produits, prix ou livraison !"
}

function getDemoResponse(message: string): string {
  const lowerMessage = message.toLowerCase()
  
  if (lowerMessage.includes('perceuse') || lowerMessage.includes('perforateur')) {
    return demoResponses.perceuse
  }
  if (lowerMessage.includes('marteau')) {
    return demoResponses.marteau
  }
  if (lowerMessage.includes('prix') || lowerMessage.includes('tarif') || lowerMessage.includes('cout')) {
    return demoResponses.prix
  }
  if (lowerMessage.includes('livraison') || lowerMessage.includes('livrer')) {
    return demoResponses.livraison
  }
  if (lowerMessage.includes('garantie') || lowerMessage.includes('sav')) {
    return demoResponses.garantie
  }
  if (lowerMessage.includes('contact') || lowerMessage.includes('whatsapp') || lowerMessage.includes('email')) {
    return demoResponses.contact
  }
  if (lowerMessage.includes('bonjour') || lowerMessage.includes('salut') || lowerMessage.includes('hello')) {
    return demoResponses.default_fr
  }
  
  return demoResponses.default
}

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

    // Try to connect to Ollama
    let response;
    try {
      response = await fetch(`${OLLAMA_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: CHAT_MODEL,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: message }
          ],
          stream: false
        }),
        signal: AbortSignal.timeout(5000) // 5 second timeout
      })

      if (!response.ok) {
        throw new Error('Ollama non disponible')
      }

      const data = await response.json()
      
      return NextResponse.json({ 
        response: data.message?.content || getDemoResponse(message)
      })
    } catch (aiError) {
      // If AI service fails, return demo response
      console.log('Using demo response (AI not available):', aiError)
      return NextResponse.json({ 
        response: getDemoResponse(message)
      })
    }

  } catch (error) {
    console.error('Chat error:', error)
    return NextResponse.json(
      { response: "Bonjour ! Je suis l'assistant E-Outilles. Comment puis-je vous aider aujourd'hui ?" },
      { status: 200 }
    )
  }
}