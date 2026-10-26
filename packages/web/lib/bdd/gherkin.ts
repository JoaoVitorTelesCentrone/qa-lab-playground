export type BddScenario = {
  id: string;
  title: string;
  given: string;
  when: string;
  then: string;
};

function line(value: string) {
  return value.trim().replace(/\s*\r?\n\s*/g, " ").replace(/\s+/g, " ");
}

export function buildGherkin(feature: string, context: string, scenarios: BddScenario[]) {
  const name = line(feature);
  if (!name) return "";
  const description = line(context);
  const examples = scenarios.filter((scenario) =>
    [scenario.title, scenario.given, scenario.when, scenario.then].every((value) => line(value).length > 0),
  );
  if (examples.length === 0) return "";
  return [
    "# language: pt",
    `Funcionalidade: ${name}`,
    ...(description ? [`  ${description}`] : []),
    ...examples.map((scenario) => [
      "",
      `  Cenário: ${line(scenario.title)}`,
      `    Dado ${line(scenario.given)}`,
      `    Quando ${line(scenario.when)}`,
      `    Então ${line(scenario.then)}`,
    ].join("\n")),
    "",
  ].join("\n");
}
