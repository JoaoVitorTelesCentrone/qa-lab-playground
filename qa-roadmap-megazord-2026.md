# QA Roadmap Megazord 2026

> Um roadmap de carreira para Quality Assurance / Quality Engineering construído a partir do RoadMapQA enviado, referências internacionais de testing/quality engineering e sinais do mercado brasileiro em 2026.

## Como usar este roadmap

Este roadmap não é uma checklist linear de ferramentas. Ele separa **competências** de **ferramentas** e organiza a evolução por maturidade profissional.

### Legenda

- **[CORE]** conhecimento que praticamente todo QA deveria dominar.
- **[MERCADO]** competência com forte valor de contratação no mercado atual.
- **[ENG]** engenharia: aumenta autonomia técnica e aproxima de QA Engineer/SDET.
- **[ESTRATÉGIA]** decisão, risco, processo, arquitetura e influência.
- **[ESPECIALIZAÇÃO]** aprofunde conforme o caminho de carreira.
- **[FERRAMENTA]** exemplo de implementação; não confundir com competência.

---

# VISÃO GERAL

```text
                    QA / QUALITY ENGINEERING
                              │
              ┌───────────────┴───────────────┐
              │                               │
        FUNDAMENTOS                     ENGENHARIA
              │                               │
    Test design / risco             Código / API / dados
    SDLC / Agile / bugs             Automação / CI-CD
    Exploratório / requisitos       Infra / observabilidade
              │                               │
              └───────────────┬───────────────┘
                              │
                     QUALITY ENGINEER
                              │
       ┌──────────────┬───────┼────────┬──────────────┐
       │              │       │        │              │
     SDET        Performance Mobile  Security       Data/AI
       │              │       │        │              │
       └──────────────┴───────┼────────┴──────────────┘
                              │
                  Senior / Staff / Principal
                              │
             Estratégia, arquitetura e influência
```

---

# 0. MENTALIDADE DE QUALIDADE

## [CORE] O que é qualidade?

Entender que qualidade não é apenas ausência de bugs e que QA não é sinônimo de executar casos de teste.

Estudar:

- Qualidade de produto.
- Qualidade de processo.
- Qualidade percebida pelo usuário.
- Verificação x validação.
- QA x QC x Testing x Quality Engineering.
- Custo da qualidade e custo de falhas.
- Feedback rápido.
- Qualidade como responsabilidade compartilhada.
- Testabilidade.

## [CORE] QA Mindset

Aprender a perguntar:

- O que pode dar errado?
- Para quem isso é crítico?
- O que mudou?
- Que dependências existem?
- Quais suposições estamos fazendo?
- O que acontece nos limites?
- Como saberemos em produção se algo falhou?
- Qual risco estamos aceitando?

## [ESTRATÉGIA] Pensamento baseado em risco

- Probabilidade x impacto.
- Severidade x prioridade.
- Matriz de risco.
- Risco de produto x risco de projeto.
- Priorização por fluxo crítico.
- Critical User Journeys.
- Risco residual.
- Risco aceito.
- Critérios de release.

**Resultado esperado:** você deixa de perguntar “quantos casos preciso testar?” e começa a perguntar “qual incerteza precisamos reduzir?”.

---

# 1. FUNDAMENTOS DE TESTE

## [CORE] Princípios de teste

- Por que testar.
- Teste mostra presença de defeitos, não ausência absoluta.
- Testar tudo é impossível.
- Contexto importa.
- Defeitos se agrupam.
- Testes envelhecem.
- Ausência de erro não garante valor.

## [CORE] Abordagens

- Caixa-preta.
- Caixa-branca.
- Caixa-cinza.
- Teste estático.
- Teste dinâmico.
- Scripted testing.
- Exploratory testing.

## [CORE] Técnicas de desenho de testes

Não pule este bloco. É uma das diferenças entre “clicar no sistema” e realmente testar.

- Particionamento de equivalência.
- Análise de valor limite.
- Tabela de decisão.
- Transição de estados.
- Pairwise / combinatorial testing.
- Use-case testing.
- Error guessing.
- Checklist-based testing.
- Session-based exploratory testing.

## [CORE] Oráculos de teste

Como decidir se o comportamento observado está correto:

- Regra de negócio.
- Requisito.
- Produto anterior.
- Sistema de referência.
- Padrão técnico.
- Propriedade/invariante.
- Conhecimento de domínio.

---

# 2. CICLO DE DESENVOLVIMENTO E TRABALHO EM TIME

## [CORE] SDLC

Entender:

