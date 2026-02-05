# Quick Start Checklist ✅

Follow these steps in order to get the app running:

## Prerequisites Check
- [ ] Node.js installed (`node --version` should show 20.19+ or 22.12+)
- [ ] npm installed (`npm --version`)
- [ ] Supabase account created at [supabase.com](https://app.supabase.com)

## Step 1: Install Dependencies (2 minutes)
```bash
npm install
```

## Step 2: Supabase Setup (5 minutes)

### 2.1 Create Project
- [ ] Go to [app.supabase.com](https://app.supabase.com)
- [ ] Click "New Project"
- [ ] Fill in project details (name, password, region)
- [ ] Wait for project to be ready (~2 minutes)

### 2.2 Get Credentials
- [ ] Go to Settings → API
- [ ] Copy **Project URL**
- [ ] Copy **anon/public key**

### 2.3 Run Database Schema
- [ ] Go to SQL Editor in Supabase dashboard
- [ ] Click "New query"
- [ ] Open `supabase/schema.sql` from this project
- [ ] Copy entire contents and paste into SQL Editor
- [ ] Click "Run" (Cmd/Ctrl + Enter)
- [ ] Verify success message

### 2.4 Seed Categories
- [ ] Still in SQL Editor, click "New query"
- [ ] Open `supabase/seed.sql` from this project
- [ ] Copy contents and paste into SQL Editor
- [ ] Click "Run"
- [ ] Verify: Go to Table Editor → `asset_categories` → should see 5 rows

## Step 3: Configure Environment (1 minute)
```bash
cp .env.example .env
```

Then edit `.env` and replace:
- `VITE_SUPABASE_URL` with your Project URL
- `VITE_SUPABASE_ANON_KEY` with your anon key

## Step 4: Start App (30 seconds)
```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

## Step 5: Create Account (1 minute)
- [ ] Click "New here? Create an account"
- [ ] Enter email and password (min 6 chars)
- [ ] Click "Create account"
- [ ] You'll be logged in automatically

## Step 6: First Use (2 minutes)

### Create Asset
- [ ] Click "Assets" in bottom nav
- [ ] Click "Add asset"
- [ ] Fill in:
  - Name: "Nifty 50 Index Fund"
  - Category: "Mutual Fund"
  - Symbol (optional): "NIFTY50"
- [ ] Click "Save asset"

### Add Investment
- [ ] Click "Investments" → "Add investment"
- [ ] Select your asset
- [ ] Enter:
  - Amount: 5000
  - Date: Today
  - Type: SIP
- [ ] Click "Save investment"

### Update Price
- [ ] Go to asset detail page
- [ ] Click "Update price"
- [ ] Enter:
  - Price: 115.25
  - Date: Today
- [ ] Click "Save price"

✅ **You're done!** The dashboard should now show your portfolio metrics.

## Troubleshooting

### App won't start
- Check Node.js version: `node --version`
- Delete `node_modules` and run `npm install` again
- Check `.env` file exists and has correct values

### "Missing Supabase env vars" warning
- Verify `.env` file exists in project root
- Check variable names start with `VITE_`
- Restart dev server after editing `.env`

### Database errors
- Verify schema.sql ran successfully
- Check RLS policies are enabled (should be automatic)
- Ensure you're logged in

### Can't create account
- Check Supabase project is active (not paused)
- Verify Email provider is enabled in Authentication → Providers
- Check browser console for specific errors

## Next Steps
- Add more assets and investments
- Try the SIP Calculator
- View detailed metrics on asset pages
- Track portfolio growth over time

For detailed instructions, see [SETUP.md](./SETUP.md)
