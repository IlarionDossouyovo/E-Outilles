# 🚀 Guide d'installation N8N - E-Outilles

## Option 1: N8N Cloud (Recommandé pour debutant)

1. **Creer un compte**: https://n8n.io
2. **Nouveau Workspace**: "E-Outilles"
3. **Importer les workflows**

---

## Option 2: N8N Auto-hebergé (Docker)

```bash
# 1. Installer Docker
sudo apt update && sudo apt install docker.io

# 2. Lancer n8n
docker run -d \
  --name n8n \
  -p 5678:5678 \
  -v n8n_data:/home/node/.n8n \
  -e N8N_BASIC_AUTH_ACTIVE=true \
  -e N8N_BASIC_AUTH_USER=admin \
  -e N8N_BASIC_AUTH_PASSWORD=votre_mot_de_passe \
  n8nio/n8n
```

3. **Acceder**: http://localhost:5678

---

## Configuration

### 1. Credenciales

Dans n8n, aller dans **Settings → Credentials**:

| Credential | Type | Valeurs |
|------------|------|---------|
| Supabase | Basic Auth | URL + Key |
| WhatsApp | API | Phone Number ID, Token |
| OpenAI | API Key | (Optionnel) |
| Gmail/SMTP | Basic Auth | Email + Password |

### 2. Importer les Workflows

1. **Sales AI Agent**: `agents/n8n/workflows/sales-ai-agent.json`
2. **Operations AI Agent**: `agents/n8n/workflows/operations-ai-agent.json`
3. **Support AI Agent**: `agents/n8n/workflows/support-ai-agent.json`
4. **Marketing AI Agent**: `agents/n8n/workflows/marketing-ai-agent.json`

### 3. Activer les Webhooks

| Workflow | Webhook URL |
|----------|-------------|
| Sales | `/webhooks/sales/new-lead` |
| Support | `/webhooks/support/ticket` |

---

## Connecter au site E-Outilles

### Pour le formulaire de contact:

```javascript
// Dans le frontend
async function submitLead(data) {
  await fetch('https://votre-n8n.io/webhooks/sales/new-lead', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
}
```

### Pour les tickets support:

```javascript
// Via WhatsApp webhook
async function createTicket(message, phone) {
  await fetch('https://votre-n8n.io/webhooks/support/ticket', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, phone })
  });
}
```

---

## URLs des Webhooks

Production (remplacer par votre URL n8n):

| Service | URL |
|---------|-----|
| Sales Lead | `https://[n8n-url]/webhooks/sales/new-lead` |
| Support Ticket | `https://[n8n-url]/webhooks/support/ticket` |
| Stripe Payment | `https://[n8n-url]/webhooks/payment/stripe` |

---

## Demarrage

1. **Activer** chaque workflow dans n8n
2. **Tester** avec des donnees sample
3. **Verifier** dans Supabase
4. **Surveiller** les executions

---

## URLs Utiles

| Service | URL |
|---------|-----|
| n8n Cloud | https://n8n.io |
| n8n Docs | https://docs.n8n.io |
| Supabase | https://supabase.com |
| WhatsApp Business | https://business.facebook.com |

---

## Prochaines etapes

1. ✅ Importer workflows
2. ✅ Configurer credentials
3. ✅ Connecter au site
4. 🔄 Tester end-to-end
5. 📊 Monitorer

---

**Questions?** Voir `agents/README.md`
