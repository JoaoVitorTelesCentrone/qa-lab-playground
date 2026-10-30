export type K6TrackModule = {
  id: string;
  week: number;
  duration: string;
  title: string;
  objective: string;
  concepts: string[];
  practice: string;
  deliverable: string;
  checklist: string[];
  code: string;
};

export const k6CourseModules: K6TrackModule[] = [
  {
    id: "scope-baseline", week: 1, duration: "45 min", title: "Defina o objetivo antes de gerar carga",
    objective: "Diferenciar teste de performance, capacidade e disponibilidade e definir um alvo autorizado, uma hipótese e um limite de parada.",
    concepts: ["pergunta de negócio", "SUT", "ambiente controlado", "linha de base", "limite de parada"],
    practice: "Escolha uma rota somente de leitura do API local de treino que representa uma jornada do BrotoSpace. Registre o que você quer aprender, o que não vai testar e como interromper a execução.",
    deliverable: "Um brief com alvo, hipótese, escopo, janela, responsável e sinais para abortar.",
    checklist: ["O alvo está sob seu controle ou tem autorização explícita.", "O primeiro teste é smoke, com tráfego mínimo.", "Produção e sistemas de terceiros foram excluídos sem autorização."],
    code: `// Comece pequeno e aponte para um ambiente que você controla.\nconst BASE_URL = __ENV.BASE_URL || "http://localhost:3000";\n\nexport const options = { vus: 1, iterations: 1 };\n\nexport default function () {\n  http.get(\u0060\u0024{BASE_URL}/api/health\u0060);\n}`,
  },
  {
    id: "first-request", week: 1, duration: "60 min", title: "Faça sua primeira requisição com k6",
    objective: "Executar um script de protocolo e entender o que uma iteração realmente solicita ao sistema.",
    concepts: ["k6 run", "http.get", "VU", "iteração", "BASE_URL"],
    practice: "Instale o k6, configure a URL por variável de ambiente e consulte a rota somente de leitura da API local de treino sem fazer alterações de estado.",
    deliverable: "Script smoke executável localmente e anotação do status e tempo observados.",
    checklist: ["O script tem uma única responsabilidade observável.", "A URL não está repetida em vários arquivos.", "A execução não altera dados."],
    code: `import http from "k6/http";\nimport { check } from "k6";\n\nconst BASE_URL = (__ENV.BASE_URL || "http://localhost:3000").replace(/\\/$/, "");\n\nexport const options = { vus: 1, iterations: 1 };\n\nexport default function () {\n  const response = http.get(\u0060\u0024{BASE_URL}/api/health\u0060);\n  check(response, {\n    "a API local respondeu": (res) => res.status === 200,\n    "a resposta é JSON": (res) => String(res.headers["Content-Type"]).includes("application/json"),\n  });\n}`,
  },
  {
    id: "checks-metrics", week: 2, duration: "60 min", title: "Leia checks e métricas sem se perder na média",
    objective: "Transformar respostas em sinais úteis e distinguir métricas de requisição, iteração e regra funcional.",
    concepts: ["check", "Rate", "Trend", "Counter", "p50 e p95", "tags"],
    practice: "Meça status e duração para a rota de saúde da API local. Crie uma métrica própria e separe resultados por endpoint com tags de baixa cardinalidade.",
    deliverable: "Um relatório comentado que inclui taxa de checks aprovados, volume e percentis de latência.",
    checklist: ["Cada check representa uma condição que importa.", "p95 ou p99 acompanha a mediana; média não é o único resumo.", "Tags não contêm IDs únicos, e-mails ou valores sem limite."],
    code: `import http from "k6/http";\nimport { check } from "k6";\nimport { Trend } from "k6/metrics";\n\nconst requestDuration = new Trend("broto_api_duration", true);\n\nexport default function () {\n  const res = http.get(\u0060\u0024{BASE_URL}/api/health\u0060, { tags: { route: "health" } });\n  check(res, { "status 200": (r) => r.status === 200 });\n  requestDuration.add(res.timings.duration, { route: "health" });\n}`,
  },
  {
    id: "thresholds-slo", week: 2, duration: "75 min", title: "Converta expectativas em thresholds",
    objective: "Definir critérios automáticos de aprovação ligados a um SLO, em vez de decidir olhando um gráfico depois.",
    concepts: ["threshold", "SLO", "http_req_failed", "p(95)", "falha do processo"],
    practice: "Escolha limites provisórios para o smoke e explique de onde vieram. Observe que k6 encerra com falha quando um threshold não é atendido.",
    deliverable: "Thresholds nomeados, justificativa e exemplo de execução verde e vermelha em ambiente local.",
    checklist: ["O limite é uma hipótese explícita, não um número copiado sem contexto.", "Erros e latência são avaliados separadamente.", "A pipeline realmente falha quando um requisito falha."],
    code: `export const options = {\n  vus: 1,\n  iterations: 5,\n  thresholds: {\n    http_req_failed: ["rate<0.01"],\n    http_req_duration: ["p(95)<1200"],\n    checks: ["rate>0.99"],\n  },\n};`,
  },
  {
    id: "vus-executors", week: 3, duration: "75 min", title: "Escolha VUs e executors para a pergunta",
    objective: "Controlar a forma de execução e explicar a diferença entre manter usuários ocupados e manter uma taxa de chegada.",
    concepts: ["virtual users", "iterations", "constant-vus", "shared-iterations", "duração"],
    practice: "Compare uma execução curta com um VU e uma com VUs constantes. Registre iterações concluídas e o padrão que cada configuração cria.",
    deliverable: "Uma tabela de configurações com objetivo, executor, duração, volume estimado e risco.",
    checklist: ["A quantidade de VUs tem justificativa.", "Duração e iterações não são confundidas com requisições por segundo.", "O tamanho da execução continua seguro para o ambiente escolhido."],
    code: `export const options = {\n  scenarios: {\n    browse: { executor: "constant-vus", vus: 2, duration: "20s" },\n  },\n};`,
  },
  {
    id: "arrival-rate", week: 3, duration: "75 min", title: "Modele chegadas com open-model executors",
    objective: "Controlar uma taxa de chegada sem deixar a lentidão do sistema reduzir silenciosamente o tráfego pretendido.",
    concepts: ["constant-arrival-rate", "ramping-arrival-rate", "preAllocatedVUs", "dropped_iterations", "open model"],
    practice: "Crie uma execução local de 1 iteração por segundo por 10 segundos. Observe dropped iterations e dimensione VUs pré-alocados antes de aumentar a taxa.",
    deliverable: "Um perfil de chegada documentado e evidência de que a carga desejada foi atingida sem sobrecarregar o gerador.",
    checklist: ["A taxa e o período representam a hipótese do teste.", "dropped_iterations foi observado e entendido.", "A taxa não é aumentada contra produção ou ambiente sem autorização."],
    code: `export const options = {\n  scenarios: {\n    gentle_arrival: {\n      executor: "constant-arrival-rate", rate: 1, timeUnit: "1s", duration: "10s",\n      preAllocatedVUs: 2, maxVUs: 4,\n    },\n  },\n};`,
  },
  {
    id: "stages-workload", week: 4, duration: "75 min", title: "Desenhe ramp-up, platô e ramp-down",
    objective: "Construir uma carga progressiva que permita comparar comportamento em cada etapa e encerre de forma previsível.",
    concepts: ["stages", "ramping-vus", "gracefulRampDown", "warm-up", "perfil de carga"],
    practice: "Modele um perfil local curto com aquecimento, uma pequena subida, platô e descida. Marque em que trecho os thresholds devem ser interpretados.",
    deliverable: "Gráfico ou linha do tempo do perfil e justificativa para cada estágio.",
    checklist: ["O aquecimento não é confundido com uma medição estável.", "Existe uma etapa de redução da carga.", "Duração total e limite de parada foram revisados antes da execução."],
    code: `export const options = {\n  stages: [\n    { duration: "10s", target: 1 }, // aquecimento\n    { duration: "20s", target: 2 }, // platô baixo\n    { duration: "10s", target: 0 }, // ramp-down\n  ],\n  gracefulRampDown: "5s",\n};`,
  },
  {
    id: "data-lifecycle", week: 4, duration: "75 min", title: "Prepare dados sem contaminar o teste",
    objective: "Compartilhar dados imutáveis com eficiência e manter setup, iteração e teardown com responsabilidades claras.",
    concepts: ["SharedArray", "setup", "teardown", "dados sintéticos", "segredos"],
    practice: "Carregue uma lista pequena e não sensível com SharedArray. Passe dados globais via setup e deixe cada iteração sem dependência de outra.",
    deliverable: "Fixture sintética, lifecycle anotado e instruções de dados/reset seguros.",
    checklist: ["Não há dado pessoal nem segredo versionado.", "O setup não cria carga não contabilizada sem ser documentado.", "A fixture não sofre mutação entre VUs."],
    code: `import { SharedArray } from "k6/data";\n\nconst health = new SharedArray("health", () =>\n  JSON.parse(open("./data/health.json")),\n);\n\nexport function setup() { return { startedAt: new Date().toISOString() }; }\n\nexport default function (data) {\n  const product = health[__ITER % health.length];\n  // Use dados sintéticos; não altere registros reais.\n}\n\nexport function teardown(data) {\n  console.log(\u0060Execução iniciada em \u0024{data.startedAt}\u0060);\n}`,
  },
  {
    id: "scenarios-workflows", week: 5, duration: "90 min", title: "Separe jornadas e leia resultados por cenário",
    objective: "Organizar fluxos independentes por cenário e correlacionar métricas sem criar rótulos de cardinalidade explosiva.",
    concepts: ["scenarios", "exec", "group", "tags", "correlação", "http.batch"],
    practice: "Separe navegação da página e verificação de saúde da API em cenários nomeados. Agrupe etapas e compare métricas filtradas por tag.",
    deliverable: "Script com dois cenários de baixa carga, tags estáveis e leitura por jornada.",
    checklist: ["Cada cenário tem um executor adequado à sua pergunta.", "Tags descrevem categorias e não um valor novo por amostra.", "As jornadas não dependem da ordem em que são executadas."],
    code: `export const options = {\n  scenarios: {\n    catalog: { executor: "shared-iterations", vus: 1, iterations: 2, exec: "catalog" },\n    api_health: { executor: "constant-arrival-rate", rate: 1, timeUnit: "1s", duration: "5s", preAllocatedVUs: 1, maxVUs: 2, exec: "health" },\n  },\n};\n\nexport function catalog() { /* GET /api/health */ }\nexport function health() { /* GET de saúde somente leitura */ }`,
  },
  {
    id: "load-types", week: 6, duration: "90 min", title: "Escolha entre smoke, stress, spike e soak",
    objective: "Selecionar o tipo de teste de acordo com o risco e distinguir saturação do sistema de saturação do gerador.",
    concepts: ["smoke", "average load", "stress", "spike", "soak", "breakpoint"],
    practice: "Para três perguntas diferentes, escolha um perfil de carga, duração, métricas e sinais de parada. Comece por smoke e baseline.",
    deliverable: "Matriz pergunta × tipo de teste × perfil × métricas × critérios de interrupção.",
    checklist: ["Stress, spike e soak não compartilham uma configuração arbitrária.", "Há observabilidade do sistema e do gerador.", "A execução maior depende de janela e autorização do responsável."],
    code: `// Um baseline não é um stress test.\nexport const options = {\n  scenarios: {\n    baseline: { executor: "constant-arrival-rate", rate: 1, timeUnit: "1s", duration: "30s", preAllocatedVUs: 2, maxVUs: 4 },\n  },\n  thresholds: { http_req_failed: ["rate<0.01"] },\n};`,
  },
  {
    id: "browser-vitals", week: 7, duration: "90 min", title: "Meça experiência no browser sem simular multidões",
    objective: "Usar k6/browser para métricas de experiência e entender por que teste de browser e carga de protocolo respondem perguntas diferentes.",
    concepts: ["k6/browser", "Chromium", "LCP", "INP", "CLS", "custo por VU"],
    practice: "Execute uma navegação de browser com uma única iteração, capture métricas Web Vitals e compare com o teste HTTP da mesma página.",
    deliverable: "Um smoke de browser e uma decisão documentada sobre quais métricas ficam no protocolo e quais ficam no browser.",
    checklist: ["Browser está limitado a poucas VUs e não é usado para alta concorrência.", "A versão atual do k6 e Chromium estão disponíveis.", "Web Vitals são interpretados junto com a telemetria do sistema."],
    code: `import { browser } from "k6/browser";\n\nexport const options = {\n  scenarios: { ui: { executor: "shared-iterations", vus: 1, iterations: 1, options: { browser: { type: "chromium" } } } },\n  thresholds: { browser_web_vital_lcp: ["p(90)<2500"] },\n};\n\nexport default async function () {\n  const page = await browser.newPage();\n  try { await page.goto(\u0060\u0024{BASE_URL}/api/health\u0060); }\n  finally { await page.close(); }\n}`,
  },
  {
    id: "ci-capstone", week: 8, duration: "2 h", title: "Projeto final: proteja um SLO com k6",
    objective: "Entregar uma avaliação reproduzível que liga perfil de tráfego, SLO, evidências e decisões seguras em CI.",
    concepts: ["plano de performance", "baseline", "SLO", "CI manual", "artefatos", "limites da conclusão"],
    practice: "Crie smoke e baseline para uma rota somente de leitura em ambiente autorizado. Execute smoke em workflow manual, guarde o sumário e escreva o que os dados permitem concluir.",
    deliverable: "Repositório com brief, scripts, thresholds justificados, execução CI reproduzível, evidências e relatório honesto sobre achados e limitações.",
    checklist: ["O alvo é explicitamente configurado e protegido.", "Smoke é executado antes de qualquer perfil maior.", "Thresholds refletem um SLO acordado.", "O relatório registra p95, erros, volume e sinais do gerador.", "Não há afirmação de capacidade de produção baseada em teste local."],
    code: `# Executar o smoke em um alvo local autorizado\nk6 run -e BASE_URL=http://localhost:3000 tests/smoke.js\n\n# Em staging, configure a URL aprovada\nk6 run -e BASE_URL=$K6_TARGET_URL tests/smoke.js\n\n# Não eleve taxa ou VUs em produção sem plano e autorização.`,
  },
];

