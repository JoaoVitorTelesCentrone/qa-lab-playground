# Gate de validação — QA Lab

Este registro acompanha `docs/PLANO_PROXIMO_NIVEL_2026-10-21.md` e `docs/MENTORIA_RUNBOOK.md`. O QA Lab tem **um único banco Supabase remoto**. O gate está **pendente** até haver ensaio no Supabase local, smoke controlado no remoto com contas de teste, checkout Mercado Pago sandbox e remetente de e-mail verificado. Não usar projetos de outros produtos como substitutos. Uma prévia Vercel conectada ao banco remoto compartilha dados de produção e não constitui staging isolado.

## Fase 1 — execução local em 2026-10-30

O ensaio isolado foi repetido para o candidato atual usando o projeto Supabase local `qa-lab-mentorship-tests` (API `127.0.0.1:58421`, banco `127.0.0.1:58422`). O executor confirmou o destino local antes de aplicar migrações. Nesta execução, aplicou as duas migrações que faltavam no banco local:

- `20261026165638_student_test_board.sql`
- `20261028090000_portfolio_more_appearances.sql`

As 50 verificações pgTAP passaram, o build de produção e o TypeScript passaram, e os 9 cenários E2E passaram. A primeira repetição encontrou que o middleware tratava `/mentoria` como rota privada inteira, redirecionando visitantes da landing e de certificados públicos ao login. A regra foi corrigida em `packages/web/lib/auth/protected-routes.ts`: agora protege as áreas administrativas, de aluno, mentor e operação, preservando as rotas públicas. Os 9 E2E passaram após a correção.

**Status da Fase 1:** ensaio local aprovado; gate remoto pendente. O CLI Supabase autenticado acessa o projeto correto e confirma migrations pendentes, mas ainda faltam o smoke remoto e os provedores reais. Nenhuma migration remota foi aplicada.

## Validação local da mentoria

**Atualização da mentoria:** o ensaio local automatizado da v2 foi concluído: nove E2E, 50 verificações pgTAP, build e TypeScript aprovados. Veja `VALIDACAO_PRIORIDADES_ALTAS_PRIMEIRA_TURMA.md`. Os provedores de pagamento e e-mail foram simulados somente na borda externa. Isso não aprova o smoke no remoto nem os provedores reais; as linhas de execução remota abaixo continuam pendentes. Incluir no candidato as migrações `20261025023653_mentorship_notification_outbox_atomic.sql` e `20261025023740_evidence_upload_owner_parameter.sql` após suas dependências.

## Liberação independente do portfólio

O portfólio pode ser validado antes de checkout e e-mail. Seu gate está **pendente**: faltam evidências do ensaio das migrações no Supabase local e do smoke no único remoto com duas contas. Um build local não substitui essa validação.

1. Fixar o commit candidato e o project ref do único Supabase remoto. Conferir seu histórico antes de executar SQL. Ensaiar no Supabase local, nesta ordem, `20261023190624_portfolio_case_builder.sql`, `20261023192027_portfolio_projects.sql`, `20261023193221_portfolio_featured_work.sql`, `20261023193556_portfolio_project_media.sql`, `20261023195000_portfolio_project_order.sql` e `20261023214640_evidence_upload_quota.sql`. A última migration deve entrar junto com o código que emite reservas; aplicada sozinha, bloqueia novos uploads.
2. Rodar os testes locais e o build. No ambiente local, usar aluno A, aluno B e visitante: salvar case, publicar, editar rascunho, republicar, criar projeto, vincular case, ordenar, subir JPG/WebP e MP4/WebM, escolher capa, privatizar mídia e despublicar projeto/portfólio. Conferir as respostas HTTP e as permissões no banco e Storage.
3. No ambiente local, testar limites: imagem acima de 3 MB após otimização, quinto arquivo, mais de 20 MB por projeto, tipo inválido e tentativa de acesso cruzado. No deploy candidato, repetir upload de vídeo de 10 MB em conexão lenta e confirmar que o arquivo vai do navegador ao Supabase Storage sem atravessar a função da Vercel. Verificar falha de upload, nova tentativa pelo usuário e faxina de arquivo enviado sem finalização. Se vídeos acima de 6 MB falharem ou demorarem demais, trocar o envio padrão por upload retomável TUS antes da liberação.
4. Conferir os avisos de segurança e desempenho do Supabase. Registrar resultado por cenário, commit, migrations, URL e evidências. Após backup, aplicar as migrações ensaiadas ao único remoto, configurar variáveis e publicar o mesmo commit. Repetir nele apenas o smoke necessário com contas descartáveis antes de abrir acesso real.
5. Após o deploy, executar smoke com uma conta descartável e acompanhar erros, Storage e tráfego. Se o código falhar, voltar ao deploy anterior; mudanças de banco exigem migração corretiva revisada e backup, não reversão cega.

**Controle de consumo:** a migration de quota exige uma reserva emitida pelo servidor para o caminho exato, válida por 30 minutos. O banco limita a conta a 100 MB ou 200 objetos, 5 reservas simultâneas e 30 reservas ou 150 MB a cada 24 horas. A policy compara o tamanho real do objeto com a reserva. Validar no Supabase local: upload normal de Lab, mentoria e portfólio; chamada direta ao Storage sem reserva, com caminho de outra conta, tamanho maior que o reservado e reserva expirada; limites concorrentes e faxina de órfãos. No remoto, confirmar o caminho de upload normal e isolamento com contas descartáveis. Consultar `storage.objects` e `app_private.evidence_upload_intents` para conferir os resultados sem editar metadados do Storage. A faxina de órfãos continua necessária.

