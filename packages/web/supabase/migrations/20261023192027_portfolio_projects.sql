-- Projects authored by the portfolio owner. Drafts and public snapshots are
-- separate so edits never change an already shared page.
create table if not exists public.portfolio_projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  source text not null check (source in ('pessoal', 'profissional')),
  name text not null check (char_length(name) between 3 and 100),
  summary text not null default '' check (char_length(summary) <= 1800),
  role text not null default '' check (char_length(role) <= 160),
  period text not null default '' check (char_length(period) <= 80),
  links jsonb not null default '[]'::jsonb check (jsonb_typeof(links) = 'array'),
  case_submission_ids uuid[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists portfolio_projects_user_updated_idx
  on public.portfolio_projects (user_id, updated_at desc);

alter table public.portfolio_projects enable row level security;
revoke all on public.portfolio_projects from anon, authenticated;
grant select, insert, update, delete on public.portfolio_projects to authenticated;

drop policy if exists "owner manages portfolio projects" on public.portfolio_projects;
create policy "owner manages portfolio projects" on public.portfolio_projects
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create table if not exists public.portfolio_project_publications (
  project_id uuid primary key references public.portfolio_projects(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  source text not null check (source in ('pessoal', 'profissional')),
  name text not null check (char_length(name) between 3 and 100),
  summary text not null default '' check (char_length(summary) <= 1800),
  role text not null default '' check (char_length(role) <= 160),
  period text not null default '' check (char_length(period) <= 80),
  links jsonb not null default '[]'::jsonb check (jsonb_typeof(links) = 'array'),
  case_submission_ids uuid[] not null default '{}',
  published_at timestamptz not null default now()
);

create index if not exists portfolio_project_publications_user_idx
  on public.portfolio_project_publications (user_id, published_at desc);

alter table public.portfolio_project_publications enable row level security;
revoke all on public.portfolio_project_publications from anon, authenticated;
grant select, insert, update, delete on public.portfolio_project_publications to authenticated;
grant select on public.portfolio_project_publications to anon;

drop policy if exists "owner manages portfolio project publication" on public.portfolio_project_publications;
create policy "owner manages portfolio project publication" on public.portfolio_project_publications
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "public portfolio projects" on public.portfolio_project_publications;
create policy "public portfolio projects" on public.portfolio_project_publications
  for select to anon, authenticated
  using (
    exists (
      select 1 from public.profiles p
      where p.id = portfolio_project_publications.user_id and p.portfolio_public = true
    )
  );
