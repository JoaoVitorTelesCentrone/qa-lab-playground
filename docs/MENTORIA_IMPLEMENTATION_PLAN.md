# Plano de implementacao da Mentoria QA Lab

Status: nucleo e fases 2-6 implementados localmente; gate de staging da fase 6 pendente  
Horizonte: MVP de turma fundadora + endurecimento para repeticao  
Produto alvo: `packages/web`

## Status de implementacao (primeira fatia)

Implementado neste ciclo:

- catalogo versionado das 12 semanas em `lib/mentorship/catalog.ts`;
- migration `0024_mentorship_core.sql` com turma, staff, matricula, aulas, sessoes, presenca, entregas, revisoes e compromissos;
- helpers server-side de sessao, staff, turma e matricula;
- APIs de diagnostico, progresso de aula, entrega, fila/revisao e administracao minima;
- publicacao administrativa do encontro ao vivo por turma e semana;
- publicacao opcional da gravacao do encontro e exibicao no painel do aluno;
- compromisso semanal do aluno ligado ao encontro ao vivo;
- registro de presenca e assistencia a gravacao restrito ao staff da turma;
- fila de revisao priorizada por SLA de 72 horas, com alertas visuais de vencimento;
- rubrica interativa com notas por criterio, feedback e transicao protegida de status;
- perfil individual do aluno dentro da turma, com historico de entregas, aulas e presencas;
- trilha inicial de carga k6 local com baseline, carga e pico protegidos por alvo;
- case final da semana 12 com publicacao voluntaria em pagina publica do portfolio;
- painel do mentor por turma com progresso, entregas e presencas;
- painel administrativo consolidado com turmas, alunos, entregas e encontros;
- conteudo textual completo das 12 semanas, com pratica guiada, checkpoints e referencias oficiais;
- variacoes iniciante/intermediario nas atividades e rubricas das trilhas tecnicas;
- semana 11 ligada ao laboratorio local de performance, com runner k6 que exige confirmacao e aceita somente loopback;
- projeto final da semana 12 com evidencias obrigatorias de manual, automacao, CI/CD e performance, validadas no servidor contra entregas aprovadas da propria matricula;
- materiais praticos de carreira para curriculo, LinkedIn, pitch e entrevista;
- dinamicas ao vivo ligadas a cenarios especificos do People Lab, com roteiro de preparacao e conversa em grupo;
- certificado verificavel da Mentoria, emitido somente apos 12 entregas aprovadas e todas as aulas concluidas;
- resumo do projeto final aprovado preservado no case voluntario do portfolio;
- notificacoes internas para revisoes, encontros ao vivo e gravacoes;
- janela de disponibilidade para gravacoes, com ocultacao server-side apos expiracao;
- landing publica, dashboard do aluno, diagnostico, pagina semanal, fila do mentor e revisao de entrega;
- navegacao publica e sitemap com a Mentoria;
- gate de administrador corrigido em `/lab/metricas`;
- testes do catalogo e regressao das metricas existentes.

Pendente antes de abrir a turma:

- criar os primeiros registros de staff/coorte e validar RLS com usuarios reais;
- aplicar e validar a migration `0028_mentorship_certificates.sql`;
- aplicar e verificar manualmente a migration `0026_mentorship_notifications.sql`;
- integrar videos das aulas e lembretes transacionais por e-mail;
- disponibilizar os links reais das aulas gravadas e validar o acesso com a turma piloto;
- executar os fluxos E2E autenticados da mentoria.

## 1. Resultado pretendido

Transformar o QA Lab atual em uma plataforma capaz de operar uma mentoria hibrida de 12 semanas para QAs iniciantes e intermediarios.

Ao final, o produto precisa sustentar este ciclo sem planilhas paralelas:

```text
matricula -> diagnostico -> semana tecnica -> pratica -> entrega
          -> revisao do mentor -> reenvio -> portfolio -> projeto final
```

O conteudo tecnico e assincrono e cobre testes manuais, automacao, CI/CD e carga. O encontro ao vivo semanal e dedicado a desenvolvimento pessoal e profissional.

### Definicao de pronto da mentoria

A primeira turma pode ser aberta quando:

1. Um aluno matriculado entra, faz o diagnostico e encontra uma unica proxima acao.
2. O aluno acessa as aulas da semana, abre a pratica, envia uma entrega e acompanha seu status.
3. Um mentor autorizado enxerga somente suas turmas, usa uma rubrica, devolve feedback e solicita reenvio.
4. O aluno recebe o feedback, reenvia e conclui a atividade sem apagar o historico.
5. Calendario, link, pauta e gravacao do encontro ficam visiveis apenas para a turma.
6. O projeto final gera um case publicavel no portfolio por escolha explicita do aluno.
7. Administracao, dados de outras contas e chaves privilegiadas nao ficam acessiveis a alunos.
8. O funil de ativacao, participacao, entrega e feedback pode ser medido por turma e semana.

