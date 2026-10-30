export type PlaywrightTrackModule = {
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

export const playwrightCourseModules: PlaywrightTrackModule[] = [
  {
    id: "setup-project",
    week: 1,
    duration: "45 min",
    title: "Prepare o projeto e rode a primeira spec",
    objective: "Configurar Playwright Test, escolher um alvo local seguro e executar um teste em modo headed e headless.",
    concepts: ["@playwright/test", "playwright.config.ts", "baseURL", "test runner"],
    practice: "Crie um projeto de testes separado, configure a URL do BrotoSpace e valide um comportamento que você observou.",
    deliverable: "Configuração reproduzível com comando de execução e primeiro teste independente.",
    checklist: ["A versão está registrada no package.json e no lockfile.", "A URL vem da configuração ou ambiente, não está espalhada nas specs.", "O mesmo teste executa no navegador e headless sem espera fixa."],
    code: `// playwright.config.ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? "https://www.brotospace.com",
    ...devices["Desktop Chrome"],
  },
});

// tests/home.spec.ts
import { test, expect } from "@playwright/test";

test("abre o BrotoSpace", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/brotospace\.com/);
});`,
  },
  {
    id: "resilient-locators",
    week: 1,
    duration: "60 min",
    title: "Localize elementos pelo que a pessoa percebe",
    objective: "Usar roles, nomes acessíveis e test IDs intencionais em vez de classes de CSS e caminhos frágeis no DOM.",
    concepts: ["getByRole", "getByLabel", "getByTestId", "locator"],
    practice: "No BrotoSpace, encontre um controle pelo nome acessível observado e explique quando um test ID seria necessário.",
    deliverable: "Dois cenários com locators únicos e ligados ao contrato de acessibilidade ou teste do produto.",
    checklist: ["O locator identifica um elemento só.", "Roles e labels são preferidos quando descrevem o controle.", "Não há seletor baseado em classe visual, posição ou XPath sem motivo."],
    code: `// Inspecione o BrotoSpace e use o nome acessível real do controle.
const control = page.getByRole("button", { name: "<nome observado>" });
await expect(control).toBeVisible();

// Use um test ID somente quando não houver um nome acessível estável.`,
  },
  {
    id: "auto-wait-assertions",
    week: 1,
    duration: "60 min",
    title: "Confie no auto-wait e nas web-first assertions",
    objective: "Esperar por condições observáveis e evitar sleeps, checagens instantâneas e retries que escondem defeitos.",
    concepts: ["actionability", "auto-wait", "expect", "timeout"],
    practice: "Faça a busca atualizar os resultados e valide o resultado ou mensagem vazia com assertions que aguardam a condição.",
    deliverable: "Spec sem espera fixa, com uma asserção que falharia se o estado esperado nunca aparecesse.",
    checklist: ["As ações esperam visibilidade, estabilidade e interatividade.", "As assertions são aguardadas com `await expect`.", "Timeouts não são aumentados para mascarar lentidão ou flakiness."],
    code: `// Troque o locator e a expectativa pelo estado real que você observou.
await page.goto("/");
await expect(page).toHaveURL(/brotospace\.com/);

// Evite: await page.waitForTimeout(1000)
// Evite: expect(await locator.isVisible()).toBe(true)`,
  },
  {
    id: "independent-tests",
    week: 2,
    duration: "60 min",
    title: "Faça cada teste começar no próprio estado",
    objective: "Isolar cookies, storage e dados para que specs possam rodar sozinhas, em qualquer ordem ou paralelo.",
    concepts: ["BrowserContext", "isolamento", "beforeEach", "dados próprios"],
    practice: "Prepare dados sintéticos antes de cada teste e confirme que executar somente o cenário produz o mesmo resultado.",
    deliverable: "Setup mínimo que prepara apenas o estado necessário para cada cenário.",
    checklist: ["A spec passa sozinha e em ordem diferente.", "Não depende de outro teste ou dado residual.", "A limpeza não apaga dados fora do contexto de teste."],
    code: `test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("inicia uma verificação independente", async ({ page }) => {
  await expect(page).toHaveURL(/brotospace\.com/);
  // Crie e limpe apenas dados sintéticos pertencentes ao teste.
});`,
  },
  {
    id: "critical-journey",
    week: 2,
    duration: "75 min",
    title: "Cubra uma jornada de ponta a ponta",
    objective: "Validar uma jornada real pela interface com começo, ação e resultado que tenha significado para quem usa.",
    concepts: ["fluxo crítico", "estado observável", "setup", "assertion"],
    practice: "Automatize uma jornada observada do BrotoSpace e verifique o resultado após sair e retornar ao contexto.",
    deliverable: "Um teste de jornada independente e focado em um resultado importante.",
    checklist: ["O teste verifica efeito visível, não só navegação.", "Estado inicial é controlado.", "Seletores foram conferidos na aplicação real."],
    code: `test("verifica uma jornada do BrotoSpace", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/brotospace\.com/);
  // Acrescente passos e expectativas que você confirmou na interface.
});`,
  },
  {
    id: "api-assisted-tests",
    week: 3,
    duration: "60 min",
    title: "Use API para preparar e confirmar estado",
    objective: "Combinar a interface com `APIRequestContext` quando isso deixa o teste mais rápido e ainda verifica a jornada certa.",
    concepts: ["request fixture", "pré-condição", "pós-condição", "APIRequestContext"],
  practice: "Use APIRequestContext somente com uma rota de leitura documentada e autorizada. Se não houver API de teste, mantenha a preparação em um mock local e use a interface do BrotoSpace para validar a jornada.",
    deliverable: "Teste híbrido com fronteiras claras: setup via API, comportamento crítico pela UI e pós-condição confiável.",
    checklist: ["O teste não substitui pela API o comportamento de UI que pretende cobrir.", "Credenciais vêm do ambiente e não são commitadas.", "Setup e limpeza usam recurso exclusivo do teste."],
    code: `test("usa uma fixture de teste documentada", async ({ page, request }) => {
  // Configure somente uma rota de leitura documentada e autorizada.
  const readOnlyUrl = process.env.READ_ONLY_TEST_URL;
  if (!readOnlyUrl) throw new Error("Configure READ_ONLY_TEST_URL para o ambiente autorizado");
  const response = await request.get(readOnlyUrl);
  expect(response.ok()).toBeTruthy();
  await page.goto("/");
  await expect(page).toHaveURL(/brotospace\.com/);
  // Use somente URL documentada e autorizada; não presuma uma API pública.
});`,
  },
  {
    id: "network-control",
    week: 3,
    duration: "75 min",
    title: "Controle a rede na fronteira certa",
    objective: "Interceptar dependências externas de modo explícito sem validar apenas uma resposta inventada pelo próprio mock.",
    concepts: ["page.route", "route.fulfill", "route.continue", "HAR"],
    practice: "Simule falha de uma dependência externa para verificar a mensagem de recuperação, mantendo ao menos um cenário integrado ao serviço real controlado.",
    deliverable: "Um teste de fallback com mock delimitado e um teste real sem interceptar o comportamento principal.",
    checklist: ["O mock representa uma fronteira externa.", "A assertion verifica o comportamento da aplicação após a resposta.", "O cenário não passa só por repetir o valor configurado no mock."],
    code: `await page.route("**/recommendations", async (route) => {
  await route.fulfill({
    status: 503,
    contentType: "application/json",
    body: JSON.stringify({ message: "temporariamente indisponível" }),
  });
});

await page.goto("/");
await expect(page.getByRole("status"))
  .toContainText("Não foi possível carregar recomendações");`,
  },
  {
    id: "auth-state",
    week: 4,
    duration: "60 min",
    title: "Reutilize autenticação sem vazar sessão",
    objective: "Preparar estado autenticado por setup controlado e proteger arquivos `storageState` com tokens e cookies.",
    concepts: ["setup project", "storageState", "cookies", "gitignore"],
    practice: "Configure um setup autenticado de teste com conta descartável e prove que o arquivo de sessão não entra no controle de versão.",
    deliverable: "Fluxo autenticado repetível com sessão fora do Git e instrução de renovação.",
    checklist: ["A conta é de teste, não de uma pessoa real.", "Arquivo com sessão está excluído e protegido.", "Testes que alteram dados não compartilham a mesma conta em paralelo."],
    code: `// playwright.config.ts
projects: [
  { name: "setup", testMatch: /.*\.setup\.ts/ },
  {
    name: "chromium-authenticated",
    use: { ...devices["Desktop Chrome"], storageState: "playwright/.auth/user.json" },
    dependencies: ["setup"],
  },
];

// Inclua playwright/.auth/ no .gitignore.
// Nunca salve credenciais reais no storageState commitado.`,
  },
  {
    id: "projects-browsers-devices",
    week: 5,
    duration: "75 min",
    title: "Amplie a cobertura com projects e devices",
    objective: "Selecionar uma matriz de navegador e viewport orientada por risco em vez de repetir tudo sem critério.",
    concepts: ["projects", "Chromium", "Firefox", "WebKit", "device emulation"],
    practice: "Rode smoke crítico em Chromium e escolha um subconjunto para Firefox, WebKit e um dispositivo móvel emulado.",
    deliverable: "Matriz de execução com risco, navegador, frequência e custo esperado.",
    checklist: ["Matriz deriva de suporte e uso do produto.", "Execução completa e smoke têm escopos diferentes.", "Emulação móvel não é descrita como substituta de aparelho físico."],
    code: `projects: [
  { name: "chromium", use: { ...devices["Desktop Chrome"] } },
  { name: "firefox", use: { ...devices["Desktop Firefox"] } },
  { name: "webkit", use: { ...devices["Desktop Safari"] } },
  { name: "mobile-chrome", use: { ...devices["Pixel 7"] } },
],

// Execute um projeto específico:
// npx playwright test --project=webkit`,
  },
  {
    id: "fixtures-maintainability",
    week: 5,
    duration: "60 min",
    title: "Organize fixtures sem esconder o teste",
    objective: "Extrair setup repetido para fixtures pequenas e manter intenção e asserções visíveis na spec.",
    concepts: ["test.extend", "fixture scope", "Page Object", "composição"],
    practice: "Extraia um helper para preparar dados sintéticos do BrotoSpace e avalie se um page object reduz duplicação sem ocultar os passos do fluxo.",
    deliverable: "Fixture ou objeto de página com responsabilidade única e teste ainda legível.",
    checklist: ["Fixture tem ciclo de vida e escopo intencionais.", "Abstração reduz repetição real, não acrescenta camadas sem benefício.", "A spec continua mostrando comportamento e resultado esperado."],
    code: `import { test as base, expect } from "@playwright/test";

type Fixtures = { brotoPage: void };
export const test = base.extend<Fixtures>({
  brotoPage: async ({ page }, use) => {
    await page.goto("/");
  await expect(page).toHaveURL(/brotospace\.com/);
    await use();
  },
});

test("abre o BrotoSpace", async ({ page, brotoPage }) => {
  await expect(page).toHaveURL(/brotospace\.com/);
});`,
  },
  {
    id: "debug-traces-flakiness",
    week: 6,
    duration: "75 min",
    title: "Investigue falhas com Trace Viewer",
    objective: "Usar trace, screenshot e relatório para descobrir se a causa está no produto, teste, dado ou ambiente.",
    concepts: ["trace.zip", "Trace Viewer", "UI mode", "flake", "retry"],
    practice: "Leia um trace de execução falha, reconstrua a sequência de ações e registre a causa antes de alterar timeout, retry ou locator.",
    deliverable: "Triagem reproduzível com evidência e uma correção da causa, não um retry extra para mascará-la.",
    checklist: ["Trace captura evidências sem incluir segredos desnecessários.", "Retry serve para diagnosticar/recuperar CI e não converte flakiness em sucesso aceito.", "A correção é revalidada executando a spec isolada."],
    code: `export default defineConfig({
  retries: process.env.CI ? 1 : 0,
  use: {
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
});

// Inspecione o artefato:
// npx playwright show-trace test-results/.../trace.zip`,
  },
  {
    id: "ci-pipeline",
    week: 7,
    duration: "75 min",
    title: "Leve smoke e regressão para o CI",
    objective: "Separar feedback rápido de matriz completa e preservar artefatos úteis de falha no pipeline.",
    concepts: ["headless", "workers", "sharding", "reporter", "artifact"],
    practice: "Defina um smoke em pull request e uma regressão mais ampla em execução agendada; limite concorrência para não sobrecarregar o ambiente.",
    deliverable: "Plano de CI com comandos, gatilhos, variáveis protegidas e retenção de traces.",
    checklist: ["Smoke é curto e cobre fluxo de maior risco.", "Suite completa roda em cadência adequada.", "Artefatos e logs respeitam prazo e privacidade."],
    code: `// Exemplo de comandos no CI
npx playwright test --project=chromium
npx playwright test --reporter=html

// Upload do diretório playwright-report/ e dos traces
// somente como artefatos da execução, com retenção definida.`,
  },
  {
    id: "final-project",
    week: 8,
    duration: "2–3 h",
    title: "Projeto final: suíte cross-browser confiável",
    objective: "Entregar uma suíte pequena e independente que proteja uma jornada de negócio e falhe com evidência acionável.",
    concepts: ["risco", "jornada", "isolamento", "matriz", "diagnóstico"],
    practice: "Cubra uma jornada observada do BrotoSpace com estado independente, assertions web-first, uma variação de erro segura e smoke em Chromium; justifique a matriz adicional.",
    deliverable: "Starter executável, README, specs independentes, configuração de projeto, CI proposto e critérios de triagem.",
    checklist: ["Cada teste roda sozinho e verifica um resultado relevante.", "Locators são estáveis e asserts aguardam estado observável.", "Credenciais e sessões não estão versionadas.", "Trace e screenshot ajudam a investigar falha."],
    code: `test("abre uma jornada do BrotoSpace", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/brotospace\.com/);
  // Acrescente os passos e expectativas confirmados na interface observada.
});`,
  },
];

export const playwrightCourseOutcomes = [
  "Escrever testes independentes com locators robustos e assertions que aguardam condições.",
  "Escolher entre browser, API e interceptação de rede conforme o risco coberto.",
  "Configurar sessões, fixtures e projetos de navegador/dispositivo com segurança.",
  "Investigar falhas no Trace Viewer e entregar smoke/regressão no CI.",
];

export const playwrightCourseResources = [
  { label: "Playwright · boas práticas", href: "https://playwright.dev/docs/best-practices" },
  { label: "Playwright · locators", href: "https://playwright.dev/docs/locators" },
  { label: "Playwright · isolamento", href: "https://playwright.dev/docs/browser-contexts" },
  { label: "Playwright · projetos e navegadores", href: "https://playwright.dev/docs/test-projects" },
  { label: "Playwright · API testing", href: "https://playwright.dev/docs/api-testing" },
  { label: "Playwright · Trace Viewer", href: "https://playwright.dev/docs/trace-viewer" },
];

export const playwrightFinalProject = {
  title: "Suíte de regressão do BrotoSpace",
  description: "Uma suíte cross-browser orientada por risco, com fluxo independente, execução rápida no PR e evidência para investigação.",
  deliverables: [
    "Mapa de risco e matriz de browsers/devices",
    "Specs de captura, retomada e um caminho de erro observado",
    "Configuração com isolamento, relatórios e traces em falha",
    "README com instalação, execução e dados de teste seguros",
  ],
  rubric: [
    { criterion: "Risco e comportamento cobertos", weight: "25%" },
    { criterion: "Qualidade e independência dos testes", weight: "30%" },
    { criterion: "Configuração e evidência de falha", weight: "25%" },
    { criterion: "Segurança e documentação", weight: "20%" },
  ],
};
