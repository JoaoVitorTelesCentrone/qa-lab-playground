-- Board V2: detalhe editável, checklist, comentários e atividade.
-- Depende de 0016_board_v2.sql.

create table if not exists public.board_work_item_comments (
  id           uuid primary key default gen_random_uuid(),
  work_item_id uuid not null references public.board_work_items(id) on delete cascade,
  project_id   uuid not null references public.board_projects(id) on delete cascade,
  author_id    uuid not null references auth.users(id) on delete restrict,
  body         text not null check (char_length(body) between 1 and 4000),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  deleted_at   timestamptz
);

create table if not exists public.board_work_item_checklist (
  id           uuid primary key default gen_random_uuid(),
  work_item_id uuid not null references public.board_work_items(id) on delete cascade,
  project_id   uuid not null references public.board_projects(id) on delete cascade,
  text         text not null check (char_length(text) between 1 and 300),
  position     integer not null check (position >= 0),
  done         boolean not null default false,
  created_by   uuid not null references auth.users(id) on delete restrict,
  completed_by uuid references auth.users(id) on delete set null,
  completed_at timestamptz,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  unique (work_item_id, position)
);

create index if not exists board_comments_item_idx
  on public.board_work_item_comments(work_item_id, created_at) where deleted_at is null;
create index if not exists board_checklist_item_idx
  on public.board_work_item_checklist(work_item_id, position);

drop trigger if exists board_comments_set_updated_at on public.board_work_item_comments;
create trigger board_comments_set_updated_at before update on public.board_work_item_comments
  for each row execute function public.set_board_updated_at();
drop trigger if exists board_checklist_set_updated_at on public.board_work_item_checklist;
create trigger board_checklist_set_updated_at before update on public.board_work_item_checklist
  for each row execute function public.set_board_updated_at();

create or replace function public.enforce_board_item_child_scope() returns trigger
language plpgsql set search_path = public as $$
begin
  if not exists (
    select 1 from public.board_work_items item
    where item.id = new.work_item_id and item.project_id = new.project_id
  ) then
    raise exception 'WORK_ITEM_PROJECT_MISMATCH' using errcode = 'P0001';
  end if;
  if tg_op = 'UPDATE' and (new.work_item_id <> old.work_item_id or new.project_id <> old.project_id) then
    raise exception 'IMMUTABLE_CHILD_SCOPE' using errcode = 'P0001';
  end if;
  return new;
end;
$$;

drop trigger if exists board_comments_enforce_scope on public.board_work_item_comments;
create trigger board_comments_enforce_scope before insert or update on public.board_work_item_comments
  for each row execute function public.enforce_board_item_child_scope();
drop trigger if exists board_checklist_enforce_scope on public.board_work_item_checklist;
create trigger board_checklist_enforce_scope before insert or update on public.board_work_item_checklist
  for each row execute function public.enforce_board_item_child_scope();

alter table public.board_work_item_comments enable row level security;
alter table public.board_work_item_checklist enable row level security;

drop policy if exists "board_comments_read" on public.board_work_item_comments;
create policy "board_comments_read" on public.board_work_item_comments for select
  using (public.is_board_project_member(project_id));
drop policy if exists "board_comments_create" on public.board_work_item_comments;
create policy "board_comments_create" on public.board_work_item_comments for insert
  with check (author_id = auth.uid() and public.can_edit_board_project(project_id));
drop policy if exists "board_comments_update" on public.board_work_item_comments;
create policy "board_comments_update" on public.board_work_item_comments for update
  using (author_id = auth.uid() or public.can_admin_board_project(project_id))
  with check (author_id = auth.uid() or public.can_admin_board_project(project_id));
drop policy if exists "board_comments_delete" on public.board_work_item_comments;
create policy "board_comments_delete" on public.board_work_item_comments for delete
  using (author_id = auth.uid() or public.can_admin_board_project(project_id));

drop policy if exists "board_checklist_read" on public.board_work_item_checklist;
create policy "board_checklist_read" on public.board_work_item_checklist for select
  using (public.is_board_project_member(project_id));
