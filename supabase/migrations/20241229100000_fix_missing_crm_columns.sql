-- Fix missing columns in customers and deals tables
-- Likely caused by IF NOT EXISTS checks skipping updates on existing tables

-- 1. Updates for CUSTOMERS
ALTER TABLE public.customers 
ADD COLUMN IF NOT EXISTS company_name text,
ADD COLUMN IF NOT EXISTS status text default 'active',
ADD COLUMN IF NOT EXISTS tags text[] default array[]::text[];

-- 2. Updates for DEALS
ALTER TABLE public.deals
ADD COLUMN IF NOT EXISTS currency text default 'USD';
