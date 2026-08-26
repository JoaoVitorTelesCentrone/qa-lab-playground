import type { RoadmapChallengeType } from "./qa-do-zero";

const replacements: Array<[RegExp, string]> = [
  [/Quality Assurance vs Quality Control/gi, "Garantia da Qualidade vs Controle da Qualidade"],
  [/Quality Engineering/gi, "Engenharia da Qualidade"],
  [/Continuous Testing/gi, "Testes contínuos"],
  [/Shift Left/gi, "Qualidade antecipada (Shift Left)"],
  [/Shift Right/gi, "Qualidade em produção (Shift Right)"],
  [/SDLC/gi, "Ciclo de desenvolvimento (SDLC)"],
  [/STLC/gi, "Ciclo de testes (STLC)"],
  [/Happy path\s*\/\s*unhappy path/gi, "Caminho feliz e caminhos alternativos"],
  [/Pairwise testing/gi, "Teste combinatório (Pairwise)"],
  [/Session-based testing/gi, "Teste exploratório por sessão"],
  [/Checklist-based testing/gi, "Teste baseado em checklist"],
  [/Error guessing/gi, "Predição de erros"],
  [/Specification by Example/gi, "Especificação por exemplos"],
  [/Living Documentation/gi, "Documentação viva"],
  [/Exploratory Thinking/gi, "Pensamento exploratório"],
  [/Edge Cases/gi, "Casos extremos"],
  [/Ownership/gi, "Senso de responsabilidade"],
  [/FUNDAMENTALS/gi, "FUNDAMENTOS"],
  [/REAL LIFE/gi, "SITUAÇÕES REAIS"],
  [/SOFT SKILLS/gi, "HABILIDADES COMPORTAMENTAIS"],
  [/QA THINKING/gi, "PENSAMENTO DE QA"],
  [/CAREER\s*&\s*MARKET/gi, "CARREIRA E MERCADO"],
  [/BASE\s*—\s*ENTENDENDO QUALIDADE/gi, "BASE — ENTENDENDO QUALIDADE"],
];

export function roadmapLabel(value: string) {
  return replacements.reduce((text, [pattern, replacement]) => text.replace(pattern, replacement), value);
}

const typeLabels: Record<RoadmapChallengeType, string> = {
  INVESTIGATE: "INVESTIGAR",
  TEST: "TESTAR",
  BUILD: "CONSTRUIR",
  DECIDE: "DECIDIR",
  COMMUNICATE: "COMUNICAR",
};

export function roadmapTypeLabel(type: RoadmapChallengeType) { return typeLabels[type]; }
