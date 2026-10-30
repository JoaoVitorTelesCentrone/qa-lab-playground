-- Explicit public details required before a founder cohort offer can be published.
alter table public.mentorship_offers
  add column if not exists delivery_format text not null default '',
  add column if not exists recordings_policy text not null default '',
  add column if not exists weekly_rhythm text not null default '',
  add column if not exists support_response_hours smallint not null default 0,
  add column if not exists expected_outcome text not null default '';

alter table public.mentorship_offers
  drop constraint if exists mentorship_offers_public_details_complete;

-- Keep any legacy offer without these details out of public checkout until an
-- operator has supplied and reviewed the real terms in the admin form.
update public.mentorship_offers
set published = false, version = version + 1, updated_at = now()
where published and (
  length(btrim(delivery_format)) not between 1 and 500
  or length(btrim(recordings_policy)) not between 1 and 1000
  or length(btrim(weekly_rhythm)) not between 1 and 1000
  or support_response_hours not between 1 and 168
  or length(btrim(expected_outcome)) not between 1 and 1000
);

alter table public.mentorship_offers
  add constraint mentorship_offers_public_details_complete check (
    not published or (
      length(btrim(delivery_format)) between 1 and 500
      and length(btrim(recordings_policy)) between 1 and 1000
      and length(btrim(weekly_rhythm)) between 1 and 1000
      and support_response_hours between 1 and 168
      and length(btrim(expected_outcome)) between 1 and 1000
    )
  );
