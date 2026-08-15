export type CypressCourseLevel = "Básico" | "Intermediário" | "Avançado";

export type CypressModule = {
  id: string;
  week: string;
  level: CypressCourseLevel;
  title: string;
  objective: string;
  lessons: string[];
  practice: string;
  deliverable: string;
  checkpoint: string;
};

export type CypressModuleDetail = {
  agenda: string[];
  concepts: string[];
  code: string;
  exerciseSteps: string[];
  reviewChecklist: string[];
};

export const cypressCourseModules: CypressModule[] = [
  {
    id: "setup",
    week: "Semana 1",
    level: "Básico",
    title: "Setup, estrutura e mentalidade E2E",
    objective: "Sair do zero e entender como o Cypress executa, observa e depura um teste ponta a ponta.",
    lessons: ["Instalação com npm/bun e abertura do runner", "Estrutura e2e, fixtures, support e cypress.config", "baseUrl, cy.visit e organização inicial", "Runner visual, snapshots e time-travel debugging"],
    practice: "Criar o projeto Cypress, abrir o runner e escrever o primeiro teste visitando uma tela real do QA Lab.",
    deliverable: "Repositório com Cypress configurado e um smoke test executável.",
    checkpoint: "O aluno entende onde cada arquivo vive e consegue explicar o ciclo: abrir app, executar comando, observar estado e validar comportamento.",
  },
  {
    id: "selectors-commands",
    week: "Semana 1",
    level: "Básico",
    title: "Seletores, comandos e retry automático",
    objective: "Escrever interações estáveis sem copiar XPath frágil nem depender de espera fixa.",
    lessons: ["cy.get, cy.contains e encadeamento", "click, type, clear, check, select", "Retry automático e diferença para Selenium", "Seletores por data-testid, texto e intenção do usuário"],
    practice: "Automatizar um fluxo de formulário com campos obrigatórios, validação e mensagem de sucesso.",
    deliverable: "Teste cobrindo preenchimento válido e uma validação negativa.",
    checkpoint: "O teste não usa cy.wait com tempo fixo e falha com mensagem compreensível quando a UI muda.",
  },
  {
    id: "assertions-hooks",
    week: "Semana 2",
    level: "Básico",
    title: "Asserções, hooks e organização",
    objective: "Dar estrutura profissional aos testes e escrever validações que provam comportamento, não apenas presença visual.",
    lessons: ["should, expect e Chai assertions", "Asserção implícita vs explícita", "describe, context, it, beforeEach e afterEach", "Nome de teste como documentação do comportamento"],
    practice: "Organizar uma suíte de login/cadastro com cenários positivos, negativos e mensagens de erro.",
    deliverable: "Suíte com pelo menos 5 testes legíveis e independentes.",
    checkpoint: "Cada teste pode rodar sozinho e comunica claramente qual regra protege.",
  },
  {
    id: "real-data-fixtures",
    week: "Semana 3",
    level: "Intermediário",
    title: "Dados de teste, fixtures e custom commands",
    objective: "Reduzir repetição e controlar massa de dados sem acoplar tudo na interface.",
    lessons: ["cy.fixture e massa estática", "Geração dinâmica de dados", "Custom commands como cy.login", "Quando abstrair e quando manter explícito"],
    practice: "Criar comandos reutilizáveis para login e criação de entidade usando dados isolados.",
    deliverable: "Fluxo com fixture, massa dinâmica e command tipado/documentado.",
    checkpoint: "A suíte fica menor sem esconder o comportamento principal do teste.",
  },
  {
    id: "intercept-api",
    week: "Semana 4",
    level: "Intermediário",
    title: "Intercept, mocks, loading e erros",
    objective: "Controlar respostas de API para testar estados difíceis de reproduzir manualmente.",
    lessons: ["cy.intercept para espionar requests", "Stub de sucesso, erro e vazio", "Validação de loading, retry e mensagens", "cy.request para testes de API e preparação de estado"],
    practice: "Testar uma tela que carrega lista, estado vazio, erro 500 e sucesso com dados controlados.",
    deliverable: "Suíte cobrindo UI + contrato mínimo da request crítica.",
    checkpoint: "O aluno sabe decidir quando mockar e quando usar backend real.",
  },
  {
    id: "auth-env-files",
    week: "Semana 5",
    level: "Intermediário",
    title: "Autenticação, ambientes e casos especiais",
    objective: "Tornar a suíte útil em projeto real com login, ambiente, arquivos e fronteiras técnicas.",
    lessons: ["cy.session e performance", "Cypress.env para dev/staging/prod", "Upload e download de arquivos", "iframes, shadow DOM e limitações práticas"],
    practice: "Criar uma suíte autenticada que roda contra ambiente configurável e valida upload/download.",
    deliverable: "Configuração por ambiente com sessão reutilizada.",
    checkpoint: "A suíte evita login repetitivo e deixa claro quais variáveis mudam por ambiente.",
  },
  {
    id: "architecture-ci",
    week: "Semana 6",
    level: "Avançado",
    title: "Arquitetura de suíte, CI/CD e paralelização",
    objective: "Escalar Cypress sem virar uma coleção lenta e instável de scripts.",
    lessons: ["App actions vs Page Object Model", "Isolamento entre testes e limpeza de estado", "GitHub Actions, artefatos e vídeos", "Sharding, paralelização e Cypress Cloud"],
    practice: "Montar pipeline que executa E2E, salva vídeos/screenshots e separa smoke de regressão.",
    deliverable: "Workflow CI com comandos claros para smoke, regressão e debug.",
    checkpoint: "Falha no CI gera evidência suficiente para análise sem rodar localmente às cegas.",
  },
  {
    id: "bdd-component-a11y",
    week: "Semana 7",
    level: "Avançado",
    title: "BDD, component testing, visual e acessibilidade",
    objective: "Conectar Cypress com documentação viva, testes de componente e qualidade além do fluxo feliz.",
    lessons: ["Gherkin com Cucumber no Cypress", "Component testing em React/Vue", "cypress-axe para acessibilidade", "Screenshot diffing e limites de visual testing"],
    practice: "Transformar uma regra em cenário BDD e criar um teste de componente para validar estado isolado.",
    deliverable: "BDD + component test + checagem básica de acessibilidade.",
    checkpoint: "O aluno sabe quando E2E completo é excesso e quando componente ou acessibilidade entrega melhor sinal.",
  },
  {
    id: "plugins-ai-flakiness",
    week: "Semana 8",
    level: "Avançado",
    title: "Plugins, flakiness, relatórios e IA",
    objective: "Fechar o curso com governança de suíte, extensões e uso responsável de IA para automação.",
    lessons: ["cy.task e eventos Node", "Mochawesome, Allure e dashboards", "Antipadrões: cy.wait fixo, testes dependentes e selectors frágeis", "IA, self-healing e geração assistida de testes"],
    practice: "Adicionar relatório, revisar flakiness da suíte e propor uma estratégia de self-healing com limites claros.",
    deliverable: "Projeto final com relatório, pipeline e documento de arquitetura da suíte.",
    checkpoint: "O aluno consegue defender uma estratégia de automação, não apenas escrever comandos Cypress.",
  },
];

