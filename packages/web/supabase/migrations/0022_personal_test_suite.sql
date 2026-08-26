-- Test Suite pessoal: uma suíte por usuário, organizada em árvore de pastas e arquivos.
-- O Studio continua responsável pelos casos de teste estruturados por projeto;
-- esta suíte é o workspace de arquivos de automação do usuário.

create extension if not exists pgcrypto;

create table if not exists public.test_suites (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null unique references auth.users(id) on delete cascade,
  name       text not null default 'Minha Test Suite' check (char_length(btrim(name)) between 1 and 100),
  version    integer not null default 1 check (version > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.test_suite_nodes (
  id          uuid primary key default gen_random_uuid(),
  suite_id    uuid not null references public.test_suites(id) on delete cascade,
  user_id     uuid not null references auth.users(id) on delete cascade,
  parent_id   uuid references public.test_suite_nodes(id) on delete cascade,
  node_type   text not null check (node_type in ('folder', 'file')),
  name        text not null check (
    char_length(btrim(name)) between 1 and 120
    and name !~ '[\\/]'
    and name not in ('.', '..')
  ),
  language    text check (language is null or language in ('typescript', 'javascript', 'python', 'gherkin', 'json', 'yaml', 'markdown', 'text')),
  file_type   text check (file_type is null or file_type in ('spec', 'fixture', 'page_object', 'helper', 'config', 'data', 'other')),
  content     text not null default '' check (char_length(content) <= 500000),
  position    bigint not null default 1024 check (position >= 0),
  version     integer not null default 1 check (version > 0),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  archived_at timestamptz,
  check (
    (node_type = 'folder' and language is null and file_type is null and content = '')
    or node_type = 'file'
  )
);

create index if not exists test_suite_nodes_tree_idx
  on public.test_suite_nodes(suite_id, parent_id, position) where archived_at is null;

create unique index if not exists test_suite_nodes_sibling_name_idx
  on public.test_suite_nodes(
    suite_id,
    coalesce(parent_id, '00000000-0000-0000-0000-000000000000'::uuid),
    lower(name)
  ) where archived_at is null;

create or replace function public.set_test_suite_updated_at() returns trigger
language plpgsql set search_path = public as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists test_suites_set_updated_at on public.test_suites;
create trigger test_suites_set_updated_at before update on public.test_suites
  for each row execute function public.set_test_suite_updated_at();

drop trigger if exists test_suite_nodes_set_updated_at on public.test_suite_nodes;
create trigger test_suite_nodes_set_updated_at before update on public.test_suite_nodes
  for each row execute function public.set_test_suite_updated_at();

create or replace function public.enforce_test_suite_node_scope() returns trigger
language plpgsql set search_path = public as $$
begin
  if tg_op = 'UPDATE' and (
    new.suite_id <> old.suite_id or new.user_id <> old.user_id or new.node_type <> old.node_type
  ) then
    raise exception 'IMMUTABLE_TEST_SUITE_NODE_SCOPE' using errcode = 'P0001';
  end if;

  if not exists (
    select 1 from public.test_suites suite
    where suite.id = new.suite_id and suite.user_id = new.user_id
  ) then
    raise exception 'TEST_SUITE_OWNER_MISMATCH' using errcode = 'P0001';
  end if;

  if new.parent_id is not null and not exists (
    select 1 from public.test_suite_nodes parent
    where parent.id = new.parent_id
      and parent.suite_id = new.suite_id
      and parent.user_id = new.user_id
      and parent.node_type = 'folder'
      and parent.archived_at is null
  ) then
    raise exception 'INVALID_TEST_SUITE_PARENT' using errcode = 'P0001';
  end if;

  if new.parent_id = new.id then
    raise exception 'TEST_SUITE_CYCLE' using errcode = 'P0001';
  end if;

  if tg_op = 'UPDATE' and new.parent_id is distinct from old.parent_id and exists (
    with recursive descendants as (
      select node.id from public.test_suite_nodes node where node.parent_id = old.id
      union all
      select child.id
      from public.test_suite_nodes child
      join descendants parent on child.parent_id = parent.id
    )
    select 1 from descendants where id = new.parent_id
  ) then
    raise exception 'TEST_SUITE_CYCLE' using errcode = 'P0001';
  end if;

  return new;
end;
$$;

drop trigger if exists test_suite_nodes_enforce_scope on public.test_suite_nodes;
create trigger test_suite_nodes_enforce_scope before insert or update on public.test_suite_nodes
  for each row execute function public.enforce_test_suite_node_scope();

alter table public.test_suites enable row level security;
alter table public.test_suite_nodes enable row level security;

drop policy if exists test_suites_own_rows on public.test_suites;
create policy test_suites_own_rows on public.test_suites
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists test_suite_nodes_own_rows on public.test_suite_nodes;
create policy test_suite_nodes_own_rows on public.test_suite_nodes
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create or replace function public.ensure_personal_test_suite()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  actor uuid := auth.uid();
  suite public.test_suites;
begin
  if actor is null then raise exception 'AUTH_REQUIRED' using errcode = 'P0001'; end if;

  insert into public.test_suites(user_id)
  values (actor)
  on conflict (user_id) do nothing;

  select * into suite from public.test_suites where user_id = actor;
  return to_jsonb(suite);
end;
$$;

create or replace function public.rename_personal_test_suite(p_name text, p_expected_version integer)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  actor uuid := auth.uid();
  suite public.test_suites;
begin
  if actor is null then raise exception 'AUTH_REQUIRED' using errcode = 'P0001'; end if;
  if char_length(btrim(coalesce(p_name, ''))) not between 1 and 100 then
    raise exception 'INVALID_TEST_SUITE_NAME' using errcode = 'P0001';
  end if;

  select * into suite from public.test_suites where user_id = actor for update;
  if not found then raise exception 'TEST_SUITE_NOT_FOUND' using errcode = 'P0001'; end if;
  if suite.version <> p_expected_version then raise exception 'VERSION_CONFLICT' using errcode = 'P0001'; end if;

  update public.test_suites
  set name = btrim(p_name), version = version + 1
  where id = suite.id
  returning * into suite;
  return to_jsonb(suite);
end;
$$;

create or replace function public.create_test_suite_node(
  p_parent_id uuid,
  p_node_type text,
  p_name text,
  p_language text default null,
  p_file_type text default null,
  p_content text default ''
) returns jsonb language plpgsql security definer set search_path = public as $$
declare
  actor uuid := auth.uid();
  suite public.test_suites;
  created public.test_suite_nodes;
  next_position bigint;
begin
  if actor is null then raise exception 'AUTH_REQUIRED' using errcode = 'P0001'; end if;
  if p_node_type not in ('folder', 'file') then raise exception 'INVALID_NODE_TYPE' using errcode = 'P0001'; end if;

  perform public.ensure_personal_test_suite();
  select * into suite from public.test_suites where user_id = actor;

  select coalesce(max(position), 0) + 1024 into next_position
  from public.test_suite_nodes
  where suite_id = suite.id and parent_id is not distinct from p_parent_id and archived_at is null;

  insert into public.test_suite_nodes(
    suite_id, user_id, parent_id, node_type, name, language, file_type, content, position
  ) values (
    suite.id,
    actor,
    p_parent_id,
    p_node_type,
    btrim(p_name),
    case when p_node_type = 'file' then coalesce(p_language, 'typescript') else null end,
    case when p_node_type = 'file' then coalesce(p_file_type, 'spec') else null end,
    case when p_node_type = 'file' then coalesce(p_content, '') else '' end,
    next_position
  ) returning * into created;

  return to_jsonb(created);
end;
$$;

create or replace function public.update_test_suite_node(
  p_node_id uuid,
  p_name text,
  p_language text,
  p_file_type text,
  p_content text,
  p_expected_version integer
) returns jsonb language plpgsql security definer set search_path = public as $$
declare
  actor uuid := auth.uid();
  current_node public.test_suite_nodes;
begin
  if actor is null then raise exception 'AUTH_REQUIRED' using errcode = 'P0001'; end if;
  select * into current_node from public.test_suite_nodes
    where id = p_node_id and user_id = actor and archived_at is null for update;
  if not found then raise exception 'TEST_SUITE_NODE_NOT_FOUND' using errcode = 'P0001'; end if;
  if current_node.version <> p_expected_version then raise exception 'VERSION_CONFLICT' using errcode = 'P0001'; end if;

  update public.test_suite_nodes set
    name = btrim(p_name),
    language = case when node_type = 'file' then p_language else null end,
    file_type = case when node_type = 'file' then p_file_type else null end,
    content = case when node_type = 'file' then coalesce(p_content, '') else '' end,
    version = version + 1
  where id = current_node.id
  returning * into current_node;
  return to_jsonb(current_node);
end;
$$;

create or replace function public.move_test_suite_node(
  p_node_id uuid,
  p_parent_id uuid,
  p_expected_version integer
) returns jsonb language plpgsql security definer set search_path = public as $$
declare
  actor uuid := auth.uid();
  current_node public.test_suite_nodes;
  next_position bigint;
begin
  if actor is null then raise exception 'AUTH_REQUIRED' using errcode = 'P0001'; end if;
  select * into current_node from public.test_suite_nodes
    where id = p_node_id and user_id = actor and archived_at is null for update;
  if not found then raise exception 'TEST_SUITE_NODE_NOT_FOUND' using errcode = 'P0001'; end if;
  if current_node.version <> p_expected_version then raise exception 'VERSION_CONFLICT' using errcode = 'P0001'; end if;

  select coalesce(max(position), 0) + 1024 into next_position
  from public.test_suite_nodes
  where suite_id = current_node.suite_id
    and parent_id is not distinct from p_parent_id
    and id <> current_node.id
    and archived_at is null;

  update public.test_suite_nodes set
    parent_id = p_parent_id,
    position = next_position,
    version = version + 1
  where id = current_node.id
  returning * into current_node;
  return to_jsonb(current_node);
end;
$$;

create or replace function public.archive_test_suite_node(p_node_id uuid, p_expected_version integer)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  actor uuid := auth.uid();
  current_node public.test_suite_nodes;
  archived_count integer;
begin
  if actor is null then raise exception 'AUTH_REQUIRED' using errcode = 'P0001'; end if;
  select * into current_node from public.test_suite_nodes
    where id = p_node_id and user_id = actor and archived_at is null for update;
  if not found then raise exception 'TEST_SUITE_NODE_NOT_FOUND' using errcode = 'P0001'; end if;
  if current_node.version <> p_expected_version then raise exception 'VERSION_CONFLICT' using errcode = 'P0001'; end if;

  with recursive subtree as (
    select id from public.test_suite_nodes where id = current_node.id and user_id = actor
    union all
    select child.id from public.test_suite_nodes child join subtree parent on child.parent_id = parent.id
    where child.user_id = actor and child.archived_at is null
  )
  update public.test_suite_nodes set archived_at = now(), version = version + 1
  where id in (select id from subtree);
  get diagnostics archived_count = row_count;

  return jsonb_build_object('id', current_node.id, 'archivedCount', archived_count);
end;
$$;

revoke all on function public.ensure_personal_test_suite() from public;
revoke all on function public.rename_personal_test_suite(text, integer) from public;
revoke all on function public.create_test_suite_node(uuid, text, text, text, text, text) from public;
revoke all on function public.update_test_suite_node(uuid, text, text, text, text, integer) from public;
revoke all on function public.move_test_suite_node(uuid, uuid, integer) from public;
revoke all on function public.archive_test_suite_node(uuid, integer) from public;

grant execute on function public.ensure_personal_test_suite() to authenticated;
grant execute on function public.rename_personal_test_suite(text, integer) to authenticated;
grant execute on function public.create_test_suite_node(uuid, text, text, text, text, text) to authenticated;
grant execute on function public.update_test_suite_node(uuid, text, text, text, text, integer) to authenticated;
grant execute on function public.move_test_suite_node(uuid, uuid, integer) to authenticated;
grant execute on function public.archive_test_suite_node(uuid, integer) to authenticated;
