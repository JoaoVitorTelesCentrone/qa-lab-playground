// Acesso ao estado de produto do aluno (matrículas, evidências, cenários).
//
// Toda leitura e escrita de progresso passa por aqui, tanto os Server
// Components quanto os route handlers da API v1. O backend é a fonte de
// verdade: nenhuma dessas funções lê ou escreve em localStorage.

import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { buildJourney, emptyJourney, type Enrollment, type Journey, type ScenarioRun, type Submission } from "./journey";

type SupabaseClient = Awaited<ReturnType<typeof createClient>>;

const SUBMISSION_COLUMNS = "id,lab_slug,result,reproduction,severity,checklist,published,created_at";

export type SessionUser = { id: string; email: string };

/** Usuário da sessão atual, ou null quando não há login (ou Supabase não configurado). */
export async function getSessionUser(): Promise<SessionUser | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  return data.user ? { id: data.user.id, email: data.user.email ?? "" } : null;
}

export async function getJourney(userId: string): Promise<Journey> {
  const supabase = await createClient();
  const [enrollments, submissions, runs] = await Promise.all([
    supabase.from("lab_enrollments").select("lab_slug,status,started_at,completed_at,updated_at").eq("user_id", userId),
    supabase.from("lab_submissions").select(SUBMISSION_COLUMNS).eq("user_id", userId).order("created_at", { ascending: false }),
    supabase.from("scenario_runs").select("app_id,scenario_id,status").eq("user_id", userId),
  ]);
  // Tabela ausente (migração 0004 ainda não aplicada) não pode derrubar a home:
  // sem dados, o aluno vê a jornada vazia e os CTAs de início.
  if (enrollments.error || submissions.error || runs.error) return emptyJourney;
  return buildJourney(toEnrollments(enrollments.data), toSubmissions(submissions.data), toRuns(runs.data));
}

export async function listSubmissions(userId: string, labSlug?: string): Promise<Submission[]> {
  const supabase = await createClient();
  let query = supabase.from("lab_submissions").select(SUBMISSION_COLUMNS).eq("user_id", userId).order("created_at", { ascending: false });
  if (labSlug) query = query.eq("lab_slug", labSlug);
  const { data, error } = await query;
  return error ? [] : toSubmissions(data);
}

/** Estado de um Lab para o aluno: status da matrícula e evidências já entregues. */
export async function getLabState(userId: string, labSlug: string): Promise<{ status: Enrollment["status"] | "nao-iniciado"; submissions: Submission[] }> {
  const supabase = await createClient();
  const [enrollment, submissions] = await Promise.all([
    supabase.from("lab_enrollments").select("status").eq("user_id", userId).eq("lab_slug", labSlug).maybeSingle(),
    listSubmissions(userId, labSlug),
  ]);
  return { status: (enrollment.data?.status as Enrollment["status"]) ?? "nao-iniciado", submissions };
}

/** Matricula o aluno no Lab. Repetir a chamada não reinicia um Lab já concluído. */
export async function startLab(userId: string, labSlug: string) {
  const supabase = await createClient();
  const { data: existing } = await supabase.from("lab_enrollments").select("status").eq("user_id", userId).eq("lab_slug", labSlug).maybeSingle();
  if (existing?.status === "completed") return { status: "completed" as const };
  const { error } = await supabase.from("lab_enrollments").upsert({ user_id: userId, lab_slug: labSlug, status: "started" }, { onConflict: "user_id,lab_slug" });
  if (error) throw new Error(error.message);
  if (!existing) await track(supabase, userId, "lab_started", { lab: labSlug });
  return { status: "started" as const };
}

export type EvidenceInput = {
  labSlug: string;
  result: string;
  reproduction: string;
  severity: Submission["severity"];
  /** Critérios de aceite confirmados. A API só chega aqui se todos estiverem marcados. */
  checklist: string[];
  notes?: string;
  attachments?: Array<{ name: string; url: string }>;
};

/**
 * Salva a evidência e conclui o Lab na mesma operação. Regra de produto:
 * nenhum Lab é concluído sem evidência, por isso a conclusão só acontece
 * depois que a submissão existe e aponta para ela.
 */
export async function submitEvidence(userId: string, input: EvidenceInput) {
  const supabase = await createClient();
  const { data: submission, error } = await supabase
    .from("lab_submissions")
    .insert({ user_id: userId, lab_slug: input.labSlug, result: input.result, reproduction: input.reproduction, severity: input.severity, checklist: input.checklist, notes: input.notes ?? null, attachments: input.attachments ?? [] })
    .select(SUBMISSION_COLUMNS)
    .single();
  if (error || !submission) throw new Error(error?.message ?? "Não foi possível salvar a evidência.");

  const completedAt = new Date().toISOString();
  const { error: enrollmentError } = await supabase
    .from("lab_enrollments")
    .upsert({ user_id: userId, lab_slug: input.labSlug, status: "completed", submission_id: submission.id, completed_at: completedAt }, { onConflict: "user_id,lab_slug" });
  if (enrollmentError) throw new Error(enrollmentError.message);

  await track(supabase, userId, "lab_completed", { lab: input.labSlug, severity: input.severity });
  return toSubmissions([submission])[0];
}

