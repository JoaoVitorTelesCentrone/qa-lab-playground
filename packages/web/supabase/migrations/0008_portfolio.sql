-- Portfólio público de evidências.
-- Ver docs/PRODUCTIZATION_PLAN.md (Fase 4 — Produto utilizável).
--
-- A evidência entregue continua privada por padrão. Publicar é uma decisão em
-- dois níveis, os dois do aluno: o portfólio precisa estar público E a
-- evidência precisa estar marcada como publicada. Uma coisa só nunca vaza nada.
--
-- Idempotente: pode rodar mais de uma vez.

alter table public.profiles
  add column if not exists portfolio_public boolean not null default false,
  add column if not exists portfolio_headline text;

alter table public.lab_submissions
  add column if not exists published boolean not null default false;

create index if not exists lab_submissions_published_idx on public.lab_submissions (user_id, published);

-- ============================================================
-- Leitura anônima do que foi publicado
-- ============================================================
-- A política "own profile" continua valendo para escrita e para o dono; esta
-- soma o acesso de leitura de quem não está logado. Políticas de select se
-- somam por OR, então o dono nunca perde acesso ao próprio perfil.
drop policy if exists "public portfolio" on public.profiles;
create policy "public portfolio" on public.profiles
  for select using (portfolio_public = true);

drop policy if exists "published evidence" on public.lab_submissions;
create policy "published evidence" on public.lab_submissions
  for select using (
    published = true
    and exists (select 1 from public.profiles p where p.id = lab_submissions.user_id and p.portfolio_public = true)
  );
