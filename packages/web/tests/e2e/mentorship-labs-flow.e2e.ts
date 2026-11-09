import { expect, test } from "@playwright/test";
import { mentorshipPathV2, pathV2ChapterHref } from "../../lib/mentorship/path-v2";
import { labsForChapter, lessonForLab } from "../../lib/mentorship/lesson-labs";

// Fluxo público (sem login): aula → Lab → rascunho → pedido de login que preserva
// a volta. O fluxo autenticado até a conclusão exige o banco local e fica em
// mentorship-v2.e2e.ts (bun run test:e2e:mentorship).

const firstModule = mentorshipPathV2[0];
const firstChapter = firstModule.chapters[0];
const chapterUrl = pathV2ChapterHref(firstModule, firstChapter);

test("@smoke capítulo mostra os Labs de cada aula e leva ao Lab certo", async ({ page }) => {
  await page.goto(chapterUrl);
  const main = page.locator("main");
  for (const number of labsForChapter(firstChapter)) {
    // Os Labs ficam dentro de cada aula; as aulas fechadas também os têm no DOM.
    await expect(main.locator(`a[href="/labs/${number}"]`).first()).toBeAttached();
  }
  // A prática não é mais uma frase marcada num botão: não há "marcar como feita".
  await expect(main.getByRole("button", { name: /marcar (como )?feit/i })).toHaveCount(0);

  const first = labsForChapter(firstChapter)[0];
  await main.locator(`a[href="/labs/${first}"]`).first().click();
  await expect(page).toHaveURL(new RegExp(`/labs/${first}/?$`));
});

test("@smoke Lab público mostra a aula da mentoria e as três etapas", async ({ page }) => {
  const placement = lessonForLab(101)!;
  await page.goto("/labs/101");
  await expect(page.getByText(`prática da aula “${placement.lessonTitle}”`)).toBeVisible();
  await expect(page.getByRole("link", { name: "Conhecer a mentoria" })).toHaveAttribute("href", "/mentoria");
  for (const name of [/^Etapa 1: Preparar/, /^Etapa 2: Testar/, /^Etapa 3: Entregar/]) {
    await expect(page.getByRole("button", { name })).toBeVisible();
  }
});

test("@smoke entrega anônima guarda o rascunho e pede login com volta ao Lab", async ({ page }) => {
  await page.goto("/labs/101?etapa=entregar");
  await page.getByLabel("O que você fez").fill("Criei um pensamento fictício e procurei por ele depois de recarregar a página.");
  await page.getByLabel("O que você esperava").fill("Encontrar o mesmo pensamento, com o mesmo texto.");
  await page.getByLabel("O que aconteceu").fill("O pensamento apareceu na busca com o texto original e a data correta.");
  await page.getByText("Funciona como esperado", { exact: true }).click();
  await page.getByRole("button", { name: "Entregar evidência" }).click();

  const alert = page.getByRole("alert").filter({ hasText: "entre na sua conta" });
  await expect(alert).toBeVisible();
  const login = alert.getByRole("link", { name: "Já tenho conta" });
  await expect(login).toHaveAttribute("href", `/login?next=${encodeURIComponent("/labs/101?etapa=entregar")}`);

  // O rascunho sobrevive ao recarregamento: quem volta do login não perde o texto.
  await page.reload();
  await expect(page.getByLabel("O que aconteceu")).toHaveValue(/apareceu na busca/);
});

test("@smoke API recusa entrega anônima mesmo com os quatro campos", async ({ request }) => {
  const evidence = "## O que fiz\nPassos.\n## O que esperava\nRegra.\n## O que aconteceu\nResultado observado.\n## Conclusão\nComportamento esperado";
  const response = await request.post("/api/v1/submissions", { data: { labSlug: "desafio-101", evidence } });
  expect(response.status()).toBe(401);
});
