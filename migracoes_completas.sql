-- Todas as migrações (0001 a 0009) — colar de uma vez no SQL Editor do projeto novo

-- ===== 0001_user_state.sql =====
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

-- ===== 0002_workspace_studio.sql =====
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

-- ===== 0003_playground_sessions_cron.sql =====
-- Playground sessions and cleanup schedule.
-- The app can run with in-memory sessions locally, but production persistence
-- should use this table through service-role server code only.

create table if not exists public.playground_sessions (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists playground_sessions_expires_idx
  on public.playground_sessions (expires_at);

alter table public.playground_sessions enable row level security;
revoke all on public.playground_sessions from anon, authenticated;

create or replace function public.cleanup_playground_sessions()
returns void
language sql
security definer
set search_path = public
as $$
  delete from public.playground_sessions
  where expires_at < now();
$$;

revoke all on function public.cleanup_playground_sessions() from public, anon, authenticated;

do $$
begin
  if exists (select 1 from pg_extension where extname = 'pg_cron') then
    perform cron.unschedule('cleanup-playground-sessions');
    perform cron.schedule(
      'cleanup-playground-sessions',
      '17 * * * *',
      'select public.cleanup_playground_sessions();'
    );
  end if;
exception
  when undefined_function then
    perform cron.schedule(
      'cleanup-playground-sessions',
      '17 * * * *',
      'select public.cleanup_playground_sessions();'
    );
end $$;

-- ===== 0004_product_core.sql =====
-- Núcleo de produto do QA Lab: matrícula em Lab, evidências, execução dos
-- packs de regressão e telemetria de ativação.
-- Ver docs/PRODUCTIZATION_PLAN.md (Fase 1 — Fundamentos).
--
-- Regra de produto: o backend é a fonte de verdade. localStorage só apoia
-- cache de interface. Nenhum Lab é "concluído" sem evidência salva — a
-- constraint lab_enrollments_completed_needs_evidence garante isso no banco.
--
-- Idempotente: pode rodar mais de uma vez.

-- ============================================================
-- Evidências entregues em um Lab
-- Append-only: cada envio é uma linha, o histórico é a evidência.
-- ============================================================
create table if not exists public.lab_submissions (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  lab_slug     text not null,
  -- O que o aluno observou ao executar o cenário.
  result       text not null,
  -- Passos de reprodução, um por linha.
  reproduction text not null,
  severity     text not null check (severity in ('baixa','media','alta','critica')),
  notes        text,
  -- [{ name, url, size }] — anexos ficam no Storage, aqui só o ponteiro.
  attachments  jsonb not null default '[]'::jsonb,
  created_at   timestamptz not null default now()
);
create index if not exists lab_submissions_user_lab_idx
  on public.lab_submissions (user_id, lab_slug, created_at desc);

-- ============================================================
-- Matrícula e progresso por Lab
-- ============================================================
create table if not exists public.lab_enrollments (
  user_id      uuid not null references auth.users(id) on delete cascade,
  lab_slug     text not null,
  status       text not null default 'started' check (status in ('started','completed','abandoned')),
  -- Evidência que fechou o Lab. Sem ela o Lab não pode ficar 'completed'.
  submission_id uuid references public.lab_submissions(id) on delete set null,
  started_at   timestamptz not null default now(),
  completed_at timestamptz,
  updated_at   timestamptz not null default now(),
  primary key (user_id, lab_slug),
  constraint lab_enrollments_completed_needs_evidence
    check (status <> 'completed' or (submission_id is not null and completed_at is not null))
);
create index if not exists lab_enrollments_user_status_idx
  on public.lab_enrollments (user_id, status, updated_at desc);

-- ============================================================
-- Execução dos 35 cenários de regressão por ambiente de prática
-- ============================================================
create table if not exists public.scenario_runs (
  user_id     uuid not null references auth.users(id) on delete cascade,
  -- id do ambiente em lib/product/apps.ts: qa-lab | financas | agendamentos | crm
  app_id      text not null,
  scenario_id text not null,
  status      text not null check (status in ('passou','falhou','bloqueado')),
  notes       text,
  updated_at  timestamptz not null default now(),
  primary key (user_id, app_id, scenario_id)
);
create index if not exists scenario_runs_user_app_idx
  on public.scenario_runs (user_id, app_id, updated_at desc);

-- ============================================================
-- Telemetria de ativação (Labs iniciados, concluídos, abandonados)
-- ============================================================
create table if not exists public.activity_events (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  name       text not null,
  props      jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists activity_events_user_idx
  on public.activity_events (user_id, created_at desc);
create index if not exists activity_events_name_idx
  on public.activity_events (name, created_at desc);

-- ============================================================
-- RLS: cada usuário só enxerga e altera as próprias linhas
-- ============================================================
alter table public.lab_submissions  enable row level security;
alter table public.lab_enrollments  enable row level security;
alter table public.scenario_runs    enable row level security;
alter table public.activity_events  enable row level security;

drop policy if exists "own rows" on public.lab_submissions;
drop policy if exists "own rows" on public.lab_enrollments;
drop policy if exists "own rows" on public.scenario_runs;
drop policy if exists "own rows" on public.activity_events;

create policy "own rows" on public.lab_submissions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own rows" on public.lab_enrollments
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own rows" on public.scenario_runs
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own rows" on public.activity_events
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ============================================================
-- updated_at automático nas tabelas de progresso
-- ============================================================
create or replace function public.touch_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists lab_enrollments_touch on public.lab_enrollments;
create trigger lab_enrollments_touch before update on public.lab_enrollments
  for each row execute function public.touch_updated_at();

drop trigger if exists scenario_runs_touch on public.scenario_runs;
create trigger scenario_runs_touch before update on public.scenario_runs
  for each row execute function public.touch_updated_at();

-- ===== 0005_submission_checklist.sql =====
-- Checklist de critérios de aceite na entrega de evidência.
-- Ver docs/PRODUCTIZATION_PLAN.md (Fase 2 — Primeiro loop de aprendizagem).
--
-- A avaliação automática exige que todos os critérios do Lab estejam marcados
-- para a evidência ser aceita; guardamos quais foram para o histórico mostrar
-- o que o aluno afirmou ter verificado.
--
-- Idempotente: pode rodar mais de uma vez.

alter table public.lab_submissions
  add column if not exists checklist jsonb not null default '[]'::jsonb;

-- ===== 0006_practice_data.sql =====
-- Dados persistentes dos ambientes de prática (Finanças, Agendamentos, CRM),
-- perfil de teste ativo e bugs plantados por feature flag.
-- Ver docs/PRODUCTIZATION_PLAN.md (Fase 3 — Apps e regressão).
--
-- Cada aluno tem a própria massa de teste, isolada por RLS. `practice_settings`
-- guarda o perfil ativo, as flags ligadas e o modo instrutor; `seeded_at` marca
-- quando a massa foi (re)criada, para o botão de restaurar ser repetível.
--
-- Idempotente: pode rodar mais de uma vez.

-- ============================================================
-- Configuração do ambiente de prática
-- ============================================================
create table if not exists public.practice_settings (
  user_id      uuid primary key references auth.users(id) on delete cascade,
  persona_id   text not null default 'admin',
  -- ids de lib/product/practice/bugs.ts
  active_bugs  jsonb not null default '[]'::jsonb,
  -- Modo instrutor revela o mecanismo do bug; modo aluno mostra só o sintoma.
  instructor   boolean not null default false,
  seeded_at    timestamptz,
  updated_at   timestamptz not null default now()
);

-- ============================================================
-- Finanças
-- ============================================================
create table if not exists public.practice_finance_accounts (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  name       text not null,
  kind       text not null check (kind in ('corrente','poupanca','carteira')),
  balance    numeric(12,2) not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.practice_finance_transactions (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  description text not null,
  amount      numeric(12,2) not null check (amount >= 0),
  kind        text not null check (kind in ('receita','despesa')),
  category    text not null,
  date        date not null,
  recurring   boolean not null default false,
  created_at  timestamptz not null default now()
);

create table if not exists public.practice_finance_budgets (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  category     text not null,
  limit_amount numeric(12,2) not null check (limit_amount >= 0),
  created_at   timestamptz not null default now()
);

create table if not exists public.practice_finance_goals (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  name          text not null,
  target_amount numeric(12,2) not null check (target_amount >= 0),
  saved_amount  numeric(12,2) not null default 0 check (saved_amount >= 0),
  created_at    timestamptz not null default now()
);

-- ============================================================
-- Agendamentos
-- ============================================================
create table if not exists public.practice_booking_services (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references auth.users(id) on delete cascade,
  name             text not null,
  duration_minutes int not null check (duration_minutes between 15 and 480),
  price            numeric(12,2) not null default 0,
  created_at       timestamptz not null default now()
);

create table if not exists public.practice_booking_availability (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  -- 0 = domingo
  weekday    int not null check (weekday between 0 and 6),
  start_time text not null,
  end_time   text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.practice_bookings (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  customer   text not null,
  service    text not null,
  date       date not null,
  time       text not null,
  status     text not null default 'confirmado' check (status in ('confirmado','cancelado')),
  created_at timestamptz not null default now()
);
create index if not exists practice_bookings_slot_idx on public.practice_bookings (user_id, date, time);

-- ============================================================
-- CRM
-- ============================================================
create table if not exists public.practice_crm_companies (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  name       text not null,
  segment    text not null,
  size       text not null check (size in ('pequena','media','grande')),
  created_at timestamptz not null default now()
);

create table if not exists public.practice_crm_contacts (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  name       text not null,
  email      text not null,
  company    text not null,
  role       text,
  created_at timestamptz not null default now()
);

create table if not exists public.practice_crm_deals (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  title      text not null,
  company    text not null,
  amount     numeric(12,2) not null default 0 check (amount >= 0),
  stage      text not null default 'novo' check (stage in ('novo','qualificado','proposta','ganho','perdido')),
  created_at timestamptz not null default now()
);

create table if not exists public.practice_crm_activities (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  deal       text not null,
  kind       text not null check (kind in ('ligacao','email','reuniao')),
  summary    text not null,
  created_at timestamptz not null default now()
);

-- ============================================================
-- RLS: cada aluno só enxerga a própria massa de teste
-- ============================================================
do $$
declare t text;
begin
  foreach t in array array[
    'practice_settings',
    'practice_finance_accounts', 'practice_finance_transactions', 'practice_finance_budgets', 'practice_finance_goals',
    'practice_booking_services', 'practice_booking_availability', 'practice_bookings',
    'practice_crm_companies', 'practice_crm_contacts', 'practice_crm_deals', 'practice_crm_activities'
  ] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists "own rows" on public.%I', t);
    execute format('create policy "own rows" on public.%I for all using (auth.uid() = user_id) with check (auth.uid() = user_id)', t);
    execute format('create index if not exists %I on public.%I (user_id)', t || '_user_idx', t);
  end loop;
end $$;

drop trigger if exists practice_settings_touch on public.practice_settings;
create trigger practice_settings_touch before update on public.practice_settings
  for each row execute function public.touch_updated_at();

-- ===== 0007_qa_lab_state.sql =====
-- Estado persistente do ambiente QA Lab (a loja): carrinho e pedidos.
-- Ver docs/PRODUCTIZATION_PLAN.md (Fase 3 — Apps e regressão).
--
-- Fecha a última superfície que ainda usava localStorage como fonte de verdade.
-- O carrinho é um documento por aluno (uma linha, itens em jsonb); o pedido é
-- imutável depois de criado, exceto pelo status.
--
-- Idempotente: pode rodar mais de uma vez.

-- ============================================================
-- Carrinho: uma linha por aluno
-- ============================================================
create table if not exists public.practice_carts (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  -- [{ "productId": 1, "quantity": 2 }]
  items      jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

-- ============================================================
-- Pedidos
-- ============================================================
create table if not exists public.practice_orders (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  -- Referência legível (QL-000001), única por aluno.
  reference  text not null,
  status     text not null default 'confirmado' check (status in ('confirmado','enviado','entregue','cancelado')),
  total      numeric(12,2) not null check (total >= 0),
  -- Linhas e valores congelados no momento da compra: o pedido não pode mudar
  -- porque o catálogo mudou depois.
  items      jsonb not null default '[]'::jsonb,
  pricing    jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists practice_orders_reference_idx on public.practice_orders (user_id, reference);

-- ============================================================
-- RLS: cada aluno só enxerga o próprio carrinho e os próprios pedidos
-- ============================================================
do $$
declare t text;
begin
  foreach t in array array['practice_carts', 'practice_orders'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists "own rows" on public.%I', t);
    execute format('create policy "own rows" on public.%I for all using (auth.uid() = user_id) with check (auth.uid() = user_id)', t);
    execute format('create index if not exists %I on public.%I (user_id)', t || '_user_idx', t);
  end loop;
end $$;

drop trigger if exists practice_carts_touch on public.practice_carts;
create trigger practice_carts_touch before update on public.practice_carts
  for each row execute function public.touch_updated_at();

drop trigger if exists practice_orders_touch on public.practice_orders;
create trigger practice_orders_touch before update on public.practice_orders
  for each row execute function public.touch_updated_at();

-- ===== 0008_portfolio.sql =====
-- Portfólio público de evidências.
-- Ver docs/PRODUCTIZATION_PLAN.md (Fase 4 — Produto utilizável).
--
-- A evidência entregue continua privada por padrão. Publicar é uma decisão em
-- dois níveis, os dois do aluno: o portfólio precisa estar público E a
-- evidência precisa estar marcada como publicada. Uma coisa só nunca vaza nada.
--
-- Idempotente: pode rodar mais de uma vez.

alter table public.profiles
  add column if not exists portfolio_public boolean not null default false,
  add column if not exists portfolio_headline text;

alter table public.lab_submissions
  add column if not exists published boolean not null default false;

create index if not exists lab_submissions_published_idx on public.lab_submissions (user_id, published);

-- ============================================================
-- Leitura anônima do que foi publicado
-- ============================================================
-- A política "own profile" continua valendo para escrita e para o dono; esta
-- soma o acesso de leitura de quem não está logado. Políticas de select se
-- somam por OR, então o dono nunca perde acesso ao próprio perfil.
drop policy if exists "public portfolio" on public.profiles;
create policy "public portfolio" on public.profiles
  for select using (portfolio_public = true);

drop policy if exists "published evidence" on public.lab_submissions;
create policy "published evidence" on public.lab_submissions
  for select using (
    published = true
    and exists (select 1 from public.profiles p where p.id = lab_submissions.user_id and p.portfolio_public = true)
  );

-- ===== 0009_certificates.sql =====
-- Certificado de trilha: prova pública e verificável de um percurso concluído.
--
-- Regra de produto: certificado não atesta presença, atesta entrega. Só existe
-- linha aqui quando todos os Labs liberados da trilha já têm evidência aceita —
-- a verificação de elegibilidade vive em lib/product/certificate.ts e é
-- reexecutada no servidor antes do insert.
--
-- O nome do titular é gravado no momento da emissão, de propósito: o
-- certificado é um documento datado. Mudar o nome do perfil depois não reescreve
-- o que já foi emitido, e a página pública não precisa ler `profiles` (que só
-- abre com portfolio_public = true) para renderizar.
--
-- Idempotente: pode rodar mais de uma vez.

create table if not exists public.track_certificates (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  -- slug da trilha em lib/product/tracks.ts
  track_slug   text not null,
  -- Código verificável no formato QAL-XXXX-XXXX. É o que a pessoa cola no
  -- campo "ID da credencial" do LinkedIn.
  code         text not null unique,
  holder_name  text not null,
  labs_completed integer not null default 0,
  evidence_count integer not null default 0,
  issued_at    timestamptz not null default now(),
  -- Um certificado por trilha por pessoa: reemitir atualiza os números, não
  -- gera um segundo código (o link já compartilhado precisa continuar valendo).
  unique (user_id, track_slug)
);

create index if not exists track_certificates_user_idx
  on public.track_certificates (user_id, issued_at desc);

alter table public.track_certificates enable row level security;

drop policy if exists "own rows" on public.track_certificates;
create policy "own rows" on public.track_certificates
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ============================================================
-- Verificação pública por código
-- ============================================================
-- Sem policy de select para anônimo: quem tem o código lê aquele certificado e
-- só ele. Uma policy `using (true)` deixaria qualquer visitante listar todos os
-- certificados emitidos (e os nomes de quem os tirou), o que não é necessário
-- para verificar um link compartilhado.
create or replace function public.certificate_by_code(lookup_code text)
returns table (
  code text,
  track_slug text,
  holder_name text,
  labs_completed integer,
  evidence_count integer,
  issued_at timestamptz
)
language sql
security definer
set search_path = public
as $$
  select c.code, c.track_slug, c.holder_name, c.labs_completed, c.evidence_count, c.issued_at
  from public.track_certificates c
  where c.code = upper(trim(lookup_code))
  limit 1;
$$;

revoke all on function public.certificate_by_code(text) from public;
grant execute on function public.certificate_by_code(text) to anon, authenticated;

-- ===== 0010_profile_links.sql =====
-- GitHub no perfil, ao lado do LinkedIn.
--
-- O topo do portfólio é a área mais valiosa da página e é ali que os dois links
-- precisam aparecer: quem avalia um QA abre o LinkedIn para ver a pessoa e o
-- GitHub para ver o que ela escreveu. A validação de formato fica na aplicação
-- (packages/web/lib/product/profile-links.ts) — aqui só o campo.
--
-- Idempotente: pode rodar mais de uma vez.

alter table public.profiles
  add column if not exists github_url text;

-- O update em profiles é liberado coluna a coluna (ver 0001_workspace): sem
-- somar github_url aqui, salvar o perfil falha com "permission denied".
revoke update on public.profiles from authenticated;
grant update (username, full_name, avatar_url, bio, linkedin_url, github_url, role, updated_at)
  on public.profiles to authenticated;


-- Seções livres do portfólio público.
--
-- Regra de produto: o portfólio é gerado a partir das evidências, mas o que a
-- pessoa quer contar sobre si não cabe em evidência — formação, certificações,
-- ferramentas, um resumo de carreira. Estas seções são texto livre do dono,
-- e por isso valem a mesma regra de dois níveis do resto do portfólio: só
-- aparecem se a página estiver pública E a seção estiver marcada como visível.
--
-- `visible` existe para que rascunho não vire vazamento: dá para escrever a
-- seção hoje, deixá-la oculta, e ligar quando estiver pronta. Sem isso a única
-- forma de esconder um texto pela metade seria apagá-lo.
--
-- A ordem é do dono (`position`), não cronológica: numa página de portfólio a
-- sequência é argumento — "Sobre mim" antes de "Certificações".
--
-- Idempotente: pode rodar mais de uma vez.

create table if not exists public.portfolio_sections (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  title      text not null,
  body       text not null default '',
  -- Posição na página pública, começando em 0. Reordenar reescreve a coluna
  -- inteira do usuário em uma transação (ver reorderPortfolioSections).
  position   integer not null default 0,
  visible    boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists portfolio_sections_user_idx
  on public.portfolio_sections (user_id, position);

alter table public.portfolio_sections enable row level security;

drop policy if exists "own rows" on public.portfolio_sections;
create policy "own rows" on public.portfolio_sections
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ============================================================
-- Leitura anônima do que foi publicado
-- ============================================================
-- Mesma forma da policy "published evidence" da 0008: a seção só sai daqui se
-- ela própria estiver visível e o portfólio do dono estiver público. Políticas
-- de select se somam por OR, então o dono continua enxergando as ocultas pela
-- policy "own rows".
drop policy if exists "public sections" on public.portfolio_sections;
create policy "public sections" on public.portfolio_sections
  for select using (
    visible = true
    and exists (select 1 from public.profiles p where p.id = portfolio_sections.user_id and p.portfolio_public = true)
  );
