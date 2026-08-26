// Nível intermediário do portfólio: o projeto.
//
// Um portfólio de QA não é uma pilha de evidências soltas. Quem lê precisa
// entender, nesta ordem: quem é a pessoa → em que sistemas ela trabalhou → o
// que ela provou em cada um. Sem esse nível do meio, a página abre com um bug
// específico antes de dizer o que estava sendo testado, e nenhum recrutador
// consegue escanear.
//
// Hoje um projeto é um ambiente do QA Lab (Finanças, E-commerce, Agendamentos,
// CRM). O tipo já nasce com `source` para o dia em que a pessoa cadastrar
// projeto próprio ou de empresa aqui — o portfólio inteiro dela, não só o que
// ela fez nos nossos exercícios.
//
// Módulo puro: nenhuma leitura de banco.

import { practiceApps } from "./apps";
import type { PortfolioEntry } from "./portfolio-format";
import { countLinks } from "./evidence-text";

export type PortfolioProject = {
  id: string;
  name: string;
  summary: string;
  /** De onde vem o projeto. Só "qa-lab" existe hoje; ver comentário do módulo. */
  source: "qa-lab" | "pessoal" | "profissional";
  /** Rota do ambiente, para quem quiser testar o mesmo sistema. */
  route: string;
  /** Áreas e tipos de teste cobertos — os chips do card. */
  tags: string[];
  entries: PortfolioEntry[];
  stats: PortfolioStats;
};

export type PortfolioStats = {
  /** Uma evidência publicada = um case fechado. */
  evidences: number;
  /** Evidência de Lab de investigação: a pessoa foi atrás do defeito e achou. */
  bugs: number;
  /** Labs distintos: quantos recortes do sistema ela cobriu. */
  labs: number;
  /**
   * Evidências que alguém de fora consegue auditar: têm print, vídeo ou link
   * externo junto. Substitui a contagem de anexos, que dizia quanto arquivo
   * foi subido e não o que isso prova — dez prints num case só não valem mais
   * que um print em dez cases.
   */
  documented: number;
  /** Domínios distintos testados. Diz a amplitude, não só o volume. */
  domains: number;
};

/** Uma evidência é auditável quando traz arquivo ou link para conferir. */
function isDocumented(entry: PortfolioEntry) {
  return entry.attachments.length > 0 || countLinks(entry.evidence) > 0;
}

const modeTags = { fluxo: "Validação de fluxo", investigacao: "Teste exploratório" } as const;

// O ambiente da loja se chama "QA Lab" dentro do produto — o mesmo nome do
// produto. No portfólio isso não diz nada a quem lê de fora, então ele aparece
// pelo domínio que ele simula.
const displayNames: Record<string, string> = { "qa-lab": "E-commerce" };

const fallback = { name: "Projeto", summary: "", route: "/labs" };

/** Nome, resumo e rota do ambiente por trás do projeto. */
export function projectMeta(id: string) {
  const app = practiceApps.find((item) => item.id === id);
  const base = app ? { name: app.name, summary: app.summary, route: app.route } : fallback;
  return { ...base, name: displayNames[id] ?? base.name };
}

export function buildProjects(entries: PortfolioEntry[]): PortfolioProject[] {
  const ids = [...new Set(entries.map((entry) => entry.projectId))];

  return ids
    .map((id) => {
      const meta = projectMeta(id);
      const own = entries.filter((entry) => entry.projectId === id);
      const areas = [...new Set(own.map((entry) => entry.labArea))].filter((area) => area.toLowerCase() !== id);
      const modes = [...new Set(own.map((entry) => modeTags[entry.labMode]))];
      return {
        id,
        name: meta.name,
        summary: meta.summary,
        source: "qa-lab" as const,
        route: meta.route,
        tags: [...areas, ...modes],
        entries: own,
        stats: statsFor(own),
      };
    })
    // Mais trabalho primeiro: o projeto com mais evidência é o que sustenta a
    // conversa de entrevista.
    .sort((a, b) => b.stats.evidences - a.stats.evidences || a.name.localeCompare(b.name));
}

export function findProject(projects: PortfolioProject[], id: string) {
  return projects.find((project) => project.id === id);
}

export function statsFor(entries: PortfolioEntry[]): PortfolioStats {
  return {
    evidences: entries.length,
    bugs: entries.filter((entry) => entry.labMode === "investigacao").length,
    labs: new Set(entries.map((entry) => entry.labSlug)).size,
    documented: entries.filter(isDocumented).length,
    domains: new Set(entries.map((entry) => entry.projectId)).size,
  };
}

/**
 * As competências que o portfólio inteiro comprova. Mesma regra do case: só
 * entra o que tem evidência atrás, porque a graça é o que a pessoa fez, não o
 * que ela diz saber.
 */
export function portfolioSkills(entries: PortfolioEntry[]): string[] {
  if (entries.length === 0) return [];
  const skills = ["Documentação de evidência"];
  if (entries.some((entry) => entry.labMode === "investigacao")) skills.push("Teste exploratório");
  if (entries.some((entry) => entry.labMode === "fluxo")) skills.push("Validação de fluxo ponta a ponta");
  if (entries.some((entry) => entry.attachments.some((file) => file.type.startsWith("video/")))) skills.push("Evidência em vídeo");
  else if (entries.some((entry) => entry.attachments.length > 0)) skills.push("Evidência visual");
  // Documentar sempre é diferente de documentar uma vez: só entra quando é
  // hábito, não exceção.
  if (entries.length >= 3 && entries.every(isDocumented)) skills.push("Rastreabilidade de evidência");
  if (new Set(entries.map((entry) => entry.projectId)).size > 1) skills.push("Cobertura de múltiplos domínios");
  if (entries.some((entry) => entry.labArea === "API")) skills.push("Teste de API");
  return skills;
}
