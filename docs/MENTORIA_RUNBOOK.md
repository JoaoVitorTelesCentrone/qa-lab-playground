# Runbook da Mentoria QA Lab

O QA Lab tem um único Supabase remoto. O ensaio automatizado usa um Supabase local isolado; uma prévia da Vercel conectada ao remoto compartilha seus dados e não é staging isolado.

## Ensaio local obrigatório da v2

Requisitos: Bun, Docker em execução e Chromium do Playwright instalado. Na pasta `packages/web`:

```powershell
bunx playwright install chromium
bun run test:e2e:mentorship
```

O executor:

- prepara `.tmp/mentorship-local` com o catálogo atual de migrações e o projeto `qa-lab-mentorship-tests`;
- usa API em `127.0.0.1:58421`, banco em `127.0.0.1:58422` e aplicação em `127.0.0.1:3180`;
- substitui explicitamente o `SUPABASE_PROJECT_ID` remoto que Bun pode carregar de `.env.local`;
- aplica migrações locais pendentes, executa pgTAP, faz build e inicia a aplicação com variáveis locais;
- cria contas e turmas descartáveis por teste para aluno, colega, mentor, mentor de outra turma e admin;
- testa diagnóstico, progresso, upload real, revisão, ajuste, reenvio, materiais, encontros, replays, privacidade, matrícula, case e certificado;
- usa provedores HTTP locais para Mercado Pago e Resend. Auth, banco, Storage, rotas, assinatura do webhook e conciliação são reais no ambiente local;
- falha se o ambiente obrigatório estiver ausente. Nenhum desses cenários é aceito como ignorado no job de CI.

Não aponta esse executor ao remoto. Os provedores de teste também recusam uso com um Supabase remoto. O teste de pagamento local não substitui uma compra sandbox no provedor real; o teste de e-mail local não comprova entrega em uma caixa postal externa.

Para repetir sem reconstruir um build local já válido: `bun run test:e2e:mentorship -- --running --no-build`. Reconstrua após mudar código da aplicação. A suíte pública continua em `bun run test:e2e:smoke`; os smoke tests autenticados antigos por credencial são opcionais e não substituem a suíte local obrigatória.

O workflow `quality.yml` possui um job separado para a mentoria. Em falha, publica traces e capturas como artefato de sete dias.

## Preparar a publicação

1. Fixe o commit candidato e confira o histórico do único remoto. Compare as duas árvores históricas de migrações; não aplique SQL pela simples existência de um arquivo.
2. Faça backup. Execute o ensaio local antes de alterar o remoto.
3. Inclua as migrações necessárias ao candidato, especialmente:
   - `0024_mentorship_core.sql`, `0029_mentorship_hardening_email.sql` e as migrações de admissão, conciliação e atribuição;
   - as migrações do portfólio e quota usadas pela versão publicada;
   - `20261025023653_mentorship_notification_outbox_atomic.sql`: grava notificação e outbox na mesma transação;
   - `20261025023740_evidence_upload_owner_parameter.sql`: corrige o parâmetro de dono na reserva de uploads.
4. Configure Auth, URLs de retorno, bucket privado e variáveis: Supabase público e service role, `NEXT_PUBLIC_SITE_URL`, credenciais do Mercado Pago, Resend e `CRON_SECRET`. Segredos ficam somente no servidor.
5. Publique o mesmo candidato validado e faça smoke controlado com contas de teste no remoto. Registre evidências em `STAGING_GATE_QA_LAB.md`.

A notificação possui um fallback idempotente no código para a gravação da outbox. A garantia de atomicidade depende da nova migração; não marque esse requisito como liberado no remoto sem conferir sua aplicação.

## E-mail: envio por evento, recuperação e alertas

Após persistir uma notificação, a aplicação processa a fila do destinatário usando `after()`. O processamento respeita um orçamento de tempo; mensagens restantes permanecem duráveis. Há claim por mensagem, chave idempotente no provedor, recuperação de locks antigos, retentativas e tratamento de falhas transitórias de Auth.

O endpoint `/api/cron/mentorship-emails` gera lembretes, processa até 100 candidatos por execução e informa saúde da fila. O painel admin mostra mensagens aguardando, idade da mais antiga, atrasos acima de 15 minutos e falhas definitivas. Worker desabilitado, atraso ou falha definitiva fazem o cron retornar 503 para sinalizar o problema ao agendador.

