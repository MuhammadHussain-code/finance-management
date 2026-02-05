-- Migration: Add theme_preferences column to profiles table
-- Run this migration if you have an existing database

-- Add theme_preferences column with default value
alter table public.profiles 
add column if not exists theme_preferences jsonb 
default '{"mode": "system", "palette": "finance-calm", "customColors": null}'::jsonb;

-- Add comment for documentation
comment on column public.profiles.theme_preferences is 'User theme preferences including mode (light/dark/system), palette, and custom color overrides';