drop policy if exists "board_checklist_create" on public.board_work_item_checklist;
create policy "board_checklist_create" on public.board_work_item_checklist for insert
  with check (created_by = auth.uid() and public.can_edit_board_project(project_id));
drop policy if exists "board_checklist_update" on public.board_work_item_checklist;
create policy "board_checklist_update" on public.board_work_item_checklist for update
  using (public.can_edit_board_project(project_id)) with check (public.can_edit_board_project(project_id));
drop policy if exists "board_checklist_delete" on public.board_work_item_checklist;
create policy "board_checklist_delete" on public.board_work_item_checklist for delete
  using (public.can_edit_board_project(project_id));

create or replace function public.update_board_work_item(
  p_item_id uuid,
  p_expected_version integer,
  p_title text,
  p_description text,
  p_type text,
  p_priority text,
  p_severity text default null,
  p_story_points numeric default null,
  p_due_at timestamptz default null,
  p_acceptance_criteria jsonb default '[]'::jsonb
) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  actor uuid := auth.uid();
  item public.board_work_items%rowtype;
  updated_item public.board_work_items%rowtype;
begin
  if actor is null then raise exception 'AUTH_REQUIRED' using errcode = 'P0001'; end if;
  select * into item from public.board_work_items where id = p_item_id and archived_at is null for update;
  if not found then raise exception 'ITEM_NOT_FOUND' using errcode = 'P0001'; end if;
  if not public.can_edit_board_project(item.project_id) then raise exception 'FORBIDDEN' using errcode = 'P0001'; end if;
  if item.version <> p_expected_version then raise exception 'VERSION_CONFLICT' using errcode = 'P0001'; end if;
  if char_length(trim(p_title)) not between 1 and 180 then raise exception 'INVALID_TITLE' using errcode = 'P0001'; end if;
  if char_length(coalesce(p_description, '')) > 10000 then raise exception 'INVALID_DESCRIPTION' using errcode = 'P0001'; end if;
  if p_type not in ('epic', 'story', 'task', 'bug', 'test', 'subtask') then raise exception 'INVALID_TYPE' using errcode = 'P0001'; end if;
  if p_priority not in ('lowest', 'low', 'medium', 'high', 'highest') then raise exception 'INVALID_PRIORITY' using errcode = 'P0001'; end if;
  if p_severity is not null and p_severity not in ('low', 'medium', 'high', 'critical') then raise exception 'INVALID_SEVERITY' using errcode = 'P0001'; end if;
  if p_story_points is not null and (p_story_points < 0 or p_story_points > 9999) then raise exception 'INVALID_STORY_POINTS' using errcode = 'P0001'; end if;
  if jsonb_typeof(p_acceptance_criteria) <> 'array' or jsonb_array_length(p_acceptance_criteria) > 20 then
    raise exception 'INVALID_ACCEPTANCE_CRITERIA' using errcode = 'P0001';
  end if;
  if exists (select 1 from jsonb_array_elements_text(p_acceptance_criteria) criterion where char_length(criterion) > 500) then
    raise exception 'INVALID_ACCEPTANCE_CRITERIA' using errcode = 'P0001';
  end if;

  update public.board_work_items set
    title = trim(p_title),
    description = coalesce(p_description, ''),
    type = p_type,
    priority = p_priority,
    severity = case when p_type = 'bug' then p_severity else null end,
    story_points = p_story_points,
    due_at = p_due_at,
    acceptance_criteria = p_acceptance_criteria,
    version = version + 1
  where id = item.id
  returning * into updated_item;

  insert into public.board_work_item_events(work_item_id, project_id, actor_id, event_type, payload)
  values (item.id, item.project_id, actor, 'updated', jsonb_build_object(
    'version', updated_item.version,
    'titleChanged', item.title is distinct from updated_item.title,
    'descriptionChanged', item.description is distinct from updated_item.description,
    'typeChanged', item.type is distinct from updated_item.type,
    'priorityChanged', item.priority is distinct from updated_item.priority,
    'dueAtChanged', item.due_at is distinct from updated_item.due_at
  ));
  return to_jsonb(updated_item);
