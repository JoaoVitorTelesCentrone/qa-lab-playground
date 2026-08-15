// Formato do portfólio de evidências.
//
// Só funções puras: o painel do perfil é client component e importa daqui, sem
// arrastar o acesso ao banco para o bundle do navegador.

import { labs } from "@/lib/playground/catalog";
import type { Severity } from "./evaluation";
import type { Submission } from "./journey";

export type PortfolioEntry = Submission & {
  labTitle: string;
  labNumber: number;
  labArea: string;
};

/** Evidência + dados do Lab, no formato que a página e a exportação usam. */
export function toEntries(submissions: Submission[]): PortfolioEntry[] {
  return submissions.flatMap((submission) => {
    const lab = labs.find((item) => item.slug === submission.labSlug);
    return lab ? [{ ...submission, labTitle: lab.title, labNumber: lab.number, labArea: lab.requiredFeature }] : [];
  });
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

/** Entregas em Markdown, para o aluno levar o histórico para fora do produto. */
export function toMarkdown(entries: PortfolioEntry[], { name }: { name: string }) {
  const header = [`# Evidências de QA — ${name}`, "", `${entries.length} evidência(s) registrada(s) em ${new Set(entries.map((entry) => entry.labSlug)).size} Lab(s).`, ""];

  const body = entries.map((entry) => [
    `## Lab ${String(entry.labNumber).padStart(2, "0")} — ${entry.labTitle}`,
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
