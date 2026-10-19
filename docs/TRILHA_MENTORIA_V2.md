# Mentoria por módulos (v2)

A nova trilha usa o catálogo versionado em `packages/web/lib/mentorship/path-v2.ts`.
Ela possui 7 módulos, 28 capítulos, 40 aulas, 48 práticas autodeclaradas e 12 entregas avaliadas. Os números são consequência do mapa editorial; capítulos e módulos não exigem uma quantidade fixa de itens.

## Como o aluno avança

1. `/conteudo` mostra os módulos; `/conteudo/modulos/[module]` mostra os capítulos.
2. Cada capítulo apresenta teoria curta, aprofundamento opcional, prática com resultado esperado e, em alguns casos, entrega ao mentor.
3. Aulas e práticas usam chaves distintas em `mentorship_lesson_progress`. Uma prática marcada como feita é autodeclarada; apenas as 12 entregas passam por revisão humana.
4. Um módulo está completo quando todas as suas aulas e práticas estão registradas e suas entregas foram aprovadas.
5. O case final só pode ser enviado após as 11 entregas anteriores serem aprovadas. O certificado exige 40 aulas, 48 práticas e 12 entregas aprovadas na v2.

## Compatibilidade

`mentorship_cohorts.program_version` já existia. Turmas anteriores continuam em `v1`; turmas criadas pelo painel a partir desta mudança recebem `v2`. O progresso antigo mantém as mesmas chaves e critérios de certificado. Não há migração automática nem perda de histórico. Os 12 encontros e compromissos continuam atrelados ao calendário, separadamente do número de capítulos.

As 36 aulas existentes foram redistribuídas sem trocar suas chaves. Quatro aulas novas têm chaves `mentoria.v2.*`. Vídeos e materiais podem ser publicados no painel administrativo; enquanto não houver vídeo, a aula textual continua disponível. Postman/Bruno, k6, acessibilidade e os demais labs continuam locais. Evidências obtidas nesses labs não devem ser apresentadas como validação do ambiente de produção do Broto Space.

## Ao alterar o currículo

- Mantenha as chaves existentes estáveis para preservar progresso e certificados.
- Acrescente exercícios apenas quando exigirem uma decisão ou resultado diferente; não replique instruções para atingir um número.
- Atualize o teste `path-v2.test.ts` quando uma nova versão editorial mudar os totais.
- Para mudanças que removam ou troquem critérios de conclusão, crie uma nova `program_version` e mantenha a versão anterior disponível para suas turmas.
