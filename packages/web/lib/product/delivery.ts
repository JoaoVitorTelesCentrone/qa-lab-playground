// Entrega estruturada de um Lab: quatro campos curtos no lugar de um texto
// livre, no formato da "nota de evidência" (ação, esperado, observado,
// conclusão).
//
// O banco continua guardando um texto só (`lab_submissions.evidence`): os
// campos são combinados com títulos antes do envio. Assim a entrega nova não
// precisa de migração, o case e o portfólio continuam lendo o mesmo campo e a
// API mantém a mesma regra mínima (`evaluateEvidence`).
//
// As verificações aqui não bloqueiam o envio. Elas mostram o que falta para a
// entrega provar o que o Lab pede; quem decide se aceita é a regra mínima.

export type Conclusion = "falha" | "esperado" | "duvida";
export type Severity = "baixa" | "media" | "alta" | "critica";

export type DeliveryFields = {
  did: string;
  expected: string;
  observed: string;
  conclusion: Conclusion | "";
  severity: Severity | "";
};

export const emptyDelivery: DeliveryFields = { did: "", expected: "", observed: "", conclusion: "", severity: "" };

export const conclusionLabels: Record<Conclusion, string> = {
  falha: "Encontrei uma falha",
  esperado: "Funciona como esperado",
  duvida: "Ficou uma dúvida",
};

export const severityLabels: Record<Severity, string> = { baixa: "Baixa", media: "Média", alta: "Alta", critica: "Crítica" };

export type DeliveryCheck = { id: keyof DeliveryFields; label: string; ok: boolean; missing: string };

export type DeliveryFieldId = keyof DeliveryFields;
export type AcceptanceCoverage = {
  criterion: string;
  fields: DeliveryFieldId[];
  fieldsPresent: boolean;
};

const filled = (value: string, min: number) => value.trim().length >= min;

/** O que a entrega já cobre, campo a campo. Mesma função no formulário e nos testes. */
export function checkDelivery(fields: DeliveryFields, attachments = 0): DeliveryCheck[] {
  return [
    { id: "did", label: "Passos que você executou", ok: filled(fields.did, 20), missing: "Descreva os passos na ordem em que fez" },
    { id: "expected", label: "O que você esperava", ok: filled(fields.expected, 10), missing: "Diga o que esperava ver" },
    { id: "observed", label: "O que aconteceu", ok: filled(fields.observed, 10) || attachments > 0, missing: "Falta o resultado observado" },
    {
      id: "conclusion",
      label: "Sua conclusão",
      ok: fields.conclusion !== "" && (fields.conclusion !== "falha" || fields.severity !== ""),
      missing: fields.conclusion === "falha" ? "Escolha a severidade da falha" : "Escolha uma conclusão",
    },
  ];
}

/** Rebuild structured fields from the persisted evidence format. */
export function parseDeliveryEvidence(evidence: string): DeliveryFields | null {
  const sections = new Map<string, string>();
  for (const block of evidence.split(/(?:^|\r?\n)## /).slice(1)) {
    const lineEnd = block.indexOf("\n");
    if (lineEnd < 0) continue;
    const heading = block.slice(0, lineEnd).trim();
    if (heading === "O que fiz" || heading === "O que esperava" || heading === "O que aconteceu" || heading === "Conclusão") {
      sections.set(heading, block.slice(lineEnd + 1).trim());
    }
  }
  if (sections.size === 0) return null;

  const conclusionText = sections.get("Conclusão") ?? "";
  const conclusion = conclusionText.startsWith(conclusionLabels.falha) ? "falha"
    : conclusionText.startsWith(conclusionLabels.esperado) ? "esperado"
      : conclusionText.startsWith(conclusionLabels.duvida) ? "duvida" : "";
  const severityText = conclusionText.match(/severidade\s+(baixa|média|media|alta|crítica|critica)$/i)?.[1]?.toLowerCase();
  const severity: Severity | "" = severityText === "baixa" ? "baixa"
    : severityText === "média" || severityText === "media" ? "media"
      : severityText === "alta" ? "alta"
        : severityText === "crítica" || severityText === "critica" ? "critica" : "";

  return {
    did: sections.get("O que fiz") ?? "",
    expected: sections.get("O que esperava") ?? "",
    observed: sections.get("O que aconteceu") ?? "",
    conclusion,
    severity,
  };
}

/** Structural coverage only: present fields do not prove the quality of their content. */
export function checkAcceptanceCoverage(
  criteria: readonly string[],
  fieldMap: readonly (readonly DeliveryFieldId[])[],
  fields: DeliveryFields,
  attachments = 0,
): AcceptanceCoverage[] {
  const checks = new Map(checkDelivery(fields, attachments).map((check) => [check.id, check.ok]));
  return criteria.map((criterion, index) => {
    const mappedFields = [...(fieldMap[index] ?? [])];
    return {
      criterion,
      fields: mappedFields,
      fieldsPresent: mappedFields.length > 0 && mappedFields.every((field) => checks.get(field) ?? false),
    };
  });
}

/** Texto gravado no banco: os campos preenchidos, cada um com seu título. */
export function composeEvidence(fields: DeliveryFields): string {
  const sections: string[] = [];
  if (fields.did.trim()) sections.push(`## O que fiz\n${fields.did.trim()}`);
  if (fields.expected.trim()) sections.push(`## O que esperava\n${fields.expected.trim()}`);
  if (fields.observed.trim()) sections.push(`## O que aconteceu\n${fields.observed.trim()}`);
  if (fields.conclusion) {
    const severity = fields.conclusion === "falha" && fields.severity ? ` · severidade ${severityLabels[fields.severity].toLowerCase()}` : "";
    sections.push(`## Conclusão\n${conclusionLabels[fields.conclusion]}${severity}`);
  }
  return sections.join("\n\n");
}

/** Passos marcados no checklist viram o rascunho de "O que fiz". */
export function draftFromChecklist(steps: readonly string[], checked: readonly number[]): string {
  return [...checked].sort((a, b) => a - b).filter((index) => steps[index]).map((index, position) => `${position + 1}. ${steps[index]}`).join("\n");
}
