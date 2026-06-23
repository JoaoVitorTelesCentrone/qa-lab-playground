-- Execution & Defect Hub: rodadas, resultados, evidências textuais e ciclo de bugs.

create table if not exists public.test_runs (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  workspace_id uuid not null references public.studio_workspaces(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 120), environment text not null default '',
  status text not null default 'planned' check (status in ('planned','running','completed','canceled')),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.test_executions (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  run_id uuid not null references public.test_runs(id) on delete cascade, test_case_id uuid not null references public.test_cases(id) on delete cascade,
  result text not null default 'pending' check (result in ('pending','passed','failed','blocked','skipped')),
  notes text not null default '' check (char_length(notes) <= 10000), evidence text not null default '' check (char_length(evidence) <= 10000),
  executed_at timestamptz, updated_at timestamptz not null default now(), unique(run_id,test_case_id)
);
create table if not exists public.defects (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  workspace_id uuid not null references public.studio_workspaces(id) on delete cascade,
  execution_id uuid references public.test_executions(id) on delete set null,
  title text not null check (char_length(title) between 1 and 180), description text not null default '', steps text not null default '',
  expected_result text not null default '', actual_result text not null default '', evidence text not null default '',
  severity text not null default 'medium' check (severity in ('low','medium','high','critical')),
  priority text not null default 'medium' check (priority in ('low','medium','high','urgent')),
  status text not null default 'open' check (status in ('open','in_progress','fixed','retest','closed','reopened','rejected')),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.defect_events (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  defect_id uuid not null references public.defects(id) on delete cascade, from_status text, to_status text not null,
  comment text not null default '' check (char_length(comment) <= 3000), created_at timestamptz not null default now()
);
create index if not exists test_runs_workspace_idx on public.test_runs(workspace_id,updated_at desc);
create index if not exists executions_run_idx on public.test_executions(run_id,result);
create index if not exists defects_workspace_idx on public.defects(workspace_id,status,updated_at desc);
alter table public.test_runs enable row level security; alter table public.test_executions enable row level security;
alter table public.defects enable row level security; alter table public.defect_events enable row level security;
create or replace function public.owns_test_run(target uuid) returns boolean language sql stable security definer set search_path=public as $$ select exists(select 1 from public.test_runs where id=target and user_id=auth.uid()) $$;
create or replace function public.owns_defect(target uuid) returns boolean language sql stable security definer set search_path=public as $$ select exists(select 1 from public.defects where id=target and user_id=auth.uid()) $$;
grant execute on function public.owns_test_run(uuid), public.owns_defect(uuid) to authenticated;
create policy "runs_own" on public.test_runs for all using (public.owns_studio_workspace(workspace_id)) with check (auth.uid()=user_id and public.owns_studio_workspace(workspace_id));
create policy "executions_own" on public.test_executions for all using (public.owns_test_run(run_id)) with check (auth.uid()=user_id and public.owns_test_run(run_id));
create policy "defects_own" on public.defects for all using (public.owns_studio_workspace(workspace_id)) with check (auth.uid()=user_id and public.owns_studio_workspace(workspace_id));
create policy "defect_events_own" on public.defect_events for all using (public.owns_defect(defect_id)) with check (auth.uid()=user_id and public.owns_defect(defect_id));
create or replace function public.validate_execution_relation() returns trigger language plpgsql security definer set search_path=public as $$
begin
  if tg_table_name='test_executions' and not exists(select 1 from public.test_runs r join public.test_cases c on c.id=new.test_case_id and c.workspace_id=r.workspace_id where r.id=new.run_id and r.user_id=new.user_id and c.user_id=new.user_id) then raise exception 'Test case does not belong to this run workspace'; end if;
  if tg_table_name='defects' and new.execution_id is not null and not exists(select 1 from public.test_executions e join public.test_runs r on r.id=e.run_id where e.id=new.execution_id and r.workspace_id=new.workspace_id and e.user_id=new.user_id) then raise exception 'Execution does not belong to this workspace'; end if;
  return new;
end $$;
create trigger executions_validate before insert or update on public.test_executions for each row execute function public.validate_execution_relation();
create trigger defects_validate before insert or update on public.defects for each row execute function public.validate_execution_relation();
create trigger test_runs_updated before update on public.test_runs for each row execute function public.set_updated_at();
create trigger executions_updated before update on public.test_executions for each row execute function public.set_updated_at();
create trigger defects_updated before update on public.defects for each row execute function public.set_updated_at();
