-- Adds the new layout and palette IDs to the allowed portfolio appearance values.
alter table public.profiles
  drop constraint if exists profiles_portfolio_appearance_valid;

alter table public.profiles
  add constraint profiles_portfolio_appearance_valid check (
    jsonb_typeof(portfolio_appearance) = 'object'
    and portfolio_appearance ?& array['layout', 'palette']
    and (portfolio_appearance - 'layout' - 'palette') = '{}'::jsonb
    and portfolio_appearance->>'layout' in ('classic', 'editorial', 'gallery', 'spotlight', 'mosaic')
    and portfolio_appearance->>'palette' in ('forest', 'ocean', 'paper', 'sunrise', 'amethyst', 'slate', 'ruby')
    and jsonb_typeof(portfolio_appearance->'layout') = 'string'
    and jsonb_typeof(portfolio_appearance->'palette') = 'string'
  );
