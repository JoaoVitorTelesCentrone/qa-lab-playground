-- Board V2: primeira fatia vertical colaborativa.
-- Projeto -> board -> colunas -> itens, com RLS por associação e movimento atômico.

create extension if not exists pgcrypto;

create table if not exists public.board_projects (
  id                uuid primary key default gen_random_uuid(),
  owner_id          uuid not null references auth.users(id) on delete cascade,
  name              text not null check (char_length(name) between 1 and 100),
  key               text not null unique check (key ~ '^[A-Z][A-Z0-9]{1,9}$'),
  description       text not null default '' check (char_length(description) <= 1000),
  status            text not null default 'active' check (status in ('active', 'archived')),
  next_issue_number bigint not null default 1 check (next_issue_number > 0),
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  archived_at       timestamptz
);

create table if not exists public.board_members (
  project_id uuid not null references public.board_projects(id) on delete cascade,
  user_id    uuid not null references auth.users(id) on delete cascade,
  role       text not null default 'member' check (role in ('owner', 'admin', 'member', 'viewer')),
  status     text not null default 'active' check (status in ('active', 'revoked')),
  created_at timestamptz not null default now(),
  primary key (project_id, user_id)
);

create table if not exists public.boards (
  id          uuid primary key default gen_random_uuid(),
  project_id  uuid not null references public.board_projects(id) on delete cascade,
  name        text not null check (char_length(name) between 1 and 100),
  kind        text not null default 'kanban' check (kind in ('kanban', 'scrum')),
  status      text not null default 'active' check (status in ('active', 'archived')),
  created_by  uuid not null references auth.users(id) on delete restrict,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table if not exists public.board_columns (
  id          uuid primary key default gen_random_uuid(),
  board_id    uuid not null references public.boards(id) on delete cascade,
  name        text not null check (char_length(name) between 1 and 60),
  position    integer not null check (position >= 0),
  category    text not null default 'todo' check (category in ('todo', 'in_progress', 'done')),
  color       text not null default 'slate',
  wip_limit   integer check (wip_limit is null or wip_limit > 0),
  is_initial  boolean not null default false,
  is_final    boolean not null default false,
  active      boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (board_id, position)
);

create unique index if not exists board_columns_one_initial_idx
  on public.board_columns(board_id) where is_initial and active;
create unique index if not exists board_columns_one_final_idx
  on public.board_columns(board_id) where is_final and active;

create table if not exists public.board_work_items (
  id                  uuid primary key default gen_random_uuid(),
  project_id          uuid not null references public.board_projects(id) on delete cascade,
  board_id            uuid not null references public.boards(id) on delete cascade,
  column_id           uuid not null references public.board_columns(id) on delete restrict,
  parent_id           uuid references public.board_work_items(id) on delete set null,
  issue_number        bigint not null,
  key                 text not null,
  type                text not null default 'story' check (type in ('epic', 'story', 'task', 'bug', 'test', 'subtask')),
  title               text not null check (char_length(title) between 1 and 180),
  description         text not null default '' check (char_length(description) <= 10000),
  priority            text not null default 'medium' check (priority in ('lowest', 'low', 'medium', 'high', 'highest')),
  severity            text check (severity is null or severity in ('low', 'medium', 'high', 'critical')),
  story_points        numeric(6,2) check (story_points is null or story_points >= 0),
  reporter_id         uuid not null references auth.users(id) on delete restrict,
  assignee_id         uuid references auth.users(id) on delete set null,
  rank                bigint not null,
  version             integer not null default 1,
  acceptance_criteria jsonb not null default '[]'::jsonb,
  qa_details          jsonb not null default '{}'::jsonb,
  due_at              timestamptz,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  resolved_at         timestamptz,
  archived_at         timestamptz,
  unique (project_id, issue_number),
  unique (project_id, key)
);

create table if not exists public.board_work_item_events (
  id           bigint generated always as identity primary key,
  work_item_id uuid not null references public.board_work_items(id) on delete cascade,
  project_id   uuid not null references public.board_projects(id) on delete cascade,
  actor_id     uuid not null references auth.users(id) on delete restrict,
  event_type   text not null,
  payload      jsonb not null default '{}'::jsonb,
  created_at   timestamptz not null default now()
);

create index if not exists boards_project_idx on public.boards(project_id, updated_at desc);
create index if not exists board_columns_board_idx on public.board_columns(board_id, position);
create index if not exists board_work_items_column_rank_idx
  on public.board_work_items(board_id, column_id, rank) where archived_at is null;
create index if not exists board_work_items_assignee_idx
  on public.board_work_items(board_id, assignee_id) where archived_at is null;
create index if not exists board_work_item_events_item_idx
  on public.board_work_item_events(work_item_id, created_at desc);

create or replace function public.enforce_board_work_item_scope() returns trigger
language plpgsql set search_path = public as $$
begin
  if tg_op = 'UPDATE' and (
    new.project_id <> old.project_id or new.board_id <> old.board_id or
    new.issue_number <> old.issue_number or new.key <> old.key or new.reporter_id <> old.reporter_id
  ) then
    raise exception 'IMMUTABLE_WORK_ITEM_SCOPE' using errcode = 'P0001';
  end if;

  if not exists (
    select 1 from public.boards b where b.id = new.board_id and b.project_id = new.project_id
  ) then
    raise exception 'BOARD_PROJECT_MISMATCH' using errcode = 'P0001';
  end if;
  if not exists (
    select 1 from public.board_columns c where c.id = new.column_id and c.board_id = new.board_id and c.active
  ) then
    raise exception 'COLUMN_BOARD_MISMATCH' using errcode = 'P0001';
  end if;
  if new.parent_id is not null and not exists (
    select 1 from public.board_work_items parent
    where parent.id = new.parent_id and parent.project_id = new.project_id and parent.board_id = new.board_id
  ) then
    raise exception 'PARENT_PROJECT_MISMATCH' using errcode = 'P0001';
  end if;
  if new.assignee_id is not null and not exists (
    select 1 from public.board_members member
    where member.project_id = new.project_id and member.user_id = new.assignee_id and member.status = 'active'
  ) then
    raise exception 'ASSIGNEE_NOT_MEMBER' using errcode = 'P0001';
  end if;
  return new;
end;
$$;

drop trigger if exists board_work_items_enforce_scope on public.board_work_items;
create trigger board_work_items_enforce_scope before insert or update on public.board_work_items
  for each row execute function public.enforce_board_work_item_scope();

create or replace function public.set_board_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists board_projects_set_updated_at on public.board_projects;
create trigger board_projects_set_updated_at before update on public.board_projects
  for each row execute function public.set_board_updated_at();
drop trigger if exists boards_set_updated_at on public.boards;
create trigger boards_set_updated_at before update on public.boards
  for each row execute function public.set_board_updated_at();
drop trigger if exists board_columns_set_updated_at on public.board_columns;
create trigger board_columns_set_updated_at before update on public.board_columns
  for each row execute function public.set_board_updated_at();
drop trigger if exists board_work_items_set_updated_at on public.board_work_items;
create trigger board_work_items_set_updated_at before update on public.board_work_items
  for each row execute function public.set_board_updated_at();

create or replace function public.is_board_project_member(target uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.board_members
    where project_id = target and user_id = auth.uid() and status = 'active'
  )
$$;

create or replace function public.can_edit_board_project(target uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.board_members
    where project_id = target and user_id = auth.uid() and status = 'active'
      and role in ('owner', 'admin', 'member')
  )
$$;

create or replace function public.can_admin_board_project(target uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.board_members
    where project_id = target and user_id = auth.uid() and status = 'active'
      and role in ('owner', 'admin')
  )
$$;

revoke all on function public.is_board_project_member(uuid) from public, anon;
revoke all on function public.can_edit_board_project(uuid) from public, anon;
revoke all on function public.can_admin_board_project(uuid) from public, anon;
grant execute on function public.is_board_project_member(uuid) to authenticated;
grant execute on function public.can_edit_board_project(uuid) to authenticated;
grant execute on function public.can_admin_board_project(uuid) to authenticated;

alter table public.board_projects enable row level security;
alter table public.board_members enable row level security;
alter table public.boards enable row level security;
alter table public.board_columns enable row level security;
alter table public.board_work_items enable row level security;
alter table public.board_work_item_events enable row level security;

drop policy if exists "board_projects_read" on public.board_projects;
create policy "board_projects_read" on public.board_projects for select
  using (public.is_board_project_member(id));
drop policy if exists "board_projects_create" on public.board_projects;
create policy "board_projects_create" on public.board_projects for insert
  with check (owner_id = auth.uid());
drop policy if exists "board_projects_update" on public.board_projects;
create policy "board_projects_update" on public.board_projects for update
  using (public.can_admin_board_project(id)) with check (public.can_admin_board_project(id));
drop policy if exists "board_projects_delete" on public.board_projects;
create policy "board_projects_delete" on public.board_projects for delete
  using (owner_id = auth.uid());

drop policy if exists "board_members_read" on public.board_members;
create policy "board_members_read" on public.board_members for select
  using (public.is_board_project_member(project_id));
drop policy if exists "board_members_manage" on public.board_members;
create policy "board_members_manage" on public.board_members for all
  using (public.can_admin_board_project(project_id))
  with check (public.can_admin_board_project(project_id));

drop policy if exists "boards_read" on public.boards;
create policy "boards_read" on public.boards for select
  using (public.is_board_project_member(project_id));
drop policy if exists "boards_create" on public.boards;
create policy "boards_create" on public.boards for insert
  with check (public.can_admin_board_project(project_id) and created_by = auth.uid());
drop policy if exists "boards_update" on public.boards;
create policy "boards_update" on public.boards for update
  using (public.can_admin_board_project(project_id)) with check (public.can_admin_board_project(project_id));
drop policy if exists "boards_delete" on public.boards;
create policy "boards_delete" on public.boards for delete
  using (public.can_admin_board_project(project_id));

drop policy if exists "board_columns_read" on public.board_columns;
create policy "board_columns_read" on public.board_columns for select using (
  exists (select 1 from public.boards b where b.id = board_id and public.is_board_project_member(b.project_id))
);
drop policy if exists "board_columns_manage" on public.board_columns;
create policy "board_columns_manage" on public.board_columns for all using (
  exists (select 1 from public.boards b where b.id = board_id and public.can_admin_board_project(b.project_id))
) with check (
  exists (select 1 from public.boards b where b.id = board_id and public.can_admin_board_project(b.project_id))
);

drop policy if exists "board_work_items_read" on public.board_work_items;
create policy "board_work_items_read" on public.board_work_items for select
  using (public.is_board_project_member(project_id));
drop policy if exists "board_work_items_create" on public.board_work_items;
create policy "board_work_items_create" on public.board_work_items for insert
  with check (public.can_edit_board_project(project_id) and reporter_id = auth.uid());
drop policy if exists "board_work_items_update" on public.board_work_items;
create policy "board_work_items_update" on public.board_work_items for update
  using (public.can_edit_board_project(project_id)) with check (public.can_edit_board_project(project_id));
drop policy if exists "board_work_items_delete" on public.board_work_items;
create policy "board_work_items_delete" on public.board_work_items for delete
  using (public.can_admin_board_project(project_id));

drop policy if exists "board_events_read" on public.board_work_item_events;
create policy "board_events_read" on public.board_work_item_events for select
  using (public.is_board_project_member(project_id));

create or replace function public.create_board_project(
  p_name text,
  p_key text,
  p_board_name text default 'Board principal',
  p_kind text default 'kanban'
) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  actor uuid := auth.uid();
  project_id uuid;
  board_id uuid;
  normalized_name text := trim(p_name);
  normalized_key text := upper(trim(p_key));
begin
  if actor is null then raise exception 'AUTH_REQUIRED' using errcode = 'P0001'; end if;
  if char_length(normalized_name) not between 1 and 100 then raise exception 'INVALID_PROJECT_NAME' using errcode = 'P0001'; end if;
  if normalized_key !~ '^[A-Z][A-Z0-9]{1,9}$' then raise exception 'INVALID_PROJECT_KEY' using errcode = 'P0001'; end if;
  if p_kind not in ('kanban', 'scrum') then raise exception 'INVALID_BOARD_KIND' using errcode = 'P0001'; end if;

  insert into public.board_projects(owner_id, name, key)
  values (actor, normalized_name, normalized_key)
  returning id into project_id;

  insert into public.board_members(project_id, user_id, role)
  values (project_id, actor, 'owner');

  insert into public.boards(project_id, name, kind, created_by)
  values (project_id, coalesce(nullif(trim(p_board_name), ''), 'Board principal'), p_kind, actor)
  returning id into board_id;

  insert into public.board_columns(board_id, name, position, category, color, is_initial, is_final)
  values
    (board_id, 'A fazer',       0, 'todo',        'blue',   true,  false),
    (board_id, 'Em andamento',  1, 'in_progress', 'amber',  false, false),
    (board_id, 'Em revisão',    2, 'in_progress', 'violet', false, false),
    (board_id, 'Concluído',     3, 'done',         'green',  false, true);

  return jsonb_build_object('projectId', project_id, 'boardId', board_id);
exception
  when unique_violation then
    raise exception 'PROJECT_KEY_TAKEN' using errcode = 'P0001';
end;
$$;

create or replace function public.create_board_work_item(
  p_board_id uuid,
  p_title text,
  p_type text default 'story',
  p_priority text default 'medium',
  p_description text default ''
) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  actor uuid := auth.uid();
  target_board public.boards%rowtype;
  target_project public.board_projects%rowtype;
  target_column uuid;
  issue_no bigint;
  next_rank bigint;
  created_item public.board_work_items%rowtype;
begin
  if actor is null then raise exception 'AUTH_REQUIRED' using errcode = 'P0001'; end if;
  select * into target_board from public.boards where id = p_board_id and status = 'active';
  if not found then raise exception 'BOARD_NOT_FOUND' using errcode = 'P0001'; end if;
  if not public.can_edit_board_project(target_board.project_id) then raise exception 'FORBIDDEN' using errcode = 'P0001'; end if;
  if char_length(trim(p_title)) not between 1 and 180 then raise exception 'INVALID_TITLE' using errcode = 'P0001'; end if;
  if p_type not in ('epic', 'story', 'task', 'bug', 'test', 'subtask') then raise exception 'INVALID_TYPE' using errcode = 'P0001'; end if;
  if p_priority not in ('lowest', 'low', 'medium', 'high', 'highest') then raise exception 'INVALID_PRIORITY' using errcode = 'P0001'; end if;

  select * into target_project from public.board_projects where id = target_board.project_id for update;
  issue_no := target_project.next_issue_number;
  update public.board_projects set next_issue_number = next_issue_number + 1 where id = target_project.id;

  select id into target_column from public.board_columns
    where board_id = p_board_id and is_initial and active limit 1;
  if target_column is null then raise exception 'INITIAL_COLUMN_NOT_FOUND' using errcode = 'P0001'; end if;

  select coalesce(max(rank), 0) + 1024 into next_rank
    from public.board_work_items where board_id = p_board_id and column_id = target_column and archived_at is null;

  insert into public.board_work_items(
    project_id, board_id, column_id, issue_number, key, type, title,
    description, priority, reporter_id, rank
  ) values (
    target_project.id, p_board_id, target_column, issue_no,
    target_project.key || '-' || issue_no, p_type, trim(p_title),
    left(coalesce(p_description, ''), 10000), p_priority, actor, next_rank
  ) returning * into created_item;

  insert into public.board_work_item_events(work_item_id, project_id, actor_id, event_type, payload)
  values (created_item.id, created_item.project_id, actor, 'created', jsonb_build_object('columnId', target_column));

  return to_jsonb(created_item);
end;
$$;

create or replace function public.move_board_work_item(
  p_item_id uuid,
  p_to_column_id uuid,
  p_before_item_id uuid default null,
  p_after_item_id uuid default null,
  p_expected_version integer default null
) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  actor uuid := auth.uid();
  item public.board_work_items%rowtype;
  before_rank bigint;
  after_rank bigint;
  new_rank bigint;
  old_column uuid;
begin
  if actor is null then raise exception 'AUTH_REQUIRED' using errcode = 'P0001'; end if;
  select * into item from public.board_work_items where id = p_item_id and archived_at is null for update;
  if not found then raise exception 'ITEM_NOT_FOUND' using errcode = 'P0001'; end if;
  if not public.can_edit_board_project(item.project_id) then raise exception 'FORBIDDEN' using errcode = 'P0001'; end if;
  if p_expected_version is not null and item.version <> p_expected_version then
    raise exception 'VERSION_CONFLICT' using errcode = 'P0001';
  end if;
  if p_before_item_id = item.id or p_after_item_id = item.id then
    raise exception 'INVALID_NEIGHBOR_ITEM' using errcode = 'P0001';
  end if;
  if not exists (select 1 from public.board_columns where id = p_to_column_id and board_id = item.board_id and active) then
    raise exception 'INVALID_TARGET_COLUMN' using errcode = 'P0001';
  end if;

  -- Dois movimentos simultâneos para a mesma coluna são serializados antes de
  -- calcular o rank. O lock dura só até o fim desta transação.
  perform pg_advisory_xact_lock(hashtextextended(item.board_id::text || ':' || p_to_column_id::text, 0));

  if p_before_item_id is not null then
    select rank into before_rank from public.board_work_items
      where id = p_before_item_id and board_id = item.board_id and column_id = p_to_column_id and archived_at is null;
    if before_rank is null then raise exception 'INVALID_BEFORE_ITEM' using errcode = 'P0001'; end if;
  end if;
  if p_after_item_id is not null then
    select rank into after_rank from public.board_work_items
      where id = p_after_item_id and board_id = item.board_id and column_id = p_to_column_id and archived_at is null;
    if after_rank is null then raise exception 'INVALID_AFTER_ITEM' using errcode = 'P0001'; end if;
  end if;

  if before_rank is null and after_rank is null then
    select coalesce(max(rank), 0) + 1024 into new_rank from public.board_work_items
      where board_id = item.board_id and column_id = p_to_column_id and archived_at is null and id <> item.id;
  elsif before_rank is null then
    new_rank := after_rank - 1024;
  elsif after_rank is null then
    new_rank := before_rank + 1024;
  elsif after_rank - before_rank > 1 then
    new_rank := before_rank + ((after_rank - before_rank) / 2);
  else
    with ordered as (
      select id, row_number() over (order by rank, created_at, id) * 1024 as next_rank
      from public.board_work_items
      where board_id = item.board_id and column_id = p_to_column_id and archived_at is null and id <> item.id
    )
    update public.board_work_items target set rank = ordered.next_rank
      from ordered where target.id = ordered.id;
    select rank into before_rank from public.board_work_items where id = p_before_item_id;
    select rank into after_rank from public.board_work_items where id = p_after_item_id;
    new_rank := before_rank + ((after_rank - before_rank) / 2);
  end if;

  old_column := item.column_id;
  update public.board_work_items
    set column_id = p_to_column_id,
        rank = new_rank,
        version = version + 1,
        resolved_at = case
          when exists (select 1 from public.board_columns where id = p_to_column_id and is_final) then coalesce(resolved_at, now())
          else null
        end
    where id = item.id
    returning * into item;

  insert into public.board_work_item_events(work_item_id, project_id, actor_id, event_type, payload)
  values (item.id, item.project_id, actor, 'moved', jsonb_build_object(
    'fromColumnId', old_column, 'toColumnId', p_to_column_id, 'rank', new_rank
  ));

  return to_jsonb(item);
end;
$$;

revoke all on function public.create_board_project(text, text, text, text) from public, anon;
revoke all on function public.create_board_work_item(uuid, text, text, text, text) from public, anon;
revoke all on function public.move_board_work_item(uuid, uuid, uuid, uuid, integer) from public, anon;
grant execute on function public.create_board_project(text, text, text, text) to authenticated;
grant execute on function public.create_board_work_item(uuid, text, text, text, text) to authenticated;
grant execute on function public.move_board_work_item(uuid, uuid, uuid, uuid, integer) to authenticated;
