-- API Lab: histórico opcional de requisições vinculado ao Workspace.

create table if not exists public.api_request_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  project_id uuid references public.projects(id) on delete set null,
  method text not null check (method in ('GET', 'POST', 'PUT', 'DELETE')),
  request_url text not null check (char_length(request_url) between 1 and 1000),
  scenario text not null default 'normal' check (scenario in ('normal', 'bug')),
  request_body jsonb,
  response_status integer not null check (response_status between 0 and 599),
  response_body jsonb,
  duration_ms integer not null default 0 check (duration_ms >= 0),
  created_at timestamptz not null default now()
);

create index if not exists api_request_history_user_created_idx on public.api_request_history(user_id, created_at desc);
create index if not exists api_request_history_project_idx on public.api_request_history(project_id, created_at desc) where project_id is not null;
alter table public.api_request_history enable row level security;

create or replace function public.can_save_api_request() returns boolean
language sql stable security definer set search_path = public as $$
  select public.has_paid_plan()
    or (select count(*) from public.api_request_history where user_id = auth.uid()) < 20
$$;
revoke all on function public.can_save_api_request() from public, anon;
grant execute on function public.can_save_api_request() to authenticated;

drop policy if exists "api_history_select_own" on public.api_request_history;
drop policy if exists "api_history_insert_own" on public.api_request_history;
drop policy if exists "api_history_delete_own" on public.api_request_history;
create policy "api_history_select_own" on public.api_request_history for select using (auth.uid() = user_id);
create policy "api_history_insert_own" on public.api_request_history for insert with check (
  auth.uid() = user_id and public.can_save_api_request()
  and (project_id is null or exists (select 1 from public.projects where id = project_id and user_id = auth.uid()))
);
create policy "api_history_delete_own" on public.api_request_history for delete using (auth.uid() = user_id);