**Critério de liberação do portfólio:** jornadas aprovadas no ambiente local e smoke remoto registrado, nenhum acesso cruzado, nenhum arquivo privado exposto em nova visita e upload de vídeo de 10 MB concluído no deploy. Um link assinado já compartilhado pode continuar funcionando até expirar, e o cache pode prolongar a disponibilidade; verificar e registrar esse prazo antes de prometer revogação imediata. Se a regra de negócio exigir revogação imediata, implementar entrega de mídia com checagem de autorização por requisição antes da abertura pública. Checkout e e-mail permanecem sob o gate próprio da mentoria.

## Identificação da execução

| Campo | Valor |
| --- | --- |
| Responsável pela execução | A definir |
| URL da aplicação local e do deploy candidato | A definir |
| Supabase project ref remoto | `hyrkebdxqoxijgxxkxrg` (CLI verificado em 30/10/2026) |
| Supabase local | A definir; registrar versão e data do ensaio |
| Commit implantado | A definir |
| Migrations aplicadas | A definir; incluir `20261021222551_mentorship_waitlist_attribution.sql` e `20261021233458_mentorship_order_attribution.sql` |
| Contas aluno, mentor, admin | A definir; guardar credenciais em cofre, nunca neste arquivo |
| Data, navegador, viewport | A definir |

## Verificações automáticas

Execute a partir de `packages/web`, com variáveis locais apontando para o Supabase local durante o ensaio. O readiness remoto deve ser executado separadamente, com o project ref conferido:

```powershell
bun run mentorship:readiness
bun run test:e2e
bunx supabase test db
```

O primeiro comando confere Auth, service role, tabelas, colunas de atribuição, RLS básico, e-mail e rotas. O E2E autenticado requer as variáveis descritas no runbook; sem elas, apenas os cenários públicos rodam. Execute pgTAP somente no banco local, nunca no remoto. Registre comando, saída, data e commit; não cole segredos nos logs.

## Matriz de jornadas

Para cada linha, anexe link privado para captura, log ou ID verificável. Preencha resultado como `aprovado`, `falhou` ou `não executado`; uma linha sem evidência continua pendente.

| Jornada | Perfil | Evidência mínima | Resultado |
| --- | --- | --- | --- |
| Landing → desafio → cadastro | Visitante/aluno | URL, viewport móvel e desktop, redirecionamento após cadastro | Não executado |
| Entrega de Lab → case editável → publicação | Aluno/visitante | Rascunho privado, snapshot público, URL do case e republicação sem vazamento do rascunho | Não executado |
| Projeto autoral → capa, mídia e ordenação | Aluno/visitante | Upload direto ao Storage de imagem e vídeo de até 10 MB, capa pública, ordem salva e página pública correta | Não executado |
| Privacidade de projeto e mídia | Aluno A/aluno B/visitante | Projeto despublicado retorna 404; mídia privada não recebe URL pública; conta B não lê nem altera arquivos ou rascunhos de A | Não executado |
| Lista de interesse com UTM e consentimento | Visitante/admin | Lead no admin com origem; tentativas inválidas rejeitadas | Não executado |
| Oferta aberta → cadastro → checkout sandbox | Aluno | Reserva, origem UTM no pedido, preferência sandbox | Não executado |
| Pagamento aprovado → matrícula | Aluno/admin | Pedido, webhook e matrícula da turma correta | Não executado |
| Pagamento pendente/recusado/repetido/reembolsado | Aluno/admin | Um registro por evento de conciliação; sem acesso indevido nem vaga dupla | Não executado |
| Capacidade esgotada e acesso cruzado | Dois alunos/turmas | Rejeição da vaga excedente e leitura negada de dados alheios | Não executado |
| Diagnóstico → entrega → pedido de ajuste → reenvio | Aluno/mentor | IDs de submissão e revisão, arquivo acessível somente aos autorizados | Não executado |
| Revisão aprovada → certificado/portfólio | Mentor/aluno | Estado final, URL pública autorizada, certificado conforme regras | Não executado |
| E-mail e cron repetido | Admin | Outbox, recebimento de teste, ausência de duplicatas | Não executado |
| Teclado, zoom e 390 px | Visitante/aluno/mentor | Foco, mensagens de erro, ausência de rolagem horizontal inesperada | Não executado |

**Decisão do gate:** bloquear abertura da turma enquanto qualquer jornada crítica estiver sem evidência, houver P0/P1 aberto, matrícula indevida ou exposição de dados. O piloto de duas semanas e as sessões observadas exigem participantes reais; registrar seus resultados depois da execução, sem inferi-los dos testes de código.

**Corre��o de acesso remoto (30/10/2026):** a integra��o MCP nega acesso, mas o CLI Supabase autenticado lista e consulta o projeto QA Lab `hyrkebdxqoxijgxxkxrg`. O hist�rico remoto vai at� `20261026165638`; as migrations `20261028090000_portfolio_more_appearances.sql` e `20261030155830_profile_acquisition_attribution.sql` est�o pendentes. Foi consultado somente o schema e agregados de valida��o; nenhuma migration foi aplicada ao remoto.
