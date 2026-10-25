-- Rascunhos narrativos de cases ficam isolados das entregas publicadas.
-- O snapshot público só muda quando o aluno aciona Publicar.

create table if not exists public.portfolio_case_drafts (
  submission_id uuid primary key references public.lab_submissions(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  customization jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  constraint portfolio_case_drafts_customization_object check (jsonb_typeof(customization) = 'object')
);

create index if not exists portfolio_case_drafts_user_idx
  on public.portfolio_case_drafts (user_id, updated_at desc);

alter table public.portfolio_case_drafts enable row level security;
revoke all on public.portfolio_case_drafts from anon, authenticated;
grant select, insert, update, delete on public.portfolio_case_drafts to authenticated;

drop policy if exists "owner manages portfolio case draft" on public.portfolio_case_drafts;
create policy "owner manages portfolio case draft" on public.portfolio_case_drafts
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check (
    (select auth.uid()) = user_id
    and exists (
      select 1 from public.lab_submissions s
      where s.id = portfolio_case_drafts.submission_id and s.user_id = (select auth.uid())
    )
  );

alter table public.lab_submissions
  add column if not exists published_portfolio_case jsonb not null default '{}'::jsonb;

alter table public.lab_submissions
  drop constraint if exists lab_submissions_published_portfolio_case_object;
alter table public.lab_submissions
  add constraint lab_submissions_published_portfolio_case_object
  check (jsonb_typeof(published_portfolio_case) = 'object');

create or replace function public.capture_portfolio_case_snapshot()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  case_snapshot jsonb;
begin
  if new.published then
    select d.customization into case_snapshot
    from public.portfolio_case_drafts d
    where d.submission_id = new.id and d.user_id = new.user_id;
    if not found then
      new.published_portfolio_case := '{}'::jsonb;
    else
      new.published_portfolio_case := case_snapshot;
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists lab_submissions_capture_portfolio_case on public.lab_submissions;
create trigger lab_submissions_capture_portfolio_case
before update of published on public.lab_submissions
for each row execute function public.capture_portfolio_case_snapshot();
