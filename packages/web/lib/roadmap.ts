// ==============================
// Types
// ==============================

export type ItemStatus = "nao_iniciado" | "em_progresso" | "concluido";

export type Level = "junior" | "pleno" | "senior" | "expert";

export interface RoadmapItem {
  id: string;
  titulo: string;
  descricao: string;
  recurso?: {
    label: string;
    href: string;
  };
}

export interface RoadmapLevel {
  nivel: Level;
  titulo: string;
  descricao: string;
  items: RoadmapItem[];
}

export interface RoadmapTopic {
  id: string;
  titulo: string;
  resumo: string;
  icon: string; // emoji icon
  cor: string;  // tailwind color class
  niveis: RoadmapLevel[];
}

// ==============================
// Level config
// ==============================

export const levelConfig: Record<
  Level,
  { label: string; className: string; dotClass: string }
> = {
  junior: {
    label: "Júnior",
    className: "text-emerald-400 border-emerald-500/30 bg-emerald-500/5",
    dotClass: "bg-emerald-400",
  },
  pleno: {
    label: "Pleno",
    className: "text-sky-400 border-sky-500/30 bg-sky-500/5",
    dotClass: "bg-sky-400",
  },
  senior: {
    label: "Sênior",
    className: "text-violet-400 border-violet-500/30 bg-violet-500/5",
    dotClass: "bg-violet-400",
  },
  expert: {
    label: "Expert",
    className: "text-amber-400 border-amber-500/30 bg-amber-500/5",
    dotClass: "bg-amber-400",
  },
};

// ==============================
// Topics
// ==============================