- Planejamento.
- Requisitos.
- Design/arquitetura.
- Desenvolvimento.
- Testes.
- Deploy.
- Operação.
- Manutenção.

Modelos:

- Cascata.
- Iterativo/incremental.
- Agile.
- DevOps / Continuous Delivery.

## [CORE] Agile sem buzzword

- Scrum.
- Kanban.
- XP.
- Refinamento.
- Planning.
- Daily.
- Review.
- Retrospectiva.
- Definition of Ready.
- Definition of Done.
- Critérios de aceite.

## [ESTRATÉGIA] Shift Left + Shift Right

### Shift Left

QA contribui antes do código:

- Questionar requisitos.
- Identificar ambiguidades.
- Mapear riscos.
- Definir exemplos.
- Planejar observabilidade.
- Influenciar arquitetura e testabilidade.

### Shift Right

Qualidade continua depois do deploy:

- Monitoramento.
- Logs.
- Métricas.
- Traces.
- Feature flags.
- Canary releases.
- Feedback do usuário.
- Análise de incidentes.

---

# 3. REQUISITOS, CENÁRIOS E DOCUMENTAÇÃO

## [CORE] Análise de requisitos

- Detectar ambiguidade.
- Detectar regra ausente.
- Identificar dependências.
- Questionar happy path e unhappy paths.
- Identificar persona/permissão.
- Definir pré e pós-condições.

## [CORE] Escrita de cenários

Aprender a usar sem virar escravo de template:

- Caso de teste tradicional.
- Checklist.
- Step-by-step.
- Gherkin.
- BDD / Example Mapping.

### AAA

- Arrange.
- Act.
- Assert.

### Given / When / Then

Use para expressar comportamento, não como documentação burocrática de clique.

## [CORE] Bug report

Um bom defeito contém:

- Título objetivo.
- Ambiente.
- Versão/build.
- Pré-condição.
- Passos mínimos.
- Resultado atual.
- Resultado esperado.
- Evidência.
- Logs quando relevante.
- Severidade.
- Contexto/impacto.

## [MERCADO] Ferramentas de gestão

Conheça pelo menos uma:

- Jira.
- Azure DevOps.
- GitHub Projects.

Gestão de testes:

- Qase.
- TestRail.
- Xray.
- Zephyr.
- Azure Test Plans.

A ferramenta é secundária. O objetivo é rastreabilidade e comunicação.

---

# 4. TESTE MANUAL E EXPLORATÓRIO

## [CORE] Tipos funcionais

- Smoke.
- Sanity.
- Regressão.
- Integração.
- Sistema.
- UAT.
- E2E.
- Exploratório.
- Compatibilidade.
- Usabilidade.

## [CORE] Exploração estruturada

- Charters.
- Time-boxing.
- Heurísticas.
- Tours.
- Personas.
- Dados extremos.
- Interrupções.
- Concorrência.
- Falha de dependência.
- Mudança de rede.
- Sessão/autenticação.

## [CORE] Compatibilidade

- Browser.
- Sistema operacional.
- Resolução.
- Dispositivo.
- Responsividade.
- Localização/idioma.
- Timezone.
- Conexões lentas/intermitentes.

---

# 5. FUNDAMENTOS WEB — O BLOCO QUE DÁ AUTONOMIA

## [MERCADO] Browser e DevTools

Dominar:

- Elements.
- Console.
- Network.
- Application/storage.
- Cookies.
- LocalStorage/SessionStorage.
- Cache.
- Requests/responses.
- Headers.
- Status codes.
- Timing.

## [CORE] HTML/CSS/JavaScript

Não precisa virar frontend, mas precisa entender:

- DOM.
- Elementos e atributos.
- Formulários.
- Eventos.
- Seletores.
- Async JS.
- Fetch/XHR.

## [CORE] Como uma aplicação web funciona

- Cliente x servidor.
- HTTP/HTTPS.
- DNS — noção.
- Cookies e sessões.
- JWT — noção.
- CORS.
- Cache.
- CSR x SSR.
- SPA/PWA.

---

# 6. API TESTING

## [MERCADO] HTTP profundamente

- Métodos: GET, POST, PUT, PATCH, DELETE.
- Status codes.
- Headers.
- Query params.
- Path params.
- Body.
- JSON.
- Autenticação.
- Idempotência.
- Paginação.
- Rate limits.

## [MERCADO] Testes de API

Validar:

- Contrato.
- Schema.
- Regra de negócio.
- Autorização.
- Permissões.
- Erros.
- Dados inválidos.
- Concorrência.
- Integrações.

