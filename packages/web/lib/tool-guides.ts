// Guias de estudo das ferramentas reais citadas na mentoria.
// Links conferidos em 2026-11-09 (REST Assured, Pytest, JUnit, BrowserStack, Allure,
// WireMock, MSW, Xray, TestRail e os demais guias criados depois deles em 2026-11-23): documentação e cursos responderam
// HTTP 200 e cada vídeo/playlist teve título e canal confirmados pelo oEmbed do YouTube.
// Ao trocar um vídeo, confira de novo com:
//   https://www.youtube.com/oembed?format=json&url=<link do vídeo>

export type GuideLang = "pt" | "en";

export type GuideLink = {
  title: string;
  url: string;
  lang: GuideLang;
  note: string;
};

export type GuideVideo = {
  title: string;
  channel: string;
  lang: GuideLang;
  /** Id de vídeo (11 caracteres) ou de playlist (começa com PL). */
  youtubeId: string;
  kind: "video" | "playlist";
  official?: boolean;
};

export type ToolGuideCategory =
  | "web" | "mobile" | "unidade" | "api" | "contrato" | "performance"
  | "observabilidade" | "risco" | "cicd" | "base" | "processo";

export type ToolGuide = {
  slug: string;
  name: string;
  category: ToolGuideCategory;
  tagline: string;
  summary: string;
  qaFocus: string[];
  /** Curso da própria plataforma sobre a ferramenta: é o primeiro passo recomendado. */
  internalCourse?: { href: string; title: string; detail: string };
  /** Simulador do QA Lab que treina a mesma habilidade, quando existe. */
  practice?: { href: string; label: string };
  docs: GuideLink[];
  courses: GuideLink[];
  videos: GuideVideo[];
};

export const toolGuideCategories: Record<ToolGuideCategory, { title: string; description: string }> = {
  web: { title: "Automação web", description: "Frameworks para automatizar fluxos de interface no navegador." },
  mobile: { title: "Mobile e device cloud", description: "Automação de apps e execução em dispositivos e navegadores reais." },
  unidade: { title: "Unidade e runners", description: "A base da pirâmide, em JavaScript, Python e Java." },
  api: { title: "APIs", description: "Explorar APIs na mão e automatizar os testes em código." },
  contrato: { title: "Contrato, mocks e massa de dados", description: "O que a API promete, como simular dependências e como preparar dados para o teste." },
  performance: { title: "Performance", description: "Carga no servidor e performance da página." },
  observabilidade: { title: "Observabilidade", description: "Ler métricas, logs e traces para confirmar o que aconteceu em produção." },
  risco: { title: "Acessibilidade e segurança", description: "Riscos que a regressão funcional não pega." },
  cicd: { title: "CI/CD e relatórios", description: "Rodar a suíte no pipeline e mostrar o resultado para o time." },
  base: { title: "Base técnica", description: "O que todo QA usa todo dia, mesmo sem perceber." },
  processo: { title: "Processo e gestão", description: "Especificação por exemplos, bugs e gestão de casos de teste." },
};

export function youtubeUrl(video: GuideVideo) {
  return video.kind === "playlist"
    ? `https://www.youtube.com/playlist?list=${video.youtubeId}`
    : `https://www.youtube.com/watch?v=${video.youtubeId}`;
}

export function youtubeThumb(video: GuideVideo) {
  return video.kind === "video" ? `https://i.ytimg.com/vi/${video.youtubeId}/mqdefault.jpg` : null;
}

