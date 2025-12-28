-- Create businesses table
create table if not exists public.businesses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  -- Enforce 1:1 relationship for MVP (Each user owns exactly one business)
  constraint businesses_user_id_key unique (user_id)
);

-- Enable Row Level Security
alter table public.businesses enable row level security;

-- Policies --

-- 1. View: Users can only see their own business
create policy "Users can view their own business"
  on public.businesses for select
  using (auth.uid() = user_id);

-- 2. Update: Users can only update their own business
create policy "Users can update their own business"
  on public.businesses for update
  using (auth.uid() = user_id);

-- 3. Insert: Users can create their own business (ensuring they set user_id to themselves)
create policy "Users can create their own business"
  on public.businesses for insert
  with check (auth.uid() = user_id);

-- 4. Delete: Users can delete their own business
create policy "Users can delete their own business"
  on public.businesses for delete
  using (auth.uid() = user_id);

-- Trigger for updating 'updated_at' timestamp automatically
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

create trigger handle_businesses_updated_at
  before update on public.businesses
  for each row
  execute procedure public.handle_updated_at();

-- Indexes for performance
create index businesses_user_id_idx on public.businesses(user_id);
