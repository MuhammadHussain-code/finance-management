-- Add currency to assets with a default of Rs
alter table public.assets
  add column if not exists currency text not null default 'Rs';
