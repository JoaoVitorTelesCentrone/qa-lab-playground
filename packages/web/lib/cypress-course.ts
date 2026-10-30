export type CypressTrackModule = {
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

export const cypressCourseModules: CypressTrackModule[] = [
  {
    id: "setup", week: 1, duration: "45 min", title: "Prepare o projeto e abra o Cypress",
    objective: "Instalar Cypress, configurar TypeScript e executar uma spec no navegador e no terminal.",
    concepts: ["Instalação", "cypress.config.ts", "baseUrl", "specs", "open e run"],
    practice: "Crie um projeto de automação separado e configure o baseUrl para o BrotoSpace. Inspecione a interface antes de definir seletores.",
    deliverable: "Configuração executável e uma spec vazia que abre no Cypress Runner.",
    checklist: ["A versão do Cypress está registrada no package.json e no lockfile.", "A URL está no baseUrl, não repetida em cada teste.", "A mesma spec abre no modo interativo e no modo headless."],
    code: `// cypress.config.ts\nimport { defineConfig } from "cypress";\n\nexport default defineConfig({\n  e2e: {\n    baseUrl: "https://www.brotospace.com",\n    specPattern: "cypress/e2e/**/*.cy.ts",\n    supportFile: "cypress/support/e2e.ts",\n    video: true,\n    screenshotOnRunFailure: true,\n  },\n});`,
  },
  {
    id: "first-flow", week: 1, duration: "60 min", title: "Escreva seu primeiro fluxo ponta a ponta",
    objective: "Conectar navegação, interação e resultado em um cenário legível para outra pessoa.",
    concepts: ["cy.visit", "ações", "estado observável", "fluxo do usuário"],
    practice: "No BrotoSpace, escolha uma jornada visível, como registrar uma ideia sintética e retomá-la. Confirme apenas comportamentos que observou.",
    deliverable: "Uma spec independente que verifica uma jornada observável do BrotoSpace.",
    checklist: ["A spec começa no estado inicial e termina com uma asserção útil.", "O nome descreve o comportamento protegido.", "Os dados usados são sintéticos e a execução não depende de outra spec."],
    code: `describe("Jornada no BrotoSpace", () => {\n  it("abre o produto para iniciar uma verificação", () => {\n    cy.visit("/");\n    cy.location("origin").should("eq", "https://www.brotospace.com");\n    // Inspecione a interface e acrescente uma asserção sobre um comportamento observado.\n  });\n});`,
  },
  {
    id: "selectors", week: 1, duration: "60 min", title: "Escolha seletores que expressem intenção",
    objective: "Localizar controles por acessibilidade ou identificadores de teste, sem acoplar o teste ao CSS.",
    concepts: ["data-testid", "role e nome acessível", "cy.contains", "within", "elementos únicos"],
    practice: "Escolha um controle observável na jornada do BrotoSpace e encontre-o por papel e nome acessível. Registre seletores que você confirmou no navegador.",
    deliverable: "Dois cenários com seletores que resistem a uma mudança de layout.",
    checklist: ["Nenhum seletor depende de classe visual.", "O texto é usado quando seu conteúdo também é parte do requisito.", "O seletor não encontra vários elementos por acidente."],
    code: `cy.visit("/");\n// Use um nome acessível que você confirmou no BrotoSpace.\ncy.contains("button", "<nome observado>")\n  .should("be.visible");`,
  },
  {
    id: "assertions-retry", week: 2, duration: "60 min", title: "Prove o resultado e espere pelo sinal certo",
    objective: "Escrever asserções sobre regras e estado final, usando as tentativas automáticas do Cypress.",
    concepts: ["should", "asserção implícita", "retry-ability", "actionability", "alias de request"],
    practice: "Valide o resultado observável de uma ação no BrotoSpace. Substitua esperas fixas por uma condição baseada no estado confirmado.",
    deliverable: "Uma spec com asserções de conteúdo, estado e request, sem cy.wait com milissegundos.",
    checklist: ["Asserções verificam a regra, não apenas que a página abriu.", "Não há cy.wait(tempo fixo).", "A falha indica qual resultado esperado não apareceu."],
    code: `cy.intercept("GET", "**/api/**").as("request");\ncy.visit("/");\n// Observe a chamada relevante no DevTools antes de definir o padrão da interceptação.\ncy.wait("@request").its("response.statusCode")\n  .should("be.oneOf", [200, 304]);`,
  },
  {
    id: "isolation-data", week: 2, duration: "75 min", title: "Isole testes e controle os dados",
    objective: "Deixar cada cenário repetível, independente da ordem e previsível entre execuções.",
    concepts: ["testIsolation", "beforeEach", "fixtures", "dados locais", "seeds"],
    practice: "Prepare dados sintéticos no BrotoSpace antes de cada cenário e escreva dois testes que possam rodar sozinhos.",
    deliverable: "Spec isolada com setup determinístico e fixture pequena quando houver dados estáticos.",
    checklist: ["Cada teste pode ser executado sozinho.", "Nenhum teste depende de dados deixados pelo anterior.", "Os dados de exemplo não contêm credenciais reais."],
    code: `beforeEach(() => {\n  cy.visit("/");\n  // Prepare somente dados sintéticos e remova o estado criado pelo próprio teste.\n});`,
  },
  {
    id: "api-requests", week: 3, duration: "75 min", title: "Teste a API e entenda suas fronteiras",
    objective: "Verificar métodos, códigos e contratos mínimos sem transformar E2E em teste de implementação.",
    concepts: ["cy.request", "status code", "headers", "payload", "fronteira autenticada"],
    practice: "Identifique no BrotoSpace uma requisição de leitura que você esteja autorizado a testar. Registre o contrato observado sem tentar acessar dados de outra pessoa.",
    deliverable: "Um teste de API para acesso anônimo e uma anotação dos campos críticos do contrato autenticado.",
    checklist: ["O status esperado corresponde à regra de autenticação.", "O teste não usa chave privilegiada nem dados pessoais.", "O contrato cobre apenas campos que o consumidor realmente precisa."],
    code: `it("respeita o contrato observado", () => {\n  cy.request({\n    url: "/",\n    failOnStatusCode: false,\n  }).its("status").should("be.oneOf", [200, 301, 302]);\n});`,
  },
  {
    id: "intercept", week: 3, duration: "75 min", title: "Controle respostas com cy.intercept",
    objective: "Simular estados de rede e validar como a interface reage a sucesso, vazio e falha.",
    concepts: ["spy", "stub", "alias", "request body", "resposta de erro"],
    practice: "Se uma ação autorizada gerar uma requisição observável, controle sua resposta com cy.intercept e verifique o resultado apresentado. Não altere dados compartilhados.",
    deliverable: "Specs para retorno válido, erro de rede e lista vazia, com asserts no request e na interface.",
    checklist: ["O intercept é registrado antes da navegação.", "O alias espera a request certa, sem pausa fixa.", "O stub não mascara um teste que deveria usar o servidor real."],
    code: `cy.intercept("GET", "**/api/<rota-observada>", {\n  statusCode: 200,\n  body: { data: [] },\n}).as("loadData");\ncy.visit("/");\n// Use somente uma rota observada e autorizada; ajuste o contrato após inspecionar a resposta.\ncy.wait("@loadData").its("response.statusCode").should("eq", 200);`,
  },
  {
    id: "auth-secrets", week: 4, duration: "75 min", title: "Autentique com segurança e configure ambientes",
    objective: "Reutilizar sessão de teste sem colocar senha em código, log ou repositório.",
    concepts: ["cy.session", "cy.env", "Cypress.expose", "variáveis de ambiente", "validação de sessão"],
    practice: "Configure uma conta de teste local e crie uma sessão reutilizável para uma área autenticada.",
    deliverable: "Comando de sessão validado e instruções locais sem valores secretos versionados.",
    checklist: ["A sessão tem uma validação que confirma que continua autenticada.", "A senha é lida em tempo de execução e não é impressa no log.", "A URL pública do ambiente não é confundida com segredo."],
    code: `Cypress.Commands.add("login", () => {\n  cy.env(["QA_EMAIL", "QA_PASSWORD"]).then(({ QA_EMAIL, QA_PASSWORD }) => {\n    cy.session([QA_EMAIL], () => {\n      cy.visit("/login");\n      cy.get('[name="email"]').type(QA_EMAIL);\n      cy.get('[name="password"]').type(QA_PASSWORD, { log: false });\n      cy.contains("button", "Entrar").click();\n    }, { validate: () => cy.visit("/perfil") });\n  });\n});`,
  },
  {
    id: "typescript-architecture", week: 5, duration: "75 min", title: "Organize a suíte sem esconder o comportamento",
    objective: "Separar specs por fluxo, criar comandos pequenos e manter tipagem TypeScript legível.",
    concepts: ["organização por fluxo", "custom commands", "types.d.ts", "fixtures", "abstração mínima"],
    practice: "Extraia uma ação repetida de busca para um comando tipado e mantenha a regra do teste visível na spec.",
    deliverable: "Estrutura organizada com um custom command documentado e tipagem de retorno correta.",
    checklist: ["O comando representa uma ação reutilizada, não uma página inteira.", "O teste continua mostrando o comportamento esperado.", "Os tipos de Cypress estão disponíveis sem any desnecessário."],
    code: `// cypress/support/commands.ts\nCypress.Commands.add("searchProduct", (name: string) => {\n  cy.get('[data-testid="product-search"]').clear().type(name);\n});\n\ndeclare global {\n  namespace Cypress {\n    interface Chainable {\n      searchProduct(name: string): Chainable<void>;\n    }\n  }\n}\nexport {};`,
  },
  {
    id: "accessibility-component", week: 6, duration: "90 min", title: "Cubra acessibilidade e testes de componente",
    objective: "Escolher o nível de teste adequado e verificar nomes acessíveis, teclado e estados isolados.",
    concepts: ["cy.getByRole", "nome acessível", "teclado", "axe", "component testing"],
    practice: "Revise o fluxo de busca e o botão de adicionar. Verifique acesso por role/nome e teste um componente isoladamente se o projeto tiver configuração de mount.",
    deliverable: "Um cenário E2E com consulta acessível e uma checagem de acessibilidade documentada.",
    checklist: ["O controle pode ser identificado pelo nome que uma pessoa ouviria no leitor de tela.", "A checagem automatizada não é tratada como prova completa de acessibilidade.", "Component testing é aplicado a um componente, não usado como substituto do fluxo E2E."],
    code: `cy.visit("/");\n// Exemplo: confirme primeiro o nome acessível de um controle no BrotoSpace.\ncy.contains("button", "<nome observado>")\n  .should("be.visible");`,
  },
  {
    id: "ci-evidence", week: 7, duration: "90 min", title: "Execute smoke e regressão no CI",
    objective: "Rodar uma suíte confiável em pull requests e guardar evidências diagnósticas quando algo falhar.",
    concepts: ["Cypress GitHub Action", "tags", "screenshots e vídeo", "variáveis protegidas", "falha do pipeline"],
    practice: "Crie jobs para smoke rápido e regressão, apontando para um ambiente de teste acessível pelo runner.",
    deliverable: "Workflow que executa Cypress, falha o PR diante de regressão crítica e publica artefatos na falha.",
    checklist: ["O ambiente de teste está disponível antes da execução.", "Segredos vivem nas configurações do CI.", "A falha guarda screenshot, vídeo ou trace útil."],
    code: `# Exemplo: .github/workflows/cypress.yml\njobs:\n  cypress:\n    runs-on: ubuntu-24.04\n    steps:\n      - uses: actions/checkout@v4\n      - uses: cypress-io/github-action@v7\n        with:\n          install-command: npm ci\n          command: npx cypress run --browser chrome\n        env:\n          CYPRESS_BASE_URL: \${{ vars.QA_BASE_URL }}`,
  },
  {
    id: "capstone", week: 8, duration: "2 h", title: "Projeto final: proteja uma jornada do BrotoSpace",
    objective: "Apresentar uma suíte pequena, independente e executável; investigar instabilidade e escolher o nível certo de teste para cada risco.",
    concepts: ["plano de automação", "risco", "smoke", "regressão", "evidência", "flakiness", "decisão técnica"],
    practice: "Automatize uma jornada observada de captura, organização ou retomada; inclua uma condição de erro segura e execute no CI.",
    deliverable: "Repositório com plano de risco, specs, README, workflow e evidências de uma execução verde e de uma falha diagnosticada, incluindo três riscos de instabilidade revisados.",
    checklist: ["Inclui fluxo feliz, regra negativa e resposta de API controlada.", "Todos os testes rodam isolados; não há espera fixa.", "Retry não substitui a correção da causa de flakiness.", "README permite repetir a execução do zero.", "O relatório explica cobertura e limites da suíte."],
    code: `describe("Jornada protegida do BrotoSpace", () => {\n  it("verifica um comportamento observado", () => {\n    cy.visit("/");\n    cy.location("origin").should("eq", "https://www.brotospace.com");\n    // Complete com locators e expectativas validados no produto.\n  });\n});`,
  },
];

export const cypressCourseOutcomes = [
  "Configurar Cypress e TypeScript do zero.",
  "Escrever fluxos E2E estáveis usando seletores claros, asserções e isolamento.",
  "Testar APIs e estados de rede sem esconder falhas reais.",
  "Proteger credenciais, controlar sessões e executar a suíte em CI.",
  "Decidir quando usar E2E, componente ou API e explicar os limites da cobertura.",
];

export const cypressFinalProject = {
  title: "Projeto final: proteja uma jornada do BrotoSpace",
  description: "Uma suíte Cypress para uma jornada observada do BrotoSpace, com cenários independentes, dados sintéticos, estados de rede controlados e execução contínua.",
  deliverables: [
    "Plano de automação com objetivo, riscos, fora de escopo e risco residual.",
    "Smoke suite curta para captura e retomada de uma ideia sintética.",
    "Cenários de conexão entre ideia, desafio e ação, conforme a interface observada.",
    "Ao menos um caso com cy.intercept e uma checagem de API.",
    "Workflow de CI com artefatos e README de reprodução.",
    "Revisão de três riscos de flakiness e a decisão tomada para cada um.",
  ],
  rubric: [
    { criterion: "Comportamento protegido", weight: "25%" },
    { criterion: "Estabilidade e isolamento", weight: "25%" },
    { criterion: "Dados, API e segurança", weight: "20%" },
    { criterion: "CI e diagnóstico", weight: "20%" },
    { criterion: "Clareza do README e limites", weight: "10%" },
  ],
};

export const cypressCourseResources = [
  { label: "Instalação e primeiro teste", href: "https://docs.cypress.io/app/get-started/install-cypress" },
  { label: "Boas práticas", href: "https://docs.cypress.io/app/core-concepts/best-practices" },
  { label: "Interceptar requests", href: "https://docs.cypress.io/api/commands/intercept" },
  { label: "Segredos e variáveis de ambiente", href: "https://docs.cypress.io/app/guides/environment-variables" },
  { label: "Executar Cypress no GitHub Actions", href: "https://docs.cypress.io/app/continuous-integration/github-actions" },
];

export function findCypressModule(id: string) {
  return cypressCourseModules.find((module) => module.id === id);
}
