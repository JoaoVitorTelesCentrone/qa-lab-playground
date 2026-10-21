-- Payment reconciliation is serialized on the cohort/profile and is never
-- allowed to turn an ended payment or released seat into active access.

create or replace function public.finalize_mentorship_payment(
  target_order_id uuid, target_payment_id text, target_payment_status text, target_amount numeric, target_currency text
) returns public.mentorship_orders
language plpgsql security definer set search_path = '' as $$
declare
  target_order public.mentorship_orders%rowtype;
  target_cohort public.mentorship_cohorts%rowtype;
  existing_enrollment public.mentorship_enrollments%rowtype;
  created_enrollment public.mentorship_enrollments%rowtype;
  occupied integer;
begin
  select * into target_order from public.mentorship_orders where id = target_order_id;
  if not found then raise exception 'ORDER_NOT_FOUND'; end if;
  select * into target_cohort from public.mentorship_cohorts where id = target_order.cohort_id for update;
  select * into target_order from public.mentorship_orders where id = target_order_id for update;
  if not found then raise exception 'ORDER_NOT_FOUND'; end if;
  if lower(coalesce(target_currency, '')) <> lower(target_order.currency) or target_amount is distinct from target_order.amount then
    raise exception 'PAYMENT_AMOUNT_MISMATCH';
  end if;
  if target_payment_status not in ('pending', 'in_process', 'authorized', 'approved', 'rejected', 'cancelled', 'refunded', 'charged_back')
    or target_payment_status is null then raise exception 'PAYMENT_STATUS_INVALID'; end if;
  if nullif(target_payment_id, '') is null then raise exception 'PAYMENT_ID_REQUIRED'; end if;
  if target_order.mercado_pago_payment_id is not null and target_order.mercado_pago_payment_id <> target_payment_id then
    raise exception 'PAYMENT_ID_MISMATCH';
  end if;

  -- Repeated notifications are harmless; a refunded or charged-back order
  -- cannot be reactivated by a later approved notification.
  if target_order.status in ('refunded', 'charged_back') then return target_order; end if;
  if target_order.status = 'approved' and target_payment_status = 'approved' then return target_order; end if;
  if target_order.status = 'paid_no_seat' and target_payment_status = 'approved' then return target_order; end if;

  if target_payment_status in ('refunded', 'charged_back', 'cancelled') then
    update public.mentorship_orders set
      status = case target_payment_status when 'refunded' then 'refunded' when 'charged_back' then 'charged_back' else 'cancelled' end,
      payment_status = target_payment_status, mercado_pago_payment_id = target_payment_id, updated_at = now()
      where id = target_order_id returning * into target_order;
    if target_order.enrollment_id is not null then
      update public.mentorship_enrollments set status = 'paused', updated_at = now() where id = target_order.enrollment_id;
    end if;
    update public.mentorship_applications set status = 'cancelled', reviewed_at = now(), updated_at = now()
      where id = target_order.application_id;
    return target_order;
  end if;

  if target_payment_status = 'approved' then
    -- Rejected, cancelled and expired orders no longer reserve a seat.
    -- A late payment must go to the reconciliation queue, never over capacity.
    select * into existing_enrollment from public.mentorship_enrollments
      where cohort_id = target_order.cohort_id and user_id = target_order.user_id;
    select count(*) into occupied from public.mentorship_enrollments
      where cohort_id = target_order.cohort_id and status in ('invited', 'active', 'paused', 'completed');
    occupied := occupied + (select count(*) from public.mentorship_orders
      where cohort_id = target_order.cohort_id and id <> target_order.id
        and status = 'pending' and reservation_expires_at > now());
    if target_order.status <> 'pending' or target_cohort.status not in ('enrollment', 'active')
      or target_order.reservation_expires_at <= now()
      or (occupied >= target_cohort.capacity and
        (existing_enrollment.id is null or existing_enrollment.status not in ('invited', 'active', 'paused', 'completed'))) then
      update public.mentorship_orders set status = 'paid_no_seat', payment_status = 'approved',
        mercado_pago_payment_id = target_payment_id, paid_at = coalesce(paid_at, now()), updated_at = now()
        where id = target_order_id returning * into target_order;
      return target_order;
    end if;
    insert into public.mentorship_enrollments(cohort_id, user_id, status, level, joined_at, admission_source)
      values(target_order.cohort_id, target_order.user_id, 'active', 'beginner', now(), 'mercado_pago')
      on conflict (cohort_id, user_id) do update set status = 'active', admission_source = 'mercado_pago',
        joined_at = coalesce(public.mentorship_enrollments.joined_at, now()), updated_at = now()
      returning * into created_enrollment;
    update public.mentorship_orders set status = 'approved', payment_status = 'approved',
      mercado_pago_payment_id = target_payment_id, enrollment_id = created_enrollment.id,
      paid_at = coalesce(paid_at, now()), updated_at = now()
      where id = target_order_id returning * into target_order;
    update public.mentorship_applications set status = 'confirmed', reviewed_at = now(), updated_at = now()
      where id = target_order.application_id;
    return target_order;
  end if;

  if target_order.status in ('approved', 'paid_no_seat') then return target_order; end if;
  if target_order.status in ('rejected', 'cancelled', 'expired') then return target_order; end if;
  update public.mentorship_orders set
    status = case target_payment_status when 'rejected' then 'rejected' else 'pending' end,
    payment_status = target_payment_status, mercado_pago_payment_id = target_payment_id, updated_at = now()
    where id = target_order_id returning * into target_order;
  if target_order.status = 'rejected' then
    update public.mentorship_applications set status = 'requested', updated_at = now()
      where id = target_order.application_id;
  end if;
  return target_order;
