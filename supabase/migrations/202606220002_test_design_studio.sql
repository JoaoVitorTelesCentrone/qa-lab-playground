-- Test Design Studio (sem BDD): requisitos, riscos, casos, plano e rastreabilidade.

create table if not exists public.studio_workspaces (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  project_id uuid not null unique references public.projects(id) on delete cascade,
  objective text not null default '' check (char_length(objective) <= 2000),
  status text not null default 'draft' check (status in ('draft', 'active', 'completed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.requirements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  workspace_id uuid not null references public.studio_workspaces(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 140),
  description text not null default '' check (char_length(description) <= 10000),
  acceptance_criteria text not null default '' check (char_length(acceptance_criteria) <= 10000),
  business_rules text not null default '' check (char_length(business_rules) <= 10000),
  open_questions text not null default '' check (char_length(open_questions) <= 5000),
  status text not null default 'draft' check (status in ('draft', 'refinement', 'approved')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.risk_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  workspace_id uuid not null references public.studio_workspaces(id) on delete cascade,
  requirement_id uuid references public.requirements(id) on delete set null,
  title text not null check (char_length(title) between 1 and 160),
  category text not null default 'produto' check (category in ('produto', 'negocio', 'dados', 'seguranca', 'performance', 'acessibilidade', 'integracao')),
  probability smallint not null default 3 check (probability between 1 and 5),
  impact smallint not null default 3 check (impact between 1 and 5),
  score smallint generated always as (probability * impact) stored,
  mitigation text not null default '' check (char_length(mitigation) <= 3000),
  status text not null default 'open' check (status in ('open', 'mitigated', 'accepted')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.test_cases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  workspace_id uuid not null references public.studio_workspaces(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 180),
  objective text not null default '' check (char_length(objective) <= 5000),
  preconditions text not null default '' check (char_length(preconditions) <= 5000),
  test_data text not null default '' check (char_length(test_data) <= 5000),
  expected_result text not null default '' check (char_length(expected_result) <= 5000),
  case_type text not null default 'positive' check (case_type in ('positive', 'negative', 'boundary', 'regression', 'exploratory')),
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high', 'critical')),
  layer text not null default 'ui' check (layer in ('unit', 'api', 'integration', 'ui', 'e2e', 'manual')),
  status text not null default 'draft' check (status in ('draft', 'ready', 'deprecated')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.test_steps (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  test_case_id uuid not null references public.test_cases(id) on delete cascade,
  position integer not null check (position > 0),
  action text not null check (char_length(action) between 1 and 3000),
  expected_result text not null default '' check (char_length(expected_result) <= 3000),
  created_at timestamptz not null default now(),
  unique(test_case_id, position)
);

create table if not exists public.test_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  workspace_id uuid not null unique references public.studio_workspaces(id) on delete cascade,
  objective text not null default '',
  scope text not null default '',
  out_of_scope text not null default '',
  strategy text not null default '',
  environments text not null default '',
  tools text not null default '',
  entry_criteria text not null default '',
  exit_criteria text not null default '',
  dependencies text not null default '',
  responsibilities text not null default '',
  schedule text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.coverage_links (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  workspace_id uuid not null references public.studio_workspaces(id) on delete cascade,
  requirement_id uuid references public.requirements(id) on delete cascade,
  risk_id uuid references public.risk_items(id) on delete cascade,
  test_case_id uuid not null references public.test_cases(id) on delete cascade,
  created_at timestamptz not null default now(),
  check (requirement_id is not null or risk_id is not null),
  unique(requirement_id, risk_id, test_case_id)
);

create table if not exists public.artifact_versions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  workspace_id uuid not null references public.studio_workspaces(id) on delete cascade,
  entity_type text not null check (entity_type in ('requirement', 'risk', 'test_case', 'test_plan')),
  entity_id uuid not null,
  version integer not null,
  snapshot jsonb not null,
  created_at timestamptz not null default now(),
  unique(entity_type, entity_id, version)
);

create table if not exists public.studio_templates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 100),
  template_type text not null check (template_type in ('requirement', 'risk', 'test_case', 'test_plan')),
  content jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, name, template_type)
);

create index if not exists requirements_workspace_idx on public.requirements(workspace_id, updated_at desc);
create index if not exists risks_workspace_score_idx on public.risk_items(workspace_id, score desc);
create index if not exists test_cases_workspace_idx on public.test_cases(workspace_id, updated_at desc);
create index if not exists coverage_workspace_idx on public.coverage_links(workspace_id);

alter table public.studio_workspaces enable row level security;
alter table public.requirements enable row level security;
alter table public.risk_items enable row level security;
alter table public.test_cases enable row level security;
alter table public.test_steps enable row level security;
alter table public.test_plans enable row level security;
alter table public.coverage_links enable row level security;
alter table public.artifact_versions enable row level security;
alter table public.studio_templates enable row level security;

create or replace function public.owns_studio_workspace(target uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists(select 1 from public.studio_workspaces where id = target and user_id = auth.uid())
$$;
revoke all on function public.owns_studio_workspace(uuid) from public, anon;
grant execute on function public.owns_studio_workspace(uuid) to authenticated;

create or replace function public.has_paid_plan() returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce((select plan in ('pro', 'team') from public.profiles where id = auth.uid()), false)
$$;
revoke all on function public.has_paid_plan() from public, anon;
grant execute on function public.has_paid_plan() to authenticated;

create or replace function public.can_create_studio_workspace() returns boolean
language sql stable security definer set search_path = public as $$
  select public.has_paid_plan() or (select count(*) from public.studio_workspaces where user_id = auth.uid()) < 1
$$;
create or replace function public.can_create_requirement(target uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select public.owns_studio_workspace(target) and (public.has_paid_plan() or (select count(*) from public.requirements where workspace_id = target) < 3)
$$;
create or replace function public.can_create_test_case(target uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select public.owns_studio_workspace(target) and (public.has_paid_plan() or (select count(*) from public.test_cases where workspace_id = target) < 20)
$$;
grant execute on function public.can_create_studio_workspace() to authenticated;
grant execute on function public.can_create_requirement(uuid) to authenticated;
grant execute on function public.can_create_test_case(uuid) to authenticated;

create policy "studio_select_own" on public.studio_workspaces for select using (auth.uid() = user_id);
create policy "studio_insert_own" on public.studio_workspaces for insert with check (auth.uid() = user_id and public.can_create_studio_workspace());
create policy "studio_update_own" on public.studio_workspaces for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "studio_delete_own" on public.studio_workspaces for delete using (auth.uid() = user_id);
create policy "requirements_select_own" on public.requirements for select using (public.owns_studio_workspace(workspace_id));
create policy "requirements_insert_own" on public.requirements for insert with check (auth.uid() = user_id and public.can_create_requirement(workspace_id));
create policy "requirements_update_own" on public.requirements for update using (public.owns_studio_workspace(workspace_id)) with check (auth.uid() = user_id and public.owns_studio_workspace(workspace_id));
create policy "requirements_delete_own" on public.requirements for delete using (public.owns_studio_workspace(workspace_id));
create policy "risks_own" on public.risk_items for all using (public.owns_studio_workspace(workspace_id)) with check (auth.uid() = user_id and public.owns_studio_workspace(workspace_id));
create policy "test_cases_select_own" on public.test_cases for select using (public.owns_studio_workspace(workspace_id));
create policy "test_cases_insert_own" on public.test_cases for insert with check (auth.uid() = user_id and public.can_create_test_case(workspace_id));
create policy "test_cases_update_own" on public.test_cases for update using (public.owns_studio_workspace(workspace_id)) with check (auth.uid() = user_id and public.owns_studio_workspace(workspace_id));
create policy "test_cases_delete_own" on public.test_cases for delete using (public.owns_studio_workspace(workspace_id));
create policy "test_steps_own" on public.test_steps for all using (exists(select 1 from public.test_cases where id = test_case_id and user_id = auth.uid())) with check (auth.uid() = user_id and exists(select 1 from public.test_cases where id = test_case_id and user_id = auth.uid()));
create policy "test_plans_own" on public.test_plans for all using (public.owns_studio_workspace(workspace_id)) with check (auth.uid() = user_id and public.owns_studio_workspace(workspace_id));
create policy "coverage_own" on public.coverage_links for all using (public.owns_studio_workspace(workspace_id)) with check (auth.uid() = user_id and public.owns_studio_workspace(workspace_id));
create policy "versions_select_own" on public.artifact_versions for select using (public.owns_studio_workspace(workspace_id));
create policy "versions_insert_paid" on public.artifact_versions for insert with check (auth.uid() = user_id and public.owns_studio_workspace(workspace_id) and public.has_paid_plan());
create policy "templates_paid" on public.studio_templates for all using (auth.uid() = user_id and public.has_paid_plan()) with check (auth.uid() = user_id and public.has_paid_plan());

create or replace function public.validate_studio_relation() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if tg_table_name = 'risk_items' and new.requirement_id is not null and not exists (
    select 1 from public.requirements where id = new.requirement_id and workspace_id = new.workspace_id and user_id = new.user_id
  ) then raise exception 'Requirement does not belong to this workspace'; end if;
  if tg_table_name = 'test_steps' and not exists (
    select 1 from public.test_cases where id = new.test_case_id and user_id = new.user_id
  ) then raise exception 'Test case does not belong to this user'; end if;
  if tg_table_name = 'coverage_links' then
    if not exists (select 1 from public.test_cases where id = new.test_case_id and workspace_id = new.workspace_id and user_id = new.user_id) then raise exception 'Test case does not belong to this workspace'; end if;
    if new.requirement_id is not null and not exists (select 1 from public.requirements where id = new.requirement_id and workspace_id = new.workspace_id and user_id = new.user_id) then raise exception 'Requirement does not belong to this workspace'; end if;
    if new.risk_id is not null and not exists (select 1 from public.risk_items where id = new.risk_id and workspace_id = new.workspace_id and user_id = new.user_id) then raise exception 'Risk does not belong to this workspace'; end if;
  end if;
  return new;
end $$;

create trigger risks_validate_relation before insert or update on public.risk_items for each row execute function public.validate_studio_relation();
create trigger steps_validate_relation before insert or update on public.test_steps for each row execute function public.validate_studio_relation();
create trigger coverage_validate_relation before insert or update on public.coverage_links for each row execute function public.validate_studio_relation();

create trigger studio_workspaces_updated before update on public.studio_workspaces for each row execute function public.set_updated_at();
create trigger requirements_updated before update on public.requirements for each row execute function public.set_updated_at();
create trigger risks_updated before update on public.risk_items for each row execute function public.set_updated_at();
create trigger test_cases_updated before update on public.test_cases for each row execute function public.set_updated_at();
create trigger test_plans_updated before update on public.test_plans for each row execute function public.set_updated_at();
create trigger studio_templates_updated before update on public.studio_templates for each row execute function public.set_updated_at();