export const topics: RoadmapTopic[] = [
  // ── Testes Unitários ─────────────────────────────────────────────────────
  {
    id: "testes-unitarios",
    titulo: "Testes Unitários",
    resumo:
      "Da anatomia de um teste até estratégias de arquitetura testável para sistemas de grande escala.",
    icon: "🧪",
    cor: "text-emerald-400",
    niveis: [
      {
        nivel: "junior",
        titulo: "Fundamentos",
        descricao:
          "Entender o que é um teste unitário, para que serve e como escrever os primeiros testes.",
        items: [
          {
            id: "tu-j-01",
            titulo: "O que é um teste unitário",
            descricao:
              "Entender a diferença entre testes unitários, de integração e end-to-end. Saber quando usar cada tipo.",
          },
          {
            id: "tu-j-02",
            titulo: "Anatomia AAA",
            descricao:
              "Padrão Arrange-Act-Assert: como estruturar cada parte de um teste de forma legível e manutenível.",
          },
          {
            id: "tu-j-03",
            titulo: "Testes com Jest / Vitest",
            descricao:
              "Configurar o runner, escrever describes, its, expects e rodar os testes no terminal.",
          },
          {
            id: "tu-j-04",
            titulo: "Cobertura de código",
            descricao:
              "Entender o que é coverage, como gerar relatórios e por que 100% de coverage não garante qualidade.",
          },
          {
            id: "tu-j-05",
            titulo: "Matchers essenciais",
            descricao:
              "toBe, toEqual, toContain, toThrow, toBeNull, toBeUndefined — quando usar cada um e por quê.",
          },
        ],
      },
      {
        nivel: "pleno",
        titulo: "Mocks e Isolamento",
        descricao:
          "Controlar dependências externas e testar unidades de forma isolada.",
        items: [
          {
            id: "tu-p-01",
            titulo: "Mocks, Stubs e Spies",
            descricao:
              "A diferença entre os três test doubles. Quando usar jest.fn(), jest.spyOn() e jest.mock().",
          },
          {
            id: "tu-p-02",
            titulo: "Testando React components",
            descricao:
              "Testing Library: renderizar componentes, simular eventos, buscar elementos por role e texto.",
          },
          {
            id: "tu-p-03",
            titulo: "Testando custom hooks",
            descricao:
              "renderHook, act e como testar lógica com estado e efeitos colaterais em hooks React.",
          },
          {
            id: "tu-p-04",
            titulo: "TDD — Test Driven Development",
            descricao:
              "O ciclo Red-Green-Refactor. Como escrever o teste primeiro e deixar ele guiar o design do código.",
          },
          {
            id: "tu-p-05",
            titulo: "Valores limítrofes e equivalência",
            descricao:
              "Técnicas de análise de valor limite e partição de equivalência aplicadas a testes unitários.",
          },
        ],
      },
      {
        nivel: "senior",
        titulo: "Estratégia e Qualidade",
        descricao:
          "Além de escrever testes: garantir que os testes são bons e que a arquitetura os suporta.",
        items: [
          {
            id: "tu-s-01",
            titulo: "Mutation Testing",
            descricao:
              "Usar ferramentas como Stryker para verificar se seus testes realmente detectam mudanças no código.",
          },
          {
            id: "tu-s-02",
            titulo: "Property-based Testing",
            descricao:
              "Gerar casos de teste aleatórios com fast-check para encontrar edge cases que você não imaginou.",
          },
          {
            id: "tu-s-03",
            titulo: "Arquitetura testável",
            descricao:
              "Injeção de dependência, separação de responsabilidades e patterns que tornam código fácil de testar.",
          },
          {
            id: "tu-s-04",
            titulo: "Code review de testes",
            descricao:
              "Identificar anti-patterns em testes: tests frágeis, tests que testam implementação, tests duplicados.",
          },
          {
            id: "tu-s-05",
            titulo: "Pirâmide de testes na prática",
            descricao:
              "Decidir o mix certo de unitários vs. integração vs. e2e para um projeto específico e justificar.",
          },
        ],
      },
      {
        nivel: "expert",
        titulo: "Liderança e Escala",
        descricao:
          "Definir a cultura de testes de um time e garantir qualidade em sistemas complexos.",
        items: [
          {
            id: "tu-e-01",
            titulo: "Test strategy para times",
            descricao:
              "Criar e comunicar uma estratégia de testes que todo o time entende e segue consistentemente.",
          },
          {
            id: "tu-e-02",
            titulo: "Métricas de qualidade de testes",
            descricao:
              "Medir e monitorar: flakiness rate, tempo de execução, coverage por feature, mutation score.",
          },
          {
            id: "tu-e-03",
            titulo: "Mentoria e documentação",
            descricao:
              "Guias internos, exemplos de referência e como elevar o nível de testes de toda a equipe.",
          },
          {
            id: "tu-e-04",
            titulo: "Testes em monorepos e microsserviços",
            descricao:
              "Estratégias de isolamento e execução eficiente de testes em arquiteturas distribuídas.",
          },
        ],
      },
    ],
  },

  // ── Testes de API ─────────────────────────────────────────────────────────
  {
    id: "testes-api",
    titulo: "Testes de API",
    resumo:
      "Do Postman básico até contract testing e chaos engineering em APIs de produção.",
    icon: "🔌",
    cor: "text-violet-400",
    niveis: [
      {
        nivel: "junior",
        titulo: "Fundamentos",
        descricao: "HTTP, ferramentas e primeiros testes manuais de API.",
        items: [
          {
            id: "api-j-01",
            titulo: "HTTP: verbos, status codes e headers",
            descricao:
              "GET, POST, PUT, PATCH, DELETE. Status 200/201/400/401/403/404/422/500 — o que cada um significa.",
            recurso: { label: "Praticar no API Playground", href: "/api-playground" },
          },
          {
            id: "api-j-02",
            titulo: "Postman / Insomnia básico",
            descricao:
              "Criar requests, configurar headers, autenticação Bearer, enviar JSON no body e analisar a resposta.",
          },
          {
            id: "api-j-03",
            titulo: "REST: princípios e convenções",
            descricao:
              "Recursos, endpoints RESTful, idempotência, stateless. Como identificar uma API bem ou mal projetada.",
          },
          {
            id: "api-j-04",
            titulo: "Autenticação e autorização",
            descricao:
              "API Keys, Bearer tokens, OAuth2 básico. Testar acesso com token válido, inválido e ausente.",
          },
          {
            id: "api-j-05",
            titulo: "Validação de responses",
            descricao:
              "Verificar status code, schema do body, headers de resposta e tempo de resposta.",
          },
        ],
      },
      {
        nivel: "pleno",
        titulo: "Automação e Dados",
        descricao: "Automatizar testes de API e gerenciar dados de teste.",
        items: [
          {
            id: "api-p-01",
            titulo: "Schema validation",
            descricao:
              "Usar JSON Schema ou Zod para validar automaticamente que a resposta tem a estrutura correta.",
          },
          {
            id: "api-p-02",
            titulo: "Testes com dados inválidos",
            descricao:
              "Testar sistematicamente: campos ausentes, tipos errados, strings com caracteres especiais, payloads enormes.",
            recurso: { label: "Praticar no API Playground", href: "/api-playground" },
          },
          {
            id: "api-p-03",
            titulo: "Collections e ambientes no Postman",
            descricao:
              "Organizar testes em collections, configurar environments (dev/staging/prod) e variáveis.",
          },
          {
            id: "api-p-04",
            titulo: "Automação com scripts (pre-request e tests)",
            descricao:
              "Escrever scripts no Postman ou usar axios/fetch em testes automatizados com Jest.",
          },
          {
            id: "api-p-05",
            titulo: "Gerenciamento de dados de teste",
            descricao:
              "Estratégias de seed, teardown e isolamento de dados para que os testes não se interfiram.",
          },
        ],
      },
      {
        nivel: "senior",
        titulo: "Resiliência e Segurança",
        descricao: "Testar comportamentos de falha, chaos e vulnerabilidades.",
        items: [
          {
            id: "api-s-01",
            titulo: "Chaos Engineering em APIs",
            descricao:
              "Simular latência, timeouts, retries e falhas parciais. Como o cliente se comporta em cada cenário?",
            recurso: { label: "Chaos Mode no API Playground", href: "/api-playground" },
          },
          {
            id: "api-s-02",
            titulo: "Contract Testing com Pact",
            descricao:
              "Consumer-driven contracts: garantir que produtor e consumidor de uma API concordam com o contrato.",
          },
          {
            id: "api-s-03",
            titulo: "Security testing básico",
            descricao:
              "Testar OWASP Top 10 em APIs: injeção, auth quebrada, exposição de dados, rate limiting ausente.",
          },
          {
            id: "api-s-04",
            titulo: "Testes de performance de API",
            descricao:
              "k6, Artillery ou Locust: load testing, stress testing e spike testing em endpoints críticos.",
          },
          {
            id: "api-s-05",
            titulo: "Monitoramento e observabilidade",
            descricao:
              "Testar com tracing distribuído. Correlacionar logs de teste com traces de produção.",
          },
        ],
      },
      {
        nivel: "expert",
        titulo: "Arquitetura de Testes",
        descricao: "Definir estratégia de testes de API para produtos inteiros.",
        items: [
          {
            id: "api-e-01",
            titulo: "API-first design e testabilidade",
            descricao:
              "Participar do design de APIs para garantir que sejam testáveis. OpenAPI como fonte de verdade.",
          },
          {
            id: "api-e-02",
            titulo: "Test strategy para microsserviços",
            descricao:
              "Quando testar em isolamento vs. integração real. Trade-offs entre fidelidade e velocidade.",
          },
          {
            id: "api-e-03",
            titulo: "Synthetic monitoring em produção",
            descricao:
              "Rodar testes reais em produção de forma segura para detectar regressões antes dos usuários.",
          },
        ],
      },
    ],
  },

  // ── Automação de Testes ───────────────────────────────────────────────────
  {
    id: "automacao",
    titulo: "Automação de Testes",
    resumo:
      "De scripts básicos no Playwright até pipelines de CI/CD com automação inteligente e confiável.",
    icon: "🤖",
    cor: "text-sky-400",
    niveis: [
      {
        nivel: "junior",
        titulo: "Primeiros Scripts",
        descricao:
          "Entender o que vale a pena automatizar e escrever os primeiros testes end-to-end.",
        items: [
          {
            id: "auto-j-01",
            titulo: "O que automatizar (e o que não)",
            descricao:
              "O ROI da automação: testes repetitivos, regressão, smoke. O que deve ficar manual e por quê.",
          },
          {
            id: "auto-j-02",
            titulo: "Playwright básico",
            descricao:
              "Instalar, configurar, escrever o primeiro teste: navegar, clicar, preencher e fazer assertion.",
          },
          {
            id: "auto-j-03",
            titulo: "Seletores robustos",
            descricao:
              "Por que evitar XPath e classes CSS. Priorizar: role, label, texto, test-id (por essa ordem).",
          },
          {
            id: "auto-j-04",
            titulo: "Page Object Model (POM)",
            descricao:
              "Separar seletores e ações em classes reutilizáveis. Por que POM reduz manutenção drasticamente.",
          },
          {
            id: "auto-j-05",
            titulo: "Assertions eficazes",
            descricao:
              "expect(locator).toBeVisible(), toHaveText(), toHaveValue() — assertions que esperam automaticamente.",
          },
        ],
      },
      {
        nivel: "pleno",
        titulo: "Testes Estáveis",
        descricao:
          "Eliminar flakiness e construir suites que rodam de forma confiável.",
        items: [
          {
            id: "auto-p-01",
            titulo: "Combatendo flaky tests",
            descricao:
              "Causas de testes instáveis: race conditions, dependência de ordem, dados compartilhados. Como eliminar.",
          },
          {
            id: "auto-p-02",
            titulo: "Gerenciamento de dados e fixtures",
            descricao:
              "Criar e destruir dados de teste de forma isolada. Fixtures do Playwright e factories de dados.",
          },
          {
            id: "auto-p-03",
            titulo: "Testes paralelos",
            descricao:
              "Configurar paralelismo no Playwright, workers, e garantir que testes paralelos não conflitem.",
          },
          {
            id: "auto-p-04",
            titulo: "Screenshots, vídeos e traces",
            descricao:
              "Configurar artefatos para debug de falhas. Playwright Trace Viewer para análise pós-falha.",
          },
          {
            id: "auto-p-05",
            titulo: "Visual regression testing",
            descricao:
              "Screenshots comparativos com Playwright ou Percy. Quando faz sentido e como gerenciar diffs.",
          },
        ],
      },
      {
        nivel: "senior",
        titulo: "CI/CD e Escala",
        descricao:
          "Integrar automação ao pipeline e fazer funcionar em escala.",
        items: [
          {
            id: "auto-s-01",
            titulo: "Automação em CI (GitHub Actions / GitLab)",
            descricao:
              "Configurar pipeline para rodar testes em PRs. Estratégias de fail-fast e notificações.",
          },
          {
            id: "auto-s-02",
            titulo: "Smoke vs. Regression suites",
            descricao:
              "Organizar testes por criticidade. Smoke roda em todo commit; regressão roda antes de releases.",
          },
          {
            id: "auto-s-03",
            titulo: "Test reporting e dashboards",
            descricao:
              "Allure Report, Playwright HTML report. Métricas de estabilidade e trends de falha ao longo do tempo.",
          },
          {
            id: "auto-s-04",
            titulo: "Component Testing",
            descricao:
              "Playwright Component Testing e Storybook: testar componentes em isolamento sem browser completo.",
          },
          {
            id: "auto-s-05",
            titulo: "Acessibilidade automatizada",
            descricao:
              "axe-core com Playwright: testar WCAG 2.1 automaticamente como parte do suite de regressão.",
          },
        ],
      },
      {
        nivel: "expert",
        titulo: "Framework Design",
        descricao:
          "Arquitetar um framework de automação que o time inteiro adota e mantém.",
        items: [
          {
            id: "auto-e-01",
            titulo: "Arquitetura de framework de automação",
            descricao:
              "Decisões de design: estrutura de pastas, abstrações, reusabilidade, extensibilidade para novos projetos.",
          },
          {
            id: "auto-e-02",
            titulo: "Self-healing selectors",
            descricao:
              "Estratégias e ferramentas (Healenium, smart locators) que reduzem manutenção quando a UI muda.",
          },
          {
            id: "auto-e-03",
            titulo: "Automação inteligente com AI",
            descricao:
              "Geração de testes com LLMs, análise de falhas com IA e quando confiar (ou não) nessas ferramentas.",
          },
          {
            id: "auto-e-04",
            titulo: "ROI e comunicação com gestão",
            descricao:
              "Como medir e apresentar o valor da automação: bugs evitados, tempo poupado, cobertura de regressão.",
          },
        ],
      },
    ],
  },

  // ── QA em DevOps ─────────────────────────────────────────────────────────
  {
    id: "qa-devops",
    titulo: "QA em DevOps",
    resumo:
      "Integrar qualidade em todo o ciclo de desenvolvimento: do código ao monitoramento em produção.",
    icon: "⚙️",
    cor: "text-orange-400",
    niveis: [
      {
        nivel: "junior",
        titulo: "Entendendo o Ciclo",
        descricao:
          "Compreender como QA se encaixa em times ágeis e pipelines de entrega contínua.",
        items: [
          {
            id: "devops-j-01",
            titulo: "Agile e Scrum para QA",
            descricao:
              "Cerimônias, user stories, critérios de aceitação e o papel do QA em cada etapa do sprint.",
          },
          {
            id: "devops-j-02",
            titulo: "Shift-left: QA desde o início",
            descricao:
              "Revisar requisitos antes do código. Identificar ambiguidades e edge cases na grooming.",
            recurso: { label: "Artigo: Shift-Left Testing", href: "/blog/shift-left-testing-qa-na-era-do-devops" },
          },
          {
            id: "devops-j-03",
            titulo: "Git para QA",
            descricao:
              "Branches, pull requests, code review com olhar de QA. Identificar bugs em diffs antes do merge.",
          },
          {
            id: "devops-j-04",
            titulo: "CI/CD básico",
            descricao:
              "Entender o pipeline: build, test, deploy. O que é integração contínua e entrega contínua.",
          },
          {
            id: "devops-j-05",
            titulo: "Ambientes: dev, staging, produção",
            descricao:
              "Diferenças entre ambientes, paridade de dados e por que bugs aparecem só em produção.",
          },
        ],
      },
      {
        nivel: "pleno",
        titulo: "Qualidade no Pipeline",
        descricao:
          "Colocar gates de qualidade no pipeline e participar ativamente das decisões técnicas.",
        items: [
          {
            id: "devops-p-01",
            titulo: "Quality gates em CI",
            descricao:
              "Configurar bloqueios automáticos: testes falhando, cobertura abaixo do threshold, lint errors.",
          },
          {
            id: "devops-p-02",
            titulo: "Testes em PRs com GitHub Actions",
            descricao:
              "Pipeline que roda testes automatizados em cada PR com feedback rápido para o desenvolvedor.",
          },
          {
            id: "devops-p-03",
            titulo: "Análise estática de código",
            descricao:
              "ESLint, Sonar, TypeScript strict: barreiras automáticas para bugs comuns antes da execução.",
          },
          {
            id: "devops-p-04",
            titulo: "Feature flags e testes",
            descricao:
              "Testar features ocultas por flags. Garantir que tanto o caminho ativo quanto o inativo funcionam.",
          },
          {
            id: "devops-p-05",
            titulo: "Testes de contrato entre serviços",
            descricao:
              "Garantir que serviços que se comunicam não quebrem um ao outro quando evoluem independentemente.",
          },
        ],
      },
      {
        nivel: "senior",
        titulo: "Observabilidade e Confiabilidade",
        descricao:
          "Monitorar qualidade em produção e responder a incidentes com dados.",
        items: [
          {
            id: "devops-s-01",
            titulo: "Monitoring e alertas",
            descricao:
              "Datadog, New Relic, Grafana: definir SLIs, SLOs e alertas que notificam quando qualidade degrada.",
          },
          {
            id: "devops-s-02",
            titulo: "Log analysis para QA",
            descricao:
              "Usar logs e traces para diagnosticar bugs de produção. Correlacionar erros com releases.",
          },
          {
            id: "devops-s-03",
            titulo: "Canary releases e testes A/B",
            descricao:
              "Estratégias de rollout progressivo. Como monitorar qualidade durante deploys graduais.",
          },
          {
            id: "devops-s-04",
            titulo: "Incident response",
            descricao:
              "Participar de post-mortems. Transformar incidentes em casos de teste para prevenir regressão.",
          },
          {
            id: "devops-s-05",
            titulo: "SRE: confiabilidade como qualidade",
            descricao:
              "Error budgets, toil reduction e como os princípios de SRE se alinham com a missão do QA.",
          },
        ],
      },
      {
        nivel: "expert",
        titulo: "Cultura e Estratégia",
        descricao:
          "Liderar a cultura de qualidade e influenciar decisões de produto e engenharia.",
        items: [
          {
            id: "devops-e-01",
            titulo: "Quality engineering vs. QA tradicional",
            descricao:
              "A transição de 'teste no final' para 'qualidade embutida no processo'. Como liderar essa mudança.",
          },
          {
            id: "devops-e-02",
            titulo: "Métricas de qualidade organizacionais",
            descricao:
              "DORA metrics, escape rate, customer-reported bugs. Como apresentar qualidade para C-level.",
          },
          {
            id: "devops-e-03",
            titulo: "Construindo a cultura de testes",
            descricao:
              "Desenvolvedores que escrevem testes, designers que pensam em edge cases, PM que inclui critérios de aceitação.",
          },
        ],
      },
    ],
  },

  // ── Testes de Performance ─────────────────────────────────────────────────
  {
    id: "performance",
    titulo: "Testes de Performance",
    resumo:
      "Garantir que o sistema aguenta a carga real: load testing, stress testing e análise de gargalos.",
    icon: "⚡",
    cor: "text-amber-400",
    niveis: [
      {
        nivel: "junior",
        titulo: "Conceitos Fundamentais",
        descricao:
          "Entender o que é performance de software e os principais tipos de teste.",
        items: [
          {
            id: "perf-j-01",
            titulo: "O que é performance de software",
            descricao:
              "Latência, throughput, tempo de resposta, concurrent users. O que cada métrica significa na prática.",
          },
          {
            id: "perf-j-02",
            titulo: "Tipos de teste de performance",
            descricao:
              "Load test, stress test, spike test, soak test, capacity test — diferenças e quando usar cada um.",
          },
          {
            id: "perf-j-03",
            titulo: "SLAs e thresholds",
            descricao:
              "O que é um SLA de performance. Como definir critérios de pass/fail (ex: P95 < 500ms).",
          },
          {
            id: "perf-j-04",
            titulo: "Primeiros testes com k6",
            descricao:
              "Instalar k6, escrever um script básico, rodar com 10 usuários e interpretar o relatório.",
          },
          {
            id: "perf-j-05",
            titulo: "Web Vitals para QA",
            descricao:
              "LCP, FID, CLS — as métricas de performance que o Google usa. Como medir com Lighthouse.",
          },
        ],
      },
      {
        nivel: "pleno",
        titulo: "Execução e Análise",
        descricao:
          "Planejar, executar testes realistas e identificar gargalos.",
        items: [
          {
            id: "perf-p-01",
            titulo: "Modelagem de carga realista",
            descricao:
              "Como definir VUs, ramp-up, duração baseado em dados reais de produção (ex: Google Analytics).",
          },
          {
            id: "perf-p-02",
            titulo: "Scripts avançados com k6",
            descricao:
              "Grupos, thresholds, checks, scenarios e como simular fluxos de usuário complexos.",
          },
          {
            id: "perf-p-03",
            titulo: "Análise de resultados",
            descricao:
              "Interpretar P50/P90/P95/P99. Identificar onde a degradação começa e o que a causa.",
          },
          {
            id: "perf-p-04",
            titulo: "Profiling básico",
            descricao:
              "Chrome DevTools Performance tab, Node.js profiler. Identificar slow functions e memory leaks.",
          },
          {
            id: "perf-p-05",
            titulo: "Banco de dados como gargalo",
            descricao:
              "Identificar N+1 queries, queries sem índice e deadlocks através de logs e EXPLAIN ANALYZE.",
          },
        ],
      },
      {
        nivel: "senior",
        titulo: "Gargalos e Tuning",
        descricao:
          "Diagnóstico profundo e otimização de sistemas sob carga.",
        items: [
          {
            id: "perf-s-01",
            titulo: "Distributed tracing",
            descricao:
              "OpenTelemetry, Jaeger, Zipkin. Rastrear uma request pelo sistema inteiro para encontrar o gargalo real.",
          },
          {
            id: "perf-s-02",
            titulo: "Cache strategy testing",
            descricao:
              "Validar que o cache funciona (hit rate), não tem stale data e sobrevive a spike de carga.",
          },
          {
            id: "perf-s-03",
            titulo: "Performance em CI",
            descricao:
              "Rodar testes de performance no pipeline. Detectar regressões antes que cheguem à produção.",
          },
          {
            id: "perf-s-04",
            titulo: "Chaos + Performance",
            descricao:
              "Combinar chaos engineering com load testing: como o sistema se comporta sob carga E com falhas?",
          },
        ],
      },
      {
        nivel: "expert",
        titulo: "Arquitetura e Estratégia",
        descricao:
          "Definir a estratégia de performance de sistemas de alta escala.",
        items: [
          {
            id: "perf-e-01",
            titulo: "Performance budget",
            descricao:
              "Definir orçamentos de performance por feature. Como garantir que novas features não degradam o sistema.",
          },
          {
            id: "perf-e-02",
            titulo: "Capacity planning",
            descricao:
              "Usar dados de teste para projetar crescimento de infraestrutura. Quando escalar horizontalmente vs. otimizar.",
          },
          {
            id: "perf-e-03",
            titulo: "Continuous performance monitoring",
            descricao:
              "APM integrado ao pipeline. Dashboards de performance que o time consulta antes de cada release.",
          },
        ],
      },
    ],
  },
];

// ==============================
// Helpers
// ==============================

export function getTopicById(id: string): RoadmapTopic | undefined {
  return topics.find((t) => t.id === id);
}

export function countItems(topic: RoadmapTopic): number {
  return topic.niveis.reduce((sum, n) => sum + n.items.length, 0);
}
