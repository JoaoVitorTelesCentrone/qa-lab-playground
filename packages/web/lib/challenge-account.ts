import { ciGates, type ChallengeDeliverables, type CiGateStatus } from "./challenge-deliverables";

export const CHALLENGE_KIND = "expenseflow-challenge-v1";

function record(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function text(value: unknown, limit = 4000): value is string {
  return typeof value === "string" && value.length <= limit;
}

function validList(value: unknown, fields: string[], choices: Record<string, string[]> = {}) {
  return Array.isArray(value) && value.length <= 100 && value.every((item) =>
    record(item) && fields.every((field) => text(item[field]) && (!choices[field] || choices[field].includes(item[field]))),
  );
}

export function validChallengeDeliverables(value: unknown): value is ChallengeDeliverables {
  if (!record(value)) return false;
  if (!validList(value.bugs, ["id", "title", "steps", "actual", "expected", "severity"], { severity: ["Baixa", "Média", "Alta", "Crítica"] })) return false;
  if (!(value.bugs as Record<string, unknown>[]).every((bug) => bug.evidence === undefined || text(bug.evidence))) return false;
  if (!validList(value.bdd, ["id", "feature", "title", "given", "when", "then"])) return false;
  if (!validList(value.e2e, ["id", "flow", "priority", "decision", "reason", "assertions"], { priority: ["Baixa", "Média", "Alta"], decision: ["Automatizar", "Manter manual"] })) return false;
  if (value.release == null) return true;
  const release = value.release;
  if (!record(release) || !["Liberar", "Liberar com ressalvas", "Bloquear"].includes(String(release.decision))) return false;
  if (!["rationale", "residualRisk", "monitoring"].every((field) => text(release[field]))) return false;
  const gates = release.gates;
  return record(gates) && ciGates.every((gate) => ["passed", "failed", "not-run"].includes(gates[gate] as CiGateStatus));
}
