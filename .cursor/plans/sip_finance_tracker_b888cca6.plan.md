---
name: SIP Finance Tracker
overview: Design and implement a production-ready personal finance PWA for SIP tracking with Vite + React + TypeScript, Tailwind CSS, shadcn/ui, and Supabase, featuring investment logging, automated SIP calculations, and a standalone SIP calculator.
todos:
  - id: setup-project
    content: Initialize Vite + React + TS, configure Tailwind, shadcn/ui, and PWA
    status: completed
  - id: setup-supabase
    content: Create Supabase tables, RLS policies, and generate TypeScript types
    status: completed
  - id: auth-flow
    content: Implement authentication (login, register, logout, auth guard)
    status: completed
  - id: assets-feature
    content: "Build asset CRUD: list, create, edit, delete assets"
    status: completed
  - id: investments-feature
    content: Build investment entry CRUD with backdating support
    status: completed
  - id: price-history
    content: Implement manual price updates and price history tracking
    status: completed
  - id: calculations
    content: Implement XIRR, returns, and portfolio metrics calculations
    status: completed
  - id: sip-calculator
    content: Build standalone SIP calculator (non-persistent)
    status: completed
  - id: dashboard
    content: Create dashboard with portfolio summary and quick actions
    status: completed
  - id: ui-polish
    content: Add empty states, loading states, responsive design, PWA manifest
    status: completed
isProject: false
---

# SIP Finance Tracker - Implementation Plan

## 1. Product Overview

A clean, mobile-first personal finance PWA that enables users to track their systematic investment plans (SIPs) and lump-sum investments. Users can manually log investment entries with backdating support, update asset prices, and view automatically calculated returns (total invested, current value, absolute returns, XIRR). The app includes a standalone SIP calculator for projections without affecting stored data. Built with Supabase for auth and data persistence, the architecture supports future automation of price fetching without schema changes.

---

## 2. User Flows

### Flow 1: Add Investment Entry

```
Login → Dashboard → "Add Investment" → Select/Create Asset → Enter Details (amount, date, units, price, type) → Save → Return to Dashboard (updated totals)
```

### Flow 2: View SIP Performance

```
Dashboard → Select Asset → View grouped monthly entries → See calculated returns (invested, current value, returns %, XIRR)
```

### Flow 3: Update Asset Price

```
Dashboard → Select Asset → "Update Price" → Enter new price + date → Save → Calculations auto-refresh
```

### Flow 4: Use SIP Calculator

```
Dashboard → "SIP Calculator" → Enter monthly amount, duration, expected return → View projected corpus → (No data saved)
```

---

## 3. Database Schema + RLS

### Tables

```sql
-- Users (managed by Supabase Auth, extended with profile)
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  display_name text,
  currency text default 'INR',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Asset Categories (enum-like reference table)
create table public.asset_categories (
  id text primary key, -- 'mutual_fund', 'etf', 'stock', 'crypto', 'other'
  label text not null,
  sort_order int default 0
);

-- Assets / Instruments
create table public.assets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  category_id text references public.asset_categories(id) not null,
  symbol text, -- optional, for future price APIs
  notes text,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Investment Entries
create table public.investments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  asset_id uuid references public.assets(id) on delete cascade not null,
  amount decimal(15,2) not null, -- amount invested
  units decimal(18,6), -- nullable for assets without units
  price_per_unit decimal(18,6), -- price at time of investment
  investment_date date not null,
  investment_type text not null check (investment_type in ('sip', 'lump_sum')),
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Price History (decoupled for future automation)
create table public.price_history (
  id uuid primary key default gen_random_uuid(),
  asset_id uuid references public.assets(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  price decimal(18,6) not null,
  price_date date not null,
  source text default 'manual', -- 'manual' | 'api' | 'import'
  created_at timestamptz default now(),
  unique(asset_id, price_date) -- one price per asset per day
);

-- Indexes for performance
create index idx_investments_asset_id on public.investments(asset_id);
create index idx_investments_user_id on public.investments(user_id);
create index idx_investments_date on public.investments(investment_date);
create index idx_price_history_asset_date on public.price_history(asset_id, price_date desc);
```

### RLS Policies

