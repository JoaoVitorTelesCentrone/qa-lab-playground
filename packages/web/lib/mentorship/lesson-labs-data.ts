// Dados puros do mapa aula → Labs, sem imports: path-v2.ts e lesson-labs.ts
// leem daqui sem criar dependência circular. Ver lesson-labs.ts.

const l = (week: number, index: number) => `mentoria.w${String(week).padStart(2, "0")}.l${index}`;

export const lessonLabs: Readonly<Record<string, readonly number[]>> = {
  // Módulo 1 · Produto, risco e exploração (= trilha "Investigue o Broto")
  [l(1, 1)]: [101],
  [l(1, 2)]: [103],
  [l(2, 3)]: [105, 102],
  [l(2, 1)]: [107],
  [l(2, 2)]: [108],
  [l(1, 3)]: [109, 110],
  // Módulo 2 · Desenho e comunicação de testes (= trilha "Desenho de testes no Broto")
  [l(3, 3)]: [111],
  [l(3, 1)]: [119, 120],
  [l(3, 2)]: [117, 118],
  [l(4, 1)]: [114],
  [l(4, 3)]: [116],
  [l(4, 2)]: [131],
  // Módulo 3 · Automação web
  [l(5, 1)]: [132],
  [l(5, 3)]: [133],
  [l(6, 3)]: [134],
  "mentoria.v2.frontend-observabilidade": [135],
  [l(6, 1)]: [136, 137],
  [l(6, 2)]: [138, 139],
  [l(5, 2)]: [140, 141],
  // Módulo 4 · APIs e confiabilidade da suíte
  [l(7, 1)]: [142, 122],
  [l(7, 2)]: [143, 144],
  [l(7, 3)]: [145, 146],
  [l(8, 1)]: [147],
  [l(8, 2)]: [148],
  [l(8, 3)]: [149],
  // Módulo 5 · CI/CD e operação
  [l(9, 3)]: [150],
  [l(9, 1)]: [151],
  [l(9, 2)]: [152],
  [l(10, 1)]: [153],
  [l(10, 3)]: [154, 155],
  [l(10, 2)]: [156],
  // Módulo 6 · Acessibilidade e performance
  "mentoria.v2.acessibilidade-tarefa": [157],
  "mentoria.v2.acessibilidade-evidencia": [158],
  [l(11, 1)]: [159, 160],
  [l(11, 3)]: [161],
  "mentoria.v2.k6-execucao": [162],
  [l(11, 2)]: [163, 164],
  // Módulo 7 · Projeto de conclusão: usa as evidências dos Labs anteriores.
};