## 2. Diagnostico do repositorio

### Base que deve ser reaproveitada

| Capacidade | Implementacao existente | Uso na mentoria |
| --- | --- | --- |
| Autenticacao | Supabase SSR, login, cadastro e recuperacao | Identidade de aluno e mentor |
| Progresso | `lab_enrollments`, `mission_progress`, `roadmap_attempts` | Evidencia tecnica que alimenta a jornada |
| Entregas | `lab_submissions`, anexos privados e API de submissions | Base para entregas ligadas a Labs |
| Portfolio | `/portfolio/[username]`, publicacao seletiva e exportacao | Cases finais do aluno |
| Certificados | `track_certificates` e verificacao publica | Certificado final verificavel |
| Pratica manual | ExpenseFlow, Financas, CRM, Agendamentos, Shop e Labs | Semanas 1 a 4 e projeto final |
| Automacao | `cypress-course.ts`, playgrounds e suite Playwright | Semanas 5 a 8 |
| CI/CD | `cicd-lab.ts` e `/trilhas/cicd` | Semanas 9 e 10 |
| Situacoes humanas | People Lab e catalogo de 200 situacoes | Dinamicas dos encontros ao vivo |
| Telemetria | `activity_events` e painel de metricas | Base a ser expandida para coortes |
| Pagamento | Mercado Pago, `billing_purchases`, plano Pro | Reaproveitar infraestrutura, sem misturar os direitos |

### Lacunas confirmadas

- Nao existe entidade de programa, turma ou matricula em mentoria.
- Nao existe papel seguro de mentor nem associacao mentor-turma.
- O atual `/lab/instrutor` controla bugs plantados da propria conta; nao revisa alunos.
- Nao existe aula gravada com progresso, calendario semanal ou liberacao por turma.
- Nao existe entrega da mentoria com rubrica, revisao humana, status e reenvio.
- Agenda e publicacao basica de encontros/gravacoes ja existem; falta presenca e endurecimento do acesso por turma.
- Nao existe diagnostico de entrada ou ramificacao iniciante/intermediario.
- Nao existe trilha pratica de carga/performance.
- `/perfil` redireciona para a home e a home publica atual nao funciona como dashboard do aluno.
- A navegacao publica atual esta reduzida ao ExpenseFlow Challenge.
- O catalogo tem documentos divergentes e `LAUNCH_ORDER` vazio no codigo; a fonte de verdade precisa ser decidida antes da turma.
- A rota `/lab/metricas` chama a leitura privilegiada sem validar o administrador na pagina.
- O modo instrutor atual tambem nao exige papel de staff; qualquer conta autenticada pode alterar os proprios bugs plantados.
- Nao ha testes de RLS no repositorio.

## 3. Decisoes de arquitetura

### 3.1 Separar catalogo educacional de operacao

No MVP, o programa de 12 semanas deve ser versionado em TypeScript:

```text
packages/web/lib/mentorship/
  catalog.ts          # semanas, aulas, objetivos e materiais
  competencies.ts     # competencias e niveis
  rubrics.ts          # criterios e pesos
  access.ts           # autorizacao de aluno, mentor e admin
  journey.ts          # calculo de proxima acao e risco de abandono
  metrics.ts          # funil e indicadores da turma
  types.ts
```

Isso segue o padrao ja usado nos catalogos de Labs e CI/CD. Nao construir CMS no piloto. O banco armazena a operacao: quem esta em qual turma, o que enviou, qual feedback recebeu, quando participou e quais aulas marcou como concluidas.

### 3.2 Nao transformar `profiles.plan` em matricula

`profiles.plan` representa o acesso Pro. A mentoria tem inicio, fim, turma, mentor e estados proprios. O acesso deve vir de `mentorship_enrollments`, nao de mais um valor em `plan`.

### 3.3 Todo acesso privilegiado passa pelo servidor

- Criar `requireUser()`, `requireCohortMember(cohortId)` e `requireStaff(role?)`.
- Papel de staff fica em tabela que o cliente nao pode alterar.
- Operacoes do mentor usam Route Handlers/Server Actions depois de validar sessao e vinculo com a turma.
- O cliente administrativo do Supabase nunca recebe token do usuario e nunca e importado por componente client.
- Nao usar `user_metadata` para autorizacao.
- Toda tabela exposta recebe RLS e `GRANT` explicito quando necessario.
- Criar testes pgTAP para dono, colega de turma sem permissao, mentor da turma, mentor de outra turma e anonimo.

