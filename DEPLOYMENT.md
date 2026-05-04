# Deploy Mystic Paws to Vercel

## Step 1: Push to GitHub

```bash
# Add all files
git add .

# Commit
git commit -m "Initial commit - Mystic Paws tarot app"

# Create GitHub repo at https://github.com/new
# Then push:
git remote add origin https://github.com/YOUR_USERNAME/mystic-paws.git
git branch -M main
git push -u origin main
```

## Step 2: Deploy to Vercel

1. **Go to:** https://vercel.com/signup
2. **Sign up** with GitHub
3. **Click "Add New Project"**
4. **Import your GitHub repo** (mystic-paws)
5. **Configure:**
   - Framework Preset: Next.js (auto-detected)
   - Root Directory: `./`
   - Build Command: `npm run build` (auto-detected)
   - Output Directory: `.next` (auto-detected)

6. **Add Environment Variables** (click "Environment Variables"):

```bash
# Database
DATABASE_URL=postgresql://neondb_owner:npg_pnHR1wMh6lPd@ep-snowy-frost-ansum0fa.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require

# Auth
AUTH_SECRET=4m/yfRMKc6zAY4qdpCQuevLr35N4twp2Z+j5UfzJl+s=
AUTH_URL=https://YOUR_VERCEL_URL.vercel.app
AUTH_GOOGLE_ID=534620187100-8sa90figafl46tf761cua531ktgco762.apps.googleusercontent.com
AUTH_GOOGLE_SECRET=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

# AI
GROQ_API_KEY=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

# Razorpay
RAZORPAY_KEY_ID=rzp_test_SlCCAqa1814mnx
RAZORPAY_KEY_SECRET=V9l5OxI9OQrGlDApD48Cfx4R

# App
NEXT_PUBLIC_APP_URL=https://YOUR_VERCEL_URL.vercel.app
NEXT_PUBLIC_WHATSAPP_NUMBER=917827527933
ADMIN_EMAIL=your-email@gmail.com
```

7. **Click "Deploy"**

## Step 3: Update Google OAuth

After deployment, you'll get a URL like: `https://mystic-paws.vercel.app`

1. **Go to:** https://console.cloud.google.com/apis/credentials
2. **Edit your OAuth Client**
3. **Add Authorized Redirect URI:**
   ```
   https://YOUR_VERCEL_URL.vercel.app/api/auth/callback/google
   ```
4. **Save**

## Step 4: Update Environment Variables

1. **Go to Vercel Dashboard** → Your Project → Settings → Environment Variables
2. **Update:**
   - `AUTH_URL` → Your actual Vercel URL
   - `NEXT_PUBLIC_APP_URL` → Your actual Vercel URL

3. **Redeploy** (Deployments tab → Click "..." → Redeploy)

## Step 5: Test!

Visit your live site and test:
- ✅ Sign in with Google
- ✅ Free tarot reading
- ✅ Payment flow (test mode)
- ✅ WhatsApp redirect

## Going Live with Real Payments

When ready for real payments:

1. **Complete Razorpay KYC**
2. **Get Live Mode keys** from Razorpay
3. **Update Vercel env vars:**
   - `RAZORPAY_KEY_ID` → Live key
   - `RAZORPAY_KEY_SECRET` → Live secret
4. **Redeploy**

## Custom Domain (Optional)

1. **Buy domain** (Namecheap, GoDaddy, etc.)
2. **Vercel Dashboard** → Settings → Domains
3. **Add your domain**
4. **Update DNS** as instructed
5. **Update all URLs** in env vars and Google OAuth

---

**That's it! Your app is live! 🚀**
