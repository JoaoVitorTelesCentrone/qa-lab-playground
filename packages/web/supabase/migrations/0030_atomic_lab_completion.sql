-- The submission, enrollment and completion event succeed or fail together.
-- Keep the function invoker scoped: RLS checks the signed-in user's rows.
create or replace function public.complete_lab_submission(
  p_lab_slug text,
  p_evidence text,
  p_attachments jsonb
)
returns public.lab_submissions
language plpgsql
security invoker
set search_path = ''
as $$
declare
  owner_id uuid := auth.uid();
  saved public.lab_submissions;
begin
  if owner_id is null then
    raise exception 'Authentication required' using errcode = '28000';
  end if;
  if p_lab_slug is null or p_lab_slug = '' or length(p_lab_slug) > 120 then
    raise exception 'Invalid Lab' using errcode = '22023';
  end if;
  if p_attachments is null or jsonb_typeof(p_attachments) <> 'array' then
    raise exception 'Invalid attachments' using errcode = '22023';
  end if;
  if length(btrim(coalesce(p_evidence, ''))) < 20 and jsonb_array_length(p_attachments) = 0 then
    raise exception 'Evidence is required' using errcode = '22023';
  end if;
  if exists (
    select 1
    from jsonb_array_elements(p_attachments) as item
    where jsonb_typeof(item) <> 'object'
      or left(coalesce(item->>'path', ''), length(owner_id::text || '/' || p_lab_slug || '/')) <> owner_id::text || '/' || p_lab_slug || '/'
      or substring(coalesce(item->>'path', '') from length(owner_id::text || '/' || p_lab_slug || '/') + 1)
         !~ '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}(\.[a-zA-Z0-9]{1,8})?$'
  ) then
    raise exception 'Invalid attachment path' using errcode = '22023';
  end if;

  insert into public.lab_submissions (user_id, lab_slug, evidence, attachments)
  values (owner_id, p_lab_slug, btrim(p_evidence), p_attachments)
  returning * into saved;

  insert into public.lab_enrollments (user_id, lab_slug, status, submission_id, completed_at)
  values (owner_id, p_lab_slug, 'completed', saved.id, now())
  on conflict (user_id, lab_slug) do update
    set status = 'completed', submission_id = excluded.submission_id, completed_at = excluded.completed_at;

  insert into public.activity_events (user_id, name, props)
  values (owner_id, 'lab_completed', jsonb_build_object('lab', p_lab_slug, 'attachments', jsonb_array_length(p_attachments)));

  return saved;
end;
$$;

revoke execute on function public.complete_lab_submission(text, text, jsonb) from public, anon;
grant execute on function public.complete_lab_submission(text, text, jsonb) to authenticated;
