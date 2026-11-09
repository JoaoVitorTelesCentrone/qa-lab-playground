// Ordem de apresentação dos Labs e o número que a pessoa lê ("Lab 04").
//
// O número lido é a posição nesta ordem, sem buracos: os três do lançamento
// (101, 103, 105) são 01–03, depois vem o Broto e a mentoria (102 em diante) e,
// por último, a loja de treino (1–100). O número de catálogo (101, 136, 12…)
// continua sendo a identidade interna: rota, `lab_slug` no banco e trilhas.
//
// Arquivo sem imports de propósito: tanto o catálogo quanto os textos dos Labs
// precisam dele, e um importando o outro formaria um ciclo.

export const LAUNCH_ORDER: readonly number[] = [101, 103, 105];

const launchIndex = (number: number) => {
  const index = LAUNCH_ORDER.indexOf(number);
  return index === -1 ? Infinity : index;
};

const presentationGroup = (number: number) =>
  number <= 100 ? 3 : number >= 401 && number < 500 ? 1 : number >= 200 ? 2 : 0;

export function compareLabNumbers(a: number, b: number) {
  const launchA = launchIndex(a);
  const launchB = launchIndex(b);
  if (launchA !== launchB) return launchA < launchB ? -1 : 1;
  const groupA = presentationGroup(a);
  const groupB = presentationGroup(b);
  if (groupA !== groupB) return groupA - groupB;
  return a - b;
}

/** Número lido de cada Lab (1, 2, 3…) a partir dos números de catálogo. */
export function labPositions(numbers: readonly number[]): Map<number, number> {
  return new Map([...numbers].sort(compareLabNumbers).map((number, index) => [number, index + 1]));
}
