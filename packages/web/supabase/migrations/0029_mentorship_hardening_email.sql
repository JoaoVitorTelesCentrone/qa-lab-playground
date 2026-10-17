-- Fase 6: fila duravel de e-mail e reducao de privilegio nas notificacoes.

-- O aluno pode marcar apenas read_at; o conteudo da notificacao permanece
-- imutavel para clientes autenticados.
revoke update on public.mentorship_notifications from authenticated;
grant update (read_at) on public.mentorship_notifications to authenticated;
alter table public.mentorship_notifications add column if not exists dedupe_key text;
create unique index if not exists mentorship_notifications_dedupe_idx
  on public.mentorship_notifications (dedupe_key);

create table if not exists public.mentorship_email_outbox (
  id uuid primary key default gen_random_uuid(),
  notification_id uuid references public.mentorship_notifications(id) on delete set null,
  user_id uuid not null references auth.users(id) on delete cascade,
  kind text not null check (kind in ('review','live_session','recording','reminder','system')),
  dedupe_key text not null unique,
  subject text not null check (char_length(subject) between 1 and 180),
  body text not null check (char_length(body) between 1 and 2000),
  href text,
  status text not null default 'queued' check (status in ('queued','sending','sent','failed')),
  attempts smallint not null default 0 check (attempts between 0 and 10),
  available_at timestamptz not null default now(),
  locked_at timestamptz,
  sent_at timestamptz,
  last_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint mentorship_email_outbox_href check (href is null or (href like '/%' and href not like '//%'))
);

create index if not exists mentorship_email_outbox_ready_idx
  on public.mentorship_email_outbox (status, available_at, created_at)
  where status in ('queued','sending');

alter table public.mentorship_email_outbox enable row level security;
revoke all on public.mentorship_email_outbox from anon, authenticated;
grant all on public.mentorship_email_outbox to service_role;

drop trigger if exists mentorship_email_outbox_touch on public.mentorship_email_outbox;
create trigger mentorship_email_outbox_touch before update on public.mentorship_email_outbox
  for each row execute function public.touch_mentorship_updated_at();
