import type { MentorshipWeek } from "@/lib/mentorship/catalog";

type LessonStep = { slug: string; title: string; description: string; kind: "lesson"; lessonIndex: number };
type ActivityStep = { slug: "quiz" | "exemplo" | "desafio"; title: string; description: string; kind: "activity" };
export type ContentStep = LessonStep | ActivityStep;

const activities: ActivityStep[] = [
  { slug: "quiz", title: "Quiz", description: "Confira o que você entendeu", kind: "activity" },
  { slug: "exemplo", title: "Exemplo prático", description: "Veja o raciocínio em um caso", kind: "activity" },
  { slug: "desafio", title: "Desafio", description: "Pratique e prepare sua entrega", kind: "activity" },
];

export function getContentSteps(week: MentorshipWeek): ContentStep[] {
  return [
    ...week.lessons.map((lesson, lessonIndex) => ({
      slug: `teoria-${lessonIndex + 1}`,
      title: lesson.title,
      description: lesson.summary,
      kind: "lesson" as const,
      lessonIndex,
    })),
    ...activities,
  ];
}

export function contentStepHref(week: number, slug: string) {
  return `/mentoria/conteudo/${week}/${slug}`;
}

export function findContentStep(week: MentorshipWeek, slug: string) {
  return getContentSteps(week).find((step) => step.slug === slug);
}
