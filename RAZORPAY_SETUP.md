# Razorpay Setup Guide

## Step 1: Create Razorpay Account

1. Go to https://dashboard.razorpay.com/signup
2. Sign up with your email
3. Complete KYC (business details, bank account, PAN, etc.)
4. **Note:** You can use TEST MODE immediately without KYC!

## Step 2: Get API Keys

1. Go to https://dashboard.razorpay.com/app/keys
2. You'll see two modes:
   - **Test Mode** (for testing - works immediately)
   - **Live Mode** (for real payments - requires KYC approval)

3. Copy your keys:
   - **Key ID**: `rzp_test_...` (for test mode)
   - **Key Secret**: Click "Generate Secret" and copy

## Step 3: Add to .env.local

```bash
RAZORPAY_KEY_ID="rzp_test_YOUR_KEY_ID"
RAZORPAY_KEY_SECRET="YOUR_KEY_SECRET"
```

## Step 4: Test Payments

In **Test Mode**, use these test cards:
- **Card Number**: 4111 1111 1111 1111
- **CVV**: Any 3 digits
- **Expiry**: Any future date
- **Name**: Any name

Or test UPI:
- **UPI ID**: success@razorpay
- **UPI ID (fail)**: failure@razorpay

## Step 5: Go Live (When Ready)

1. Complete KYC verification
2. Add bank account details
3. Switch to Live Mode keys
4. Update `.env.local` with live keys

## Payment Flow

1. User clicks "Pay ₹50/₹100"
2. Razorpay popup opens
3. User pays via UPI/Card/Wallet
4. Money goes to your bank account
5. User gets their reading

## Fees

- **Test Mode**: FREE
- **Live Mode**: 2% per transaction
- No setup fees, no monthly fees

## Your Money

Payments are automatically transferred to your bank account:
- **Instant settlements**: Available after KYC
- **Standard**: T+2 days (2 days after payment)

You don't need to give UPI ID - Razorpay sends money directly to your bank!