export const k6CourseOutcomes = [
  "Escrever e executar scripts k6 de protocolo e browser.",
  "Usar checks, métricas e tags para produzir resultados interpretáveis.",
  "Definir thresholds a partir de SLOs e observar percentis.",
  "Modelar VUs, taxa de chegada, cenários e tipos de carga.",
  "Proteger dados, alvo e ambiente e automatizar smoke em CI.",
];

export const k6FinalProject = {
  title: "Projeto final: proteja um SLO com k6",
  description: "Uma avaliação pequena e repetível para um ambiente autorizado, com hipótese clara, tráfego modelado, thresholds e relatório honesto sobre o que foi observado.",
  deliverables: [
    "Brief com alvo, objetivo, hipótese, autorização e limites de parada.",
    "Smoke e baseline para uma rota somente de leitura.",
    "Checks, tags estáveis, métricas e thresholds ligados a um SLO.",
    "Perfil de carga com executor, taxa, duração e VUs justificados.",
    "Workflow manual de CI, saída salva e instruções de reprodução.",
    "Relatório com p95, falhas, dropped iterations, observabilidade e risco residual.",
  ],
  rubric: [
    { criterion: "Hipótese, alvo e segurança", weight: "25%" },
    { criterion: "Modelo de carga e dados", weight: "25%" },
    { criterion: "Métricas e thresholds", weight: "20%" },
    { criterion: "Reprodução e CI", weight: "15%" },
    { criterion: "Conclusões e limites", weight: "15%" },
  ],
};

export const k6CourseResources = [
  { label: "Instalação e primeiros passos", href: "https://grafana.com/docs/k6/latest/get-started/" },
  { label: "Checks e thresholds", href: "https://grafana.com/docs/k6/latest/using-k6/checks/" },
  { label: "Executors e cenários", href: "https://grafana.com/docs/k6/latest/using-k6/scenarios/" },
  { label: "Tipos de teste", href: "https://grafana.com/docs/k6/latest/testing-guides/test-types/" },
  { label: "k6/browser e Web Vitals", href: "https://grafana.com/docs/k6/latest/using-k6-browser/" },
  { label: "Testes automatizados", href: "https://grafana.com/docs/k6/latest/testing-guides/automated-performance-testing/" },
];

export function findK6Module(id: string) {
  return k6CourseModules.find((module) => module.id === id);
}
