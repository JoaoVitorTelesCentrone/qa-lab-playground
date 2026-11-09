// Guias de estudo das ferramentas reais citadas na mentoria.
// Todos os links foram conferidos em 2026-11-09: documentação e cursos responderam
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

export type ToolGuideCategory = "automacao" | "api" | "performance" | "risco" | "base" | "processo";

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
  automacao: { title: "Automação de testes", description: "Frameworks para automatizar fluxos de interface, mobile e unidade." },
  api: { title: "APIs", description: "Clientes para explorar e testar APIs e o contrato que as descreve." },
  performance: { title: "Performance e observabilidade", description: "Carga, métricas de página e leitura de sinais em produção." },
  risco: { title: "Acessibilidade e segurança", description: "Riscos que a regressão funcional não pega." },
  base: { title: "Base técnica", description: "O que todo QA usa todo dia, mesmo sem perceber." },
  processo: { title: "Processo e gestão", description: "Especificação por exemplos e gestão de casos de teste." },
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
    category: "automacao",
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
    category: "automacao",
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
    category: "automacao",
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
    category: "automacao",
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
    name: "Jest",
    category: "automacao",
    tagline: "Testes de unidade em JavaScript e TypeScript.",
    summary: "Framework de testes de unidade mais popular do ecossistema JavaScript. QA usa para ler e revisar os testes do time de desenvolvimento, escrever testes de funções puras e entender a base da pirâmide de testes.",
    qaFocus: ["Matchers (toBe, toEqual, toThrow)", "Mocks e spies", "Testes assíncronos", "Relatório de cobertura e o que ele não garante"],
    docs: [
      { title: "Primeiros passos (em português)", url: "https://jestjs.io/pt-BR/docs/getting-started", lang: "pt", note: "Documentação oficial traduzida." },
      { title: "Getting started (original)", url: "https://jestjs.io/docs/getting-started", lang: "en", note: "Versão em inglês, sempre a mais atualizada." },
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
    category: "api",
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
    category: "performance",
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
    category: "base",
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
    name: "Gherkin (BDD)",
    category: "processo",
    tagline: "Escrever comportamento como exemplos: Dado, Quando, Então.",
    summary: "Linguagem estruturada para descrever cenários de forma que produto, desenvolvimento e QA entendam igual. Funciona em português (Funcionalidade, Cenário, Dado, Quando, Então) e serve de base para automação com Cucumber.",
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
    category: "api",
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
    name: "OWASP ZAP",
    category: "risco",
    tagline: "Proxy e scanner de segurança web, gratuito e open source.",
    summary: "Fica entre o navegador e a aplicação, registra o tráfego e procura vulnerabilidades conhecidas (OWASP Top 10). Para QA, é a porta de entrada em testes de segurança. Use só em sistemas que você tem autorização para testar; o OWASP Juice Shop existe para treinar.",
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
  k6: { href: "/trilhas/k6", title: "Trilha k6", detail: "Do primeiro script ao gate de performance, contra a API de treino." },
  gherkin: { href: "/trilhas/gherkin", title: "Trilha Gherkin", detail: "Escrever cenários que produto, dev e QA entendem igual." },
  sql: { href: "/trilhas/sql-qa", title: "SQL para QA", detail: "Consultas para conferir dados e preparar massa de teste." },
  "github-actions": { href: "/trilhas/cicd", title: "Trilha CI/CD", detail: "Pipeline, gates de qualidade e leitura de falhas no CI." },
};

for (const guide of toolGuides) guide.internalCourse ??= internalCourses[guide.slug];

// Guias sugeridos ao fim de cada módulo da mentoria (chave = id do módulo em path-v2).
const moduleGuideSlugs: Record<string, readonly string[]> = {
  "produto-risco": ["devtools", "jira"],
  "desenho-comunicacao": ["gherkin", "jira", "qase"],
  "automacao-web": ["playwright", "cypress", "selenium", "appium", "jest"],
  "api-confiabilidade": ["postman", "bruno", "swagger", "pact", "sql", "owasp-zap"],
  "cicd-operacao": ["git", "github-actions", "docker", "grafana"],
  "acessibilidade-performance": ["axe", "lighthouse", "k6"],
};

export function guidesForModule(moduleId: string): ToolGuide[] {
  return (moduleGuideSlugs[moduleId] ?? []).map((slug) => findToolGuide(slug)).filter((guide): guide is ToolGuide => Boolean(guide));
}

export function findToolGuide(slug: string) {
  return toolGuides.find((guide) => guide.slug === slug);
}
