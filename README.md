# Inspekta - Multi-Tenant Real Estate Platform

**🚀 PRODUCTION READY - V1.0**

A comprehensive real estate marketplace platform that simplifies and secures how clients find and inspect properties — remotely or in person — while allowing verified agents and property companies to manage listings, staff, and inspections under their own brand via custom subdomains.

## 🏗️ Architecture

Built with **Next.js 15 & Vercel Platforms approach**:
- ✅ **Multi-tenant subdomains** (companies get custom domains)
- ✅ **Role-based interfaces** (5 distinct user dashboards)
- ✅ **Real file upload system** (integrated image management)
- ✅ **Complete API ecosystem** (44+ endpoints with Swagger docs)
- ✅ **Production-ready build** (optimized for Vercel deployment)
- ✅ **TypeScript strict mode** (fully type-safe codebase)

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

## 📋 Features (v1.0 - PRODUCTION READY)

### 🏠 Core Features
- ✅ **Property listing system** with image upload & verification
- ✅ **Authentication system** with JWT & email verification
- ✅ **File management** with drag-and-drop image uploads
- ✅ **Role-based dashboards** for all user types
- ✅ **API documentation** with interactive Swagger UI at `/docs`
- ✅ **Responsive UI** with Tailwind CSS & shadcn/ui components
- ✅ **Multi-tenant architecture** ready for company subdomains
- 🔧 **Virtual/physical inspection scheduling** (backend ready, frontend pending)
- 🔧 **Payment processing** (API routes ready, gateway integration pending)
- 🔧 **Notification system** (database schema & API ready)

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

## 🚀 Deployment - READY FOR PRODUCTION

**✅ Build Status:** All systems ready for Vercel deployment

**Quick Deploy to Vercel:**
```bash
# Run pre-deployment validation
./scripts/deploy.sh

# Deploy to Vercel (after repository connection)
pnpm build  # ✅ Successful build
```

**Required Environment Variables:**
```env
# Database (Neon/Supabase recommended)
DATABASE_URL="postgresql://user:password@host:5432/database"

# Authentication
JWT_SECRET="your-super-secure-jwt-secret"
NEXT_PUBLIC_APP_URL="https://yourdomain.vercel.app"

# Email (SendGrid)
SENDGRID_API_KEY="SG.your_sendgrid_api_key"
SENDGRID_FROM_EMAIL="noreply@yourdomain.com"
SENDGRID_FROM_NAME="Inspekta Platform"
```

**Production Features:**
- ✅ **51 static pages** generated for optimal performance
- ✅ **44+ API endpoints** with complete documentation
- ✅ **Middleware routing** for multi-tenant architecture
- ✅ **TypeScript strict mode** for production reliability
- ✅ **Image upload system** ready for CDN integration

📖 **Complete deployment guide:** See `VERCEL_DEPLOYMENT_GUIDE.md`

## 📚 Documentation

- **PRD:** `./productInfo/prd.md` - Product requirements
- **TRD:** `./productInfo/trd.md` - Technical requirements  
- **Task Management:** `.taskmaster/` - MCP-powered development workflow

---

🚀 **Ready to build the future of real estate inspections!**