begin;
select no_plan();

-- The architecture deliberately revokes Data API access to private mentorship
-- tables. Real role tests complement the route-level membership tests.
set local role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);
select throws_ok(
  format('select * from public.%I limit 1', name),
  '42501', format('permission denied for table %s', name),
  format('authenticated users cannot directly read %s', name)
) from unnest(array[
  'mentorship_staff', 'mentorship_cohorts', 'mentorship_cohort_staff',
  'mentorship_enrollments', 'mentorship_lesson_progress', 'mentorship_live_sessions',
  'mentorship_attendance', 'mentorship_submissions', 'mentorship_reviews',
  'mentorship_weekly_commitments', 'mentorship_certificates', 'mentorship_email_outbox'
]) name;
select throws_ok(
  $$update public.mentorship_enrollments set user_id = '00000000-0000-4000-8000-000000000001'$$,
  '42501', 'permission denied for table mentorship_enrollments',
  'a student cannot reassign enrollment ownership'
);
select throws_ok(
  $$update public.mentorship_submissions set enrollment_id = '00000000-0000-4000-8000-000000000001'$$,
  '42501', 'permission denied for table mentorship_submissions',
  'a student cannot move a submission to another enrollment'
);
select throws_ok(
  $$insert into public.mentorship_staff(user_id,role,active) values ('00000000-0000-4000-8000-000000000001','admin',true)$$,
  '42501', 'permission denied for table mentorship_staff',
  'a student cannot promote themselves to admin'
);
select throws_ok(
  $$select public.finalize_mentorship_payment('00000000-0000-4000-8000-000000000001','fake','approved',1,'BRL')$$,
  '42501', 'permission denied for function finalize_mentorship_payment',
  'a student cannot confirm their own payment'
);

set local role anon;
select throws_ok(
  format('select * from public.%I limit 1', name),
  '42501', format('permission denied for table %s', name),
  format('anonymous users cannot read %s', name)
) from unnest(array['mentorship_submissions','mentorship_reviews','mentorship_live_sessions','mentorship_certificates','mentorship_email_outbox']) name;

reset role;
select ok((select not public from storage.buckets where id = 'lab-evidence'), 'evidence storage remains private');
select ok(not has_table_privilege('authenticated','public.mentorship_certificates','INSERT'), 'certificates cannot be forged through the Data API');
select ok(not has_table_privilege('authenticated','public.mentorship_reviews','INSERT'), 'mentors must use the route membership check rather than direct writes');

select set_config('qa.isolation.user', gen_random_uuid()::text, true);
insert into auth.users(id,instance_id,aud,role,email,encrypted_password,email_confirmed_at)
values(current_setting('qa.isolation.user')::uuid,'00000000-0000-0000-0000-000000000000','authenticated','authenticated',current_setting('qa.isolation.user') || '@example.test','',now());
set local role service_role;
select lives_ok(
  format('select public.reserve_evidence_upload(%L::uuid,%L,100,%L)',
    current_setting('qa.isolation.user'), current_setting('qa.isolation.user') || '/mentoria-test/00000000-0000-4000-8000-000000000001.pdf', 'application/pdf'),
  'quota reservation resolves the owner parameter even though storage.objects also has owner_id'
);
insert into public.mentorship_notifications(user_id,kind,title,body,href,dedupe_key)
values(current_setting('qa.isolation.user')::uuid,'review','Feedback de teste','Conteúdo de teste','/mentoria/app','qa-atomic-' || current_setting('qa.isolation.user'));
select is((select count(*)::integer from public.mentorship_email_outbox where user_id = current_setting('qa.isolation.user')::uuid),1,'notification and outbox are persisted atomically');
select throws_ok(
  format('insert into public.mentorship_notifications(user_id,kind,title,body,href) values(%L::uuid,%L,%L,%L,%L)', current_setting('qa.isolation.user'),'review','Falha atômica','Teste','https://example.test/forbidden'),
  '23514', null,
  'an invalid delivery rolls back the notification instead of silently losing its email'
);
select is((select count(*)::integer from public.mentorship_notifications where user_id = current_setting('qa.isolation.user')::uuid),1,'failed delivery enqueue leaves no half-written notification');
reset role;
select * from finish();
rollback;
