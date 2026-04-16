// Newsletter configuration and types

export interface Subscriber {
  id: string
  email: string
  name?: string
  country?: string
  interests: string[]
  status: 'active' | 'unsubscribed' | 'bounced'
  subscribedAt: Date
  tags: string[]
}

export interface EmailCampaign {
  id: string
  subject: string
  content: string
  status: 'draft' | 'scheduled' | 'sent'
  scheduledAt?: Date
  sentAt?: Date
  recipients: number
  opens?: number
  clicks?: number
}

// Predefined email templates
export const emailTemplates = {
  welcome: {
    subject: 'Bienvenue chez E-Outilles! 🛠️',
    content: `Bonjour {{name}},

Merci de rejoindre la communauté E-Outilles!

Vous avez maintenant accès à:
- Notre catalogue complet d'outils INGCO
- Des offres exclusives réservées aux abonnés
- Des conseils et guides pour votre métier

Découvrez notre sélection d'outils professionnels: {{catalog_url}}

Bonne découverte!

L'équipe E-Outilles`
  },
  
  abandonedCart: {
    subject: 'Vous avez oublié quelque chose... 🛒',
    content: `Bonjour {{name}},

Nous avons remarqué que vous avez laissé des outils dans votre panier:

{{cart_items}}

Offre limitée: -5% sur votre commande avec le code **PANIER5**

Finalisez votre commande: {{checkout_url}}

L'équipe E-Outilles`
  },
  
  newProduct: {
    subject: '🆕 Nouveau: {{product_name}}',
    content: `Bonjour {{name}},

Nous venons d'ajouter un nouvel outil à notre catalogue:

**{{product_name}}**
{{product_description}}

Prix: {{product_price}}
Catégorie: {{product_category}}

Voir le produit: {{product_url}}

L'équipe E-Outilles`
  },
  
  orderConfirmation: {
    subject: '✅ Commande confirmée - {{order_number}}',
    content: `Bonjour {{name}},

Votre commande a été confirmée!

Numéro de commande: {{order_number}}
Date de livraison estimée: {{delivery_date}}

Suivre ma commande: {{tracking_url}}

Merci de votre confiance!

L'équipe E-Outilles`
  }
}

// Convertkit/Mailchimp integration placeholder
export async function subscribeToNewsletter(email: string, name?: string, country?: string) {
  // In production, connect to ConvertKit, Mailchimp, or SendGrid
  const response = await fetch('/api/marketing/subscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, name, country })
  })
  return response.json()
}
