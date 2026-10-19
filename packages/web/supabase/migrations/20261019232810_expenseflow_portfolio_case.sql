-- Uma vitrine por aluno para o ExpenseFlow. A entrega original continua privada
-- em deliverables; o case guarda uma cópia imutável até nova publicação explícita.
create table public.expenseflow_portfolio_cases (
  user_id uuid primary key references auth.users(id) on delete cascade,
  source_deliverable_id uuid not null references public.deliverables(id) on delete cascade,
  title text not null check (char_length(title) between 3 and 120),
  summary text not null check (char_length(summary) between 40 and 1000),
  snapshot jsonb not null,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index expenseflow_portfolio_cases_source_idx
  on public.expenseflow_portfolio_cases (source_deliverable_id);

alter table public.expenseflow_portfolio_cases enable row level security;
revoke all on public.expenseflow_portfolio_cases from anon, authenticated;
grant select on public.expenseflow_portfolio_cases to anon;
grant select, insert, update on public.expenseflow_portfolio_cases to authenticated;
grant all on public.expenseflow_portfolio_cases to service_role;

create policy "owner reads expenseflow case"
  on public.expenseflow_portfolio_cases for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "owner creates expenseflow case"
  on public.expenseflow_portfolio_cases for insert to authenticated
  with check (
    (select auth.uid()) = user_id
    and exists (
      select 1 from public.deliverables d
      where d.id = source_deliverable_id
        and d.user_id = (select auth.uid())
        and d.kind = 'expenseflow-challenge-v1'
    )
  );

create policy "owner updates expenseflow case"
  on public.expenseflow_portfolio_cases for update to authenticated
  using ((select auth.uid()) = user_id)
  with check (
    (select auth.uid()) = user_id
    and exists (
      select 1 from public.deliverables d
      where d.id = source_deliverable_id
        and d.user_id = (select auth.uid())
        and d.kind = 'expenseflow-challenge-v1'
    )
  );

create policy "published expenseflow case is public"
  on public.expenseflow_portfolio_cases for select to anon, authenticated
  using (
    published = true
    and exists (
      select 1 from public.profiles p
      where p.id = user_id and p.portfolio_public = true
    )
  );
