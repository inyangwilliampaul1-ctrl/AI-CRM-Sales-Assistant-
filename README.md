# AI CRM Sales Assistant 🚀

A production-ready, multi-tenant **AI-powered CRM** built with modern web technologies.  
This application helps businesses manage customers, sales pipelines, and support tickets — enhanced with intelligent AI insights for better decision-making.

---

## ✨ Features

### 🧾 Core CRM Modules
- **Customers Management**
  - Create, edit, delete customers
  - Track contact details, company info, and status
- **Deals (Sales Pipeline)**
  - Kanban board for deal stages
  - Track deal value, stage, and expected close date
- **Support Tickets**
  - Manage customer support requests
  - Priority and status tracking

---

### 🧠 AI-Powered Capabilities
- **Customer Smart Summaries**
  - AI-generated overview of customer history (deals + tickets)
- **Next Best Action Suggestions**
  - AI recommendations to help close deals faster
- **Message Drafting**
  - One-click AI-generated WhatsApp / follow-up messages
- **Smart AI Fallback (Simulation Mode)**
  - Automatically switches to realistic mock responses if AI quota is exceeded
  - Ensures uninterrupted demos and UI testing

---

### 🔐 Security & Architecture
- **Multi-Tenant Data Isolation**
  - Each user can only access their own business data
- **Supabase Row Level Security (RLS)**
  - Enforced at the database level
- **Server Actions & Server Components**
  - Secure, scalable backend logic
- **UUID-based Primary Keys**
- **UTC-based Timestamps**

---

## 🛠️ Tech Stack

- **Frontend:** Next.js 14 (App Router), TypeScript
- **Styling:** Tailwind CSS
- **Backend & Auth:** Supabase (PostgreSQL + RLS)
- **AI:** OpenAI (via Vercel AI SDK)
- **Deployment:** Vercel
- **Database:** PostgreSQL
- **State & Data Flow:** Server Components + Server Actions

---

## 🗂️ Project Structure

```
app/
├─ (auth)        # Login & Register
├─ (dashboard)   # CRM dashboard (customers, deals, tickets)
├─ (marketing)   # Landing pages
├─ api/
│   └─ ai/       # AI generation endpoints
components/
lib/
├─ db/           # Typed server-side database queries
├─ supabase/     # Supabase clients
supabase/
└─ migrations/   # Database schema & RLS policies
```

---

## 🧪 AI Fallback Mode (Important)

This application includes a **smart AI fallback system**:

- ✅ When OpenAI API quota is available → **real AI responses are used**
- 🛡️ When quota is exceeded or API fails → **Simulation Mode activates**
- Simulation Mode returns realistic mock responses so:
  - The UI remains fully functional
  - Demos never break
  - No runtime errors occur

This mirrors how production SaaS products handle external AI dependencies.

---

## 🔑 Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_api_key
```

⚠️ Never commit .env.local to GitHub.