Ferramentas:

- Postman.
- Bruno.
- Insomnia.
- Swagger/OpenAPI.
- REST Assured.
- Playwright API.
- Cypress API.
- Karate.

## [ENG] Contract Testing

Aprender quando sistemas possuem serviços independentes:

- Consumer/Provider.
- OpenAPI schema validation.
- Consumer-driven contracts.
- Pact.
- Contratos de eventos/mensageria.

---

# 7. BANCO DE DADOS E TESTE DE DADOS

## [MERCADO] SQL

Mínimo profissional:

- SELECT.
- WHERE.
- ORDER BY.
- GROUP BY.
- JOIN.
- Subquery.
- INSERT/UPDATE para ambiente de teste.
- Constraints.
- Chaves primária/estrangeira.
- Transações.

## [ENG] Dados

- Integridade referencial.
- Migração.
- Seeds/fixtures.
- Massas sintéticas.
- Dados sensíveis.
- Mascaramento.
- Test data management.

## [ESPECIALIZAÇÃO] NoSQL / Streaming

- MongoDB/documentos.
- Redis/cache.
- Kafka/eventos.
- Time-series.

---

# 8. PROGRAMAÇÃO PARA QA

## [MERCADO] Escolha UMA linguagem principal

Opções mais úteis:

- JavaScript/TypeScript.
- Java.
- Python.
- C#.

Não estude quatro ao mesmo tempo.

## [ENG] Fundamentos

- Variáveis e tipos.
- Condicionais.
- Loops.
- Funções.
- Arrays/listas.
- Objetos/maps.
- Classes.
- Exceptions.
- Async/await.
- Módulos/packages.
- Leitura/escrita de arquivos.
- JSON.
- HTTP client.

## [ENG] Qualidade do código de teste

- Clean code.
- DRY com bom senso.
- SOLID — conceitos úteis.
- Composição.
- Separation of concerns.
- Reuso sem abstração excessiva.
- Logging.
- Tratamento de erros.

---

# 9. AUTOMAÇÃO DE TESTES

## [CORE] Antes de automatizar

Responder:

- Por que automatizar?
- Qual risco este teste cobre?
- Em qual camada deveria viver?
- Quanto custa manter?
- Qual feedback ele dá?
- Com que frequência roda?

## [MERCADO] Web automation

Aprenda profundamente um framework moderno:

### Caminho A

- Playwright + TypeScript.

### Caminho B

- Cypress + TypeScript/JavaScript.

### Contextos específicos

- Selenium.
- WebdriverIO.
- Robot Framework.

## [ENG] Competências que importam mais que o framework

- Locators resilientes.
- Test isolation.
- Fixtures.
- Hooks.
- Dados de teste.
- Authentication state.
- API setup.
- Mocks/stubs.
- Network interception.
- Parallel execution.
- Retries com critério.
- Screenshots/videos/traces.
- Debugging.
- Reports.

## [ENG] Design de automação

Conhecer e usar quando fizer sentido:

- Page Object.
- Component/Object models.
- Builders.
- Factories.
- API clients.
- Fixtures.
- Screenplay — opcional.

Não transformar pattern em religião.

## [CORE] Flakiness

Aprender causas:

- Estado compartilhado.
- Wait fixo.
- Race condition.
- Dados inconsistentes.
- Dependência externa.
- Ambiente instável.
- Selector frágil.

Política:

- Classificar.
- Investigar.
- Isolar quando necessário.
- Corrigir.
- Remover se perdeu valor.

---

# 10. ESTRATÉGIA DE AUTOMAÇÃO

## [ESTRATÉGIA] Camadas de teste

- Unit.
- Component.
- Integration.
- Contract.
- API/service.
- E2E.
- Production checks.

## [ESTRATÉGIA] Pirâmide de testes

Use como heurística, não porcentagem religiosa.

Critérios:

- Velocidade.
- Manutenibilidade.
- Utilidade.
- Confiabilidade.
- Fidelidade.

Pergunta central:

> Qual é a camada mais barata e confiável capaz de revelar este risco?

## [ESTRATÉGIA] Critical User Journeys

E2E deve proteger principalmente jornadas críticas do usuário, e não carregar cada combinação do sistema.

---

# 11. GIT E FLUXO DE DESENVOLVIMENTO

## [MERCADO] Git

Dominar:

- clone.
- branch.
- status.
- add.
- commit.
- pull.
- push.
- merge.
- rebase — noção.
- conflito.
- diff.
- log.

