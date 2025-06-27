**

Status Not started

Product Requirements Document (PRD)

### Product Name: Inspekta

### Version: 1.0

### Date: June 26, 2025

### Owner: Nexprove

### Product Manager Avi Of Lagos

### Engineer: Claude code

---

## 1. Overview

Inspekta is a verified real estate marketplace platform that simplifies and secures how clients find and inspect properties — remotely or in person — while allowing verified agents and property companies to manage listings, staff, and inspections under their own brand via custom subdomains. The platform prevents fraud, optimizes time, and streamlines communication via WhatsApp, virtual tours, and a transparent referral and earnings model.

---

## 2. Goals & Success Criteria

### Business Goals

* Reduce real estate fraud and improve trust for renters
* Enable property inspections without physical visits
* Support verified agents and companies with tools for onboarding and listings
* Monetize through subscriptions, inspection fees, and commissions

### Success Metrics

* 80% of inspections handled virtually within first 6 months
* 90%+ verified listings (agent or company owned)
* 50+ companies onboarded in the first year
* 10K monthly WhatsApp inspection reminders sent
* Weekly payouts are handled without error to all roles

---

## 3. Target Users & Personas

### 🎯 Client (Property Seeker)

* Finds verified properties
* Schedules physical/virtual inspections
* Receives updates via WhatsApp/email

### 🧑‍💼 Agent (Property Lister)

* Uploads property listings
* Schedules inspections
* Reviews leads and selects clients

### 🏢 Company (Enterprise Agent)

* Manages agents and inspectors
* Gets a subdomain and branded dashboard
* Oversees revenue, performance, and customer care

### 👷 Inspector

* Conducts scheduled inspections (virtually or physically)
* Follows protocol
* Gets paid per job via dashboard

### 🤖 AI Customer Care Assistant

* Assists clients with search using voice/text
* Guides clients through onboarding Q&A
* Updates client dashboard with filtered options

---

## 4. Features (v1.0)

### 🏠 Marketplace & Listings

* Property listing by verified agents/companies
* Advanced search filters
* Listing preview, detail pages
* Referral link system
* Company-branded subdomain listings

### 📹 Inspection System

* Physical inspections (free)
* Virtual inspections (Google Meet, paid)
* Video auto-recording with platform bot
* Schedule system with reminders
* Inspection leads go to agents post-event

### 📢 Communication & Notification

* WhatsApp + email integration (Twilio, Meta API)
* Auto reminders for inspection sessions
* Payment and confirmation notifications
* Post-inspection “Interested” flow with client info collection

### 💸 Payments & Subscriptions

* Pay-per-inspection or subscription model for clients
* Agent plan (₦2,500/mo): ad-free experience
* Company plan (₦5,000/mo): dashboard + subdomain
* Financial tracking dashboards for all roles

### 🔁 Referrals & Bonuses

* One-level deep referral tracking
* Bonus allocation:

  * 60% to inspector
  * 30% to agent/company
  * 10% to platform
* Inspection revenue split logic per session
* Referral dashboards and earnings tracker

### 🛡️ Verification & Security

* Agent: NIN/BVN + 2 guarantors
* Company: CAC + business registration
* Inspector: NIN + vetting + geo-matching
* Client: phone verification + optional profile enrichment

### 🧠 AI Assistant

* Voice/chat-based onboarding flow
* Understands client needs and filters listings
* Helps fill inspection Q&A forms automatically

---

## 5. Scope & Limitations

### ✅ Included in v1

* Verified listings and identity checks
* Scheduling and handling of inspections
* Virtual inspection bot + cloud storage
* Referral system, earnings, and payout tracking
* Subdomain system for enterprises
* WhatsApp-centric engagement

### ❌ Excluded in v1 (Future Releases)

* Chat with agents (in-app)
* Rent payment processing
* In-app messaging or document e-signatures
* Smart contract-based rent agreements
* End-to-end tenancy lifecycle management

---

## 6. User Flows (Simplified)

### Client:

1. Visit → Search → Subscribe to listing
2. WhatsApp/email reminder → Join inspection
3. Submit interest → Agent reviews → Match success/failure

### Agent:

1. Register → Upload listings → Schedule inspections
2. Review leads → Select client → Close deal

### Inspector:

1. Register → Accept job → Join inspection via link
2. Conduct inspection → Session auto-recorded
3. Get paid via dashboard

### Company:

1. Register → Get subdomain → Add team
2. Monitor activity, set commission rules
3. Review earnings, payout reports

---

## 7. Tech Stack

| Component     | Technology                       |
| ------------- | -------------------------------- |
| Frontend      | React or Next.js                 |
| Backend       | Node.js + Express                |
| Database      | PostgreSQL                       |
| AI Assistant  | OpenAI API                       |
| Payments      | Paystack or Flutterwave          |
| Communication | WhatsApp Business API + SendGrid |
| Video Calls   | Google Meet API                  |
| File Storage  | Firebase                         |
| Hosting       | Vercel                           |

---

## 8. Monetization Strategy

| Revenue Stream         | Model                          | Platform Cut                    |
| ---------------------- | ------------------------------ | ------------------------------- |
| Virtual Inspection     | Per session or subscription    | 10%                             |
| Subscription (Client)  | Monthly                        | 100%                            |
| Subscription (Agent)   | Monthly ₦2,500                | 100%                            |
| Subscription (Company) | Monthly ₦5,000                | 100%                            |
| Commission/Agency Fee  | Paid post-deal viathe platform | 10%                             |
| Referral Bonus         | From inspection or agency fee  | The platform keeps fixed at 10% |

---

## 9. Key Risks & Mitigation

| Risk                                    | Mitigation                             |
| --------------------------------------- | -------------------------------------- |
| Fraudulent agents/inspectors            | Strong identity verification + vetting |
| Payment disputes                        | Transparent dashboard + logs           |
| Low trust in virtual inspections        | Protocol bot + recordings + Q&A flow   |
| Revenue leakage from off-platform deals | Lock down lead visibility post-payment |

---

## 10. Dependencies & Integration

* WhatsApp Business API
* Google Meet API
* Paystack/Flutterwave for payments
* Gemini for a conversational AI assistant
* Admin CMS or Firebase for back-office controls

**