export const toolGuides: ToolGuide[] = [
  {
    slug: "playwright",
    name: "Playwright",
    category: "web",
    tagline: "Testes E2E em Chromium, Firefox e WebKit com uma API só.",
    summary: "Framework da Microsoft para automação de navegador. Espera os elementos sozinho, grava traces com tela, rede e console de cada passo e também faz requisições de API no mesmo teste.",
    qaFocus: ["Localizadores por papel e texto (getByRole, getByText)", "Assertions com espera automática (expect)", "Trace Viewer para investigar falhas", "Codegen para gravar o primeiro rascunho"],
    docs: [
      { title: "Documentação oficial: instalação", url: "https://playwright.dev/docs/intro", lang: "en", note: "Comece aqui: instalar, rodar e ler o relatório." },
      { title: "Gerador de testes (codegen)", url: "https://playwright.dev/docs/codegen-intro", lang: "en", note: "Grava ações no navegador e gera o código." },
    ],
    courses: [
      { title: "Microsoft Learn: Build with Playwright", url: "https://learn.microsoft.com/en-us/training/modules/build-with-playwright/", lang: "en", note: "Módulo gratuito e guiado, do primeiro teste ao relatório." },
      { title: "Test Automation University", url: "https://testautomationu.applitools.com/", lang: "en", note: "Cursos gratuitos com certificado; procure as trilhas de Playwright." },
    ],
    videos: [
      { title: "Tutorial de Testes E2E com Playwright", channel: "Mago Acadêmico", lang: "pt", youtubeId: "iXDkQPcYnso", kind: "video" },
      { title: "Testes de API com Playwright do ZERO (aula 1)", channel: "Gotas de Tecnologia", lang: "pt", youtubeId: "ZzmsRDJ7Jdk", kind: "video" },
      { title: "Playwright Automation Tutorial for Beginners from Scratch", channel: "Mukesh otwani", lang: "en", youtubeId: "pq20Gd4LXeI", kind: "video" },
      { title: "Playwright with TypeScript [6 Hours]", channel: "TestMu AI (LambdaTest)", lang: "en", youtubeId: "wawbt1cATsk", kind: "video" },
    ],
  },
  {
    slug: "cypress",
    name: "Cypress",
    category: "web",
    tagline: "Testes E2E que rodam dentro do navegador, com viagem no tempo entre os comandos.",
    summary: "Framework JavaScript que executa os testes junto da aplicação. O runner mostra cada comando com um snapshot da tela, o que deixa o debug visual e rápido. Muito usado em vagas de QA no Brasil.",
    qaFocus: ["Estrutura describe/it e comandos encadeados", "cy.intercept para observar e simular requisições", "Seletores estáveis (data-cy) em vez de CSS frágil", "Comandos customizados e fixtures"],
    docs: [
      { title: "Por que Cypress (documentação oficial)", url: "https://docs.cypress.io/app/get-started/why-cypress", lang: "en", note: "Visão geral e limites da ferramenta." },
      { title: "Seu primeiro teste E2E", url: "https://docs.cypress.io/app/end-to-end-testing/writing-your-first-end-to-end-test", lang: "en", note: "Passo a passo oficial." },
    ],
    courses: [
      { title: "Learn Cypress (Cypress Real World Testing)", url: "https://learn.cypress.io/", lang: "en", note: "Curso oficial e gratuito, com app de exemplo." },
      { title: "Test Automation University", url: "https://testautomationu.applitools.com/", lang: "en", note: "Tem cursos gratuitos de Cypress com certificado." },
    ],
    videos: [
      { title: "Automação de Testes com Cypress para Iniciantes", channel: "Agilizei", lang: "pt", youtubeId: "PLnUo-Rbc3jjztMO4K8b-px4NE-630VNKY", kind: "playlist" },
      { title: "Como automatizar testes com Cypress – Tutorial do ZERO", channel: "Many - QA", lang: "pt", youtubeId: "WC-85_vOSws", kind: "video" },
      { title: "Testing JavaScript with Cypress – Full Course", channel: "freeCodeCamp.org", lang: "en", youtubeId: "u8vMu7viCm8", kind: "video" },
    ],
  },
  {
    slug: "selenium",
    name: "Selenium",
    category: "web",
    tagline: "O padrão W3C de automação de navegador, em Java, Python, C# e mais.",
    summary: "O mais antigo dos frameworks de automação web e base do protocolo WebDriver. Ainda domina em empresas grandes e em projetos Java. Entender Selenium explica como os outros frameworks funcionam por baixo.",
    qaFocus: ["Localizadores (id, css, xpath) e quando cada um quebra", "Esperas explícitas em vez de sleep", "Page Object Model", "Selenium Grid para rodar em paralelo"],
    docs: [
      { title: "Documentação oficial do Selenium", url: "https://www.selenium.dev/documentation/", lang: "en", note: "Referência completa do WebDriver." },
      { title: "Getting started com WebDriver", url: "https://www.selenium.dev/documentation/webdriver/getting_started/", lang: "en", note: "Primeiro script em cada linguagem." },
    ],
    courses: [
      { title: "Test Automation University", url: "https://testautomationu.applitools.com/", lang: "en", note: "Cursos gratuitos de Selenium em Java, Python e C#." },
    ],
    videos: [
      { title: "Aprenda a Automatizar Seus Testes Web do Zero com Selenium WebDriver!", channel: "Julio de Lima", lang: "pt", youtubeId: "ZFOdetBp55U", kind: "video" },
      { title: "Automação de Testes Com Selenium Para Iniciantes [Curso Completo]", channel: "Inove Teste", lang: "pt", youtubeId: "PLedtsFT8ymsgVCqgLvPiSrfYeGdujcqvv", kind: "playlist" },
      { title: "Selenium Tutorial For Beginners | Selenium with Java Full Course", channel: "UltimateQA", lang: "en", youtubeId: "aIfP8rOx66E", kind: "video" },
      { title: "Selenium WebDriver Tutorial In 3 Hours", channel: "TestMu AI (LambdaTest)", lang: "en", youtubeId: "HpL6EX2kjq4", kind: "video" },
      { title: "Selenium Course for Beginners (Python)", channel: "freeCodeCamp.org", lang: "en", youtubeId: "j7VZsCCnptM", kind: "video" },
    ],
  },
  {
    slug: "appium",
    name: "Appium",
    category: "mobile",
    tagline: "Automação de apps Android e iOS com o protocolo WebDriver.",
    summary: "Servidor que traduz comandos WebDriver para os drivers nativos de Android (UiAutomator2) e iOS (XCUITest). Quem já sabe Selenium aproveita quase tudo. O Appium Inspector ajuda a achar os elementos na tela do app.",
    qaFocus: ["Capabilities: como dizer qual app e qual dispositivo usar", "Appium Inspector para localizar elementos", "Diferenças entre emulador e dispositivo real", "Gestos (toque, scroll, swipe)"],
    docs: [
      { title: "Documentação oficial do Appium", url: "https://appium.io/docs/en/latest/", lang: "en", note: "Instalação do servidor e drivers." },
      { title: "Appium Inspector", url: "https://appium.github.io/appium-inspector/latest/", lang: "en", note: "Ferramenta para inspecionar a tela do app." },
    ],
    courses: [
      { title: "Test Automation University", url: "https://testautomationu.applitools.com/", lang: "en", note: "Tem cursos gratuitos de Appium para Android e iOS." },
    ],
    videos: [
      { title: "Automatizando Juntos: Appium – parte 2", channel: "Iterasys", lang: "pt", youtubeId: "1JZZvz-UmYo", kind: "video" },
      { title: "Live de Python #144 – Appium, automatizando aplicativos móveis", channel: "Eduardo Mendes", lang: "pt", youtubeId: "R1vm0RF66C8", kind: "video" },
      { title: "Appium – Mobile Automation Testing from Scratch in 2 hours", channel: "Rahul Shetty Academy", lang: "en", youtubeId: "Fx3ud5wMHYc", kind: "video" },
      { title: "Appium 2.0 Full Course for Beginners", channel: "Vinoth Rathinam", lang: "en", youtubeId: "bu_7YCDa4YA", kind: "video" },
      { title: "Appium Tutorial for Beginners (playlist)", channel: "Bhau-Automation Lab", lang: "en", youtubeId: "PLk9dTrObC0OKS76RJ4NU6ieCSc3Ce3mCh", kind: "playlist" },
    ],
  },
  {
    slug: "jest",
    name: "Jest / Vitest",
    category: "unidade",
    tagline: "Testes de unidade em JavaScript e TypeScript.",
    summary: "Jest ainda é o framework de unidade mais comum em projetos JavaScript, mas os projetos novos com Vite estão migrando para o Vitest, que tem quase a mesma API. QA usa para ler e revisar os testes do time de desenvolvimento, escrever testes de funções puras e entender a base da pirâmide de testes.",
    qaFocus: ["Matchers (toBe, toEqual, toThrow)", "Mocks e spies", "Testes assíncronos", "Relatório de cobertura e o que ele não garante"],
    docs: [
      { title: "Primeiros passos (em português)", url: "https://jestjs.io/pt-BR/docs/getting-started", lang: "pt", note: "Documentação oficial traduzida." },
      { title: "Getting started (original)", url: "https://jestjs.io/docs/getting-started", lang: "en", note: "Versão em inglês, sempre a mais atualizada." },
      { title: "Guia do Vitest", url: "https://vitest.dev/guide/", lang: "en", note: "O sucessor do Jest em projetos com Vite; quem sabe um aprende o outro rápido." },
    ],
    courses: [],
    videos: [
      { title: "QArentena 39 – Escrevendo Testes Unitários com Jest", channel: "Iterasys", lang: "pt", youtubeId: "djPtfZiu7t4", kind: "video" },
      { title: "Aulão de Unit Tests em Node.js com Jest", channel: "LuizTools", lang: "pt", youtubeId: "MduPtbLg49M", kind: "video" },
      { title: "Jest Crash Course – Unit Testing in JavaScript", channel: "Traversy Media", lang: "en", youtubeId: "7r4xVDI2vho", kind: "video" },
      { title: "JavaScript Testing with Jest – Crash Course", channel: "freeCodeCamp.org", lang: "en", youtubeId: "IPiUDhwnZxA", kind: "video" },
    ],
  },
  {
    slug: "postman",
    name: "Postman",
    category: "api",
    tagline: "Cliente de API com coleções, variáveis, testes e execução pelo Newman.",
    summary: "A ferramenta mais usada para explorar e testar APIs. Permite montar coleções, separar ambientes, escrever assertions em JavaScript e rodar tudo na linha de comando com o Newman, inclusive em CI.",
    qaFocus: ["Métodos, status, cabeçalhos e corpo", "Variáveis de ambiente e de coleção", "Scripts de teste (pm.test, pm.expect)", "Newman para rodar a coleção em CI"],
    practice: { href: "/lab/ferramentas/http", label: "HTTP Request Runner" },
    docs: [
      { title: "Postman Learning Center", url: "https://learning.postman.com/docs/introduction/overview/", lang: "en", note: "Documentação oficial completa." },
    ],
    courses: [
      { title: "Postman Academy", url: "https://academy.postman.com/", lang: "en", note: "Trilhas oficiais e gratuitas, com selo ao final." },
      { title: "Curso testando APIs do zero com Postman", url: "https://www.youtube.com/playlist?list=PLEqTHftpM91OzKYUkpaEuByhSpJYc90Hs", lang: "pt", note: "Curso em vídeo, em português." },
    ],
    videos: [
      { title: "QArentena – Introdução a Testes de API com Postman", channel: "Iterasys", lang: "pt", youtubeId: "_QEXdvw4VMY", kind: "video" },
      { title: "Oficina: Testes automatizados de API com Postman e Newman", channel: "Sidney Sousa", lang: "pt", youtubeId: "PQH6tdGSQcE", kind: "video" },
      { title: "Postman Beginner's Course – API Testing", channel: "freeCodeCamp.org", lang: "en", youtubeId: "VywxIQ2ZXw4", kind: "video" },
      { title: "Postman API Test Automation for Beginners", channel: "freeCodeCamp.org", lang: "en", youtubeId: "zp5Jh2FIpF0", kind: "video" },
    ],
  },
  {
    slug: "bruno",
    name: "Bruno",
    category: "api",
    tagline: "Cliente de API open source que salva as coleções como arquivos no Git.",
    summary: "Alternativa ao Postman que funciona offline e guarda cada requisição em arquivo de texto. Assim a coleção fica versionada no repositório, junto do código, e passa por revisão como qualquer outra mudança.",
    qaFocus: ["Coleções como arquivos .bru versionados", "Ambientes e segredos em .env", "Assertions e scripts de teste", "Bruno CLI em pipeline"],
    practice: { href: "/lab/ferramentas/http", label: "HTTP Request Runner" },
    docs: [
      { title: "Documentação oficial do Bruno", url: "https://docs.usebruno.com/", lang: "en", note: "Instalação, coleções, scripts e CLI." },
      { title: "Bruno Tutorial: guia oficial de primeiros passos", url: "https://blog.usebruno.com/bruno-tutorial", lang: "en", note: "Roteiro curto para a primeira coleção." },
    ],
    courses: [],
    videos: [
      { title: "Bruno API Client Tutorial for Beginners", channel: "Bruno", lang: "en", youtubeId: "bFt8oTxnxlk", kind: "video", official: true },
      { title: "Bruno API Testing: Postman Migration, Scripting & CI/CD", channel: "Bruno", lang: "en", youtubeId: "PlDRiCs2mVw", kind: "video", official: true },
      { title: "Bruno Rest API Client for Software Testing", channel: "EvilTester – Software Testing", lang: "en", youtubeId: "3TlwUKyfOMw", kind: "video" },
    ],
  },
  {
    slug: "swagger",
    name: "Swagger / OpenAPI",
    category: "contrato",
    tagline: "O contrato da API: endpoints, campos, tipos e respostas possíveis.",
    summary: "OpenAPI é a especificação que descreve uma API, e Swagger é o conjunto de ferramentas em volta dela (Editor, UI). Para QA, o documento é o oráculo: diz o que a API promete e permite testar contrato antes de testar regra.",
    qaFocus: ["Ler paths, parâmetros e schemas", "Campos obrigatórios e tipos", "Respostas de erro documentadas (4xx e 5xx)", "Testar pelo Swagger UI e comparar com o que a API devolve"],
    practice: { href: "/lab/ferramentas/contrato", label: "Contract Inspector" },
    docs: [
      { title: "Especificação OpenAPI 3 (Swagger)", url: "https://swagger.io/docs/specification/v3_0/about/", lang: "en", note: "Guia oficial da especificação." },
      { title: "Swagger Editor online", url: "https://editor.swagger.io/", lang: "en", note: "Edite um contrato e veja a documentação ao lado." },
    ],
    courses: [
      { title: "OpenAPI Learn", url: "https://learn.openapis.org/", lang: "en", note: "Material oficial da OpenAPI Initiative." },
      { title: "Curso Gratuito – Como usar o Swagger para documentar uma API", url: "https://www.youtube.com/playlist?list=PLx6gdu4s3nkcQ4qIUYJlXY4saCfgg4XAi", lang: "pt", note: "Playlist em português." },
    ],
    videos: [
      { title: "Construindo APIs com a Open API Specification", channel: "DIO", lang: "pt", youtubeId: "iBM_EFPueks", kind: "video" },
      { title: "Introdução ao Swagger Editor: Como Documentar uma API REST", channel: "Mauro de Boni", lang: "pt", youtubeId: "vFatDFguOmc", kind: "video" },
      { title: "Documentação de API não precisa ser difícil! Swagger na Prática", channel: "Prof. Samuel Matos", lang: "pt", youtubeId: "JvTW9y8qaus", kind: "video" },
      { title: "OpenAPI 3.0 Tutorial | Swagger Editor", channel: "Tutorials Pedia", lang: "en", youtubeId: "mViFmjcDOoA", kind: "video" },
    ],
  },
  {
    slug: "k6",
    name: "k6",
    category: "performance",
    tagline: "Testes de carga escritos em JavaScript, com metas no próprio script.",
    summary: "Ferramenta da Grafana Labs para testes de carga, estresse e pico. Os cenários são código, e os thresholds transformam metas (p95 abaixo de 300 ms, menos de 1% de erros) em aprovação ou reprovação automática.",
    qaFocus: ["Usuários virtuais (VUs), duração e estágios", "Checks e thresholds", "Ler p50, p95, vazão e taxa de erro", "Tipos de teste: smoke, carga, estresse, pico"],
    practice: { href: "/lab/ferramentas/carga", label: "Load Profile Bench" },
    docs: [
      { title: "Documentação oficial do k6", url: "https://grafana.com/docs/k6/latest/", lang: "en", note: "Instalação, scripts, métricas e thresholds." },
    ],
    courses: [
      { title: "Getting started with k6 (Grafana Learning Hub)", url: "https://grafana.com/docs/learning-hub/k6-performance-testing/", lang: "en", note: "Curso oficial gratuito, do primeiro script à linha de base." },
      { title: "k6-learn (workshop oficial)", url: "https://github.com/grafana/k6-learn", lang: "en", note: "Material de workshop com exercícios." },
    ],
    videos: [
      { title: "Testes de Performance em JavaScript com k6", channel: "Talking About Testing", lang: "pt", youtubeId: "4EjHOiXAn8Q", kind: "video" },
      { title: "Introdução aos testes de performance com k6", channel: "Papito | Roverstack", lang: "pt", youtubeId: "Azv3jxXkKeY", kind: "video" },
      { title: "Testes de Performance com Grafana k6", channel: "Hora do QA", lang: "pt", youtubeId: "9yRFhwBS0-8", kind: "video" },
      { title: "Basics of load testing with k6 and Grafana in 20 minutes", channel: "k6", lang: "en", youtubeId: "gvounvDSDGg", kind: "video", official: true },
    ],
  },
  {
    slug: "lighthouse",
    name: "Lighthouse",
    category: "performance",
    tagline: "Auditoria de performance, acessibilidade, boas práticas e SEO de uma página.",
    summary: "Ferramenta do Google embutida no Chrome DevTools. Gera um relatório com notas e com a lista do que causa cada problema. Ajuda QA a dar evidência objetiva sobre lentidão e falhas de acessibilidade.",
    qaFocus: ["Core Web Vitals (LCP, INP, CLS)", "Auditoria de acessibilidade e seus limites", "Diferença entre teste de laboratório e dado de campo", "Rodar em modo mobile e comparar versões"],
    practice: { href: "/lab/ferramentas/acessibilidade", label: "Accessibility Inspector" },
    docs: [
      { title: "Visão geral do Lighthouse", url: "https://developer.chrome.com/docs/lighthouse/overview", lang: "en", note: "Como rodar pelo DevTools, CLI ou Node." },
      { title: "Repositório oficial", url: "https://github.com/GoogleChrome/lighthouse", lang: "en", note: "CLI e integração em CI." },
    ],
    courses: [
      { title: "Learn Performance (web.dev)", url: "https://web.dev/learn/performance", lang: "en", note: "Curso gratuito do Google sobre performance web." },
      { title: "Learn Accessibility (web.dev)", url: "https://web.dev/learn/accessibility", lang: "en", note: "Curso gratuito do Google sobre acessibilidade." },
    ],
    videos: [
      { title: "Lighthouse: avalie a performance do site durante o desenvolvimento!", channel: "Visie Padrões Web", lang: "pt", youtubeId: "2yNivz6CfOY", kind: "video" },
      { title: "Web Performance: Always Auditing with Lighthouse", channel: "This Dot Media", lang: "en", youtubeId: "ofG0QLqrcf8", kind: "video" },
      { title: "Chrome DevTools for Performance Engineers – Lighthouse", channel: "QAInsights", lang: "en", youtubeId: "Mff7H1c6-hY", kind: "video" },
    ],
  },
  {
    slug: "grafana",
    name: "Grafana",
    category: "observabilidade",
    tagline: "Painéis de métricas, logs e traces em um lugar só.",
    summary: "Plataforma de visualização usada para acompanhar sistemas em produção. QA usa para confirmar o impacto de um bug, cruzar o horário de uma falha com métricas e logs, e ler os resultados de testes de carga.",
    qaFocus: ["Ler um painel: métrica, intervalo e agregação", "Logs (Loki) e traces (Tempo) ligados por trace id", "Alertas e o que dispara cada um", "Separar sintoma de causa"],
    practice: { href: "/lab/ferramentas/observabilidade", label: "Trace Explorer" },
    docs: [
      { title: "Documentação oficial do Grafana", url: "https://grafana.com/docs/grafana/latest/", lang: "en", note: "Painéis, fontes de dados e alertas." },
      { title: "Grafana Play", url: "https://play.grafana.org/", lang: "en", note: "Painéis públicos para explorar sem instalar nada." },
    ],
    courses: [
      { title: "Tutoriais oficiais do Grafana", url: "https://grafana.com/tutorials/", lang: "en", note: "Exercícios guiados e gratuitos." },
    ],
    videos: [
      { title: "Grafana for Beginners (série oficial)", channel: "Grafana", lang: "en", youtubeId: "PLDGkOdUX1Ujo27m6qiTPPCpFHVfyKq9jT", kind: "playlist", official: true },
      { title: "What is Observability? | Grafana for Beginners Ep. 1", channel: "Grafana", lang: "en", youtubeId: "TQur9GJHIIQ", kind: "video", official: true },
      { title: "Introdução ao Grafana: O Que é, Para Que Serve e Como Instalar?", channel: "Decoding", lang: "pt", youtubeId: "1EZbuC74BAE", kind: "video" },
    ],
  },
  {
    slug: "git",
    name: "Git",
    category: "base",
    tagline: "Controle de versão: commits, branches, merges e pull requests.",
    summary: "Todo código de teste vive num repositório. QA precisa clonar o projeto, criar uma branch, commitar os testes, abrir pull request e ler o histórico para descobrir quando um bug entrou.",
    qaFocus: ["clone, status, add, commit, push e pull", "Branches e pull requests", "Resolver conflito de merge", "git log e git bisect para achar o commit que quebrou"],
    docs: [
      { title: "Pro Git (livro oficial em português)", url: "https://git-scm.com/book/pt-br/v2", lang: "pt", note: "Livro completo e gratuito." },
      { title: "Sobre o Git (GitHub Docs)", url: "https://docs.github.com/pt/get-started/using-git/about-git", lang: "pt", note: "Introdução oficial do GitHub." },
      { title: "Referência dos comandos", url: "https://git-scm.com/doc", lang: "en", note: "Manual de cada comando." },
    ],
    courses: [
      { title: "Learn Git Branching", url: "https://learngitbranching.js.org/?locale=pt_BR", lang: "pt", note: "Exercícios interativos e visuais, em português." },
      { title: "GitHub Skills", url: "https://skills.github.com/", lang: "en", note: "Cursos práticos oficiais dentro de repositórios reais." },
    ],
    videos: [
      { title: "Curso de Git e Github COMPLETO [Iniciantes]", channel: "Dev Aprender", lang: "pt", youtubeId: "kB5e-gTAl_s", kind: "video" },
      { title: "Como usar Git e GitHub na prática", channel: "Rafaella Ballerini", lang: "pt", youtubeId: "UBAX-13g8OM", kind: "video" },
      { title: "Git and GitHub for Beginners – Crash Course", channel: "freeCodeCamp.org", lang: "en", youtubeId: "RGOj5yH7evk", kind: "video" },
      { title: "Git Tutorial for Beginners: Learn Git in 1 Hour", channel: "Programming with Mosh", lang: "en", youtubeId: "8JJ101D3knE", kind: "video" },
    ],
  },
  {
    slug: "sql",
    name: "SQL",
    category: "base",
    tagline: "Consultar o banco para preparar massa e confirmar o que a tela mostra.",
    summary: "A interface pode mentir; o banco mostra o que de fato foi gravado. Com SQL o QA confirma resultados, encontra registros inconsistentes e prepara dados de teste sem depender de outra pessoa.",
    qaFocus: ["SELECT, WHERE, ORDER BY e LIMIT", "JOIN entre tabelas", "GROUP BY e funções de agregação", "Achar duplicidade, nulos e valores fora da regra"],
    practice: { href: "/lab/ferramentas/sql", label: "SQL Explorer" },
    docs: [
      { title: "Tutorial oficial do PostgreSQL", url: "https://www.postgresql.org/docs/current/tutorial.html", lang: "en", note: "Introdução oficial à linguagem." },
      { title: "W3Schools SQL", url: "https://www.w3schools.com/sql/", lang: "en", note: "Referência rápida com exemplos executáveis." },
    ],
    courses: [
      { title: "SQLBolt", url: "https://sqlbolt.com/", lang: "en", note: "Lições curtas com exercícios no navegador." },
      { title: "SQLZoo", url: "https://sqlzoo.net/", lang: "en", note: "Exercícios progressivos e gratuitos." },
      { title: "Khan Academy: SQL", url: "https://www.khanacademy.org/computing/computer-programming/sql", lang: "en", note: "Curso introdutório gratuito." },
    ],
    videos: [
      { title: "Curso SQL Completo [Iniciantes] + Desafios", channel: "Dev Aprender", lang: "pt", youtubeId: "G7bMwefn8RQ", kind: "video" },
      { title: "SQL Tutorial – Full Database Course for Beginners", channel: "freeCodeCamp.org", lang: "en", youtubeId: "HXV3zeQKqGY", kind: "video" },
      { title: "SQL Course for Beginners [Full Course]", channel: "Programming with Mosh", lang: "en", youtubeId: "7S_tz1z_5bA", kind: "video" },
    ],
  },
  {
    slug: "devtools",
    name: "Chrome DevTools",
    category: "base",
    tagline: "Ver por dentro da página: elementos, console, rede e armazenamento.",
    summary: "A ferramenta de investigação mais usada por QA. A aba Network mostra cada requisição com status, payload e tempo; o Console mostra erros de JavaScript. É de onde sai a evidência que transforma um 'não funciona' num bug reproduzível.",
    qaFocus: ["Network: status, payload, resposta e tempo", "Console: erros e avisos", "Simular rede lenta e dispositivo móvel", "Application: cookies, localStorage e sessão"],
    practice: { href: "/lab/ferramentas/http", label: "HTTP Request Runner" },
    docs: [
      { title: "Documentação oficial do Chrome DevTools", url: "https://developer.chrome.com/docs/devtools", lang: "en", note: "Guia de cada painel." },
      { title: "O que são as ferramentas de desenvolvedor (MDN)", url: "https://developer.mozilla.org/pt-BR/docs/Learn_web_development/Howto/Tools_and_setup/What_are_browser_developer_tools", lang: "pt", note: "Introdução em português." },
    ],
    courses: [],
    videos: [
      { title: "Inspect Network Activity – Chrome DevTools 101", channel: "Chrome for Developers", lang: "en", youtubeId: "e1gAyQuIFQo", kind: "video", official: true },
      { title: "Debugging JavaScript – Chrome DevTools 101", channel: "Chrome for Developers", lang: "en", youtubeId: "H0XScE08hy8", kind: "video", official: true },
      { title: "Use network logs from Chrome DevTools for testing", channel: "Software Testing Tips and Tricks", lang: "en", youtubeId: "-ieAZIMg9J0", kind: "video" },
      { title: "Google Chrome Developer Tools Crash Course", channel: "Traversy Media", lang: "en", youtubeId: "x4q86IjJFag", kind: "video" },
    ],
  },
  {
    slug: "docker",
    name: "Docker",
    category: "base",
    tagline: "Subir a aplicação e suas dependências do mesmo jeito em qualquer máquina.",
    summary: "Containers resolvem o 'na minha máquina funciona'. QA usa Docker para subir o ambiente de teste, um banco limpo ou uma versão específica da aplicação em minutos, e para rodar testes em CI.",
    qaFocus: ["Imagem x container", "docker run, ps, logs e exec", "docker compose para subir vários serviços", "Volumes e portas"],
    docs: [
      { title: "Get started (documentação oficial)", url: "https://docs.docker.com/get-started/", lang: "en", note: "Roteiro oficial do zero ao compose." },
    ],
    courses: [
      { title: "Docker Curriculum", url: "https://docker-curriculum.com/", lang: "en", note: "Tutorial gratuito e completo para iniciantes." },
      { title: "Play with Docker", url: "https://labs.play-with-docker.com/", lang: "en", note: "Laboratório no navegador, sem instalar nada." },
    ],
    videos: [
      { title: "Curso DOCKER + DOCKER COMPOSE", channel: "Fernanda Kipper", lang: "pt", youtubeId: "PLNCSWIsR6ADKRq-XBvAcRd4XtqLj3f_mf", kind: "playlist" },
      { title: "Docker: seu guia definitivo do iniciante ao avançado", channel: "Otávio Miranda", lang: "pt", youtubeId: "IeyO3TnHcaw", kind: "video" },
      { title: "Docker Tutorial for Beginners [FULL COURSE in 3 Hours]", channel: "TechWorld with Nana", lang: "en", youtubeId: "3c-iBn73dDE", kind: "video" },
      { title: "Docker Tutorial for Beginners – A Full DevOps Course", channel: "freeCodeCamp.org", lang: "en", youtubeId: "fqMOX6JJhGo", kind: "video" },
    ],
  },
  {
    slug: "github-actions",
    name: "GitHub Actions",
    category: "cicd",
    tagline: "Rodar os testes automaticamente a cada push e pull request.",
    summary: "Plataforma de CI/CD do GitHub. Workflows em YAML rodam a suíte de testes, publicam relatórios e bloqueiam o merge quando algo falha. É onde a automação de testes passa a valer para o time inteiro.",
    qaFocus: ["Estrutura de um workflow: on, jobs, steps", "Rodar testes em pull request", "Artefatos: relatórios, vídeos e traces", "Secrets e variáveis de ambiente"],
    docs: [
      { title: "Documentação do GitHub Actions (em português)", url: "https://docs.github.com/pt/actions", lang: "pt", note: "Documentação oficial traduzida." },
    ],
    courses: [
      { title: "Microsoft Learn: Introdução ao GitHub Actions", url: "https://learn.microsoft.com/pt-br/training/modules/introduction-to-github-actions/", lang: "pt", note: "Módulo gratuito em português." },
      { title: "GitHub Skills: Hello GitHub Actions", url: "https://github.com/skills/hello-github-actions", lang: "en", note: "Curso prático oficial, feito dentro de um repositório." },
    ],
    videos: [
      { title: "Criando um Workflow AUTOMATIZADO de CI com o Github Actions", channel: "Fernanda Kipper", lang: "pt", youtubeId: "F51HlrEeedw", kind: "video" },
      { title: "GitHub Actions: Primeiros Passos", channel: "Microsoft Reactor", lang: "pt", youtubeId: "ecXzb6az1rg", kind: "video" },
      { title: "GitHub Actions Tutorial – Basic Concepts and CI/CD Pipeline", channel: "TechWorld with Nana", lang: "en", youtubeId: "R8_veQiYBjI", kind: "video" },
    ],
  },
  {
    slug: "gherkin",
    name: "Cucumber e Gherkin (BDD)",
    category: "processo",
    tagline: "Escrever comportamento como exemplos: Dado, Quando, Então.",
    summary: "Gherkin é a linguagem estruturada para descrever cenários de forma que produto, desenvolvimento e QA entendam igual; Cucumber é a ferramenta que liga cada passo ao código de automação. Funciona em português (Funcionalidade, Cenário, Dado, Quando, Então).",
    qaFocus: ["Funcionalidade, Cenário, Dado, Quando, Então", "Esquema do Cenário com Exemplos", "Cenários declarativos em vez de passo a passo de clique", "BDD é conversa antes de ser ferramenta"],
    practice: { href: "/lab/bdd", label: "Gerador de BDD" },
    docs: [
      { title: "Referência do Gherkin", url: "https://cucumber.io/docs/gherkin/reference/", lang: "en", note: "Todas as palavras-chave e regras." },
      { title: "Palavras-chave em português", url: "https://cucumber.io/docs/gherkin/languages/", lang: "en", note: "Tabela com o dialeto pt de cada palavra-chave." },
      { title: "O que é BDD", url: "https://cucumber.io/docs/bdd/", lang: "en", note: "Explicação oficial da prática." },
    ],
    courses: [
      { title: "Cucumber School", url: "https://school.cucumber.io/", lang: "en", note: "Cursos oficiais gratuitos de BDD." },
    ],
    videos: [
      { title: "BDD | O que é Gherkin", channel: "QaOps", lang: "pt", youtubeId: "XYhaFnjvi3U", kind: "video" },
      { title: "Curso Completo de Cucumber Java: Introdução (Gherkin em português)", channel: "Craft Of Programming", lang: "pt", youtubeId: "5I-3aLe3450", kind: "video" },
      { title: "Mastering Gherkin Keywords: Given, When, Then, And & But", channel: "Bhau-Automation Lab", lang: "en", youtubeId: "ESxaAngHonM", kind: "video" },
      { title: "Cucumber BDD Best Practices", channel: "The-Ohayo-Dev", lang: "en", youtubeId: "nrggIRWK6qo", kind: "video" },
    ],
  },
  {
    slug: "qase",
    name: "Qase",
    category: "processo",
    tagline: "Gestão de casos de teste, execuções e defeitos.",
    summary: "Ferramenta de gestão de testes: organiza casos em suítes, registra execuções, liga falhas a defeitos e mostra cobertura de requisitos. Tem plano gratuito e integra com Jira e com frameworks de automação.",
    qaFocus: ["Repositório, suítes e casos", "Test runs e registro de resultado", "Parâmetros e casos compartilhados", "Rastreabilidade entre requisito e teste"],
    docs: [
      { title: "Central de ajuda do Qase", url: "https://help.qase.io/", lang: "en", note: "Guia de uso da plataforma." },
      { title: "Documentação do Qase", url: "https://docs.qase.io/", lang: "en", note: "Recursos, integrações e relatórios." },
      { title: "API e reporters", url: "https://developers.qase.io/", lang: "en", note: "Enviar resultados da automação para o Qase." },
    ],
    courses: [],
    videos: [
      { title: "Gerenciando testes com Qase.io #01", channel: "Priscila Caimi", lang: "pt", youtubeId: "f6X-tJDDD0U", kind: "video" },
      { title: "Aprenda a utilizar o repositório de testes – Qase", channel: "Aprendendo a Fazer TI", lang: "pt", youtubeId: "C7Tv2MBIjDU", kind: "video" },
      { title: "Using Qase: Test Repository", channel: "Qase", lang: "en", youtubeId: "1Mng3GNEHMw", kind: "video", official: true },
      { title: "Using Qase: Test Cases", channel: "Qase", lang: "en", youtubeId: "bidHMkx3OdM", kind: "video", official: true },
      { title: "Using Qase: Test Suites", channel: "Qase", lang: "en", youtubeId: "G5f1Ds390_E", kind: "video", official: true },
    ],
  },
  {
    slug: "pact",
    name: "Pact",
    category: "contrato",
    tagline: "Teste de contrato guiado pelo consumidor, entre serviços.",
    summary: "Em vez de subir todos os serviços para um teste ponta a ponta, o consumidor registra o que espera da API e o provedor verifica se cumpre. Pega quebra de contrato no pull request, antes de chegar em homologação.",
    qaFocus: ["Consumidor, provedor e o arquivo de pacto", "Matchers: validar formato em vez de valor exato", "Verificação do provedor no CI", "Pact Broker e a pergunta can-i-deploy"],
    practice: { href: "/lab/ferramentas/contrato", label: "Contract Inspector" },
    docs: [
      { title: "Documentação oficial do Pact", url: "https://docs.pact.io/", lang: "en", note: "Conceitos e guias por linguagem." },
      { title: "Guia de 5 minutos", url: "https://docs.pact.io/5-minute-getting-started-guide", lang: "en", note: "O fluxo completo em um exemplo curto." },
    ],
    courses: [
      { title: "Pact University", url: "https://docs.pact.io/university", lang: "en", note: "Workshops oficiais e gratuitos, em várias linguagens." },
    ],
    videos: [
      { title: "Introduction to contract testing with PactFlow (série)", channel: "PactFlow", lang: "en", youtubeId: "PLwy9Bnco-IpfZ72VQ7hce8GicVZs7nm0i", kind: "playlist", official: true },
      { title: "Demo – Contract testing with Pact JS", channel: "PactFlow", lang: "en", youtubeId: "6Qd-kq1AzZI", kind: "video", official: true },
      { title: "Best practices for writing consumer tests", channel: "PactFlow", lang: "en", youtubeId: "oPuHb9Rl8Zo", kind: "video", official: true },
    ],
  },
  {
    slug: "axe",
    name: "axe DevTools",
    category: "risco",
    tagline: "Encontra falhas de acessibilidade e aponta o critério WCAG de cada uma.",
    summary: "Motor de regras da Deque usado pela maioria das ferramentas de acessibilidade, inclusive pelo Lighthouse. Roda como extensão do navegador ou dentro do Playwright e do Cypress. Pega uma parte das falhas; o restante exige teclado, leitor de tela e julgamento.",
    qaFocus: ["Rodar a extensão e ler impacto e critério WCAG", "O que a ferramenta automática não pega", "Testar só com teclado: ordem e visibilidade do foco", "axe-core dentro da automação (Playwright)"],
    practice: { href: "/lab/ferramentas/acessibilidade", label: "Accessibility Inspector" },
    docs: [
      { title: "axe DevTools (Deque)", url: "https://www.deque.com/axe/devtools/", lang: "en", note: "Extensão gratuita para Chrome, Edge e Firefox." },
      { title: "axe-core", url: "https://github.com/dequelabs/axe-core", lang: "en", note: "O motor de regras, para usar na automação." },
      { title: "Testes de acessibilidade no Playwright", url: "https://playwright.dev/docs/accessibility-testing", lang: "en", note: "Como plugar o axe numa suíte E2E." },
      { title: "WCAG 2.1 em português", url: "https://www.w3c.br/traducoes/wcag/wcag21-pt-BR/", lang: "pt", note: "Tradução oficial autorizada pelo W3C." },
    ],
    courses: [
      { title: "Guia WCAG", url: "https://guia-wcag.com/", lang: "pt", note: "Critérios da WCAG explicados em português, com exemplos." },
      { title: "W3C WAI: avaliar acessibilidade", url: "https://www.w3.org/WAI/test-evaluate/", lang: "en", note: "Guia oficial de como avaliar, do rápido ao completo." },
      { title: "WAVE", url: "https://wave.webaim.org/", lang: "en", note: "Segunda opinião gratuita, com outra forma de mostrar os problemas." },
    ],
    videos: [
      { title: "What is axe DevTools?", channel: "Deque Systems", lang: "en", youtubeId: "LUxS78U5SkI", kind: "video", official: true },
      { title: "axe DevTools For Web overview", channel: "Deque Systems", lang: "en", youtubeId: "iiPRX_Zrvlc", kind: "video", official: true },
      { title: "Quick Accessibility Audit with Axe DevTools", channel: "newline", lang: "en", youtubeId: "eksbiwCxikQ", kind: "video" },
      { title: "Web Accessibility Audit: Testing with Lighthouse & axe DevTools", channel: "Udeme Emmanuel", lang: "en", youtubeId: "3MK1_XXY6BA", kind: "video" },
    ],
  },
  {
    slug: "owasp-zap",
    name: "ZAP (antigo OWASP ZAP)",
    category: "risco",
    tagline: "Proxy e scanner de segurança web, gratuito e open source.",
    summary: "Desde 2024 se chama ZAP by Checkmarx e continua gratuito e open source. Fica entre o navegador e a aplicação, registra o tráfego e procura vulnerabilidades conhecidas (OWASP Top 10). Para QA, é a porta de entrada em testes de segurança. Use só em sistemas que você tem autorização para testar; o OWASP Juice Shop existe para treinar.",
    qaFocus: ["Configurar o ZAP como proxy do navegador", "Spider e scan passivo antes do ativo", "Ler um alerta: risco, confiança e evidência", "Treinar no Juice Shop, nunca em sistema de terceiros"],
    practice: { href: "/lab/ferramentas/seguranca", label: "Security Probe" },
    docs: [
      { title: "Getting started (ZAP)", url: "https://www.zaproxy.org/getting-started/", lang: "en", note: "Guia oficial de primeiros passos." },
      { title: "Documentação do ZAP", url: "https://www.zaproxy.org/docs/", lang: "en", note: "Referência completa da ferramenta." },
      { title: "OWASP Top 10", url: "https://owasp.org/www-project-top-ten/", lang: "en", note: "As categorias de risco que o ZAP procura." },
    ],
    courses: [
      { title: "PortSwigger Web Security Academy", url: "https://portswigger.net/web-security", lang: "en", note: "Curso gratuito com laboratórios de cada vulnerabilidade." },
      { title: "OWASP Juice Shop", url: "https://owasp.org/www-project-juice-shop/", lang: "en", note: "Aplicação vulnerável de propósito, para treinar com segurança." },
    ],
    videos: [
      { title: "OWASP Zap, um Web Scanner open source – Código Seguro #027", channel: "Cássio Batista Pereira", lang: "pt", youtubeId: "GNjrrGKD6gY", kind: "video" },
      { title: "Owasp Zap – Overview de Ferramentas de Testes", channel: "4ALL Tests", lang: "pt", youtubeId: "lmi_TiWiIGg", kind: "video" },
      { title: "Getting Started with OWASP ZAP", channel: "Test Evolve", lang: "en", youtubeId: "ezxBkFhKXhw", kind: "video" },
      { title: "OWASP ZAP Tutorial for Beginners", channel: "UnitK", lang: "en", youtubeId: "D2reRMTihVo", kind: "video" },
    ],
  },
  {
    slug: "jira",
    name: "Jira",
    category: "processo",
    tagline: "Onde o time registra histórias, bugs e o andamento do trabalho.",
    summary: "A ferramenta de gestão de trabalho mais comum nas vagas de QA. É nela que o bug report vive: título, passos, esperado, observado, evidência, severidade e o fluxo até ser validado. Saber escrever e filtrar no Jira é parte do trabalho diário.",
    qaFocus: ["Criar um bug com passos, esperado, observado e evidência", "Fluxo do bug até Ready for QA e Done", "Board Kanban e Scrum: ler o andamento do time", "Filtros e JQL para achar o que mudou"],
    practice: { href: "/lab/triagem", label: "Triagem de bugs" },
    docs: [
      { title: "Guias do Jira (em português)", url: "https://www.atlassian.com/br/software/jira/guides", lang: "pt", note: "Guia oficial, do básico às funções avançadas." },
      { title: "Suporte do Jira Software Cloud", url: "https://support.atlassian.com/jira-software-cloud/", lang: "en", note: "Documentação de referência." },
    ],
    courses: [
      { title: "Atlassian University", url: "https://university.atlassian.com/", lang: "en", note: "Cursos oficiais; a maioria das trilhas introdutórias é gratuita." },
      { title: "Tutoriais de Agile da Atlassian", url: "https://www.atlassian.com/br/agile/tutorials", lang: "pt", note: "Scrum e Kanban na prática dentro do Jira, em português." },
    ],
    videos: [
      { title: "Jira – Como criar um ticket do tipo Bug", channel: "QA hacks e dicas", lang: "pt", youtubeId: "Sfr1V7bno60", kind: "video" },
      { title: "Jira – Bug life cycle – Ready for QA", channel: "QA hacks e dicas", lang: "pt", youtubeId: "rZCknk0wc-s", kind: "video" },
      { title: "Jira Software Tutoriais em Português", channel: "ORafael Oficial", lang: "pt", youtubeId: "PL7yCYKrfBGNlyNzRdWPQb13stfzTr4zZo", kind: "playlist" },
      { title: "Jira Tutorial for QA Testers", channel: "Jira Bro", lang: "en", youtubeId: "F1FcTI2VDeQ", kind: "video" },
    ],
  },
  {
    slug: "rest-assured",
    name: "REST Assured",
    category: "api",
    tagline: "Testes de API em Java, com sintaxe given, when, then.",
    summary: "A biblioteca mais pedida em vagas de automação de API com Java. Os testes ficam no repositório, rodam no CI junto com JUnit ou TestNG e validam status, corpo, headers e schema. É o passo seguinte para quem já testa API no Postman.",
    qaFocus: ["given / when / then e o que vai em cada parte", "Validar corpo com JSON path e Hamcrest matchers", "Request e response specification para não repetir configuração", "Validação de schema JSON"],
    docs: [
      { title: "Site oficial do REST Assured", url: "https://rest-assured.io/", lang: "en", note: "Visão geral, versões e exemplos curtos." },
      { title: "Guia de uso (wiki)", url: "https://github.com/rest-assured/rest-assured/wiki/Usage", lang: "en", note: "Referência completa: requisição, validação, autenticação e schema." },
    ],
    courses: [
      { title: "Test Automation University", url: "https://testautomationu.applitools.com/", lang: "en", note: "Tem cursos gratuitos de REST Assured com certificado." },
    ],
    videos: [
      { title: "Série \"Para que serve esta ferramenta?\": RestAssured", channel: "Julio de Lima", lang: "pt", youtubeId: "xqZz0NbjgaE", kind: "video" },
      { title: "Como automatizar testes de API Rest com RestAssured (Aula 11)", channel: "Julio de Lima", lang: "pt", youtubeId: "kWdAhtcyxw8", kind: "video" },
      { title: "Como testar API usando rest assured | Criando o projeto", channel: "QaOps", lang: "pt", youtubeId: "EjXimnUwAns", kind: "video" },
      { title: "REST Assured API Testing Tutorial Crash Course 2024", channel: "Testers Talk", lang: "en", youtubeId: "o9KJhGHl49M", kind: "video" },
    ],
  },
  {
    slug: "pytest",
    name: "Pytest",
    category: "unidade",
    tagline: "O runner de testes do Python, de unidade a API e E2E.",
    summary: "Padrão de mercado para testes em Python. Usa assert simples, fixtures para preparar e limpar o ambiente e parametrização para rodar o mesmo teste com vários dados. Serve de base para automação de API (com requests) e de interface (com Playwright ou Selenium).",
    qaFocus: ["assert simples e a mensagem de falha que ele gera", "Fixtures e escopo (function, module, session)", "parametrize para testar várias entradas", "Marcadores para separar smoke de regressão"],
    docs: [
      { title: "Primeiros passos", url: "https://docs.pytest.org/en/stable/getting-started.html", lang: "en", note: "Instalar, escrever e rodar o primeiro teste." },
      { title: "Fixtures", url: "https://docs.pytest.org/en/stable/how-to/fixtures.html", lang: "en", note: "O recurso que mais diferencia o pytest." },
      { title: "Parametrização", url: "https://docs.pytest.org/en/stable/how-to/parametrize.html", lang: "en", note: "Um teste, várias massas de dados." },
    ],
    courses: [],
    videos: [
      { title: "PyTest - testes profissionais para seus códigos Python", channel: "Hashtag Programação", lang: "pt", youtubeId: "FW-mYXr2M8w", kind: "video" },
      { title: "O mínimo que você deveria saber sobre testes unitários - #30diasdepython", channel: "Eduardo Mendes", lang: "pt", youtubeId: "pZvhZ-Lr-PE", kind: "video" },
      { title: "Pytest Tutorial – How to Test Python Code", channel: "freeCodeCamp.org", lang: "en", youtubeId: "cHYq1MRoyI0", kind: "video" },
      { title: "Please Learn How To Write Tests in Python… • Pytest Tutorial", channel: "Tech With Tim", lang: "en", youtubeId: "EgpLj86ZHFQ", kind: "video" },
    ],
  },
  {
    slug: "junit",
    name: "JUnit 5",
    category: "unidade",
    tagline: "O runner de testes do Java, base para Selenium e REST Assured.",
    summary: "Quase toda suíte de automação em Java roda em cima do JUnit ou do TestNG. Entender anotações, ciclo de vida e testes parametrizados é o que permite ler o projeto do time e organizar a própria suíte.",
    qaFocus: ["@Test, @BeforeEach e @AfterEach: o ciclo de vida", "Assertions e assertAll", "@ParameterizedTest com fontes de dados", "Tags para separar suítes no CI"],
    docs: [
      { title: "Guia do usuário do JUnit", url: "https://docs.junit.org/current/user-guide/", lang: "en", note: "Documentação oficial completa." },
    ],
    courses: [],
    videos: [
      { title: "Como Fazer Testes Unitários em Java com JUnit 5 e Mockito: Passo a Passo 2023", channel: "Javanauta", lang: "pt", youtubeId: "rVSwDX9KUt8", kind: "video" },
      { title: "[TUTORIAL] Dominando testes unitários com JUnit 5 e Mockito", channel: "Felix Gilioli", lang: "pt", youtubeId: "zqzoCXk2k-k", kind: "video" },
      { title: "Java Testing - JUnit 5 Crash Course", channel: "freeCodeCamp.org", lang: "en", youtubeId: "flpmSXVTqBI", kind: "video" },
      { title: "JUnit 5 Tutorial - Crash Course", channel: "Marco Codes", lang: "en", youtubeId: "6uSnF6IuWIw", kind: "video" },
    ],
  },
  {
    slug: "browserstack",
    name: "BrowserStack",
    category: "mobile",
    tagline: "Navegadores e celulares reais na nuvem para rodar a suíte.",
    summary: "Em vez de manter um laboratório de aparelhos, o time roda os testes de Playwright, Selenium e Appium em milhares de combinações de navegador, sistema e dispositivo. Aparece com frequência em vagas internacionais; Sauce Labs e LambdaTest são as alternativas mais comuns.",
    qaFocus: ["Montar a matriz de navegadores e dispositivos pelo risco, não por tudo", "Rodar uma suíte existente apontando para a nuvem", "Ler vídeo, log e rede de uma execução que falhou", "Teste manual em aparelho real (Live)"],
    docs: [
      { title: "Playwright no BrowserStack", url: "https://www.browserstack.com/docs/automate/playwright", lang: "en", note: "Rodar testes web existentes na nuvem." },
      { title: "Selenium no BrowserStack", url: "https://www.browserstack.com/docs/automate/selenium", lang: "en", note: "O mesmo, para suítes em Selenium." },
      { title: "Appium no App Automate", url: "https://www.browserstack.com/docs/app-automate/appium", lang: "en", note: "Testes mobile em aparelhos reais." },
    ],
    courses: [],
    videos: [
      { title: "BrowserStack Tutorial for Beginners - Mobile app and cross-platform testing", channel: "Software Testing 101", lang: "en", youtubeId: "lO1qS2mctN0", kind: "video" },
      { title: "App Automate - An Overview", channel: "BrowserStack", lang: "en", youtubeId: "7Jn6nL8lwwI", kind: "video", official: true },
    ],
  },
  {
    slug: "allure",
    name: "Allure Report",
    category: "cicd",
    tagline: "Relatório de testes legível, com passos, anexos e histórico.",
    summary: "Transforma o resultado da suíte em um relatório navegável, com passos, screenshots, categorias de falha e tendência entre execuções. Funciona com Playwright, Cypress, pytest, JUnit e TestNG, e costuma ser publicado pelo pipeline para o time inteiro ver.",
    qaFocus: ["Gerar o relatório a partir dos resultados da suíte", "Passos e anexos para a falha se explicar sozinha", "Categorias: bug de produto, de teste ou de ambiente", "Histórico e testes instáveis (flaky)"],
    docs: [
      { title: "Documentação do Allure Report", url: "https://allurereport.org/docs/", lang: "en", note: "Instalação e integração com cada framework." },
      { title: "Allure com Playwright", url: "https://allurereport.org/docs/playwright/", lang: "en", note: "Exemplo direto para a stack mais comum hoje." },
    ],
    courses: [],
    videos: [
      { title: "Cypress - adicionando relatório com o Allure Reports Plugin", channel: "Agilizei", lang: "pt", youtubeId: "y3QZQF2wBW4", kind: "video" },
      { title: "Crie um Pipeline de Testes Contínuos com Jenkins, Playwright e Allure Reports #QATW1", channel: "Papito | Roverstack", lang: "pt", youtubeId: "BQGOeGrR4pA", kind: "video" },
      { title: "Introduction to Allure Report | A Universal Report", channel: "PrinceAutomationDestination", lang: "en", youtubeId: "G0kcL9lReh4", kind: "video" },
      { title: "Playwright with Allure Report Step by Step | Reporting in Test Automation", channel: "PrinceAutomationDestination", lang: "en", youtubeId: "2LqFaYJlBVM", kind: "video" },
    ],
  },
  {
    slug: "wiremock",
    name: "WireMock",
    category: "contrato",
    tagline: "Simula APIs de terceiros para testar sem depender delas.",
    summary: "Sobe um servidor falso que responde como o serviço real. Com ele dá para testar timeout, erro 500, resposta lenta ou campo faltando, situações difíceis de provocar no sistema verdadeiro. Roda em Java, em Docker ou como processo isolado.",
    qaFocus: ["Stub: dada esta requisição, devolva esta resposta", "Simular falhas: atraso, 500, conexão cortada", "Verificar que a chamada foi feita como esperado", "Mock não substitui teste de contrato"],
    docs: [
      { title: "Documentação do WireMock", url: "https://wiremock.org/docs/", lang: "en", note: "Formas de rodar e conceitos." },
      { title: "Stubbing", url: "https://wiremock.org/docs/stubbing/", lang: "en", note: "Como montar as respostas simuladas." },
    ],
    courses: [],
    videos: [
      { title: "Wiremock: Simule integrações entre sistemas", channel: "Full Cycle", lang: "pt", youtubeId: "cCUoC4WLtwk", kind: "video" },
      { title: "Mock Any API with WireMock | Step-by-Step Tutorial for Developers", channel: "Murat Öksüzer", lang: "en", youtubeId: "b8mS38xAdTg", kind: "video" },
      { title: "WireMock in 30min", channel: "ProdBug108", lang: "en", youtubeId: "iEDeiBPDFjs", kind: "video" },
    ],
  },
  {
    slug: "msw",
    name: "MSW (Mock Service Worker)",
    category: "contrato",
    tagline: "Mock de API no front-end, no navegador e nos testes.",
    summary: "Intercepta as requisições da aplicação no nível da rede, então o código do front não sabe que está falando com um mock. O mesmo conjunto de respostas serve para desenvolvimento, testes de unidade e testes de componente, o que ajuda a reproduzir estados de erro e de lista vazia.",
    qaFocus: ["Handlers: qual rota devolve o quê", "Sobrescrever um handler num teste para forçar erro", "Cobrir estados vazios, de carregamento e de falha", "Onde o MSW para e o E2E começa"],
    docs: [
      { title: "Documentação do MSW", url: "https://mswjs.io/docs/", lang: "en", note: "Conceitos e integrações." },
      { title: "Quick start", url: "https://mswjs.io/docs/quick-start", lang: "en", note: "O primeiro mock em poucos minutos." },
    ],
    courses: [],
    videos: [
      { title: "Conheça o Mock Service Worker - MSW", channel: "Kevin Uehara", lang: "pt", youtubeId: "rQqz6DXJ29U", kind: "video" },
      { title: "What is Mock Service Worker (MSW)?", channel: "Mock Service Worker", lang: "en", youtubeId: "HcQCqboatZk", kind: "video", official: true },
      { title: "Mock a Basic HTTP Response — Mocking REST API with Mock Service Worker", channel: "Mock Service Worker", lang: "en", youtubeId: "e8lbbqSa4e4", kind: "video", official: true },
    ],
  },
  {
    slug: "xray",
    name: "Xray (Jira)",
    category: "processo",
    tagline: "Casos de teste, execuções e cobertura dentro do próprio Jira.",
    summary: "Em muitas empresas a gestão de testes não é uma ferramenta separada: roda dentro do Jira com Xray ou Zephyr. Cada teste vira uma issue ligada à história, as execuções ficam registradas e a automação envia resultados pela API. É o que mais aparece em vagas internacionais junto do TestRail.",
    qaFocus: ["Test, Test Set, Test Plan e Test Execution", "Ligar o teste à história para ter cobertura", "Registrar resultado e evidência numa execução", "Importar resultados da automação (JUnit XML)"],
    docs: [
      { title: "Documentação do Xray", url: "https://docs.getxray.app/", lang: "en", note: "Referência para Cloud e Data Center." },
    ],
    courses: [
      { title: "Xray Academy", url: "https://academy.getxray.app/", lang: "en", note: "Cursos oficiais de gestão de testes com Xray." },
    ],
    videos: [
      { title: "08 - Jira - Testando com XRay", channel: "QA hacks e dicas", lang: "pt", youtubeId: "fAOqxIjKTHA", kind: "video" },
      { title: "09 - Jira - Testes com Xray Test Run", channel: "QA hacks e dicas", lang: "pt", youtubeId: "gK7HY-Q098o", kind: "video" },
      { title: "Como Executar Testes no Xray Jira e Registrar Resultados | Curso Xray #04", channel: "Willames Vital", lang: "pt", youtubeId: "GWSywiEJ1O0", kind: "video" },
      { title: "Xray Test Management App - Quick demo", channel: "Xray", lang: "en", youtubeId: "uKZng5ZmtJM", kind: "video", official: true },
      { title: "Jira Xray Tutorial #3 - How to Create Test Cases in Jira Xray", channel: "Software Testing Mentor", lang: "en", youtubeId: "MlvtSJbeqog", kind: "video" },
    ],
  },
  {
    slug: "testrail",
    name: "TestRail",
    category: "processo",
    tagline: "A ferramenta de gestão de testes mais citada em vagas internacionais.",
    summary: "Organiza casos em suítes e seções, monta planos e execuções, registra resultado por caso e gera relatórios de progresso. Integra com Jira e recebe resultados da automação. Os conceitos são os mesmos do Qase e do Xray, então aprender um ajuda nos outros.",
    qaFocus: ["Projetos, suítes, seções e casos", "Test runs e test plans", "Registrar resultado com evidência e defeito no Jira", "Relatórios de progresso para o time"],
    docs: [
      { title: "Introdução ao TestRail", url: "https://support.testrail.com/hc/en-us/articles/7076810203028-Introduction-to-TestRail", lang: "en", note: "Ponto de partida da central de ajuda oficial." },
    ],
    courses: [
      { title: "TestRail Academy", url: "https://academy.testrail.com/", lang: "en", note: "Cursos oficiais e gratuitos, com certificado." },
    ],
    videos: [
      { title: "Escrevendo Casos de teste Com TestRail", channel: "DevTrends", lang: "pt", youtubeId: "3RnyDdPZacQ", kind: "video" },
      { title: "TestRail 101", channel: "TestRail", lang: "en", youtubeId: "gznZnIA80Ro", kind: "video", official: true },
      { title: "Latest Tutorial On TestRail - Test Management Tool (Test Cases, Execution, Test Suites & Reports)", channel: "Naveen AutomationLabs", lang: "en", youtubeId: "S8ZWLCn8HkY", kind: "video" },
    ],
  },
  {
    slug: "maestro",
    name: "Maestro",
    category: "mobile",
    tagline: "Testes mobile em YAML, com espera automática e pouca configuração.",
    summary: "Framework de automação mobile que cresceu rápido por ser simples: os fluxos são arquivos YAML, a ferramenta espera os elementos sozinha e roda em Android, iOS, React Native e Flutter. Não substitui o Appium em todo projeto, mas é o caminho mais curto até o primeiro teste mobile estável.",
    qaFocus: ["Flows em YAML: tapOn, inputText, assertVisible", "Maestro Studio para achar elementos e gravar passos", "Por que ele é menos flaky que um script cheio de esperas", "Quando ainda faz sentido escolher o Appium"],
    docs: [
      { title: "Documentação do Maestro", url: "https://docs.maestro.dev/", lang: "en", note: "Conceitos, comandos e exemplos." },
      { title: "Instalação", url: "https://docs.maestro.dev/getting-started/installing-maestro", lang: "en", note: "Do zero ao primeiro flow rodando." },
    ],
    courses: [],
    videos: [
      { title: "Seu Primeiro Teste Mobile em 15 Minutos, Sem Programar (Maestro)", channel: "Jeferson Caye", lang: "pt", youtubeId: "74NP_z3jguA", kind: "video" },
      { title: "Painless Mobile Test Automation with Maestro?", channel: "Software Testing by Daniel Knott", lang: "en", youtubeId: "EcO1QVtnqxw", kind: "video" },
      { title: "Live Demo + Q&A: Automate Mobile & Web Testing with Maestro", channel: "Maestro", lang: "en", youtubeId: "2gXvhoTlPJM", kind: "video", official: true },
    ],
  },
  {
    slug: "visual-testing",
    name: "Regressão visual (Applitools, Percy, Playwright)",
    category: "web",
    tagline: "Pega o layout quebrado que a asserção funcional não vê.",
    summary: "O teste compara uma captura da tela com uma imagem de referência aprovada. O Playwright faz isso de graça com toHaveScreenshot; Applitools e Percy adicionam comparação inteligente, que ignora ruído de renderização, e um painel para aprovar mudanças. O trabalho de QA é decidir o que comparar e revisar as diferenças.",
    qaFocus: ["Baseline: quem aprova a imagem de referência", "Mascarar o que muda sozinho (datas, anúncios, animações)", "Comparação pixel a pixel x comparação visual por IA", "Rodar em poucos tamanhos de tela, escolhidos pelo risco"],
    docs: [
      { title: "Comparação visual no Playwright", url: "https://playwright.dev/docs/test-snapshots", lang: "en", note: "toHaveScreenshot, sem ferramenta paga." },
      { title: "Documentação do Applitools", url: "https://applitools.com/docs/", lang: "en", note: "Eyes e integrações com cada framework." },
      { title: "Percy (BrowserStack)", url: "https://www.browserstack.com/docs/percy", lang: "en", note: "A principal alternativa ao Applitools." },
    ],
    courses: [
      { title: "Test Automation University", url: "https://testautomationu.applitools.com/", lang: "en", note: "Mantida pela Applitools; tem cursos gratuitos de teste visual." },
    ],
    videos: [
      { title: "Playwright Visual Testing with toHaveScreenshot() | Visual Regression Testing", channel: "Lets Learn QA", lang: "en", youtubeId: "Wtw5kZbvvd0", kind: "video" },
      { title: "Visual Testing with Applitools: A Step-by-Step Setup Guide", channel: "Bondar Academy", lang: "en", youtubeId: "iabKypI3lhU", kind: "video" },
      { title: "Visual Testing Masterclass Part 1", channel: "Applitools: AI-powered testing you can depend on.", lang: "en", youtubeId: "JSdHv4YaMm4", kind: "video", official: true },
    ],
  },
  {
    slug: "jenkins",
    name: "Jenkins",
    category: "cicd",
    tagline: "O servidor de CI mais comum em empresas grandes.",
    summary: "Ferramenta open source de integração contínua que ainda domina em bancos, varejo e empresas com infraestrutura própria. O pipeline fica num Jenkinsfile versionado. Para QA, o importante é entender onde a suíte roda, como ler o log de uma falha e como publicar o relatório.",
    qaFocus: ["Jenkinsfile: stages, steps e post", "Disparar a suíte por commit, agendamento ou parâmetro", "Ler o console de um build que falhou", "Publicar relatório (JUnit, Allure) e arquivar evidências"],
    docs: [
      { title: "Documentação do Jenkins", url: "https://www.jenkins.io/doc/", lang: "en", note: "Instalação e conceitos." },
      { title: "Pipeline", url: "https://www.jenkins.io/doc/book/pipeline/", lang: "en", note: "Como escrever o Jenkinsfile." },
    ],
    courses: [],
    videos: [
      { title: "O que é Jenkins | Guia prático para começar com Jenkins", channel: "Fabricio Veronez", lang: "pt", youtubeId: "mvtVL5eivzo", kind: "video" },
      { title: "Criando primeira Pipeline no Jenkins", channel: "netodevel", lang: "pt", youtubeId: "BVE9En1lIx8", kind: "video" },
      { title: "Crie um Pipeline de Testes Contínuos com Jenkins, Playwright e Allure Reports #QATW1", channel: "Papito | Roverstack", lang: "pt", youtubeId: "BQGOeGrR4pA", kind: "video" },
      { title: "Learn Jenkins! Complete Jenkins Course - Zero to Hero", channel: "DevOps Journey", lang: "en", youtubeId: "6YZvp2GwT0A", kind: "video" },
      { title: "Jenkins for Beginners", channel: "Telusko", lang: "en", youtubeId: "1LE1llhafOE", kind: "video" },
    ],
  },
  {
    slug: "gitlab-ci",
    name: "GitLab CI",
    category: "cicd",
    tagline: "Pipeline de CI/CD integrado ao repositório do GitLab.",
    summary: "Para quem trabalha em empresa que usa GitLab, o pipeline é um arquivo .gitlab-ci.yml na raiz do projeto. A lógica é a mesma do GitHub Actions: jobs, stages, artefatos e regras de quando rodar. Saber os dois cobre a maior parte das vagas.",
    qaFocus: [".gitlab-ci.yml: stages, jobs e scripts", "Artefatos e relatórios de teste no merge request", "rules para rodar smoke no MR e regressão na main", "Variáveis e segredos sem vazar no log"],
    docs: [
      { title: "GitLab CI/CD", url: "https://docs.gitlab.com/ci/", lang: "en", note: "Referência oficial." },
      { title: "Quick start", url: "https://docs.gitlab.com/ci/quick_start/", lang: "en", note: "O primeiro pipeline, passo a passo." },
    ],
    courses: [],
    videos: [
      { title: "Pipelines no GitLab #01 — Sua primeira automação em 20 minutos!", channel: "Code In Loop", lang: "pt", youtubeId: "TBlBnlIEzBk", kind: "video" },
      { title: "GitLab CI CD Tutorial for Beginners [Crash Course]", channel: "TechWorld with Nana", lang: "en", youtubeId: "qP8kir2GUgo", kind: "video" },
      { title: "GitLab CI/CD Pipeline Tutorial for Beginners", channel: "Valentin Despa", lang: "en", youtubeId: "z7nLsJvEyMY", kind: "video" },
    ],
  },
  {
    slug: "jmeter",
    name: "JMeter",
    category: "performance",
    tagline: "Teste de carga com interface gráfica, ainda muito pedido em vagas.",
    summary: "Ferramenta da Apache para testes de carga e performance. O k6 é mais moderno e mais fácil de versionar, mas o JMeter continua presente em empresas tradicionais e em muitas descrições de vaga. Os conceitos (usuários virtuais, ramp-up, percentis) são os mesmos nas duas.",
    qaFocus: ["Thread Group: usuários, ramp-up e duração", "Samplers HTTP, extratores e correlação de tokens", "Assertions e listeners: o que olhar no resultado", "Rodar sem interface (modo CLI) para não distorcer a medição"],
    docs: [
      { title: "Getting started", url: "https://jmeter.apache.org/usermanual/get-started.html", lang: "en", note: "Manual oficial: instalação e execução." },
      { title: "Plano de teste web", url: "https://jmeter.apache.org/usermanual/build-web-test-plan.html", lang: "en", note: "O primeiro teste de carga HTTP." },
    ],
    courses: [],
    videos: [
      { title: "Testes de Performance com JMeter — Guia Prático para QAs", channel: "Guga Martins", lang: "pt", youtubeId: "goVsnPikjU4", kind: "video" },
      { title: "JMeter do Zero:  Como realizar teste de performance na prática | GUIA COMPLETO", channel: "Build & Run", lang: "pt", youtubeId: "fLbHcr52xwk", kind: "video" },
      { title: "JMeter Full Course Masterclass | Step by Step for Beginners | Raghav Pal |", channel: "Automation Step by Step", lang: "en", youtubeId: "SoW2pBak1_Q", kind: "video" },
    ],
  },
  {
    slug: "datadog",
    name: "Datadog",
    category: "observabilidade",
    tagline: "Métricas, logs, traces e monitoramento sintético num produto só.",
    summary: "Plataforma de observabilidade comum em empresas de produto, especialmente fora do Brasil. QA usa para achar o trace de uma requisição que falhou, cruzar o horário de um bug com erros e latência, e criar testes sintéticos que rodam em produção.",
    qaFocus: ["Achar o trace de uma requisição pelo id", "Filtrar logs por serviço, ambiente e status", "Dashboards e monitores: o que dispara um alerta", "Testes sintéticos de API e de navegador"],
    docs: [
      { title: "Getting started", url: "https://docs.datadoghq.com/getting_started/", lang: "en", note: "Visão geral de cada produto." },
    ],
    courses: [
      { title: "Datadog Learning Center", url: "https://learn.datadoghq.com/", lang: "en", note: "Cursos oficiais gratuitos, com laboratório." },
    ],
    videos: [
      { title: "DATADOG NA PRÁTICA EM PORTUGUÊS", channel: "Max Lima", lang: "pt", youtubeId: "jbZxQmSuzkA", kind: "video" },
      { title: "Datadog 101 Course | Datadog Tutorial for Beginners | SRE | DevOps", channel: "Thetips4you", lang: "en", youtubeId: "Js06FTU3nXo", kind: "video" },
    ],
  },
  {
    slug: "sentry",
    name: "Sentry",
    category: "observabilidade",
    tagline: "Erros reais dos usuários, com stack trace e contexto.",
    summary: "Captura exceções do front-end, do back-end e de apps mobile e agrupa por causa. Para QA, é a forma mais rápida de saber se um bug acontece em produção, com quantos usuários, em qual versão e com quais passos antes do erro.",
    qaFocus: ["Ler uma issue: stack trace, breadcrumbs e tags", "Quantos usuários e quais versões são afetados", "Ligar o erro a um release para achar a mudança que quebrou", "Usar o Sentry para priorizar bugs com dado real"],
    docs: [
      { title: "Documentação do Sentry", url: "https://docs.sentry.io/", lang: "en", note: "SDKs e conceitos." },
      { title: "Issues", url: "https://docs.sentry.io/product/issues/", lang: "en", note: "Como os erros são agrupados e lidos." },
    ],
    courses: [],
    videos: [
      { title: "Como rastrear erros em seu aplicativo usando a ferramenta Sentry", channel: "Renan Zumas", lang: "pt", youtubeId: "Aury0O71BWs", kind: "video" },
      { title: "Sentry in Six Minutes", channel: "Sentry", lang: "en", youtubeId: "4djseRVSan8", kind: "video", official: true },
      { title: "Sentry 101: Error Monitoring For Frontend Applications", channel: "Sentry", lang: "en", youtubeId: "cl8tPBI4qUc", kind: "video", official: true },
    ],
  },
  {
    slug: "opentelemetry",
    name: "OpenTelemetry",
    category: "observabilidade",
    tagline: "O padrão aberto para gerar métricas, logs e traces.",
    summary: "Não é uma tela para olhar, é o padrão que os serviços usam para emitir sinais que depois aparecem no Grafana, no Datadog ou em outra ferramenta. Para QA, entender trace, span e propagação de contexto explica como seguir uma requisição por vários serviços.",
    qaFocus: ["Trace, span e atributos", "Propagação de contexto entre serviços", "Usar o trace id para reproduzir um bug distribuído", "Instrumentação automática x manual"],
    docs: [
      { title: "Documentação do OpenTelemetry", url: "https://opentelemetry.io/docs/", lang: "en", note: "Guias por linguagem." },
      { title: "Conceitos", url: "https://opentelemetry.io/docs/concepts/", lang: "en", note: "Sinais, contexto e coletor." },
    ],
    courses: [],
    videos: [
      { title: "OpenTelemetry: Tudo o que você precisa saber para trabalhar com Observabilidade. #cortesfullcycle", channel: "Full Cycle", lang: "pt", youtubeId: "tKfummynBbg", kind: "video" },
      { title: "OpenTelemetry: Como Funciona de Verdade? | Do Código à Observabilidade — EP. 1", channel: "Decoding", lang: "pt", youtubeId: "JymQ3qBJAoA", kind: "video" },
      { title: "What is OpenTelemetry? - Explanation and Demo", channel: "Better Stack", lang: "en", youtubeId: "LzLULxhyIpU", kind: "video" },
    ],
  },
  {
    slug: "burp-suite",
    name: "Burp Suite",
    category: "risco",
    tagline: "O proxy de referência para teste de segurança web manual.",
    summary: "Intercepta e altera as requisições entre navegador e servidor. Enquanto o ZAP brilha no scan automatizado, o Burp é a ferramenta padrão para explorar à mão: trocar ids, repetir chamadas, mexer em tokens. A versão Community é gratuita e basta para aprender. Use só em sistemas que você tem autorização para testar.",
    qaFocus: ["Proxy e Intercept: ver e alterar a requisição", "Repeater para testar variações de uma chamada", "Testar controle de acesso trocando ids (IDOR)", "Treinar nos laboratórios da Web Security Academy"],
    docs: [
      { title: "Getting started", url: "https://portswigger.net/burp/documentation/desktop/getting-started", lang: "en", note: "Documentação oficial da PortSwigger." },
      { title: "Burp Suite Community (download)", url: "https://portswigger.net/burp/communitydownload", lang: "en", note: "Versão gratuita." },
    ],
    courses: [
      { title: "PortSwigger Web Security Academy", url: "https://portswigger.net/web-security", lang: "en", note: "Laboratórios gratuitos feitos pelos criadores do Burp." },
    ],
    videos: [
      { title: "Dominando o Burp Suite", channel: "Solyd Offensive Security", lang: "pt", youtubeId: "qOJmTB_9-3g", kind: "video" },
      { title: "Burpsuite Basics (FREE Community Edition)", channel: "John Hammond", lang: "en", youtubeId: "G3hpAeoZ4ek", kind: "video" },
      { title: "How to use Burp Suite for Beginners", channel: "Elevate Cyber", lang: "en", youtubeId: "GxvFqgCBW-8", kind: "video" },
    ],
  },
  {
    slug: "nvda",
    name: "NVDA (leitor de tela)",
    category: "risco",
    tagline: "O teste de acessibilidade que nenhuma ferramenta automática substitui.",
    summary: "Leitor de tela gratuito para Windows e um dos mais usados no mundo. As ferramentas automáticas acham só parte dos problemas; ouvir a página como um usuário cego mostra rótulos sem sentido, ordem de leitura errada e mudanças que não são anunciadas. No Mac e no iPhone, o equivalente é o VoiceOver.",
    qaFocus: ["Comandos básicos: ler, navegar por título, link e campo", "Nome acessível: o que o leitor anuncia em cada controle", "Mensagens de erro e mudanças dinâmicas são anunciadas?", "Combinar com o teste só por teclado"],
    practice: { href: "/lab/ferramentas/acessibilidade", label: "Accessibility Inspector" },
    docs: [
      { title: "Usando o NVDA para avaliar acessibilidade", url: "https://webaim.org/articles/nvda/", lang: "en", note: "Guia da WebAIM focado em quem testa." },
      { title: "Guia do usuário do NVDA", url: "https://www.nvaccess.org/files/nvda/documentation/userGuide.html", lang: "en", note: "Referência de todos os comandos." },
      { title: "Download do NVDA", url: "https://www.nvaccess.org/download/", lang: "en", note: "Gratuito e open source." },
    ],
    courses: [
      { title: "W3C WAI: avaliar acessibilidade", url: "https://www.w3.org/WAI/test-evaluate/", lang: "en", note: "Onde o leitor de tela entra numa avaliação completa." },
    ],
    videos: [
      { title: "Screen Reader Basics: NVDA -- A11ycasts #09", channel: "Chrome for Developers", lang: "en", youtubeId: "Jao3s_CwdRU", kind: "video" },
      { title: "Accessibility Testing with the NVDA Screenreader", channel: "Deque Systems", lang: "en", youtubeId: "Vx1vSd5uYS8", kind: "video" },
      { title: "NVDA Screen Reader Tutorial: How to Use It for Accessibility Testing", channel: "Software Testing 101", lang: "en", youtubeId: "aAh1PFsgcBY", kind: "video" },
    ],
  },
  {
    slug: "trivy",
    name: "Trivy",
    category: "risco",
    tagline: "Scanner de vulnerabilidades em dependências, imagens e configuração.",
    summary: "Ferramenta open source que procura vulnerabilidades conhecidas em imagens Docker, dependências do projeto e arquivos de infraestrutura. Roda em segundos no pipeline e pode reprovar o build. Snyk e Dependabot cobrem parte do mesmo espaço. É a porta de entrada de QA em DevSecOps.",
    qaFocus: ["Scan de imagem, de repositório e de arquivo de configuração", "Ler severidade, CVE e versão com correção", "Reprovar o pipeline só a partir de uma severidade", "Diferença entre vulnerabilidade conhecida e teste de segurança"],
    docs: [
      { title: "Site oficial do Trivy", url: "https://trivy.dev/", lang: "en", note: "Documentação e instalação." },
      { title: "Repositório do Trivy", url: "https://github.com/aquasecurity/trivy", lang: "en", note: "Exemplos de uso e integração com CI." },
    ],
    courses: [],
    videos: [
      { title: "Trivy - Scan de Vulnerabilidade de Containers na sua Pipeline!", channel: "Matheus Fidelis", lang: "pt", youtubeId: "s1ZvnRqP-wk", kind: "video" },
      { title: "Trivy: Segurança do código ao Kubernetes", channel: "Fabricio Veronez", lang: "pt", youtubeId: "4JexIwjS2eg", kind: "video" },
      { title: "Container Image Scanning with Trivy -- Ep. 1 Trivy Overview", channel: "Aqua Security Open Source", lang: "en", youtubeId: "-IH5inFyEqU", kind: "video", official: true },
    ],
  },
  {
    slug: "testcontainers",
    name: "Testcontainers",
    category: "contrato",
    tagline: "Banco, fila e serviços reais e descartáveis dentro do teste.",
    summary: "Biblioteca que sobe containers Docker durante o teste e derruba no fim. Em vez de mockar o banco ou depender de um ambiente compartilhado, cada execução tem um Postgres, um Kafka ou um Redis limpo. Muito pedida em vagas de QA de back-end, e disponível em Java, Python, Node, Go e .NET.",
    qaFocus: ["Subir um banco real no início do teste", "Massa de dados isolada por execução", "Por que isso reduz testes instáveis por ambiente", "Custo: tempo de subida e Docker no CI"],
    docs: [
      { title: "Getting started", url: "https://testcontainers.com/getting-started/", lang: "en", note: "Conceitos e primeiro teste." },
      { title: "Guias", url: "https://testcontainers.com/guides/", lang: "en", note: "Exemplos prontos por linguagem e serviço." },
    ],
    courses: [],
    videos: [
      { title: "Testcontainers - Testes de Integração com Contêineres - José Dias", channel: "Dias Neto", lang: "pt", youtubeId: "MG5R9qvYvQE", kind: "video" },
      { title: "Spring Boot + Testcontainers: Testes de integração fáceis e completos", channel: "O Igor Rudel", lang: "pt", youtubeId: "lZbFm8FiWiw", kind: "video" },
      { title: "Testcontainers – From Zero to Hero. By @MarcoCodes", channel: "IntelliJ IDEA, a JetBrains IDE", lang: "en", youtubeId: "v3eQCIWLYOw", kind: "video" },
      { title: "Testcontainers have forever changed the way I write tests", channel: "Dreams of Code", lang: "en", youtubeId: "sNg0bnMF_qY", kind: "video" },
    ],
  },
  {
    slug: "faker",
    name: "Faker",
    category: "contrato",
    tagline: "Gera nomes, e-mails, CPFs e endereços falsos para massa de teste.",
    summary: "Biblioteca que gera dados realistas e aleatórios, com versões para JavaScript (@faker-js/faker) e Python. Evita testes que dependem de um usuário fixo e quebram quando alguém apaga o registro. Com uma seed fixa, o mesmo dado se repete e a falha pode ser reproduzida.",
    qaFocus: ["Gerar massa por teste em vez de usar dado fixo", "Seed para reproduzir a falha", "Locale pt_BR: nomes, CPF e endereço brasileiros", "Dado aleatório não substitui caso de borda escolhido"],
    docs: [
      { title: "Faker (JavaScript)", url: "https://fakerjs.dev/guide/", lang: "en", note: "Guia da versão JS e TS." },
      { title: "Faker (Python)", url: "https://faker.readthedocs.io/en/master/", lang: "en", note: "Documentação da versão Python, com locale pt_BR." },
    ],
    courses: [],
    videos: [
      { title: "Geração de dados falsos de teste com Python: módulo faker", channel: "Programadores Visie", lang: "pt", youtubeId: "bCkQpwD2A_0", kind: "video" },
      { title: "Crie Dados Simulados (Falsos) usando Python Faker + Ferramenta Online", channel: "Alexandre Polselli | Data Universe", lang: "pt", youtubeId: "dwxhtcDoZcM", kind: "video" },
      { title: "How to Generate Random Test Data in Playwright with Faker.js | TypeScript", channel: "Code And Test", lang: "en", youtubeId: "qOMyITr7x9U", kind: "video" },
      { title: "Python for Testers #45 - How to Generate Test Data using Python Faker", channel: "Software Testing Mentor", lang: "en", youtubeId: "4K97iY0MiQ0", kind: "video" },
    ],
  },
  {
    slug: "schemathesis",
    name: "Schemathesis",
    category: "contrato",
    tagline: "Gera milhares de testes de API a partir do OpenAPI.",
    summary: "Lê a especificação OpenAPI e gera requisições automaticamente, inclusive com valores estranhos, para encontrar respostas 500 e respostas que não batem com o contrato. Complementa o Pact quando a API não tem consumidores escrevendo pactos.",
    qaFocus: ["Rodar contra um OpenAPI existente pela CLI", "Ler uma falha e reproduzir com o curl gerado", "Erro 500 x resposta fora do schema", "Rodar no CI como rede de segurança do contrato"],
    docs: [
      { title: "Documentação do Schemathesis", url: "https://schemathesis.readthedocs.io/", lang: "en", note: "Instalação, CLI e integração com pytest." },
      { title: "Repositório", url: "https://github.com/schemathesis/schemathesis", lang: "en", note: "Exemplos rápidos e integração com CI." },
    ],
    courses: [],
    videos: [
      { title: "Automating API Testing Using OpenAPI And Schemathesis", channel: "Cloud-Native Development", lang: "en", youtubeId: "4r7OC-lBKMg", kind: "video" },
      { title: "Your API docs say 200. The server says 500? Try Schemathesis", channel: "The AI Toolbox", lang: "en", youtubeId: "F0O2UGi7r-o", kind: "video" },
    ],
  },
];

