import { expect, test, type Locator, type Page } from "@playwright/test";

// Ambiente de pratica Financas: as duas colunas de lancamentos.
//
// Roda deslogado de proposito. Sem conta o ambiente recarrega a massa inicial
// a cada visita (persist: false), entao cada teste comeca do mesmo estado e
// nao precisa de limpeza. O caminho persistido, com login, ainda nao tem
// cobertura -- depende de uma conta de teste.
//
// Os seletores saem de papel e rotulo, nao de testid: o formulario e a tabela
// vem de componentes compartilhados (ResourceForm, Table) e o que interessa
// verificar e o que o usuario alcanca.

const coluna = (page: Page, nome: "Despesas" | "Receitas") =>
  page.locator("section").filter({ has: page.getByRole("heading", { name: nome, exact: true }) });

const linhas = (col: Locator) => col.locator("tbody tr");

/** "R$ 5.501,80" -> 5501.8 */
function valor(texto: string) {
  const limpo = texto.replace(/[^\d,-]/g, "").replace(/\./g, "").replace(",", ".");
  return Number(limpo);
}

async function abrirAmbiente(page: Page) {
  await page.goto("/financas");
  await expect(page.getByRole("heading", { name: "Despesas", exact: true })).toBeVisible();
}

async function criar(col: Locator, botao: RegExp, enviar: RegExp, dados: { descricao: string; valor: string; categoria: string }) {
  await col.getByRole("button", { name: botao }).click();
  await col.getByLabel("Descrição").fill(dados.descricao);
  await col.getByLabel("Valor").fill(dados.valor);
  await col.getByLabel("Categoria").fill(dados.categoria);
  await col.getByRole("button", { name: enviar }).click();
}

test("cada coluna lista so o proprio tipo de lancamento", async ({ page }) => {
  await abrirAmbiente(page);

  // A massa inicial tem 4 despesas e 2 receitas.
  await expect(linhas(coluna(page, "Despesas"))).toHaveCount(4);
  await expect(linhas(coluna(page, "Receitas"))).toHaveCount(2);

  // O sinal e a unica marca de tipo na linha: despesa sai negativa, receita
  // positiva. Uma linha com o sinal errado significa filtro trocado.
  for (const texto of await linhas(coluna(page, "Despesas")).allInnerTexts()) expect(texto).toContain("−");
  for (const texto of await linhas(coluna(page, "Receitas")).allInnerTexts()) expect(texto).toContain("+");

  await expect(coluna(page, "Despesas").getByText("Aluguel")).toBeVisible();
  await expect(coluna(page, "Receitas").getByText("Salário")).toBeVisible();
});

test("cria despesa e ela fica so na coluna da esquerda", async ({ page }) => {
  await abrirAmbiente(page);
  const despesas = coluna(page, "Despesas");
  const receitas = coluna(page, "Receitas");

  await criar(despesas, /Nova despesa/, /Adicionar despesa/, { descricao: "Licenca de ferramenta", valor: "320", categoria: "Software" });

  await expect(linhas(despesas)).toHaveCount(5);
  await expect(despesas.getByText("Licenca de ferramenta")).toBeVisible();
  // O `kind` do formulario vem de um default fora da tela: se ele nao for
  // enviado, o lancamento nao e criado; se for enviado errado, aparece aqui.
  await expect(receitas.getByText("Licenca de ferramenta")).toHaveCount(0);
  await expect(linhas(receitas)).toHaveCount(2);
});

test("cria receita e ela fica so na coluna da direita", async ({ page }) => {
  await abrirAmbiente(page);
  const despesas = coluna(page, "Despesas");
  const receitas = coluna(page, "Receitas");

  await criar(receitas, /Nova receita/, /Adicionar receita/, { descricao: "Consultoria QA", valor: "2500", categoria: "Trabalho" });

  await expect(linhas(receitas)).toHaveCount(3);
  await expect(receitas.getByText("Consultoria QA")).toBeVisible();
  await expect(despesas.getByText("Consultoria QA")).toHaveCount(0);
  await expect(linhas(despesas)).toHaveCount(4);
});

test("edita um lancamento sem trocar de coluna", async ({ page }) => {
  await abrirAmbiente(page);
  const despesas = coluna(page, "Despesas");

  await despesas.getByRole("button", { name: "Editar Mercado" }).click();
  await despesas.getByLabel("Descrição").fill("Mercado do mes");
  await despesas.getByRole("button", { name: "Salvar alterações" }).click();

  await expect(despesas.getByText("Mercado do mes")).toBeVisible();
  await expect(despesas.getByText("Mercado", { exact: true })).toHaveCount(0);
  await expect(linhas(despesas)).toHaveCount(4);
  await expect(linhas(coluna(page, "Receitas"))).toHaveCount(2);
});

test("apaga um lancamento so depois de confirmar", async ({ page }) => {
  await abrirAmbiente(page);
  const receitas = coluna(page, "Receitas");

  await receitas.getByRole("button", { name: "Apagar Freelance" }).click();
  await receitas.getByRole("button", { name: "Cancelar" }).click();
  await expect(linhas(receitas)).toHaveCount(2);

  await receitas.getByRole("button", { name: "Apagar Freelance" }).click();
  await receitas.getByRole("button", { name: "Apagar", exact: true }).click();
  await expect(linhas(receitas)).toHaveCount(1);
  await expect(receitas.getByText("Freelance")).toHaveCount(0);
});

test("saldo do periodo bate com receitas menos despesas", async ({ page }) => {
  await abrirAmbiente(page);

  // O resumo sai de financeSummary(), que e onde os desvios plantados agem --
  // por isso a conferencia e contra os proprios totais exibidos, e nao contra
  // um numero fixo: o teste continua valendo quando a massa muda.
  const ler = async (rotulo: string) =>
    valor(await page.locator("dt, p").filter({ hasText: rotulo }).first().locator("xpath=following-sibling::*[1]").innerText());

  const receitas = await ler("Receitas");
  const despesas = await ler("Despesas");
  const saldo = await ler("Saldo do período");
  expect(saldo).toBeCloseTo(receitas - despesas, 2);

  // E um lancamento novo tem que mexer no total, nao so na tabela.
  await criar(coluna(page, "Receitas"), /Nova receita/, /Adicionar receita/, { descricao: "Mentoria", valor: "1000", categoria: "Trabalho" });
  await expect(page.getByText("Mentoria")).toBeVisible();
  expect(await ler("Receitas")).toBeCloseTo(receitas + 1000, 2);
  expect(await ler("Saldo do período")).toBeCloseTo(saldo + 1000, 2);
});
