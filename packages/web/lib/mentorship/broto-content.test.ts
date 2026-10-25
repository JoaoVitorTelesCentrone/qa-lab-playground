import { expect, test } from "bun:test";
import { getAppliedExample } from "./applied-examples";
import { brotoTrainingCase, brotoLessonActions } from "./broto-training-case";
import { brotoSpaceWeeks } from "./brotospace-track";
import { mentorshipWeeks } from "./catalog";
import { mentorshipCurriculum } from "./curriculum";
import { deepLessons } from "./deep-lessons";
import { incidentExperiment } from "./incident-experiment";
import { labBriefs } from "./lab-briefs";
import { mentorshipLessonGuides } from "./lesson-guides";
import { lessonTheory } from "./lesson-theory";
import { megazord2026Weeks } from "./megazord-2026";
import { oracleExperiment } from "./oracle-experiment";
import { extraTheoryV2, mentorshipPathV2, pathV2Assignments } from "./path-v2";
import { requirementsExperiment } from "./requirements-experiment";
import { roadmapQASupplement } from "./roadmapqa-supplement";
import { roadmapQAWorkedCases } from "./roadmapqa-worked-cases";
import { studyResources } from "./study-resources";
import { technicalPlaybooks } from "./technical-playbooks";
import { theoryExpansion } from "./theory-expansion";

test("o conteúdo entregue por todas as camadas da mentoria usa o caso BrotoSpace", () => {
  // A v2 herda teoria e atividades da trilha semanal. Conferir só os títulos
  // deixa exemplos, gabaritos e exportações antigas reaparecerem nas aulas.
  const layers = {
    mentorshipWeeks, mentorshipCurriculum, lessonTheory, mentorshipLessonGuides,
    deepLessons, theoryExpansion, roadmapQASupplement, roadmapQAWorkedCases,
    studyResources, technicalPlaybooks, megazord2026Weeks, labBriefs,
    appliedExamples: mentorshipWeeks.map(week => getAppliedExample(week.number)),
    brotoTrainingCase, brotoLessonActions, brotoSpaceWeeks,
    mentorshipPathV2, pathV2Assignments, extraTheoryV2,
    requirementsExperiment, oracleExperiment, incidentExperiment,
  };
  for (const [name, content] of Object.entries(layers)) {
    expect(JSON.stringify(content), name).not.toMatch(/expense[\s-]?flow|despes[ao]s?|reembols\w*|financeir\w*|R\$|\/shop\/products/i);
  }
  expect(lessonTheory["mentoria.w01.l1"].workedExample).toContain("BrotoSpace");
  expect(lessonTheory["mentoria.w01.l1"].workedExample).toContain("recarregar");
  expect(mentorshipWeeks[0].assignment.practice.route).toBe("/conteudo/broto");
});
