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
  symbol text,
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
  amount decimal(15,2) not null,
  units decimal(18,6),
  price_per_unit decimal(18,6),
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
  source text default 'manual',
  created_at timestamptz default now(),
  unique(asset_id, price_date)
);

create index idx_investments_asset_id on public.investments(asset_id);
create index idx_investments_user_id on public.investments(user_id);
create index idx_investments_date on public.investments(investment_date);
create index idx_price_history_asset_date on public.price_history(asset_id, price_date desc);

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.assets enable row level security;
alter table public.investments enable row level security;
alter table public.price_history enable row level security;
alter table public.asset_categories enable row level security;

-- Profiles policies
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

-- Assets policies
create policy "Users can view own assets" on public.assets
  for select using (auth.uid() = user_id);
create policy "Users can insert own assets" on public.assets
  for insert with check (auth.uid() = user_id);
create policy "Users can update own assets" on public.assets
  for update using (auth.uid() = user_id);
create policy "Users can delete own assets" on public.assets
  for delete using (auth.uid() = user_id);

-- Investments policies
create policy "Users can view own investments" on public.investments
  for select using (auth.uid() = user_id);
create policy "Users can insert own investments" on public.investments
  for insert with check (auth.uid() = user_id);
create policy "Users can update own investments" on public.investments
  for update using (auth.uid() = user_id);
create policy "Users can delete own investments" on public.investments
  for delete using (auth.uid() = user_id);

-- Price history policies
create policy "Users can view own prices" on public.price_history
  for select using (auth.uid() = user_id);
create policy "Users can insert own prices" on public.price_history
  for insert with check (auth.uid() = user_id);
create policy "Users can update own prices" on public.price_history
  for update using (auth.uid() = user_id);
create policy "Users can delete own prices" on public.price_history
  for delete using (auth.uid() = user_id);

-- Asset categories policies
create policy "Categories are public" on public.asset_categories
  for select using (auth.role() = 'authenticated');
