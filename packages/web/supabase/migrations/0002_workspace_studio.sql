-- Fundação do Workspace / Studio / Execução do QA Lab.
-- Complementa 0001_user_state.sql com as tabelas que o app consulta em runtime
-- (projects, drafts, favorites, profiles, studio_workspaces e toda a cadeia de
-- requirements -> riscos -> casos -> planos -> rodadas -> defeitos).
--
-- Idempotente: pode rodar mais de uma vez (create ... if not exists,
-- create or replace function, drop policy/trigger if exists).
-- Ver docs/ARQUITETURA_ESTADO_USUARIO.md.

-- ============================================================
-- Helpers compartilhados: bump de updated_at e criação de perfil
-- ============================================================
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ============================================================
-- profiles: 1:1 com auth.users. O app sempre lê via .eq("id", user.id)
-- e o /perfil dá update; a linha precisa existir, então criamos no signup.
-- ============================================================
create table if not exists public.profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  full_name    text,
  username     text unique,
  bio          text,
  linkedin_url text,
  role         text,
  plan         text not null default 'free',
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- Cria o perfil automaticamente quando um usuário é criado no Auth.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Backfill: garante perfil para usuários já existentes antes deste trigger.
insert into public.profiles (id, full_name)
select u.id, coalesce(u.raw_user_meta_data->>'full_name', u.raw_user_meta_data->>'name')
from auth.users u
on conflict (id) do nothing;

