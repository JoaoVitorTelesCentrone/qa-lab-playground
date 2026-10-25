-- Ordenação autoral dos projetos, sincronizada entre o rascunho e a vitrine.
alter table public.portfolio_projects
  add column if not exists sort_order integer not null default 0;

alter table public.portfolio_project_publications
  add column if not exists sort_order integer not null default 0;

create or replace function public.reorder_portfolio_projects(project_ids uuid[])
returns void
language plpgsql
security invoker
set search_path = public
as $$
declare
  requested_count integer := coalesce(cardinality(project_ids), 0);
  distinct_count integer;
  owned_count integer;
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  select count(distinct requested.id) into distinct_count
  from unnest(coalesce(project_ids, '{}'::uuid[])) as requested(id);

  select count(*) into owned_count
  from public.portfolio_projects
  where user_id = auth.uid();

  if requested_count <> distinct_count or requested_count <> owned_count then
    raise exception 'Project order must contain every owned project exactly once';
  end if;

  if exists (
    select 1 from unnest(coalesce(project_ids, '{}'::uuid[])) as requested(id)
    where not exists (
      select 1 from public.portfolio_projects p
      where p.id = requested.id and p.user_id = auth.uid()
    )
  ) then
    raise exception 'Project not found';
  end if;

  update public.portfolio_projects p
  set sort_order = (ordered.ordinality - 1)::integer,
      updated_at = now()
  from unnest(coalesce(project_ids, '{}'::uuid[])) with ordinality as ordered(id, ordinality)
  where p.id = ordered.id and p.user_id = auth.uid();

  update public.portfolio_project_publications publication
  set sort_order = (ordered.ordinality - 1)::integer
  from unnest(coalesce(project_ids, '{}'::uuid[])) with ordinality as ordered(id, ordinality)
  where publication.project_id = ordered.id and publication.user_id = auth.uid();
end;
$$;

revoke all on function public.reorder_portfolio_projects(uuid[]) from public, anon;
grant execute on function public.reorder_portfolio_projects(uuid[]) to authenticated;
