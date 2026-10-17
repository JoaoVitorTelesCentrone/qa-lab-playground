-- QA Lab Mentoria: operacao de turma, entregas e revisoes.
-- Conteudo do programa fica versionado em packages/web/lib/mentorship/catalog.ts.
-- As tabelas abaixo guardam somente estado operacional de uma coorte.

create table if not exists public.mentorship_staff (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('mentor','admin')),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.mentorship_cohorts (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  program_version text not null default 'v1',
  starts_on date not null,
  ends_on date not null,
  timezone text not null default 'America/Sao_Paulo',
  capacity integer not null default 20 check (capacity > 0 and capacity <= 200),
  status text not null default 'draft' check (status in ('draft','enrollment','active','completed','archived')),
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint mentorship_cohorts_dates check (ends_on >= starts_on)
);

create table if not exists public.mentorship_cohort_staff (
  cohort_id uuid not null references public.mentorship_cohorts(id) on delete cascade,
  staff_user_id uuid not null references public.mentorship_staff(user_id) on delete cascade,
  role text not null default 'lead' check (role in ('lead','reviewer','facilitator')),
  created_at timestamptz not null default now(),
  primary key (cohort_id, staff_user_id)
);

create table if not exists public.mentorship_enrollments (
  id uuid primary key default gen_random_uuid(),
  cohort_id uuid not null references public.mentorship_cohorts(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'invited' check (status in ('invited','active','paused','completed','cancelled')),
  level text not null default 'beginner' check (level in ('beginner','intermediate')),
  goal text,
  diagnostic_score jsonb not null default '{}'::jsonb,
  joined_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (cohort_id, user_id)
);

create index if not exists mentorship_enrollments_user_idx
  on public.mentorship_enrollments (user_id, status, updated_at desc);
create index if not exists mentorship_enrollments_cohort_idx
  on public.mentorship_enrollments (cohort_id, status, updated_at desc);

create table if not exists public.mentorship_lesson_progress (
  enrollment_id uuid not null references public.mentorship_enrollments(id) on delete cascade,
  lesson_key text not null,
  status text not null default 'started' check (status in ('started','completed')),
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  primary key (enrollment_id, lesson_key)
);

create table if not exists public.mentorship_live_sessions (
  id uuid primary key default gen_random_uuid(),
  cohort_id uuid not null references public.mentorship_cohorts(id) on delete cascade,
  week_number smallint not null check (week_number between 1 and 12),
  title text not null,
  agenda text not null default '',
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  meeting_url text not null,
  recording_url text,
  recording_available_until timestamptz,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (cohort_id, week_number),
  constraint mentorship_live_sessions_dates check (ends_at > starts_at)
);

create table if not exists public.mentorship_attendance (
  session_id uuid not null references public.mentorship_live_sessions(id) on delete cascade,
  enrollment_id uuid not null references public.mentorship_enrollments(id) on delete cascade,
  status text not null check (status in ('present','absent','excused','watched_recording')),
  marked_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (session_id, enrollment_id)
);

create table if not exists public.mentorship_submissions (
  id uuid primary key default gen_random_uuid(),
  enrollment_id uuid not null references public.mentorship_enrollments(id) on delete cascade,
  assignment_key text not null,
  attempt_number smallint not null check (attempt_number > 0),
  level text not null check (level in ('beginner','intermediate')),
  content jsonb not null default '{}'::jsonb,
  lab_submission_id uuid references public.lab_submissions(id) on delete set null,
  repository_url text,
  report_url text,
  attachments jsonb not null default '[]'::jsonb,
  status text not null default 'submitted' check (status in ('draft','submitted','in_review','changes_requested','approved')),
  submitted_at timestamptz,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (enrollment_id, assignment_key, attempt_number)
);

create index if not exists mentorship_submissions_queue_idx
  on public.mentorship_submissions (status, submitted_at asc);
create index if not exists mentorship_submissions_enrollment_idx
  on public.mentorship_submissions (enrollment_id, assignment_key, attempt_number desc);

create table if not exists public.mentorship_reviews (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null references public.mentorship_submissions(id) on delete cascade,
  reviewer_id uuid not null references auth.users(id) on delete restrict,
  rubric_version text not null default 'v1',
  scores jsonb not null default '{}'::jsonb,
  strengths text not null default '',
  improvements text not null default '',
  next_action text not null default '',
  decision text not null check (decision in ('changes_requested','approved')),
  created_at timestamptz not null default now()
);

create index if not exists mentorship_reviews_submission_idx
  on public.mentorship_reviews (submission_id, created_at desc);

create table if not exists public.mentorship_weekly_commitments (
  id uuid primary key default gen_random_uuid(),
  enrollment_id uuid not null references public.mentorship_enrollments(id) on delete cascade,
  week_number smallint not null check (week_number between 1 and 12),
  commitment text not null check (char_length(commitment) between 1 and 500),
  visibility text not null default 'mentor' check (visibility in ('private','mentor')),
  check_in text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (enrollment_id, week_number)
);

-- Defesa em profundidade: os novos dados sao acessados por Route Handlers
-- depois de checagem de sessao/membership. Nao abrir as tabelas ao cliente.
alter table public.mentorship_staff enable row level security;
alter table public.mentorship_cohorts enable row level security;
alter table public.mentorship_cohort_staff enable row level security;
alter table public.mentorship_enrollments enable row level security;
alter table public.mentorship_lesson_progress enable row level security;
alter table public.mentorship_live_sessions enable row level security;
alter table public.mentorship_attendance enable row level security;
alter table public.mentorship_submissions enable row level security;
alter table public.mentorship_reviews enable row level security;
alter table public.mentorship_weekly_commitments enable row level security;

revoke all on public.mentorship_staff from anon, authenticated;
revoke all on public.mentorship_cohorts from anon, authenticated;
revoke all on public.mentorship_cohort_staff from anon, authenticated;
revoke all on public.mentorship_enrollments from anon, authenticated;
revoke all on public.mentorship_lesson_progress from anon, authenticated;
revoke all on public.mentorship_live_sessions from anon, authenticated;
revoke all on public.mentorship_attendance from anon, authenticated;
revoke all on public.mentorship_submissions from anon, authenticated;
revoke all on public.mentorship_reviews from anon, authenticated;
revoke all on public.mentorship_weekly_commitments from anon, authenticated;

grant all on public.mentorship_staff to service_role;
grant all on public.mentorship_cohorts to service_role;
grant all on public.mentorship_cohort_staff to service_role;
grant all on public.mentorship_enrollments to service_role;
grant all on public.mentorship_lesson_progress to service_role;
grant all on public.mentorship_live_sessions to service_role;
grant all on public.mentorship_attendance to service_role;
grant all on public.mentorship_submissions to service_role;
grant all on public.mentorship_reviews to service_role;
grant all on public.mentorship_weekly_commitments to service_role;

create or replace function public.touch_mentorship_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists mentorship_cohorts_touch on public.mentorship_cohorts;
create trigger mentorship_cohorts_touch before update on public.mentorship_cohorts
  for each row execute function public.touch_mentorship_updated_at();
drop trigger if exists mentorship_enrollments_touch on public.mentorship_enrollments;
create trigger mentorship_enrollments_touch before update on public.mentorship_enrollments
  for each row execute function public.touch_mentorship_updated_at();
drop trigger if exists mentorship_lessons_touch on public.mentorship_lesson_progress;
create trigger mentorship_lessons_touch before update on public.mentorship_lesson_progress
  for each row execute function public.touch_mentorship_updated_at();
drop trigger if exists mentorship_sessions_touch on public.mentorship_live_sessions;
create trigger mentorship_sessions_touch before update on public.mentorship_live_sessions
  for each row execute function public.touch_mentorship_updated_at();
drop trigger if exists mentorship_attendance_touch on public.mentorship_attendance;
create trigger mentorship_attendance_touch before update on public.mentorship_attendance
  for each row execute function public.touch_mentorship_updated_at();
drop trigger if exists mentorship_submissions_touch on public.mentorship_submissions;
create trigger mentorship_submissions_touch before update on public.mentorship_submissions
  for each row execute function public.touch_mentorship_updated_at();
drop trigger if exists mentorship_commitments_touch on public.mentorship_weekly_commitments;
create trigger mentorship_commitments_touch before update on public.mentorship_weekly_commitments
  for each row execute function public.touch_mentorship_updated_at();
