# SIP Tracker - Setup Guide

Complete setup instructions to get the SIP Tracker app running.

## Prerequisites

- Node.js 20.19+ or 22.12+ (check with `node --version`)
- npm (comes with Node.js)
- A Supabase account (free tier works)

## Step 1: Clone and Install Dependencies

```bash
# If you haven't already cloned the repo
cd finance-management

# Install dependencies
npm install
```

## Step 2: Set Up Supabase

### 2.1 Create a Supabase Project

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in:
   - **Name**: SIP Tracker (or any name)
   - **Database Password**: Choose a strong password (save it!)
   - **Region**: Choose closest to you
   - **Pricing Plan**: Free tier is fine
5. Click "Create new project" and wait ~2 minutes

### 2.2 Get Your Supabase Credentials

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Find these values:
   - **Project URL** (under "Project URL")
   - **anon/public key** (under "Project API keys" → "anon public")

### 2.3 Run Database Schema

1. In Supabase dashboard, go to **SQL Editor**
2. Click "New query"
3. Copy and paste the entire contents of `supabase/schema.sql`
4. Click "Run" (or press Cmd/Ctrl + Enter)
5. Wait for success message

### 2.4 Seed Asset Categories

1. Still in SQL Editor, click "New query"
2. Copy and paste the contents of `supabase/seed.sql`
3. Click "Run"
4. Verify: Go to **Table Editor** → `asset_categories` → you should see 5 categories

### 2.5 Enable Email Auth (Optional but Recommended)

1. Go to **Authentication** → **Providers**
2. Enable **Email** provider (should be enabled by default)
3. Optionally configure email templates under **Email Templates**

## Step 3: Configure Environment Variables

1. Copy the example file:
   ```bash
   cp .env.example .env
   ```

2. Open `.env` and fill in your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

   Replace with your actual values from Step 2.2.

## Step 4: Start the Development Server

```bash
npm run dev
```

The app should open at `http://localhost:5173` (or another port if 5173 is busy).

## Step 5: Create Your First Account

1. The app will redirect to the login page
2. Click "New here? Create an account"
3. Enter:
   - Email (use a real email if you want to verify)
   - Password (min 6 characters)
4. Click "Create account"
5. You'll be logged in automatically

## Step 6: Start Using the App

### Create Your First Asset

1. Click "Assets" in the bottom nav (or go to `/assets`)
2. Click "Add asset"
3. Fill in:
   - **Asset name**: e.g., "Nifty 50 Index Fund"
   - **Category**: Select "Mutual Fund"
   - **Symbol** (optional): e.g., "NIFTY50"
4. Click "Save asset"

### Add an Investment Entry

1. Click "Investments" → "Add investment"
2. Select your asset
3. Enter:
   - **Amount**: e.g., 5000
   - **Date**: Today or any past date
   - **Type**: SIP or Lump Sum
   - **Units** (optional): e.g., 45.67
   - **Price per unit** (optional): e.g., 109.50
4. Click "Save investment"

### Update Asset Price

1. Go to an asset detail page
2. Click "Update price"
3. Enter:
   - **Price per unit**: Current market price
   - **Price date**: Today
4. Click "Save price"

The dashboard will now show calculated returns!

## Step 7: Build for Production

```bash
npm run build
```

Output will be in the `dist/` folder. Deploy this to any static hosting (Vercel, Netlify, etc.).

## Troubleshooting

### "Missing Supabase env vars" Warning

- Check that `.env` exists and has correct values
- Restart the dev server after changing `.env`
- Ensure variable names start with `VITE_`

### Database Errors

- Verify schema.sql ran successfully
- Check RLS policies are enabled (they should be from schema.sql)
- Ensure you're logged in (auth is required for all queries)

### Authentication Issues

- Check Supabase project is active (not paused)
- Verify email provider is enabled in Supabase dashboard
- Check browser console for specific error messages

### Build Errors

- Run `npm run build` to see full error messages
- Ensure all TypeScript types are correct
- Check that all imports resolve correctly

## Testing

Run unit tests:

```bash
npm run test
```

## Project Structure

```
src/
├── app/              # App shell, routes, providers
├── components/       # Reusable UI components
├── features/         # Feature modules
│   ├── auth/        # Authentication
│   ├── assets/       # Asset management
│   ├── investments/ # Investment tracking
│   ├── calculations/# Financial calculations
│   └── sip-calculator/ # SIP projection tool
├── lib/              # Utilities, Supabase client
├── pages/            # Page components
└── types/            # Shared TypeScript types
```

## Next Steps

- Add more assets and investments
- Use the SIP Calculator for projections
- View detailed metrics on asset detail pages
- Track your portfolio growth over time

## Support

For issues or questions:
- Check Supabase logs in dashboard → Logs
- Review browser console for client-side errors
- Verify database schema matches `supabase/schema.sql`
