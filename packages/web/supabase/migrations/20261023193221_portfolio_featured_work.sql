-- Casos que a pessoa escolheu para aparecer primeiro no portfólio público.
-- A política existente de profiles continua controlando a leitura por dono e visitante.
alter table public.profiles
  add column if not exists portfolio_featured_submission_ids uuid[] not null default '{}';

alter table public.profiles
  drop constraint if exists profiles_portfolio_featured_limit;
alter table public.profiles
  add constraint profiles_portfolio_featured_limit
  check (cardinality(portfolio_featured_submission_ids) <= 3);
