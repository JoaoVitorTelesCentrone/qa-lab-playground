-- Imagens e vídeos compactos de um projeto. Draft e snapshot público mantêm
-- ponteiros separados; o conteúdo vive no bucket privado lab-evidence.
alter table public.portfolio_projects
  add column if not exists media jsonb not null default '[]'::jsonb;

alter table public.portfolio_projects
  drop constraint if exists portfolio_projects_media_limit;
alter table public.portfolio_projects
  add constraint portfolio_projects_media_limit
  check (case when jsonb_typeof(media) = 'array' then jsonb_array_length(media) <= 4 else false end);

alter table public.portfolio_project_publications
  add column if not exists media jsonb not null default '[]'::jsonb;

alter table public.portfolio_project_publications
  drop constraint if exists portfolio_project_publications_media_limit;
alter table public.portfolio_project_publications
  add constraint portfolio_project_publications_media_limit
  check (case when jsonb_typeof(media) = 'array' then jsonb_array_length(media) <= 4 else false end);
