-- Cobrança do QA Lab via Mercado Pago. A compra é uma linha auditável e a
-- permissão só é concedida pelo webhook autenticado no servidor.
create table if not exists public.billing_purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  offer_id text not null,
  plan text not null check (plan in ('pro', 'team')),
  amount numeric(10,2) not null check (amount > 0),
  currency text not null default 'BRL',
  status text not null default 'pending',
  mercado_pago_preference_id text unique,
  mercado_pago_payment_id text unique,
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists billing_purchases_user_idx on public.billing_purchases (user_id, created_at desc);
alter table public.billing_purchases enable row level security;
drop policy if exists "billing purchases own read" on public.billing_purchases;
drop policy if exists "billing purchases own insert" on public.billing_purchases;
create policy "billing purchases own read" on public.billing_purchases for select using (auth.uid() = user_id);
create policy "billing purchases own insert" on public.billing_purchases for insert with check (auth.uid() = user_id and status = 'pending');
drop trigger if exists billing_purchases_touch on public.billing_purchases;
create trigger billing_purchases_touch before update on public.billing_purchases for each row execute function public.touch_updated_at();