```sql
-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.assets enable row level security;
alter table public.investments enable row level security;
alter table public.price_history enable row level security;

-- Profiles: users can only access their own profile
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

-- Assets: users can only CRUD their own assets
create policy "Users can view own assets" on public.assets
  for select using (auth.uid() = user_id);
create policy "Users can insert own assets" on public.assets
  for insert with check (auth.uid() = user_id);
create policy "Users can update own assets" on public.assets
  for update using (auth.uid() = user_id);
create policy "Users can delete own assets" on public.assets
  for delete using (auth.uid() = user_id);

-- Investments: users can only CRUD their own investments
create policy "Users can view own investments" on public.investments
  for select using (auth.uid() = user_id);
create policy "Users can insert own investments" on public.investments
  for insert with check (auth.uid() = user_id);
create policy "Users can update own investments" on public.investments
  for update using (auth.uid() = user_id);
create policy "Users can delete own investments" on public.investments
  for delete using (auth.uid() = user_id);

-- Price History: users can only CRUD prices for their own assets
create policy "Users can view own prices" on public.price_history
  for select using (auth.uid() = user_id);
create policy "Users can insert own prices" on public.price_history
  for insert with check (auth.uid() = user_id);
create policy "Users can update own prices" on public.price_history
  for update using (auth.uid() = user_id);
create policy "Users can delete own prices" on public.price_history
  for delete using (auth.uid() = user_id);

-- Asset categories: readable by all authenticated users
create policy "Categories are public" on public.asset_categories
  for select using (auth.role() = 'authenticated');
```

### Example Data

```sql
-- Asset categories seed
insert into public.asset_categories (id, label, sort_order) values
  ('mutual_fund', 'Mutual Fund', 1),
  ('etf', 'ETF', 2),
  ('stock', 'Stock', 3),
  ('crypto', 'Cryptocurrency', 4),
  ('other', 'Other', 5);

-- Example asset
insert into public.assets (user_id, name, category_id, symbol) values
  ('user-uuid', 'Nifty 50 Index Fund', 'mutual_fund', 'NIFTY50');

-- Example investments
insert into public.investments (user_id, asset_id, amount, units, price_per_unit, investment_date, investment_type) values
  ('user-uuid', 'asset-uuid', 5000.00, 45.67, 109.50, '2025-01-15', 'sip'),
  ('user-uuid', 'asset-uuid', 5000.00, 44.25, 113.00, '2025-02-15', 'sip');

-- Example price history
insert into public.price_history (asset_id, user_id, price, price_date, source) values
  ('asset-uuid', 'user-uuid', 115.25, '2025-02-05', 'manual');
```

---

## 4. Calculation Logic

### 4.1 Core Metrics

| Metric | Formula | Notes |

|--------|---------|-------|

| **Total Invested** | `SUM(investment.amount)` | Sum of all investment amounts |

| **Total Units** | `SUM(investment.units)` | Sum of all units acquired |

| **Current Value** | `total_units × latest_price` | Latest price from price_history |

| **Absolute Return** | `current_value - total_invested` | Profit/Loss in currency |

| **Return %** | `(absolute_return / total_invested) × 100` | Simple return percentage |

### 4.2 XIRR Calculation

XIRR (Extended Internal Rate of Return) is the annualized return considering irregular cash flows.

```typescript
// XIRR uses Newton-Raphson iteration
// Cash flows: negative for investments, positive for current value
// Dates: corresponding dates for each cash flow

interface CashFlow {
  amount: number; // negative for outflow (investment), positive for inflow
  date: Date;
}

function calculateXIRR(cashFlows: CashFlow[], guess = 0.1): number {
  const DAYS_PER_YEAR = 365;
  const MAX_ITERATIONS = 100;
  const TOLERANCE = 1e-7;
  
  const startDate = cashFlows[0].date;
  
  // NPV function
  const npv = (rate: number): number => {
    return cashFlows.reduce((sum, cf) => {
      const years = (cf.date.getTime() - startDate.getTime()) / (DAYS_PER_YEAR * 24 * 60 * 60 * 1000);
      return sum + cf.amount / Math.pow(1 + rate, years);
    }, 0);
  };
  
  // NPV derivative
  const npvDerivative = (rate: number): number => {
    return cashFlows.reduce((sum, cf) => {
      const years = (cf.date.getTime() - startDate.getTime()) / (DAYS_PER_YEAR * 24 * 60 * 60 * 1000);
      return sum - years * cf.amount / Math.pow(1 + rate, years + 1);
    }, 0);
  };
  
  // Newton-Raphson iteration
  let rate = guess;
  for (let i = 0; i < MAX_ITERATIONS; i++) {
    const npvValue = npv(rate);
    if (Math.abs(npvValue) < TOLERANCE) break;
    rate = rate - npvValue / npvDerivative(rate);
  }
  
  return rate; // Annualized return (e.g., 0.12 = 12%)
}
```

### 4.3 SIP Calculator (Non-Persistent)

