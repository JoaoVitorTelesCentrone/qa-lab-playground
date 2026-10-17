-- Cases finais da mentoria: publicacao voluntaria, separada das evidencias de Labs.
create table if not exists public.mentorship_portfolio_cases (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null unique references public.mentorship_submissions(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(title) between 3 and 160),
  summary text not null default '' check (char_length(summary) <= 2000),
  evidence text not null default '',
  repository_url text,
  report_url text,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists mentorship_portfolio_cases_user_idx
  on public.mentorship_portfolio_cases (user_id, published, updated_at desc);

alter table public.mentorship_portfolio_cases enable row level security;
revoke all on public.mentorship_portfolio_cases from anon, authenticated;
grant all on public.mentorship_portfolio_cases to service_role;
grant select on public.mentorship_portfolio_cases to anon, authenticated;

create policy "owner manages mentorship case"
  on public.mentorship_portfolio_cases
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "published mentorship case is public"
  on public.mentorship_portfolio_cases
  for select to anon, authenticated
  using (
    published = true
    and exists (
      select 1 from public.profiles p
      where p.id = mentorship_portfolio_cases.user_id
        and p.portfolio_public = true
    )
  );

drop trigger if exists mentorship_portfolio_cases_touch_updated_at on public.mentorship_portfolio_cases;
create trigger mentorship_portfolio_cases_touch_updated_at
before update on public.mentorship_portfolio_cases
for each row execute function public.touch_mentorship_updated_at();