// Curso da plataforma que ensina a mesma ferramenta. Mantido à parte para que um
// curso novo seja uma linha aqui, sem tocar no texto de cada guia.
const internalCourses: Record<string, ToolGuide["internalCourse"]> = {
  playwright: { href: "/trilhas/playwright", title: "Trilha Playwright", detail: "Módulos com prática no Broto, entregável e código de exemplo." },
  cypress: { href: "/trilhas/cypress", title: "Trilha Cypress", detail: "Módulos com prática no Broto, entregável e código de exemplo." },
  selenium: { href: "/trilhas/appium-selenium", title: "Trilha Selenium e Appium", detail: "Automação web e mobile, com prática guiada." },
  appium: { href: "/trilhas/appium-selenium", title: "Trilha Selenium e Appium", detail: "Automação web e mobile, com prática guiada." },
  postman: { href: "/trilhas/testes-api/postman", title: "Subtrilha Postman", detail: "Collections, scripts de teste e execução com Newman." },
  bruno: { href: "/trilhas/testes-api/bruno", title: "Subtrilha Bruno", detail: "Coleções locais, versionadas e executadas pela CLI." },
  swagger: { href: "/trilhas/testes-api", title: "Trilha Testes de API", detail: "Fundamentos de contrato, risco e comportamento de API." },
  pact: { href: "/trilhas/testes-api", title: "Trilha Testes de API", detail: "Fundamentos de contrato, antes de automatizar com Pact." },
  "rest-assured": { href: "/trilhas/testes-api", title: "Trilha Testes de API", detail: "O que testar numa API, antes de automatizar em Java." },
  k6: { href: "/trilhas/k6", title: "Trilha k6", detail: "Do primeiro script ao gate de performance, contra a API de treino." },
  gherkin: { href: "/trilhas/gherkin", title: "Trilha Gherkin", detail: "Escrever cenários que produto, dev e QA entendem igual." },
  sql: { href: "/trilhas/sql-qa", title: "SQL para QA", detail: "Consultas para conferir dados e preparar massa de teste." },
  jenkins: { href: "/trilhas/cicd", title: "Trilha CI/CD", detail: "Pipeline, gates de qualidade e leitura de falhas no CI." },
  "gitlab-ci": { href: "/trilhas/cicd", title: "Trilha CI/CD", detail: "Pipeline, gates de qualidade e leitura de falhas no CI." },
  "github-actions": { href: "/trilhas/cicd", title: "Trilha CI/CD", detail: "Pipeline, gates de qualidade e leitura de falhas no CI." },
};