end;
$$;

-- The old own-profile RLS policy permits an authenticated user to update plan.
-- Keep normal profile editing, while rejecting paid-access fields in the
-- database even if a client sends a direct Data API request.
alter table public.profiles add column if not exists billing_purchase_id uuid
  references public.billing_purchases(id) on delete set null;

create or replace function public.prevent_client_plan_change()
returns trigger language plpgsql set search_path = '' as $$
begin
  if current_user in ('anon', 'authenticated')
    and (new.plan is distinct from old.plan or new.billing_purchase_id is distinct from old.billing_purchase_id) then
    raise exception 'PLAN_CHANGE_FORBIDDEN';
  end if;
  return new;
end;
$$;
drop trigger if exists prevent_client_plan_change on public.profiles;
create trigger prevent_client_plan_change before update on public.profiles
  for each row execute function public.prevent_client_plan_change();

-- Associate existing approved purchases with the access they granted.
update public.profiles p set billing_purchase_id = (
  select b.id from public.billing_purchases b
   where b.user_id = p.id and b.plan = p.plan and b.status = 'approved'
   order by b.paid_at desc nulls last, b.created_at desc limit 1
)
where p.plan in ('pro', 'team') and p.billing_purchase_id is null
  and exists (select 1 from public.billing_purchases b
    where b.user_id = p.id and b.plan = p.plan and b.status = 'approved');

create or replace function public.reconcile_billing_purchase(
  target_purchase_id uuid, target_payment_id text, target_payment_status text,
  target_amount numeric, target_currency text
) returns public.billing_purchases
language plpgsql security definer set search_path = '' as $$
declare
  purchase public.billing_purchases%rowtype;
  profile public.profiles%rowtype;
  paid_purchase public.billing_purchases%rowtype;
begin
  select * into purchase from public.billing_purchases where id = target_purchase_id;
  if not found then raise exception 'PURCHASE_NOT_FOUND'; end if;
  select * into profile from public.profiles where id = purchase.user_id for update;
  if not found then raise exception 'PROFILE_NOT_FOUND'; end if;
  select * into purchase from public.billing_purchases where id = target_purchase_id for update;
  if not found then raise exception 'PURCHASE_NOT_FOUND'; end if;
  if lower(coalesce(target_currency, '')) <> lower(purchase.currency) or target_amount is distinct from purchase.amount then
    raise exception 'PAYMENT_AMOUNT_MISMATCH';
  end if;
  if target_payment_status not in ('pending', 'in_process', 'authorized', 'approved', 'rejected', 'cancelled', 'refunded', 'charged_back')
    or target_payment_status is null then raise exception 'PAYMENT_STATUS_INVALID'; end if;
  if nullif(target_payment_id, '') is null then raise exception 'PAYMENT_ID_REQUIRED'; end if;
  if purchase.mercado_pago_payment_id is not null and purchase.mercado_pago_payment_id <> target_payment_id then
    raise exception 'PAYMENT_ID_MISMATCH';
  end if;
  if purchase.status in ('refunded', 'charged_back') then return purchase; end if;
  if purchase.status = 'approved' and target_payment_status not in ('refunded', 'charged_back') then return purchase; end if;

  update public.billing_purchases set status = target_payment_status,
    mercado_pago_payment_id = target_payment_id,
    paid_at = case when target_payment_status = 'approved' then coalesce(paid_at, now()) else paid_at end
    where id = target_purchase_id returning * into purchase;

  select * into paid_purchase from public.billing_purchases
    where user_id = purchase.user_id and status = 'approved'
    order by case when plan = 'team' then 0 else 1 end,
      paid_at desc nulls last, created_at desc limit 1;
  if profile.billing_purchase_id is not null or profile.plan = 'free'
    or (profile.plan = 'pro' and paid_purchase.plan = 'team') then
    update public.profiles set plan = coalesce(paid_purchase.plan, 'free'),
      billing_purchase_id = paid_purchase.id where id = purchase.user_id;
  end if;
  return purchase;
end;
$$;

-- Only the server's service role may create a purchase or reconcile payment.
drop policy if exists "billing purchases own insert" on public.billing_purchases;
revoke insert on public.billing_purchases from authenticated;
grant insert on public.billing_purchases to service_role;
revoke insert, delete on public.profiles from anon, authenticated;
revoke all on function public.finalize_mentorship_payment(uuid,text,text,numeric,text) from public, anon, authenticated;
grant execute on function public.finalize_mentorship_payment(uuid,text,text,numeric,text) to service_role;
revoke all on function public.reconcile_billing_purchase(uuid,text,text,numeric,text) from public, anon, authenticated;
grant execute on function public.reconcile_billing_purchase(uuid,text,text,numeric,text) to service_role;
