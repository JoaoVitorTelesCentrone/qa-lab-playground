# Runbook da Mentoria QA Lab

Este documento descreve a publicação e a validação da fase 6. O gate do piloto só passa depois de executar os cenários num projeto Supabase de staging com três perfis (aluno, mentor e admin), checkout em sandbox e nenhum P0/P1 aberto.

## Publicar em staging

1. Faça backup do banco de staging e aplique, em ordem, todas as migrations em `packages/web/supabase/migrations`, incluindo `0029_mentorship_hardening_email.sql`. A aplicação depende do trigger `touch_mentorship_updated_at` da migration 0024.
2. Configure as variáveis de ambiente do app: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_SITE_URL`, `MENTORSHIP_EMAIL_ENABLED`, `MENTORSHIP_FROM_EMAIL`, `RESEND_API_KEY` e `CRON_SECRET`.
3. Configure `MENTORSHIP_EMAIL_ENABLED=true` somente após verificar o domínio remetente no Resend. Gere um `CRON_SECRET` forte e configure o mesmo valor na Vercel. O cron está agendado diariamente; dispare o endpoint uma vez com o header `Authorization: Bearer <CRON_SECRET>` para validar o processamento controlado.
4. Confirme que o e-mail de staging usa remetente e destinatários autorizados. O worker não envia nada enquanto a flag de e-mail estiver desabilitada ou faltarem credenciais.
5. Para o fluxo mutante, crie um aluno de staging descartável ainda sem tentativas na semana escolhida, associe o mentor à turma e configure `MENTORSHIP_E2E_STUDENT_EMAIL/PASSWORD/ID`, `MENTORSHIP_E2E_MENTOR_EMAIL/PASSWORD`, `MENTORSHIP_E2E_ADMIN_EMAIL/PASSWORD`, `MENTORSHIP_E2E_COHORT_ID` e `MENTORSHIP_E2E_WEEK`. Habilite `MENTORSHIP_E2E_MUTATIONS_ENABLED=true` apenas no ambiente local seguro apontado para staging. O teste cria matrícula e entrega; use uma conta nova para repetir a jornada.

## Validação automatizada

Na pasta `packages/web`:

```powershell
bun run test:e2e
```

Os testes sem credenciais cobrem a página pública e o redirecionamento da área autenticada em viewport mobile. A jornada mutante usa admin, aluno e mentor para matricular, enviar PDF, pedir ajustes, reenviar e aprovar. Configure também `MENTORSHIP_E2E_STUDENT_USERNAME` e uma entrega final já aprovada para validar a publicação pública do portfólio.

O smoke da admissão cobre a página pública mobile e impede que visitantes anônimos criem inscrição ou checkout. Para a jornada mutante de admissão, configure `MENTORSHIP_ADMISSION_E2E_ENABLED=true`, `MENTORSHIP_ADMISSION_E2E_STUDENT_EMAIL/PASSWORD`, `MENTORSHIP_ADMISSION_E2E_COHORT_ID` e `MENTORSHIP_E2E_ADMIN_EMAIL/PASSWORD` em staging. Use aluno novo e turma aberta: o teste cria solicitação e bolsa, confirma a matrícula e verifica acesso ao diagnóstico. O checkout do Mercado Pago da mentoria precisa ainda de compra sandbox e webhook validados manualmente. O teste `QA_E2E_CHECKOUT_ENABLED=true` cobre apenas a preferência do QA Lab Pro.

Para rodar apenas os cenários mutantes: `bun run test:e2e -- tests/e2e/mentorship-journey.e2e.ts`.

Execute as verificações SQL de permissões num banco de teste Supabase com pgTAP disponível:

```powershell
supabase test db
```

`packages/web/supabase/tests/mentorship_hardening.test.sql` valida RLS ativo, privilégio restrito de `read_at` e acesso fechado ao outbox. `payment_reconciliation.test.sql` valida reembolso, eventos tardios, capacidade e privilégios de compra/perfil. Não execute esses testes apontando para produção.

## Roteiro manual do piloto (3 perfis)

| Perfil | Jornada e evidência esperada |
| --- | --- |
| Aluno | Abrir checkout do Mercado Pago em sandbox; concluir pagamento de teste; confirmar matrícula/turma; entrar no painel; enviar uma entrega com arquivo; reenviar após pedido de ajustes; marcar aula concluída; publicar um caso no portfólio. |
| Mentor | Entrar na fila da turma; abrir a entrega do aluno; registrar feedback e pedir ajuste; confirmar presença em sessão; conferir que itens de outra turma não aparecem. |
| Admin | Criar turma e matrícula de staging; abrir painel de métricas; conferir alunos ativos, progresso de entrega/aula, presença, reviews acima de 72h e fila de e-mail; publicar sessão futura. |

Para notificação, agende uma sessão em até 36 horas e mantenha uma entrega em revisão por mais de 48 horas. Execute o endpoint de cron, confira notificação interna/outbox e recebimento no inbox de teste; repita o cron e confirme que não cria duplicatas. Inspecione no provedor o resultado de entrega e, em seguida, valide a fila de falhas com um endereço inválido controlado.

Em desktop e em 390 px de largura, percorra página pública, login, painel, formulário de entrega e portfólio. Navegue os formulários por teclado, confirme foco visível, rótulos acessíveis, mensagens de erro anunciadas e ausência de rolagem horizontal da página. Tabelas podem rolar horizontalmente dentro do próprio painel.

## Gate, suporte e recuperação

- Registre URL, commit, migration aplicada, navegador/dispositivo, perfil, passos, resultado e evidência para cada cenário.
- Gate passa apenas com três perfis exercitados, checkout em sandbox, matrícula, upload, revisão, portfólio e sessão verificados, e nenhum P0/P1 em aberto. O smoke E2E não substitui essa execução manual.
- Em falha de e-mail, mantenha `MENTORSHIP_EMAIL_ENABLED=false`, verifique remetente, segredo do cron e fila `queued/failed`, corrija configuração e dispare novamente. Jobs têm retentativa e deduplicação; preserve `last_error` ao abrir incidente.
- Em incidente de acesso/dados, pause a abertura da turma, preserve logs e evidências, revogue sessões/credenciais afetadas e siga o processo de restauração do projeto Supabase. Não altere linhas de outbox ou notificações diretamente para contornar RLS.
- Suporte coleta user ID, turma, horário UTC, URL e ID da entrega; nunca pede senha, token de sessão ou chave de serviço.

## Resultado atual

O código e os artefatos de validação da fase 6 estão preparados. O gate de staging permanece pendente até serem fornecidos um projeto de staging, credenciais de três perfis, configuração do Mercado Pago sandbox e remetente de e-mail verificado.
