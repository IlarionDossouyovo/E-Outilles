# 🤖 E-Outilles AI Agents System

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     E-OUTILLES AI PLATFORM                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   SALES AI   │  │OPERATIONS AI │  │ SUPPORT AI   │         │
│  │    AGENT     │  │    AGENT     │  │    AGENT     │         │
│  ├──────────────┤  ├──────────────┤  ├──────────────┤         │
│  │• Lead capture│  │• Orders      │  │• Tickets     │         │
│  │• Qualify     │  │• Inventory   │  │• Auto-reply  │         │
│  │• CRM         │  │• Suppliers   │  │• Escalation │         │
│  │• Nurture     │  │• Shipping    │  │• FAQ         │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                 │
│  ┌──────────────────────────────────────────────────┐         │
│  │              MARKETING AI AGENT                   │         │
│  ├──────────────────────────────────────────────────┤         │
│  │• Content Generation    • Social Media           │         │
│  │• Email Campaigns       • Analytics               │         │
│  │• SEO Optimization     • A/B Testing             │         │
│  └──────────────────────────────────────────────────┘         │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                    N8N ORCHESTRATION                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐          │
│  │Webhook  │  │Schedule │  │Database │  │WhatsApp│          │
│  │Triggers │  │Triggers │  │(Supabase)│  │API    │          │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘          │
│                                                                 │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐          │
│  │Stripe   │  │Email    │  │GPT/OpenAI│  │Analytics│          │
│  │API      │  │(SMTP)   │  │API       │  │API     │          │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## AI Agents

### 1. 🤖 Sales AI Agent
**Purpose**: Convert visitors into customers

| Function | Description |
|----------|-------------|
| Lead Capture | Webhook from website forms |
| Lead Scoring | Score 0-100 based on demographics |
| Qualification | Hot/Warm/Cold classification |
| CRM | Save to Supabase |
| Nurture | Email sequences |
| Alert | WhatsApp to sales team |

**Webhook**: `POST /webhooks/sales/new-lead`

### 2. ⚙️ Operations AI Agent
**Purpose**: Automate order processing

| Function | Description |
|----------|-------------|
| Order Check | Poll every 15 min |
| Stock Validation | Verify availability |
| Supplier Order | Auto-order when low stock |
| Status Update | Real-time tracking |
| Customer Notify | WhatsApp updates |

**Schedule**: Every 15 minutes

### 3. 🎧 Support AI Agent
**Purpose**: Customer service automation

| Function | Description |
|----------|-------------|
| Ticket Create | From WhatsApp/Email |
| Classification | Auto-categorize issues |
| Auto-Reply | Instant acknowledgment |
| Priority | High/Normal/Low |
| Escalation | Alert for urgent |

**Webhook**: `POST /webhooks/support/ticket`

### 4. 📢 Marketing AI Agent
**Purpose**: Content & engagement

| Function | Description |
|----------|-------------|
| Content Gen | AI-generated posts |
| Scheduling | Mon/Wed/Fri 9AM |
| Multi-platform | WhatsApp, IG, FB |
| Analytics | Track engagement |

**Schedule**: Mon/Wed/Fri 9AM

---

## Database Schema (Supabase)

```sql
-- Leads
CREATE TABLE leads (
  id UUID PRIMARY KEY,
  name TEXT,
  email TEXT,
  phone TEXT,
  country TEXT,
  business_type TEXT,
  budget DECIMAL,
  interest TEXT,
  score INT,
  qualification TEXT,
  source TEXT,
  created_at TIMESTAMP
);

-- Orders
CREATE TABLE orders (
  id UUID PRIMARY KEY,
  customer_id UUID,
  items JSONB,
  total DECIMAL,
  status TEXT,
  payment_status TEXT,
  shipping_address JSONB,
  created_at TIMESTAMP
);

-- Support Tickets
CREATE TABLE support_tickets (
  id UUID PRIMARY KEY,
  customer_id UUID,
  category TEXT,
  subject TEXT,
  message TEXT,
  priority TEXT,
  status TEXT,
  created_at TIMESTAMP
);

-- Marketing
CREATE TABLE marketing_campaigns (
  id UUID PRIMARY KEY,
  type TEXT,
  platform TEXT,
  message TEXT,
  status TEXT,
  scheduled_at TIMESTAMP,
  created_at TIMESTAMP
);

-- Tasks
CREATE TABLE tasks (
  id UUID PRIMARY KEY,
  type TEXT,
  description TEXT,
  priority TEXT,
  assigned_to TEXT,
  status TEXT,
  lead_id UUID,
  ticket_id UUID,
  due_date TIMESTAMP
);
```

---

## Setup Instructions

### Prerequisites
1. **n8n** - Self-hosted or cloud
2. **Supabase** - Database
3. **WhatsApp Business API**
4. **OpenAI** - For AI features (optional)

### Installation

1. **Import Workflows**
   - Open n8n
   - Go to Settings → Import
   - Import each `workflows/*.json`

2. **Configure Credentials**
   - Supabase: API URL + Key
   - WhatsApp: Business API credentials
   - OpenAI: API Key (optional)

3. **Set Webhooks**
   - Configure in n8n
   - Update website forms to POST to webhooks

4. **Start Workflows**
   - Activate each AI agent
   - Monitor in n8n dashboard

---

## API Endpoints

| Endpoint | Method | Agent |
|----------|--------|-------|
| `/webhooks/sales/new-lead` | POST | Sales |
| `/webhooks/support/ticket` | POST | Support |
| `/webhooks/payment/stripe` | POST | Operations |

---

## Monitoring

- **n8n Dashboard**: View all executions
- **Supabase Dashboard**: Query data
- **WhatsApp Business**: Message logs

---

## Scaling

For 100+ orders/day:
1. Add more n8n workers
2. Enable caching (Redis)
3. Use message queues
4. Add more AI agents