## [MERCADO] Pull Requests

QA técnico deve conseguir:

- Ler diff.
- Entender escopo de alteração.
- Comentar risco.
- Revisar código de teste.
- Identificar arquivos afetados.

GitHub / GitLab / Bitbucket / Azure Repos são implementações.

---

# 12. CI/CD

## [MERCADO] Conceitos

- CI.
- Continuous Delivery.
- Continuous Deployment.
- Pipeline.
- Build.
- Artifact.
- Environment.
- Secret.
- Gate.

## [MERCADO] Integração dos testes

Saber:

- Rodar em PR.
- Rodar smoke após deploy.
- Rodar regressão agendada.
- Parametrizar ambiente.
- Armazenar relatório/evidência.
- Definir timeout.
- Paralelizar.
- Falhar pipeline por critério claro.

Ferramentas:

- GitHub Actions.
- GitLab CI.
- Azure Pipelines.
- Jenkins.

---

# 13. CONTAINERS, LINUX E CLOUD

## [ENG] Linux básico

- Navegação.
- Arquivos.
- Permissões.
- grep.
- curl.
- env.
- processos.
- logs.

## [ENG] Docker

- Image.
- Container.
- Dockerfile.
- Volumes.
- Networks.
- Docker Compose.

Objetivo: conseguir reproduzir ambientes e executar testes consistentemente local/CI.

## [ESPECIALIZAÇÃO] Kubernetes

Para Senior/SDET/Staff:

- Pod.
- Deployment.
- Service.
- ConfigMap.
- Secret.
- Logs.
- Health checks.

## [ESPECIALIZAÇÃO] Cloud

AWS/Azure/GCP:

- Conceitos de compute.
- Storage.
- Networking.
- IAM.
- Logs/monitoring.
- Serverless.

Não precisa colecionar certificações para começar.

---

# 14. TESTES NÃO FUNCIONAIS

## 14.1 Performance

### [CORE] Conceitos

- Latência.
- Throughput.
- Percentis.
- Erro.
- Concorrência.
- Saturação.

### [MERCADO] Tipos

- Load.
- Stress.
- Spike.
- Soak/endurance.
- Scalability.

### [ENG] Critérios

- Baseline.
- SLI/SLO.
- Thresholds.
- Correlação com infraestrutura.

Ferramentas:

- k6.
- JMeter.
- Gatling.
- Locust.
- Artillery.

## 14.2 Acessibilidade

### [CORE]

- WCAG.
- Teclado.
- Foco.
- Semântica.
- Labels.
- Contraste.
- Screen readers — noção prática.

Ferramentas:

- axe.
- Lighthouse.
- WAVE.
- DevTools.

Automação ajuda, mas não substitui avaliação manual.

## 14.3 Segurança

### [CORE]

- Autenticação x autorização.
- Roles/permissões.
- Session management.
- Secrets.
- Input validation.
- OWASP Top 10.
- OWASP API Security Top 10.

### [ENG]

- SAST.
- DAST.
- Dependency scanning.
- Secret scanning.
- Threat modeling — base.

QA não precisa virar pentester para testar segurança melhor.

## 14.4 Resiliência

### [ESPECIALIZAÇÃO]

- Timeout.
- Retry.
- Circuit breaker.
- Degradação.
- Falha de dependência.
- Chaos engineering — conceitos.

---

# 15. MOBILE TESTING

## [ESPECIALIZAÇÃO]

Manual:

- Android/iOS differences.
- Permissões.
- Background/foreground.
- Interrupções.
- Orientação.
- Deep links.
- Rede.
- Versões de SO.
- Device fragmentation.

Automação:

- Appium.
- Espresso.
- XCUITest.
- Maestro.

Também estudar:

- Emulador x dispositivo real.
- Device farm.
- Logs mobile.

---

# 16. OBSERVABILIDADE E PRODUÇÃO

## [MERCADO] QA não termina no deploy

Aprender:

- Logs.
- Metrics.
- Traces.
- Correlation IDs.
- Dashboards.
- Alerting.

Ferramentas/conceitos:

- OpenTelemetry.
- Grafana.
- Prometheus.
- Datadog.
- New Relic.
- Sentry.
- Kibana/Elastic.

## [ESTRATÉGIA] Qualidade em produção

- Smoke pós-deploy.
- Synthetic monitoring.
- Feature flags.
- Canary.
- Rollback.
- Incident analysis.
- Root cause analysis.
- MTTR.

O objetivo não é “testar no usuário”, mas detectar e recuperar rapidamente o que ambientes anteriores não conseguiram representar.