### 3.4 Video e encontro ao vivo sao integracoes

- Video: Vimeo, Mux ou provedor equivalente com legenda; salvar apenas metadados e identificador no catalogo.
- Ao vivo: Google Meet ou Zoom; salvar link, pauta, horario e gravacao.
- Nao construir player de streaming ou videoconferencia.
- Links de gravacao devem exigir matricula ativa na turma.

### 3.5 Duas profundidades, uma jornada

Cada atividade tem `beginnerRequirements` e `intermediateRequirements`. O diagnostico recomenda um nivel, mas o aluno pode trocar com registro da decisao. Nao duplicar 12 semanas em duas trilhas independentes.

## 4. Modelo de dados proposto

Criar a migration com o CLI (`supabase migration new mentorship_core`) no momento da implementacao. O nome e a numeracao final nao devem ser inventados manualmente.

### Tabelas essenciais do MVP

#### `mentorship_staff`

- `user_id uuid primary key references auth.users`
- `role text check in ('mentor','admin')`
- `active boolean`
- `created_at timestamptz`

Sem escrita por `authenticated`. Administracao somente por fluxo server-side. Nao colocar papel de autorizacao em coluna editavel de `profiles`.

#### `mentorship_cohorts`

- `id uuid`
- `code text unique`
- `name text`
- `program_version text`
- `starts_on date`
- `ends_on date`
- `timezone text default 'America/Sao_Paulo'`
- `capacity integer`
- `status text: draft | enrollment | active | completed | archived`
- `created_by uuid`
- timestamps

#### `mentorship_cohort_staff`

- `cohort_id uuid`
- `staff_user_id uuid`
- `role text: lead | reviewer | facilitator`
- chave composta por turma e staff

#### `mentorship_enrollments`

- `id uuid`
- `cohort_id uuid`
- `user_id uuid`
- `status text: invited | active | paused | completed | cancelled`
- `level text: beginner | intermediate`
- `goal text`
- `diagnostic_score jsonb`
- `joined_at`, `completed_at`, timestamps
- unique `(cohort_id, user_id)`

#### `mentorship_lesson_progress`

- `enrollment_id uuid`
- `lesson_key text`
- `status text: started | completed`
- `completed_at`, `updated_at`
- chave composta por matricula e aula

Nao tentar inferir dominio apenas por segundos de video. A conclusao da aula ajuda a orientar, mas a entrega e a fonte principal de progresso.

#### `mentorship_live_sessions`

- `id uuid`
- `cohort_id uuid`
- `week_number smallint`
- `title`, `agenda`
- `starts_at`, `ends_at`
- `meeting_url`
- `recording_url nullable`
- `recording_available_until nullable`
- unique `(cohort_id, week_number)` no MVP

#### `mentorship_attendance`

- `session_id uuid`
- `enrollment_id uuid`
- `status text: present | absent | excused | watched_recording`
- `marked_by uuid`
- timestamps
- chave composta por sessao e matricula

#### `mentorship_submissions`

- `id uuid`
- `enrollment_id uuid`
- `assignment_key text`
- `attempt_number smallint`
- `level text`
- `content jsonb`
- `lab_submission_id uuid nullable`
- `repository_url`, `report_url` e `attachments jsonb`
- `status text: draft | submitted | in_review | changes_requested | approved`
- `submitted_at`, `reviewed_at`, timestamps
- unique `(enrollment_id, assignment_key, attempt_number)`

Nao sobrescrever tentativas. O historico e parte da evidencia de evolucao.

#### `mentorship_reviews`

- `id uuid`
- `submission_id uuid`
- `reviewer_id uuid`
- `rubric_version text`
- `scores jsonb`
- `strengths text`
- `improvements text`
- `next_action text`
- `decision text: changes_requested | approved`
- `created_at`

Revisoes sao append-only. Uma correcao posterior cria nova revisao ou nova tentativa; nao apaga a avaliacao anterior.

#### `mentorship_weekly_commitments`

- `id uuid`
- `enrollment_id uuid`
- `week_number smallint`
- `commitment text`
- `visibility text: private | mentor`
- `check_in text nullable`
- timestamps

Nao coletar diarios pessoais extensos. Guardar somente compromissos necessarios ao acompanhamento e respeitar a visibilidade escolhida.

