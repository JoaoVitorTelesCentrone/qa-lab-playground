import { describe, expect, test } from "bun:test";
import { getMentorshipWeekContent, mentorshipCurriculum } from "./curriculum";
import { mentorshipWeeks } from "./catalog";
import { lessonTheory } from "./lesson-theory";
import { theoryExpansion } from "./theory-expansion";
import { roadmapQASupplement } from "./roadmapqa-supplement";
import { roadmapQAWorkedCases } from "./roadmapqa-worked-cases";

describe("conteudo da mentoria", () => {
  test("cobre as doze semanas com conteudo pratico", () => {
    expect(mentorshipCurriculum).toHaveLength(12);
    expect(mentorshipCurriculum.map((item) => item.week)).toEqual(Array.from({ length: 12 }, (_, index) => index + 1));
    for (const item of mentorshipCurriculum) {
      expect(item.outcomes.length).toBeGreaterThanOrEqual(4);
      expect(item.concepts.length).toBeGreaterThanOrEqual(4);
      expect(item.guidedPractice.length).toBeGreaterThanOrEqual(5);
      expect(item.checkpoints.length).toBeGreaterThanOrEqual(4);
      expect(item.references.length).toBeGreaterThanOrEqual(1);
    }
  });

  test("usa referencias externas seguras e identificadas", () => {
    for (const reference of mentorshipCurriculum.flatMap((item) => item.references)) {
      expect(reference.url.startsWith("https://")).toBe(true);
      expect(reference.organization.length).toBeGreaterThan(1);
      expect(reference.title.length).toBeGreaterThan(3);
    }
  });

  test("recupera o guia pela semana", () => {
    expect(getMentorshipWeekContent(6)?.promise).toContain("Playwright");
    expect(getMentorshipWeekContent(99)).toBeUndefined();
  });

  test("todas as aulas têm leitura teórica desenvolvida", () => {
    for (const week of mentorshipWeeks) {
      expect(theoryExpansion[week.number]?.sections.length).toBeGreaterThanOrEqual(2);
      for (const lesson of week.lessons) {
        const theory = lessonTheory[lesson.key];
        expect(theory).toBeDefined();
        expect(theory.sections.length).toBeGreaterThanOrEqual(3);
        expect(theory.sections.map((section) => section.text).join(" ").length).toBeGreaterThan(900);
      }
    }
  });

  test("o complemento do RoadMapQA está presente em todas as aulas", () => {
    const lessonKeys = mentorshipWeeks.flatMap((week) => week.lessons.map((lesson) => lesson.key));
    expect(Object.keys(roadmapQASupplement).sort()).toEqual([...lessonKeys].sort());
    for (const key of lessonKeys) {
      const supplement = roadmapQASupplement[key];
      expect(supplement.topics.length).toBeGreaterThanOrEqual(2);
      for (const topic of supplement.topics) {
        expect(topic.explanation.length).toBeGreaterThan(180);
        expect(topic.application.length).toBeGreaterThan(60);
      }
    }
  });

  test("cada semana mostra um caso aplicado que explica a conclusão", () => {
    expect(Object.keys(roadmapQAWorkedCases).map(Number).sort((a, b) => a - b)).toEqual(mentorshipWeeks.map((week) => week.number));
    for (const week of mentorshipWeeks) {
      const example = roadmapQAWorkedCases[week.number];
      expect(example.procedure.length).toBeGreaterThanOrEqual(4);
      expect(example.deliverable.length).toBeGreaterThan(90);
      expect(example.interpretation.length).toBeGreaterThan(100);
    }
  });
});
