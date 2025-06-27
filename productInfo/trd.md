**# Functional Requirements Document (FRD)

---

## 1. Purpose of This Document

The FRD provides a detailed breakdown of how each feature in Inspekta will function, including user interactions, data handling, third-party integrations, business logic, and expected system behavior. This will be used by the designers, developers, testers, and DevOps team to build and validate the product.

---

## 2. System Overview

Inspekta is a multi-tenant real estate marketplace for remote apartment inspections. It provides role-based dashboards (clients, agents, inspectors, companies, and customer support) and automates inspections via WhatsApp + Google Meet, AI-assisted onboarding, and centralized listings. It includes monetization through inspection fees, subscriptions, and post-rent commission fees.

Indicate importance levels (Example: P0 = Must-have, P1 = Should-have, and P2 = Nice-to-have) and outline what the product or feature must do

---

## 3. User Roles & Permissions

| Role             | Capabilities                                                                                |
| ---------------- | ------------------------------------------------------------------------------------------- |
| Client           | Browse listings, schedule/view inspections, receive notifications, submit interest          |
| Agent            | List properties, assign inspectors, manage leads, receive earnings                          |
| Inspector        | Accept inspection jobs, conduct virtual or physical inspections, earn income                |
| Company          | Manage agents/inspectors/support, view earnings, set commission splits, customize subdomain |
| Customer Support | Assist clients via AI or chat, collect onboarding info                                      |
| Admin (Platform) | Verify users, control payout rules, oversee platform activity, manage API keys              |

---

## 4. Functional Requirements by Module

---

### 4.1 Property Listing System

| ID  | Functional Requirement       | Description                                                                                 |
| --- | ---------------------------- | ------------------------------------------------------------------------------------------- |
| FR1 | Create Listing               | Agent or company can list a property manually via dashboard.                                |
| FR2 | Auto-list from WhatsApp (v2) | Agent shares property in WhatsApp group; platform scrapes content and uploads to dashboard. |
| FR3 | Property Detail Page         | Public view includes verified badge, media, pricing, location, and inspection options.      |
| FR4 | Listing Referral Link        | Each listing has a unique referral link with tracking metadata.                             |
| FR5 | Listing Tiers                | Paid agents/companies can promote listings as “featured.”                                 |

---

### 4.2 Inspection Management System

| ID   | Functional Requirement   | Description                                                                              |
| ---- | ------------------------ | ---------------------------------------------------------------------------------------- |
| FR6  | Inspection Scheduling    | Agent or company can schedule virtual or physical inspection.                            |
| FR7  | Inspector Assignment     | Inspector can accept/decline assigned inspections based on geo-location or availability. |
| FR8  | Virtual Call Integration | Google Meet is used for video inspections. Bot auto-joins and records session.           |
| FR9  | Inspection Notifications | WhatsApp + email reminders sent to all subscribers 24h/1h before event.                  |
| FR10 | Post-inspection Flow     | Clients click “Interested” → fill details → agent reviews leads.                     |

---

### 4.3 Role Dashboards

| ID   | Functional Requirement | Description                                                       |
| ---- | ---------------------- | ----------------------------------------------------------------- |
| FR11 | Client Dashboard       | Shows subscribed properties, past inspections, interest status.   |
| FR12 | Agent Dashboard        | Track listings, inspections, lead conversions, referral earnings. |
| FR13 | Inspector Dashboard    | Track accepted jobs, inspection history, earnings log.            |
| FR14 | Company Dashboard      | Invite/manage agents, set commission splits, manage subdomain.    |
| FR15 | Admin Dashboard        | View global analytics, approve verifications, set payout rules.   |

---

### 4.4 Communication System

| ID   | Functional Requirement    | Description                                                                            |
| ---- | ------------------------- | -------------------------------------------------------------------------------------- |
| FR16 | WhatsApp Notification Bot | Sends all reminders, confirmations, instructions via API (e.g., Twilio or Meta).       |
| FR17 | Email Fallback            | Send inspection confirmations and post-inspection reports via email if WhatsApp fails. |
| FR18 | Client Privacy            | Clients do not directly receive agent numbers — platform mediates communication.      |

---

