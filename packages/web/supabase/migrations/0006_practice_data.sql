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
