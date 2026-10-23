const { chromium } = require("../packages/web/node_modules/@playwright/test");
const { readFileSync } = require("node:fs");

const env = Object.fromEntries(readFileSync("packages/web/.env.local", "utf8").split(/\r?\n/).filter((line) => /^[A-Z0-9_]+=/.test(line)).map((line) => {
  const index = line.indexOf("=");
  return [line.slice(0, index), line.slice(index + 1)];
}));
const email = `qa-lab-waitlist-check+${Date.now()}@example.com`;
const rest = `${env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/mentorship_waitlist_leads`;
const headers = { apikey: env.SUPABASE_SERVICE_ROLE_KEY, Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}` };

(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage();
    await page.goto("http://localhost:3002/mentoria/lista-de-interesse", { waitUntil: "networkidle" });
    await page.getByLabel("Seu nome").fill("Teste QA Lab");
    await page.getByLabel("Seu e-mail").fill(email);
    await page.getByRole("checkbox").check();
    const response = page.waitForResponse((res) => res.url().endsWith("/api/v1/mentorship/waitlist") && res.request().method() === "POST");
    await page.getByRole("button", { name: "Entrar na lista" }).click();
    const result = await response;
    await page.getByRole("status").getByText("Você está na lista.").waitFor();
    console.log(`form_status=${result.status()}`);
    const query = await fetch(`${rest}?select=id,email&email=eq.${encodeURIComponent(email)}`, { headers });
    const rows = await query.json();
    if (!query.ok || rows.length !== 1) throw new Error(`Leitura do banco falhou: ${query.status}`);
    console.log("database_record=confirmed");
    const cleanup = await fetch(`${rest}?id=eq.${encodeURIComponent(rows[0].id)}`, { method: "DELETE", headers: { ...headers, Prefer: "return=representation" } });
    const removed = await cleanup.json();
    if (!cleanup.ok || removed.length !== 1) throw new Error(`Limpeza do contato de teste falhou: ${cleanup.status}`);
    console.log("test_record=removed");

    const autofillEmail = `qa-lab-waitlist-autofill+${Date.now()}@example.com`;
    const autofillResult = await page.evaluate(async ({ autofillEmail }) => {
      const response = await fetch("/api/v1/mentorship/waitlist", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ fullName: "Teste Autofill", email: autofillEmail, acceptedContact: true, website: "autofilled.example" }),
      });
      return { status: response.status, body: await response.json() };
    }, { autofillEmail });
    if (autofillResult.status !== 201 || autofillResult.body?.data?.registered !== true) throw new Error(`Resposta inesperada no caso autofill: ${autofillResult.status}`);
    const autofillQuery = await fetch(`${rest}?select=id,email&email=eq.${encodeURIComponent(autofillEmail)}`, { headers });
    const autofillRows = await autofillQuery.json();
    if (!autofillQuery.ok || autofillRows.length !== 1) throw new Error(`Cadastro autofill não foi persistido: ${autofillQuery.status}`);
    console.log("autofill_record=confirmed");
    const autofillCleanup = await fetch(`${rest}?id=eq.${encodeURIComponent(autofillRows[0].id)}`, { method: "DELETE", headers: { ...headers, Prefer: "return=representation" } });
    if (!autofillCleanup.ok) throw new Error(`Limpeza do contato autofill falhou: ${autofillCleanup.status}`);
    console.log("autofill_test_record=removed");
  } finally {
    await browser.close();
  }
})().catch((error) => { console.error(error); process.exitCode = 1; });
