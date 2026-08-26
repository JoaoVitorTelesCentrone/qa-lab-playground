# QA LAB — Roadmap Completo + Desafios

> Filosofia: você não conclui um conteúdo porque consumiu. Você conclui quando consegue provar que sabe aplicar.

## Tipos oficiais de desafio

- **INVESTIGATE** — encontrar causa, evidência ou origem de um problema.
- **TEST** — projetar, executar ou melhorar testes.
- **BUILD** — construir algo: automação, query, pipeline, cenário BDD etc.
- **DECIDE** — tomar uma decisão com informações incompletas e justificar.
- **COMMUNICATE** — comunicar uma situação profissional com clareza e contexto.

---

# 0. BASE — ENTENDENDO QUALIDADE

## O que é qualidade de software
- Conteúdo:
  - Conceito de qualidade
  - Qualidade percebida vs qualidade técnica
  - Adequação ao uso
- Desafios:
  - **DECIDE:** dado um produto com poucos bugs, mas UX ruim e lentidão, avaliar se ele pode ser considerado de qualidade.
  - **COMMUNICATE:** explicar para alguém de produto por que “sem bugs” não significa “alta qualidade”.

## O que é QA
- Conteúdo:
  - Papel do QA
  - QA ≠ tester
  - QA ≠ automação
- Desafios:
  - **DECIDE:** analisar 5 atividades e dizer quais pertencem ao papel de QA e por quê.
  - **COMMUNICATE:** explicar para um novo dev o papel do QA no time.entao 

## Quality Assurance vs Quality Control
- Desafios:
  - **DECIDE:** classificar exemplos reais entre prevenção e detecção.
  - **TEST:** sugerir uma ação de QA e uma ação de QC para uma feature de checkout.

## Teste vs qualidade
- Desafios:
  - **DECIDE:** apontar problemas de qualidade que não seriam descobertos apenas com testes funcionais.

## Custo de um bug
- Desafios:
  - **DECIDE:** priorizar 5 bugs considerando impacto, usuários afetados e momento de descoberta.
  - **COMMUNICATE:** justificar por que detectar um problema no refinamento é melhor que em produção.

## Defeito, erro, falha e bug
- Desafios:
  - **DECIDE:** classificar situações em erro humano, defeito no software e falha observável.

## Responsabilidade pela qualidade
- Desafios:
  - **COMMUNICATE:** responder a “qualidade é responsabilidade do QA”.
  - **DECIDE:** propor responsabilidades de qualidade para QA, dev, PO e design.

## Quality Engineering
- Desafios:
  - **DECIDE:** identificar práticas de Quality Engineering em um fluxo de desenvolvimento.
  - **BUILD:** propor melhorias para transformar um processo reativo em preventivo.

## SDLC
- Desafios:
  - **DECIDE:** indicar onde QA pode atuar em cada etapa do ciclo de desenvolvimento.

## STLC
- Desafios:
  - **BUILD:** montar um fluxo de testes para uma feature desde análise até encerramento.

## Shift Left
- Desafios:
  - **DECIDE:** identificar oportunidades de prevenção antes do código existir.
  - **COMMUNICATE:** sugerir ações de QA em um refinement.

## Shift Right
- Desafios:
  - **DECIDE:** escolher sinais e métricas para acompanhar uma feature após release.

## Continuous Testing
- Desafios:
  - **BUILD:** desenhar onde os testes devem rodar em uma pipeline de CI/CD.

---

# 1. FUNDAMENTALS

## 1.1 Fundamentos de testes

### Princípios de teste
- Desafios:
  - **DECIDE:** relacionar situações reais aos princípios de teste.
  - **COMMUNICATE:** explicar por que testar tudo é impossível.

### Níveis de teste
- Unitário
- Integração
- Sistema
- Aceitação
- Desafios:
  - **DECIDE:** escolher o nível ideal para 10 cenários.
  - **BUILD:** desenhar uma estratégia de cobertura por nível para um fluxo de login.

### Tipos de teste
- Funcional
- Não funcional
- Regressão
- Smoke
- Sanity
- Exploratório
- End-to-end
- Integração
- Compatibilidade
- Usabilidade
- Acessibilidade
- Performance
- Segurança
- Recuperação
- Instalação
- Localização
- Internacionalização
- Desafios:
  - **DECIDE:** identificar qual tipo de teste se aplica a cada situação.
  - **TEST:** montar um plano de testes misturando pelo menos 5 tipos de teste para um e-commerce.

### Teste positivo e negativo
- Desafios:
  - **TEST:** criar casos positivos e negativos para cadastro de usuário.

### Happy path / unhappy path
- Desafios:
  - **TEST:** mapear happy path e principais unhappy paths de uma compra.

---

## 1.2 Técnicas de teste

### Particionamento de equivalência
- Desafios:
  - **TEST:** reduzir um conjunto de dezenas de valores em classes representativas.

### Análise de valor limite
- Desafios:
  - **TEST:** criar casos para um campo que aceita valores de 1 a 100.

### Tabela de decisão
- Desafios:
  - **BUILD:** criar tabela de decisão para regras de frete e cupom.

### Transição de estados
- Desafios:
  - **BUILD:** modelar estados de uma conta: ativa, bloqueada, suspensa e encerrada.
  - **TEST:** derivar cenários a partir do modelo.

### Pairwise testing
- Desafios:
  - **TEST:** reduzir combinações de navegador, sistema operacional e perfil de usuário.

### Teste baseado em casos de uso
- Desafios:
  - **TEST:** derivar testes de um fluxo de saque.

### Error guessing
- Desafios:
  - **TEST:** listar cenários prováveis de falha sem usar documentação.

### Checklist-based testing
- Desafios:
  - **BUILD:** criar checklist de regressão para login e recuperação de senha.

### Testes exploratórios
- Desafios:
  - **TEST:** executar uma sessão exploratória de 20 minutos e registrar descobertas.

### Session-based testing
- Desafios:
  - **BUILD:** criar charter, objetivo e relatório de uma sessão.

### Heurísticas de teste
- Desafios:
  - **TEST:** aplicar heurísticas a uma tela de transferência bancária.

### Teste baseado em risco
- Desafios:
  - **DECIDE:** priorizar testes usando probabilidade x impacto.

---

## 1.3 Casos e cenários de teste

### Cenário de teste
- Desafios:
  - **BUILD:** criar cenários de alto nível para checkout.

### Caso de teste
- Desafios:
  - **BUILD:** escrever casos completos com pré-condição, steps e expected result.

### Pré-condições
- Desafios:
  - **TEST:** identificar pré-condições ausentes em casos já escritos.

### Evidências
- Desafios:
  - **COMMUNICATE:** selecionar evidências adequadas para diferentes tipos de falha.

### Casos positivos e negativos
- Desafios:
  - **TEST:** transformar 5 requisitos em casos positivos e negativos.

### Quando não escrever casos de teste
- Desafios:
  - **DECIDE:** escolher entre caso formal, checklist e exploração para diferentes situações.

### Checklist vs test case
- Desafios:
  - **DECIDE:** escolher o formato ideal para uma regressão rápida.

### Test suite
- Desafios:
  - **BUILD:** organizar 30 casos em suites coerentes.

