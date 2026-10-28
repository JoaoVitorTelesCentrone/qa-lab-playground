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
    practice: "Crie um projeto de automação separado e aponte o baseUrl para a instância local do QA Lab.",
    deliverable: "Configuração executável e uma spec vazia que abre no Cypress Runner.",
    checklist: ["A versão do Cypress está registrada no package.json e no lockfile.", "A URL está no baseUrl, não repetida em cada teste.", "A mesma spec abre no modo interativo e no modo headless."],
    code: `// cypress.config.ts\nimport { defineConfig } from "cypress";\n\nexport default defineConfig({\n  e2e: {\n    baseUrl: "http://localhost:3000",\n    specPattern: "cypress/e2e/**/*.cy.ts",\n    supportFile: "cypress/support/e2e.ts",\n    video: true,\n    screenshotOnRunFailure: true,\n  },\n});`,
  },
  {
    id: "first-flow", week: 1, duration: "60 min", title: "Escreva seu primeiro fluxo ponta a ponta",
    objective: "Conectar navegação, interação e resultado em um cenário legível para outra pessoa.",
    concepts: ["cy.visit", "ações", "estado observável", "fluxo do usuário"],
    practice: "Na loja QA Lab, busque o Kit Smoke Test, adicione ao carrinho e confirme a quantidade.",
    deliverable: "Uma spec que atravessa catálogo e carrinho sem depender de outro teste.",
    checklist: ["A spec começa no estado inicial e termina com uma asserção útil.", "O nome descreve o comportamento protegido.", "O carrinho começa limpo em cada execução."],
    code: `describe("Carrinho da loja", () => {\n  it("adiciona um produto disponível", () => {\n    cy.visit("/shop/products");\n    cy.get('[data-testid="product-search"]').type("Kit Smoke Test");\n    cy.get('[data-testid="add-product-1"]').click();\n    cy.get('a[href="/shop/cart"]').click();\n    cy.get('[data-testid="qty-1"]').should("have.text", "1");\n  });\n});`,
  },
  {
    id: "selectors", week: 1, duration: "60 min", title: "Escolha seletores que expressem intenção",
    objective: "Localizar controles por acessibilidade ou identificadores de teste, sem acoplar o teste ao CSS.",
    concepts: ["data-testid", "role e nome acessível", "cy.contains", "within", "elementos únicos"],
    practice: "Automatize a busca de um produto e o estado de nenhum resultado encontrado.",
    deliverable: "Dois cenários com seletores que resistem a uma mudança de layout.",
    checklist: ["Nenhum seletor depende de classe visual.", "O texto é usado quando seu conteúdo também é parte do requisito.", "O seletor não encontra vários elementos por acidente."],
    code: `cy.visit("/shop/products");\ncy.get('[data-testid="product-search"]')\n  .type("produto que não existe");\ncy.get('[role="status"]')\n  .should("contain.text", "Nenhum produto encontrado");`,
  },
  {
    id: "assertions-retry", week: 2, duration: "60 min", title: "Prove o resultado e espere pelo sinal certo",
    objective: "Escrever asserções sobre regras e estado final, usando as tentativas automáticas do Cypress.",
    concepts: ["should", "asserção implícita", "retry-ability", "actionability", "alias de request"],
    practice: "Valide preço, quantidade e mensagens do carrinho. Substitua esperas fixas por uma condição observável.",
    deliverable: "Uma spec com asserções de conteúdo, estado e request, sem cy.wait com milissegundos.",
    checklist: ["Asserções verificam a regra, não apenas que a página abriu.", "Não há cy.wait(tempo fixo).", "A falha indica qual resultado esperado não apareceu."],
    code: `cy.get('[data-testid="cart-subtotal"]')\n  .should("contain.text", "R$");\ncy.intercept("GET", "/api/v1/shop/cart").as("cart");\ncy.visit("/shop/cart");\ncy.wait("@cart").its("response.statusCode")\n  .should("be.oneOf", [200, 401]);`,
  },
  {
    id: "isolation-data", week: 2, duration: "75 min", title: "Isole testes e controle os dados",
    objective: "Deixar cada cenário repetível, independente da ordem e previsível entre execuções.",
    concepts: ["testIsolation", "beforeEach", "fixtures", "dados locais", "seeds"],
    practice: "Prepare o carrinho antes de abrir a aplicação e escreva dois cenários que possam rodar sozinhos.",
    deliverable: "Spec isolada com setup determinístico e fixture pequena quando houver dados estáticos.",
    checklist: ["Cada teste pode ser executado sozinho.", "Nenhum teste depende de dados deixados pelo anterior.", "Os dados de exemplo não contêm credenciais reais."],
    code: `beforeEach(() => {\n  cy.visit("/shop/products", {\n    onBeforeLoad(win) {\n      win.localStorage.removeItem("qa-lab-cart");\n    },\n  });\n});`,
  },
  {
    id: "api-requests", week: 3, duration: "75 min", title: "Teste a API e entenda suas fronteiras",
    objective: "Verificar métodos, códigos e contratos mínimos sem transformar E2E em teste de implementação.",
    concepts: ["cy.request", "status code", "headers", "payload", "fronteira autenticada"],
    practice: "Teste o endpoint protegido do carrinho sem sessão e descreva o contrato esperado de uma resposta autenticada.",
    deliverable: "Um teste de API para acesso anônimo e uma anotação dos campos críticos do contrato autenticado.",
    checklist: ["O status esperado corresponde à regra de autenticação.", "O teste não usa chave privilegiada nem dados pessoais.", "O contrato cobre apenas campos que o consumidor realmente precisa."],
    code: `it("protege o carrinho persistido", () => {\n  cy.request({\n    url: "/api/v1/shop/cart",\n    failOnStatusCode: false,\n  }).its("status").should("eq", 401);\n});`,
  },
  {
    id: "intercept", week: 3, duration: "75 min", title: "Controle respostas com cy.intercept",
    objective: "Simular estados de rede e validar como a interface reage a sucesso, vazio e falha.",
    concepts: ["spy", "stub", "alias", "request body", "resposta de erro"],
    practice: "Simule o carrinho autenticado, adicione um produto e confira o corpo enviado ao salvar.",
    deliverable: "Specs para retorno válido, erro de rede e lista vazia, com asserts no request e na interface.",
    checklist: ["O intercept é registrado antes da navegação.", "O alias espera a request certa, sem pausa fixa.", "O stub não mascara um teste que deveria usar o servidor real."],
    code: `cy.intercept("GET", "/api/v1/shop/cart", {\n  statusCode: 200,\n  body: { data: { items: [], activeBugs: [] } },\n}).as("loadCart");\ncy.intercept("PUT", "/api/v1/shop/cart").as("saveCart");\ncy.visit("/shop/products");\ncy.wait("@loadCart");\ncy.get('[data-testid="add-product-1"]').click();\ncy.wait("@saveCart").its("request.body.items")\n  .should("deep.include", { productId: 1, quantity: 1 });`,
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
    code: `cy.visit("/shop/products");\ncy.getByRole("textbox", { name: "Buscar produto" })\n  .type("Kit Smoke Test");\ncy.getByRole("button", { name: "Adicionar" })\n  .should("be.visible");`,
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
    id: "capstone", week: 8, duration: "2 h", title: "Projeto final: proteja a compra de ponta a ponta",
    objective: "Apresentar uma suíte pequena, independente e executável; investigar instabilidade e escolher o nível certo de teste para cada risco.",
    concepts: ["plano de automação", "risco", "smoke", "regressão", "evidência", "flakiness", "decisão técnica"],
    practice: "Automatize busca, adicionar ao carrinho, cupom e checkout; inclua um estado de erro controlado e execute no CI.",
    deliverable: "Repositório com plano de risco, specs, README, workflow e evidências de uma execução verde e de uma falha diagnosticada, incluindo três riscos de instabilidade revisados.",
    checklist: ["Inclui fluxo feliz, regra negativa e resposta de API controlada.", "Todos os testes rodam isolados; não há espera fixa.", "Retry não substitui a correção da causa de flakiness.", "README permite repetir a execução do zero.", "O relatório explica cobertura e limites da suíte."],
    code: `describe("Compra protegida", () => {\n  it("busca produto, adiciona ao carrinho e confirma subtotal", () => {\n    cy.visit("/shop/products");\n    cy.get('[data-testid="product-search"]').type("Kit Smoke Test");\n    cy.get('[data-testid="add-product-1"]').click();\n    cy.get('a[href="/shop/cart"]').click();\n    cy.get('[data-testid="qty-1"]').should("have.text", "1");\n    cy.get('[data-testid="cart-subtotal"]').should("contain.text", "R$");\n  });\n});`,
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
  title: "Projeto final: proteja a compra de ponta a ponta",
  description: "Uma suíte Cypress executável para a loja de treino do QA Lab, com cenários independentes, dados previsíveis, estados de rede controlados e execução contínua.",
  deliverables: [
    "Plano de automação com objetivo, riscos, fora de escopo e risco residual.",
    "Smoke suite curta para o fluxo de busca e carrinho.",
    "Cenários de cupom e validação de checkout.",
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
