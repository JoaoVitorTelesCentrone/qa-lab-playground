-- Student admission and checkout for the mentorship, separate from QA Lab Pro.
alter table public.mentorship_enrollments
  add column if not exists admission_source text not null default 'manual'
  check (admission_source in ('manual','mercado_pago','scholarship'));

create table if not exists public.mentorship_offers (
  id uuid primary key default gen_random_uuid(),
  cohort_id uuid not null unique references public.mentorship_cohorts(id) on delete cascade,
  offer_code text not null unique,
  title text not null,
  summary text not null default '',
  price numeric(10,2) not null check (price > 0),
  currency text not null default 'BRL' check (currency = 'BRL'),
  enrollment_opens_at timestamptz,
  enrollment_closes_at timestamptz,
  support_contact text not null default '',
  terms text not null default '',
  cancellation_policy text not null default '',
  published boolean not null default false,
  version integer not null default 1 check (version > 0),
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint mentorship_offers_enrollment_window check (
    enrollment_opens_at is null or enrollment_closes_at is null or enrollment_closes_at > enrollment_opens_at
  )
);

create table if not exists public.mentorship_applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  cohort_id uuid references public.mentorship_cohorts(id) on delete set null,
  offer_id uuid references public.mentorship_offers(id) on delete set null,
  status text not null default 'requested' check (status in ('requested','awaiting_payment','confirmed','waitlisted','rejected','cancelled')),
  offer_version integer,
  terms_snapshot text not null default '',
  cancellation_policy_snapshot text not null default '',
  terms_accepted_at timestamptz,
  contact_consent_at timestamptz,
  decision_note text not null default '',
  payment_reference text,
  reviewed_by uuid references auth.users(id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index if not exists mentorship_applications_user_cohort_uidx
  on public.mentorship_applications(user_id, cohort_id) where cohort_id is not null;
create unique index if not exists mentorship_applications_user_waitlist_uidx
  on public.mentorship_applications(user_id) where cohort_id is null and status in ('requested','waitlisted');
create index if not exists mentorship_applications_queue_idx
  on public.mentorship_applications(status, created_at);

create table if not exists public.mentorship_orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete restrict,
  cohort_id uuid not null references public.mentorship_cohorts(id) on delete restrict,
  offer_id uuid not null references public.mentorship_offers(id) on delete restrict,
  application_id uuid references public.mentorship_applications(id) on delete set null,
  offer_version integer not null,
  offer_title text not null,
  terms_snapshot text not null,
  cancellation_policy_snapshot text not null,
  amount numeric(10,2) not null check (amount > 0),
  currency text not null default 'BRL' check (currency = 'BRL'),
  status text not null default 'pending' check (status in ('pending','approved','rejected','cancelled','expired','paid_no_seat','refunded','charged_back')),
  reservation_expires_at timestamptz not null,
  mercado_pago_preference_id text unique,
  checkout_url text,
  mercado_pago_payment_id text unique,
  payment_status text,
  enrollment_id uuid references public.mentorship_enrollments(id) on delete set null,
  resolution_note text not null default '',
  resolved_by uuid references auth.users(id) on delete set null,
  resolved_at timestamptz,
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index if not exists mentorship_orders_one_open_per_user_offer_uidx
  on public.mentorship_orders(user_id, offer_id) where status = 'pending';
create index if not exists mentorship_orders_queue_idx
  on public.mentorship_orders(status, created_at);

create table if not exists public.mentorship_application_events (
  id bigint generated always as identity primary key,
  application_id uuid not null references public.mentorship_applications(id) on delete cascade,
  actor_user_id uuid references auth.users(id) on delete set null,
  old_status text,
  new_status text not null,
  note text not null default '',
  created_at timestamptz not null default now()
);
create index if not exists mentorship_application_events_application_idx
  on public.mentorship_application_events(application_id, created_at desc);

create table if not exists public.mentorship_order_events (
  id bigint generated always as identity primary key,
  order_id uuid not null references public.mentorship_orders(id) on delete cascade,
  old_status text,
  new_status text not null,
  payment_status text,
  payment_id text,
  amount numeric(10,2) not null,
  note text not null default '',
  created_at timestamptz not null default now()
);
create index if not exists mentorship_order_events_order_idx
  on public.mentorship_order_events(order_id, created_at desc);

alter table public.mentorship_offers enable row level security;
alter table public.mentorship_applications enable row level security;
alter table public.mentorship_orders enable row level security;
alter table public.mentorship_application_events enable row level security;
alter table public.mentorship_order_events enable row level security;
revoke all on public.mentorship_offers from anon, authenticated;
revoke all on public.mentorship_applications from anon, authenticated;
revoke all on public.mentorship_orders from anon, authenticated;
revoke all on public.mentorship_application_events from anon, authenticated;
revoke all on public.mentorship_order_events from anon, authenticated;
grant select on public.mentorship_applications to authenticated;
grant select on public.mentorship_orders to authenticated;
grant all on public.mentorship_offers to service_role;
grant all on public.mentorship_applications to service_role;
grant all on public.mentorship_orders to service_role;
grant all on public.mentorship_application_events to service_role;
grant all on public.mentorship_order_events to service_role;
create policy "mentorship applications own read" on public.mentorship_applications
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "mentorship orders own read" on public.mentorship_orders
  for select to authenticated using ((select auth.uid()) = user_id);

create or replace function public.audit_mentorship_application_change()
returns trigger language plpgsql set search_path = '' as $$
begin
  if tg_op = 'INSERT' or new.status is distinct from old.status or new.decision_note is distinct from old.decision_note or new.payment_reference is distinct from old.payment_reference then
    insert into public.mentorship_application_events(application_id,actor_user_id,old_status,new_status,note)
      values(new.id,coalesce(new.reviewed_by,auth.uid(),new.user_id),case when tg_op = 'INSERT' then null else old.status end,new.status,new.decision_note);
  end if;
  return new;
end;
$$;
drop trigger if exists mentorship_application_audit on public.mentorship_applications;
create trigger mentorship_application_audit after insert or update on public.mentorship_applications
  for each row execute function public.audit_mentorship_application_change();

create or replace function public.audit_mentorship_order_change()
returns trigger language plpgsql set search_path = '' as $$
begin
  if tg_op = 'INSERT' or new.status is distinct from old.status or new.payment_status is distinct from old.payment_status or new.mercado_pago_payment_id is distinct from old.mercado_pago_payment_id or new.resolution_note is distinct from old.resolution_note then
    insert into public.mentorship_order_events(order_id,old_status,new_status,payment_status,payment_id,amount,note)
      values(new.id,case when tg_op = 'INSERT' then null else old.status end,new.status,new.payment_status,new.mercado_pago_payment_id,new.amount,new.resolution_note);
  end if;
  return new;
end;
$$;
drop trigger if exists mentorship_order_audit on public.mentorship_orders;
create trigger mentorship_order_audit after insert or update on public.mentorship_orders
  for each row execute function public.audit_mentorship_order_change();

create or replace function public.reserve_mentorship_order(target_offer_id uuid, target_user_id uuid, target_offer_version integer)
returns public.mentorship_orders
language plpgsql
security definer
set search_path = ''
as $$
declare
  target_offer public.mentorship_offers%rowtype;
  target_cohort public.mentorship_cohorts%rowtype;
  existing_order public.mentorship_orders%rowtype;
  created_application public.mentorship_applications%rowtype;
  occupied integer;
begin
  select * into target_offer from public.mentorship_offers where id = target_offer_id and published = true;
  if not found then raise exception 'OFFER_UNAVAILABLE'; end if;
  if target_offer.version <> target_offer_version then raise exception 'OFFER_VERSION_CHANGED'; end if;
  select * into target_cohort from public.mentorship_cohorts where id = target_offer.cohort_id for update;
  if not found or target_cohort.status <> 'enrollment' then raise exception 'ENROLLMENT_CLOSED'; end if;
  if target_offer.enrollment_opens_at is not null and now() < target_offer.enrollment_opens_at then raise exception 'ENROLLMENT_NOT_OPEN'; end if;
  if target_offer.enrollment_closes_at is not null and now() >= target_offer.enrollment_closes_at then raise exception 'ENROLLMENT_CLOSED'; end if;
  if exists(select 1 from public.mentorship_enrollments e where e.cohort_id = target_cohort.id and e.user_id = target_user_id and e.status in ('invited','active','paused','completed')) then raise exception 'ALREADY_ENROLLED'; end if;
  select * into existing_order from public.mentorship_orders o
   where o.user_id = target_user_id and o.offer_id = target_offer.id and o.status = 'pending' and o.reservation_expires_at > now()
   order by o.created_at desc limit 1;
  if found then return existing_order; end if;
  update public.mentorship_orders set status = 'expired', updated_at = now()
   where user_id = target_user_id and offer_id = target_offer.id and status = 'pending';
  select count(*) into occupied from public.mentorship_enrollments e
   where e.cohort_id = target_cohort.id and e.status in ('invited','active','paused','completed');
  occupied := occupied + (select count(*) from public.mentorship_orders o
   where o.cohort_id = target_cohort.id and o.status = 'pending' and o.reservation_expires_at > now());
  if occupied >= target_cohort.capacity then raise exception 'COHORT_FULL'; end if;
  insert into public.mentorship_applications(user_id, cohort_id, offer_id, status, offer_version, terms_snapshot, cancellation_policy_snapshot, terms_accepted_at)
   values(target_user_id, target_cohort.id, target_offer.id, 'awaiting_payment', target_offer.version, target_offer.terms, target_offer.cancellation_policy, now())
   on conflict (user_id, cohort_id) where cohort_id is not null do update set
     offer_id = excluded.offer_id, status = 'awaiting_payment', offer_version = excluded.offer_version,
     terms_snapshot = excluded.terms_snapshot, cancellation_policy_snapshot = excluded.cancellation_policy_snapshot,
     terms_accepted_at = excluded.terms_accepted_at, updated_at = now()
   returning * into created_application;
  insert into public.mentorship_orders(user_id, cohort_id, offer_id, application_id, offer_version, offer_title, terms_snapshot, cancellation_policy_snapshot, amount, currency, reservation_expires_at)
   values(target_user_id, target_cohort.id, target_offer.id, created_application.id, target_offer.version, target_offer.title, target_offer.terms, target_offer.cancellation_policy,
     target_offer.price, target_offer.currency, now() + interval '4 days')
   returning * into existing_order;
  return existing_order;
end;
$$;

create or replace function public.finalize_mentorship_payment(
  target_order_id uuid, target_payment_id text, target_payment_status text, target_amount numeric, target_currency text
) returns public.mentorship_orders
language plpgsql
security definer
set search_path = ''
as $$
declare
  target_order public.mentorship_orders%rowtype;
  target_cohort public.mentorship_cohorts%rowtype;
  created_enrollment public.mentorship_enrollments%rowtype;
begin
  select * into target_order from public.mentorship_orders where id = target_order_id;
  if not found then raise exception 'ORDER_NOT_FOUND'; end if;
  select * into target_cohort from public.mentorship_cohorts where id = target_order.cohort_id for update;
  select * into target_order from public.mentorship_orders where id = target_order_id for update;
  if not found then raise exception 'ORDER_NOT_FOUND'; end if;
  if lower(coalesce(target_currency,'')) <> lower(target_order.currency) or target_amount <> target_order.amount then raise exception 'PAYMENT_AMOUNT_MISMATCH'; end if;
  if target_order.status = 'approved' and target_order.enrollment_id is not null and target_payment_status = 'approved' then return target_order; end if;
  if target_payment_status = 'approved' then
    if target_cohort.status not in ('enrollment','active') or target_order.reservation_expires_at <= now() then
      update public.mentorship_orders set status = 'paid_no_seat', payment_status = target_payment_status,
        mercado_pago_payment_id = target_payment_id, paid_at = now(), updated_at = now() where id = target_order_id returning * into target_order;
      return target_order;
    end if;
    insert into public.mentorship_enrollments(cohort_id,user_id,status,level,joined_at,admission_source)
      values(target_order.cohort_id,target_order.user_id,'active','beginner',now(),'mercado_pago')
      on conflict (cohort_id,user_id) do update set status = 'active', admission_source = 'mercado_pago', joined_at = coalesce(public.mentorship_enrollments.joined_at, now()), updated_at = now()
      returning * into created_enrollment;
    update public.mentorship_orders set status = 'approved', payment_status = target_payment_status,
      mercado_pago_payment_id = target_payment_id, enrollment_id = created_enrollment.id, paid_at = now(), updated_at = now()
      where id = target_order_id returning * into target_order;
    update public.mentorship_applications set status = 'confirmed', reviewed_at = now(), updated_at = now()
      where id = target_order.application_id;
    return target_order;
  end if;
  if target_payment_status in ('refunded','charged_back','cancelled') then
    update public.mentorship_orders set status = case target_payment_status when 'refunded' then 'refunded' when 'charged_back' then 'charged_back' else 'cancelled' end,
      payment_status = target_payment_status, mercado_pago_payment_id = target_payment_id, updated_at = now()
      where id = target_order_id returning * into target_order;
    if target_order.enrollment_id is not null then
      update public.mentorship_enrollments set status = 'paused', updated_at = now() where id = target_order.enrollment_id;
    end if;
    update public.mentorship_applications set status = 'cancelled', reviewed_at = now(), updated_at = now()
      where id = target_order.application_id;
    return target_order;
  end if;
  if target_order.status in ('approved','refunded','charged_back','paid_no_seat') then return target_order; end if;
  update public.mentorship_orders set status = case target_payment_status when 'rejected' then 'rejected' when 'cancelled' then 'cancelled' else 'pending' end,
    payment_status = target_payment_status, mercado_pago_payment_id = target_payment_id, updated_at = now()
    where id = target_order_id returning * into target_order;
  if target_order.status in ('rejected','cancelled') then
    update public.mentorship_applications set status = 'requested', updated_at = now() where id = target_order.application_id;
  end if;
  return target_order;
end;
$$;

create or replace function public.activate_mentorship_application(
  target_application_id uuid, target_decision text, target_note text, target_payment_reference text, target_reviewer uuid, target_source text, target_cohort_id uuid
) returns public.mentorship_enrollments
language plpgsql
security definer
set search_path = ''
as $$
declare
  target_application public.mentorship_applications%rowtype;
  target_cohort public.mentorship_cohorts%rowtype;
  existing_enrollment public.mentorship_enrollments%rowtype;
  created_enrollment public.mentorship_enrollments%rowtype;
  occupied integer;
begin
  select * into target_application from public.mentorship_applications where id = target_application_id;
  if not found then raise exception 'APPLICATION_NOT_FOUND'; end if;
  if target_decision not in ('confirmed','waitlisted','rejected','cancelled') then raise exception 'INVALID_DECISION'; end if;
  if target_decision = 'confirmed' then
    target_cohort_id := coalesce(target_application.cohort_id, target_cohort_id);
    if target_cohort_id is null then raise exception 'COHORT_REQUIRED'; end if;
    if nullif(btrim(coalesce(target_note,'')),'') is null then raise exception 'DECISION_NOTE_REQUIRED'; end if;
    if target_source not in ('manual','scholarship') then raise exception 'INVALID_SOURCE'; end if;
    if target_source = 'manual' and nullif(btrim(coalesce(target_payment_reference,'')),'') is null then raise exception 'PAYMENT_REFERENCE_REQUIRED'; end if;
    select * into target_cohort from public.mentorship_cohorts where id = target_cohort_id for update;
    if not found or target_cohort.status not in ('enrollment','active') then raise exception 'ENROLLMENT_CLOSED'; end if;
    select * into target_application from public.mentorship_applications where id = target_application_id for update;
    if not found then raise exception 'APPLICATION_NOT_FOUND'; end if;
    if coalesce(target_application.cohort_id, target_cohort_id) <> target_cohort.id then raise exception 'APPLICATION_CHANGED_RETRY'; end if;
    target_application.cohort_id := target_cohort.id;
    select * into existing_enrollment from public.mentorship_enrollments where cohort_id = target_cohort.id and user_id = target_application.user_id;
    if found and existing_enrollment.status in ('invited','active','paused','completed') then
      update public.mentorship_enrollments set status = 'active', admission_source = target_source,
        joined_at = coalesce(joined_at,now()), updated_at = now() where id = existing_enrollment.id returning * into created_enrollment;
      update public.mentorship_applications set cohort_id = target_application.cohort_id, status = 'confirmed', decision_note = left(target_note,2000),
        payment_reference = nullif(left(btrim(coalesce(target_payment_reference,'')),240),''), reviewed_by = target_reviewer, reviewed_at = now(), updated_at = now()
        where id = target_application_id;
      return created_enrollment;
    end if;
    select count(*) into occupied from public.mentorship_enrollments e where e.cohort_id = target_cohort.id and e.status in ('invited','active','paused','completed');
    occupied := occupied + (select count(*) from public.mentorship_orders o where o.cohort_id = target_cohort.id and o.status = 'pending' and o.reservation_expires_at > now());
    if occupied >= target_cohort.capacity then raise exception 'COHORT_FULL'; end if;
    insert into public.mentorship_enrollments(cohort_id,user_id,status,level,joined_at,admission_source)
      values(target_cohort.id,target_application.user_id,'active','beginner',now(),target_source)
      on conflict (cohort_id,user_id) do update set status = 'active', admission_source = excluded.admission_source, joined_at = coalesce(public.mentorship_enrollments.joined_at,now()), updated_at = now()
      returning * into created_enrollment;
    update public.mentorship_applications set cohort_id = target_application.cohort_id, status = 'confirmed', decision_note = left(target_note,2000),
      payment_reference = nullif(left(btrim(coalesce(target_payment_reference,'')),240),''), reviewed_by = target_reviewer, reviewed_at = now(), updated_at = now()
      where id = target_application_id;
    return created_enrollment;
  end if;
  select * into target_application from public.mentorship_applications where id = target_application_id for update;
  update public.mentorship_applications set status = target_decision, decision_note = left(coalesce(target_note,''),2000),
    payment_reference = nullif(left(btrim(coalesce(target_payment_reference,'')),240),''), reviewed_by = target_reviewer, reviewed_at = now(), updated_at = now()
    where id = target_application_id;
  return null;
end;
$$;

create or replace function public.create_mentorship_invitation(target_cohort_id uuid, target_user_id uuid, target_level text)
returns public.mentorship_enrollments
language plpgsql
security definer
set search_path = ''
as $$
declare
  target_cohort public.mentorship_cohorts%rowtype;
  existing_enrollment public.mentorship_enrollments%rowtype;
  occupied integer;
begin
  if target_level not in ('beginner','intermediate') then raise exception 'INVALID_LEVEL'; end if;
  select * into target_cohort from public.mentorship_cohorts where id = target_cohort_id for update;
  if not found or target_cohort.status not in ('enrollment','active') then raise exception 'ENROLLMENT_CLOSED'; end if;
  select * into existing_enrollment from public.mentorship_enrollments where cohort_id = target_cohort_id and user_id = target_user_id;
  if found and existing_enrollment.status in ('invited','active','paused','completed') then return existing_enrollment; end if;
  select count(*) into occupied from public.mentorship_enrollments where cohort_id = target_cohort_id and status in ('invited','active','paused','completed');
  occupied := occupied + (select count(*) from public.mentorship_orders where cohort_id = target_cohort_id and status = 'pending' and reservation_expires_at > now());
  if occupied >= target_cohort.capacity then raise exception 'COHORT_FULL'; end if;
  insert into public.mentorship_enrollments(cohort_id,user_id,status,level,admission_source)
    values(target_cohort_id,target_user_id,'invited',target_level,'manual')
    on conflict (cohort_id,user_id) do update set status = 'invited', level = excluded.level, admission_source = 'manual', updated_at = now()
    returning * into existing_enrollment;
  return existing_enrollment;
end;
$$;

create or replace function public.set_mentorship_cohort_capacity(target_cohort_id uuid, target_capacity integer)
returns integer language plpgsql security definer set search_path = '' as $$
declare
  target_cohort public.mentorship_cohorts%rowtype;
  occupied integer;
begin
  if target_capacity < 1 or target_capacity > 200 then raise exception 'INVALID_CAPACITY'; end if;
  select * into target_cohort from public.mentorship_cohorts where id = target_cohort_id for update;
  if not found then raise exception 'COHORT_NOT_FOUND'; end if;
  select count(*) into occupied from public.mentorship_enrollments where cohort_id = target_cohort_id and status in ('invited','active','paused','completed');
  occupied := occupied + (select count(*) from public.mentorship_orders where cohort_id = target_cohort_id and status = 'pending' and reservation_expires_at > now());
  if target_capacity < occupied then raise exception 'CAPACITY_BELOW_OCCUPIED'; end if;
  update public.mentorship_cohorts set capacity = target_capacity, updated_at = now() where id = target_cohort_id;
  return target_capacity;
end;
$$;

create or replace function public.set_mentorship_enrollment_status(target_enrollment_id uuid, target_status text, target_level text)
returns public.mentorship_enrollments
language plpgsql
security definer
set search_path = ''
as $$
declare
  target_enrollment public.mentorship_enrollments%rowtype;
  target_cohort public.mentorship_cohorts%rowtype;
  occupied integer;
begin
  if target_status not in ('invited','active','paused','completed','cancelled') or target_level not in ('beginner','intermediate') then raise exception 'INVALID_ENROLLMENT'; end if;
  select c.* into target_cohort from public.mentorship_cohorts c join public.mentorship_enrollments e on e.cohort_id = c.id where e.id = target_enrollment_id;
  if not found then raise exception 'ENROLLMENT_NOT_FOUND'; end if;
  perform 1 from public.mentorship_cohorts where id = target_cohort.id for update;
  select * into target_enrollment from public.mentorship_enrollments where id = target_enrollment_id for update;
  if not found then raise exception 'ENROLLMENT_NOT_FOUND'; end if;
  if target_status in ('invited','active','paused','completed') and target_enrollment.status not in ('invited','active','paused','completed') then
    select count(*) into occupied from public.mentorship_enrollments where cohort_id = target_enrollment.cohort_id and status in ('invited','active','paused','completed');
    occupied := occupied + (select count(*) from public.mentorship_orders where cohort_id = target_enrollment.cohort_id and status = 'pending' and reservation_expires_at > now());
    if occupied >= target_cohort.capacity then raise exception 'COHORT_FULL'; end if;
  end if;
  update public.mentorship_enrollments set status = target_status, level = target_level,
    joined_at = case when target_status = 'active' then coalesce(joined_at,now()) else joined_at end,
    completed_at = case when target_status = 'completed' then coalesce(completed_at,now()) else null end,
    updated_at = now()
   where id = target_enrollment_id returning * into target_enrollment;
  return target_enrollment;
end;
$$;

create or replace function public.resolve_paid_mentorship_order(
  target_order_id uuid, target_decision text, target_note text, target_reviewer uuid
) returns public.mentorship_orders
language plpgsql
security definer
set search_path = ''
as $$
declare
  target_order public.mentorship_orders%rowtype;
  target_cohort public.mentorship_cohorts%rowtype;
  created_enrollment public.mentorship_enrollments%rowtype;
  occupied integer;
begin
  if target_decision not in ('activate','refund_recorded') or nullif(btrim(coalesce(target_note,'')),'') is null then raise exception 'INVALID_RESOLUTION'; end if;
  select * into target_order from public.mentorship_orders where id = target_order_id;
  if not found or target_order.status <> 'paid_no_seat' then raise exception 'ORDER_NOT_RESOLVABLE'; end if;
  select * into target_cohort from public.mentorship_cohorts where id = target_order.cohort_id for update;
  select * into target_order from public.mentorship_orders where id = target_order_id for update;
  if not found or target_order.status <> 'paid_no_seat' then raise exception 'ORDER_NOT_RESOLVABLE'; end if;
  if target_decision = 'activate' then
    if target_cohort.status not in ('enrollment','active') then raise exception 'ENROLLMENT_CLOSED'; end if;
    select count(*) into occupied from public.mentorship_enrollments where cohort_id = target_order.cohort_id and status in ('invited','active','paused','completed');
    occupied := occupied + (select count(*) from public.mentorship_orders where cohort_id = target_order.cohort_id and id <> target_order.id and status = 'pending' and reservation_expires_at > now());
    select * into created_enrollment from public.mentorship_enrollments where cohort_id = target_order.cohort_id and user_id = target_order.user_id;
    if not found and occupied >= target_cohort.capacity then raise exception 'COHORT_FULL'; end if;
    if found then
      update public.mentorship_enrollments set status = 'active', admission_source = 'mercado_pago', joined_at = coalesce(joined_at,now()), updated_at = now() where id = created_enrollment.id returning * into created_enrollment;
    else
      insert into public.mentorship_enrollments(cohort_id,user_id,status,level,joined_at,admission_source)
        values(target_order.cohort_id,target_order.user_id,'active','beginner',now(),'mercado_pago') returning * into created_enrollment;
    end if;
    update public.mentorship_orders set status = 'approved', enrollment_id = created_enrollment.id, resolution_note = left(target_note,2000), resolved_by = target_reviewer, resolved_at = now(), updated_at = now()
      where id = target_order.id returning * into target_order;
    update public.mentorship_applications set status = 'confirmed', decision_note = left(target_note,2000), reviewed_by = target_reviewer, reviewed_at = now(), updated_at = now()
      where id = target_order.application_id;
  else
    update public.mentorship_orders set status = 'refunded', resolution_note = left(target_note,2000), resolved_by = target_reviewer, resolved_at = now(), updated_at = now()
      where id = target_order.id returning * into target_order;
    update public.mentorship_applications set status = 'cancelled', decision_note = left(target_note,2000), reviewed_by = target_reviewer, reviewed_at = now(), updated_at = now()
      where id = target_order.application_id;
  end if;
  return target_order;
end;
$$;

revoke all on function public.reserve_mentorship_order(uuid,uuid,integer) from public, anon, authenticated;
revoke all on function public.finalize_mentorship_payment(uuid,text,text,numeric,text) from public, anon, authenticated;
revoke all on function public.activate_mentorship_application(uuid,text,text,text,uuid,text,uuid) from public, anon, authenticated;
revoke all on function public.create_mentorship_invitation(uuid,uuid,text) from public, anon, authenticated;
revoke all on function public.set_mentorship_cohort_capacity(uuid,integer) from public, anon, authenticated;
revoke all on function public.set_mentorship_enrollment_status(uuid,text,text) from public, anon, authenticated;
revoke all on function public.resolve_paid_mentorship_order(uuid,text,text,uuid) from public, anon, authenticated;
grant execute on function public.reserve_mentorship_order(uuid,uuid,integer) to service_role;
grant execute on function public.finalize_mentorship_payment(uuid,text,text,numeric,text) to service_role;
grant execute on function public.activate_mentorship_application(uuid,text,text,text,uuid,text,uuid) to service_role;
grant execute on function public.create_mentorship_invitation(uuid,uuid,text) to service_role;
grant execute on function public.set_mentorship_cohort_capacity(uuid,integer) to service_role;
grant execute on function public.set_mentorship_enrollment_status(uuid,text,text) to service_role;
grant execute on function public.resolve_paid_mentorship_order(uuid,text,text,uuid) to service_role;
