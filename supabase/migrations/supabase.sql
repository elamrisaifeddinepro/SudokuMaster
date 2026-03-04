-- Enable UUID generation
create extension if not exists pgcrypto;

-- Leaderboard table
create table if not exists public.leaderboard (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  player_name text not null,
  seconds integer not null check (seconds >= 0),
  difficulty text not null check (difficulty in ('easy','medium','hard','expert'))
);

-- Helpful index for sorting
create index if not exists leaderboard_seconds_idx on public.leaderboard (seconds asc);

-- Row Level Security
alter table public.leaderboard enable row level security;

-- Policies: allow anyone (anon) to read and insert
do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='leaderboard' and policyname='leaderboard_select_all'
  ) then
    create policy leaderboard_select_all
      on public.leaderboard
      for select
      to anon, authenticated
      using (true);
  end if;

  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='leaderboard' and policyname='leaderboard_insert_all'
  ) then
    create policy leaderboard_insert_all
      on public.leaderboard
      for insert
      to anon, authenticated
      with check (true);
  end if;
end $$;