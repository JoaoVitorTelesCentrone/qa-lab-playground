-- Board pessoal para assinantes Pro/Team.
-- Depende de 0016_board_v2.sql e da coluna public.profiles.plan.

create or replace function public.has_board_product_access() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and plan in ('pro', 'team')
  )
$$;

revoke all on function public.has_board_product_access() from public, anon;
grant execute on function public.has_board_product_access() to authenticated;

create or replace function public.is_board_project_member(target uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select public.has_board_product_access() and exists (
    select 1 from public.board_members
    where project_id = target and user_id = auth.uid() and status = 'active'
  )
$$;

create or replace function public.can_edit_board_project(target uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select public.has_board_product_access() and exists (
    select 1 from public.board_members
    where project_id = target and user_id = auth.uid() and status = 'active'
      and role in ('owner', 'admin', 'member')
  )
$$;

create or replace function public.can_admin_board_project(target uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select public.has_board_product_access() and exists (
    select 1 from public.board_members
    where project_id = target and user_id = auth.uid() and status = 'active'
      and role in ('owner', 'admin')
  )
$$;

drop policy if exists "board_projects_create" on public.board_projects;
create policy "board_projects_create" on public.board_projects for insert
  with check (owner_id = auth.uid() and public.has_board_product_access());

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
  if not public.has_board_product_access() then raise exception 'PRO_REQUIRED' using errcode = 'P0001'; end if;
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

revoke all on function public.create_board_project(text, text, text, text) from public, anon;
grant execute on function public.create_board_project(text, text, text, text) to authenticated;

create or replace function public.ensure_personal_board() returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  actor uuid := auth.uid();
  project_id uuid;
  board_id uuid;
  candidate_key text;
  key_attempt integer;
begin
  if actor is null then raise exception 'AUTH_REQUIRED' using errcode = 'P0001'; end if;
  if not public.has_board_product_access() then raise exception 'PRO_REQUIRED' using errcode = 'P0001'; end if;

  -- Serializa o primeiro acesso do mesmo usuário para evitar dois boards
  -- pessoais quando navegador e prefetch chegam ao mesmo tempo.
  perform pg_advisory_xact_lock(hashtextextended(actor::text, 20260824));

  select project.id, board.id into project_id, board_id
  from public.board_projects project
  join public.board_members member
    on member.project_id = project.id
   and member.user_id = actor
   and member.role = 'owner'
   and member.status = 'active'
  join public.boards board
    on board.project_id = project.id
   and board.status = 'active'
  where project.owner_id = actor and project.status = 'active'
  order by project.created_at, board.created_at
  limit 1;

  if board_id is not null then
    return jsonb_build_object('projectId', project_id, 'boardId', board_id, 'created', false);
  end if;

  -- A chave é estável e não expõe dados pessoais. O loop também trata
  -- a colisão improvável dos oito caracteres do hash.
  for key_attempt in 0..31 loop
    candidate_key := 'QA' || upper(substr(md5(actor::text || ':' || key_attempt::text), 1, 8));
    begin
      insert into public.board_projects(owner_id, name, key)
      values (actor, 'Meu projeto', candidate_key)
      returning id into project_id;
      exit;
    exception when unique_violation then
      project_id := null;
    end;
  end loop;

  if project_id is null then raise exception 'PERSONAL_BOARD_KEY_UNAVAILABLE' using errcode = 'P0001'; end if;

  insert into public.board_members(project_id, user_id, role)
  values (project_id, actor, 'owner');

  insert into public.boards(project_id, name, kind, created_by)
  values (project_id, 'Board pessoal', 'kanban', actor)
  returning id into board_id;

  insert into public.board_columns(board_id, name, position, category, color, is_initial, is_final)
  values
    (board_id, 'A fazer',      0, 'todo',        'blue',   true,  false),
    (board_id, 'Em andamento', 1, 'in_progress', 'amber',  false, false),
    (board_id, 'Em revisão',    2, 'in_progress', 'violet', false, false),
    (board_id, 'Concluído',     3, 'done',         'green',  false, true);

  return jsonb_build_object('projectId', project_id, 'boardId', board_id, 'created', true);
end;
$$;

revoke all on function public.ensure_personal_board() from public, anon;
grant execute on function public.ensure_personal_board() to authenticated;