### Fase posterior, fora do MVP

- comentarios em thread;
- grupos e pares de accountability;
- notificacoes configuraveis;
- banco de oportunidades;
- agenda de sessoes individuais;
- CMS;
- avaliacao por pares;
- badges e gamificacao.

## 5. Matriz de acesso

| Recurso | Aluno | Mentor da turma | Outro mentor | Admin | Publico |
| --- | --- | --- | --- | --- | --- |
| Catalogo tecnico liberado | leitura | leitura | leitura | gestao | nao |
| Propria matricula | leitura | leitura da turma | nao | leitura | nao |
| Entrega tecnica | CRUD antes de aprovacao | leitura/revisao | nao | leitura | somente se publicada no portfolio |
| Feedback | leitura | cria e le | nao | leitura | nao |
| Compromisso privado | somente aluno | nao | nao | nao por padrao | nao |
| Compromisso para mentor | aluno e mentor da turma | leitura | nao | acesso excepcional auditado | nao |
| Sessao ao vivo | leitura da propria turma | gestao da turma | nao | gestao | nao |
| Metricas agregadas | proprio progresso | propria turma | nao | todas | nao |
| Portfolio | escolha do aluno | leitura | leitura | leitura | somente itens publicados |

## 6. Estrutura das 12 semanas

Cada semana do catalogo deve declarar: objetivo, competencias, aulas, materiais, ambiente, atividade, requisitos por nivel, rubrica, prazo e criterio de desbloqueio.

| Semana | Tecnico assincrono | Pratica/entrega | Ao vivo pessoal/profissional |
| --- | --- | --- | --- |
| 1 | Papel do QA, produto e risco | Diagnostico do ExpenseFlow | Objetivos e plano de 90 dias |
| 2 | Exploratorio e priorizacao | Charter e mapa de riscos | Inseguranca e sindrome do impostor |
| 3 | Tecnicas de teste | Cenarios e cobertura | Raciocinio critico e autonomia |
| 4 | Bug report e estrategia manual | Relatorio de release | Comunicacao e posicionamento |
| 5 | Fundamentos de automacao | Selecao do que automatizar | Rotina e consistencia |
| 6 | Cypress/Playwright web | Fluxo automatizado confiavel | Pedir ajuda e lidar com bloqueios |
| 7 | API e integracao | Suite de API | Relacao com dev e produto |
| 8 | Arquitetura e manutencao | Suite refatorada e revisao | Receber e aplicar feedback |
| 9 | Pipeline e GitHub Actions | Suite executando no CI | Participar de refinamentos |
| 10 | Quality gates, artefatos e falhas | Diagnostico de pipeline | Conflito e comunicacao de risco |
| 11 | Carga com k6 e leitura de metricas | Script, thresholds e relatorio | LinkedIn, curriculo e networking |
| 12 | Projeto integrado | Decisao de release e case final | Entrevista e apresentacao final |

### Rubrica tecnica comum

Pontuar de 1 a 4:

1. Entendimento de contexto.
2. Analise de risco.
3. Cobertura e priorizacao.
4. Qualidade da execucao.
5. Evidencia e reprodutibilidade.
6. Sustentabilidade da automacao.
7. Leitura de resultados.
8. Clareza da decisao.

Iniciante pode receber roteiro, massa e esqueleto. Intermediario recebe mais ambiguidade, restricoes, trade-offs, falhas intermitentes e exigencia de justificativa.

## 7. Nova trilha de carga/performance

Essa e a maior lacuna tecnica do produto.

### Escopo seguro do MVP

- Usar k6 em scripts versionados, fora do navegador.
- Alvo inicial: `packages/api`, nunca o banco ou checkout de producao.
- Subir API e massa deterministica em Docker/local ou ambiente dedicado.
- Implementar cenarios de baseline, carga, pico e stress curto.
- Ensinar latencia, throughput, erros, p90/p95/p99 e thresholds.
- Produzir JSON/HTML como artefato do pipeline.
- Incluir trava obrigatoria de host permitido e variavel `PERF_TARGET_ACK`.
- Proibir configuracao capaz de apontar para producao por padrao.

### Arquivos previstos

```text
packages/performance/
  package.json
  README.md
  scenarios/
    baseline.js
    load.js
    spike.js
  lib/
    config.js
    checks.js
  thresholds/
  fixtures/
  reports/.gitkeep
```

Adicionar comando raiz como `bun run test:load:local` somente depois que a protecao de alvo estiver testada.

### Criterio de aceite