```typescript
interface SIPCalculation {
  monthlyInvestment: number;
  durationMonths: number;
  expectedAnnualReturn: number; // as decimal, e.g., 0.12 for 12%
}

interface SIPResult {
  totalInvested: number;
  estimatedReturns: number;
  finalCorpus: number;
}

function calculateSIP(input: SIPCalculation): SIPResult {
  const { monthlyInvestment, durationMonths, expectedAnnualReturn } = input;
  
  // Monthly rate
  const monthlyRate = expectedAnnualReturn / 12;
  
  // Future Value of SIP: P × [(1+r)^n - 1] / r × (1+r)
  const futureValue = monthlyInvestment * 
    ((Math.pow(1 + monthlyRate, durationMonths) - 1) / monthlyRate) * 
    (1 + monthlyRate);
  
  const totalInvested = monthlyInvestment * durationMonths;
  
  return {
    totalInvested,
    estimatedReturns: futureValue - totalInvested,
    finalCorpus: futureValue
  };
}
```

### 4.4 Monthly Grouping Logic

```typescript
// Group investments by month for SIP tracking
function groupByMonth(investments: Investment[]): Map<string, Investment[]> {
  return investments.reduce((map, inv) => {
    const key = `${inv.investment_date.getFullYear()}-${String(inv.investment_date.getMonth() + 1).padStart(2, '0')}`;
    const existing = map.get(key) || [];
    map.set(key, [...existing, inv]);
    return map;
  }, new Map<string, Investment[]>());
}
```

---

## 5. Frontend Folder Structure

```
src/
├── app/                          # App shell
│   ├── App.tsx                   # Root component with providers
│   ├── routes.tsx                # Route definitions
│   └── providers/
│       ├── auth-provider.tsx
│       ├── query-provider.tsx
│       └── theme-provider.tsx
│
├── components/
│   ├── ui/                       # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── dialog.tsx
│   │   └── ...
│   ├── layout/
│   │   ├── app-shell.tsx         # Main layout with nav
│   │   ├── mobile-nav.tsx
│   │   └── header.tsx
│   └── shared/
│       ├── loading-spinner.tsx
│       ├── empty-state.tsx
│       ├── error-boundary.tsx
│       └── currency-display.tsx
│
├── features/
│   ├── auth/
│   │   ├── components/
│   │   │   ├── login-form.tsx
│   │   │   └── auth-guard.tsx
│   │   ├── hooks/
│   │   │   └── use-auth.ts
│   │   └── index.ts
│   │
│   ├── assets/
│   │   ├── components/
│   │   │   ├── asset-list.tsx
│   │   │   ├── asset-card.tsx
│   │   │   ├── asset-form.tsx
│   │   │   └── price-update-form.tsx
│   │   ├── hooks/
│   │   │   ├── use-assets.ts
│   │   │   └── use-asset-prices.ts
│   │   ├── api/
│   │   │   └── assets-api.ts
│   │   └── types.ts
│   │
│   ├── investments/
│   │   ├── components/
│   │   │   ├── investment-list.tsx
│   │   │   ├── investment-form.tsx
│   │   │   ├── investment-summary.tsx
│   │   │   └── monthly-breakdown.tsx
│   │   ├── hooks/
│   │   │   └── use-investments.ts
│   │   ├── api/
│   │   │   └── investments-api.ts
│   │   └── types.ts
│   │
│   ├── calculations/
│   │   ├── lib/
│   │   │   ├── xirr.ts           # XIRR calculation
│   │   │   ├── returns.ts        # Return calculations
│   │   │   └── sip-formula.ts    # SIP projection formula
│   │   ├── hooks/
│   │   │   └── use-portfolio-metrics.ts
│   │   └── types.ts
│   │
│   ├── sip-calculator/
│   │   ├── components/
│   │   │   ├── calculator-form.tsx
│   │   │   └── calculator-results.tsx
│   │   ├── hooks/
│   │   │   └── use-sip-calculator.ts
│   │   └── index.ts
│   │
│   └── dashboard/
│       ├── components/
│       │   ├── portfolio-summary.tsx
│       │   ├── recent-investments.tsx
│       │   └── quick-actions.tsx
│       └── index.ts
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts             # Supabase client instance
│   │   ├── types.ts              # Generated DB types
│   │   └── middleware.ts
│   ├── utils/
│   │   ├── format.ts             # Currency, date formatters
│   │   ├── date.ts               # Date utilities
│   │   └── cn.ts                 # Class name utility
│   └── constants.ts
│
├── hooks/
│   └── use-media-query.ts        # Responsive utilities
│
├── pages/
│   ├── dashboard.tsx
│   ├── assets/
│   │   ├── index.tsx             # Asset list
│   │   └── [id].tsx              # Asset detail
│   ├── investments/
│   │   ├── index.tsx
│   │   └── new.tsx
│   ├── sip-calculator.tsx
│   ├── login.tsx
│   └── not-found.tsx
│
├── styles/
│   └── globals.css               # Tailwind + custom styles
│
├── types/
│   └── index.ts                  # Shared types
│
├── main.tsx                      # Entry point
└── vite-env.d.ts
```

