-- O board pessoal faz parte do workspace do aluno autenticado.
create or replace function public.has_board_product_access() returns boolean
language sql stable security definer set search_path = public as $$
  select auth.uid() is not null
$$;

-- O board pessoal é aberto a todo aluno; projetos adicionais seguem o plano.
create or replace function public.has_board_paid_access() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and plan in ('pro', 'team')
  )
$$;
revoke all on function public.has_board_paid_access() from public, anon;
grant execute on function public.has_board_paid_access() to authenticated;

drop policy if exists "board_projects_create" on public.board_projects;
create policy "board_projects_create" on public.board_projects for insert
  with check (owner_id = auth.uid() and public.has_board_paid_access());

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
  if not public.has_board_paid_access() then raise exception 'PRO_REQUIRED' using errcode = 'P0001'; end if;
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
    (board_id, 'A fazer',      0, 'todo',        'blue',   true,  false),
    (board_id, 'Em andamento', 1, 'in_progress', 'amber',  false, false),
    (board_id, 'Em revisão',    2, 'in_progress', 'violet', false, false),
    (board_id, 'Concluído',     3, 'done',         'green',  false, true);

  return jsonb_build_object('projectId', project_id, 'boardId', board_id);
exception
  when unique_violation then
    raise exception 'PROJECT_KEY_TAKEN' using errcode = 'P0001';
end;
$$;

-- Cards de automação têm identidade própria, filtros e histórico no board.
alter table public.board_work_items drop constraint if exists board_work_items_type_check;
alter table public.board_work_items add constraint board_work_items_type_check
  check (type in ('epic', 'story', 'task', 'bug', 'test', 'automation', 'subtask'));

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
  if p_type not in ('epic', 'story', 'task', 'bug', 'test', 'automation', 'subtask') then raise exception 'INVALID_TYPE' using errcode = 'P0001'; end if;
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