### Test plan
- Desafios:
  - **BUILD:** criar um plano de testes para uma pequena release.

### Test execution
- Desafios:
  - **TEST:** executar uma suite e registrar resultados.

### Test cycle
- Desafios:
  - **BUILD:** montar um ciclo de testes do início ao fim.

---

## 1.4 Requisitos

### Requisitos funcionais
- Desafios:
  - **TEST:** derivar cenários de um requisito funcional.

### Requisitos não funcionais
- Desafios:
  - **DECIDE:** identificar NFRs ausentes em uma história.

### Critérios de aceite
- Desafios:
  - **BUILD:** escrever critérios de aceite claros para uma user story.

### User stories
- Desafios:
  - **TEST:** revisar uma história e apontar ambiguidades.

### Definition of Ready
- Desafios:
  - **BUILD:** criar DoR para o time.

### Definition of Done
- Desafios:
  - **BUILD:** criar DoD incluindo qualidade e testes.

### Requisitos ambíguos
- Desafios:
  - **INVESTIGATE:** identificar frases ambíguas e formular perguntas.

### Requisitos incompletos
- Desafios:
  - **INVESTIGATE:** encontrar informações faltantes em uma especificação.

### Revisão de história
- Desafios:
  - **TEST:** revisar uma história antes do desenvolvimento e gerar cenários.

### Testabilidade de requisitos
- Desafios:
  - **DECIDE:** avaliar se um requisito é testável e reescrevê-lo.

---

## 1.5 BDD

### O que é BDD
- Desafios:
  - **COMMUNICATE:** explicar BDD sem tratar como apenas sintaxe.

### Given / When / Then
- Desafios:
  - **BUILD:** escrever cenários para recuperação de senha.

### Gherkin
- Desafios:
  - **BUILD:** corrigir cenários Gherkin mal escritos.

### Feature
- Desafios:
  - **BUILD:** estruturar um arquivo de feature completo.

### Scenario
- Desafios:
  - **BUILD:** criar cenários independentes e claros.

### Scenario Outline
- Desafios:
  - **BUILD:** transformar cenários repetidos em Outline.

### Examples
- Desafios:
  - **BUILD:** criar massa de exemplos representativa.

### Background
- Desafios:
  - **DECIDE:** identificar quando usar e quando evitar Background.

### Tags
- Desafios:
  - **BUILD:** organizar cenários por smoke, regression e feature.

### BDD mal utilizado
- Desafios:
  - **INVESTIGATE:** revisar uma feature gigante e apontar anti-patterns.

### BDD vs TDD
- Desafios:
  - **COMMUNICATE:** diferenciar as abordagens com um exemplo prático.

### Specification by Example
- Desafios:
  - **BUILD:** transformar regra de negócio em exemplos executáveis.

### Living Documentation
- Desafios:
  - **DECIDE:** avaliar quando uma suite BDD serve como documentação viva.

---

## 1.6 Bugs

### O que é bug
- Desafios:
  - **DECIDE:** classificar situações como bug, melhoria, comportamento esperado ou requisito ausente.

### Bug report
- Desafios:
  - **BUILD:** registrar um bug realista completo.

### Título
- Desafios:
  - **COMMUNICATE:** melhorar 10 títulos ruins de bug.

### Steps to reproduce
- Desafios:
  - **BUILD:** escrever passos mínimos e reproduzíveis.

### Expected vs actual
- Desafios:
  - **COMMUNICATE:** reescrever resultados vagos.

### Evidências
- Desafios:
  - **DECIDE:** escolher screenshot, vídeo, log ou request conforme o problema.

### Logs
- Desafios:
  - **INVESTIGATE:** localizar o trecho relevante de um log.

### Severity
- Desafios:
  - **DECIDE:** definir severidade para cenários reais.

### Priority
- Desafios:
  - **DECIDE:** priorizar bugs considerando negócio e usuários.

### Bug crítico / bloqueante / cosmético
- Desafios:
  - **DECIDE:** classificar 10 bugs e justificar.

### Bug lifecycle
- Desafios:
  - **BUILD:** representar o ciclo do bug dentro de um time.

### Bug triage
- Desafios:
  - **DECIDE:** conduzir uma triagem com 8 bugs e tempo limitado.

### Reabrir bug
- Desafios:
  - **DECIDE:** avaliar se um bug deve ser reaberto.

### Bug duplicado
- Desafios:
  - **INVESTIGATE:** comparar bugs e detectar duplicidade.

### Cannot reproduce
- Desafios:
  - **INVESTIGATE:** propor passos de investigação quando não é possível reproduzir.

### Won't fix
- Desafios:
  - **DECIDE:** analisar trade-offs e decidir se vale corrigir.

### Root Cause Analysis
- Desafios:
  - **INVESTIGATE:** fazer RCA de um defeito que chegou em produção.

---

## 1.7 Web

### Frontend / backend / cliente / servidor
- Desafios:
  - **DECIDE:** identificar onde provavelmente está a origem de diferentes falhas.

### HTTP / HTTPS
- Desafios:
  - **INVESTIGATE:** analisar request e response de um problema.

### Request / Response
- Desafios:
  - **TEST:** validar uma requisição de login.

### Headers
- Desafios:
  - **INVESTIGATE:** encontrar token, content-type e cache headers.

### Cookies / Sessions / LocalStorage
- Desafios:
  - **TEST:** testar persistência e expiração de sessão.

### Status codes
- Desafios:
  - **DECIDE:** escolher status codes adequados para cenários de API.

### GET / POST / PUT / PATCH / DELETE
- Desafios:
  - **TEST:** executar operações CRUD em uma API.

### DevTools
- Desafios:
  - **INVESTIGATE:** descobrir a causa de uma falha usando Network e Console.

### Cache
- Desafios:
  - **INVESTIGATE:** reproduzir e explicar um bug causado por cache.

### Responsividade
- Desafios:
  - **TEST:** testar uma tela em diferentes breakpoints.

### Cross-browser
- Desafios:
  - **TEST:** criar matriz de compatibilidade e executar testes.

---

## 1.8 APIs

### API / REST / RESTful
- Desafios:
  - **COMMUNICATE:** explicar API REST usando um fluxo real.

### Endpoint
- Desafios:
  - **TEST:** identificar endpoints necessários para testar um fluxo.

### JSON
- Desafios:
  - **INVESTIGATE:** encontrar erros em payloads JSON.

### Params / Query / Path
- Desafios:
  - **TEST:** montar chamadas usando cada tipo de parâmetro.

### Body
- Desafios:
  - **TEST:** criar payloads válidos e inválidos.

### Authentication
- Desafios:
  - **TEST:** autenticar em API e validar falhas.

### Authorization
- Desafios:
  - **TEST:** tentar acessar recurso de outro usuário.

### Token / JWT
- Desafios:
  - **INVESTIGATE:** analisar claims e expiração.

### OAuth
- Desafios:
  - **TEST:** descrever e validar um fluxo OAuth.

### Postman / Insomnia
- Desafios:
  - **BUILD:** montar collection de testes.

### Swagger / OpenAPI
- Desafios:
  - **TEST:** derivar cenários a partir da documentação.

### Contract testing
- Desafios:
  - **BUILD:** validar contrato de resposta.

