-- Estado persistente do ambiente QA Lab (a loja): carrinho e pedidos.
-- Ver docs/PRODUCTIZATION_PLAN.md (Fase 3 — Apps e regressão).
--
-- Fecha a última superfície que ainda usava localStorage como fonte de verdade.
-- O carrinho é um documento por aluno (uma linha, itens em jsonb); o pedido é
-- imutável depois de criado, exceto pelo status.
--
-- Idempotente: pode rodar mais de uma vez.

-- ============================================================
-- Carrinho: uma linha por aluno
-- ============================================================
create table if not exists public.practice_carts (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  -- [{ "productId": 1, "quantity": 2 }]
  items      jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

-- ============================================================
-- Pedidos
-- ============================================================
create table if not exists public.practice_orders (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  -- Referência legível (QL-000001), única por aluno.
  reference  text not null,
  status     text not null default 'confirmado' check (status in ('confirmado','enviado','entregue','cancelado')),
  total      numeric(12,2) not null check (total >= 0),
  -- Linhas e valores congelados no momento da compra: o pedido não pode mudar
  -- porque o catálogo mudou depois.
  items      jsonb not null default '[]'::jsonb,
  pricing    jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists practice_orders_reference_idx on public.practice_orders (user_id, reference);

-- ============================================================
-- RLS: cada aluno só enxerga o próprio carrinho e os próprios pedidos
-- ============================================================
do $$
declare t text;
begin
  foreach t in array array['practice_carts', 'practice_orders'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists "own rows" on public.%I', t);
    execute format('create policy "own rows" on public.%I for all using (auth.uid() = user_id) with check (auth.uid() = user_id)', t);
    execute format('create index if not exists %I on public.%I (user_id)', t || '_user_idx', t);
  end loop;
end $$;

drop trigger if exists practice_carts_touch on public.practice_carts;
create trigger practice_carts_touch before update on public.practice_carts
  for each row execute function public.touch_updated_at();

drop trigger if exists practice_orders_touch on public.practice_orders;
create trigger practice_orders_touch before update on public.practice_orders
  for each row execute function public.touch_updated_at();
