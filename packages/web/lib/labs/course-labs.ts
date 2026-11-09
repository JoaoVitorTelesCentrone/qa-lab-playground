// Labs de automação por ferramenta, gerados a partir dos cursos que já existem
// (Cypress, Playwright, Selenium e Appium, k6, Postman e Bruno).
//
// Cada módulo de curso vira um Lab numerado do catálogo: a prática do módulo é
// o roteiro, o entregável é o resultado esperado, o checklist são os critérios,
// o código de exemplo vira o botão de copiar e a aula do curso fica a um link.
// Nada é reescrito aqui: o conteúdo mora nos cursos (lib/*-course.ts) e este
// arquivo só o apresenta no formato de Lab.
//
// Numeração por bloco, append-only: um módulo novo no fim de um curso ganha o
// próximo número do bloco e não desloca os Labs de outros cursos. Eles não
// entram no progresso da mentoria: aparecem como "Praticar mais" nos módulos 3,
// 4 e 6 (lesson-labs.ts) e na lista de Labs, no bloco "Automação por ferramenta".

import type { SystemChallenge } from "@/lib/system-challenges";
import { cypressCourseModules } from "@/lib/cypress-course";
import { playwrightCourseModules } from "@/lib/playwright-course";
import { appiumSeleniumModules } from "@/lib/appium-selenium-course";
import { k6CourseModules } from "@/lib/k6-course";
import { apiTestingBrunoModules, apiTestingPostmanModules } from "@/lib/api-testing-course";
import { broto, brotoPrep } from "./mentorship-labs";

type CourseModule = {
  id: string;
  title: string;
  objective: string;
  concepts: readonly string[];
  practice: string;
  deliverable: string;
  checklist: readonly string[];
  code?: string;
  example?: string;
};

type Course = {
  key: string;
  area: string;
  /** Primeiro número do bloco. Cada curso tem 20 números reservados. */
  firstNumber: number;
  href: (moduleId: string) => string;
  modules: readonly CourseModule[];
  /** O k6 do curso usa a API local de treino, não o Broto em produção. */
  local?: boolean;
};

const courses: readonly Course[] = [
  { key: "cypress", area: "Cypress", firstNumber: 201, href: (id) => `/trilhas/cypress/${id}`, modules: cypressCourseModules },
  { key: "playwright", area: "Playwright", firstNumber: 221, href: (id) => `/trilhas/playwright/${id}`, modules: playwrightCourseModules },
  { key: "selenium-appium", area: "Selenium e Appium", firstNumber: 241, href: (id) => `/trilhas/appium-selenium/${id}`, modules: appiumSeleniumModules },
  { key: "k6", area: "k6", firstNumber: 261, href: (id) => `/trilhas/k6/${id}`, modules: k6CourseModules, local: true },
  { key: "postman", area: "Postman", firstNumber: 281, href: (id) => `/trilhas/testes-api/postman/${id}`, modules: apiTestingPostmanModules },
  { key: "bruno", area: "Bruno", firstNumber: 301, href: (id) => `/trilhas/testes-api/bruno/${id}`, modules: apiTestingBrunoModules },
];

/** Áreas que formam o bloco "Automação por ferramenta" na lista de Labs. */
export const courseLabAreas: readonly string[] = courses.map((course) => course.area);

const difficultyAt = (index: number, total: number): SystemChallenge["difficulty"] =>
  index < total / 3 ? "Basico" : index < (total * 2) / 3 ? "Intermediario" : "Avancado";

const secrets = "E-mail, senha e tokens vêm de variáveis de ambiente: nunca no código, no log colado ou na evidência.";

function toLab(course: Course, courseModule: CourseModule, index: number): SystemChallenge {
  const number = course.firstNumber + index;
  const sample = courseModule.code ?? courseModule.example;
  const courseLesson = { label: "Aula do curso", href: course.href(courseModule.id) };
  const prepare: NonNullable<SystemChallenge["prepare"]> = course.local
    ? { items: ["Use a API local de treino, somente leitura, como a aula pede.", "Combine a janela e o perfil antes de rodar qualquer carga."], reading: courseLesson }
    : { ...brotoPrep(), reading: courseLesson };
  if (sample) prepare.copy = [{ label: "Código de exemplo do curso", text: sample }];
  return {
    id: `desafio-${number}`,
    number,
    area: course.area,
    mode: "fluxo",
    difficulty: difficultyAt(index, course.modules.length),
    route: course.local ? "/mentoria/performance" : "/conteudo/broto",
    ...(course.local ? {} : { system: broto }),
    title: courseModule.title,
    objective: courseModule.objective,
    testData: `${courseModule.practice} ${course.local ? "" : `Use a sua conta de estudo no Broto. ${secrets}`}`.trim(),
    expected: courseModule.deliverable,
    steps: [
      `Leia a aula do curso (conceitos: ${courseModule.concepts.join(", ")}).`,
      "Faça a prática com os dados de teste acima.",
      "Confira o seu resultado contra cada item do checklist.",
      "Escreva a evidência: o que fez, o que esperava e o que observou.",
    ],
    stepObserve: ["Quais destes conceitos você já conhecia?", "", "Algum item do checklist ficou sem evidência?", ""],
    acceptance: [...courseModule.checklist],
    plantedBug: course.local
      ? "O curso não planta defeito: o objetivo é executar com método e registrar o que a medida permite concluir."
      : "O Broto é um produto real, sem defeito plantado. Registre o que observou; uma dúvida bem formulada também é entrega.",
    prepare,
  };
}

/** Os Labs gerados, na ordem dos cursos e dos módulos. */
export const courseLabs: SystemChallenge[] = courses.flatMap((course) => course.modules.map((courseModule, index) => toLab(course, courseModule, index)));

/** Números de catálogo por curso, para o "Praticar mais" de cada módulo da mentoria. */
export const courseLabNumbers: Readonly<Record<string, readonly number[]>> = Object.fromEntries(
  courses.map((course) => [course.key, course.modules.map((_, index) => course.firstNumber + index)]),
);