### Schema validation
- Desafios:
  - **TEST:** validar tipos e campos obrigatórios.

### API chaining
- Desafios:
  - **BUILD:** encadear login → criação → consulta → exclusão.

### Testes negativos
- Desafios:
  - **TEST:** criar bateria de cenários inválidos.

### Rate limit
- Desafios:
  - **TEST:** validar comportamento ao exceder limite.

### Idempotência
- Desafios:
  - **TEST:** validar requisições duplicadas de pagamento.

### Mock / Stub
- Desafios:
  - **DECIDE:** escolher quando usar mock ou integração real.

---

## 1.9 Banco de dados

### Conceitos básicos
- Desafios:
  - **DECIDE:** identificar tabelas e relações em um modelo simples.

### Primary key / Foreign key
- Desafios:
  - **BUILD:** modelar relacionamentos básicos.

### SELECT
- Desafios:
  - **BUILD:** consultar usuários e pedidos.

### WHERE
- Desafios:
  - **BUILD:** filtrar registros específicos.

### ORDER BY
- Desafios:
  - **BUILD:** ordenar resultados.

### GROUP BY
- Desafios:
  - **BUILD:** agregar dados.

### JOIN
- Desafios:
  - **BUILD:** unir usuários, pedidos e pagamentos.

### INSERT / UPDATE / DELETE
- Desafios:
  - **BUILD:** manipular dados de teste com segurança.

### Persistência
- Desafios:
  - **TEST:** validar se alteração na UI persistiu corretamente.

### Integridade
- Desafios:
  - **INVESTIGATE:** encontrar dados órfãos ou inconsistentes.

### Frontend x banco
- Desafios:
  - **INVESTIGATE:** comparar valor exibido com valor persistido.

### Transações / rollback
- Desafios:
  - **TEST:** validar que uma operação parcial não deixa dados inconsistentes.

---

## 1.10 Git

### Versionamento
- Desafios:
  - **COMMUNICATE:** explicar por que versionamento ajuda QA.

### Repository / commit / branch
- Desafios:
  - **BUILD:** criar branch e commits para uma automação.

### Merge / Pull Request
- Desafios:
  - **BUILD:** abrir PR com teste automatizado.

### Clone / pull / push / checkout
- Desafios:
  - **BUILD:** executar fluxo básico em repositório.

### Merge conflict
- Desafios:
  - **INVESTIGATE:** resolver conflito simples.

### Gitflow
- Desafios:
  - **DECIDE:** escolher fluxo de branches para um time.

### QA em Pull Request
- Desafios:
  - **TEST:** revisar um PR sob a ótica de qualidade.

---

## 1.11 Automação

### O que automatizar
- Desafios:
  - **DECIDE:** selecionar cenários para automação.

### O que não automatizar
- Desafios:
  - **DECIDE:** justificar por que certos cenários não valem o custo.

### ROI de automação
- Desafios:
  - **DECIDE:** calcular benefício esperado de automatizar um fluxo.

### Pirâmide de testes
- Desafios:
  - **BUILD:** distribuir cobertura entre unit, integration e E2E.

### Troféu de testes
- Desafios:
  - **DECIDE:** comparar estratégia com pirâmide.

### Strategy
- Desafios:
  - **BUILD:** criar estratégia de automação para e-commerce.

### Assertions
- Desafios:
  - **BUILD:** escrever assertions relevantes.

### Selectors / Locators
- Desafios:
  - **INVESTIGATE:** corrigir seletores frágeis.

### Fixtures
- Desafios:
  - **BUILD:** criar dados reutilizáveis.

### Hooks
- Desafios:
  - **BUILD:** organizar setup e teardown.

### Page Object Model
- Desafios:
  - **BUILD:** refatorar testes duplicados para POM.

### Data-driven testing
- Desafios:
  - **BUILD:** parametrizar cenários.

### Test isolation
- Desafios:
  - **INVESTIGATE:** identificar dependência entre testes.

### Flaky tests
- Desafios:
  - **INVESTIGATE:** encontrar e corrigir causa de flakiness.

### Waits / timeouts
- Desafios:
  - **INVESTIGATE:** substituir waits fixos por esperas adequadas.

### Testes lentos
- Desafios:
  - **DECIDE:** otimizar suite mantendo cobertura.

### Massa de dados
- Desafios:
  - **BUILD:** criar estratégia de setup e cleanup.

### Cypress
- Desafios:
  - **BUILD:** automatizar fluxo crítico.

### Playwright
- Desafios:
  - **BUILD:** automatizar fluxo multi-browser.

### Selenium
- Desafios:
  - **BUILD:** criar cenário UI básico.

### Appium
- Desafios:
  - **BUILD:** automatizar fluxo mobile.

### REST Assured
- Desafios:
  - **BUILD:** automatizar testes de API.

### Postman/Newman
- Desafios:
  - **BUILD:** executar collection em linha de comando.

---

## 1.12 CI/CD

### CI / Delivery / Deployment
- Desafios:
  - **COMMUNICATE:** diferenciar os três conceitos.

### Pipeline
- Desafios:
  - **BUILD:** criar pipeline de testes.

### Build / Stage / Job
- Desafios:
  - **BUILD:** organizar pipeline em etapas.

### Testes na pipeline
- Desafios:
  - **BUILD:** integrar testes automatizados.

### Quality Gate
- Desafios:
  - **DECIDE:** definir critérios para bloquear merge.

### Testes em PR
- Desafios:
  - **BUILD:** configurar execução automática em pull request.

### Smoke após deploy
- Desafios:
  - **BUILD:** criar suite de smoke pós-deploy.

### Regressão automatizada
- Desafios:
  - **DECIDE:** definir quando executar regressão completa.

### GitHub Actions
- Desafios:
  - **BUILD:** criar workflow funcional.

### GitLab CI
- Desafios:
  - **BUILD:** criar job de testes.

### Jenkins
- Desafios:
  - **BUILD:** configurar pipeline simples.

### Azure DevOps
- Desafios:
  - **BUILD:** integrar testes ao pipeline.

---

## 1.13 Performance

### Performance testing
- Desafios:
  - **BUILD:** definir plano de performance.

### Load testing
- Desafios:
  - **TEST:** simular carga esperada.

### Stress testing
- Desafios:
  - **TEST:** encontrar limite do sistema.

### Spike testing
- Desafios:
  - **TEST:** simular pico súbito.

### Endurance testing
- Desafios:
  - **TEST:** testar degradação ao longo do tempo.

### Volume testing
- Desafios:
  - **TEST:** validar alto volume de dados.

### Throughput / latência / response time / percentis
- Desafios:
  - **INVESTIGATE:** interpretar relatório de performance.

### JMeter
- Desafios:
  - **BUILD:** criar plano de carga.

### k6
- Desafios:
  - **BUILD:** criar script e thresholds.

---

## 1.14 Segurança

### Fundamentos
- Desafios:
  - **DECIDE:** identificar riscos básicos em uma feature.

### Authentication
- Desafios:
  - **TEST:** validar login e sessão.

### Authorization
- Desafios:
  - **TEST:** validar controle de acesso horizontal e vertical.

### SQL Injection
- Desafios:
  - **TEST:** identificar entrada vulnerável em ambiente controlado.

