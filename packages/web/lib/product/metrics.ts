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

export type Signup = {
  userId: string;
  createdAt: string;
  acquisitionSource?: string | null;
  acquisitionMedium?: string | null;
  acquisitionCampaign?: string | null;
};

export type CohortMetrics = {
  key: string;
  signups: number;
  eligibleUsers: number;
  startedUsers: number;
  evidenceUsers: number;
  abandonedUsers: number;
  evidenceRate: number | null;
};
export type ReviewedSubmission = { studentId: string; reviewedAt: string };

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
  /** Contas com pelo menos sete dias desde o cadastro e que entregaram evidência nesse intervalo. */
  firstEvidenceWithin7Days: { users: number; eligibleUsers: number; rate: number };
  /** Mediana em horas para a primeira evidência da coorte elegível. */
  medianHoursToFirstEvidence: number | null;
  /** Contas que publicaram o case sistema no período lido. */
  casesPublished: number;
  mentorshipFunnel: { waitlistLeads: number; applications: number; checkouts: number; payments: number; firstReviewedSubmissions: number };
  /** Weekly signup cohorts; only users with seven complete days count in stage rates. */
  weeklyCohorts: CohortMetrics[];
  /** First-touch acquisition source; users without UTMs stay visible as direct/unknown. */
  acquisitionSources: CohortMetrics[];
  uploads: { successful: number; failed: number };
  errors: number;
  /** Eventos por dia, do mais antigo ao mais recente. */
  daily: Array<{ date: string; events: number; started: number; completed: number }>;
  /** Labs mais iniciados, do maior para o menor. */
  topLabs: Array<{ lab: string; started: number; completed: number }>;
  /** Erros por mensagem, do mais frequente para o menos. */
  topErrors: Array<{ message: string; total: number }>;
};

const day = (iso: string) => iso.slice(0, 10);

export function buildMetrics(events: ActivityEvent[], signups: Signup[] = [], now = new Date(), waitlistLeads = 0, reviewedSubmissions: ReviewedSubmission[] = []): Metrics {
  const started = events.filter((event) => event.name === "lab_started");
  const completed = events.filter((event) => event.name === "lab_completed");
  const errors = events.filter((event) => event.name === "api_error");
  const casesPublished = new Set(events.filter((event) => event.name === "case_published").map((event) => event.userId));
  const mentorshipFunnel = {
    waitlistLeads,
    applications: new Set(events.filter((event) => event.name === "mentorship_application_submitted").map((event) => event.userId)).size,
    checkouts: new Set(events.filter((event) => event.name === "mentorship_checkout_started").map((event) => event.userId)).size,
    payments: new Set(events.filter((event) => event.name === "mentorship_payment_confirmed").map((event) => event.userId)).size,
    firstReviewedSubmissions: countFirstReviewsInWindow(reviewedSubmissions, now),
  };
  const uploads = {
    successful: events.filter((event) => event.name === "evidence_upload_succeeded").length,
    failed: events.filter((event) => event.name === "evidence_upload_failed").length,
  };

  const users = new Set(events.map((event) => event.userId));
  const signupDays = new Map(signups.map((signup) => [signup.userId, day(signup.createdAt)]));
  const activated = new Set(started.filter((event) => signupDays.get(event.userId) === day(event.createdAt)).map((event) => event.userId));
  const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
  const eligibleSignups = signups.filter((signup) => {
    const createdAt = Date.parse(signup.createdAt);
    return Number.isFinite(createdAt) && createdAt + sevenDaysMs <= now.getTime();
  });
  const eligibleUserIds = new Set(eligibleSignups.map((signup) => signup.userId));
  const signupByUser = new Map(eligibleSignups.map((signup) => [signup.userId, Date.parse(signup.createdAt)]));
  const firstEvidenceByUser = new Map<string, number>();
  for (const event of events) {
    if (event.name !== "lab_completed") continue;
    const signupAt = signupByUser.get(event.userId);
    if (signupAt === undefined) continue;
    const submittedAt = Date.parse(event.createdAt);
    if (!Number.isFinite(submittedAt) || submittedAt < signupAt || submittedAt > signupAt + sevenDaysMs) continue;
    firstEvidenceByUser.set(event.userId, Math.min(submittedAt, firstEvidenceByUser.get(event.userId) ?? Infinity));
  }
  const hoursToEvidence = [...firstEvidenceByUser].map(([userId, submittedAt]) => (submittedAt - signupByUser.get(userId)!) / 3_600_000).sort((a, b) => a - b);
  const middle = Math.floor(hoursToEvidence.length / 2);
  const medianHoursToFirstEvidence = hoursToEvidence.length === 0 ? null : Math.round((hoursToEvidence[middle] + hoursToEvidence[Math.floor((hoursToEvidence.length - 1) / 2)]) * 5) / 10;
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
    firstEvidenceWithin7Days: {
      users: firstEvidenceByUser.size,
      eligibleUsers: eligibleUserIds.size,
      rate: eligibleUserIds.size === 0 ? 0 : Math.round((firstEvidenceByUser.size / eligibleUserIds.size) * 100),
    },
    medianHoursToFirstEvidence,
    casesPublished: casesPublished.size,
    mentorshipFunnel,
    weeklyCohorts: buildSignupBreakdown(events, signups, now, (signup) => cohortWeek(signup.createdAt)),
    acquisitionSources: buildSignupBreakdown(events, signups, now, signupSource),
    uploads,
    errors: errors.length,
    daily: [...days.entries()].map(([date, bucket]) => ({ date, ...bucket })).sort((a, b) => a.date.localeCompare(b.date)),
    topLabs: rank(started, completed),
    topErrors: countBy(errors.map((event) => String(event.props.message ?? "erro sem mensagem"))).map(([message, total]) => ({ message, total })).slice(0, 10),
  };
}