Um aluno consegue executar o cenario local, explicar os thresholds, identificar uma degradacao plantada e anexar o relatorio a uma entrega. O CI executa apenas um smoke de performance; carga prolongada fica manual ou agendada em ambiente isolado.

## 8. Rotas e experiencia

### Publicas

- `/mentoria`: promessa, formato, curriculo, niveis, projetos, mentor, FAQ e CTA.
- `/mentoria/inscricao`: lista de espera ou checkout quando a turma estiver aberta.
- `/portfolio/[username]`: continuar publico somente por opt-in.
- `/certificado/[code]`: verificacao publica existente.

### Aluno autenticado

- `/mentoria/app`: dashboard com semana atual e proxima acao.
- `/mentoria/diagnostico`: nivel, objetivo e plano inicial.
- `/mentoria/semanas/[week]`: aulas, pratica, entrega e live.
- `/mentoria/entregas/[assignmentKey]`: tentativas, status e feedback.
- `/mentoria/ao-vivo`: agenda, pauta, link, gravacoes e presenca.
- `/mentoria/carreira`: compromissos, curriculo, LinkedIn, pitch e preparacao de entrevista.
- `/mentoria/projeto-final`: checklist integrado e publicacao do case.

### Mentor e admin

- `/mentoria/mentor`: fila de revisoes, alertas e turmas.
- `/mentoria/mentor/turmas/[cohortId]`: progresso semanal e presenca.
- `/mentoria/mentor/alunos/[enrollmentId]`: jornada, entregas e evolucao.
- `/mentoria/mentor/revisoes/[submissionId]`: rubrica e feedback.
- `/mentoria/admin/turmas`: criar, abrir, encerrar e associar staff.

### Dashboard do aluno

Prioridade visual e funcional:

1. Proxima acao.
2. Prazo da semana.
3. Status da entrega e feedback.
4. Proximo encontro ao vivo.
5. Evolucao nas competencias.
6. Portfolio e projeto final.

Nao recolocar o catalogo inteiro na home do aluno. O catalogo fica como exploracao secundaria.

## 9. APIs e servicos

Criar Route Handlers em `app/api/v1/mentorship`:

```text
me/route.ts
diagnostic/route.ts
lessons/[lessonKey]/progress/route.ts
submissions/route.ts
submissions/[id]/route.ts
sessions/route.ts
commitments/route.ts
mentor/queue/route.ts
mentor/submissions/[id]/review/route.ts
mentor/cohorts/[id]/route.ts
admin/cohorts/route.ts
admin/enrollments/route.ts
```

Regras:

- Validar corpo no servidor; adotar uma biblioteca de schema somente se usada de forma consistente.
- Toda mutacao deve ser idempotente quando houver retry de rede.
- Registrar eventos de auditoria para mudanca de status, revisao, associacao de mentor e matricula.
- Respostas nao podem expor e-mail ou dados pessoais de outros alunos sem necessidade.
- Nao reutilizar endpoints de portfolio para feedback privado.

## 10. Pagamento e matricula

### Turma fundadora

Recomendacao: operacao semi-manual para reduzir risco.

1. Manter o QA Lab Pro atual inalterado.
2. Vender a mentoria por uma oferta separada.
3. Apos confirmacao, criar `mentorship_enrollment` na turma correta.
4. Permitir convite manual por admin para bolsas, parceiros e testes.
5. Nunca liberar mentoria apenas porque `profiles.plan = 'pro'`.

### Escala posterior

- Acrescentar `offer_id` de mentoria ao catalogo de billing.
- Persistir `cohort_id` no metadata interno da preferencia.
- Validar capacidade e estado da turma antes de iniciar checkout.
- Webhook confirmado cria matricula de forma idempotente.
- Reembolso/cancelamento atualiza a matricula segundo politica comercial registrada.
- Nao depender do redirect do navegador para liberar acesso.

## 11. Notificacoes

MVP:

- alertas dentro do dashboard;
- link de calendario `.ics`;
- e-mails transacionais para convite, nova semana, entrega recebida, feedback e encontro em 24 horas;
- lembrete de inatividade depois de sete dias.

Implementar um adaptador de e-mail, sem acoplar regras de produto ao provedor. Se usar Vercel Cron, o endpoint deve exigir segredo e ser idempotente. Nao enviar conteudo de reflexoes pessoais por e-mail.

## 12. Metricas da mentoria

### Eventos novos

- `mentorship_enrolled`
- `diagnostic_completed`
- `lesson_started`
- `lesson_completed`
- `assignment_submitted`
- `review_completed`
- `changes_requested`
- `assignment_approved`
- `live_attendance_marked`
- `portfolio_case_published`
- `final_project_approved`

