# 🐱 Mystic Paws — AI Tarot Reading Platform

A premium, production-ready AI Tarot Reading web application with mystical dark branding, Google Auth, Paytm payments, and deeply personalized AI interpretations powered by Anthropic Claude.

---

## ✦ Features

- **Google OAuth** authentication via Auth.js
- **One free reading** per Google account (stored in PostgreSQL, bypass-proof)
- **Paid readings** via Paytm Payment Gateway (₹50 for 3-card, ₹100 for 6-card)
- **78-card tarot deck** with real card images and flip animations
- **AI interpretations** powered by Anthropic Claude — deeply personalized, never generic
- **Question validation** — blocks high-stakes predictive questions elegantly
- **Admin dashboard** with analytics, payment logs, blocked question logs
- **Mystical dark UI** — black, blood red, deep plum with glassmorphism
- **Black cat mascot** branding throughout
- **WhatsApp CTA** for human 1:1 reading upsell

---

## ✦ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| Auth | Auth.js (NextAuth v5) + Google OAuth |
| Database | PostgreSQL + Prisma ORM |
| Payments | Paytm Payment Gateway |
| AI | Anthropic Claude API |
| Deployment | Vercel |

---

## ✦ Project Structure

```
mystic-paws/
├── public/
│   ├── cat-mascot.jpg              # Brand mascot image
│   └── tarot_cards/
│       ├── front/                  # 78 tarot card images (.png)
│       └── back/                   # Universal card back image
├── prisma/
│   └── schema.prisma               # Database schema
├── src/
│   ├── app/
│   │   ├── page.tsx                # Landing page
│   │   ├── reading/page.tsx        # Reading page (protected)
│   │   ├── admin/page.tsx          # Admin dashboard (protected)
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── api/
│   │       ├── auth/[...nextauth]/ # Auth.js handler
│   │       ├── validate/           # Question validation
│   │       ├── reading/            # Create reading + AI
│   │       ├── payment/
│   │       │   ├── initiate/       # Initiate Paytm payment
│   │       │   └── callback/       # Paytm callback handler
│   │       └── admin/stats/        # Admin analytics
│   ├── auth.ts                     # Auth.js config
│   ├── components/
│   │   ├── layout/                 # Navbar, Hero, Pricing, Footer
│   │   ├── reading/                # ReadingClient, Form, Panel, Payment Modal, Admin
│   │   ├── tarot/                  # DeckShuffle, CardSpread
│   │   └── ui/                     # ShadCN UI primitives
│   ├── data/
│   │   └── tarot-cards.ts          # Full 78-card metadata
│   ├── hooks/
│   │   └── use-toast.ts
│   ├── lib/
│   │   ├── prisma.ts               # Prisma client
│   │   ├── utils.ts                # Utilities
│   │   ├── validation.ts           # Question validation
│   │   ├── rate-limit.ts           # Rate limiting
│   │   ├── tarot-prompt.ts         # AI prompt builder
│   │   └── paytm.ts               # Paytm helpers
│   └── types/
│       ├── index.ts
│       └── next-auth.d.ts
```

---

## ✦ Setup Instructions

### 1. Prerequisites

- Node.js 20+
- PostgreSQL database (local or hosted — [Neon](https://neon.tech), [Supabase](https://supabase.com), etc.)
- Google Cloud project with OAuth credentials
- Anthropic API key
- Paytm merchant account (staging or production)

### 2. Clone & Install

```bash
git clone <your-repo-url>
cd mystic-paws
npm install
```

### 3. Environment Variables

```bash
cp .env.example .env.local
```

Fill in `.env.local`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/mystic_paws"
AUTH_SECRET="run: openssl rand -base64 32"
AUTH_URL="http://localhost:3000"
AUTH_GOOGLE_ID="your-google-client-id"
AUTH_GOOGLE_SECRET="your-google-client-secret"
ANTHROPIC_API_KEY="sk-ant-..."
PAYTM_MID="your-paytm-merchant-id"
PAYTM_MERCHANT_KEY="your-paytm-merchant-key"
PAYTM_WEBSITE="WEBSTAGING"
PAYTM_CHANNEL_ID="WEB"
PAYTM_INDUSTRY_TYPE_ID="Retail"
PAYTM_CALLBACK_URL="http://localhost:3000/api/payment/callback"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_WHATSAPP_NUMBER="919999999999"
ADMIN_EMAIL="your-admin@email.com"
```

### 4. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project → APIs & Services → Credentials
3. Create OAuth 2.0 Client ID (Web application)
4. Add Authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://yourdomain.com/api/auth/callback/google` (production)
5. Copy Client ID and Secret to `.env.local`

### 5. Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Optional: open Prisma Studio to inspect DB
npm run db:studio
```

### 6. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000`

---

## ✦ Paytm Integration

### Staging (Testing)
- Set `PAYTM_WEBSITE="WEBSTAGING"`
- Use Paytm's [staging dashboard](https://dashboard.paytm.com) test credentials
- Payments won't charge real money

### Production
- Set `PAYTM_WEBSITE="DEFAULT"`
- Update `PAYTM_CALLBACK_URL` to your production domain
- Ensure your Paytm merchant account is verified

---

## ✦ Admin Dashboard

Visit `/admin` when logged in with the email matching `ADMIN_EMAIL` in your env vars.

The first login with that email auto-grants admin access.

Dashboard shows:
- Total users, readings, revenue
- Free → paid conversion rate
- Payment logs
- Blocked question logs with category breakdown
- Recent readings

---

## ✦ Deployment (Vercel)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard or:
vercel env add DATABASE_URL
# ... etc
```

**Important for Vercel:**
- Add all `.env.local` variables to Vercel's Environment Variables
- Update `AUTH_URL` to your production domain
- Update `PAYTM_CALLBACK_URL` to your production domain
- Update Google OAuth redirect URIs to include production domain

---

## ✦ Card Image Mapping

Card images are mapped by slug. The filename must match the card slug exactly:

- `public/tarot_cards/front/the-fool.png`
- `public/tarot_cards/front/ace-of-cups.png`
- etc.

The back image is: `public/tarot_cards/back/tarot-card-back.png`

---

## ✦ Customization

### Change WhatsApp Number
Update `NEXT_PUBLIC_WHATSAPP_NUMBER` in `.env.local` (format: country code + number, no `+`)

### Change Pricing
Edit `PRICES` in `src/app/api/payment/initiate/route.ts` and update the UI in `src/components/layout/pricing-section.tsx`

### Change AI Model
Edit the `model` field in `src/app/api/reading/route.ts`

### Add More Question Blocks
Edit `BLOCKED_PATTERNS` in `src/lib/validation.ts`

---

## ✦ License

Private — all rights reserved. Built for Mystic Paws.
