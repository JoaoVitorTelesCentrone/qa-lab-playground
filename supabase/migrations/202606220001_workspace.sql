-- QA Lab Workspace: schema base, isolamento por usuário e preparação de planos.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique check (username is null or username ~ '^[a-z0-9][a-z0-9_-]{2,29}$'),
  full_name text,
  avatar_url text,
  bio text check (char_length(bio) <= 280),
  linkedin_url text,
  role text default 'QA Iniciante',
  plan text not null default 'free' check (plan in ('free', 'pro', 'team')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.profiles add column if not exists plan text not null default 'free';

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 100),
  description text not null default '' check (char_length(description) <= 1000),
  status text not null default 'active' check (status in ('active', 'archived')),
  color text not null default 'mint' check (color in ('mint', 'coral', 'neon')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists projects_user_updated_idx on public.projects(user_id, updated_at desc);

create table if not exists public.drafts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  project_id uuid references public.projects(id) on delete cascade,
  kind text not null default 'note' check (kind in ('note', 'bug_report', 'test_case', 'gherkin', 'test_plan')),
  title text not null check (char_length(title) between 1 and 120),
  content text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists drafts_user_updated_idx on public.drafts(user_id, updated_at desc);

create table if not exists public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  resource_type text not null check (resource_type in ('playground', 'mission', 'article', 'tool')),
  resource_id text not null,
  title text not null,
  href text not null check (href like '/%'),
  created_at timestamptz not null default now(),
  unique(user_id, resource_type, resource_id)
);

create table if not exists public.mission_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  mission_id text not null,
  status text not null default 'completed' check (status in ('in_progress', 'completed')),
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  unique(user_id, mission_id)
);
alter table public.mission_progress add column if not exists updated_at timestamptz not null default now();

create table if not exists public.playground_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  playground_id text not null,
  status text not null default 'started' check (status in ('started', 'completed')),
  findings_count integer not null default 0 check (findings_count >= 0),
  notes text not null default '',
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  updated_at timestamptz not null default now()
);

create index if not exists playground_sessions_user_updated_idx on public.playground_sessions(user_id, updated_at desc);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  provider text check (provider in ('stripe', 'mercado_pago')),
  provider_customer_id text unique,
  provider_subscription_id text unique,
  plan text not null default 'free' check (plan in ('free', 'pro', 'team')),
  status text not null default 'inactive' check (status in ('inactive', 'trialing', 'active', 'past_due', 'canceled')),
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.audit_events (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete set null,
  event_type text not null,
  entity_type text,
  entity_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.drafts enable row level security;
alter table public.favorites enable row level security;
alter table public.mission_progress enable row level security;
alter table public.playground_sessions enable row level security;
alter table public.subscriptions enable row level security;
alter table public.audit_events enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
drop policy if exists "Perfis públicos são visíveis" on public.profiles;
drop policy if exists "Usuário gerencia seu próprio perfil" on public.profiles;
create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);

create or replace function public.can_create_project() returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce((select plan <> 'free' from public.profiles where id = auth.uid()), false)
    or (select count(*) from public.projects where user_id = auth.uid() and status = 'active') < 3
$$;
revoke all on function public.can_create_project() from public, anon;
grant execute on function public.can_create_project() to authenticated;

drop policy if exists "projects_own" on public.projects;
drop policy if exists "projects_select_own" on public.projects;
drop policy if exists "projects_insert_own" on public.projects;
drop policy if exists "projects_update_own" on public.projects;
drop policy if exists "projects_delete_own" on public.projects;
create policy "projects_select_own" on public.projects for select using (auth.uid() = user_id);
create policy "projects_insert_own" on public.projects for insert with check (auth.uid() = user_id and public.can_create_project());
create policy "projects_update_own" on public.projects for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "projects_delete_own" on public.projects for delete using (auth.uid() = user_id);
drop policy if exists "drafts_own" on public.drafts;
drop policy if exists "drafts_select_own" on public.drafts;
drop policy if exists "drafts_insert_own" on public.drafts;
drop policy if exists "drafts_update_own" on public.drafts;
drop policy if exists "drafts_delete_own" on public.drafts;
create policy "drafts_select_own" on public.drafts for select using (auth.uid() = user_id);
create policy "drafts_insert_own" on public.drafts for insert with check (
  auth.uid() = user_id and (project_id is null or exists (select 1 from public.projects where id = project_id and user_id = auth.uid()))
);
create policy "drafts_update_own" on public.drafts for update using (auth.uid() = user_id) with check (
  auth.uid() = user_id and (project_id is null or exists (select 1 from public.projects where id = project_id and user_id = auth.uid()))
);
create policy "drafts_delete_own" on public.drafts for delete using (auth.uid() = user_id);
drop policy if exists "favorites_own" on public.favorites;
create policy "favorites_own" on public.favorites for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "mission_progress_own" on public.mission_progress;
drop policy if exists "Usuário vê seu próprio progresso" on public.mission_progress;
drop policy if exists "Usuário salva seu próprio progresso" on public.mission_progress;
drop policy if exists "Usuário atualiza seu próprio progresso" on public.mission_progress;
drop policy if exists "Usuário deleta seu próprio progresso" on public.mission_progress;
create policy "mission_progress_own" on public.mission_progress for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "playground_sessions_own" on public.playground_sessions;
create policy "playground_sessions_own" on public.playground_sessions for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "subscriptions_select_own" on public.subscriptions;
create policy "subscriptions_select_own" on public.subscriptions for select using (auth.uid() = user_id);
drop policy if exists "audit_events_select_own" on public.audit_events;
create policy "audit_events_select_own" on public.audit_events for select using (auth.uid() = user_id);

create or replace function public.set_updated_at() returns trigger
language plpgsql as $$ begin new.updated_at = now(); return new; end $$;

drop trigger if exists projects_set_updated_at on public.projects;
create trigger projects_set_updated_at before update on public.projects for each row execute function public.set_updated_at();
drop trigger if exists drafts_set_updated_at on public.drafts;
create trigger drafts_set_updated_at before update on public.drafts for each row execute function public.set_updated_at();
drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at before update on public.profiles for each row execute function public.set_updated_at();

create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url')
  on conflict (id) do nothing;
  insert into public.subscriptions (user_id) values (new.id) on conflict (user_id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

insert into public.profiles (id, full_name, avatar_url)
select id, raw_user_meta_data->>'full_name', raw_user_meta_data->>'avatar_url' from auth.users
on conflict (id) do nothing;
insert into public.subscriptions (user_id)
select id from auth.users on conflict (user_id) do nothing;

revoke all on public.audit_events from anon, authenticated;
grant select on public.audit_events to authenticated;
revoke update on public.profiles from authenticated;
grant update (username, full_name, avatar_url, bio, linkedin_url, role, updated_at) on public.profiles to authenticated;

create or replace function public.delete_own_account() returns void
language plpgsql security definer set search_path = public as $$
begin
  delete from auth.users where id = auth.uid();
end $$;
revoke all on function public.delete_own_account() from public, anon;
grant execute on function public.delete_own_account() to authenticated;