### Indicadores

- ativacao: diagnostico + primeira entrega em ate sete dias;
- participacao: alunos com entrega ou encontro na semana;
- atraso por semana e nivel;
- tempo mediano ate o primeiro feedback;
- percentual de feedback entregue em ate 72 horas;
- taxa de reenvio depois de `changes_requested`;
- evolucao da rubrica entre primeira e ultima tentativa;
- retencao nas semanas 4, 8 e 12;
- projeto final aprovado;
- tres cases publicados;
- presenca ao vivo e consumo da gravacao;
- entrevistas, contratacoes e promocoes como resultado declarado, sem promessa causal.

Corrigir antes o painel atual: a rota deve validar usuario e `isAdmin(user.email)` antes de chamar `loadMetrics`. As metricas atuais contam eventos, nao usuarios/labs unicos; a nova visao deve trabalhar por coorte e entidades deduplicadas.

## 13. Seguranca, privacidade e acessibilidade

### P0 de seguranca

- Proteger `/lab/metricas` antes da leitura com service role.
- Separar o atual modo de bugs plantados do novo papel de mentor.
- Auditar todas as importacoes de `createAdminClient`.
- Conferir migracoes remotas, RLS, grants e buckets antes do piloto.
- Manter service/secret key somente no servidor.
- Adicionar `TO authenticated` e ownership/membership explicitos nas novas policies.
- Policies de `UPDATE` precisam de `USING`, `WITH CHECK` e policy de `SELECT`.
- Indexar colunas usadas por RLS, especialmente `user_id`, `cohort_id` e `enrollment_id`.
- Se houver funcao `SECURITY DEFINER`, colocar em schema privado, fixar `search_path`, revogar `PUBLIC` e testar por papel.

### Privacidade

- Portfolio e gravacoes nunca publicos por padrao.
- Consentimento para gravacao e uso de depoimento separado da matricula.
- Politica de retencao para gravacoes e anexos.
- Exportacao e exclusao dos dados pessoais do aluno.
- Acesso excepcional de admin deve gerar auditoria.

### Acessibilidade

- WCAG 2.2 AA nos fluxos criticos.
- Legenda e transcricao em todas as aulas e gravacoes publicadas.
- Player operavel por teclado.
- Formularios com erro por campo, resumo e foco previsivel.
- Reflow validado em 320 px e zoom de 200%.
- Rubricas compreensiveis sem depender apenas de cor.

## 14. Estrategia de testes

### Unidade

- calculo da semana atual;
- bloqueio/liberacao de semana;
- proxima acao;
- profundidade por nivel;
- transicoes de status da entrega;
- scoring e versao de rubrica;
- risco de abandono;
- metricas por coorte;
- mapeamento de compra para matricula.

### Banco e RLS

- aluno acessa somente a propria matricula e entregas;
- colega de turma nao le entrega privada;
- mentor le e revisa somente turma associada;
- mentor de outra turma recebe zero linhas/403;
- anonimo nao acessa dados da mentoria;
- admin inativo perde acesso;
- reatribuicao de `user_id`, `cohort_id` e `enrollment_id` e bloqueada;
- grants da Data API sao testados separadamente das policies.

### Integracao

- convite/matricula;
- diagnostico;
- envio e reenvio;
- revisao e aprovacao;
- presenca;
- evento de telemetria;
- webhook idempotente;
- publicacao voluntaria no portfolio.

### E2E Playwright

1. Aluno novo: login -> diagnostico -> semana 1 -> entrega.
2. Mentor: fila -> rubrica -> solicitar mudanca.
3. Aluno: feedback -> reenvio -> aprovacao.
4. Aluno de outra turma nao acessa URL copiada.
5. Admin cria turma e associa mentor.
6. Navegacao por teclado nos fluxos principais.
7. Mobile 320/375 px sem perda de funcao.

### Operacao

- teste de restauracao de backup;
- validacao de e-mail e calendario;
- teste de carga somente no alvo isolado;
- observacao de erros e latencia das APIs da mentoria;
- runbook para falha em encontro, video, upload e pagamento.

## 15. Fases de implementacao

As estimativas abaixo sao faixas de trabalho para uma pessoa desenvolvedora com apoio de conteudo. Conteudo, gravacao e engenharia podem ocorrer em paralelo.

### Fase 0 - Fonte de verdade e seguranca (1 sprint)