function countFirstReviewsInWindow(submissions: ReviewedSubmission[], now: Date) {
  const since = now.getTime() - 30 * 24 * 60 * 60 * 1000;
  const firstReviewByStudent = new Map<string, number>();
  for (const submission of submissions) {
    const timestamp = Date.parse(submission.reviewedAt);
    if (!submission.studentId || !Number.isFinite(timestamp)) continue;
    firstReviewByStudent.set(submission.studentId, Math.min(timestamp, firstReviewByStudent.get(submission.studentId) ?? Infinity));
  }
  return [...firstReviewByStudent.values()].filter((timestamp) => timestamp >= since && timestamp <= now.getTime()).length;
}

function cohortWeek(iso: string) {
  const date = new Date(iso);
  if (!Number.isFinite(date.getTime())) return "data inválida";
  const monday = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const daysSinceMonday = (monday.getUTCDay() + 6) % 7;
  monday.setUTCDate(monday.getUTCDate() - daysSinceMonday);
  return monday.toISOString().slice(0, 10);
}

function signupSource(signup: Signup) {
  return signup.acquisitionSource?.trim().toLowerCase() || "Direto / sem UTM";
}

function buildSignupBreakdown(
  events: ActivityEvent[],
  signups: Signup[],
  now: Date,
  keyForSignup: (signup: Signup) => string,
): CohortMetrics[] {
  const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
  const milestones = new Map<string, { startedAt: number | null; evidenceAt: number | null }>();
  for (const event of events) {
    const current = milestones.get(event.userId) ?? { startedAt: null, evidenceAt: null };
    const timestamp = Date.parse(event.createdAt);
    if (!Number.isFinite(timestamp)) continue;
    if (event.name === "lab_started") current.startedAt = Math.min(timestamp, current.startedAt ?? Infinity);
    if (event.name === "lab_completed") current.evidenceAt = Math.min(timestamp, current.evidenceAt ?? Infinity);
    milestones.set(event.userId, current);
  }

  const groups = new Map<string, { signups: number; eligible: number; started: number; evidence: number; abandoned: number }>();
  const seen = new Set<string>();
  for (const signup of signups) {
    if (seen.has(signup.userId)) continue;
    seen.add(signup.userId);
    const signupAt = Date.parse(signup.createdAt);
    const key = keyForSignup(signup);
    const group = groups.get(key) ?? { signups: 0, eligible: 0, started: 0, evidence: 0, abandoned: 0 };
    group.signups += 1;
    if (Number.isFinite(signupAt) && signupAt + sevenDaysMs <= now.getTime()) {
      group.eligible += 1;
      const userMilestones = milestones.get(signup.userId);
      const startedInWindow = userMilestones?.startedAt !== null && userMilestones?.startedAt !== undefined && userMilestones.startedAt >= signupAt && userMilestones.startedAt <= signupAt + sevenDaysMs;
      const evidenceInWindow = userMilestones?.evidenceAt !== null && userMilestones?.evidenceAt !== undefined && userMilestones.evidenceAt >= signupAt && userMilestones.evidenceAt <= signupAt + sevenDaysMs;
      if (startedInWindow) group.started += 1;
      if (evidenceInWindow) group.evidence += 1;
      if (startedInWindow && !evidenceInWindow) group.abandoned += 1;
    }
    groups.set(key, group);
  }
  return [...groups.entries()].map(([key, group]) => ({
    key,
    signups: group.signups,
    eligibleUsers: group.eligible,
    startedUsers: group.started,
    evidenceUsers: group.evidence,
    abandonedUsers: group.abandoned,
    evidenceRate: group.eligible ? Math.round((group.evidence / group.eligible) * 100) : null,
  })).sort((a, b) => b.key.localeCompare(a.key));
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