-- ============================================================
-- projects: contêiner de trabalho do usuário
-- ============================================================
create table if not exists public.projects (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  title       text not null,
  description text,
  color       text not null default 'mint' check (color in ('mint','coral','neon')),
  status      text not null default 'active' check (status in ('active','archived')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists projects_user_idx on public.projects (user_id, updated_at desc);

-- ============================================================
-- drafts: rascunhos livres do Workspace (notas, bug reports, etc.)
-- ============================================================
create table if not exists public.drafts (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  project_id  uuid references public.projects(id) on delete set null,
  title       text not null,
  content     text,
  kind        text not null default 'note'
              check (kind in ('note','bug_report','test_case','gherkin','test_plan')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists drafts_user_idx on public.drafts (user_id, updated_at desc);

-- ============================================================
-- favorites: toggle de recursos favoritados (1 linha por recurso)
-- ============================================================
create table if not exists public.favorites (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  resource_type text not null,
  resource_id   text not null,
  title         text,
  href          text,
  created_at    timestamptz not null default now(),
  unique (user_id, resource_type, resource_id)
);

-- ============================================================
-- studio_workspaces: 1 workspace de Studio por projeto
-- ============================================================
create table if not exists public.studio_workspaces (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  project_id  uuid not null references public.projects(id) on delete cascade,
  objective   text,
  status      text not null default 'active',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (project_id)
);
create index if not exists studio_workspaces_user_idx on public.studio_workspaces (user_id);

-- ============================================================
-- requirements: requisitos descobertos dentro de um workspace
-- ============================================================
create table if not exists public.requirements (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null references auth.users(id) on delete cascade,
  workspace_id        uuid not null references public.studio_workspaces(id) on delete cascade,
  title               text not null,
  description         text,
  acceptance_criteria text,
  business_rules      text,
  open_questions      text,
  status              text not null default 'draft',
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);
create index if not exists requirements_workspace_idx on public.requirements (workspace_id, updated_at desc);

-- ============================================================
-- risk_items: matriz de risco. score = probability * impact (coluna gerada)
-- ============================================================
create table if not exists public.risk_items (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references auth.users(id) on delete cascade,
  workspace_id   uuid not null references public.studio_workspaces(id) on delete cascade,
  requirement_id uuid references public.requirements(id) on delete set null,
  title          text not null,
  category       text not null default 'produto',
  probability    int not null default 3 check (probability between 1 and 5),
  impact         int not null default 3 check (impact between 1 and 5),
  score          int generated always as (probability * impact) stored,
  mitigation     text,
  status         text not null default 'open',
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
create index if not exists risk_items_workspace_idx on public.risk_items (workspace_id, score desc);

-- ============================================================
-- test_cases: casos de teste do workspace
-- ============================================================
create table if not exists public.test_cases (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  workspace_id    uuid not null references public.studio_workspaces(id) on delete cascade,
  title           text not null,
  objective       text,
  preconditions   text,
  test_data       text,
  expected_result text,
  case_type       text not null default 'positive',
  priority        text not null default 'medium',
  layer           text not null default 'ui',
  status          text not null default 'draft',
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create index if not exists test_cases_workspace_idx on public.test_cases (workspace_id, updated_at desc);

-- ============================================================
-- test_steps: passos ordenados de um caso
-- ============================================================
create table if not exists public.test_steps (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  test_case_id    uuid not null references public.test_cases(id) on delete cascade,
  position        int not null default 1,
  action          text not null,
  expected_result text,
  created_at      timestamptz not null default now()
);
create index if not exists test_steps_case_idx on public.test_steps (test_case_id, position);

-- ============================================================
-- test_plans: 1 plano por workspace (upsert onConflict workspace_id)
-- ============================================================
create table if not exists public.test_plans (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references auth.users(id) on delete cascade,
  workspace_id     uuid not null references public.studio_workspaces(id) on delete cascade,
  objective        text,
  scope            text,
  out_of_scope     text,
  strategy         text,
  environments     text,
  tools            text,
  entry_criteria   text,
  exit_criteria    text,
  dependencies     text,
  responsibilities text,
  schedule         text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  unique (workspace_id)
);

-- ============================================================
-- coverage_links: rastreabilidade requisito/risco <-> caso
-- ============================================================
create table if not exists public.coverage_links (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references auth.users(id) on delete cascade,
  workspace_id   uuid not null references public.studio_workspaces(id) on delete cascade,
  test_case_id   uuid not null references public.test_cases(id) on delete cascade,
  requirement_id uuid references public.requirements(id) on delete set null,
  risk_id        uuid references public.risk_items(id) on delete set null,
  created_at     timestamptz not null default now()
);
create index if not exists coverage_links_workspace_idx on public.coverage_links (workspace_id);
create index if not exists coverage_links_case_idx on public.coverage_links (test_case_id);

-- ============================================================
-- artifact_versions: histórico (snapshot) de artefatos — plano pago
-- ============================================================
create table if not exists public.artifact_versions (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  workspace_id uuid not null references public.studio_workspaces(id) on delete cascade,
  entity_type  text not null,
  entity_id    uuid not null,
  version      int not null,
  snapshot     jsonb not null,
  created_at   timestamptz not null default now()
);
create index if not exists artifact_versions_entity_idx on public.artifact_versions (entity_type, entity_id, version desc);

-- ============================================================
-- test_runs: rodadas de execução
-- ============================================================
create table if not exists public.test_runs (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  workspace_id uuid not null references public.studio_workspaces(id) on delete cascade,
  name         text not null,
  environment  text,
  status       text not null default 'running' check (status in ('running','completed')),
  created_at   timestamptz not null default now()
);
create index if not exists test_runs_workspace_idx on public.test_runs (workspace_id, created_at desc);

-- ============================================================
-- test_executions: resultado de cada caso dentro de uma rodada
-- ============================================================
create table if not exists public.test_executions (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  run_id       uuid not null references public.test_runs(id) on delete cascade,
  test_case_id uuid not null references public.test_cases(id) on delete cascade,
  result       text not null default 'pending',
  notes        text,
  evidence     text,
  executed_at  timestamptz,
  created_at   timestamptz not null default now()
);
create index if not exists test_executions_run_idx on public.test_executions (run_id);

-- ============================================================
-- defects: defeitos abertos a partir de execuções
-- ============================================================
create table if not exists public.defects (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  workspace_id    uuid not null references public.studio_workspaces(id) on delete cascade,
  execution_id    uuid references public.test_executions(id) on delete set null,
  title           text not null,
  description     text,
  steps           text,
  expected_result text,
  actual_result   text,
  evidence        text,
  severity        text,
  priority        text,
  status          text not null default 'open',
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create index if not exists defects_workspace_idx on public.defects (workspace_id, updated_at desc);

-- ============================================================
-- defect_events: trilha de mudança de status do defeito
-- ============================================================
create table if not exists public.defect_events (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  defect_id   uuid not null references public.defects(id) on delete cascade,
  from_status text,
  to_status   text,
  comment     text,
  created_at  timestamptz not null default now()
);
create index if not exists defect_events_defect_idx on public.defect_events (defect_id, created_at);

-- ============================================================
-- playground_sessions: sessões do playground exibidas no /lab
-- ============================================================
create table if not exists public.playground_sessions (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references auth.users(id) on delete cascade,
  playground_id  text not null,
  status         text not null default 'in_progress',
  findings_count int not null default 0,
  started_at     timestamptz not null default now(),
  completed_at   timestamptz
);
create index if not exists playground_sessions_user_idx on public.playground_sessions (user_id, started_at desc);

-- ============================================================
-- api_request_history: requisições salvas no API Playground
-- ============================================================
create table if not exists public.api_request_history (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  project_id      uuid references public.projects(id) on delete set null,
  method          text not null,
  request_url     text not null,
  scenario        text,
  request_body    jsonb,
  response_status int,
  response_body   jsonb,
  duration_ms     int,
  created_at      timestamptz not null default now()
);
create index if not exists api_request_history_user_idx on public.api_request_history (user_id, created_at desc);

-- ============================================================
-- updated_at: bump automático nas tabelas mutáveis ordenadas por ele
-- ============================================================
do $$
declare t text;
begin
  foreach t in array array[
    'profiles','projects','drafts','studio_workspaces','requirements',
    'risk_items','test_cases','test_plans','defects'
  ] loop
    execute format('drop trigger if exists set_updated_at on public.%I', t);
    execute format(
      'create trigger set_updated_at before update on public.%I
         for each row execute function public.set_updated_at()', t);
  end loop;
end;
$$;

-- ============================================================
-- RLS: cada usuário só enxerga/altera as próprias linhas.
-- profiles usa id (1:1 com auth.users); as demais usam user_id.
-- ============================================================
alter table public.profiles enable row level security;
drop policy if exists "own profile" on public.profiles;
create policy "own profile" on public.profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

do $$
declare t text;
begin
  foreach t in array array[
    'projects','drafts','favorites','studio_workspaces','requirements',
    'risk_items','test_cases','test_steps','test_plans','coverage_links',
    'artifact_versions','test_runs','test_executions','defects',
    'defect_events','playground_sessions','api_request_history'
  ] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists "own rows" on public.%I', t);
    execute format(
      'create policy "own rows" on public.%I
         for all using (auth.uid() = user_id) with check (auth.uid() = user_id)', t);
  end loop;
end;
$$;
