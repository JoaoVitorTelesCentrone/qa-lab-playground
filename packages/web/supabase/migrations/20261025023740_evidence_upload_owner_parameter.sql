-- storage.objects also has owner_id. Qualify the argument to avoid PL/pgSQL
-- resolving the quota owner against that column and rejecting every upload.
create or replace function public.reserve_evidence_upload(
  owner_id uuid, object_path text, file_bytes bigint, file_type text
)
returns void
language plpgsql
security invoker
set search_path = ''
as $$
declare
  extension text;
  stored_bytes bigint;
  stored_count bigint;
  pending_bytes bigint;
  pending_count bigint;
  daily_bytes bigint;
  daily_count bigint;
begin
  if owner_id is null or object_path is null or file_bytes is null or file_type is null then
    raise exception 'Dados do upload invalidos.';
  end if;
  extension := case file_type
    when 'image/jpeg' then 'jpg'
    when 'image/png' then 'png'
    when 'image/gif' then 'gif'
    when 'image/webp' then 'webp'
    when 'video/mp4' then 'mp4'
    when 'video/webm' then 'webm'
    when 'application/pdf' then 'pdf'
  end;
  if extension is null or file_bytes < 1 or file_bytes > 10485760
    or object_path !~ ('^' || owner_id::text || '/[a-zA-Z0-9-]{1,60}/[0-9a-fA-F-]{36}[.]' || extension || '$') then
    raise exception 'Caminho, tamanho ou formato do upload invalido.';
  end if;

  -- Serialize reservations for one account. The Storage insert checks the
  -- reservation; a parallel request cannot reserve beyond this account's cap.
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(owner_id::text, 72056));
  delete from app_private.evidence_upload_intents
  where user_id = owner_id and created_at <= now() - interval '24 hours';

  -- Read stored objects and pending reservations from one snapshot. An upload
  -- finishing between two separate reads could otherwise escape both totals.
  with stored as (
    select coalesce(sum(case when metadata->>'size' ~ '^[0-9]{1,10}$'
      then (metadata->>'size')::bigint else 10485760 end), 0) as bytes, count(*) as files
    from storage.objects
    where bucket_id = 'lab-evidence' and split_part(name, '/', 1) = reserve_evidence_upload.owner_id::text
  ), pending as (
    select coalesce(sum(intent.size_bytes), 0) as bytes, count(*) as files
    from app_private.evidence_upload_intents intent
    where intent.user_id = owner_id and intent.expires_at > now()
      and not exists (
        select 1 from storage.objects object
        where object.bucket_id = 'lab-evidence' and object.name = intent.path
      )
  )
  select stored.bytes, stored.files, pending.bytes, pending.files
  into stored_bytes, stored_count, pending_bytes, pending_count
  from stored cross join pending;

  select coalesce(sum(size_bytes), 0), count(*)
  into daily_bytes, daily_count
  from app_private.evidence_upload_intents
  where user_id = owner_id and created_at > now() - interval '24 hours';

  if stored_bytes + pending_bytes + file_bytes > 104857600
    or stored_count + pending_count >= 200 then
    raise exception 'Limite de armazenamento da conta: 100 MB ou 200 arquivos.';
  end if;
  if pending_count >= 5 then
    raise exception 'Aguarde os envios em andamento antes de adicionar outro arquivo.';
  end if;
  if daily_count >= 30 or daily_bytes + file_bytes > 157286400 then
    raise exception 'Limite diario de envios atingido. Tente novamente em 24 horas.';
  end if;

  insert into app_private.evidence_upload_intents (path, user_id, size_bytes, mime_type)
  values (object_path, owner_id, file_bytes, file_type);
end;
$$;
revoke all on function public.reserve_evidence_upload(uuid, text, bigint, text) from public, anon, authenticated;
grant execute on function public.reserve_evidence_upload(uuid, text, bigint, text) to service_role;
