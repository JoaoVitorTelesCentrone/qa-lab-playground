-- Evidência livre: um campo só, com anexos de verdade.
--
-- Antes a entrega era result + reproduction + severity + checklist, quatro
-- campos estruturados. Agora é um texto livre (`evidence`) mais arquivos no
-- Storage. O conteúdo antigo não é jogado fora: o backfill abaixo concatena os
-- quatro campos dentro de `evidence` ANTES de removê-los, então nenhuma
-- evidência já entregue se perde.
--
-- Ver docs/PRODUCTIZATION_PLAN.md. Substitui o que a 0005 criou: o checklist
-- de criterios deixa de existir como campo.
--
-- Idempotente: pode rodar mais de uma vez.

-- ============================================================
-- 1. Coluna nova
-- ============================================================
alter table public.lab_submissions
  add column if not exists evidence text not null default '';

-- ============================================================
-- 2. Backfill do que já foi entregue
--
-- Só mexe em linhas ainda não migradas (evidence vazio) e só quando as colunas
-- antigas ainda existem — é o que torna o script repetível.
-- ============================================================
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'lab_submissions' and column_name = 'result'
  ) then
    execute $backfill$
      update public.lab_submissions set evidence = trim(both from concat_ws(
        E'\n\n',
        nullif(concat('Resultado obtido: ', result), 'Resultado obtido: '),
        case when coalesce(reproduction, '') = '' then null
             else concat(E'Passos de reprodução:\n', reproduction) end,
        case when coalesce(severity, '') = '' then null
             else concat('Severidade: ', severity) end,
        case when coalesce(jsonb_array_length(checklist), 0) = 0 then null
             else concat(E'Critérios confirmados:\n', (
               select string_agg(concat('- ', value #>> '{}'), E'\n')
               from jsonb_array_elements(checklist) as value
             )) end
      ))
      where coalesce(evidence, '') = ''
    $backfill$;
  end if;
end $$;

-- ============================================================
-- 3. Fora as colunas antigas
--
-- O conteúdo delas já está em `evidence` pelo passo 2.
-- ============================================================
alter table public.lab_submissions
  drop column if exists result,
  drop column if exists reproduction,
  drop column if exists severity,
  drop column if exists checklist;

-- Evidência vazia não é entrega: o Lab só fecha com algo escrito ou anexado.
alter table public.lab_submissions
  drop constraint if exists lab_submissions_evidence_len;
alter table public.lab_submissions
  add constraint lab_submissions_evidence_len check (char_length(evidence) <= 20000);

-- ============================================================
-- 4. Bucket dos anexos
--
-- Leitura pública, escrita só do dono. O portfólio publicado é aberto e é
-- anônimo quem abre o link do case, então um bucket privado exigiria assinar
-- URL em toda renderização pública. O caminho do arquivo carrega um uuid
-- aleatório e `select` no bucket não lista nada — a URL não é adivinhável nem
-- enumerável, mas quem tiver o link acessa. É a mesma troca do portfólio.
-- ============================================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'lab-evidence', 'lab-evidence', true, 10485760,
  array['image/png','image/jpeg','image/gif','image/webp','video/mp4','video/webm','application/pdf']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Cada aluno só escreve dentro da própria pasta: o primeiro segmento do
-- caminho tem que ser o id dele.
drop policy if exists "evidencia: leitura publica" on storage.objects;
create policy "evidencia: leitura publica" on storage.objects
  for select using (bucket_id = 'lab-evidence');

drop policy if exists "evidencia: dono escreve" on storage.objects;
create policy "evidencia: dono escreve" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'lab-evidence' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "evidencia: dono apaga" on storage.objects;
create policy "evidencia: dono apaga" on storage.objects
  for delete to authenticated
  using (bucket_id = 'lab-evidence' and (storage.foldername(name))[1] = auth.uid()::text);
