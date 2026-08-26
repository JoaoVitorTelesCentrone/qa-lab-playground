import { readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

type ChallengeType = "INVESTIGATE" | "TEST" | "BUILD" | "DECIDE" | "COMMUNICATE";
type Row = { id: string; order: number; module: string; title: string; type: ChallengeType; context: string; prompt: string; deliverable: string; rubric: string[] };

const deliverable: Record<ChallengeType, string> = {
  INVESTIGATE: "Hipóteses, evidências e conclusão justificada.",
  TEST: "Cenários de teste com dados e resultado esperado.",
  BUILD: "Artefato prático pronto para revisão.",
  DECIDE: "Decisão justificada, com risco residual explícito.",
  COMMUNICATE: "Comunicação profissional clara e acionável.",
};
const rubric: Record<ChallengeType, string[]> = {
  INVESTIGATE: ["Separa fato de hipótese.", "Busca evidência antes de concluir.", "Explica a conclusão e suas limitações."],
  TEST: ["Cobre o risco descrito.", "Usa dados e oráculo verificáveis.", "Explica o resultado esperado."],
  BUILD: ["Produz artefato utilizável por outra pessoa.", "Mantém estrutura clara.", "Conecta a entrega ao contexto do desafio."],
  DECIDE: ["Explicita critérios e trade-offs.", "Toma uma posição clara.", "Declara risco residual e próxima ação."],
  COMMUNICATE: ["É claro para o público do cenário.", "Usa fatos e impacto.", "Termina com ação objetiva."],
};

async function main() {
  const scriptDir = dirname(fileURLToPath(import.meta.url));
  const source = await readFile(resolve(scriptDir, "../../../QA_Lab_Roadmap_Completo_Desafios.md"), "utf8");
  let section = "QA Lab"; let topic = "Prática de QA"; const rows: Row[] = [];
  for (const line of source.split(/\r?\n/)) {
    const heading = line.match(/^(#{1,3})\s+(.+)$/);
    if (heading) {
      const value = heading[2].replace(/\*\*/g, "").trim();
      if (heading[1].length <= 2) section = value;
      if (heading[1].length === 3) topic = value;
      continue;
    }
    const match = line.match(/^\s*-\s+\*\*(INVESTIGATE|TEST|BUILD|DECIDE|COMMUNICATE):\*\*\s+(.+)$/);
    if (!match) continue;
    const type = match[1] as ChallengeType; const prompt = match[2].trim(); const order = rows.length + 1;
    rows.push({ id: `roadmap-${String(order).padStart(3, "0")}`, order, module: `${section} — ${topic}`, title: topic, type, context: `Situação de prática: ${topic}. Este desafio faz parte de ${section}.`, prompt, deliverable: deliverable[type], rubric: rubric[type] });
  }
  if (rows.length < 400) throw new Error(`Catálogo incompleto: somente ${rows.length} desafios encontrados.`);
  const output = `// Gerado por scripts/build-roadmap-catalog.ts a partir de QA_Lab_Roadmap_Completo_Desafios.md. Não editar manualmente.\nimport type { RoadmapChallenge } from "./qa-do-zero";\n\nexport const fullRoadmapChallenges: RoadmapChallenge[] = ${JSON.stringify(rows, null, 2)};\n\nexport function findFullRoadmapChallenge(id: string) { return fullRoadmapChallenges.find((challenge) => challenge.id === id); }\n`;
  await writeFile(resolve(scriptDir, "../lib/roadmap/full-catalog.generated.ts"), output, "utf8");
  console.log(`Gerados ${rows.length} desafios.`);
}

await main();
