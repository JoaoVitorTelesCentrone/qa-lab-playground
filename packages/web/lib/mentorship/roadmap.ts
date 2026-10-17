export type RoadmapStage = {
  id: string;
  title: string;
  summary: string;
  outcome: string;
  weeks: readonly [number, number];
  competencies: readonly string[];
};

export const mentorshipRoadmap: readonly RoadmapStage[] = [
  {
    id: "fundamentos",
    title: "Fundamentos e ciclo de entrega",
    summary: "Entenda como qualidade aparece no produto, no trabalho do time e nos ambientes de uso.",
    outcome: "Você entrega um mapa de risco e investiga um fluxo com contexto de desenvolvimento.",
    weeks: [1, 2],
    competencies: ["Qualidade de produto e processo, métricas e risco", "Pensamento de testador, Ready/Done e priorização", "Ciclo cascata/ágil, fluxo, gargalos e compatibilidade"],
  },
  {
    id: "desenho",
    title: "Testes manuais e comunicação",
    summary: "Planeje a cobertura, escolha técnicas e comunique achados com evidência.",
    outcome: "Você entrega um plano de teste, cenários rastreáveis e recomendação de release.",
    weeks: [3, 4],
    competencies: ["Test plan, Gherkin, passo a passo, TDD e BDD", "Técnicas funcionais e não funcionais", "Relatório, verificação, validação e organização de evidências"],
  },
  {
    id: "automacao",
    title: "Automação com critério",
    summary: "Distribua testes por camada e automatize uma jornada web observável.",
    outcome: "Você justifica a pirâmide para o produto e entrega um smoke estável.",
    weeks: [5, 6],
    competencies: ["AAA, unidade, integração e ponta a ponta", "HTML, CSS, JavaScript e ferramentas do navegador", "Cypress/Playwright, seletores, dados e responsividade"],
  },
  {
    id: "integracoes",
    title: "APIs e arquitetura de automação",
    summary: "Teste contratos, controle de acesso e padrões que mantêm a suíte legível.",
    outcome: "Você entrega uma coleção de API protegida e uma refatoração com causa demonstrada.",
    weeks: [7, 8],
    competencies: ["Back-end, xUnit, OpenAPI e coleções no Bruno", "Autenticação, autorização, papéis e dados", "Page Objects, custom commands, Builder e flakiness"],
  },
  {
    id: "entrega",
    title: "Entrega contínua, segurança e operação",
    summary: "Conecte Git, pipelines, observabilidade e práticas seguras à decisão de release.",
    outcome: "Você desenha um pipeline com gate e conduz um diagnóstico de incidente.",
    weeks: [9, 10],
    competencies: ["Git, revisão, CI/CD, Azure Pipelines e métricas de fluxo", "Artefatos, permissões e gerenciamento de secrets", "Logs, funções, monitoramento, vulnerabilidade e recuperação"],
  },
  {
    id: "sintese",
    title: "Performance, acessibilidade e carreira",
    summary: "Avalie a experiência sob condições reais e transforme o percurso em um case profissional seguro.",
    outcome: "Você entrega relatórios de performance e acessibilidade, além de um case rastreável.",
    weeks: [11, 12],
    competencies: ["Lighthouse, Locust, carga, percentis e parada segura", "Acessibilidade por tarefa e diagnóstico com DevTools", "IA, proteção da informação, portfólio e evolução de carreira"],
  },
];

export const qualityDeepDives = [
  { title: "Acessibilidade", description: "Avalie barreiras de uso, teclado, rótulos e evidências com um lab específico.", href: "/labs/acessibilidade", action: "Abrir Lab de acessibilidade" },
  { title: "Segurança e privacidade", description: "Pratique análise de autorização, exposição de dados e riscos de acesso.", href: "/lab/seguranca", action: "Abrir Lab de segurança" },
  { title: "Refinamento e clareza", description: "Transforme histórias incompletas em perguntas, exemplos e critérios observáveis.", href: "/lab/refinamento", action: "Abrir Lab de refinamento" },
  { title: "Colaboração", description: "Treine conversas difíceis, feedback e comunicação de risco no People Lab.", href: "/lab/pessoas", action: "Abrir People Lab" },
] as const;

export const qualityDimensions = [
  { name: "Funcionalidade", question: "O produto cumpre as regras e protege os fluxos importantes?", href: "/lab/criterios", where: "Lab de critérios" },
  { name: "Usabilidade e acessibilidade", question: "Pessoas diferentes conseguem concluir a tarefa sem barreiras?", href: "/labs/acessibilidade", where: "Lab de acessibilidade" },
  { name: "Segurança e privacidade", question: "Dados e ações ficam acessíveis apenas a quem tem permissão?", href: "/lab/seguranca", where: "Lab de segurança" },
  { name: "Confiabilidade", question: "O sistema mantém resultados corretos diante de falhas e estados inesperados?", href: "/labs/waits", where: "Lab de waits" },
  { name: "Desempenho", question: "A experiência continua aceitável sob a carga esperada?", href: "/mentoria/performance", where: "Performance local" },
  { name: "Operação e manutenção", question: "O time consegue detectar, investigar e corrigir problemas com segurança?", href: "/lab/cicd", where: "Lab de CI/CD" },
] as const;