---

# 17. ARQUITETURA PARA QA

## [ENG] Todo Senior deveria entender ao menos o desenho do sistema

- Monolito.
- Microsserviços.
- REST.
- GraphQL.
- WebSocket.
- Filas/mensageria.
- Event-driven architecture.
- Cache.
- CDN.
- Database per service.
- Consistência eventual.

## [ESTRATÉGIA] Perguntas de QA arquitetural

- Onde existe acoplamento?
- Onde existe single point of failure?
- Como rastrear uma requisição entre serviços?
- O sistema é testável sem levantar tudo?
- Como contratos são validados?
- O que acontece se uma dependência cair?
- Como criar dados determinísticos?

---

# 18. MÉTRICAS DE QUALIDADE

## [ESTRATÉGIA] Não medir QA por quantidade de bugs

Métricas possíveis:

- Escape rate / defeitos em produção.
- Reopen rate.
- Tempo de feedback.
- Tempo da pipeline.
- Flaky rate.
- Cobertura de riscos críticos.
- Tempo de correção.
- Lead time de mudança.
- Change failure rate.
- MTTR.
- Incidentes por release.
- SLOs do produto.

Métrica deve ajudar decisão. Nunca virar jogo de pontuação individual.

---

# 19. IA PARA QA — 2026

Há dois blocos diferentes.

## 19.1 [MERCADO] IA como copiloto de QA

Usar para:

- Brainstorm de riscos.
- Geração inicial de cenários.
- Dados sintéticos.
- Explicação de logs.
- Geração/refatoração de automação.
- Revisão de código de testes.
- Análise de falhas.
- Documentação.

Competências necessárias:

- Dar contexto.
- Validar saída.
- Evitar vazamento de código/dados.
- Identificar alucinação.
- Não aceitar testes gerados sem avaliar risco.

## 19.2 [ESPECIALIZAÇÃO] Testar produtos com IA/LLMs

- Não determinismo.
- Groundedness.
- Hallucination rate.
- Relevância.
- Toxicidade/segurança.
- Prompt injection.
- Data leakage.
- RAG evaluation.
- Agent permissions.
- Tool abuse.
- Evals automatizados.
- Golden datasets.
- Human evaluation.
- Regression de prompts/modelos.
- TEVV — Test, Evaluation, Verification and Validation.

---

# 20. SOFT SKILLS QUE VIRAM HARD SKILLS NO SENIOR

## [CORE]

- Comunicação objetiva.
- Escrita técnica.
- Perguntas de refinamento.
- Negociação de risco.
- Facilitação.
- Priorização.
- Dar feedback.
- Receber feedback.

## [SENIOR]

- Influência sem autoridade.
- Mentoria.
- Condução de incidentes.
- Alinhamento com Produto/Dev/Ops.
- Defender investimento técnico usando impacto de negócio.
- Explicar risco para pessoas não técnicas.

---

# 21. PROGRESSÃO DE CARREIRA

Não use anos como regra absoluta. Use autonomia e impacto.

## Nível 0 — Entrada / Trainee

### Deve saber

- O que é QA/teste/qualidade.
- SDLC e Agile básicos.
- Tipos de teste.
- Caso/cenário de teste.
- Bug report.
- Exploratório básico.
- DevTools básico.
- HTTP básico.

### Deve conseguir

Testar uma feature pequena com supervisão e explicar o que validou.

---

## Nível 1 — QA Júnior

### Base obrigatória

- Técnicas de caixa-preta.
- Valor limite/equivalência.
- Regressão/smoke/exploratório.
- Requisitos/critérios de aceite.
- API básica com Postman/Bruno.
- SQL básico.
- Git básico.
- DevTools.
- Jira/Azure DevOps ou equivalente.
- Noção de automação.

### Autonomia esperada

- Testar uma história inteira.
- Identificar cenários além do happy path.
- Reportar defeito reproduzível.
- Validar API e banco em nível básico.
- Participar de refinamento.

### Portfólio mínimo

Projeto com:

1. plano simples de teste;
2. casos baseados em técnicas de teste;
3. testes de API;
4. SQL de validação;
5. relatório de bugs;
6. pequena suíte automatizada.

---

## Nível 2 — QA Pleno / QA Engineer

### Mercado brasileiro 2026 — núcleo forte

- Uma linguagem de programação.
- Cypress ou Playwright ou Selenium.
- Testes de API.
- SQL.
- Git/PR.
- CI/CD.
- Estratégia de regressão.
- Debug de falhas.
- Test data.
- Mocks/stubs.
- Test isolation.

