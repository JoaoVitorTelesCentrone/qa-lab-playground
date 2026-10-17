import { describe, expect, test } from "bun:test";
import { findMentorshipAssignment, findMentorshipLesson, findMentorshipWeek, mentorshipWeeks, requirementsFor } from "./catalog";

describe("catalogo da mentoria", () => {
  test("tem doze semanas com uma entrega por semana", () => {
    expect(mentorshipWeeks).toHaveLength(12);
    expect(mentorshipWeeks.map((week) => week.number)).toEqual(Array.from({ length: 12 }, (_, index) => index + 1));
    expect(new Set(mentorshipWeeks.map((week) => week.assignment.key)).size).toBe(12);
  });

  test("mantem aulas e entregas enderecaveis por chave", () => {
    const week = findMentorshipWeek(6)!;
    expect(findMentorshipLesson(week.lessons[0].key)?.title).toBe(week.lessons[0].title);
    expect(findMentorshipAssignment(week.assignment.key)?.title).toBe(week.assignment.title);
  });

  test("varia os requisitos pela profundidade do aluno", () => {
    const assignment = findMentorshipWeek(1)!.assignment;
    expect(requirementsFor("beginner", assignment)).not.toEqual(requirementsFor("intermediate", assignment));
    expect(requirementsFor("intermediate", assignment)).toContain("Justificar a priorizacao");
  });
});
