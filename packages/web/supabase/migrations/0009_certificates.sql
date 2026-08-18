-- Certificado de trilha: prova pública e verificável de um percurso concluído.
--
-- Regra de produto: certificado não atesta presença, atesta entrega. Só existe
-- linha aqui quando todos os Labs liberados da trilha já têm evidência aceita —
-- a verificação de elegibilidade vive em lib/product/certificate.ts e é
-- reexecutada no servidor antes do insert.
--
-- O nome do titular é gravado no momento da emissão, de propósito: o
-- certificado é um documento datado. Mudar o nome do perfil depois não reescreve
-- o que já foi emitido, e a página pública não precisa ler `profiles` (que só
-- abre com portfolio_public = true) para renderizar.
--
-- Idempotente: pode rodar mais de uma vez.

create table if not exists public.track_certificates (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  -- slug da trilha em lib/product/tracks.ts
  track_slug   text not null,
  -- Código verificável no formato QAL-XXXX-XXXX. É o que a pessoa cola no
  -- campo "ID da credencial" do LinkedIn.
  code         text not null unique,
  holder_name  text not null,
  labs_completed integer not null default 0,
  evidence_count integer not null default 0,
  issued_at    timestamptz not null default now(),
  -- Um certificado por trilha por pessoa: reemitir atualiza os números, não
  -- gera um segundo código (o link já compartilhado precisa continuar valendo).
  unique (user_id, track_slug)
);

create index if not exists track_certificates_user_idx
  on public.track_certificates (user_id, issued_at desc);

alter table public.track_certificates enable row level security;

drop policy if exists "own rows" on public.track_certificates;
create policy "own rows" on public.track_certificates
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ============================================================
-- Verificação pública por código
-- ============================================================
-- Sem policy de select para anônimo: quem tem o código lê aquele certificado e
-- só ele. Uma policy `using (true)` deixaria qualquer visitante listar todos os
-- certificados emitidos (e os nomes de quem os tirou), o que não é necessário
-- para verificar um link compartilhado.
create or replace function public.certificate_by_code(lookup_code text)
returns table (
  code text,
  track_slug text,
  holder_name text,
  labs_completed integer,
  evidence_count integer,
  issued_at timestamptz
)
language sql
security definer
set search_path = public
as $$
  select c.code, c.track_slug, c.holder_name, c.labs_completed, c.evidence_count, c.issued_at
  from public.track_certificates c
  where c.code = upper(trim(lookup_code))
  limit 1;
$$;

revoke all on function public.certificate_by_code(text) from public;
grant execute on function public.certificate_by_code(text) to anon, authenticated;
