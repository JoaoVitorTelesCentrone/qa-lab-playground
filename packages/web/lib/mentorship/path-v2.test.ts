import { describe, expect, test } from "bun:test";
import { mentorshipWeeks } from "./catalog";
import { lessonTheory } from "./lesson-theory";
import { extraTheoryV2, findPathV2Assignment, findPathV2Lesson, mentorshipPathV2, pathV2Assignments, pathV2Chapters, pathV2LessonKeys, pathV2PracticeKey, pathV2PracticeKeys, pathV2Progress } from "./path-v2";

describe("mentoria por módulos v2", () => {
  test("tem capítulos e carga editorial variáveis, sem grade fixa de duas partes", () => {
    expect(mentorshipPathV2).toHaveLength(7);
    expect(mentorshipPathV2.map((module) => module.chapters.length)).toEqual([4, 5, 5, 4, 4, 4, 2]);
    expect(mentorshipPathV2.map((module) => pathV2Assignments.filter((item) => item.moduleId === module.id).length)).toEqual([1, 3, 2, 2, 1, 2, 1]);
    expect(pathV2Chapters).toHaveLength(28);
    expect(pathV2Assignments).toHaveLength(12);
  });

  test("todos os conteúdos existem, são únicos e têm teoria aplicável", () => {
    expect(pathV2LessonKeys).toHaveLength(40);
    expect(new Set(pathV2LessonKeys).size).toBe(40);
    for (const key of pathV2LessonKeys) {
      expect(findPathV2Lesson(key)).toBeDefined();
      expect(lessonTheory[key] ?? extraTheoryV2[key]?.theory).toBeDefined();
    }
    for (const week of mentorshipWeeks) for (const lesson of week.lessons) expect(pathV2LessonKeys).toContain(lesson.key);
  });

  test("as práticas são distintas e cada entrega fecha um capítulo", () => {
    expect(pathV2PracticeKeys).toHaveLength(48);
    expect(new Set(pathV2PracticeKeys).size).toBe(48);
    expect(new Set(pathV2Assignments.map((item) => item.key)).size).toBe(12);
    for (const { module, chapter } of pathV2Chapters) {
      expect(chapter.practices.length).toBeGreaterThan(0);
      for (const [index, practice] of chapter.practices.entries()) {
        expect(practice.task.length).toBeGreaterThan(15);
        expect(practice.evidence.length).toBeGreaterThan(12);
        expect(pathV2PracticeKeys).toContain(pathV2PracticeKey(chapter, index));
      }
      if (chapter.assignmentKey) {
        const assignment = findPathV2Assignment(chapter.assignmentKey);
        expect(assignment?.moduleId).toBe(module.id);
        expect(assignment?.chapterId).toBe(chapter.id);
        expect(assignment?.prompts.length).toBeGreaterThan(0);
      }
    }
  });

  test("módulo só conclui com aulas, práticas e entregas aprovadas", () => {
    const lessons = new Set(pathV2LessonKeys);
    const practices = new Set(pathV2PracticeKeys);
    const assignments = new Set(pathV2Assignments.map((item) => item.key));
    expect(pathV2Progress(lessons, assignments, practices).every((item) => item.complete)).toBe(true);
    practices.delete(pathV2PracticeKeys[0]);
    expect(pathV2Progress(lessons, assignments, practices)[0].complete).toBe(false);
  });
});