- Confirmar catalogo publico e remover divergencia de `LAUNCH_ORDER`.
- Proteger metricas e demais rotas privilegiadas.
- Criar helpers de acesso e testes iniciais.
- Conferir migracoes do Supabase remoto.
- Definir provedor de video, reuniao e e-mail.
- Fechar rubrica comum e entregas das 12 semanas.

**Gate:** nenhuma conta comum acessa dados ou acoes administrativas.

### Fase 1 - Nucleo de turma (1 sprint)

- Migration de staff, turma, vinculo e matricula.
- RLS, grants, indices e testes pgTAP.
- Catalogo TypeScript de 12 semanas.
- Admin minimo para criar turma, convidar aluno e associar mentor.
- Diagnostico e recomendacao de nivel.

**Gate:** um admin cria uma turma e um aluno matriculado entra na jornada correta.

### Fase 2 - Experiencia do aluno (1 a 2 sprints)

- Dashboard `/mentoria/app`.
- Pagina semanal com aulas, materiais, pratica e live.
- Progresso de aula.
- Entrega, anexos, status e historico de tentativas.
- Estados vazio, carregando, erro, bloqueado e concluido.

**Gate:** aluno conclui semana 1 de ponta a ponta sem ajuda externa.

### Fase 3 - Operacao do mentor (1 sprint)

- Fila de revisao.
- Painel da turma e aluno.
- Formulario de rubrica.
- Feedback, solicitacao de mudanca e aprovacao.
- SLA e alertas de atraso.
- Presenca e agenda ao vivo.

**Gate:** mentor revisa uma entrega e o aluno conclui um ciclo de correcao.

### Fase 4 - Trilhas tecnicas faltantes (2 sprints)

Status: implementada localmente.

- Curar manual, automacao e CI/CD existentes dentro das 12 semanas.
- Criar variacoes iniciante/intermediario.
- Implementar pacote seguro de k6 e ambiente alvo.
- Criar projeto integrado e criterios de release.
- Ligar entregas aprovadas ao portfolio.

**Gate:** projeto final demonstra manual + automacao + CI/CD + carga.

### Fase 5 - Ao vivo e carreira (1 sprint)

Status: implementada localmente.

- Calendario, Meet/Zoom, pauta e gravacao.
- Compromissos semanais com privacidade.
- Materiais de curriculo, LinkedIn, pitch e entrevista.
- Dinamicas baseadas no People Lab.
- Certificado final especifico da mentoria.

**Gate:** todo encontro tem preparacao, presenca, material e proxima acao.

### Fase 6 - Metricas, notificacoes e hardening (1 sprint)

Status: implementada localmente; validacao do gate em staging pendente.

- Eventos e painel por turma.
- E-mails transacionais e lembretes.
- E2E completo e testes de RLS.
- Responsividade e acessibilidade.
- Validacao de staging com compra, matricula, upload e portfolio.
- Runbook e suporte da turma.

Entregue localmente: painel com progresso de entregas/aulas, presenca, atraso de revisao e eventos por turma; outbox duravel com deduplicacao e retentativas; envio via Resend e cron diario autenticado; notificacoes cujo usuario pode alterar apenas `read_at`; E2E configuravel para jornada aluno/mentor, portfolio, inicio do checkout com Mercado Pago e rejeicao de acesso indevido; verificacoes pgTAP; runbook em `docs/MENTORIA_RUNBOOK.md`.

A migration `0029_mentorship_hardening_email.sql` e a execucao do piloto ainda estao pendentes nos ambientes de staging/producao. Nao ativar o cron antes de aplicar a migration e configurar o provedor de e-mail.

**Gate:** piloto interno com tres perfis conclui a jornada critica sem P0/P1 aberto.

### Fase 7 - Turma fundadora (12 semanas de operacao)

- Limitar a 15-20 alunos ate medir a carga real de feedback.
- Revisao semanal de atritos.
- Entrevistas nas semanas 2, 6 e 12.
- Nao adicionar novas trilhas durante o piloto.
- Converter achados em backlog, sem alterar retroativamente criterios ja avaliados.

## 16. Backlog priorizado

### P0 - bloqueia qualquer turma

1. Corrigir autorizacao de metricas e rotas privilegiadas.
2. Definir fonte unica do catalogo e estado de lancamento.
3. Criar staff, turmas, matriculas e autorizacao server-side.
4. Criar RLS e testes de isolamento.
5. Entregar dashboard, semana, submissao e revisao.
6. Validar Supabase remoto, Storage, Auth e backup.

### P1 - bloqueia a promessa da mentoria