### Próximo nível

- Docker.
- Performance básica.
- Contract testing.
- Segurança básica.
- Observabilidade.
- Microsserviços.

### Autonomia esperada

- Ser responsável pela estratégia de qualidade de uma feature/serviço.
- Escolher o que testar manualmente e automatizar.
- Integrar suíte no pipeline.
- Diagnosticar falhas usando logs/API/dados.
- Reduzir flakiness.
- Participar de decisões de release.

### Portfólio forte

Repo público com:

- App ou API de exemplo.
- Playwright/Cypress.
- API tests.
- Database validation.
- Fixtures/test data.
- Docker Compose.
- GitHub Actions.
- Relatório.
- README explicando estratégia e trade-offs.

---

## Nível 3 — QA Sênior / Senior Quality Engineer

### Técnica

- Estratégia baseada em risco.
- Arquitetura de automação.
- API distribuída.
- Contract testing.
- Performance.
- Segurança.
- Observabilidade.
- Docker.
- Cloud.
- Noção de Kubernetes.
- Testability.
- Quality gates.

### Estratégia

- Definir abordagem de testes de uma iniciativa.
- Criar critérios de release.
- Definir quais sinais importam.
- Reduzir custo de feedback.
- Analisar incidentes.
- Influenciar arquitetura.
- Mentorar outros QAs.

### Autonomia esperada

Não recebe apenas “o que testar”. Ajuda a decidir **como o time constrói confiança**.

---

## Nível 4 — Staff / Principal Quality Engineer

### Escopo

Sai de feature/time e passa a impactar múltiplos times.

### Competências

- Estratégia de qualidade organizacional.
- Test architecture.
- Quality platform / tooling.
- Testability by design.
- Observability strategy.
- Standards internos.
- Golden paths.
- Engineering productivity.
- Métricas sistêmicas.
- Reliability.
- Risk governance.
- Quality coaching.

### Pergunta central

> Como fazer dezenas de times entregarem software melhor sem criar um departamento de QA como gargalo?

---

## Nível 5A — QA Lead / Manager

Foco maior em pessoas, capacidade e processo:

- Estratégia do time.
- Hiring.
- Mentoria.
- PDI.
- Capacidade.
- Priorização.
- Stakeholders.
- Budget/ferramentas.
- Métricas.
- Gestão de risco.

Não precisa abandonar a técnica, mas a unidade de impacto passa a ser o time.

---

# 22. TRILHAS DE ESPECIALIZAÇÃO

## A. QA Funcional / Exploratório Sênior

Aprofundar:

- Domínio de negócio.
- Exploratory testing.
- Risk analysis.
- UX/usabilidade.
- Acessibilidade.
- Requisitos.
- Facilitação.
- UAT.

Automação continua sendo útil, mas não define a carreira.

## B. Test Automation Engineer / SDET

Aprofundar:

- Programação.
- Framework design.
- API.
- Test infrastructure.
- CI/CD.
- Docker.
- Cloud.
- Performance.
- Contract testing.
- Developer tooling.

## C. Performance Engineer

- k6/JMeter/Gatling.
- SLO/SLI.
- Observabilidade.
- Infra/cloud.
- Profiling.
- Capacity planning.
- Bottleneck analysis.

## D. Security Testing / AppSec Quality

- OWASP WSTG.
- API Security.
- AuthN/AuthZ.
- SAST/DAST.
- Threat modeling.
- Secure SDLC.

## E. Mobile QA

- Android/iOS.
- Appium/Maestro/Espresso/XCUITest.
- Device farms.
- Mobile networking.
- Performance mobile.

## F. Data Quality Engineer

- SQL avançado.
- ETL/ELT.
- Data contracts.
- Data reconciliation.
- Data observability.
- dbt tests.
- Pipelines.

## G. AI Quality / AI Evaluation Engineer

- Evaluation datasets.
- LLM evals.
- RAG evaluation.
- Safety/security.
- Prompt/model regression.
- Agent evaluation.
- NIST AI RMF / TEVV.
- OWASP GenAI.

---

# 23. MATRIZ DE COMPETÊNCIAS POR NÍVEL

