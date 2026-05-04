# Mystic Paws - Quick Setup Guide

## 1. Environment Variables

Copy `.env.local` and fill in the required values:

### Required: Database
```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/mystic_paws?schema=public"
```

### Required: Google OAuth (Already configured)
✅ Already set in your `.env.local`

### Required: AI Provider (Choose ONE)

#### Option A: OpenAI (Recommended - $5 free credit)
1. Go to https://platform.openai.com/api-keys
2. Create account (get $5 free credit)
3. Create API key
4. Add to `.env.local`:
```bash
OPENAI_API_KEY="sk-proj-..."
```

#### Option B: OpenRouter (Free models available)
1. Go to https://openrouter.ai/keys
2. Create account
3. Create API key
4. Add to `.env.local`:
```bash
OPENROUTER_API_KEY="sk-or-..."
```
Uses free model: `meta-llama/llama-3.1-8b-instruct:free`

#### Option C: Anthropic (Paid only)
```bash
ANTHROPIC_API_KEY="sk-ant-..."
```

## 2. Database Setup

After setting `DATABASE_URL`:

```bash
npm run db:push
```

This creates all required tables in your PostgreSQL database.

## 3. Run the App

```bash
npm run dev
```

Visit: http://localhost:3000

## Free Tier Recommendations

**Best for testing:** OpenAI (gpt-4o-mini) - $5 free credit, very cheap
**Best for free:** OpenRouter - Completely free models available

## Troubleshooting

### "No AI provider configured" error
- Make sure you added at least ONE of: `OPENAI_API_KEY`, `OPENROUTER_API_KEY`, or `ANTHROPIC_API_KEY`
- Restart the dev server after adding env variables

### Auth error
- Verify `AUTH_GOOGLE_ID` and `AUTH_GOOGLE_SECRET` are correct
- Make sure `AUTH_SECRET` is set (already generated)
- Add authorized redirect in Google Console: `http://localhost:3000/api/auth/callback/google`

### Database error
- Verify PostgreSQL is running
- Check `DATABASE_URL` connection string is correct
- Run `npm run db:push` to create tables