1. Diagnostico e nivel.
2. Catalogo das 12 semanas.
3. Rubricas e reenvio.
4. Agenda ao vivo e presenca.
5. Trilha de carga segura.
6. Projeto final integrado.
7. Portfolio e certificado.
8. Metricas de turma e SLA de feedback.

### P2 - melhora retencao e escala

1. E-mails e calendario.
2. Alertas de risco de abandono.
3. Checkout automatico da turma.
4. Materiais de carreira estruturados.
5. Relatorio final de competencias.
6. Exportacao para PDF/Markdown.

### Fora de escopo do primeiro piloto

- app mobile nativo;
- videoconferencia propria;
- comunidade propria completa;
- IA avaliando automaticamente todas as entregas;
- marketplace de vagas;
- assinatura recorrente;
- multiplos programas simultaneos;
- gamificacao complexa;
- CMS completo.

## 17. Riscos e mitigacoes

| Risco | Impacto | Mitigacao |
| --- | --- | --- |
| Escopo existente muito amplo | aluno se perde | dashboard com uma unica proxima acao |
| Mentor vira gargalo | feedback atrasado | limite de turma, rubrica e SLA de 72h |
| Iniciante e intermediario na mesma turma | frustracao em ambos | requisitos por nivel no mesmo contexto |
| Automacao domina o programa | base manual fraca | quatro primeiras semanas e projeto integrado |
| Carga atinge producao | incidente e custo | allowlist, alvo isolado e trava explicita |
| Dados de outros alunos vazam | risco critico | RLS, server authorization e testes por papel |
| Video e live viram infraestrutura demais | atraso | provedores externos no MVP |
| Promessa de carreira excessiva | perda de confianca | vender evidencia e preparacao, nao emprego garantido |
| Catalogos divergentes | experiencia incoerente | uma fonte versionada e gates de release |
| Compra libera direito errado | acesso indevido | separar Pro de matricula da mentoria |

## 18. Checklist de lancamento

### Produto

- [ ] Turma, capacidade, datas e mentores configurados.
- [ ] Doze semanas revisadas e quatro primeiras completamente publicadas.
- [ ] Demais semanas com conteudo e entregas fechados antes da venda.
- [ ] Projeto final executado por uma pessoa que nao participou da construcao.
- [ ] Variacoes iniciante/intermediario validadas.

### Tecnico

- [ ] Migracoes aplicadas e comparadas com o remoto.
- [ ] RLS/grants testados.
- [ ] P0/P1 de seguranca encerrados.
- [ ] Staging validado com aluno, mentor e admin.
- [ ] Upload, video, e-mail, Meet/Zoom e portfolio funcionando.
- [ ] Backup e restauracao verificados.
- [ ] Core Web Vitals e erros monitorados.

### Operacao

- [ ] SLA de feedback definido.
- [ ] Agenda das 12 lives publicada.
- [ ] Politica de gravacao e privacidade aceita.
- [ ] Canal de suporte e horarios definidos.
- [ ] Processo para ausencia, pausa, cancelamento e reembolso documentado.
- [ ] Plano de contingencia para indisponibilidade do encontro.

### Validacao final

- [ ] E2E da jornada critica verde.
- [ ] Testes de RLS verdes.
- [ ] Testes unitarios e lint verdes.
- [ ] Build de producao verde.
- [ ] Teste manual por teclado e mobile concluido.
- [ ] Smoke de carga executado somente no alvo isolado.

## 19. Primeira fatia vertical recomendada

Antes de construir as 12 semanas, entregar uma fatia completa da semana 1:

```text
admin cria turma
-> aluno e matriculado
-> faz diagnostico
-> assiste/marca aulas
-> executa ExpenseFlow
-> envia mapa de risco
-> mentor revisa
-> aluno corrige
-> entrega e aprovada
-> dashboard recomenda semana 2
```

Essa fatia valida arquitetura, autorizacao, UX, operacao e carga de feedback. Somente depois dela deve ser replicada a estrutura para as outras onze semanas.

## 20. Ordem imediata de execucao

1. Implementar e testar a autorizacao administrativa existente.
2. Criar a migration do nucleo de mentoria com RLS e pgTAP.
3. Criar o catalogo das 12 semanas e a rubrica comum.
4. Construir a fatia vertical da semana 1.
5. Construir a fila e revisao do mentor.
6. Curar os recursos existentes nas semanas 2-10.
7. Criar a trilha isolada de carga da semana 11.
8. Implementar o projeto final da semana 12.
9. Adicionar live, carreira, notificacoes e metricas.
10. Rodar piloto interno, corrigir P0/P1 e abrir a turma fundadora.