### XSS
- Desafios:
  - **TEST:** validar tratamento de entrada em ambiente seguro.

### CSRF
- Desafios:
  - **DECIDE:** reconhecer cenários suscetíveis.

### Broken Access Control
- Desafios:
  - **TEST:** tentar acessar recurso sem permissão.

### OWASP Top 10
- Desafios:
  - **DECIDE:** mapear vulnerabilidades a categorias OWASP.

### Dados sensíveis
- Desafios:
  - **INVESTIGATE:** identificar exposição indevida em logs e responses.

---

## 1.15 Acessibilidade

### WCAG
- Desafios:
  - **DECIDE:** identificar critérios aplicáveis a uma página.

### Teclado
- Desafios:
  - **TEST:** navegar por fluxo sem mouse.

### Screen reader
- Desafios:
  - **TEST:** validar leitura básica.

### Contraste
- Desafios:
  - **TEST:** verificar contraste de elementos.

### Labels
- Desafios:
  - **TEST:** identificar campos sem label adequado.

### Alt text
- Desafios:
  - **TEST:** revisar imagens e textos alternativos.

### Acessibilidade como qualidade
- Desafios:
  - **COMMUNICATE:** defender correção de falha de acessibilidade.

---

## 1.16 Mobile

### Android vs iOS
- Desafios:
  - **DECIDE:** identificar diferenças relevantes para testes.

### Nativo / PWA
- Desafios:
  - **DECIDE:** adaptar estratégia conforme tecnologia.

### Diferentes telas
- Desafios:
  - **TEST:** criar matriz de dispositivos.

### Orientação
- Desafios:
  - **TEST:** validar portrait e landscape.

### Permissões
- Desafios:
  - **TEST:** testar conceder, negar e revogar permissões.

### Notificações
- Desafios:
  - **TEST:** validar recebimento e abertura.

### Conectividade
- Desafios:
  - **TEST:** simular 3G, perda de rede e reconexão.

### Offline
- Desafios:
  - **TEST:** validar comportamento sem internet.

### Interrupções
- Desafios:
  - **TEST:** receber ligação, trocar app e voltar.

### Instalação / atualização
- Desafios:
  - **TEST:** validar upgrade sem perda de dados.

---

## 1.17 Métricas

### Test coverage
- Desafios:
  - **INVESTIGATE:** interpretar cobertura e identificar falsa sensação de segurança.

### Requirement coverage
- Desafios:
  - **BUILD:** mapear requisitos para testes.

### Defect density
- Desafios:
  - **INVESTIGATE:** comparar módulos por densidade.

### Defect leakage / escape rate
- Desafios:
  - **INVESTIGATE:** calcular e interpretar vazamento.

### Reopen rate
- Desafios:
  - **INVESTIGATE:** identificar possíveis causas de taxa alta.

### Automation coverage
- Desafios:
  - **DECIDE:** avaliar se percentual de automação representa qualidade.

### Pass rate / failure rate
- Desafios:
  - **INVESTIGATE:** interpretar dashboard de execução.

### Flaky rate
- Desafios:
  - **INVESTIGATE:** medir impacto de flakiness.

### MTTR
- Desafios:
  - **INVESTIGATE:** calcular tempo médio de recuperação.

### Lead time
- Desafios:
  - **INVESTIGATE:** analisar impacto da qualidade no fluxo.

### Métricas ruins / vanity metrics
- Desafios:
  - **DECIDE:** apontar métricas que incentivam comportamento errado.

### Medir qualidade sem contar bugs
- Desafios:
  - **BUILD:** propor dashboard de qualidade com métricas úteis.

---

# 2. REAL LIFE

## 2.1 Trabalhando em times

### Scrum
- Desafios:
  - **DECIDE:** definir atuação do QA em cada cerimônia.

### Kanban
- Desafios:
  - **DECIDE:** propor políticas de qualidade no fluxo.

### Daily
- Desafios:
  - **COMMUNICATE:** fazer atualização objetiva sem transformar daily em status report.

### Planning
- Desafios:
  - **DECIDE:** apontar riscos antes de assumir compromisso.

### Refinement
- Desafios:
  - **INVESTIGATE:** encontrar lacunas em uma história.

### Review
- Desafios:
  - **COMMUNICATE:** apresentar qualidade da entrega sem focar só em bugs.

### Retrospectiva
- Desafios:
  - **COMMUNICATE:** propor melhoria de processo baseada em evidência.

### QA + Dev
- Desafios:
  - **COMMUNICATE:** resolver discordância sobre defeito.

### QA + PO
- Desafios:
  - **DECIDE:** negociar risco e prioridade.

### QA + UX
- Desafios:
  - **COMMUNICATE:** discutir usabilidade com base em impacto.

### QA + Suporte
- Desafios:
  - **INVESTIGATE:** transformar relato de cliente em cenário reproduzível.

---

## 2.2 Refinamento

### Participação no refinement
- Desafios:
  - **COMMUNICATE:** formular perguntas relevantes.

### Perguntas do QA
- Desafios:
  - **BUILD:** criar lista de perguntas para uma feature.

### Casos esquecidos
- Desafios:
  - **INVESTIGATE:** encontrar cenários não cobertos.

### Riscos
- Desafios:
  - **DECIDE:** classificar riscos antes do desenvolvimento.

### Critérios de aceite
- Desafios:
  - **BUILD:** melhorar critérios incompletos.

### Prevenção
- Desafios:
  - **DECIDE:** sugerir mudanças que evitem defeitos futuros.

---

## 2.3 Mudança de requisito

### Durante desenvolvimento
- Desafios:
  - **DECIDE:** atualizar escopo de testes.

### Durante teste
- Desafios:
  - **DECIDE:** analisar impacto e regressão necessária.

### Antes da release
- Desafios:
  - **DECIDE:** decidir se release deve ser mantida.

### Impact analysis
- Desafios:
  - **BUILD:** mapear funcionalidades potencialmente afetadas.

### Reteste
- Desafios:
  - **DECIDE:** escolher o que retestar.

### Regressão
- Desafios:
  - **DECIDE:** escolher cobertura mínima sob tempo limitado.

---

## 2.4 Priorização

### Não dá para testar tudo
- Desafios:
  - **DECIDE:** escolher 10 de 30 cenários para uma release em 2 horas.

### Probabilidade x impacto
- Desafios:
  - **BUILD:** construir matriz de risco.

### Funcionalidade crítica
- Desafios:
  - **DECIDE:** identificar fluxos críticos do produto.

### Tempo limitado
- Desafios:
  - **DECIDE:** montar estratégia de testes de 60 minutos.

### Release urgente
- Desafios:
  - **COMMUNICATE:** comunicar cobertura e riscos residuais.

---

## 2.5 Produção

### Bug em produção
- Desafios:
  - **INVESTIGATE:** reproduzir e coletar evidências.

### Bug crítico
- Desafios:
  - **DECIDE:** escolher entre hotfix, rollback ou mitigação.

### Hotfix
- Desafios:
  - **TEST:** definir testes mínimos antes de subir.

### Rollback
- Desafios:
  - **DECIDE:** avaliar quando reverter.

### Incident
- Desafios:
  - **INVESTIGATE:** atuar em timeline de incidente.

