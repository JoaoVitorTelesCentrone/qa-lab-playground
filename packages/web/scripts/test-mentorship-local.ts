import { cp, mkdir, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";

const web = fileURLToPath(new URL("../", import.meta.url));
const root = resolve(web, "../..");
const local = resolve(root, ".tmp/mentorship-local");
const cli = ["bunx", "supabase@2.122.0"];
// Bun loads .env.local; explicitly override its remote project ID for every CLI call.
const localProcessEnv = { ...process.env, SUPABASE_PROJECT_ID: "qa-lab-mentorship-tests" };

async function run(command: string[], env: Record<string, string | undefined> = localProcessEnv, capture = false) {
  const processHandle = Bun.spawn(command, { cwd: web, env, stdout: capture ? "pipe" : "inherit", stderr: capture ? "pipe" : "inherit" });
  if (!capture) {
    if (await processHandle.exited !== 0) throw new Error(`Command failed: ${command[0]} ${command[1]}`);
    return "";
  }
  const [output, error, code] = await Promise.all([new Response(processHandle.stdout).text(), new Response(processHandle.stderr).text(), processHandle.exited]);
  if (code !== 0) throw new Error(`Local Supabase command failed: ${error.slice(-3000)}`);
  return output;
}

await mkdir(resolve(local, "supabase"), { recursive: true });
const config = await readFile(resolve(web, "supabase/config.toml"), "utf8");
if (!config.includes('project_id = "qa-lab-mentorship-tests"')) throw new Error("Unexpected local test project; refusing to continue.");
await Bun.write(resolve(local, "supabase/config.toml"), config);
await cp(resolve(web, "supabase/migrations"), resolve(local, "supabase/migrations"), { recursive: true });

if (!process.argv.includes("--running")) {
  console.log("Starting isolated Supabase; migration output is captured to avoid printing local credentials.");
  await run([...cli, "start", "--workdir", local, "--exclude", "realtime,studio,postgres-meta,edge-runtime,logflare,vector,supavisor,imgproxy"], localProcessEnv, true);
}
const statusOutput = await run([...cli, "status", "--workdir", local, "--output", "json"], localProcessEnv, true);
const status = JSON.parse(statusOutput.slice(statusOutput.indexOf("{"))) as Record<string, string>;
if (!status.API_URL || new URL(status.API_URL).hostname !== "127.0.0.1" || new URL(status.API_URL).port !== "58421") throw new Error("Tests require the dedicated loopback Supabase instance on 58421.");
if (!status.DB_URL?.includes("127.0.0.1:58422/")) throw new Error("Unexpected database URL; refusing mutation.");
// Provider boundary only: Auth, routes, reservations, webhook signature and
// reconciliation all run normally against the isolated Supabase.
const preferences = new Map<string, { amount: number; currency: string }>();
const paymentStatuses = new Map<string, string>();
const emailIds = new Set<string>();
const gateway = Bun.serve({ hostname: "127.0.0.1", port: 0, async fetch(request) {
  const url = new URL(request.url);
  if (request.method === "POST" && url.pathname === "/emails") {
    const id = request.headers.get("Idempotency-Key");
    if (!id) return Response.json({ error: "missing idempotency key" }, { status: 422 });
    emailIds.add(id);
    return Response.json({ id });
  }
  if (request.method === "POST" && url.pathname === "/test/payments") {
    const body = await request.json() as { id: string; status: string };
    paymentStatuses.set(body.id, body.status);
    return Response.json({ ok: true });
  }
  if (request.method === "POST" && url.pathname === "/checkout/preferences") {
    const body = await request.json() as { external_reference: string; items: Array<{ unit_price: number; currency_id: string }> };
    preferences.set(body.external_reference, { amount: body.items[0].unit_price, currency: body.items[0].currency_id });
    return Response.json({ id: `local-${body.external_reference}`, init_point: `https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=local-${body.external_reference}` });
  }
  if (url.pathname.startsWith("/v1/payments/")) {
    const id = decodeURIComponent(url.pathname.split("/").at(-1)!);
    const status = paymentStatuses.get(id) ?? "pending";
    const preference = preferences.get(id);
    if (!preference) return Response.json({ error: "unknown payment" }, { status: 404 });
    return Response.json({ id, external_reference: id, status: status === "wrong-amount" ? "approved" : status, transaction_amount: status === "wrong-amount" ? 1 : preference.amount, currency_id: preference.currency, collector_id: 999999 });
  }
  return new Response("Not found", { status: 404 });
} });
const env: Record<string, string | undefined> = {
  ...localProcessEnv,
  NEXT_PUBLIC_SUPABASE_URL: status.API_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: status.ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY: status.SERVICE_ROLE_KEY,
  NEXT_PUBLIC_SITE_URL: "http://127.0.0.1:3180",
  MENTORSHIP_E2E_LOCAL: "true",
  MENTORSHIP_E2E_REQUIRED: "true",
  MENTORSHIP_EMAIL_ENABLED: "true",
  MENTORSHIP_FROM_EMAIL: "QA Local <qa@example.test>",
  RESEND_API_KEY: "re_local_test_gateway",
  QALAB_TEST_RESEND_URL: gateway.url.origin,
  QALAB_ADMIN_EMAILS: "",
  QALAB_TOKEN_SECRET: "qa-local-tests-only-token-secret",
  CRON_SECRET: "qa-local-tests-only-cron-secret",
  PLAYWRIGHT_LOCAL_PORT: "3180",
  PLAYWRIGHT_BASE_URL: "",
  QALAB_TEST_MERCADO_PAGO_URL: gateway.url.origin,
  MERCADO_PAGO_ACCESS_TOKEN: "TEST-local-provider-boundary",
  MERCADO_PAGO_WEBHOOK_SECRET: "qa-local-webhook-secret",
  MERCADO_PAGO_COLLECTOR_ID: "999999",
};

try {
  await run([...cli, "migration", "up", "--local", "--workdir", local], env);
  await run([...cli, "test", "db", "--workdir", local, resolve(web, "supabase/tests/mentorship_hardening.test.sql"), resolve(web, "supabase/tests/mentorship_isolation.test.sql"), resolve(web, "supabase/tests/payment_reconciliation.test.sql"), resolve(web, "supabase/tests/acquisition_attribution.test.sql")], env);
  if (!process.argv.includes("--no-build")) await run(["bun", "run", "build"], env);
  await run(["bunx", "playwright", "test", "tests/e2e/mentorship-v2.e2e.ts", "tests/e2e/mentorship-staging.e2e.ts", "--grep", "mentoria v2:|catálogo v2|landing apresenta|area do aluno", "--workers=1"], env);
} finally { gateway.stop(true); }