---

## 6. Key UI Screens (Text Wireframes)

### 6.1 Dashboard (Mobile)

```
┌─────────────────────────────────┐
│ ≡  SIP Tracker           [👤]   │
├─────────────────────────────────┤
│                                 │
│  ┌─────────────────────────┐    │
│  │  Portfolio Summary      │    │
│  │                         │    │
│  │  Total Invested         │    │
│  │  ₹2,50,000              │    │
│  │                         │    │
│  │  Current Value          │    │
│  │  ₹2,78,500    ▲ +11.4%  │    │
│  │                         │    │
│  │  Returns: ₹28,500       │    │
│  └─────────────────────────┘    │
│                                 │
│  Quick Actions                  │
│  ┌─────────┐  ┌─────────┐       │
│  │ + Add   │  │ 🧮 SIP  │       │
│  │ Entry   │  │ Calc    │       │
│  └─────────┘  └─────────┘       │
│                                 │
│  Your Assets                    │
│  ┌─────────────────────────┐    │
│  │ Nifty 50 Fund     ▲12%  │    │
│  │ ₹1,50,000 → ₹1,68,000   │    │
│  └─────────────────────────┘    │
│  ┌─────────────────────────┐    │
│  │ HDFC Balanced     ▲8%   │    │
│  │ ₹1,00,000 → ₹1,08,000   │    │
│  └─────────────────────────┘    │
│                                 │
├─────────────────────────────────┤
│  [🏠]    [📊]    [🧮]    [⚙️]  │
└─────────────────────────────────┘
```

### 6.2 Add Investment Entry

```
┌─────────────────────────────────┐
│ ← Add Investment                │
├─────────────────────────────────┤
│                                 │
│  Asset *                        │
│  ┌─────────────────────────┐    │
│  │ Select asset...       ▼ │    │
│  └─────────────────────────┘    │
│  [+ Create new asset]           │
│                                 │
│  Amount *                       │
│  ┌─────────────────────────┐    │
│  │ ₹ 5,000                 │    │
│  └─────────────────────────┘    │
│                                 │
│  Date *                         │
│  ┌─────────────────────────┐    │
│  │ 📅 Feb 5, 2026          │    │
│  └─────────────────────────┘    │
│                                 │
│  Type                           │
│  ┌─────────┐  ┌─────────┐       │
│  │ ● SIP   │  │ ○ Lump  │       │
│  └─────────┘  │   Sum   │       │
│               └─────────┘       │
│                                 │
│  Units (optional)               │
│  ┌─────────────────────────┐    │
│  │ 45.67                   │    │
│  └─────────────────────────┘    │
│                                 │
│  Price per unit (optional)      │
│  ┌─────────────────────────┐    │
│  │ ₹ 109.50                │    │
│  └─────────────────────────┘    │
│                                 │
│  ┌─────────────────────────┐    │
│  │      Save Investment    │    │
│  └─────────────────────────┘    │
│                                 │
└─────────────────────────────────┘
```

### 6.3 Asset Detail View

```
┌─────────────────────────────────┐
│ ← Nifty 50 Index Fund    [✏️]  │
├─────────────────────────────────┤
│                                 │
│  ┌─────────────────────────┐    │
│  │ Current Price: ₹115.25  │    │
│  │ Last updated: Today     │    │
│  │ [Update Price]          │    │
│  └─────────────────────────┘    │
│                                 │
│  ┌─────────────────────────┐    │
│  │ Invested     ₹1,50,000  │    │
│  │ Units        1,370.85   │    │
│  │ Curr. Value  ₹1,58,000  │    │
│  │ Returns      ₹8,000     │    │
│  │ XIRR         12.4%      │    │
│  └─────────────────────────┘    │
│                                 │
│  SIP History                    │
│  ────────────────────────────   │
│  Feb 2026                       │
│  • Feb 15: ₹5,000 (44.25 u)     │
│                                 │
│  Jan 2026                       │
│  • Jan 15: ₹5,000 (45.67 u)     │
│                                 │
│  Dec 2025                       │
│  • Dec 15: ₹5,000 (43.10 u)     │
│  ...                            │
│                                 │
│  ┌─────────────────────────┐    │
│  │    + Add Investment     │    │
│  └─────────────────────────┘    │
└─────────────────────────────────┘
```

