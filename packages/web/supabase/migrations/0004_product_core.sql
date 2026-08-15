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
