# 🚀 Quick Deployment Checklist

## ✅ Pre-Deployment (Done!)
- [x] Code committed to git
- [x] Environment variables documented
- [x] Database connected (Neon)
- [x] All features tested locally

## 📋 Deployment Steps

### 1. Create GitHub Repository
```bash
# Go to: https://github.com/new
# Repository name: mystic-paws
# Make it Public or Private
# Don't initialize with README (we already have one)

# Then run:
git remote add origin https://github.com/YOUR_USERNAME/mystic-paws.git
git branch -M main
git push -u origin main
```

### 2. Deploy to Vercel
1. Go to: https://vercel.com/signup
2. Sign up with GitHub
3. Click "Add New Project"
4. Import your `mystic-paws` repo
5. Click "Deploy" (it will fail first - that's OK!)

### 3. Add Environment Variables in Vercel
Go to: Project Settings → Environment Variables

Add these (copy from your `.env.local`):

```
DATABASE_URL=postgresql://neondb_owner:npg_pnHR1wMh6lPd@ep-snowy-frost-ansum0fa.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require

AUTH_SECRET=4m/yfRMKc6zAY4qdpCQuevLr35N4twp2Z+j5UfzJl+s=
AUTH_URL=https://YOUR-PROJECT.vercel.app
AUTH_GOOGLE_ID=534620187100-8sa90figafl46tf761cua531ktgco762.apps.googleusercontent.com
AUTH_GOOGLE_SECRET=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

GROQ_API_KEY=gsk_YOUR_GROQ_KEY_HERE

RAZORPAY_KEY_ID=rzp_test_SlCCAqa1814mnx
RAZORPAY_KEY_SECRET=V9l5OxI9OQrGlDApD48Cfx4R

NEXT_PUBLIC_APP_URL=https://YOUR-PROJECT.vercel.app
NEXT_PUBLIC_WHATSAPP_NUMBER=917827527933
ADMIN_EMAIL=your-email@gmail.com
```

**Important:** Replace `YOUR-PROJECT.vercel.app` with your actual Vercel URL!

### 4. Redeploy
- Go to Deployments tab
- Click "..." on latest deployment
- Click "Redeploy"

### 5. Update Google OAuth
1. Go to: https://console.cloud.google.com/apis/credentials
2. Click your OAuth Client ID
3. Add to "Authorized redirect URIs":
   ```
   https://YOUR-PROJECT.vercel.app/api/auth/callback/google
   ```
4. Save

### 6. Test Your Live Site! 🎉
Visit: `https://YOUR-PROJECT.vercel.app`

Test:
- ✅ Homepage loads
- ✅ Sign in with Google
- ✅ Free reading works
- ✅ Payment modal opens
- ✅ Test payment works
- ✅ WhatsApp button redirects correctly

---

## 🎯 Next Steps (Optional)

### Custom Domain
1. Buy domain (Namecheap, GoDaddy, etc.)
2. Vercel → Settings → Domains → Add
3. Update DNS records
4. Update all URLs in env vars

### Go Live with Real Payments
1. Complete Razorpay KYC
2. Get Live Mode keys
3. Update `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`
4. Redeploy

---

**Need help?** Check `DEPLOYMENT.md` for detailed instructions!
