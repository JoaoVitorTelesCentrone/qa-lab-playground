// Mapa aula → Labs: a prática de cada aula da mentoria é um Lab com entrega.
//
// Fonte única. A página do capítulo, o briefing do Lab, a conclusão, as
// trilhas e o progresso da mentoria leem daqui; nenhum outro lugar declara que
// Lab pertence a que aula.
//
// Regra: um Lab pertence a no máximo uma aula. Os Labs de reforço ficam fora
// do caminho principal (`moduleReinforcement`) e não contam para o progresso.

import { mentorshipPathV2, pathV2Chapters, findPathV2Lesson, type ChapterV2, type ModuleV2 } from "./path-v2";

export { lessonLabs } from "./lesson-labs-data";
import { lessonLabs } from "./lesson-labs-data";

/** Labs fora do caminho principal: praticar mais sem contar no progresso. */
export const moduleReinforcement: Readonly<Record<string, readonly number[]>> = {
  "produto-risco": [104, 106],
  "desenho-comunicacao": [112, 113, 115],
  "api-confiabilidade": [121, 123, 124, 125, 126, 127, 128, 129, 130],
};

/** Trilhas de curso que aprofundam o módulo. Ficam no fim, sem competir com o caminho. */
export const moduleDeepDives: Readonly<Record<string, readonly { slug: string; name: string }[]>> = {
  "produto-risco": [{ slug: "testes-exploratorios", name: "Testes exploratórios" }, { slug: "mentalidade-qa", name: "Mentalidade de QA" }],
  "desenho-comunicacao": [{ slug: "gherkin", name: "Gherkin" }, { slug: "bug-report", name: "Bug report" }, { slug: "testes-regressao", name: "Testes de regressão" }],
  "automacao-web": [{ slug: "cypress", name: "Automação com Cypress" }, { slug: "playwright", name: "Automação com Playwright" }, { slug: "appium-selenium", name: "Automação mobile" }],
  "api-confiabilidade": [{ slug: "testes-api", name: "Testes de API" }, { slug: "sql-qa", name: "SQL para QA" }],
  "cicd-operacao": [{ slug: "cicd", name: "CI/CD" }, { slug: "metricas-qa", name: "Métricas para QA" }],
  "acessibilidade-performance": [{ slug: "k6", name: "Performance com k6" }],
};

export type LabPlacement = {
  module: ModuleV2;
  moduleNumber: number;
  chapter: ChapterV2;
  lessonKey: string;
  lessonTitle: string;
  /** Posição da aula no capítulo, começando em 1. */
  lessonNumber: number;
  /** Labs da mesma aula, na ordem. */
  siblings: readonly number[];
  /** Posição do Lab na aula, começando em 1. */
  position: number;
};

const placements = new Map<number, LabPlacement>();
for (const { module, chapter } of pathV2Chapters) {
  chapter.lessonKeys.forEach((lessonKey, lessonIndex) => {
    const siblings = lessonLabs[lessonKey] ?? [];
    siblings.forEach((number, index) => {
      placements.set(number, {
        module,
        moduleNumber: mentorshipPathV2.indexOf(module) + 1,
        chapter,
        lessonKey,
        lessonTitle: findPathV2Lesson(lessonKey)?.title ?? "Aula",
        lessonNumber: lessonIndex + 1,
        siblings,
        position: index + 1,
      });
    });
  });
}

/** Onde o Lab mora na mentoria, ou null se ele não é prática de nenhuma aula. */
export function lessonForLab(labNumber: number): LabPlacement | null {
  return placements.get(labNumber) ?? null;
}

export function labsForLesson(lessonKey: string): readonly number[] {
  return lessonLabs[lessonKey] ?? [];
}

export function labsForChapter(chapter: ChapterV2): number[] {
  return chapter.lessonKeys.flatMap((key) => labsForLesson(key));
}

export function labsForModule(module: ModuleV2): number[] {
  return module.chapters.flatMap((chapter) => labsForChapter(chapter));
}

/** Todos os Labs do caminho principal, na ordem da mentoria. */
export const mentorshipPathLabs: readonly number[] = mentorshipPathV2.flatMap((module) => labsForModule(module));

/** Labs que quem está na mentoria pode abrir: caminho principal e reforço. */
export const mentorshipLabNumbers: ReadonlySet<number> = new Set([...mentorshipPathLabs, ...Object.values(moduleReinforcement).flat()]);

/** Próximo passo depois de concluir um Lab da mentoria. */
export type NextInPath =
  | { kind: "lab"; labNumber: number; placement: LabPlacement }
  | { kind: "lesson"; placement: LabPlacement; lessonKey: string; lessonTitle: string; labNumber: number | null }
  | { kind: "chapter"; placement: LabPlacement }
  | { kind: "end"; placement: LabPlacement };

export function nextInPath(labNumber: number): NextInPath | null {
  const placement = lessonForLab(labNumber);
  if (!placement) return null;
  // Outro Lab da mesma aula vem primeiro.
  const sibling = placement.siblings[placement.position];
  if (sibling !== undefined) return { kind: "lab", labNumber: sibling, placement: lessonForLab(sibling)! };
  // Depois, a próxima aula do capítulo.
  const nextKey = placement.chapter.lessonKeys[placement.lessonNumber];
  if (nextKey) return { kind: "lesson", placement, lessonKey: nextKey, lessonTitle: findPathV2Lesson(nextKey)?.title ?? "Próxima aula", labNumber: labsForLesson(nextKey)[0] ?? null };
  // Capítulo acabou: com marco, o próximo passo é a entrega; sem marco, o capítulo seguinte.
  const isLastChapter = pathV2Chapters[pathV2Chapters.length - 1].chapter.id === placement.chapter.id;
  return isLastChapter ? { kind: "end", placement } : { kind: "chapter", placement };
}