### Post-mortem
- Desafios:
  - **BUILD:** elaborar post-mortem sem culpabilização.

### RCA
- Desafios:
  - **INVESTIGATE:** chegar à causa raiz.

### Monitoramento
- Desafios:
  - **DECIDE:** escolher sinais para detectar regressão.

### Logs
- Desafios:
  - **INVESTIGATE:** localizar erro em logs.

---

## 2.6 Ambientes

### DEV / QA / Staging / Homologação / Produção
- Desafios:
  - **DECIDE:** escolher ambiente adequado para cada tipo de teste.

### Diferenças entre ambientes
- Desafios:
  - **INVESTIGATE:** descobrir por que funciona em QA e falha em produção.

### Configuração
- Desafios:
  - **INVESTIGATE:** identificar variável incorreta.

### Feature flags
- Desafios:
  - **TEST:** testar combinações ligada/desligada.

### Dados inconsistentes
- Desafios:
  - **INVESTIGATE:** encontrar divergência de massa.

### Ambiente quebrado
- Desafios:
  - **COMMUNICATE:** registrar bloqueio com evidência e impacto.

### Dependências externas
- Desafios:
  - **DECIDE:** definir mock, sandbox ou integração real.

---

## 2.7 Massa de dados

### Criar dados
- Desafios:
  - **BUILD:** gerar massa válida e inválida.

### Limpar dados
- Desafios:
  - **BUILD:** definir cleanup seguro.

### Dados compartilhados
- Desafios:
  - **INVESTIGATE:** resolver conflito entre testes.

### Seed
- Desafios:
  - **BUILD:** criar conjunto previsível de dados.

### Mock
- Desafios:
  - **BUILD:** mockar dependência externa.

### Test accounts
- Desafios:
  - **BUILD:** organizar perfis de teste.

### Dados sensíveis
- Desafios:
  - **DECIDE:** identificar o que não pode ser usado.

### LGPD
- Desafios:
  - **COMMUNICATE:** orientar uso seguro de dados em ambiente de teste.

---

## 2.8 Manutenção

### Testes antigos
- Desafios:
  - **DECIDE:** decidir manter, atualizar ou excluir.

### Testes quebrados
- Desafios:
  - **INVESTIGATE:** identificar se falha é produto ou teste.

### Automação abandonada
- Desafios:
  - **BUILD:** criar plano de recuperação da suite.

### Refatoração
- Desafios:
  - **BUILD:** reduzir duplicação em testes.

### Flaky tests
- Desafios:
  - **INVESTIGATE:** corrigir top 3 causas.

### Suite gigante
- Desafios:
  - **DECIDE:** separar smoke, regression e E2E.

### Débito técnico
- Desafios:
  - **COMMUNICATE:** justificar investimento em manutenção.

### Quando apagar testes
- Desafios:
  - **DECIDE:** excluir testes sem perder cobertura importante.

---

## 2.9 Sistemas legados

### Sem documentação
- Desafios:
  - **INVESTIGATE:** descobrir comportamento via exploração.

### Sem testes
- Desafios:
  - **BUILD:** criar primeira camada de segurança.

### Código antigo
- Desafios:
  - **DECIDE:** priorizar cobertura antes de mudança.

### Dependências antigas
- Desafios:
  - **INVESTIGATE:** identificar risco de atualização.

### Characterization testing
- Desafios:
  - **BUILD:** documentar comportamento existente por testes.

### Migração
- Desafios:
  - **TEST:** montar estratégia de comparação antigo x novo.

---

## 2.10 Releases

### Release strategy
- Desafios:
  - **BUILD:** definir estratégia de release.

### Release checklist
- Desafios:
  - **BUILD:** criar checklist obrigatório.

### Go / No-Go
- Desafios:
  - **DECIDE:** decidir liberação com bugs conhecidos.

### Smoke test
- Desafios:
  - **TEST:** definir smoke mínimo.

### Regression
- Desafios:
  - **TEST:** escolher regressão proporcional ao risco.

### Rollback plan
- Desafios:
  - **BUILD:** montar plano de reversão.

### Feature flag
- Desafios:
  - **DECIDE:** usar flag para reduzir risco.

### Canary
- Desafios:
  - **DECIDE:** definir critérios de avanço.

### Blue/Green
- Desafios:
  - **COMMUNICATE:** explicar estratégia ao time.

### Pós-release
- Desafios:
  - **BUILD:** definir monitoramento inicial.

---

## 2.11 Situações reais

### “Funciona na minha máquina”
- **COMMUNICATE:** responder sem confronto e pedir evidências.

### “Não consigo reproduzir”
- **INVESTIGATE:** criar plano de reprodução.

### “Isso não é bug”
- **COMMUNICATE:** argumentar com requisito, impacto e evidência.

### “Sempre funcionou assim”
- **DECIDE:** diferenciar comportamento legado de comportamento correto.

### “Não temos tempo para testar”
- **DECIDE:** propor cobertura mínima baseada em risco.

### “Vai para produção assim mesmo”
- **COMMUNICATE:** registrar riscos e critérios de aceite.

### “Testa rapidinho”
- **DECIDE:** definir escopo mínimo.

### “Mudamos só uma coisinha”
- **INVESTIGATE:** fazer análise de impacto.

### “O usuário nunca vai fazer isso”
- **COMMUNICATE:** defender cenário com dados ou risco.

### “Depois automatizamos”
- **DECIDE:** avaliar custo de adiar.

### “QA testa no final”
- **COMMUNICATE:** propor shift-left.

### “Está aprovado pelo PO”
- **DECIDE:** separar aceite de negócio de qualidade técnica.

---

# 3. SOFT SKILLS

## 3.1 Comunicação

### Comunicação clara
- **COMMUNICATE:** explicar um bug crítico em até 5 linhas.

### Comunicação objetiva
- **COMMUNICATE:** resumir uma investigação longa para daily.

### Comunicação escrita
- **COMMUNICATE:** escrever atualização de incidente.

### Explicar bugs
- **COMMUNICATE:** explicar bug para dev e para negócio em versões diferentes.

### Explicar riscos
- **COMMUNICATE:** comunicar risco sem alarmismo.

### Adaptar linguagem
- **COMMUNICATE:** explicar o mesmo problema para dev, PO e cliente.

### Técnica vs negócio
- **COMMUNICATE:** traduzir impacto técnico em impacto de negócio.

### Comunicação não acusatória
- **COMMUNICATE:** reescrever mensagens agressivas de QA.

---

## 3.2 Fazer perguntas

### Saber perguntar
- **COMMUNICATE:** criar perguntas úteis para requisito incompleto.

### Perguntas abertas
- **COMMUNICATE:** conduzir descoberta de comportamento esperado.

### Perguntas fechadas
- **COMMUNICATE:** confirmar regra específica.

### Questionar requisitos
- **COMMUNICATE:** questionar sem soar confrontador.

### Encontrar informação faltante
- **INVESTIGATE:** listar perguntas antes de testar.

---

## 3.3 Feedback

### Dar feedback
- **COMMUNICATE:** dar feedback a um colega sobre falhas recorrentes.

### Receber feedback
- **DECIDE:** escolher resposta adequada a uma crítica.

### Criticar ideias
- **COMMUNICATE:** discordar de abordagem sem atacar pessoa.

