-- A primeira origem conhecida da inscrição acompanha a reserva até a matrícula.
alter table public.mentorship_orders
  add column utm_source text check (utm_source is null or utm_source ~ '^[a-z0-9_-]{1,80}$'),
  add column utm_medium text check (utm_medium is null or utm_medium ~ '^[a-z0-9_-]{1,80}$'),
  add column utm_campaign text check (utm_campaign is null or utm_campaign ~ '^[a-z0-9_-]{1,80}$');
