export type TechnicalPlaybook = {
  title: string;
  introduction: string;
  examples: readonly { title: string; language: string; code: string; explanation: string }[];
  review: readonly string[];
  further?: { label: string; href: string };
};

export const technicalPlaybooks: Record<number, TechnicalPlaybook> = {
  6: {
    title: "Do cenário manual ao E2E executável",
    introduction: "Os exemplos usam o Lab de login que existe no QA Lab. Compare a intenção do teste com a ação e a assertion. Para o sistema, adapte os seletores e as regras após observar o fluxo real.",
    examples: [
      { title: "Playwright: sucesso e erro com estado observável", language: "typescript", code: `import { expect, test } from "@playwright/test";

test("login informa erro e aceita credenciais válidas", async ({ page }) => {
  await page.goto("/labs/login");
  await page.getByTestId("login-button").click();
  await expect(page.getByTestId("login-message"))
    .toContainText("Usuario obrigatorio");

  await page.getByTestId("username").fill("standard_user");
  await page.getByTestId("password").fill("qa_lab_secret");
  await page.getByTestId("login-button").click();
  await expect(page.getByTestId("login-message"))
    .toContainText("Login realizado");
});`, explanation: "O teste verifica uma regra negativa e um resultado de sucesso. A assertion espera o estado final; não há pausa fixa. A spec real do repositório está em packages/web/tests/e2e/playground.e2e.ts." },
      { title: "Cypress: mesma regra, outro mecanismo de espera", language: "typescript", code: `// cypress.config.ts: e2e.baseUrl = "http://localhost:3002"
describe("login do QA Lab", () => {
  it("mostra validação e depois confirma acesso", () => {
    cy.visit("/labs/login");
    cy.get('[data-testid="login-button"]').click();
    cy.get('[data-testid="login-message"]')
      .should("contain.text", "Usuario obrigatorio");

    cy.get('[data-testid="username"]').type("standard_user");
    cy.get('[data-testid="password"]').type("qa_lab_secret");
    cy.get('[data-testid="login-button"]').click();
    cy.get('[data-testid="login-message"]')
      .should("contain.text", "Login realizado");
  });
});`, explanation: "Cypress repete consultas e assertions até a condição ser satisfeita ou expirar. Configure baseUrl para a porta em que o QA Lab está rodando. O curso Cypress aprofunda fixtures, interceptação, autenticação e arquitetura da suíte." },
    ],
    review: ["O teste prepara seus próprios dados ou usa um estado explicitamente conhecido.", "A assertion verifica um resultado de negócio, não só um clique.", "Uma falha deixa trace, captura ou log suficiente para diagnóstico.", "A mesma spec pode rodar sozinha e em conjunto sem depender da ordem."],
    further: { label: "Aprofundar no curso Cypress E2E", href: "/cursos/cypress" },
  },
  7: {
    title: "Contrato de API em código",
    introduction: "Este exemplo usa a API de agendamentos local do QA Lab como apoio técnico ao caso do BrotoSpace. Transfira o método: criar dado próprio, capturar ID, conferir campos, alterar com autorização e verificar persistência. Os endpoints locais não representam a API do BrotoSpace.",
    examples: [
      { title: "Playwright API: criar, alterar e validar resposta", language: "typescript", code: `import { expect, test } from "@playwright/test";

test("agendamento respeita o contrato", async ({ request }) => {
  const login = await request.post("/api/auth/login", {
    data: { username: "standard_user", password: "qa_lab_secret" },
  });
  expect(login.ok()).toBeTruthy();
  const auth = await login.json();

  const created = await request.post("/api/bookings", {
    data: {
      firstname: "QA", lastname: "Lab", totalprice: 500,
      depositpaid: true,
      bookingdates: { checkin: "2026-12-10", checkout: "2026-12-12" },
      additionalneeds: "",
    },
  });
  expect(created.status()).toBe(201);
  const booking = await created.json();
  expect(booking.data.id).toBeTruthy();

  const updated = await request.patch(
    "/api/bookings/" + booking.data.id,
    {
      headers: { authorization: "Bearer " + auth.data.token },
      data: { additionalneeds: "Mesa silenciosa" },
    },
  );
  expect(updated.status()).toBe(200);
  expect((await updated.json()).data.additionalneeds)
    .toBe("Mesa silenciosa");
});`, explanation: "Status confirma a classe da resposta, mas a assertion do corpo verifica a regra alterada. Em uma suite de trabalho, acrescente cenário negativo, limpeza do dado e autorização com outra conta. Consulte o contrato no API Playground antes de adaptar endpoints." },
    ],
    review: ["A coleção ou spec cria seus próprios dados e usa o ID retornado.", "Cada etapa confere status e conteúdo relevante.", "Há caso de erro e verificação de autorização.", "Tokens e URL são configurados fora do código compartilhado."],
    further: { label: "Abrir API Playground e documentação", href: "/api-playground" },
  },
  9: {
    title: "E2E dentro de um pipeline de CI",
    introduction: "O workflow abaixo é um modelo para a aplicação web do QA Lab. Ele instala dependências, prepara o navegador, executa a suíte e guarda evidências mesmo se houver falha. Ajuste comandos e serviços para o repositório onde for aplicar.",
    examples: [
      { title: "GitHub Actions: verificação e artefatos", language: "yaml", code: `name: QA web
on: [pull_request]
permissions:
  contents: read
jobs:
  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v2
      - run: bun install --frozen-lockfile
      - run: bunx playwright install --with-deps chromium
      - name: Executar E2E
        working-directory: packages/web
        run: bunx playwright test
      - name: Guardar evidências de falha
        if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-result
          path: packages/web/test-results/
          if-no-files-found: ignore`, explanation: "Esta é a estrutura do job, não um workflow pronto para o repositório: a aplicação e quaisquer serviços dependentes precisam subir antes do teste. O upload condicional preserva traces e capturas; o gate falha se o comando E2E falhar." },
    ],
    review: ["O ambiente de teste é iniciado e está pronto antes do E2E.", "Dependências, dados e segredos estão isolados.", "O erro do teste bloqueia conforme o risco acordado.", "Relatório e trace ficam acessíveis após a destruição do runner."],
    further: { label: "Praticar no Lab de CI/CD", href: "/lab/cicd" },
  },
  11: {
    title: "k6: do script às métricas",
    introduction: "O projeto já contém baseline, carga gradual e pico em packages/performance. Os scripts só aceitam alvo HTTP local e exigem confirmação LOCAL_ONLY. O trecho mostra como checks e thresholds respondem a perguntas diferentes.",
    examples: [
      { title: "k6: requisição, check e threshold", language: "javascript", code: `import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  vus: 1,
  iterations: 10,
  thresholds: {
    http_req_failed: ["rate<0.01"],
    http_req_duration: ["p(95)<500", "p(99)<1000"],
  },
};

export default function () {
  const response = http.get("http://127.0.0.1:3001/api/products");
  check(response, { "produtos respondem 2xx":
    (result) => result.status >= 200 && result.status < 300 });
  sleep(1);
}`, explanation: "O check mede correção de cada resposta; thresholds avaliam o conjunto de medições. Os limites são didáticos para a API local. Use o runner do projeto, que valida o alvo, em vez de copiar o script para um endereço remoto." },
      { title: "PowerShell: executar os três cenários locais", language: "powershell", code: `$env:PERF_TARGET_ACK = "LOCAL_ONLY"
$env:PERF_TARGET = "http://127.0.0.1:3001"
node packages/performance/scripts/run-k6.js baseline
node packages/performance/scripts/run-k6.js load
node packages/performance/scripts/run-k6.js spike`, explanation: "Inicie a API local antes. Compare p95, p99, throughput e erros entre os três cenários; anote também hardware, dados e duração. Não extrapole números locais para capacidade de produção." },
    ],
    review: ["O objetivo e os limites são definidos antes da execução.", "O alvo é a API local e o runner confirma LOCAL_ONLY.", "Baseline, carga e pico são comparados nas mesmas métricas.", "A conclusão indica limite da evidência e próximo experimento."],
    further: { label: "Abrir prática local de k6", href: "/mentoria/performance" },
  },
};