/**
 * Publica ou despublica uma evidência. Só isso: o texto entregue não muda,
 * porque o portfólio mostra a evidência como ela foi registrada.
 */
export async function setSubmissionPublished(userId: string, submissionId: string, published: boolean) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("lab_submissions").update({ published }).eq("user_id", userId).eq("id", submissionId).select("id,published").maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Evidência não encontrada.");
  await track(supabase, userId, published ? "evidence_published" : "evidence_unpublished", { submission: submissionId });
  return data;
}

export type PortfolioSettings = { username: string; portfolioPublic: boolean; portfolioHeadline: string };

/** Nome de usuário do portfólio: minúsculas, números e hífen. */
export function normalizeUsername(value: string) {
  return value.trim().toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "").replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 30);
}

export async function savePortfolioSettings(userId: string, patch: Partial<PortfolioSettings>) {
  const supabase = await createClient();
  const update: Record<string, unknown> = {};
  if (patch.username !== undefined) update.username = normalizeUsername(patch.username) || null;
  if (patch.portfolioPublic !== undefined) update.portfolio_public = patch.portfolioPublic;
  if (patch.portfolioHeadline !== undefined) update.portfolio_headline = patch.portfolioHeadline.trim().slice(0, 160) || null;

  const { data, error } = await supabase.from("profiles").update(update).eq("id", userId).select("username,portfolio_public,portfolio_headline").maybeSingle();
  // O índice único de username é quem garante que dois portfólios não colidam.
  if (error) throw new Error(error.code === "23505" ? "Este nome de usuário já está em uso." : error.message);
  if (!data) throw new Error("Perfil não encontrado.");
  return { username: data.username ?? "", portfolioPublic: Boolean(data.portfolio_public), portfolioHeadline: data.portfolio_headline ?? "" };
}

/** Execuções de cenário do aluno, indexadas por `appId:scenarioId`. */
export async function getScenarioRuns(userId: string): Promise<Record<string, ScenarioRun["status"]>> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("scenario_runs").select("app_id,scenario_id,status").eq("user_id", userId);
  if (error) return {};
  return Object.fromEntries((data ?? []).map((row) => [`${row.app_id}:${row.scenario_id}`, row.status as ScenarioRun["status"]]));
}

export async function recordScenarioRun(userId: string, run: ScenarioRun & { notes?: string }) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("scenario_runs")
    .upsert({ user_id: userId, app_id: run.appId, scenario_id: run.scenarioId, status: run.status, notes: run.notes ?? null }, { onConflict: "user_id,app_id,scenario_id" });
  if (error) throw new Error(error.message);
  await track(supabase, userId, "scenario_run", { app: run.appId, scenario: run.scenarioId, status: run.status });
}

/** Desfaz a marcação de um cenário — o aluno pode ter clicado no resultado errado. */
export async function clearScenarioRun(userId: string, appId: string, scenarioId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("scenario_runs").delete().eq("user_id", userId).eq("app_id", appId).eq("scenario_id", scenarioId);
  if (error) throw new Error(error.message);
}

/** Telemetria de ativação. Nunca deve quebrar o fluxo do aluno. */
async function track(supabase: SupabaseClient, userId: string, name: string, props: Record<string, unknown>) {
  await supabase.from("activity_events").insert({ user_id: userId, name, props }).then(undefined, () => undefined);
}

/** Mesma telemetria, para quem já tem o usuário mas não o cliente do Supabase. */
export async function trackEvent(userId: string, name: string, props: Record<string, unknown> = {}) {
  try {
    await track(await createClient(), userId, name, props);
  } catch {
    // Telemetria nunca derruba a operação que a originou.
  }
}

type EnrollmentRow = { lab_slug: string; status: string; started_at: string; completed_at: string | null; updated_at: string };
type SubmissionRow = { id: string; lab_slug: string; result: string; reproduction: string; severity: string; checklist: unknown; published?: boolean | null; created_at: string };
type RunRow = { app_id: string; scenario_id: string; status: string };

function toEnrollments(rows: EnrollmentRow[] | null): Enrollment[] {
  return (rows ?? []).map((row) => ({ labSlug: row.lab_slug, status: row.status as Enrollment["status"], startedAt: row.started_at, completedAt: row.completed_at, updatedAt: row.updated_at }));
}

function toSubmissions(rows: SubmissionRow[] | null): Submission[] {
  // `checklist` é jsonb: uma migração pendente ou uma linha antiga chegam como
  // null, e nesse caso o histórico só não mostra os critérios confirmados.
  return (rows ?? []).map((row) => ({ id: row.id, labSlug: row.lab_slug, result: row.result, reproduction: row.reproduction, severity: row.severity as Submission["severity"], checklist: Array.isArray(row.checklist) ? row.checklist.filter((item): item is string => typeof item === "string") : [], createdAt: row.created_at, published: Boolean(row.published) }));
}

function toRuns(rows: RunRow[] | null): ScenarioRun[] {
  return (rows ?? []).map((row) => ({ appId: row.app_id, scenarioId: row.scenario_id, status: row.status as ScenarioRun["status"] }));
}
