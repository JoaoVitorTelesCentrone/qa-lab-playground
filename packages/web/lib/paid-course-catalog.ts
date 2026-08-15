export type PaidCourseModule = {
  number: number;
  title: string;
  content: string;
  duration: string;
};

export type PaidCourse = {
  slug: string;
  title: string;
  shortTitle: string;
  subtitle: string;
  level: string;
  hours: string;
  prerequisite: string;
  format: string;
  price: string;
  installments: string;
  funnelRole: string;
  finalDeliverable: string;
  objective: string;
  audience: string[];
  modules: PaidCourseModule[];
  nextStep: string;
  accent: "mint" | "neon" | "coral" | "blue";
};

export const paidCourses: PaidCourse[] = [
  {
    slug: "fundamentos-qa",
    title: "Fundamentos de QA e Testes de Software",
    shortTitle: "Fundamentos de QA",
    subtitle: "A porta de entrada para quem quer aprender QA com vocabulário, processo, postura e prática.",
    level: "Básico",
    hours: "10h",
    prerequisite: "Nenhum",
    format: "Aulas gravadas + quiz por módulo + simulado final",
    price: "R$ 197",
    installments: "4x R$ 52,75",
    funnelRole: "Entrada / aquisição",
    finalDeliverable: "Plano de teste completo de um sistema fictício de e-commerce",
    objective:
      "Dar ao aluno a base conceitual completa de QA: vocabulário, tipos de teste, ciclo de vida de defeitos, pensamento de risco e postura profissional para atuar como QA júnior ou seguir para automação.",
    audience: [
      "Pessoas em transição de carreira para tecnologia.",
      "Estagiários e analistas júnior que precisam estruturar conhecimento.",
      "Quem quer decidir se segue para automação ou gestão de qualidade.",
    ],
    modules: [
      { number: 1, title: "O que é QA, de fato", content: "Diferença entre QA, QC e teste. Por que QA não é só clicar e ver se quebra. Panorama do mercado e papéis: analista, automação e SDET.", duration: "1h" },
      { number: 2, title: "Tipos e níveis de teste", content: "Funcional x não funcional. Unitário, integração, sistema, aceitação, regressão, smoke e sanity.", duration: "1h30" },
      { number: 3, title: "Técnicas de design de casos de teste", content: "Partição de equivalência, valor limite, tabela de decisão e grafo causa-efeito aplicados a exemplos reais.", duration: "2h" },
      { number: 4, title: "Teste exploratório e baseado em risco", content: "Como testar sem roteiro fechado, criar charters, priorizar por impacto e comunicar risco residual.", duration: "1h30" },
      { number: 5, title: "Ciclo de vida de defeitos", content: "Como abrir, descrever e priorizar bugs. Severidade x prioridade. Evidências que convencem.", duration: "1h30" },
      { number: 6, title: "Métodos ágeis e papel do QA", content: "Scrum, Kanban, cerimônias, shift-left testing, Definition of Ready e Definition of Done.", duration: "1h" },
      { number: 7, title: "SQL básico para QA", content: "SELECT, filtros, JOIN simples e validação de dados direto no banco.", duration: "1h30" },
      { number: 8, title: "Projeto final", content: "Construção de plano de teste completo com casos de teste e relatório de bugs simulado.", duration: "1h" },
    ],
    nextStep: "JS/TS para QA",
    accent: "mint",
  },
  {
    slug: "js-ts-qa",
    title: "JavaScript e TypeScript para QA",
    shortTitle: "JS/TS para QA",
    subtitle: "A ponte entre QA manual e automação, com programação ensinada pelos olhos de quem testa.",
    level: "Básico",
    hours: "12h",
    prerequisite: "Fundamentos de QA recomendado",
    format: "Aulas gravadas + desafios de código com correção automática",
    price: "R$ 247",
    installments: "5x R$ 53,80",
    funnelRole: "Ponte para automação",
    finalDeliverable: "Biblioteca de funções utilitárias para manipulação de dados de teste",
    objective:
      "Ensinar lógica de programação e fundamentos de JS/TS com exemplos voltados a automação, fixtures, validação de dados e scripts de apoio para QA.",
    audience: [
      "Quem concluiu Fundamentos de QA e quer seguir para automação.",
      "QAs manuais que sentem teto de carreira por não programar.",
      "Alunos que querem entrar na trilha de Cypress com base sólida.",
    ],
    modules: [
      { number: 1, title: "Lógica aplicada a teste", content: "Variáveis, tipos, operadores, condicionais e loops usando validação de dados como exemplo.", duration: "2h" },
      { number: 2, title: "Funções, arrays e objetos", content: "Funções puras, map, filter, find, reduce e manipulação de JSON para fixtures.", duration: "2h30" },
      { number: 3, title: "Assincronismo essencial", content: "Promises, async/await e por que UI/API exigem raciocínio assíncrono.", duration: "1h30" },
      { number: 4, title: "Introdução ao TypeScript", content: "Tipos, interfaces, unions e tipagem como proteção de suíte grande.", duration: "2h" },
      { number: 5, title: "Node.js e npm na prática", content: "Scripts, instalação de pacotes, execução fora do navegador e organização de projeto.", duration: "1h30" },
      { number: 6, title: "Git para QA", content: "Clone, branch, commit, pull request, revisão e conflitos comuns.", duration: "1h30" },
      { number: 7, title: "Projeto final", content: "Biblioteca de geração de massa, validação de formatos e helpers reutilizáveis.", duration: "1h" },
    ],
    nextStep: "Cypress E2E",
    accent: "neon",
  },
  {
    slug: "cypress",
    title: "Cypress E2E: do zero à arquitetura avançada",
    shortTitle: "Cypress E2E",
    subtitle: "O carro-chefe técnico: do primeiro teste até CI/CD, arquitetura, relatórios e IA aplicada.",
    level: "Básico ao avançado",
    hours: "18h",
    prerequisite: "JS/TS para QA ou experiência equivalente",
    format: "Aulas gravadas + repositório evolutivo + code review em vídeo",
    price: "R$ 397",
    installments: "10x R$ 41,90",
    funnelRole: "Carro-chefe técnico",
    finalDeliverable: "Suíte de automação completa de e-commerce fictício com CI/CD configurado",
    objective:
      "Levar o aluno de zero em Cypress até a capacidade de projetar, manter e defender uma suíte E2E profissional, com mocks, autenticação, CI/CD, BDD, acessibilidade e governança de flakiness.",
    audience: [
      "Quem concluiu JS/TS para QA.",
      "QAs que já automatizam mas nunca estruturaram um projeto do zero.",
      "Times que querem padronizar conhecimento de Cypress internamente.",
    ],
    modules: [
      { number: 1, title: "Setup e instalação", content: "npm install, estrutura de pastas, cypress.config.js e baseUrl.", duration: "1h" },
      { number: 2, title: "Seletores e comandos", content: "cy.get, cy.contains, cy.find, retry automático e diferença para Selenium.", duration: "1h30" },
      { number: 3, title: "Asserções", content: "should, Chai assertions, asserção implícita e explícita.", duration: "1h" },
      { number: 4, title: "Navegação e formulários", content: "Forms, checkboxes, radios, selects, mensagens e estados.", duration: "1h30" },
      { number: 5, title: "Hooks e estrutura", content: "describe, context, it, beforeEach e isolamento entre testes.", duration: "1h" },
      { number: 6, title: "Runner e debugging visual", content: "Time-travel debugging, snapshots, vídeos e screenshots.", duration: "1h" },
      { number: 7, title: "Custom commands", content: "Cypress.Commands.add, cy.login e comandos reutilizáveis.", duration: "1h" },
      { number: 8, title: "Fixtures e dados", content: "cy.fixture, geração dinâmica de massa e dados previsíveis.", duration: "1h" },
      { number: 9, title: "Intercept e mocks de API", content: "cy.intercept, stub, erro, loading e estado vazio.", duration: "1h30" },
      { number: 10, title: "Testes de API", content: "cy.request para contrato e preparação de estado.", duration: "1h" },
      { number: 11, title: "Page Object e app actions", content: "Organização por página, domínio e ações do app.", duration: "1h" },
      { number: 12, title: "Sessão e autenticação", content: "cy.session, performance e segurança de credenciais.", duration: "1h" },
      { number: 13, title: "Ambientes, arquivos, visual e a11y", content: "Cypress.env, upload/download, iframes, cypress-axe e visual testing.", duration: "1h30" },
      { number: 14, title: "Component testing", content: "Testar componentes React/Vue isolados.", duration: "1h30" },
      { number: 15, title: "CI/CD e paralelização", content: "GitHub Actions, Cypress Cloud, sharding e evidências.", duration: "1h30" },
      { number: 16, title: "Plugins, cy.task e multi-domínio", content: "Node events, cy.origin e fluxos cross-domain.", duration: "1h" },
      { number: 17, title: "TypeScript e relatórios", content: "Tipagem de commands, Mochawesome, Allure e dashboards.", duration: "1h" },
      { number: 18, title: "Boas práticas e anti-padrões", content: "Flakiness, cy.wait fixo, isolamento e selectors frágeis.", duration: "1h" },
      { number: 19, title: "IA e self-healing", content: "Geração assistida, seletores auto-corrigíveis e limites de governança.", duration: "1h" },
      { number: 20, title: "Projeto final", content: "Suíte completa com pipeline funcional.", duration: "1h" },
    ],
    nextStep: "BDD com Cucumber",
    accent: "coral",
  },
  {
    slug: "bdd-cucumber",
    title: "BDD com Cucumber e Gherkin",
    shortTitle: "BDD com Cucumber",
    subtitle: "BDD como ferramenta de alinhamento entre QA, dev e produto, não só sintaxe bonita.",
    level: "Intermediário",
    hours: "10h",
    prerequisite: "Cypress E2E ou experiência equivalente",
    format: "Aulas gravadas + workshop de escrita colaborativa",
    price: "R$ 247",
    installments: "5x R$ 53,80",
    funnelRole: "Diferenciação / nicho",
    finalDeliverable: "Feature file completo com cenários, outlines e step definitions integrados ao Cypress",
    objective:
      "Ensinar BDD como prática de descoberta e comunicação: transformar regras ambíguas em exemplos, alinhar linguagem de domínio e automatizar sem criar uma fábrica de steps duplicados.",
    audience: [
      "QAs que já automatizam e querem aproximar QA, dev e produto.",
      "Times que querem adotar Gherkin com governança.",
      "QAs seniores que querem atuar como ponte entre técnico e negócio.",
    ],
    modules: [
      { number: 1, title: "Por que BDD existe", content: "O problema de comunicação que BDD resolve. BDD x TDD. Quando não usar.", duration: "1h" },
      { number: 2, title: "Gherkin na prática", content: "Given, When, Then e cenários que comunicam comportamento.", duration: "1h30" },
      { number: 3, title: "Scenario Outline e Examples", content: "Reaproveitamento de cenários com tabelas de dados.", duration: "1h" },
      { number: 4, title: "Cucumber + Cypress", content: "Configuração, preprocessor, step definitions e organização de .feature.", duration: "2h" },
      { number: 5, title: "Workshop colaborativo", content: "Como conduzir sessão de refinamento com dev e PO para escrever Gherkin junto.", duration: "1h30" },
      { number: 6, title: "BDD em escala", content: "Reuso de steps, evitar duplicação e glossário de domínio compartilhado.", duration: "1h30" },
      { number: 7, title: "Projeto final", content: "Feature file completo de checkout com outlines e steps reutilizáveis.", duration: "1h30" },
    ],
    nextStep: "PDCA e Gestão da Qualidade",
    accent: "blue",
  },
  {
    slug: "pdca-gestao-qualidade",
    title: "PDCA e Gestão da Qualidade de Software",
    shortTitle: "PDCA e Gestão da Qualidade",
    subtitle: "A trilha para tirar QA do papel de quem testa e levar para gestão contínua de qualidade.",
    level: "Intermediário a sênior",
    hours: "12h",
    prerequisite: "Nenhum pré-requisito técnico",
    format: "Aulas gravadas + estudos de caso + template de aplicação prática",
    price: "R$ 297",
    installments: "6x R$ 51,80",
    funnelRole: "Diferencial competitivo",
    finalDeliverable: "Plano de gestão da qualidade aplicado ao contexto real do aluno",
    objective:
      "Ensinar QA a gerenciar qualidade como processo contínuo usando PDCA: planejar, executar, medir, aprender e melhorar o sistema de trabalho, não só testar no fim.",
    audience: [
      "QAs seniores e coordenadores que querem influenciar processo.",
      "Quem busca transição para QA Lead, Coordenador ou Head de QA.",
      "Squads que querem cultura de qualidade contínua.",
    ],
    modules: [
      { number: 1, title: "Qualidade como processo", content: "Por que testar no final é causa raiz de muitos problemas de qualidade.", duration: "1h" },
      { number: 2, title: "PDCA aplicado a software", content: "Plan, Do, Check, Act traduzidos para desenvolvimento e QA.", duration: "2h" },
      { number: 3, title: "Estratégia de testes e pirâmide", content: "Onde investir esforço de teste e como evitar cobertura sem intenção.", duration: "1h30" },
      { number: 4, title: "Métricas que importam", content: "Indicadores que influenciam decisão de negócio vs métricas de vaidade.", duration: "1h30" },
      { number: 5, title: "Bugs como dados", content: "Causa raiz, categorização e padrões recorrentes de falha.", duration: "1h30" },
      { number: 6, title: "Shift-left e qualidade no time ágil", content: "QA antes do código: refinamento, critérios de aceite e prevenção.", duration: "1h30" },
      { number: 7, title: "Comunicação de risco para liderança", content: "Traduzir achados técnicos em impacto de negócio e prioridade.", duration: "1h30" },
      { number: 8, title: "Estudo de caso aplicado", content: "Implementação de PDCA em time de software com métricas antes/depois.", duration: "1h" },
      { number: 9, title: "Projeto final", content: "Plano de gestão da qualidade aplicado ao trabalho real do aluno.", duration: "1h" },
    ],
    nextStep: "Bundle completo QA Lab",
    accent: "neon",
  },
];

export const courseBundle = {
  title: "Bundle completo QA Lab v1",
  fullPrice: "R$ 1.385",
  bundlePrice: "R$ 897",
  discount: "R$ 488",
  discountPercent: "≈ 35%",
  description: "As 5 trilhas do catálogo v1 com desconto para aumentar ticket médio e criar jornada completa.",
};

export const launchStrategy = [
  "Fundamentos de QA e JS/TS para QA entram como porta de entrada e alimentam as trilhas técnicas.",
  "Cypress E2E é o carro-chefe técnico, com maior busca e maior ticket individual.",
  "BDD com Cucumber ocupa um gap real no mercado brasileiro e conecta metodologia com prática.",
  "PDCA e Gestão da Qualidade diferencia o QA Lab de cursos focados apenas em ferramenta.",
  "O bundle ancora valor e cria uma jornada do zero até gestão e automação avançada.",
];

export function getPaidCourse(slug: string) {
  return paidCourses.find((course) => course.slug === slug);
}
