export type LessonTheory = {
  objective: string;
  sections: readonly { title: string; text: string }[];
  workedExample: string;
  exercise: string;
  answer: string;
};
