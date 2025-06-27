# Inspekta - Multi-Tenant Real Estate Platform

A verified real estate marketplace platform that simplifies and secures how clients find and inspect properties — remotely or in person — while allowing verified agents and property companies to manage listings, staff, and inspections under their own brand via custom subdomains.

## 🏗️ Architecture

Built with **Vercel Platforms hybrid approach**:
- ✅ **Multi-tenant subdomains** (companies get custom domains)
- ✅ **Role-based interfaces** (5 distinct user dashboards)
- ✅ **MCP tool integration** (intelligent development workflow)
- ✅ **Production-ready** (Vercel optimized deployment)

## 🎯 User Roles & Interfaces

- 🎯 **Client** (`/client`) - Browse properties, schedule inspections
- 🧑‍💼 **Agent** (`/agent`) - Manage listings, leads, earnings
- 👷 **Inspector** (`/inspector`) - Conduct virtual/physical inspections  
- 🏢 **Company** (`/company`) - Team management, custom subdomains
- 🤖 **AI Assistant** - Voice/chat property search

## 🚀 Quick Start

### Prerequisites
- Node.js 18.17.0 or later
- pnpm (recommended) 
- PostgreSQL database
- Redis (Upstash for production)

### Local Development

1. **Install dependencies:**
   ```bash
   cd inspekta-platform
   pnpm install
   ```

2. **Environment setup:**
   ```bash
   cp .env.example .env.local
   # Add your API keys (see .env.example for all required keys)
   ```

3. **Start development server:**
   ```bash
   pnpm dev --port 3001
   ```

4. **Test the application:**

   **Main Platform:**
   - Landing page: `http://localhost:3001`
   - Admin panel: `http://localhost:3001/admin`

   **Role Dashboards:**
   - Client: `http://localhost:3001/client`
   - Agent: `http://localhost:3001/agent`  
   - Inspector: `http://localhost:3001/inspector`
   - Company: `http://localhost:3001/company`

   **Multi-tenant Subdomains:**
   - Company portals: `http://[company-name].localhost:3001`
   - Add entries to `/etc/hosts` for local testing:
     ```
     127.0.0.1 demo.localhost
     127.0.0.1 acme-real-estate.localhost
     ```

## 🛠️ Tech Stack

- **Frontend:** Next.js 15 with App Router, React 19, Tailwind 4
- **Backend:** Node.js API routes, PostgreSQL
- **Multi-tenancy:** Vercel Platforms architecture + Redis
- **UI Components:** shadcn/ui, Radix UI
- **Integrations:** WhatsApp (Twilio), Google Meet, Paystack
- **AI:** OpenAI/Gemini for customer assistant
- **Development:** MCP tools for intelligent coding workflow

## 📋 Features (v1.0)

### 🏠 Core Features
- Property listing system with verification
- Virtual/physical inspection scheduling  
- WhatsApp + email notifications
- Payment processing (pay-per-inspection/subscriptions)
- Referral tracking system
- Multi-tenant company subdomains

### 🔒 Security & Verification
- Agent: NIN/BVN + 2 guarantors
- Company: CAC + business registration  
- Inspector: NIN + geo-matching
- Client: phone verification

### 💰 Monetization
- Virtual inspections: 10% platform fee
- Agent subscriptions: ₦2,500/month
- Company subscriptions: ₦5,000/month
- Post-rent commission tracking

## 🏗️ Project Structure

```
inspekta-platform/
├── app/
│   ├── client/          # Client property browsing interface
│   ├── agent/           # Agent dashboard & listings
│   ├── inspector/       # Inspector job management
│   ├── company/         # Company team & subdomain management
│   ├── admin/           # Platform administration
│   ├── s/[subdomain]/   # Company-branded tenant sites
│   └── api/             # Backend API routes
├── components/          # Shared UI components  
├── lib/                 # Utilities & integrations
├── productInfo/         # PRD & TRD documents
├── .taskmaster/         # Task Master MCP integration
└── middleware.ts        # Multi-tenant routing logic
```

## 🧪 Testing Multi-tenancy

1. **Create a test company subdomain:**
   - Visit `http://localhost:3001/admin`
   - Add a new subdomain (e.g., "demo")

2. **Test subdomain routing:**
   - Add to `/etc/hosts`: `127.0.0.1 demo.localhost`
   - Visit `http://demo.localhost:3001`

3. **Test role-based access:**
   - Each role has its own interface and permissions
   - Companies can manage their agents/inspectors

## 🚀 Deployment

**Vercel (Recommended):**
1. Connect repository to Vercel
2. Configure environment variables  
3. Set up custom domain with wildcard DNS (`*.inspekta.app`)
4. Deploy

**Environment Variables:**
See `.env.example` for complete list including:
- Database URLs, Redis credentials
- API keys for WhatsApp, Google Meet, Paystack
- AI service keys (OpenAI, Gemini)

## 📚 Documentation

- **PRD:** `./productInfo/prd.md` - Product requirements
- **TRD:** `./productInfo/trd.md` - Technical requirements  
- **Task Management:** `.taskmaster/` - MCP-powered development workflow

---

🚀 **Ready to build the future of real estate inspections!**