export const cypressCourseOutcomes = [
  "Escrever testes E2E legíveis, estáveis e independentes",
  "Controlar massa de dados, autenticação e ambientes",
  "Testar UI, API, estados de erro, loading e regressões críticas",
  "Rodar Cypress em CI/CD com evidências úteis",
  "Evitar flakiness, waits fixos e abstrações que escondem comportamento",
  "Conectar Cypress com BDD, acessibilidade, component testing e IA responsável",
];

export const cypressCourseDetails: Record<string, CypressModuleDetail> = {
  setup: {
    agenda: [
      "Abrir um projeto vazio e instalar Cypress sem depender de template pronto.",
      "Criar a primeira spec e rodar no modo interativo.",
      "Ler o log de comandos e explicar por que um teste falhou.",
      "Configurar baseUrl e separar comandos de teste de configuração do projeto.",
    ],
    concepts: ["E2E vs integração vs componente", "spec file", "baseUrl", "runner", "command log", "snapshot", "test isolation"],
    code: `// cypress.config.ts
import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3002",
    specPattern: "cypress/e2e/**/*.cy.ts",
    video: true,
    screenshotOnRunFailure: true,
  },
});

// cypress/e2e/smoke.cy.ts
describe("QA Lab smoke", () => {
  it("abre a home e mostra o desafio", () => {
    cy.visit("/");
    cy.contains("QA LAB").should("be.visible");
    cy.contains("Começar").should("be.visible");
  });
});`,
    exerciseSteps: [
      "Instale Cypress e crie a estrutura cypress/e2e, cypress/fixtures e cypress/support.",
      "Configure baseUrl apontando para o ambiente local.",
      "Crie um smoke test para home, playground e página do ExpenseFlow.",
      "Force uma falha proposital e anote qual evidência o runner oferece.",
    ],
    reviewChecklist: ["A spec roda com cypress open e cypress run", "Não existe URL hardcoded dentro de todos os testes", "O aluno consegue explicar o erro usando command log e screenshot"],
  },
  "selectors-commands": {
    agenda: [
      "Mapear a tela como usuário antes de escolher seletor.",
      "Praticar cy.get, cy.contains, find, within e encadeamento.",
      "Substituir espera fixa por retry automático e asserções.",
      "Criar uma regra de seletores para o projeto.",
    ],
    concepts: ["data-testid", "query por texto", "subject", "chain", "retry-ability", "actionability", "anti-pattern de XPath"],
    code: `describe("ExpenseFlow - cadastro de despesa", () => {
  it("exibe validação quando título fica vazio", () => {
    cy.visit("/playground/expenseflow");

    cy.contains("Nova despesa").click();
    cy.get('[data-testid="expense-title"]').clear();
    cy.get('[data-testid="expense-amount"]').type("120.50");
    cy.contains("Salvar").click();

    cy.contains("Título é obrigatório").should("be.visible");
  });
});`,
    exerciseSteps: [
      "Escolha um fluxo com formulário e liste os elementos relevantes.",
      "Crie seletores estáveis para campo, botão, erro e mensagem de sucesso.",
      "Automatize um cenário positivo e um negativo.",
      "Remova qualquer cy.wait(1000) e substitua por should ou intercept.",
    ],
    reviewChecklist: ["Seletores expressam intenção", "Teste não depende de ordem visual frágil", "Asserções validam comportamento e não só existência de elemento"],
  },
  "assertions-hooks": {
    agenda: [
      "Separar suíte por comportamento de negócio.",
      "Usar beforeEach apenas para estado repetido necessário.",
      "Escrever asserções sobre resultado observável.",
      "Nomear testes como documentação viva.",
    ],
    concepts: ["describe", "context", "it", "beforeEach", "should", "expect", "assertion message", "test independence"],
    code: `describe("Aprovação de despesas", () => {
  beforeEach(() => {
    cy.visit("/playground/expenseflow");
    cy.contains("Perfil gestor").click();
  });

  it("aprova uma despesa pendente do próprio time", () => {
    cy.contains("Almoço com cliente")
      .parents('[data-testid="expense-card"]')
      .within(() => {
        cy.contains("Pendente").should("be.visible");
        cy.contains("Aprovar").click();
      });

    cy.contains("Despesa aprovada").should("be.visible");
  });
});`,
    exerciseSteps: [
      "Reescreva os nomes dos testes para ficarem orientados a comportamento.",
      "Agrupe cenários por regra de negócio.",
      "Use beforeEach sem esconder dados importantes do teste.",
      "Adicione uma asserção para mensagem, estado final e ausência de regressão óbvia.",
    ],
    reviewChecklist: ["Cada teste roda isolado", "Hooks não criam dependência entre testes", "A falha aponta qual regra quebrou"],
  },
  "real-data-fixtures": {
    agenda: [
      "Criar fixtures legíveis para perfis e despesas.",
      "Decidir quando usar dado fixo, dado gerado ou dado criado por API.",
      "Criar custom command sem esconder regra de negócio.",
      "Tipar comandos no TypeScript.",
    ],
    concepts: ["fixture", "factory", "custom command", "Cypress.Commands.add", "support/e2e.ts", "types.d.ts"],
    code: `// cypress/support/commands.ts
Cypress.Commands.add("loginAs", (role: "employee" | "manager") => {
  cy.visit("/playground/expenseflow");
  cy.contains(role === "manager" ? "Perfil gestor" : "Perfil colaborador").click();
});

// cypress/e2e/expenses.cy.ts
describe("Despesas", () => {
  it("colaborador cadastra despesa com massa de fixture", () => {
    cy.fixture("expense").then((expense) => {
      cy.loginAs("employee");
      cy.contains("Nova despesa").click();
      cy.get('[data-testid="expense-title"]').type(expense.title);
      cy.get('[data-testid="expense-amount"]').type(String(expense.amount));
      cy.contains("Salvar").click();
      cy.contains(expense.title).should("be.visible");
    });
  });
});`,
    exerciseSteps: [
      "Crie fixtures para colaborador, gestor e despesa válida.",
      "Crie cy.loginAs com papéis diferentes.",
      "Troque repetição de login nos testes pelo command.",
      "Documente no README quando usar fixture e quando criar dado em runtime.",
    ],
    reviewChecklist: ["Commands não viram caixa-preta gigante", "Dados sensíveis não aparecem no repositório", "Massa de teste é previsível e fácil de alterar"],
  },
  "intercept-api": {
    agenda: [
      "Espionar requests reais antes de mockar.",
      "Controlar sucesso, vazio, erro 500 e lentidão.",
      "Validar loading sem usar tempo fixo.",
      "Usar cy.request para preparar ou validar estado.",
    ],
    concepts: ["cy.intercept", "alias", "cy.wait('@alias')", "stub", "fixture response", "contract smoke", "network error"],
    code: `describe("Relatórios com estados de API", () => {
  it("mostra mensagem amigável quando API falha", () => {
    cy.intercept("GET", "/api/reports*", {
      statusCode: 500,
      body: { error: "internal_error" },
    }).as("reportsError");

    cy.visit("/playground/expenseflow");
    cy.contains("Relatórios").click();
    cy.wait("@reportsError");

    cy.contains("Não foi possível carregar os relatórios").should("be.visible");
  });
});`,
    exerciseSteps: [
      "Escolha uma tela que dependa de API.",
      "Crie quatro testes: sucesso, vazio, erro e carregamento lento.",
      "Valide request method, URL e status.",
      "Escreva um teste cy.request para contrato mínimo de um endpoint.",
    ],
    reviewChecklist: ["Mocks cobrem estados que usuário vê", "O teste espera alias de rede e não milissegundos", "Contrato mínimo protege status e campos críticos"],
  },
  "auth-env-files": {
    agenda: [
      "Configurar variáveis por ambiente.",
      "Evitar login repetitivo com cy.session.",
      "Testar upload/download com evidência.",
      "Mapear limites de iframe, shadow DOM e cross-origin.",
    ],
    concepts: ["Cypress.env", "cy.session", "env vars", "downloadsFolder", "selectFile", "shadow", "iframe limitation"],
    code: `Cypress.Commands.add("sessionLogin", (email: string, password: string) => {
  cy.session([email], () => {
    cy.visit("/login");
    cy.get('[name="email"]').type(email);
    cy.get('[name="password"]').type(password, { log: false });
    cy.contains("Entrar").click();
    cy.url().should("include", "/lab");
  });
});

it("anexa comprovante na despesa", () => {
  cy.sessionLogin(Cypress.env("USER_EMAIL"), Cypress.env("USER_PASSWORD"));
  cy.visit("/playground/expenseflow");
  cy.contains("Nova despesa").click();
  cy.get('input[type="file"]').selectFile("cypress/fixtures/receipt.pdf");
  cy.contains("receipt.pdf").should("be.visible");
});`,
    exerciseSteps: [
      "Configure env local sem commitar segredo.",
      "Implemente cy.session para usuário autenticado.",
      "Valide upload de arquivo permitido e arquivo inválido.",
      "Explique no README como rodar contra local e staging.",
    ],
    reviewChecklist: ["Segredos não estão versionados", "Sessão reduz tempo sem quebrar isolamento", "Ambientes são escolhidos por configuração, não por edição de spec"],
  },
  "architecture-ci": {
    agenda: [
      "Separar smoke, regressão e testes longos.",
      "Definir arquitetura de pastas da suíte.",
      "Rodar Cypress no GitHub Actions com artefatos.",
      "Planejar paralelização e estratégia de flakiness.",
    ],
    concepts: ["test pyramid", "smoke", "regression", "artifact", "video", "screenshot", "sharding", "Cypress Cloud", "app actions"],
    code: `# .github/workflows/e2e.yml
name: E2E
on: [pull_request]
jobs:
  cypress:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v2
      - run: bun install --frozen-lockfile
      - run: bun run build
      - run: bunx start-server-and-test "bun run start" http://localhost:3000 "bunx cypress run --spec 'cypress/e2e/smoke/**/*.cy.ts'"
      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: cypress-evidence
          path: |
            cypress/videos
            cypress/screenshots`,
    exerciseSteps: [
      "Crie scripts npm para cy:open, cy:run, cy:smoke e cy:regression.",
      "Separe specs por criticidade.",
      "Adicione workflow CI com evidências em falha.",
      "Defina regra: o que bloqueia PR e o que roda agendado.",
    ],
    reviewChecklist: ["CI produz evidência útil", "Smoke é rápido e cobre fluxo crítico", "Regressão não bloqueia tudo sem estratégia"],
  },
  "bdd-component-a11y": {
    agenda: [
      "Traduzir regra de negócio em exemplo Gherkin.",
      "Comparar BDD, E2E e component testing.",
      "Adicionar axe para checagens básicas.",
      "Definir limites de snapshot e screenshot diffing.",
    ],
    concepts: ["Gherkin", "Given/When/Then", "component testing", "mount", "cypress-axe", "WCAG", "visual diff"],
    code: `Feature: Aprovação de despesa
  Scenario: gestor não pode aprovar a própria despesa
    Given uma despesa pendente criada pelo gestor Marina
    When Marina tenta aprovar a própria despesa
    Then o sistema bloqueia a ação
    And informa que aprovação própria não é permitida

// acessibilidade básica
it("não possui violações críticas no formulário", () => {
  cy.visit("/playground/expenseflow");
  cy.injectAxe();
  cy.contains("Nova despesa").click();
  cy.checkA11y(undefined, { includedImpacts: ["critical", "serious"] });
});`,
    exerciseSteps: [
      "Escolha uma regra crítica e escreva 3 cenários Gherkin.",
      "Implemente pelo menos um cenário com Cypress.",
      "Adicione cypress-axe em uma tela do fluxo.",
      "Crie um teste de componente para estado de erro ou card de despesa.",
    ],
    reviewChecklist: ["Gherkin contém exemplos concretos", "Acessibilidade não é só checklist visual", "Component test reduz custo onde E2E seria excesso"],
  },
  "plugins-ai-flakiness": {
    agenda: [
      "Usar cy.task para operações fora do browser.",
      "Gerar relatórios executivos da suíte.",
      "Classificar flakiness por causa provável.",
      "Definir política de IA e self-healing sem mascarar bug real.",
    ],
    concepts: ["cy.task", "Node events", "Mochawesome", "Allure", "flake quarantine", "selector healing", "AI-assisted test generation"],
    code: `// cypress.config.ts
export default defineConfig({
  e2e: {
    setupNodeEvents(on) {
      on("task", {
        log(message: string) {
          console.log(message);
          return null;
        },
        resetDatabase() {
          // chamar script controlado de reset
          return null;
        },
      });
    },
  },
});

it("registra evidência técnica sem poluir o teste", () => {
  cy.task("log", "Iniciando regressão de aprovação");
  cy.visit("/playground/expenseflow");
});`,
    exerciseSteps: [
      "Adicione um reporter e gere HTML/JSON no cypress run.",
      "Liste 5 falhas flaky e classifique causa: dados, rede, seletor, ambiente ou timing.",
      "Crie proposta de quarentena com prazo e dono.",
      "Escreva uma política de uso de IA para sugerir testes e revisar seletores.",
    ],
    reviewChecklist: ["Relatório ajuda decisão, não só decoração", "Flaky test tem dono e prazo", "Self-healing não esconde mudança funcional sem revisão humana"],
  },
};

