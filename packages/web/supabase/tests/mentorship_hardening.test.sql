begin;
select plan(9);

select ok(
  (select relrowsecurity from pg_class where oid = 'public.mentorship_notifications'::regclass),
  'notifications enforce row level security'
);
select ok(
  exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'mentorship_notifications' and policyname = 'owner reads mentorship notifications' and qual ilike '%auth.uid()%user_id%'),
  'notification reads are scoped to the authenticated owner'
);
select ok(
  exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'mentorship_notifications' and policyname = 'owner marks notification read' and qual ilike '%auth.uid()%user_id%' and with_check ilike '%auth.uid()%user_id%'),
  'read updates remain scoped to the authenticated owner'
);
select ok(
  has_table_privilege('authenticated', 'public.mentorship_notifications', 'SELECT'),
  'authenticated users can read notifications subject to owner RLS'
);
select ok(
  has_column_privilege('authenticated', 'public.mentorship_notifications', 'read_at', 'UPDATE'),
  'authenticated users can mark a notification as read'
);
select ok(
  not has_column_privilege('authenticated', 'public.mentorship_notifications', 'title', 'UPDATE'),
  'authenticated users cannot alter notification content'
);
select ok(
  not has_table_privilege('authenticated', 'public.mentorship_email_outbox', 'SELECT'),
  'authenticated users cannot read the email outbox'
);
select ok(
  not has_table_privilege('anon', 'public.mentorship_email_outbox', 'SELECT'),
  'anonymous users cannot read the email outbox'
);
select ok(
  has_table_privilege('service_role', 'public.mentorship_email_outbox', 'SELECT,INSERT,UPDATE,DELETE'),
  'the service role can process the email outbox'
);

select * from finish();
rollback;
