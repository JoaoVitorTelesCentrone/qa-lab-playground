-- Persist delivery work in the same transaction as the student notification.
-- Private trigger function; clients cannot invoke it through the Data API.
create schema if not exists app_private;

create or replace function app_private.queue_mentorship_notification_email()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.mentorship_email_outbox
    (notification_id, user_id, kind, dedupe_key, subject, body, href)
  values
    (new.id, new.user_id, new.kind,
     coalesce(new.dedupe_key, 'notification:' || new.id::text),
     new.title, new.body, new.href)
  on conflict (dedupe_key) do nothing;
  return new;
end;
$$;

revoke all on function app_private.queue_mentorship_notification_email() from public, anon, authenticated;

drop trigger if exists mentorship_notification_email on public.mentorship_notifications;
create trigger mentorship_notification_email
after insert on public.mentorship_notifications
for each row execute function app_private.queue_mentorship_notification_email();
