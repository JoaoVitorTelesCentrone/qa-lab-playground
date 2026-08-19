-- Anexos de evidência deixam de ser públicos.
--
-- A 0012 criou o bucket com leitura pública porque a página de case é aberta e
-- quem abre o link é anônimo. O efeito colateral era que o anexo de uma
-- evidência NÃO publicada também respondia para quem tivesse a URL — rascunho
-- do aluno acessível por link.
--
-- Agora o bucket é privado e a URL é assinada na hora de renderizar:
--   - superfícies privadas assinam com a sessão do próprio aluno (a policy de
--     select abaixo é o que autoriza);
--   - a página pública assina com a chave de serviço, e quem decide se pode é
--     o nosso código, que só chega lá depois de filtrar `published = true`.
--
-- Idempotente: pode rodar mais de uma vez.

update storage.buckets set public = false where id = 'lab-evidence';

-- Leitura deixa de ser de todo mundo e passa a ser só do dono. A página
-- pública não depende desta policy: ela assina com a chave de serviço.
drop policy if exists "evidencia: leitura publica" on storage.objects;
drop policy if exists "evidencia: dono le" on storage.objects;
create policy "evidencia: dono le" on storage.objects
  for select to authenticated
  using (bucket_id = 'lab-evidence' and (storage.foldername(name))[1] = auth.uid()::text);
