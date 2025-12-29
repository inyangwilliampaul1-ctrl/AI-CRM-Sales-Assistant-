-- Add onboarding columns to businesses table for enhanced signup
alter table public.businesses
  add column if not exists industry text,
  add column if not exists team_size text,
  add column if not exists country text default 'Nigeria';

-- Add column comments for documentation
comment on column public.businesses.industry is 'Business industry: Retail, Tech, Services, Education, Healthcare, Other';
comment on column public.businesses.team_size is 'Team size range: 1-5, 6-20, 21-50, 50+';
comment on column public.businesses.country is 'Country where the business operates';
