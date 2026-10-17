-- Notificacoes internas da mentoria. E-mail fica como adaptador posterior.
create table if not exists public.mentorship_notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  kind text not null check (kind in ('review', 'live_session', 'recording', 'system')),
  title text not null check (char_length(title) between 1 and 180),
  body text not null default '' check (char_length(body) <= 1000),
  href text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists mentorship_notifications_user_idx
  on public.mentorship_notifications (user_id, read_at, created_at desc);

alter table public.mentorship_notifications enable row level security;
revoke all on public.mentorship_notifications from anon, authenticated;
grant all on public.mentorship_notifications to service_role;
grant select, update on public.mentorship_notifications to authenticated;

create policy "owner reads mentorship notifications"
  on public.mentorship_notifications
  for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "owner marks notification read"
  on public.mentorship_notifications
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
