-- İşler LearnTwin AI — Auth & Profiles Migration
-- Run this after enabling Auth in Supabase Dashboard

-- Profiles table extends auth.users managed by Supabase Auth
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('student', 'teacher', 'parent')),
  full_name text,
  avatar_url text,
  created_at timestamptz default now()
);

-- Enable RLS on profiles
alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone"
  on profiles for select
  using (true);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);

-- Trigger: automatically create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, role, full_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'role', 'student'),
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

-- Drop if exists to avoid duplicate trigger errors during re-runs
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Add profile_id to learning_twin_results for linking to real users
alter table learning_twin_results
  add column if not exists profile_id uuid references profiles(id);

-- Create index for fast lookups by profile
 create index if not exists idx_results_profile_id on learning_twin_results(profile_id);