export const cypressRubric = [
  { criterion: "Clareza dos cenários", expected: "Nomes e asserções explicam a regra protegida.", weight: "20%" },
  { criterion: "Estabilidade", expected: "Sem cy.wait fixo, sem dependência de ordem entre testes e com dados controlados.", weight: "25%" },
  { criterion: "Cobertura de risco", expected: "Cobre fluxo crítico, negativo relevante, erro de API e regressão de negócio.", weight: "25%" },
  { criterion: "Arquitetura", expected: "Commands, fixtures, pastas e CI organizados sem abstração exagerada.", weight: "20%" },
  { criterion: "Evidência", expected: "Relatórios, screenshots, vídeos e logs permitem diagnosticar falha no CI.", weight: "10%" },
];

export const cypressCourseResources = [
  "Documentação oficial do Cypress",
  "Cypress Real World App como referência de arquitetura",
  "Testing Library para seletores orientados ao usuário",
  "cypress-axe para acessibilidade",
  "Mochawesome ou Allure para relatórios",
  "GitHub Actions para CI/CD",
];

export const cypressFinalProject = {
  title: "Projeto final: suíte E2E profissional para ExpenseFlow",
  description:
    "O aluno monta uma suíte Cypress para um produto com falhas intencionais, cobrindo login, cadastro de despesa, aprovação, reprovação, relatórios, erros de API e regressão crítica.",
  deliverables: [
    "Plano de automação com escopo, fora de escopo e risco residual",
    "Smoke suite curta para CI rápido",
    "Regressão E2E com dados controlados",
    "Mocks com cy.intercept para estados difíceis",
    "Relatório com evidências, vídeos/screenshots e análise de flakiness",
  ],
};
