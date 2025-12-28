-- 1. Create CUSTOMERS table
create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  first_name text,
  last_name text,
  email text,
  phone text,
  company_name text,
  status text default 'active',
  tags text[] default array[]::text[],
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Create DEALS table
create table if not exists public.deals (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  customer_id uuid references public.customers(id) on delete set null,
  title text not null,
  value decimal(12, 2) default 0,
  currency text default 'USD',
  stage text default 'lead',
  expected_close_date date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Create TICKETS table
create table if not exists public.tickets (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  customer_id uuid references public.customers(id) on delete set null,
  title text not null,
  description text,
  priority text default 'medium',
  status text default 'open',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.customers enable row level security;
alter table public.deals enable row level security;
alter table public.tickets enable row level security;

-- Policies --
-- We use a common logic: User can access rows if they own the linked BUSINESS.

-- CUSTOMERS Policies
create policy "Users can view own business customers"
  on public.customers for select
  using (
    exists (
      select 1 from public.businesses b
      where b.id = customers.business_id
      and b.user_id = auth.uid()
    )
  );

create policy "Users can insert own business customers"
  on public.customers for insert
  with check (
    exists (
      select 1 from public.businesses b
      where b.id = customers.business_id
      and b.user_id = auth.uid()
    )
  );

create policy "Users can update own business customers"
  on public.customers for update
  using (
    exists (
      select 1 from public.businesses b
      where b.id = customers.business_id
      and b.user_id = auth.uid()
    )
  );

create policy "Users can delete own business customers"
  on public.customers for delete
  using (
    exists (
      select 1 from public.businesses b
      where b.id = customers.business_id
      and b.user_id = auth.uid()
    )
  );

-- DEALS Policies
create policy "Users can view own business deals"
  on public.deals for select
  using (
    exists (
      select 1 from public.businesses b
      where b.id = deals.business_id
      and b.user_id = auth.uid()
    )
  );

create policy "Users can insert own business deals"
  on public.deals for insert
  with check (
    exists (
      select 1 from public.businesses b
      where b.id = deals.business_id
      and b.user_id = auth.uid()
    )
  );

create policy "Users can update own business deals"
  on public.deals for update
  using (
    exists (
      select 1 from public.businesses b
      where b.id = deals.business_id
      and b.user_id = auth.uid()
    )
  );

create policy "Users can delete own business deals"
  on public.deals for delete
  using (
    exists (
      select 1 from public.businesses b
      where b.id = deals.business_id
      and b.user_id = auth.uid()
    )
  );

-- TICKETS Policies
create policy "Users can view own business tickets"
  on public.tickets for select
  using (
    exists (
      select 1 from public.businesses b
      where b.id = tickets.business_id
      and b.user_id = auth.uid()
    )
  );

create policy "Users can insert own business tickets"
  on public.tickets for insert
  with check (
    exists (
      select 1 from public.businesses b
      where b.id = tickets.business_id
      and b.user_id = auth.uid()
    )
  );

create policy "Users can update own business tickets"
  on public.tickets for update
  using (
    exists (
      select 1 from public.businesses b
      where b.id = tickets.business_id
      and b.user_id = auth.uid()
    )
  );

create policy "Users can delete own business tickets"
  on public.tickets for delete
  using (
    exists (
      select 1 from public.businesses b
      where b.id = tickets.business_id
      and b.user_id = auth.uid()
    )
  );

-- Triggers (using existing function)
create trigger handle_customers_updated_at
  before update on public.customers
  for each row execute procedure public.handle_updated_at();

create trigger handle_deals_updated_at
  before update on public.deals
  for each row execute procedure public.handle_updated_at();

create trigger handle_tickets_updated_at
  before update on public.tickets
  for each row execute procedure public.handle_updated_at();

-- Indexes
create index customers_business_id_idx on public.customers(business_id);
create index deals_business_id_idx on public.deals(business_id);
create index deals_customer_id_idx on public.deals(customer_id);
create index tickets_business_id_idx on public.tickets(business_id);
create index tickets_customer_id_idx on public.tickets(customer_id);
