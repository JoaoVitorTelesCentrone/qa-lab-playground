create role authenticated;
create role anon;
create schema auth;
create table auth.users (id uuid primary key);
create function auth.uid() returns uuid language sql stable as $$
  select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid
$$;
insert into auth.users (id) values ('11111111-1111-4111-8111-111111111111');

create table public.lab_submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id),
  lab_slug text not null,
  evidence text not null,
  attachments jsonb not null default '[]'::jsonb,
  published boolean not null default false,
  created_at timestamptz not null default now()
);
create table public.lab_enrollments (
  user_id uuid not null references auth.users(id),
  lab_slug text not null,
  status text not null,
  submission_id uuid references public.lab_submissions(id),
  completed_at timestamptz,
  primary key (user_id, lab_slug)
);
create table public.activity_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id),
  name text not null,
  props jsonb not null,
  created_at timestamptz not null default now()
);

grant usage on schema public, auth to authenticated;
grant execute on function auth.uid() to authenticated;
grant select, insert, update on public.lab_submissions, public.lab_enrollments, public.activity_events to authenticated;
alter table public.lab_submissions enable row level security;
alter table public.lab_enrollments enable row level security;
alter table public.activity_events enable row level security;
create policy own on public.lab_submissions for all to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy own on public.lab_enrollments for all to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy own on public.activity_events for all to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

create function public.reject_enrollment() returns trigger language plpgsql as $$
begin
  if new.lab_slug = 'falha-controlada' then
    raise exception 'Falha simulada na matricula';
  end if;
  return new;
end;
$$;
create trigger reject_enrollment before insert on public.lab_enrollments
  for each row execute function public.reject_enrollment();