### Feedback para dev
- **COMMUNICATE:** sugerir melhoria de testabilidade.

### Feedback para produto
- **COMMUNICATE:** apontar risco de requisito.

---

## 3.4 Conflitos

### QA x Dev
- **COMMUNICATE:** resolver discordância sobre bug.

### QA x PO
- **COMMUNICATE:** negociar release com risco.

### Severidade
- **DECIDE:** justificar severidade com critérios objetivos.

### Prioridade
- **DECIDE:** separar severidade técnica de prioridade de negócio.

### Defender qualidade
- **COMMUNICATE:** sustentar posição com evidência.

### Saber ceder
- **DECIDE:** reconhecer quando risco é aceitável.

---

## 3.5 Negociação

### Escopo
- **DECIDE:** negociar cobertura com tempo reduzido.

### Prazo
- **COMMUNICATE:** responder a pedido impossível sem apenas dizer “não”.

### Cobertura
- **DECIDE:** propor cobertura mínima.

### Qualidade
- **COMMUNICATE:** explicitar trade-offs.

### Trade-offs
- **DECIDE:** escolher entre prazo, cobertura e risco.

### Argumentação por risco
- **COMMUNICATE:** defender prioridade usando probabilidade x impacto.

---

## 3.6 Influência

### Sem autoridade formal
- **COMMUNICATE:** conseguir adesão a uma melhoria de processo.

### Influenciar decisões
- **COMMUNICATE:** defender mudança de release strategy.

### Usar dados
- **BUILD:** preparar argumento com métricas.

### Construir confiança
- **DECIDE:** escolher comportamentos que aumentam credibilidade.

### Ser ouvido
- **COMMUNICATE:** apresentar risco em reunião de forma objetiva.

---

## 3.7 Ownership

### Não esperar tarefas
- **DECIDE:** identificar ações proativas em uma sprint.

### Identificar problemas
- **INVESTIGATE:** apontar gargalos no processo.

### Propor soluções
- **BUILD:** criar plano de melhoria.

### Acompanhar problemas
- **BUILD:** definir follow-up até resolução.

### Assumir responsabilidade
- **DECIDE:** escolher como agir após erro próprio.

### Pensar além do ticket
- **DECIDE:** identificar impacto sistêmico de uma mudança.

---

## 3.8 Organização

### Prioridades
- **DECIDE:** ordenar tarefas conflitantes.

### Gestão de tempo
- **BUILD:** montar plano de trabalho para uma sprint.

### Context switching
- **DECIDE:** lidar com interrupções sem abandonar prioridades.

### Organização de testes
- **BUILD:** estruturar suites e evidências.

### Documentação
- **BUILD:** documentar conhecimento de forma reutilizável.

---

## 3.9 Colaboração

### Pair testing
- **TEST:** executar sessão em dupla com objetivos claros.

### Three Amigos
- **COMMUNICATE:** conduzir discussão entre negócio, dev e QA.

### QA + Dev
- **BUILD:** criar estratégia conjunta de cobertura.

### QA + Produto
- **DECIDE:** alinhar risco e valor.

### QA + Design
- **TEST:** revisar protótipo antes do desenvolvimento.

### QA + Suporte
- **INVESTIGATE:** transformar ticket de suporte em reprodução técnica.

---

## 3.10 Liderança

### Mentoria
- **COMMUNICATE:** orientar QA júnior em investigação.

### Code review de testes
- **TEST:** revisar automação de outro QA.

### Criar padrões
- **BUILD:** definir padrão de bug report ou automação.

### Melhorar processos
- **BUILD:** propor melhoria baseada em problema real.

### Facilitar discussões
- **COMMUNICATE:** conduzir reunião com opiniões conflitantes.

### Liderança sem cargo
- **DECIDE:** agir como referência sem autoridade formal.

### Desenvolver outros QAs
- **BUILD:** montar plano de desenvolvimento para colega.

---

# 4. QA THINKING

## 4.1 Pensamento crítico

### Não aceitar requisito cegamente
- **INVESTIGATE:** encontrar premissas escondidas.

### Questionar premissas
- **COMMUNICATE:** formular perguntas que desafiem suposições.

### Buscar evidências
- **INVESTIGATE:** distinguir opinião de evidência.

### Causa vs correlação
- **DECIDE:** analisar dados e evitar conclusão precipitada.

### Consequências
- **DECIDE:** antecipar efeitos de uma mudança.

---

## 4.2 Pensamento de risco

### O que pode dar errado?
- **TEST:** listar falhas possíveis em uma transferência.

### Probabilidade
- **DECIDE:** estimar chance de ocorrência.

### Impacto
- **DECIDE:** estimar impacto técnico e de negócio.

### Usuários afetados
- **DECIDE:** priorizar com base em alcance.

### Pior cenário
- **DECIDE:** identificar cenários catastróficos.

### Irreversibilidade
- **DECIDE:** diferenciar falhas recuperáveis e irreversíveis.

---

## 4.3 Edge Cases

### Valores mínimos
- **TEST:** testar mínimo permitido e abaixo dele.

### Valores máximos
- **TEST:** testar máximo permitido e acima dele.

### Zero
- **TEST:** validar zero em campos numéricos.

### Negativos
- **TEST:** validar valores negativos.

### Null
- **TEST:** testar ausência real de valor.

### Vazio
- **TEST:** testar string vazia e whitespace.

### Texto enorme
- **TEST:** testar limites de tamanho.

### Caracteres especiais
- **TEST:** testar acentos, emojis e símbolos.

### Datas
- **TEST:** testar virada de mês, ano bissexto e limites.

### Fusos horários
- **TEST:** validar comportamento entre zonas.

### Concorrência
- **TEST:** executar ações simultâneas.

### Duplo clique
- **TEST:** validar duplicidade.

### Refresh
- **TEST:** atualizar página no meio de fluxo.

### Voltar página
- **TEST:** navegar para trás e retomar.

### Internet cair
- **TEST:** interromper request em andamento.

### Sessão expirar
- **TEST:** validar comportamento após expiração.

---

## 4.4 Pensamento sistêmico

### Impacto de mudança
- **INVESTIGATE:** mapear áreas afetadas.

### Dependências
- **BUILD:** criar mapa de dependências.

### Integrações
- **TEST:** testar falhas entre serviços.

### Efeitos colaterais
- **INVESTIGATE:** encontrar regressões indiretas.

### Sistemas distribuídos
- **DECIDE:** identificar pontos de falha.

### Eventos assíncronos
- **TEST:** validar processamento tardio e duplicado.

### Consistência eventual
- **TEST:** validar estados intermediários.

---

## 4.5 Investigação

### Reproduzir problema
- **INVESTIGATE:** construir caminho mínimo de reprodução.

### Isolar variáveis
- **INVESTIGATE:** alterar uma variável por vez.

### Criar hipóteses
- **INVESTIGATE:** listar possíveis causas.

### Testar hipóteses
- **INVESTIGATE:** eliminar causas uma a uma.

### Logs
- **INVESTIGATE:** localizar evidência.

### DevTools
- **INVESTIGATE:** analisar Network e Console.

### Banco
- **INVESTIGATE:** validar estado persistido.

### Ambientes
- **INVESTIGATE:** comparar comportamentos.