### 6.4 SIP Calculator

```
┌─────────────────────────────────┐
│ ← SIP Calculator                │
├─────────────────────────────────┤
│                                 │
│  Monthly Investment             │
│  ┌─────────────────────────┐    │
│  │ ₹ 10,000                │    │
│  └─────────────────────────┘    │
│                                 │
│  Duration                       │
│  ┌─────────────────────────┐    │
│  │ 10 years            ▼   │    │
│  └─────────────────────────┘    │
│                                 │
│  Expected Return (p.a.)         │
│  ┌─────────────────────────┐    │
│  │ 12%                     │    │
│  └─────────────────────────┘    │
│                                 │
│  ═══════════════════════════    │
│                                 │
│  ┌─────────────────────────┐    │
│  │                         │    │
│  │  Total Invested         │    │
│  │  ₹12,00,000             │    │
│  │                         │    │
│  │  Est. Returns           │    │
│  │  ₹11,23,390             │    │
│  │                         │    │
│  │  Final Corpus           │    │
│  │  ₹23,23,390             │    │
│  │                         │    │
│  └─────────────────────────┘    │
│                                 │
│  ℹ️ This is a projection only.  │
│  Actual returns may vary.       │
│                                 │
└─────────────────────────────────┘
```

### 6.5 Empty State

```
┌─────────────────────────────────┐
│ ≡  SIP Tracker           [👤]   │
├─────────────────────────────────┤
│                                 │
│                                 │
│                                 │
│         📊                      │
│                                 │
│    No investments yet           │
│                                 │
│    Start tracking your SIPs     │
│    and watch your wealth grow   │
│                                 │
│    ┌─────────────────────┐      │
│    │  + Add First Asset  │      │
│    └─────────────────────┘      │
│                                 │
│                                 │
│                                 │
├─────────────────────────────────┤
│  [🏠]    [📊]    [🧮]    [⚙️]  │
└─────────────────────────────────┘
```

---

## 7. Phase-2 Upgrade Plan (Price Automation)

### Prepared Interfaces (Phase 1)

```typescript
// src/features/prices/types.ts
export interface PriceProvider {
  name: string;
  fetchPrice(symbol: string): Promise<PriceData | null>;
  getSupportedCategories(): AssetCategory[];
}

export interface PriceData {
  price: number;
  date: Date;
  source: string;
}

// src/features/prices/hooks/use-price-fetcher.ts (stub)
export function usePriceFetcher() {
  // Phase 1: Returns manual-only implementation
  return {
    fetchPrice: async () => null, // No-op in Phase 1
    isAutoEnabled: false,
    supportedSymbols: [],
  };
}
```

### Phase 2 Implementation Steps

1. **Add price provider integrations**

   - Create adapters for APIs (Yahoo Finance, NSE, CoinGecko)
   - Implement `PriceProvider` interface for each

2. **Add Supabase Edge Function for background sync**
   ```sql
   -- Add to price_history table
   alter table public.price_history 
     add column api_response jsonb; -- Store raw API response for audit
   ```

3. **Create scheduled job (Supabase pg_cron)**
   ```sql
   select cron.schedule(
     'fetch-prices',
     '0 18 * * 1-5', -- Weekdays at 6 PM
     $$select fetch_asset_prices()$$
   );
   ```

4. **Update UI**

   - Add "Auto-sync" toggle per asset
   - Show "Last synced" timestamp
   - Add manual refresh button

5. **Configuration**

   - Environment variables for API keys
   - Rate limiting logic
   - Error handling and retry

---

## 8. Implementation Steps

### Initial Setup

- Initialize Vite + React + TypeScript project
- Configure Tailwind CSS and shadcn/ui
- Set up Supabase project and environment variables
- Configure PWA with vite-plugin-pwa

### Database Setup

- Create Supabase tables with schema above
- Set up RLS policies
- Seed asset categories
- Generate TypeScript types with supabase-gen-types

### Core Features

- Implement auth flow (login, register, logout)
- Build asset CRUD operations
- Build investment entry CRUD
- Implement price history management

### Calculations Engine

- Implement XIRR calculation
- Build return metrics functions
- Create SIP projection calculator
- Add monthly grouping utilities

### UI Implementation

- Build app shell and navigation
- Create dashboard with portfolio summary
- Build asset list and detail views
- Create investment forms
- Build SIP calculator page
- Add empty states and loading states

### PWA and Polish

- Configure service worker
- Add offline support
- Implement app manifest
- Add responsive breakpoints
- Test across devices