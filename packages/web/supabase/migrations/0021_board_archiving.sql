-- Arquivamento seguro de boards e projetos.
-- Depende de 0020_board_personal_provisioning.sql.

create or replace function public.archive_board(p_board_id uuid) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  target_project_id uuid;
  project_archived boolean := false;
begin
  select project_id into target_project_id
  from public.boards
  where id = p_board_id and status = 'active'
  for update;

  if target_project_id is null then raise exception 'NOT_FOUND' using errcode = 'P0001'; end if;
  if not public.can_admin_board_project(target_project_id) then raise exception 'FORBIDDEN' using errcode = 'P0001'; end if;

  update public.boards
  set status = 'archived', updated_at = now()
  where id = p_board_id;

  -- Um projeto sem board ativo também sai da listagem. Os dados continuam
  -- preservados e podem ser restaurados por uma rotina administrativa futura.
  if not exists (
    select 1 from public.boards
    where project_id = target_project_id and status = 'active'
  ) then
    update public.board_projects
    set status = 'archived', archived_at = now(), updated_at = now()
    where id = target_project_id;
    project_archived := true;
  end if;

  return jsonb_build_object(
    'id', p_board_id,
    'projectId', target_project_id,
    'status', 'archived',
    'projectArchived', project_archived
  );
end;
$$;

create or replace function public.archive_board_project(p_project_id uuid) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  target_project_id uuid;
begin
  select id into target_project_id
  from public.board_projects
  where id = p_project_id and status = 'active'
  for update;

  if target_project_id is null then raise exception 'NOT_FOUND' using errcode = 'P0001'; end if;
  if not public.can_admin_board_project(target_project_id) then raise exception 'FORBIDDEN' using errcode = 'P0001'; end if;

  update public.boards
  set status = 'archived', updated_at = now()
  where project_id = target_project_id and status = 'active';

  update public.board_projects
  set status = 'archived', archived_at = now(), updated_at = now()
  where id = target_project_id;

  return jsonb_build_object('id', target_project_id, 'status', 'archived');
end;
$$;

revoke all on function public.archive_board(uuid) from public, anon;
revoke all on function public.archive_board_project(uuid) from public, anon;
grant execute on function public.archive_board(uuid) to authenticated;
grant execute on function public.archive_board_project(uuid) to authenticated;
