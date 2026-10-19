// Métricas de produto: ativação, conclusão, uso e erros.
//
// Módulo puro — recebe os eventos já lidos e devolve os números do painel. A
// definição de cada métrica vive aqui, escrita uma vez, para o painel e
// qualquer análise futura contarem a mesma coisa.
//
// Ver docs/PRODUCTIZATION_PLAN.md (seção 6, Métricas de sucesso).

export type ActivityEvent = {
  name: string;
  userId: string;
  createdAt: string;
  props: Record<string, unknown>;
};

export type Signup = { userId: string; createdAt: string };

export type Metrics = {
  /** Contas que geraram pelo menos um evento no período. */
  activeUsers: number;
  newUsers: number;
  labsStarted: number;
  labsCompleted: number;
  evidence: number;
  /** Percentual de Labs iniciados que chegaram a ter evidência entregue. */
  completionRate: number;
  /** Contas novas que iniciaram um Lab no dia do cadastro. */
  activatedUsers: number;
  activationRate: number;
  errors: number;
  /** Eventos por dia, do mais antigo ao mais recente. */
  daily: Array<{ date: string; events: number; started: number; completed: number }>;
  /** Labs mais iniciados, do maior para o menor. */
  topLabs: Array<{ lab: string; started: number; completed: number }>;
  /** Erros por mensagem, do mais frequente para o menos. */
  topErrors: Array<{ message: string; total: number }>;
};

const day = (iso: string) => iso.slice(0, 10);

export function buildMetrics(events: ActivityEvent[], signups: Signup[] = []): Metrics {
  const started = events.filter((event) => event.name === "lab_started");
  const completed = events.filter((event) => event.name === "lab_completed");
  const errors = events.filter((event) => event.name === "api_error");

  const users = new Set(events.map((event) => event.userId));
  const signupDays = new Map(signups.map((signup) => [signup.userId, day(signup.createdAt)]));
  const activated = new Set(started.filter((event) => signupDays.get(event.userId) === day(event.createdAt)).map((event) => event.userId));
  const pair = (event: ActivityEvent) => `${event.userId}\u0000${String(event.props.lab ?? "")}`;
  const startedPairs = new Set(started.filter((event) => typeof event.props.lab === "string").map(pair));
  const completedPairs = new Set(completed.filter((event) => typeof event.props.lab === "string").map(pair));
  const completedStartedPairs = [...startedPairs].filter((key) => completedPairs.has(key));

  const days = new Map<string, { events: number; started: number; completed: number }>();
  for (const event of events) {
    const key = day(event.createdAt);
    const bucket = days.get(key) ?? { events: 0, started: 0, completed: 0 };
    bucket.events += 1;
    if (event.name === "lab_started") bucket.started += 1;
    if (event.name === "lab_completed") bucket.completed += 1;
    days.set(key, bucket);
  }

  return {
    activeUsers: users.size,
    newUsers: signupDays.size,
    labsStarted: startedPairs.size,
    labsCompleted: completedStartedPairs.length,
    evidence: completed.length,
    completionRate: startedPairs.size === 0 ? 0 : Math.round((completedStartedPairs.length / startedPairs.size) * 100),
    activatedUsers: activated.size,
    activationRate: signupDays.size === 0 ? 0 : Math.round((activated.size / signupDays.size) * 100),
    errors: errors.length,
    daily: [...days.entries()].map(([date, bucket]) => ({ date, ...bucket })).sort((a, b) => a.date.localeCompare(b.date)),
    topLabs: rank(started, completed),
    topErrors: countBy(errors.map((event) => String(event.props.message ?? "erro sem mensagem"))).map(([message, total]) => ({ message, total })).slice(0, 10),
  };
}

function rank(started: ActivityEvent[], completed: ActivityEvent[]) {
  const labs = new Map<string, { started: Set<string>; completed: Set<string> }>();
  for (const event of [...started, ...completed]) {
    const lab = String(event.props.lab ?? "desconhecido");
    const counts = labs.get(lab) ?? { started: new Set<string>(), completed: new Set<string>() };
    if (event.name === "lab_started") counts.started.add(event.userId);
    if (event.name === "lab_completed") counts.completed.add(event.userId);
    labs.set(lab, counts);
  }
  return [...labs.entries()]
    .map(([lab, counts]) => ({ lab, started: counts.started.size, completed: [...counts.completed].filter((userId) => counts.started.has(userId)).length }))
    .sort((a, b) => b.started - a.started || b.completed - a.completed)
    .slice(0, 10);
}

function countBy(values: string[]) {
  const counts = new Map<string, number>();
  for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);
  return [...counts.entries()].sort((a, b) => b[1] - a[1]);
}