O cron diário da Vercel permanece como contingência. Para recuperação frequente, habilite o workflow `mentorship-emails.yml` no GitHub:

| Configuração do repositório | Valor |
| --- | --- |
| Variable `MENTORSHIP_EMAIL_WORKER_ENABLED` | `true` depois de configurar o endpoint |
| Variable `MENTORSHIP_EMAIL_CRON_URL` | URL HTTPS publicada terminando em `/api/cron/mentorship-emails` |
| Secret `MENTORSHIP_CRON_SECRET` | Mesmo segredo de `CRON_SECRET` na aplicação |

O workflow solicita execução a cada cinco minutos, com exclusão de concorrência e falha visível. Agendamentos do GitHub podem atrasar; não prometa um horário exato de entrega. Uma instalação com agendador próprio pode chamar o mesmo endpoint autenticado. O limite diário do Vercel Hobby impede simplesmente trocar seu cron por frequência de minutos nesse plano. [Documentação de frequência dos crons](https://vercel.com/docs/cron-jobs/usage-and-pricing).

Antes de ativar `MENTORSHIP_EMAIL_ENABLED=true`, verifique o remetente no Resend e receba uma mensagem em uma caixa de teste autorizada. Primeiro valide uma confirmação e um feedback; depois repita o processamento e confirme ausência de duplicatas. Em falha, preserve `last_error`, investigue a fila e corrija a configuração. Não apague mensagens pendentes para esconder o alerta.

## Ensaio manual com integrações reais

| Perfil | Jornada |
| --- | --- |
| Aluno | Oferta → cadastro/retorno → pagamento sandbox → matrícula na turma correta → diagnóstico → capítulo → anexo → envio → ajuste → reenvio → aprovação |
| Mentor | Fila da própria turma → rubrica → feedback → revisão do reenvio → encontro/presença; outra turma permanece inacessível |
| Admin | Oferta/turma → confirmação de acesso → agenda → material/replay → métricas → saúde da fila |
| Visitante | Case publicado aparece; rascunho e case despublicado não aparecem; materiais restritos e arquivos privados não são expostos |

No Mercado Pago real, confira aprovado, pendente, recusado, webhook repetido, reembolso, pagamento tardio e capacidade da última vaga. Compra Pro não comprova compra da mentoria. Valide o recebedor e os valores pelo servidor; retorno do navegador não concede matrícula.

Na v2, use `/mentoria/encontros` para pauta, agenda, compromissos e replay. Confirme que expiração remove o link da resposta da aplicação. Revogação de um link que já foi copiado depende também das regras do provedor de vídeo.

Em 390 px e desktop, use teclado, foco visível, zoom, mensagens de erro, envio/reenvio e materiais. Confirme que o aluno concluinte consulta o histórico sem controles de nova entrega. A conclusão exige 40 aulas, 48 práticas e 12 entregas aprovadas; o case final exige as onze aprovações anteriores.

## Suporte e recuperação

- Registre URL, commit, migrações, perfil, horário, cenário e evidência.
- Em incidente de acesso, preserve logs e suspenda a abertura. Não contorne regras com edição manual de permissões.
- Em falha de deploy, retorne ao candidato anterior compatível. Mudanças de banco exigem correção revisada e backup, não reversão cega.
- Suporte coleta user ID, turma, URL e ID da entrega. Nunca solicita senha, token ou service role.
- Oferta, agenda, produção dos vídeos e prazo de atendimento precisam estar definidos antes da venda.

## Operação da turma fundadora

Use `docs/PILOTO_TURMA_FUNDADORA.md` para conferir a publicação, nomear responsáveis e registrar as duas primeiras semanas. A publicação agora bloqueia ofertas sem formato, ritmo/horários, política de gravação, prazo de resposta do suporte e resultado esperado. A turma fundadora também fica limitada a 20 vagas na validação da oferta. Não preencha esses dados com valores de exemplo.

As mensagens internas e por e-mail de confirmação, espera e recusa têm próximos passos diferentes. Confirme o remetente com uma caixa autorizada antes de habilitar envio no ambiente publicado. Alertas de revisão existentes começam antes do SLA de 72 horas; a fila do mentor exibe itens próximos do prazo e vencidos.

A liberação pública continua condicionada à validação do remoto e dos provedores reais; resultados locais demonstram a implementação e suas integrações locais.
