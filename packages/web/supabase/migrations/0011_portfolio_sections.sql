-- Seções livres do portfólio público.
--
-- Regra de produto: o portfólio é gerado a partir das evidências, mas o que a
-- pessoa quer contar sobre si não cabe em evidência — formação, certificações,
-- ferramentas, um resumo de carreira. Estas seções são texto livre do dono,
-- e por isso valem a mesma regra de dois níveis do resto do portfólio: só
-- aparecem se a página estiver pública E a seção estiver marcada como visível.
--
-- `visible` existe para que rascunho não vire vazamento: dá para escrever a
-- seção hoje, deixá-la oculta, e ligar quando estiver pronta. Sem isso a única
-- forma de esconder um texto pela metade seria apagá-lo.
--
-- A ordem é do dono (`position`), não cronológica: numa página de portfólio a
-- sequência é argumento — "Sobre mim" antes de "Certificações".
--
-- Idempotente: pode rodar mais de uma vez.

create table if not exists public.portfolio_sections (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  title      text not null,
  body       text not null default '',
  -- Posição na página pública, começando em 0. Reordenar reescreve a coluna
  -- inteira do usuário em uma transação (ver reorderPortfolioSections).
  position   integer not null default 0,
  visible    boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists portfolio_sections_user_idx
  on public.portfolio_sections (user_id, position);

alter table public.portfolio_sections enable row level security;

drop policy if exists "own rows" on public.portfolio_sections;
create policy "own rows" on public.portfolio_sections
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ============================================================
-- Leitura anônima do que foi publicado
-- ============================================================
-- Mesma forma da policy "published evidence" da 0008: a seção só sai daqui se
-- ela própria estiver visível e o portfólio do dono estiver público. Políticas
-- de select se somam por OR, então o dono continua enxergando as ocultas pela
-- policy "own rows".
drop policy if exists "public sections" on public.portfolio_sections;
create policy "public sections" on public.portfolio_sections
  for select using (
    visible = true
    and exists (select 1 from public.profiles p where p.id = portfolio_sections.user_id and p.portfolio_public = true)
  );
