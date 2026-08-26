-- Board V2: configuração administrável de workflow e limites de WIP.
-- Depende de 0016_board_v2.sql.

alter table public.board_columns drop constraint if exists board_columns_board_id_position_key;
create unique index if not exists board_columns_active_position_idx
  on public.board_columns(board_id, position) where active;

create or replace function public.add_board_column(
  p_board_id uuid,
  p_name text,
  p_category text default 'in_progress',
  p_color text default 'slate',
  p_wip_limit integer default null
) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  actor uuid := auth.uid();
  target_board public.boards%rowtype;
  next_position integer;
  created_column public.board_columns%rowtype;
begin
  if actor is null then raise exception 'AUTH_REQUIRED' using errcode = 'P0001'; end if;
  select * into target_board from public.boards where id = p_board_id and status = 'active';
  if not found then raise exception 'BOARD_NOT_FOUND' using errcode = 'P0001'; end if;
  if not public.can_admin_board_project(target_board.project_id) then raise exception 'FORBIDDEN' using errcode = 'P0001'; end if;
  if char_length(trim(p_name)) not between 1 and 60 then raise exception 'INVALID_COLUMN_NAME' using errcode = 'P0001'; end if;
  if p_category not in ('todo', 'in_progress', 'done') then raise exception 'INVALID_COLUMN_CATEGORY' using errcode = 'P0001'; end if;
  if p_color not in ('slate', 'blue', 'amber', 'violet', 'green', 'coral') then raise exception 'INVALID_COLUMN_COLOR' using errcode = 'P0001'; end if;
  if p_wip_limit is not null and (p_wip_limit < 1 or p_wip_limit > 9999) then raise exception 'INVALID_WIP_LIMIT' using errcode = 'P0001'; end if;
  perform pg_advisory_xact_lock(hashtextextended(p_board_id::text || ':columns', 0));
  select coalesce(max(position), -1) + 1 into next_position from public.board_columns where board_id = p_board_id and active;
  insert into public.board_columns(board_id, name, position, category, color, wip_limit)
  values (p_board_id, trim(p_name), next_position, p_category, p_color, p_wip_limit)
  returning * into created_column;
  return to_jsonb(created_column);
end;
$$;

create or replace function public.update_board_column(
  p_column_id uuid,
  p_name text,
  p_category text,
  p_color text,
  p_wip_limit integer default null
) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  actor uuid := auth.uid();
  target_column public.board_columns%rowtype;
  target_project_id uuid;
begin
  if actor is null then raise exception 'AUTH_REQUIRED' using errcode = 'P0001'; end if;
  select c.* into target_column from public.board_columns c where c.id = p_column_id and c.active;
  if not found then raise exception 'COLUMN_NOT_FOUND' using errcode = 'P0001'; end if;
  select b.project_id into target_project_id from public.boards b where b.id = target_column.board_id;
  if not public.can_admin_board_project(target_project_id) then raise exception 'FORBIDDEN' using errcode = 'P0001'; end if;
  if char_length(trim(p_name)) not between 1 and 60 then raise exception 'INVALID_COLUMN_NAME' using errcode = 'P0001'; end if;
  if p_category not in ('todo', 'in_progress', 'done') then raise exception 'INVALID_COLUMN_CATEGORY' using errcode = 'P0001'; end if;
  if p_color not in ('slate', 'blue', 'amber', 'violet', 'green', 'coral') then raise exception 'INVALID_COLUMN_COLOR' using errcode = 'P0001'; end if;
  if p_wip_limit is not null and (p_wip_limit < 1 or p_wip_limit > 9999) then raise exception 'INVALID_WIP_LIMIT' using errcode = 'P0001'; end if;
  update public.board_columns set
    name = trim(p_name),
    category = case when is_initial then 'todo' when is_final then 'done' else p_category end,
    color = p_color,
    wip_limit = p_wip_limit
  where id = p_column_id returning * into target_column;
  return to_jsonb(target_column);
end;
$$;

