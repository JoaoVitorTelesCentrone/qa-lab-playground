-- A aparência usa a mesma propriedade e visibilidade já protegidas pela RLS de profiles.
alter table public.profiles
  add column if not exists portfolio_appearance jsonb not null
  default '{"layout":"classic","palette":"forest"}'::jsonb;

alter table public.profiles
  add constraint profiles_portfolio_appearance_valid check (
    jsonb_typeof(portfolio_appearance) = 'object'
    and portfolio_appearance ?& array['layout', 'palette']
    and (portfolio_appearance - 'layout' - 'palette') = '{}'::jsonb
    and portfolio_appearance->>'layout' in ('classic', 'editorial', 'gallery')
    and portfolio_appearance->>'palette' in ('forest', 'ocean', 'paper')
    and jsonb_typeof(portfolio_appearance->'layout') = 'string'
    and jsonb_typeof(portfolio_appearance->'palette') = 'string'
  );
