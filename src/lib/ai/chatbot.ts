// AI Chatbot configuration and utilities

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export interface ChatSession {
  id: string
  messages: ChatMessage[]
  context: {
    cartItems?: number
    lastCategory?: string
    userIntent?: 'purchase' | 'browse' | 'support'
  }
}

// Predefined responses for common queries
export const quickResponses: Record<string, string> = {
  'delivery': '🚚 Nous livrons dans plus de 50 pays! La livraison standard prend 5-10 jours ouvrés. Livraison gratuite dès 50€.',
  'returns': '↩️ Politique de retour: 30 jours pour changer d\'avis. Produit défectueux? Remboursement intégral garanti.',
  'warranty': '🛡️ Tous nos outils INGCO bénéficient d\'une garantie constructeur de 2 ans minimum.',
  'payment': '💳 Nous acceptons: Visa, Mastercard, PayPal, MTN Mobile Money, Orange Money, Flutterwave.',
  'pricing': '💰 Nos prix sont similaires aux tarifs européens. Marges transparentes, pas de frais cachés!',
  'contact': '📞 Contact: support@e-outilles.com ou WhatsApp +225 07 00 00 00 00',
  'products': '🛠️ Catalogue: Perceuses, Marteaux perforateurs, Meuleuses, Tronçonneuses, Compresseurs...',
}

// Detect user intent from message
export function detectIntent(message: string): 'purchase' | 'browse' | 'support' {
  const lower = message.toLowerCase()
  
  if (lower.includes('acheter') || lower.includes('commander') || lower.includes('prix')) {
    return 'purchase'
  }
  if (lower.includes('aide') || lower.includes('problème') || lower.includes('retour')) {
    return 'support'
  }
  return 'browse'
}

// Generate response based on user message
export function generateResponse(message: string, context?: ChatSession['context']): string {
  const lower = message.toLowerCase()
  
  // Check quick responses
  for (const [keyword, response] of Object.entries(quickResponses)) {
    if (lower.includes(keyword)) {
      return response
    }
  }
  
  // Context-aware responses
  if (context?.lastCategory) {
    return `Vous semblez感兴趣 par ${context.lastCategory}. Voulez-vous voir notre catalogue complet ou poser des questions spécifiques?`
  }
  
  // Default response with suggestions
  return `Je suis là pour vous aider! Posez-moi une question sur:
  • 🚚 Livraison et délais
  • ↩️ Retours et remboursements
  • 🛡️ Garantie
  • 💳 Moyens de paiement
  • 🛠️ Nos produits
  
  Ou décrivez ce que vous recherchez!`
}
