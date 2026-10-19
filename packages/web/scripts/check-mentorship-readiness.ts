import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const baseUrl = process.env.MENTORSHIP_CHECK_BASE_URL || process.env.NEXT_PUBLIC_SITE_URL;

if (!url || !anonKey || !serviceKey) {
  console.error("FAIL env: configure NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY e SUPABASE_SERVICE_ROLE_KEY.");
  process.exit(1);
}

const service = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
const anonymous = createClient(url, anonKey, { auth: { persistSession: false, autoRefreshToken: false } });
const tables = [
  "mentorship_staff", "mentorship_cohorts", "mentorship_cohort_staff", "mentorship_enrollments",
  "mentorship_lesson_progress", "mentorship_live_sessions", "mentorship_attendance", "mentorship_submissions",
  "mentorship_reviews", "mentorship_weekly_commitments", "mentorship_portfolio_cases", "mentorship_notifications",
  "mentorship_lesson_content", "mentorship_certificates", "mentorship_email_outbox",
];
let failed = false;

function result(label: string, passed: boolean, detail = "") {
  console.log(`${passed ? "PASS" : "FAIL"} ${label}${detail ? ` — ${detail}` : ""}`);
  if (!passed) failed = true;
}

try {
  const response = await fetch(`${url}/auth/v1/health`, { headers: { apikey: anonKey }, signal: AbortSignal.timeout(10_000) });
  result("Supabase Auth", response.ok, `HTTP ${response.status}`);
} catch (error) {
  result("Supabase Auth", false, error instanceof Error ? error.name : "erro de rede");
}

const adminCheck = await service.auth.admin.listUsers({ page: 1, perPage: 1 });
result("service role no servidor", !adminCheck.error, adminCheck.error?.name);

for (const table of tables) {
  const { error } = await service.from(table).select("*", { head: true, count: "exact" });
  result(`tabela ${table}`, !error, error?.code);
}

const privateRead = await anonymous.from("mentorship_cohorts").select("id").limit(1);
result("tabela privada bloqueada para anon", Boolean(privateRead.error), privateRead.error?.code ?? "consulta anônima aceita");

const publicRead = await anonymous.from("mentorship_portfolio_cases").select("id").limit(1);
result("portfólio público acessível sob RLS", !publicRead.error, publicRead.error?.code);

const emailEnabled = process.env.MENTORSHIP_EMAIL_ENABLED === "true";
const emailReady = Boolean(process.env.MENTORSHIP_FROM_EMAIL && process.env.RESEND_API_KEY && process.env.CRON_SECRET);
console.log(`${emailEnabled && emailReady ? "PASS" : "WARN"} e-mail transacional — ${emailEnabled ? (emailReady ? "configurado" : "flag ligada com credenciais incompletas") : "desabilitado até validar domínio e destinatários"}`);
if (emailEnabled && !emailReady) failed = true;

if (baseUrl) {
  const checks = [
    ["/mentoria", [200]], ["/mentoria/conteudo", [200]], ["/conteudo", [200]], ["/conteudo/modulos/produto-risco", [200]], ["/conteudo/modulos/produto-risco/produto-jornada", [200]], ["/cadastro", [200]], ["/login", [200]],
    ["/mentoria/labs/requisitos", [200]], ["/mentoria/labs/oraculo", [200]], ["/mentoria/labs/incidente", [200]],
    ["/mentoria/app", [301, 302, 303, 307, 308]], ["/api/v1/mentorship/notifications/example/read", [401]],
  ] as const;
  for (const [path, expected] of checks) {
    try {
      const response = await fetch(new URL(path, baseUrl), { redirect: "manual", signal: AbortSignal.timeout(15_000) });
      result(`rota ${path}`, (expected as readonly number[]).includes(response.status), `HTTP ${response.status}`);
    } catch (error) {
      result(`rota ${path}`, false, error instanceof Error ? error.name : "erro de rede");
    }
  }
} else console.log("WARN rotas web — configure MENTORSHIP_CHECK_BASE_URL ou NEXT_PUBLIC_SITE_URL");

if (failed) process.exit(1);
console.log("\nHomologação técnica básica aprovada. Execute ainda a jornada com aluno, mentor e admin antes de abrir a turma.");