| Competência | Júnior | Pleno | Sênior | Staff/Principal |
|---|---|---|---|---|
| Fundamentos de teste | aplica | domina | ensina/contextualiza | define padrões |
| Exploratório | executa | estrutura sessões | lidera investigação | escala práticas |
| Risco | identifica | prioriza | define estratégia | governa portfólio |
| API | básico | forte | arquitetura/contratos | padrões/plataforma |
| SQL/dados | básico | intermediário | investigação/modelagem | estratégia de dados de teste |
| Código | básico | produtivo | arquitetura | plataformas/tooling |
| Automação | contribui | mantém/desenha suíte | define abordagem | define ecossistema |
| CI/CD | entende | integra | otimiza/gates | estratégia multi-times |
| Performance | conhece | executa básico | planeja/analisa | capacidade organizacional |
| Segurança | conhece riscos | testes básicos | integra no SDLC | governança/guardrails |
| Observabilidade | lê logs | usa logs/métricas | define sinais | estratégia de observabilidade |
| Arquitetura | entende fluxo | entende serviços | influencia design | influencia plataforma |
| Comunicação | reporta | negocia contexto | influencia decisões | alinha organização |
| Mentoria | recebe | apoia | mentora | multiplica líderes |

---

# 24. O QUE ESTUDAR PRIMEIRO — ORDEM PRÁTICA

Para alguém começando hoje:

1. Fundamentos de qualidade e teste.
2. Técnicas de desenho de testes.
3. Testes manuais + exploratórios.
4. SDLC/Agile/requisitos.
5. Web/DevTools/HTTP.
6. API.
7. SQL.
8. Git.
9. Uma linguagem.
10. Playwright ou Cypress.
11. CI/CD.
12. Docker.
13. Estratégia de automação.
14. Performance.
15. Segurança.
16. Acessibilidade.
17. Observabilidade.
18. Arquitetura distribuída.
19. Cloud/Kubernetes.
20. Especialização.

---

# 25. CAMINHO DE 12 MESES — DO ZERO A QA ENGINEER COMPETITIVO

## Meses 1–2 — Fundamentos

- Quality/testing fundamentals.
- SDLC/Agile.
- Técnicas de teste.
- Bugs.
- Exploratório.

**Projeto:** testar manualmente uma aplicação pública/demo e criar um test report.

## Meses 3–4 — Web + API + SQL

- DevTools.
- HTTP.
- Postman/Bruno.
- Swagger.
- SQL.

**Projeto:** validar UI, API e banco de uma mesma aplicação.

## Meses 5–6 — Programação

- TypeScript/JavaScript ou Java/Python.
- Git/GitHub.
- Testes unitários básicos.

**Projeto:** scripts que consomem API, manipulam dados e geram validações.

## Meses 7–8 — Automação moderna

- Playwright ou Cypress.
- Fixtures.
- Locators.
- API setup.
- Page/components.
- Test data.

**Projeto:** suíte E2E pequena e confiável.

## Meses 9–10 — Engenharia

- CI/CD.
- Docker.
- Relatórios.
- Paralelismo.
- Flakiness.
- Mocks.

**Projeto:** testes rodando automaticamente em Pull Request.

## Meses 11–12 — Quality Engineering

- Performance com k6/JMeter.
- OWASP básico.
- Accessibility.
- Observability.
- Risk-based strategy.

**Projeto final:** Quality Engineering Lab contendo Web + API + DB + CI/CD + performance + observabilidade básica + documento de estratégia.

---

# 26. O PORTFÓLIO “MEGAZORD”

Em vez de 15 repositórios desconectados, crie um laboratório completo.

## Sistema

- Frontend web.
- API REST.
- Banco PostgreSQL.
- Autenticação e roles.
- Serviço externo mockado.

## Testes

- Unit — exemplos.
- Component — se aplicável.
- API.
- Contract.
- E2E.
- Exploratory charter.
- Accessibility.
- Performance.
- Security checklist.

## Engenharia

- Docker Compose.
- GitHub Actions.
- Reports.
- Test data reset.
- Logs.
- Trace/evidence.

## Estratégia

README explicando:

- riscos principais;
- por que cada teste existe;
- o que não foi automatizado;
- critérios de release;
- como lidar com flaky tests;
- como observar o sistema em produção.

Esse projeto demonstra muito mais maturidade do que apenas “sei Cypress”.

---

# 27. CHECKPOINTS DE CARREIRA

## Pronto para buscar vaga Júnior quando você consegue:

- Testar uma feature sem checklist pronto.
- Aplicar pelo menos 3 técnicas de desenho.
- Reportar defeitos com clareza.
- Testar uma API básica.
- Consultar dados em SQL.
- Usar Git básico.
- Explicar o risco de uma mudança.

## Pronto para se posicionar como Pleno quando você consegue:

- Definir estratégia de teste de uma feature.
- Criar/manter automação útil.
- Testar API com profundidade.
- Investigar banco/logs.
- Integrar testes em CI/CD.
- Trabalhar com dados/ambientes.
- Diagnosticar flaky tests.
- Argumentar o que vale ou não automatizar.

## Pronto para se posicionar como Sênior quando você consegue:

- Definir estratégia de qualidade de uma iniciativa.
- Priorizar por risco.
- Influenciar requisitos/arquitetura.
- Discutir performance/segurança/observabilidade.
- Melhorar a testabilidade do sistema.
- Decidir quality gates.
- Mentorar profissionais.
- Traduzir risco técnico em impacto de negócio.

## Staff/Principal quando você consegue:

- Resolver problemas de qualidade que atravessam vários times.
- Criar plataformas/standards que reduzem custo de teste.
- Melhorar feedback e confiabilidade organizacional.
- Influenciar arquitetura e estratégia sem ser gargalo.

---

# 28. O QUE NÃO FAZER

- Não aprender ferramenta sem entender teste.
- Não estudar cinco frameworks de automação superficialmente.
- Não virar colecionador de certificados.
- Não colocar todos os testes no E2E.
- Não usar cobertura como sinônimo de qualidade.
- Não automatizar cenário ruim só porque é repetitivo.
- Não tratar teste manual como estágio inferior.
- Não tratar QA como gatekeeper único.
- Não ignorar produção.
- Não confiar em IA sem validação.
- Não decorar conceitos sem projeto real.

---

# 29. PRIORIDADE PARA O MERCADO BRASILEIRO EM 2026

Se o objetivo é empregabilidade como QA Engineer, priorize nesta ordem:

### Tier 1 — obrigatório

1. Fundamentos de teste e risco.
2. Teste funcional/exploratório.
3. API.
4. SQL.
5. Git.
6. Web/DevTools/HTTP.
7. Automação com Playwright/Cypress/Selenium.
8. Uma linguagem.
9. CI/CD.

### Tier 2 — diferencia muito

10. Docker.
11. Performance com k6/JMeter.
12. Contract testing.
13. Observabilidade/logs.
14. Microsserviços.
15. Segurança/OWASP.
16. Cloud.

### Tier 3 — Senior/Especialista

17. Kubernetes.
18. Mensageria/Kafka.
19. Reliability/resilience.
20. Test platform engineering.
21. Quality metrics.
22. IA/LLM testing.

---

# 30. FONTES E REFERÊNCIAS DA PESQUISA

## Roadmaps / formação

- roadmap.sh — QA Engineer Roadmap: https://roadmap.sh/qa
- ISTQB CTFL 4.0: https://www.istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/
- Ministry of Testing: https://www.ministryoftesting.com/

## Estratégia de testes / engenharia

- Google Testing Blog — Testing Pyramid / Critical User Journeys / SMURF: https://testing.googleblog.com/
- Google Cloud DevOps capabilities: https://cloud.google.com/architecture/devops
- Playwright Best Practices: https://playwright.dev/docs/best-practices
- Cypress Best Practices: https://docs.cypress.io/app/core-concepts/best-practices

## Não funcionais

- OWASP WSTG: https://wstg.owasp.org/
- OWASP API Security Top 10: https://api-security.owasp.org/
- WCAG: https://www.w3.org/WAI/standards-guidelines/wcag/
- Grafana k6: https://grafana.com/docs/k6/latest/

## Arquitetura / contratos / observabilidade

- Pact: https://docs.pact.io/
- OpenTelemetry: https://opentelemetry.io/docs/

## IA

- OWASP GenAI Security Project: https://genai.owasp.org/
- NIST AI Risk Management / TEVV: https://www.nist.gov/artificial-intelligence

## Mercado brasileiro consultado

A pesquisa de mercado considerou vagas recentes de QA Júnior, Pleno, Sênior e Lead/Principal no Brasil, incluindo repositório QA Brasil Vagas, LinkedIn e vagas de empresas brasileiras/internacionais contratando no país. Os padrões recorrentes observados foram API, SQL, automação web, linguagem de programação, Git/PR, CI/CD, performance, Docker/cloud, observabilidade e, nas posições mais seniores, estratégia e influência técnica.

---

# RESUMO EM UMA FRASE

> **QA Júnior aprende a encontrar problemas; QA Pleno aprende a construir feedback confiável; QA Sênior aprende a gerenciar risco; Staff/Principal aprende a desenhar sistemas e organizações que produzem qualidade continuamente.**
