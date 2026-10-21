-- Leads da lista de interesse pública da Mentoria QA Lab.
-- Não cria conta e não concede acesso à mentoria.
create table public.mentorship_waitlist_leads (
  id uuid primary key default gen_random_uuid(),
  full_name text not null check (char_length(trim(full_name)) between 2 and 80),
  email text not null unique check (email = lower(email) and char_length(email) between 5 and 254),
  contact_consent_at timestamptz not null,
  source text not null default 'mentoria',
  created_at timestamptz not null default now()
);

create index mentorship_waitlist_leads_created_idx
  on public.mentorship_waitlist_leads (created_at desc);

alter table public.mentorship_waitlist_leads enable row level security;
revoke all on public.mentorship_waitlist_leads from anon, authenticated;
grant all on public.mentorship_waitlist_leads to service_role;

-- Limite compartilhado entre instancias da API. Guarda somente o hash do IP
-- por ate duas horas; um teto global limita abuso mesmo com IPs alternados.
create table public.mentorship_waitlist_rate_limits (
  bucket_start timestamptz not null,
  scope text not null check (scope in ('global', 'ip')),
  client_key text not null,
  request_count integer not null check (request_count > 0),
  primary key (bucket_start, scope, client_key)
);

alter table public.mentorship_waitlist_rate_limits enable row level security;
revoke all on public.mentorship_waitlist_rate_limits from anon, authenticated;
grant all on public.mentorship_waitlist_rate_limits to service_role;

create function public.consume_mentorship_waitlist_rate_limit(p_client_key text)
returns jsonb
language plpgsql security invoker set search_path = '' as $$
declare
  current_bucket timestamptz := date_trunc('hour', now());
  global_count integer;
  ip_count integer;
  retry_after integer;
begin
  if p_client_key !~ '^[0-9a-f]{64}$' then
    raise exception 'INVALID_RATE_LIMIT_KEY';
  end if;

  retry_after := greatest(1, ceil(extract(epoch from current_bucket + interval '1 hour' - now()))::integer);

  insert into public.mentorship_waitlist_rate_limits (bucket_start, scope, client_key, request_count)
    values (current_bucket, 'global', 'all', 1)
    on conflict (bucket_start, scope, client_key) do update
      set request_count = mentorship_waitlist_rate_limits.request_count + 1
    returning request_count into global_count;
  if global_count > 100 then
    return jsonb_build_object('allowed', false, 'retry_after_seconds', retry_after);
  end if;

  insert into public.mentorship_waitlist_rate_limits (bucket_start, scope, client_key, request_count)
    values (current_bucket, 'ip', p_client_key, 1)
    on conflict (bucket_start, scope, client_key) do update
      set request_count = mentorship_waitlist_rate_limits.request_count + 1
    returning request_count into ip_count;

  delete from public.mentorship_waitlist_rate_limits
    where bucket_start < current_bucket - interval '2 hours';

  return jsonb_build_object('allowed', ip_count <= 5, 'retry_after_seconds', retry_after);
end;
$$;

revoke execute on function public.consume_mentorship_waitlist_rate_limit(text) from public, anon, authenticated;
grant execute on function public.consume_mentorship_waitlist_rate_limit(text) to service_role;
