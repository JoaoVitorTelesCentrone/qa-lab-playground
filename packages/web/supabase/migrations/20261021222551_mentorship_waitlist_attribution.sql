-- Guarda apenas identificadores curtos de campanha na lista pública.
-- Nome, e-mail e consentimento continuam nas colunas já existentes.
alter table public.mentorship_waitlist_leads
  add column utm_source text check (utm_source is null or utm_source ~ '^[A-Za-z0-9_-]{1,80}$'),
  add column utm_medium text check (utm_medium is null or utm_medium ~ '^[A-Za-z0-9_-]{1,80}$'),
  add column utm_campaign text check (utm_campaign is null or utm_campaign ~ '^[A-Za-z0-9_-]{1,80}$');