end;
$$;

create or replace function public.archive_board_work_item(
  p_item_id uuid,
  p_expected_version integer
) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  actor uuid := auth.uid();
  item public.board_work_items%rowtype;
begin
  if actor is null then raise exception 'AUTH_REQUIRED' using errcode = 'P0001'; end if;
  select * into item from public.board_work_items where id = p_item_id and archived_at is null for update;
  if not found then raise exception 'ITEM_NOT_FOUND' using errcode = 'P0001'; end if;
  if not public.can_edit_board_project(item.project_id) then raise exception 'FORBIDDEN' using errcode = 'P0001'; end if;
  if item.version <> p_expected_version then raise exception 'VERSION_CONFLICT' using errcode = 'P0001'; end if;
  update public.board_work_items set archived_at = now(), version = version + 1 where id = item.id returning * into item;
  insert into public.board_work_item_events(work_item_id, project_id, actor_id, event_type, payload)
  values (item.id, item.project_id, actor, 'archived', jsonb_build_object('version', item.version));
  return to_jsonb(item);
end;
$$;

create or replace function public.add_board_comment(p_item_id uuid, p_body text) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  actor uuid := auth.uid();
  item public.board_work_items%rowtype;
  comment public.board_work_item_comments%rowtype;
begin
  select * into item from public.board_work_items where id = p_item_id and archived_at is null;
  if actor is null then raise exception 'AUTH_REQUIRED' using errcode = 'P0001'; end if;
  if not found then raise exception 'ITEM_NOT_FOUND' using errcode = 'P0001'; end if;
  if not public.can_edit_board_project(item.project_id) then raise exception 'FORBIDDEN' using errcode = 'P0001'; end if;
  if char_length(trim(p_body)) not between 1 and 4000 then raise exception 'INVALID_COMMENT' using errcode = 'P0001'; end if;
  insert into public.board_work_item_comments(work_item_id, project_id, author_id, body)
  values (item.id, item.project_id, actor, trim(p_body)) returning * into comment;
  return to_jsonb(comment);
end;
$$;

create or replace function public.add_board_checklist_item(p_item_id uuid, p_text text) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  actor uuid := auth.uid();
  item public.board_work_items%rowtype;
  entry public.board_work_item_checklist%rowtype;
  next_position integer;
begin
  select * into item from public.board_work_items where id = p_item_id and archived_at is null;
  if actor is null then raise exception 'AUTH_REQUIRED' using errcode = 'P0001'; end if;
  if not found then raise exception 'ITEM_NOT_FOUND' using errcode = 'P0001'; end if;
  if not public.can_edit_board_project(item.project_id) then raise exception 'FORBIDDEN' using errcode = 'P0001'; end if;
  if char_length(trim(p_text)) not between 1 and 300 then raise exception 'INVALID_CHECKLIST_TEXT' using errcode = 'P0001'; end if;
  perform pg_advisory_xact_lock(hashtextextended(item.id::text || ':checklist', 0));
  select coalesce(max(position), -1) + 1 into next_position from public.board_work_item_checklist where work_item_id = item.id;
  insert into public.board_work_item_checklist(work_item_id, project_id, text, position, created_by)
  values (item.id, item.project_id, trim(p_text), next_position, actor) returning * into entry;
  return to_jsonb(entry);
end;
$$;

revoke all on function public.update_board_work_item(uuid, integer, text, text, text, text, text, numeric, timestamptz, jsonb) from public, anon;
revoke all on function public.archive_board_work_item(uuid, integer) from public, anon;
revoke all on function public.add_board_comment(uuid, text) from public, anon;
revoke all on function public.add_board_checklist_item(uuid, text) from public, anon;
grant execute on function public.update_board_work_item(uuid, integer, text, text, text, text, text, numeric, timestamptz, jsonb) to authenticated;
grant execute on function public.archive_board_work_item(uuid, integer) to authenticated;
grant execute on function public.add_board_comment(uuid, text) to authenticated;
grant execute on function public.add_board_checklist_item(uuid, text) to authenticated;

