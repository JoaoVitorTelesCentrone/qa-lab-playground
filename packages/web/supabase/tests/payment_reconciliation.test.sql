begin;
select plan(13);

select set_config('qa.payment.user_one', gen_random_uuid()::text, true);
select set_config('qa.payment.user_two', gen_random_uuid()::text, true);
select set_config('qa.payment.cohort', gen_random_uuid()::text, true);
select set_config('qa.payment.offer', gen_random_uuid()::text, true);
select set_config('qa.payment.order_one', gen_random_uuid()::text, true);
select set_config('qa.payment.order_two', gen_random_uuid()::text, true);
select set_config('qa.payment.purchase', gen_random_uuid()::text, true);

insert into auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at)
values
  (current_setting('qa.payment.user_one')::uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', current_setting('qa.payment.user_one') || '@example.test', '', now()),
  (current_setting('qa.payment.user_two')::uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', current_setting('qa.payment.user_two') || '@example.test', '', now());

insert into public.mentorship_cohorts (id, code, name, starts_on, ends_on, capacity, status)
values (current_setting('qa.payment.cohort')::uuid, 'qa-payment-' || left(current_setting('qa.payment.cohort'), 8),
  'Turma de teste de pagamento', current_date, current_date + 84, 1, 'enrollment');
insert into public.mentorship_offers (id, cohort_id, offer_code, title, price, terms, cancellation_policy, published)
values (current_setting('qa.payment.offer')::uuid, current_setting('qa.payment.cohort')::uuid,
  'qa-payment-' || left(current_setting('qa.payment.offer'), 8), 'Mentoria de teste', 297, 'Condições de teste', 'Política de teste', true);
insert into public.mentorship_orders
  (id, user_id, cohort_id, offer_id, offer_version, offer_title, terms_snapshot, cancellation_policy_snapshot, amount, reservation_expires_at)
values
  (current_setting('qa.payment.order_one')::uuid, current_setting('qa.payment.user_one')::uuid,
    current_setting('qa.payment.cohort')::uuid, current_setting('qa.payment.offer')::uuid,
    1, 'Mentoria de teste', 'Condições de teste', 'Política de teste', 297, now() + interval '1 day');

select is(
  (public.finalize_mentorship_payment(current_setting('qa.payment.order_one')::uuid, 'pay-mentoria-1', 'approved', 297, 'BRL')).status,
  'approved', 'pagamento válido ativa a ordem da mentoria'
);
select is(
  (select count(*)::integer from public.mentorship_enrollments where cohort_id = current_setting('qa.payment.cohort')::uuid and status = 'active'),
  1, 'primeira aprovação ocupa exatamente uma vaga'
);
select is(
  (public.finalize_mentorship_payment(current_setting('qa.payment.order_one')::uuid, 'pay-mentoria-1', 'refunded', 297, 'BRL')).status,
  'refunded', 'reembolso encerra a ordem'
);
select is(
  (select status from public.mentorship_enrollments where cohort_id = current_setting('qa.payment.cohort')::uuid and user_id = current_setting('qa.payment.user_one')::uuid),
  'paused', 'reembolso suspende o acesso da mentoria'
);
select is(
  (public.finalize_mentorship_payment(current_setting('qa.payment.order_one')::uuid, 'pay-mentoria-1', 'approved', 297, 'BRL')).status,
  'refunded', 'evento aprovado tardio não reativa ordem reembolsada'
);
insert into public.mentorship_orders
  (id, user_id, cohort_id, offer_id, offer_version, offer_title, terms_snapshot, cancellation_policy_snapshot, amount, reservation_expires_at, status)
values (current_setting('qa.payment.order_two')::uuid, current_setting('qa.payment.user_two')::uuid,
  current_setting('qa.payment.cohort')::uuid, current_setting('qa.payment.offer')::uuid,
  1, 'Mentoria de teste', 'Condições de teste', 'Política de teste', 297, now() + interval '1 day', 'cancelled');
select is(
  (public.finalize_mentorship_payment(current_setting('qa.payment.order_two')::uuid, 'pay-mentoria-2', 'approved', 297, 'BRL')).status,
  'paid_no_seat', 'pagamento tardio de reserva cancelada vai para conciliação'
);
select is(
  (select count(*)::integer from public.mentorship_enrollments where cohort_id = current_setting('qa.payment.cohort')::uuid),
  1, 'pagamento tardio não cria matrícula acima da capacidade'
);

insert into public.billing_purchases (id, user_id, offer_id, plan, amount, currency, status)
values (current_setting('qa.payment.purchase')::uuid, current_setting('qa.payment.user_two')::uuid, 'qa-test-pro', 'pro', 297, 'BRL', 'pending');
select is(
  (public.reconcile_billing_purchase(current_setting('qa.payment.purchase')::uuid, 'pay-pro-1', 'approved', 297, 'BRL')).status,
  'approved', 'pagamento Pro válido é aprovado'
);
select is(
  (select plan from public.profiles where id = current_setting('qa.payment.user_two')::uuid),
  'pro', 'aprovação concede acesso Pro'
);
select is(
  (public.reconcile_billing_purchase(current_setting('qa.payment.purchase')::uuid, 'pay-pro-1', 'refunded', 297, 'BRL')).status,
  'refunded', 'reembolso Pro é registrado'
);
select is(
  (select plan from public.profiles where id = current_setting('qa.payment.user_two')::uuid),
  'free', 'reembolso retira acesso Pro concedido pela compra'
);
select is(
  (public.reconcile_billing_purchase(current_setting('qa.payment.purchase')::uuid, 'pay-pro-1', 'approved', 297, 'BRL')).status,
  'refunded', 'aprovação tardia não restaura compra Pro reembolsada'
);
select ok(
  not has_table_privilege('authenticated', 'public.billing_purchases', 'INSERT')
  and not has_table_privilege('authenticated', 'public.profiles', 'INSERT')
  and not has_table_privilege('authenticated', 'public.profiles', 'DELETE')
  and exists (select 1 from pg_trigger where tgrelid = 'public.profiles'::regclass and tgname = 'prevent_client_plan_change' and not tgisinternal),
  'cliente autenticado não pode criar compra ou perfil pago diretamente'
);

select * from finish();
rollback;
