import { describe, expect, test } from "bun:test";
import { mentorshipWeeks } from "./catalog";
import { contentStepHref, findContentStep, getContentSteps } from "./content-steps";

describe("etapas do conteúdo", () => {
  test("cada aula tem uma página com seu título específico", () => {
    for (const week of mentorshipWeeks) {
      const steps = getContentSteps(week);
      expect(steps).toHaveLength(week.lessons.length + 3);
      expect(new Set(steps.map((step) => step.slug)).size).toBe(steps.length);
      for (const [index, lesson] of week.lessons.entries()) {
        expect(steps[index]).toMatchObject({ slug: `teoria-${index + 1}`, title: lesson.title, kind: "lesson", lessonIndex: index });
        expect(findContentStep(week, `teoria-${index + 1}`)?.title).toBe(lesson.title);
        expect(contentStepHref(week.number, steps[index].slug)).toBe(`/mentoria/conteudo/${week.number}/teoria-${index + 1}`);
      }
      expect(steps.slice(week.lessons.length).map((step) => step.slug)).toEqual(["quiz", "exemplo", "desafio"]);
    }
  });

  test("não cria uma página de teoria além das aulas cadastradas", () => {
    for (const week of mentorshipWeeks) {
      expect(findContentStep(week, `teoria-${week.lessons.length}`)).toBeDefined();
      expect(findContentStep(week, `teoria-${week.lessons.length + 1}`)).toBeUndefined();
    }
  });
});
