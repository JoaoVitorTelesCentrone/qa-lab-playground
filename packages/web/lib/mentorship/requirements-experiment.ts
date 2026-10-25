export const requirementsExperiment = {
  id: "requirements-clarity",
  version: "2.0",
  rubricVersion: "1.0",
  seed: "broto-thought-action-01",
  brief: "No cenário didático do BrotoSpace, a pessoa pode transformar um pensamento próprio em uma próxima ação. Entradas inválidas devem ser recusadas.",
  rules: [
    "R1 — Somente a pessoa autora pode transformar seu pensamento em ação; outra conta não pode ler nem alterar o registro privado.",
    "R2 — Neste exercício, o título da ação deve conter de 1 a 100 caracteres após remover espaços nas pontas. Esse limite é sintético e não descreve uma regra confirmada do produto.",
    "R3 — Neste exercício, cada pensamento origina no máximo uma ação. Repetir a transformação deve retomar a mesma ação sem duplicá-la.",
    "R4 — Uma tentativa recusada preserva pensamento e vínculos e informa o motivo. Uma transformação válida conserva a referência ao pensamento de origem após recarga.",
  ],
} as const;

export type ExperimentResponse = { questions: string; scenarios: string };
export type RequirementsAttempt = {
  version: typeof requirementsExperiment.version;
  startedAt: string;
  baseline: ExperimentResponse | null;
  initial: ExperimentResponse;
  revised: ExperimentResponse;
  conclusion: string;
};

export function createRequirementsAttempt(): RequirementsAttempt {
  return { version: requirementsExperiment.version, startedAt: new Date().toISOString(), baseline: null, initial: { questions: "", scenarios: "" }, revised: { questions: "", scenarios: "" }, conclusion: "" };
}

export function hasResponse(response: ExperimentResponse) {
  return response.questions.trim().length >= 10 && response.scenarios.trim().length >= 20;
}

export function revealRequirements(attempt: RequirementsAttempt): RequirementsAttempt {
  if (attempt.baseline || !hasResponse(attempt.initial)) return attempt;
  return { ...attempt, baseline: { ...attempt.initial }, revised: { ...attempt.initial } };
}

export function canExportRequirements(attempt: RequirementsAttempt) {
  return Boolean(attempt.baseline && hasResponse(attempt.revised) && attempt.conclusion.trim().length >= 30);
}

export function parseRequirementsDraft(raw: string): RequirementsAttempt | null {
  try {
    const value = JSON.parse(raw);
    const response = (item: unknown): item is ExperimentResponse => {
      if (!item || typeof item !== "object") return false;
      const r = item as ExperimentResponse;
      return typeof r.questions === "string" && r.questions.length <= 12000 && typeof r.scenarios === "string" && r.scenarios.length <= 12000;
    };
    if (!value || value.version !== requirementsExperiment.version || typeof value.startedAt !== "string" || !Number.isFinite(Date.parse(value.startedAt)) || !response(value.initial) || !response(value.revised) || !(value.baseline === null || (response(value.baseline) && hasResponse(value.baseline))) || typeof value.conclusion !== "string" || value.conclusion.length > 12000) return null;
    return { version: value.version, startedAt: value.startedAt, initial: value.initial, revised: value.revised, baseline: value.baseline, conclusion: value.conclusion };
  } catch { return null; }
}

export function exportRequirementsMarkdown(attempt: RequirementsAttempt) {
  if (!canExportRequirements(attempt) || !attempt.baseline) throw new Error("Complete as duas respostas e a conclusão antes de exportar.");
  return [
    "# Experimento: uma história, duas interpretações", "",
    `Lab: ${requirementsExperiment.id} | Cenário: ${requirementsExperiment.version} | Rubrica: ${requirementsExperiment.rubricVersion} | Seed: ${requirementsExperiment.seed}`,
    `Início: ${attempt.startedAt}`, "",
    "Adaptação didática inspirada no BrotoSpace, com regras sintéticas próprias do exercício. Respostas declaradas pelo aluno; não constituem execução no produto nem replicação de um artigo.", "",
    "## História inicial", requirementsExperiment.brief, "",
    "## Antes do esclarecimento", "### Perguntas e hipóteses", attempt.baseline.questions, "### Cenários e resultados esperados", attempt.baseline.scenarios, "",
    "## Critérios esclarecidos", ...requirementsExperiment.rules.map(rule => `- ${rule}`), "",
    "## Depois do esclarecimento", "### Perguntas resolvidas e dúvidas restantes", attempt.revised.questions, "### Cenários ligados às regras", attempt.revised.scenarios, "",
    "## Comparação e limites", attempt.conclusion, "",
    "## Revisão do mentor", "- Distingue regra, hipótese e dúvida.", "- Cobre tamanho de texto, autoria, duplicação e preservação do vínculo.", "- Resultados esperados citam R1–R4 e são observáveis.", "- Explica mudanças e limitações sem inferir causalidade de uma única tentativa.", "",
    "Fonte de inspiração: https://doi.org/10.15282/ijsecs.12.1.2026.1.0147", "",
  ].join("\n");
}
