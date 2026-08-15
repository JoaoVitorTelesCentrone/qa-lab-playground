export type LogCause = "config" | "database" | "auth" | "dependency" | "deploy" | "data";
export type IncidentAction = "rollback" | "hotfix" | "scale" | "feature_flag" | "investigate_more";

export type LogIncident = {
  id: string;
  title: string;
  context: string;
  logs: string[];
  metrics: string[];
  userReports: string[];
  expectedCause: LogCause;
  expectedAction: IncidentAction;
  blastRadius: "baixo" | "medio" | "alto";
};

export type LogInvestigationReview = {
  cause: LogCause;
  action: IncidentAction;
  hypothesis: string;
  evidence: string;
  nextChecks: string;
  communication: string;
};

const causes: LogCause[] = ["config", "database", "auth", "dependency", "deploy", "data"];
const services = ["payments-api", "expense-service", "auth-gateway", "report-worker", "notification-api", "checkout-bff", "audit-log", "export-service"];

function pick<T>(items: T[], index: number) { return items[index % items.length]; }

function buildLogs(service: string, cause: LogCause, index: number) {
  const base = [`2026-07-02T14:${String(index % 60).padStart(2, "0")}:01Z ${service} request_id=req_${1000 + index} level=info msg="request started"`];
  const byCause: Record<LogCause, string[]> = {
    config: [`level=error msg="missing env PAYMENT_PROVIDER_KEY"`, `level=error msg="startup validation failed"`],
    database: [`level=warn msg="connection pool exhausted" active=50 idle=0`, `level=error msg="query timeout after 30000ms"`],
    auth: [`level=warn msg="jwt audience mismatch"`, `level=error msg="token rejected" status=401`],
    dependency: [`level=error msg="upstream billing timeout" duration_ms=12000`, `level=warn msg="circuit breaker open"`],
    deploy: [`level=error msg="cannot find migration column approved_by"`, `level=error msg="new version crash loop" version=2.${index % 9}.0`],
    data: [`level=error msg="invalid state transition approved -> draft"`, `level=warn msg="duplicate external_id detected"`],
  };
  return [...base, ...byCause[cause], `level=info msg="request finished" status=${cause === "auth" ? 401 : 500}`];
}

export const logIncidents: LogIncident[] = Array.from({ length: 160 }, (_, index) => {
  const cause = pick(causes, index);
  const service = pick(services, index * 2);
  return {
    id: `LOG-${String(index + 1).padStart(3, "0")}`,
    title: `${service} com aumento de falhas`,
    context: `Depois da ultima mudanca, ${service} passou a gerar erros em parte do fluxo. Produto quer saber se deve bloquear release, reverter ou mitigar.`,
    logs: buildLogs(service, cause, index),
    metrics: [`erro 5xx: ${cause === "auth" ? 3 : 18 + (index % 30)}%`, `p95 latency: ${400 + index * 13}ms`, `usuarios afetados estimados: ${20 + index * 7}`],
    userReports: [`Suporte reportou ${1 + (index % 8)} chamados relacionados.`, index % 2 === 0 ? "Clientes enterprise afetados." : "Afeta principalmente ambiente mobile."],
    expectedCause: cause,
    expectedAction: cause === "deploy" ? "rollback" : cause === "config" ? "hotfix" : cause === "database" ? "scale" : cause === "dependency" ? "feature_flag" : "investigate_more",
    blastRadius: index % 5 === 0 ? "alto" : index % 2 === 0 ? "medio" : "baixo",
  };
});

export function getLogIncident(id: string) { return logIncidents.find((item) => item.id === id) ?? null; }

export function scoreLogInvestigation(incident: LogIncident, review: LogInvestigationReview) {
  let score = 0;
  if (review.cause === incident.expectedCause) score += 25;
  if (review.action === incident.expectedAction) score += 20;
  if (review.hypothesis.trim().length >= 80) score += 15;
  if (review.evidence.trim().length >= 80) score += 15;
  if (review.nextChecks.trim().length >= 50) score += 10;
  if (review.communication.trim().length >= 80) score += 15;
  return { score, ready: score >= 75, expected: { cause: incident.expectedCause, action: incident.expectedAction } };
}

export function buildLogInvestigationDraft(incident: LogIncident, review: LogInvestigationReview) {
  const result = scoreLogInvestigation(incident, review);
  return {
    title: `Investigacao - ${incident.id} - ${incident.title}`.slice(0, 120),
    content: [
      `# Investigacao ${incident.id}`,
      "",
      `**Score:** ${result.score}/100`,
      `**Causa provavel:** ${review.cause}`,
      `**Acao recomendada:** ${review.action}`,
      `**Raio de impacto:** ${incident.blastRadius}`,
      "",
      "## Contexto",
      incident.context,
      "",
      "## Logs usados",
      "```",
      ...incident.logs,
      "```",
      "",
      "## Hipotese",
      review.hypothesis,
      "",
      "## Evidencia",
      review.evidence,
      "",
      "## Proximas verificacoes",
      review.nextChecks,
      "",
      "## Comunicacao",
      review.communication,
    ].join("\n"),
  };
}