for (const guide of toolGuides) guide.internalCourse ??= internalCourses[guide.slug];

// Guias sugeridos ao fim de cada módulo da mentoria (chave = id do módulo em path-v2).
const moduleGuideSlugs: Record<string, readonly string[]> = {
  "produto-risco": ["devtools", "jira"],
  "desenho-comunicacao": ["gherkin", "jira", "xray", "testrail", "qase"],
  "automacao-web": ["playwright", "cypress", "selenium", "visual-testing", "appium", "maestro", "browserstack", "jest", "pytest", "junit"],
  "api-confiabilidade": ["postman", "bruno", "rest-assured", "swagger", "pact", "schemathesis", "wiremock", "msw", "testcontainers", "faker", "sql", "owasp-zap", "burp-suite"],
  "cicd-operacao": ["git", "github-actions", "jenkins", "gitlab-ci", "allure", "docker", "trivy", "grafana", "datadog", "sentry", "opentelemetry"],
  "acessibilidade-performance": ["axe", "nvda", "lighthouse", "k6", "jmeter"],
};

export function guidesForModule(moduleId: string): ToolGuide[] {
  return (moduleGuideSlugs[moduleId] ?? []).map((slug) => findToolGuide(slug)).filter((guide): guide is ToolGuide => Boolean(guide));
}

export function findToolGuide(slug: string) {
  return toolGuides.find((guide) => guide.slug === slug);
}
