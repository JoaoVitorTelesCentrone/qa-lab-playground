-- Fundação de estado por usuário dos labs do QA Lab.
-- Ver docs/ARQUITETURA_ESTADO_USUARIO.md.
-- Idempotente: pode rodar mais de uma vez (if not exists / drop policy if exists).

-- ============================================================
-- Progresso de missões (genérico). O CI/CD Lab grava aqui com
-- mission_id prefixado 'cicd:'. 'if not exists' preserva a tabela
-- caso ela já exista no projeto.
-- ============================================================
create table if not exists public.mission_progress (
  user_id      uuid not null references auth.users(id) on delete cascade,
  mission_id   text not null,
  status       text not null default 'completed',
  completed_at timestamptz not null default now(),
  primary key (user_id, mission_id)
);

-- ============================================================
-- Histórias: overlay de status sobre conteúdo autoral compartilhado
-- ============================================================
create table if not exists public.story_states (
  user_id    uuid not null references auth.users(id) on delete cascade,
  story_id   text not null,            -- id estável da story autoral (ex.: 'EXP-101')
  status     text not null check (status in ('backlog','todo','progress','review','done')),
  updated_at timestamptz not null default now(),
  primary key (user_id, story_id)
);

-- Histórias criadas pelo próprio usuário (artefato, não conteúdo)
create table if not exists public.user_stories (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  key         text not null,
  title       text not null,
  description text,
  criteria    text[] not null default '{}',
  status      text not null default 'backlog' check (status in ('backlog','todo','progress','review','done')),
  priority    text not null default 'media' check (priority in ('baixa','media','alta','critica')),
  points      int  not null default 3,
  created_at  timestamptz not null default now()
);
create index if not exists user_stories_user_idx on public.user_stories (user_id);

-- ============================================================
-- People Lab: respostas (APPEND-ONLY, uma linha por tentativa)
-- ============================================================
create table if not exists public.people_attempts (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  scenario_id text not null,
  response    text not null,
  created_at  timestamptz not null default now()
);
create index if not exists people_attempts_user_scenario_idx
  on public.people_attempts (user_id, scenario_id, created_at desc);

-- ============================================================
-- Deliverables do Playground (bug reports, casos, decisões E2E)
-- ============================================================
create table if not exists public.deliverables (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  kind       text not null,            -- 'bug' | 'bdd' | 'e2e' | ...
  payload    jsonb not null,
  created_at timestamptz not null default now()
);
create index if not exists deliverables_user_kind_idx on public.deliverables (user_id, kind);

-- ============================================================
-- RLS: cada usuário só enxerga e altera as próprias linhas
-- ============================================================
alter table public.mission_progress enable row level security;
alter table public.story_states    enable row level security;
alter table public.user_stories    enable row level security;
alter table public.people_attempts enable row level security;
alter table public.deliverables    enable row level security;

-- Idempotente: dropa antes de criar para poder rodar a migration mais de uma vez.
drop policy if exists "own rows" on public.mission_progress;
drop policy if exists "own rows" on public.story_states;
drop policy if exists "own rows" on public.user_stories;
drop policy if exists "own rows" on public.people_attempts;
drop policy if exists "own rows" on public.deliverables;

create policy "own rows" on public.mission_progress
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own rows" on public.story_states
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own rows" on public.user_stories
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own rows" on public.people_attempts
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own rows" on public.deliverables
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
