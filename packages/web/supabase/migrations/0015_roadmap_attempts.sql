-- Tentativas dos desafios autorais do roadmap. O conteúdo fica no código; o
-- aluno só grava sua resposta e pode tentar novamente sem apagar histórico.
create table if not exists public.roadmap_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  challenge_id text not null,
  response text not null check (char_length(response) between 80 and 12000),
  created_at timestamptz not null default now()
);
create index if not exists roadmap_attempts_user_challenge_idx on public.roadmap_attempts (user_id, challenge_id, created_at desc);
alter table public.roadmap_attempts enable row level security;
drop policy if exists "roadmap attempts own" on public.roadmap_attempts;
create policy "roadmap attempts own" on public.roadmap_attempts for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
