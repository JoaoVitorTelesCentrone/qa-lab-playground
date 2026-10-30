-- First-touch source for signup cohorts. Values are short, normalized campaign
-- labels; URLs, referrers, and personal identifiers are intentionally omitted.
alter table public.profiles
  add column if not exists acquisition_source text,
  add column if not exists acquisition_medium text,
  add column if not exists acquisition_campaign text;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'profiles_acquisition_source_check') then
    alter table public.profiles add constraint profiles_acquisition_source_check
      check (acquisition_source is null or acquisition_source ~ '^[a-z0-9_-]{1,80}$');
  end if;
  if not exists (select 1 from pg_constraint where conname = 'profiles_acquisition_medium_check') then
    alter table public.profiles add constraint profiles_acquisition_medium_check
      check (acquisition_medium is null or acquisition_medium ~ '^[a-z0-9_-]{1,80}$');
  end if;
  if not exists (select 1 from pg_constraint where conname = 'profiles_acquisition_campaign_check') then
    alter table public.profiles add constraint profiles_acquisition_campaign_check
      check (acquisition_campaign is null or acquisition_campaign ~ '^[a-z0-9_-]{1,80}$');
  end if;
end;
$$;

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (
    id, full_name, acquisition_source, acquisition_medium, acquisition_campaign
  ) values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    nullif(left(regexp_replace(lower(coalesce(new.raw_user_meta_data->>'acquisition_source', '')), '[^a-z0-9_-]', '', 'g'), 80), ''),
    nullif(left(regexp_replace(lower(coalesce(new.raw_user_meta_data->>'acquisition_medium', '')), '[^a-z0-9_-]', '', 'g'), 80), ''),
    nullif(left(regexp_replace(lower(coalesce(new.raw_user_meta_data->>'acquisition_campaign', '')), '[^a-z0-9_-]', '', 'g'), 80), '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;
