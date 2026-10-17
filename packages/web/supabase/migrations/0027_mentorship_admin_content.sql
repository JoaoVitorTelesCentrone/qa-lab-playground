-- Conteudo publicavel da mentoria, gerenciado pelo painel administrativo.
create table if not exists public.mentorship_lesson_content (
  lesson_key text primary key,
  video_url text,
  material_url text,
  status text not null default 'draft' check (status in ('draft','published','scheduled')),
  available_at timestamptz,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint mentorship_lesson_content_video_url check (video_url is null or video_url ~ '^https?://'),
  constraint mentorship_lesson_content_material_url check (material_url is null or material_url ~ '^https?://'),
  constraint mentorship_lesson_content_schedule check (status <> 'scheduled' or available_at is not null)
);

alter table public.mentorship_lesson_content enable row level security;
revoke all on public.mentorship_lesson_content from anon, authenticated;
grant all on public.mentorship_lesson_content to service_role;

drop trigger if exists mentorship_lesson_content_touch on public.mentorship_lesson_content;
create trigger mentorship_lesson_content_touch before update on public.mentorship_lesson_content
  for each row execute function public.touch_mentorship_updated_at();
