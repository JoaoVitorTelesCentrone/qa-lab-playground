-- Playground sessions and cleanup schedule.
-- The app can run with in-memory sessions locally, but production persistence
-- should use this table through service-role server code only.

create table if not exists public.playground_session_cache (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists playground_session_cache_expires_idx
  on public.playground_session_cache (expires_at);

alter table public.playground_session_cache enable row level security;
revoke all on public.playground_session_cache from anon, authenticated;

create or replace function public.cleanup_playground_sessions()
returns void
language sql
security definer
set search_path = public
as $$
  delete from public.playground_session_cache
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
