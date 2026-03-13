# Instagram Basic Display API Setup Guide

## Get Free Instagram Access Token (No Paid Service)

### Step 1: Create Meta App
1. Go to https://developers.facebook.com/
2. Click "Get Started" → Sign in with your Meta account
3. Go to "My Apps" → Click "Create App"
4. Choose "Consumer" as app type
5. Fill in the app details and create

### Step 2: Set Up Instagram Basic Display
1. In your app dashboard, click "Add Product"
2. Find "Instagram Basic Display" and click "Set Up"
3. Choose your app type and follow setup

### Step 3: Add Instagram Account
1. Go to "Instagram Basic Display" settings
2. Add your Instagram account as a tester
3. Your Instagram account needs to be a Business or Creator account

### Step 4: Create Access Token
1. In Instagram Basic Display settings, scroll to "User Token Generator"
2. Select your Instagram account
3. Grant permissions when prompted
4. Copy the generated token (this is your access token)

### Step 5: Add to Environment Variables
Create `.env.local` file in your project root (same level as `package.json`):

```
INSTAGRAM_ACCESS_TOKEN=your_token_here
```

⚠️ **Important**: Do NOT use `NEXT_PUBLIC_` prefix - this token should remain private and only used on the server

### Step 6: Restart Dev Server
```bash
npm run dev
```

## Token Validity
- Short-lived tokens: Valid for 1 hour
- Long-lived tokens: Valid for ~60 days

To get a long-lived token, request it from the API using your short-lived token.

## Test Your Setup
Your Instagram feed should now display automatically with recent posts from @darjeelingcabs

## Troubleshooting

**No posts showing?**
- Check token is valid and not expired
- Make sure Instagram account is set as tester
- Check browser console for errors

**Getting errors?**
- Verify token in .env.local
- Check Instagram account is Business/Creator account
- Make sure NEXT_PUBLIC_ prefix is used

## Free Limits
- Instagram Basic Display API is free
- Up to 20 calls per 24 hours (per user)
- No cost for displaying images/videos
