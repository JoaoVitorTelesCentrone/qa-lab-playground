-- Board V2: backlog separado do status do workflow.
-- Depende de 0016_board_v2.sql.

alter table public.board_work_items
  add column if not exists in_backlog boolean not null default false;

create index if not exists board_work_items_backlog_rank_idx
  on public.board_work_items(board_id, rank)
  where in_backlog and archived_at is null;

-- A nova assinatura inclui o destino inicial. A anterior deixa de ser exposta.
drop function if exists public.create_board_work_item(uuid, text, text, text, text);

create or replace function public.create_board_work_item(
  p_board_id uuid,
  p_title text,
  p_type text default 'story',
  p_priority text default 'medium',
  p_description text default '',
  p_in_backlog boolean default false
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
  select id into target_column from public.board_columns where board_id = p_board_id and is_initial and active limit 1;
  if target_column is null then raise exception 'INITIAL_COLUMN_NOT_FOUND' using errcode = 'P0001'; end if;

  select coalesce(max(rank), 0) + 1024 into next_rank from public.board_work_items
    where board_id = p_board_id and in_backlog = p_in_backlog and archived_at is null
      and (p_in_backlog or column_id = target_column);

  insert into public.board_work_items(
    project_id, board_id, column_id, issue_number, key, type, title,
    description, priority, reporter_id, rank, in_backlog
  ) values (
    target_project.id, p_board_id, target_column, issue_no,
    target_project.key || '-' || issue_no, p_type, trim(p_title),
    left(coalesce(p_description, ''), 10000), p_priority, actor, next_rank, p_in_backlog
  ) returning * into created_item;

  insert into public.board_work_item_events(work_item_id, project_id, actor_id, event_type, payload)
  values (created_item.id, created_item.project_id, actor, 'created', jsonb_build_object(
    'columnId', target_column, 'inBacklog', p_in_backlog
  ));
  return to_jsonb(created_item);
end;
$$;

create or replace function public.set_board_work_item_backlog(
  p_item_id uuid,
  p_in_backlog boolean,
  p_expected_version integer
) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  actor uuid := auth.uid();
  item public.board_work_items%rowtype;
  target_column uuid;
  next_rank bigint;
begin
  if actor is null then raise exception 'AUTH_REQUIRED' using errcode = 'P0001'; end if;
  select * into item from public.board_work_items where id = p_item_id and archived_at is null for update;
  if not found then raise exception 'ITEM_NOT_FOUND' using errcode = 'P0001'; end if;
  if not public.can_edit_board_project(item.project_id) then raise exception 'FORBIDDEN' using errcode = 'P0001'; end if;
  if item.version <> p_expected_version then raise exception 'VERSION_CONFLICT' using errcode = 'P0001'; end if;
  if item.in_backlog = p_in_backlog then return to_jsonb(item); end if;

  perform pg_advisory_xact_lock(hashtextextended(item.board_id::text || ':backlog', 0));
  select id into target_column from public.board_columns where board_id = item.board_id and is_initial and active limit 1;
  select coalesce(max(rank), 0) + 1024 into next_rank from public.board_work_items
    where board_id = item.board_id and in_backlog = p_in_backlog and archived_at is null and id <> item.id
      and (p_in_backlog or column_id = target_column);

  update public.board_work_items set
    in_backlog = p_in_backlog,
    column_id = target_column,
    rank = next_rank,
    resolved_at = null,
    version = version + 1
  where id = item.id returning * into item;

  insert into public.board_work_item_events(work_item_id, project_id, actor_id, event_type, payload)
  values (item.id, item.project_id, actor, case when p_in_backlog then 'sent_to_backlog' else 'planned' end,
    jsonb_build_object('inBacklog', p_in_backlog, 'columnId', target_column));
  return to_jsonb(item);
end;
$$;

revoke all on function public.create_board_work_item(uuid, text, text, text, text, boolean) from public, anon;
revoke all on function public.set_board_work_item_backlog(uuid, boolean, integer) from public, anon;
grant execute on function public.create_board_work_item(uuid, text, text, text, text, boolean) to authenticated;
grant execute on function public.set_board_work_item_backlog(uuid, boolean, integer) to authenticated;

