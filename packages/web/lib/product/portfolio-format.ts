// Formato do portfólio de evidências.
//
// Só funções puras: o painel do perfil é client component e importa daqui, sem
// arrastar o acesso ao banco para o bundle do navegador.

import { labLabel, labs } from "@/lib/playground/catalog";
import { systemChallenges } from "@/lib/system-challenges";
import type { Severity } from "./evaluation";
import type { Submission } from "./journey";

export type PortfolioEntry = Submission & {
  labTitle: string;
  labNumber: number;
  /** O número que o aluno lê ("01"), pela ordem de lançamento. */
  labLabel: string;
  labArea: string;
  /** "fluxo" valida o caminho feliz; "investigacao" caça o defeito plantado. */
  labMode: "fluxo" | "investigacao";
  /** Onde o trabalho foi feito. É o nível "projeto" do portfólio. */
  projectId: string;
};

/** Evidência + dados do Lab, no formato que a página e a exportação usam. */
export function toEntries(submissions: Submission[]): PortfolioEntry[] {
  return submissions.flatMap((submission) => {
    const lab = labs.find((item) => item.slug === submission.labSlug);
    const challenge = systemChallenges.find((item) => item.id === submission.labSlug);
    if (!lab || !challenge) return [];
    return [{
      ...submission,
      labTitle: lab.title,
      labNumber: lab.number,
      labLabel: labLabel(lab),
      labArea: lab.requiredFeature,
      labMode: challenge.mode,
      projectId: projectIdForArea(challenge.area),
    }];
  });
}

/**
 * A qual ambiente a área do desafio pertence. A loja nasceu antes dos ambientes
 * de prática e por isso tem várias áreas ("Catalogo", "Checkout", "Pedidos"…);
 * todas são o mesmo sistema testado, então viram um projeto só.
 */
export function projectIdForArea(area: string): string {
  const direct: Record<string, string> = { Financas: "financas", Agendamentos: "agendamentos", CRM: "crm" };
  return direct[area] ?? "qa-lab";
}

const severityOrder: Severity[] = ["critica", "alta", "media", "baixa"];

export function countBySeverity(entries: Array<{ severity: Severity }>) {
  return severityOrder
    .map((severity) => ({ severity, total: entries.filter((entry) => entry.severity === severity).length }))
    .filter((item) => item.total > 0);
}

/**
 * Passos de reprodução como lista. O aluno costuma numerar à mão ao escrever,
 * então tiramos a numeração dele antes de renumerar — senão sai "1. 1. Abrir".
 */
export function reproductionSteps(reproduction: string) {
  return reproduction
    .split(/\r?\n/)
    .map((line) => line.trim().replace(/^(\d+[.)]|[-*•])\s*/, "").trim())
    .filter(Boolean);
}

/**
 * Primeira frase de um texto livre — a manchete da evidência, usada no card do
 * portfólio e no post. Frase muito curta não diz nada sozinha, então nesse caso
 * o texto inteiro é usado (cortado no limite).
 */
export function summarize(text: string, max = 180) {
  const clean = text.trim().replace(/\s+/g, " ");
  const first = clean.split(/(?<=[.!?])\s/)[0] ?? clean;
  const chosen = first.length >= 40 ? first : clean;
  return chosen.length <= max ? chosen : `${chosen.slice(0, max - 1).trimEnd()}…`;
}

/** O que sobra do texto depois da manchete — o corpo curto do card. */
export function summaryRest(text: string) {
  const clean = text.trim().replace(/\s+/g, " ");
  const head = summarize(clean, Number.MAX_SAFE_INTEGER);
  return clean.startsWith(head) ? clean.slice(head.length).trim() : "";
}

/** Entregas em Markdown, para o aluno levar o histórico para fora do produto. */
export function toMarkdown(entries: PortfolioEntry[], { name }: { name: string }) {
  const header = [`# Evidências de QA — ${name}`, "", `${entries.length} evidência(s) registrada(s) em ${new Set(entries.map((entry) => entry.labSlug)).size} Lab(s).`, ""];

  const body = entries.map((entry) => [
    `## Lab ${entry.labLabel} — ${entry.labTitle}`,
    "",
    `- **Severidade:** ${entry.severity}`,
    `- **Registrada em:** ${new Date(entry.createdAt).toLocaleDateString("pt-BR")}`,
    "",
    "### Resultado observado",
    "",
    entry.result,
    "",
    "### Passos de reprodução",
    "",
    ...reproductionSteps(entry.reproduction).map((step, index) => `${index + 1}. ${step}`),
    "",
    ...(entry.checklist.length > 0 ? ["### Critérios confirmados", "", ...entry.checklist.map((item) => `- [x] ${item}`), ""] : []),
  ].join("\n"));

  return [...header, ...body].join("\n");
}
