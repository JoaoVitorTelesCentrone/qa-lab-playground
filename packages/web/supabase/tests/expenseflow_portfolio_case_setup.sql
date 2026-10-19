create role anon;
create role authenticated;
create role service_role;
create schema auth;
create table auth.users (id uuid primary key);
create function auth.uid() returns uuid language sql stable as $$
  select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid
$$;

insert into auth.users (id) values
  ('11111111-1111-4111-8111-111111111111'),
  ('22222222-2222-4222-8222-222222222222');

create table public.profiles (
  id uuid primary key references auth.users(id),
  username text unique,
  portfolio_public boolean not null default false
);
insert into public.profiles (id, username) values
  ('11111111-1111-4111-8111-111111111111', 'aluno-um'),
  ('22222222-2222-4222-8222-222222222222', 'aluno-dois');

create table public.deliverables (
  id uuid primary key,
  user_id uuid not null references auth.users(id),
  kind text not null,
  payload jsonb not null
);
insert into public.deliverables (id, user_id, kind, payload) values
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', '11111111-1111-4111-8111-111111111111', 'expenseflow-challenge-v1', '{}'::jsonb),
  ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', '22222222-2222-4222-8222-222222222222', 'expenseflow-challenge-v1', '{}'::jsonb);

grant usage on schema auth, public to anon, authenticated;
grant execute on function auth.uid() to authenticated;
grant select, update on public.profiles to authenticated;
grant select on public.profiles to anon;
grant select, delete on public.deliverables to authenticated;
alter table public.profiles enable row level security;
alter table public.deliverables enable row level security;
create policy own_profile on public.profiles for all to authenticated
  using ((select auth.uid()) = id) with check ((select auth.uid()) = id);
create policy public_profile on public.profiles for select to anon, authenticated
  using (portfolio_public = true);
create policy own_deliverable on public.deliverables for all to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