### Causa raiz
- **INVESTIGATE:** chegar além do sintoma.

---

## 4.6 Testabilidade

### Logs
- **DECIDE:** sugerir logs que facilitariam investigação.

### IDs
- **BUILD:** propor identificadores rastreáveis.

### Feature flags
- **BUILD:** usar flags para testar cenários.

### APIs
- **DECIDE:** propor interfaces que facilitem validação.

### Observabilidade
- **BUILD:** definir métricas e logs úteis.

### Dados controláveis
- **BUILD:** permitir setup previsível.

### Mocks
- **BUILD:** simular dependências.

### Dependency Injection
- **DECIDE:** explicar como melhora testabilidade.

---

## 4.7 Estratégia

### O que testar?
- **DECIDE:** selecionar cenários com maior retorno.

### Quanto testar?
- **DECIDE:** definir profundidade proporcional ao risco.

### Onde testar?
- **DECIDE:** escolher camada ideal.

### Quando automatizar?
- **DECIDE:** decidir pelo custo-benefício.

### Qual nível?
- **DECIDE:** distribuir cobertura.

### Qual risco aceitar?
- **DECIDE:** justificar risco residual.

---

## 4.8 Exploratory Thinking

### Heurísticas
- **TEST:** aplicar heurísticas em um produto.

### Personas
- **TEST:** testar a mesma feature por diferentes perfis.

### Tours
- **TEST:** executar um tour exploratório.

### Cenários improváveis
- **TEST:** encontrar falhas fora do happy path.

### Abusar do sistema
- **TEST:** usar produto de maneiras inesperadas.

### Usuário real
- **TEST:** testar sob perspectiva de negócio.

### Atacante
- **TEST:** pensar em abuso e segurança.

### Usuário leigo
- **TEST:** validar clareza e prevenção de erro.

---

## 4.9 Conteúdos interativos

### Como você testaria isso?
- **TEST:** receber uma tela e criar estratégia de teste.

### Ache o bug
- **INVESTIGATE:** encontrar problema em interface ou fluxo.

### Qual seria sua prioridade?
- **DECIDE:** ordenar problemas e justificar.

### Você aprovaria essa release?
- **DECIDE:** tomar decisão com bugs conhecidos.

### É bug ou feature?
- **DECIDE:** interpretar requisito e comportamento.

### Qual cenário está faltando?
- **INVESTIGATE:** encontrar lacunas de cobertura.

### O que pode dar errado aqui?
- **TEST:** listar riscos e edge cases.

### Onde você colocaria esse teste?
- **DECIDE:** escolher unit, integration, API ou E2E.

### Você automatizaria isso?
- **DECIDE:** justificar sim ou não.

### Quem está errado?
- **DECIDE:** analisar conflito sem resposta binária.

---

# 5. CAREER & MARKET

## 5.1 Entrando em QA

### O que estudar
- **BUILD:** montar roadmap pessoal de estudos.

### Precisa saber programar?
- **DECIDE:** avaliar necessidade conforme objetivo profissional.

### Precisa de faculdade?
- **DECIDE:** analisar vaga e requisitos reais.

### Primeiro emprego
- **BUILD:** montar plano de entrada no mercado.

### Estágio
- **BUILD:** preparar currículo e portfolio básico.

### QA manual
- **TEST:** executar desafio completo sem automação.

### Portfolio
- **BUILD:** criar projeto demonstrando competências reais.

### Projetos pessoais
- **BUILD:** construir laboratório documentado.

---

## 5.2 QA Júnior

### O que se espera
- **DECIDE:** identificar lacunas para nível júnior.

### Conhecimentos essenciais
- **TEST:** completar desafio de fundamentos.

### Erros comuns
- **INVESTIGATE:** revisar trabalho com anti-patterns.

### Como evoluir
- **BUILD:** plano de 90 dias.

---

## 5.3 QA Pleno

### Autonomia
- **DECIDE:** tocar feature sem roteiro pronto.

### Estratégia
- **BUILD:** criar plano de cobertura.

### Automação
- **BUILD:** automatizar fluxo crítico.

### APIs
- **TEST:** investigar problema via API.

### Banco
- **INVESTIGATE:** consultar dados para validar comportamento.

### CI/CD
- **BUILD:** integrar testes.

### Decisões
- **DECIDE:** priorizar sob restrição.

---

## 5.4 QA Sênior

### Arquitetura de qualidade
- **BUILD:** propor estratégia para sistema complexo.

### Riscos
- **DECIDE:** criar modelo de risco.

### Liderança
- **COMMUNICATE:** conduzir decisão difícil.

### Mentoria
- **COMMUNICATE:** revisar e orientar trabalho de outro QA.

### Influência
- **COMMUNICATE:** defender melhoria de qualidade para stakeholders.

### Métricas
- **BUILD:** montar dashboard executivo.

### Processos
- **BUILD:** redesenhar fluxo de qualidade.

---

## 5.5 Especializações

### QA Automation
- **BUILD:** criar framework básico.

### SDET
- **BUILD:** criar testes em múltiplas camadas.

### Quality Engineer
- **BUILD:** integrar qualidade ao ciclo inteiro.

### Performance Engineer
- **BUILD:** criar plano e execução de performance.

### Security Testing
- **TEST:** executar bateria básica em ambiente seguro.

### Mobile QA
- **TEST:** validar fluxo em matriz de dispositivos.

### Accessibility QA
- **TEST:** auditar página básica.

### Data QA
- **INVESTIGATE:** validar pipeline e consistência de dados.

### AI/ML Testing
- **TEST:** avaliar comportamento probabilístico.

### Game QA
- **TEST:** explorar mecânicas e estados.

### Embedded QA
- **TEST:** testar integração software/hardware.

---

## 5.6 Emprego

### Currículo
- **BUILD:** adaptar currículo para uma vaga real.

### LinkedIn
- **BUILD:** otimizar perfil.

### GitHub
- **BUILD:** publicar projeto de QA organizado.

### Portfolio
- **BUILD:** criar case completo.

### Entrevistas
- **COMMUNICATE:** responder perguntas situacionais.

### Testes técnicos
- **TEST:** executar case prático.

### Perguntas de entrevista
- **COMMUNICATE:** responder com exemplos concretos.

### Live coding
- **BUILD:** resolver desafio simples de automação.

### Explicar experiência
- **COMMUNICATE:** apresentar case usando contexto, ação e resultado.

---

## 5.7 Mercado

### Salários
- **DECIDE:** comparar propostas considerando pacote total.

### Vagas
- **INVESTIGATE:** analisar requisitos recorrentes.

### Tecnologias
- **BUILD:** montar plano de estudo baseado em demanda.

### QA manual vai acabar?
- **COMMUNICATE:** argumentar com visão equilibrada.

### Automação vai acabar com QA?
- **COMMUNICATE:** diferenciar automação de qualidade.

### Mercado brasileiro
- **INVESTIGATE:** analisar vagas e tendências.

### Mercado internacional
- **INVESTIGATE:** comparar exigências.

### Trabalho remoto
- **BUILD:** preparar rotina e comunicação assíncrona.

### Inglês para QA
- **COMMUNICATE:** explicar bug e participar de reunião em inglês.

---

## 5.8 Certificações

