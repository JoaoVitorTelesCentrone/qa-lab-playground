-- Um certificado verificavel por matricula concluida na Mentoria.
-- A tabela nao pode ser listada pelo cliente; a aplicacao serve apenas a
-- consulta por codigo, depois de validar a matricula antes da emissao.

create table if not exists public.mentorship_certificates (
  id uuid primary key default gen_random_uuid(),
  enrollment_id uuid not null unique references public.mentorship_enrollments(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  code text not null unique check (code ~ '^QAM-[A-F0-9]{8}-[A-F0-9]{8}$'),
  holder_name text not null check (char_length(holder_name) between 1 and 180),
  cohort_name text not null check (char_length(cohort_name) between 1 and 180),
  approved_assignments smallint not null check (approved_assignments = 12),
  completed_lessons smallint not null check (completed_lessons > 0),
  issued_at timestamptz not null default now()
);

create index if not exists mentorship_certificates_user_idx
  on public.mentorship_certificates (user_id, issued_at desc);

alter table public.mentorship_certificates enable row level security;
revoke all on public.mentorship_certificates from anon, authenticated;
grant all on public.mentorship_certificates to service_role;
