# Correções de prioridade alta — primeira turma

Referência: `ANALISE_PRIMEIRA_TURMA_2026-10-24.md`.

Resultado: I1–I5 implementados e validados no ambiente local isolado. A publicação no único Supabase remoto, a ativação do agendador externo e a validação dos provedores reais continuam como etapas de operação. Este registro não libera automaticamente a venda.

## Entregas

| Item | Correção | Evidência |
| --- | --- | --- |
| I1 — Encontros e gravações | `/mentoria/encontros` reúne agenda, pauta, replay e compromisso. Painel e navegação levam à área; notificações apontam ao encontro correto. Links vencidos são removidos no servidor. | E2E com sessão futura, replay válido, replay expirado, outra turma, compromisso salvo e cron repetido; capturas em 390 e 1440 px |
| I2 — Materiais | Capítulos v2 exibem os materiais publicados pelo admin; rascunhos e agendamentos futuros permanecem restritos. | E2E de publicado, rascunho, agendamento futuro/liberado e visitante |
| I3 — Comunicação | Envio por evento via `after()`, fila com claim e retentativas, até 100 candidatos por execução dentro do orçamento, gravação atômica e saúde no painel. Workflow de recuperação frequente preparado. | E2E prova e-mail enviado após feedback sem cron diário; teste de 40 avisos, sobreposição de workers, retentativa, orçamento e falha transitória de Auth; SQL de atomicidade |
| I4 — Jornada v2 | Suíte reproduzível com aluno, colega, mentor, mentor de outra turma e admin; job próprio no CI exige ambiente local. Catálogo público atualizado para sete módulos. | Nove E2E aprovados, nenhum ignorado na seleção obrigatória |
| I5 — Isolamento e conclusão | Anexo exige matrícula ativa, arquivo existente e caminho da conta/entrega. Rascunhos, sessões, entregas e arquivos são verificados entre papéis. Certificado e case final têm seus requisitos exercitados nas APIs reais. | pgTAP e E2E negam leitura/escrita direta, troca de matrícula, arquivo alheio/inexistente, caminho com travessia, upload sem reserva, mentor de outra turma e staff desativado |

Também foram corrigidos controles de nova entrega para alunos concluintes, links de feedback v2 e informação dos requisitos do certificado.

## Bloqueio adicional descoberto durante a execução

O upload real falhava com `column reference "owner_id" is ambiguous`: a tabela `storage.objects` também possui `owner_id`. A migração corretiva qualifica o argumento da função de reserva. O mesmo percurso foi repetido com upload, leitura autorizada, reenvio e rejeição entre contas.

O Storage local retorna 400 para arquivo inexistente em seu endpoint HEAD. Essa ausência agora é tratada como evidência inválida; falhas de autorização e indisponibilidade continuam sendo erros. O teste verifica rejeição do ponteiro inexistente sem gravá-lo na entrega.

## Execuções aprovadas

Base Git: `4a1888c`, acrescida das alterações do workspace. Não foi criado commit ou deploy nesta tarefa.

| Verificação | Resultado |
| --- | --- |
| `bun test packages/web` | 311 testes, 50 arquivos, 5.513 assertions; zero falhas |
| `bun run lint` | Zero erros; sete avisos existentes fora das correções |
| `bunx tsc --noEmit --project packages/web/tsconfig.json` | Aprovado |
| Build de produção com variáveis locais | Aprovado |
| Executor `bun scripts/test-mentorship-local.ts --running` e repetição `--running --no-build` | Nove E2E aprovados em Chromium; nenhum ignorado na seleção obrigatória |
| pgTAP, três arquivos | 50 verificações aprovadas |
| Supabase advisors local, segurança, nível error | Nenhum problema encontrado nesse nível |
| `git diff --check` | Aprovado |
| Revisão visual | Encontros em 390 e 1440 px sem rolagem horizontal; capturas inspecionadas |

A suíte demonstrou falhas reais antes das correções, incluindo erro SQL na reserva de upload e bloqueio de anexos inexistentes; não depende de mocks do banco, Auth ou Storage. O provedor de pagamento e o de e-mail são substituídos somente na borda HTTP, com trava que recusa um banco remoto.

## Migrações desta tarefa

1. `20261025023653_mentorship_notification_outbox_atomic.sql` — trigger privado grava notificação e mensagem de e-mail na mesma transação.
2. `20261025023740_evidence_upload_owner_parameter.sql` — corrige a ambiguidade da reserva de upload.

Ambas foram aplicadas e testadas somente no Supabase local. A segunda depende da migração anterior de quotas, `20261023214640_evidence_upload_quota.sql`. Compare o histórico remoto antes de aplicar qualquer arquivo; preserve a ordem das dependências do candidato.

## O que precisa acontecer no ambiente publicado

- Conferir e aplicar as migrações no único projeto remoto, com backup, e publicar o código correspondente.
- Configurar e verificar remetente/credenciais do Resend; receber confirmação e feedback em caixa externa de teste.
- Configurar as três entradas do workflow de recuperação descritas em `MENTORIA_RUNBOOK.md`; o cron diário da Vercel permanece como contingência.
- Executar compra sandbox no Mercado Pago real e smoke controlado com contas descartáveis no remoto. O teste local de conciliação não comprova credenciais, recebedor, webhook público ou checkout hospedado do provedor.
- Confirmar oferta, calendário, conteúdo inicial e responsáveis operacionais.

As credenciais de Mercado Pago/Resend e os resultados remotos não estavam disponíveis no ambiente desta implementação. Não houve envio de e-mail externo, compra real, alteração do remoto ou publicação.