### 4.5 Payment & Subscription System

| ID   | Functional Requirement | Description                                                                              |
| ---- | ---------------------- | ---------------------------------------------------------------------------------------- |
| FR19 | Pay-per-inspection     | Client can pay ₦X to join a single virtual/physical inspection.                         |
| FR20 | Client Subscription    | Clients can subscribe monthly for unlimited inspections.                                 |
| FR21 | Agent Subscription     | Agents pay ₦2,500/month to remove ads and boost listings.                               |
| FR22 | Company Subscription   | Companies pay ₦5,000/month for full dashboard access + subdomain.                       |
| FR23 | Earnings Split Logic   | For each inspection, platform splits revenue (60% Inspector / 30% Agent / 10% Platform). |

---

### 4.6 Referral System

| ID   | Functional Requirement | Description                                             |
| ---- | ---------------------- | ------------------------------------------------------- |
| FR24 | Referral Link Tracking | Unique links track subscribers and revenue generated.   |
| FR25 | Reshare Limitation     | Only one-level referral allowed; no chain structure.    |
| FR26 | Incentive Calculation  | Platform calculates bonus % and displays in dashboards. |

---

### 4.7 AI Customer Assistant

| ID   | Functional Requirement  | Description                                                             |
| ---- | ----------------------- | ----------------------------------------------------------------------- |
| FR27 | Client Search Assistant | AI asks onboarding questions via voice/text and stores filter criteria. |
| FR28 | Data Mapping Engine     | AI classifies client answers into structured fields.                    |
| FR29 | AI Response Engine      | Recommends listings and subscriptions based on captured preferences.    |

---

### 4.8 Verification & Compliance

| ID   | Functional Requirement | Description                                                              |
| ---- | ---------------------- | ------------------------------------------------------------------------ |
| FR30 | Agent Verification     | NIN/BVN + 2 Guarantors must be submitted and validated.                  |
| FR31 | Company Verification   | Upload CAC documents, platform approves account.                         |
| FR32 | Inspector Vetting      | Inspectors must match jobs based on location and vetting status.         |
| FR33 | Client Onboarding      | Clients complete legal Q&A via voice/text with optional document upload. |

---

### 4.9 Payout System

| ID   | Functional Requirement | Description                                                           |
| ---- | ---------------------- | --------------------------------------------------------------------- |
| FR34 | Earnings Ledger        | Track earnings across roles in each dashboard.                        |
| FR35 | Payout Schedule        | Companies can choose between weekly/monthly/after-inspection payouts. |
| FR36 | Platform Cut           | Admin sets platform % globally (default: 10%).                        |
| FR37 | Commission Collection  | Post-rent agency fees and commissions are routed through platform.    |

---

## 5. Data Models (High-Level)

### Listing:

* ID, Title, Media[], Price, Location, AgentID, CompanyID, ReferralCode, Status, Tier

### User:

* ID, Role, Name, VerificationStatus, Earnings[], SubscriptionStatus, CompanyID, ContactInfo

### Inspection:

* ID, Type (virtual/physical), PropertyID, InspectorID, ClientIDs[], Date, VideoURL, EarningsBreakdown

### Referral:

* ReferrerID, ReferralCode, PropertyID, ClientID, BonusEarned

---

## 6. Integration Points

| System       | Integration                          |
| ------------ | ------------------------------------ |
| WhatsApp     | Meta API or Twilio Business API      |
| Email        | SendGrid or Mailgun                  |
| Video Calls  | Google Meet API (auto create & join) |
| Payments     | Paystack / Flutterwave               |
| AI Assistant | Gemini GPT API                       |
| File Storage | Firebase or AWS S3                   |

---

## 7. Constraints

* Video inspection must be under 30 minutes per session.
* Max 5–10 clients per inspection session.
* Payments must clear before clients can attend virtual inspections.
* Referral tracking must preserve only one referrer per deal.
* No rent payments handled in v1.

---

## Final Notes

This FRD translates the PRD vision into real, buildable product features that your dev and design team can execute on. It is also ready to inform:

* UI/UX wireframes
* QA test case planning
* Sprint-level breakdowns
* API contracts and backend architecture

**