create or replace function public.reorder_board_columns(p_board_id uuid, p_column_ids uuid[]) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  actor uuid := auth.uid();
  target_project_id uuid;
  active_count integer;
  unique_count integer;
  result jsonb;
begin
  if actor is null then raise exception 'AUTH_REQUIRED' using errcode = 'P0001'; end if;
  select b.project_id into target_project_id from public.boards b where b.id = p_board_id and b.status = 'active';
  if not found then raise exception 'BOARD_NOT_FOUND' using errcode = 'P0001'; end if;
  if not public.can_admin_board_project(target_project_id) then raise exception 'FORBIDDEN' using errcode = 'P0001'; end if;
  perform pg_advisory_xact_lock(hashtextextended(p_board_id::text || ':columns', 0));
  select count(*) into active_count from public.board_columns where board_id = p_board_id and active;
  select count(distinct value) into unique_count from unnest(p_column_ids) as ids(value);
  if coalesce(array_length(p_column_ids, 1), 0) <> active_count or unique_count <> active_count or exists (
    select 1 from unnest(p_column_ids) as ids(value) where not exists (
      select 1 from public.board_columns c where c.id = ids.value and c.board_id = p_board_id and c.active
    )
  ) then raise exception 'INVALID_COLUMN_ORDER' using errcode = 'P0001'; end if;
  update public.board_columns set position = position + 10000 where board_id = p_board_id and active;
  update public.board_columns target set position = ordered.position
  from (
    select input.id, input.ordinality::integer - 1 as position
    from unnest(p_column_ids) with ordinality as input(id, ordinality)
  ) ordered
  where target.id = ordered.id;
  select jsonb_agg(to_jsonb(c) order by c.position) into result from public.board_columns c where c.board_id = p_board_id and c.active;
  return coalesce(result, '[]'::jsonb);
end;
$$;

create or replace function public.archive_board_column(p_column_id uuid) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  actor uuid := auth.uid();
  target_column public.board_columns%rowtype;
  target_project_id uuid;
begin
  if actor is null then raise exception 'AUTH_REQUIRED' using errcode = 'P0001'; end if;
  select c.* into target_column from public.board_columns c where c.id = p_column_id and c.active for update;
  if not found then raise exception 'COLUMN_NOT_FOUND' using errcode = 'P0001'; end if;
  select b.project_id into target_project_id from public.boards b where b.id = target_column.board_id;
  if not public.can_admin_board_project(target_project_id) then raise exception 'FORBIDDEN' using errcode = 'P0001'; end if;
  perform pg_advisory_xact_lock(hashtextextended(target_column.board_id::text || ':columns', 0));
  if target_column.is_initial or target_column.is_final then raise exception 'PROTECTED_COLUMN' using errcode = 'P0001'; end if;
  if exists (select 1 from public.board_work_items where column_id = target_column.id and archived_at is null) then
    raise exception 'COLUMN_NOT_EMPTY' using errcode = 'P0001';
  end if;
  update public.board_columns set active = false where id = target_column.id returning * into target_column;
  update public.board_columns set position = position + 10000 where board_id = target_column.board_id and active;
  with ordered as (
    select id, row_number() over (order by position)::integer - 1 as next_position
    from public.board_columns where board_id = target_column.board_id and active
  )
  update public.board_columns target set position = ordered.next_position from ordered where target.id = ordered.id;
  return to_jsonb(target_column);
end;
$$;

revoke all on function public.add_board_column(uuid, text, text, text, integer) from public, anon;
revoke all on function public.update_board_column(uuid, text, text, text, integer) from public, anon;
revoke all on function public.reorder_board_columns(uuid, uuid[]) from public, anon;
revoke all on function public.archive_board_column(uuid) from public, anon;
grant execute on function public.add_board_column(uuid, text, text, text, integer) to authenticated;
grant execute on function public.update_board_column(uuid, text, text, text, integer) to authenticated;
grant execute on function public.reorder_board_columns(uuid, uuid[]) to authenticated;
grant execute on function public.archive_board_column(uuid) to authenticated;