### ISTQB / CTFL
- **DECIDE:** avaliar se certificação ajuda objetivo atual.

### Automação
- **DECIDE:** comparar certificado com projeto prático.

### Cloud
- **DECIDE:** identificar certificações úteis para carreira.

### Quando vale a pena
- **DECIDE:** analisar custo, objetivo e retorno.

### Certificação vs experiência
- **COMMUNICATE:** defender uma decisão de carreira com contexto.

---

## 5.9 Inteligência Artificial

### IA aplicada a QA
- **BUILD:** usar IA para apoiar uma atividade e revisar resultado.

### IA criando casos de teste
- **TEST:** comparar casos gerados por IA com análise humana.

### IA gerando automação
- **BUILD:** gerar teste e corrigir falhas da solução.

### IA analisando requisitos
- **INVESTIGATE:** encontrar gaps com e sem IA.

### IA encontrando edge cases
- **TEST:** validar qualidade das sugestões.

### IA analisando logs
- **INVESTIGATE:** comparar hipótese da IA com evidência real.

### AI agents para testes
- **BUILD:** desenhar fluxo de agente para execução controlada.

### Testes de aplicações com LLM
- **TEST:** definir casos para respostas probabilísticas.

### Prompt testing
- **TEST:** criar matriz de prompts.

### Hallucination testing
- **TEST:** medir factualidade e erro.

### Evaluations
- **BUILD:** criar conjunto de evals.

### Guardrails
- **TEST:** testar limites e comportamentos proibidos.

### Bias
- **TEST:** criar casos que revelem respostas inconsistentes.

### Probabilistic systems
- **DECIDE:** definir critérios que não dependam de uma saída única.

---

# TRILHAS

## QA do Zero
1. Base de qualidade
2. Fundamentos de teste
3. Casos de teste
4. Bug report
5. Requisitos
6. Web
7. API
8. SQL
9. Git
10. Automação básica
11. Desafio integrador

## QA Automation
1. Web
2. Git
3. Programação
4. Automação UI
5. Automação API
6. Arquitetura de testes
7. CI/CD
8. Test data
9. Flaky tests
10. Performance
11. Desafio integrador

## QA Pleno
1. API
2. SQL
3. Automação
4. CI/CD
5. Risk-based testing
6. Métricas
7. Real Life
8. Soft Skills
9. QA Thinking
10. Desafio integrador

## QA Sênior
1. Estratégia
2. Arquitetura
3. Métricas
4. Liderança
5. Influência
6. Processos
7. Quality Engineering
8. Observabilidade
9. Gestão de risco
10. Desafio integrador

## Quality Engineer
1. Código
2. Arquitetura
3. Testes em camadas
4. Infraestrutura
5. CI/CD
6. Observabilidade
7. Performance
8. Segurança
9. Testabilidade
10. Desafio integrador

## AI Quality
1. Fundamentos de LLM
2. Prompt testing
3. Evals
4. Datasets
5. Hallucination testing
6. Bias
7. RAG testing
8. Agents
9. Guardrails
10. Observabilidade
11. Desafio integrador

---

# DESAFIOS INTEGRADORES

## Fundamentals Final Challenge

O usuário recebe um e-commerce funcional com problemas escondidos.

Deve:
- entender requisitos;
- criar estratégia;
- testar UI;
- testar API;
- consultar banco;
- encontrar bugs;
- registrar bug reports;
- criar cenários BDD;
- automatizar fluxo crítico;
- justificar cobertura;
- apresentar evidências.

Critério de conclusão:
- cobertura mínima atingida;
- bugs críticos encontrados;
- evidências válidas;
- automação funcional;
- decisões justificadas.

---

## Real Life Final Challenge

Cenário:
- release em poucas horas;
- requisito mudou;
- ambiente instável;
- bug crítico conhecido;
- PO quer liberar;
- dev discorda da severidade.

O usuário deve:
- repriorizar;
- definir cobertura;
- fazer análise de impacto;
- comunicar riscos;
- tomar decisão de Go/No-Go;
- justificar trade-offs.

---

## Soft Skills Final Challenge

Simulação de reunião com:
- PO pressionando prazo;
- dev discordando de bug;
- suporte trazendo reclamação de cliente.

O usuário deve:
- conduzir comunicação;
- reduzir conflito;
- defender evidências;
- negociar escopo;
- documentar decisão.

---

## QA Thinking Final Challenge

O usuário recebe uma feature sem casos prontos.

Deve:
- listar riscos;
- encontrar edge cases;
- definir níveis de teste;
- priorizar;
- investigar falhas escondidas;
- explicar raciocínio.

---

## Career & Market Final Challenge

O usuário recebe uma vaga fictícia.

Deve:
- analisar requisitos;
- identificar gaps;
- adaptar currículo;
- montar portfolio relevante;
- responder entrevista;
- executar teste técnico;
- apresentar experiência.

---

# QA LAB — FINAL LAB

## Segunda-feira — Refinement
- Receber feature
- Analisar requisito
- Fazer perguntas
- Encontrar riscos
- Criar critérios de aceite
- Definir estratégia

## Terça-feira — Desenvolvimento
- Revisar comportamento em construção
- Criar cenários
- Preparar massa
- Escrever automação inicial
- Analisar API

## Quarta-feira — Primeira build
- Executar smoke
- Testar UI
- Testar API
- Validar banco
- Registrar bugs
- Coletar evidências

## Quinta-feira — Mudança e pressão
Eventos:
- requisito mudou;
- dev discorda de bug;
- pipeline falhou;
- teste ficou flaky;
- PO quer manter prazo.

O usuário deve:
- investigar;
- priorizar;
- negociar;
- corrigir automação;
- atualizar estratégia.

## Sexta-feira — Release
Eventos:
- bug crítico aberto;
- prazo final;
- decisão Go/No-Go;
- deploy;
- monitoramento;
- possível incidente em produção.

O usuário deve:
- tomar decisão;
- comunicar risco;
- executar smoke;
- acompanhar métricas;
- investigar incidente;
- criar RCA/post-mortem.

---

# MODELO DE CONCLUSÃO DE CONHECIMENTO

Cada tópico pode ter:
1. Conteúdo curto
2. Exemplo
3. Desafio obrigatório
4. Evidência
5. Avaliação por rubrica
6. Feedback
7. Nova tentativa, se necessário
8. Conclusão

## Rubrica geral

### 0 — Não demonstrou
Não conseguiu aplicar o conceito.

### 1 — Básico
Entendeu parcialmente, mas precisa de orientação.

### 2 — Competente
Aplica corretamente em cenário padrão.

### 3 — Avançado
Aplica, justifica e considera riscos/alternativas.

### 4 — Expert
Conecta o conhecimento com contexto, trade-offs, impacto e estratégia.

---

# MAPA MACRO

## Fundamentals
**O que você precisa saber.**

## Real Life
**O que acontece no trabalho.**

## Soft Skills
**Como você trabalha com pessoas.**

## QA Thinking
**Como você aprende a pensar como QA.**

## Career & Market
**Como você cresce profissionalmente.**

---

# PRINCÍPIO CENTRAL

**Você não conclui um conteúdo porque o consumiu.  
Você conclui quando consegue provar que sabe usá-lo.**
