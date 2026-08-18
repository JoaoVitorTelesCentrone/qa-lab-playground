// Acesso ao estado de produto do aluno (matrículas, evidências, cenários).
//
// Toda leitura e escrita de progresso passa por aqui, tanto os Server
// Components quanto os route handlers da API v1. O backend é a fonte de
// verdade: nenhuma dessas funções lê ou escreve em localStorage.

import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { buildJourney, emptyJourney, type Enrollment, type Journey, type ScenarioRun, type Submission } from "./journey";
import { certificateCode, isCertificateCode, normalizeCode } from "./certificate";
import { normalizeUsername } from "./username";
import { isMissingTable, normalizeSectionBody, normalizeSectionTitle, sortSections, SECTION_LIMITS, type PortfolioSection } from "./portfolio-sections";

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

/** Primeiro nome do perfil, para saudação — cai pro e-mail quando ainda não foi preenchido. */
export async function getDisplayName(userId: string, fallbackEmail: string) {
  const supabase = await createClient();
  const { data } = await supabase.from("profiles").select("full_name").eq("id", userId).maybeSingle();
  const name = data?.full_name?.trim();
  return name ? name.split(" ")[0] : fallbackEmail.split("@")[0];
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

export { normalizeUsername } from "./username";

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

// ============================================================
// Seções livres do portfólio
// ============================================================
// Enquanto a migração 0011 não sobe, a tabela não existe: a leitura devolve
// `available: false` e o editor explica o que falta, em vez de a página inteira
// quebrar. Ver lib/product/portfolio-sections.ts.

const SECTION_COLUMNS = "id,title,body,position,visible";

type SectionRow = { id: string; title: string; body: string | null; position: number | null; visible: boolean | null };

function toSection(row: SectionRow): PortfolioSection {
  return { id: row.id, title: row.title, body: row.body ?? "", position: row.position ?? 0, visible: row.visible !== false };
}

export type PortfolioSectionsResult = { sections: PortfolioSection[]; available: boolean };

export async function listPortfolioSections(userId: string): Promise<PortfolioSectionsResult> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("portfolio_sections").select(SECTION_COLUMNS).eq("user_id", userId).order("position");
  if (error) return { sections: [], available: !isMissingTable(error) };
  return { sections: sortSections((data ?? []).map((row) => toSection(row as SectionRow))), available: true };
}

/** Seções visíveis de um portfólio público. Leitura anônima, garantida por RLS. */
export async function listPublicPortfolioSections(userId: string): Promise<PortfolioSection[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("portfolio_sections").select(SECTION_COLUMNS).eq("user_id", userId).eq("visible", true).order("position");
  if (error) return [];
  return sortSections((data ?? []).map((row) => toSection(row as SectionRow)));
}

export async function createPortfolioSection(userId: string, input: { title: string; body: string }): Promise<PortfolioSection> {
  const supabase = await createClient();
  const { count } = await supabase.from("portfolio_sections").select("id", { count: "exact", head: true }).eq("user_id", userId);
  if ((count ?? 0) >= SECTION_LIMITS.max) throw new Error(`Você já tem ${SECTION_LIMITS.max} seções. Apague uma para criar outra.`);

  const { data, error } = await supabase
    .from("portfolio_sections")
    .insert({ user_id: userId, title: normalizeSectionTitle(input.title), body: normalizeSectionBody(input.body), position: count ?? 0, visible: true })
    .select(SECTION_COLUMNS)
    .maybeSingle();
  if (error) throw new Error(isMissingTable(error) ? "Seções ainda não estão disponíveis: falta aplicar a migração 0011_portfolio_sections." : error.message);
  if (!data) throw new Error("Não foi possível criar a seção.");
  await track(supabase, userId, "portfolio_section_created", { section: (data as SectionRow).id });
  return toSection(data as SectionRow);
}

export async function updatePortfolioSection(userId: string, id: string, patch: Partial<Pick<PortfolioSection, "title" | "body" | "visible">>): Promise<PortfolioSection> {
  const supabase = await createClient();
  const update: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (patch.title !== undefined) update.title = normalizeSectionTitle(patch.title);
  if (patch.body !== undefined) update.body = normalizeSectionBody(patch.body);
  if (patch.visible !== undefined) update.visible = patch.visible;

  const { data, error } = await supabase.from("portfolio_sections").update(update).eq("user_id", userId).eq("id", id).select(SECTION_COLUMNS).maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Seção não encontrada.");
  if (patch.visible !== undefined) await track(supabase, userId, patch.visible ? "portfolio_section_shown" : "portfolio_section_hidden", { section: id });
  return toSection(data as SectionRow);
}

export async function deletePortfolioSection(userId: string, id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("portfolio_sections").delete().eq("user_id", userId).eq("id", id).select("id").maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Seção não encontrada.");
  await track(supabase, userId, "portfolio_section_deleted", { section: id });
  return { id };
}

/** Grava a ordem enviada pelo editor. Ids de outra pessoa não passam pela RLS. */
export async function reorderPortfolioSections(userId: string, ids: string[]): Promise<PortfolioSection[]> {
  const supabase = await createClient();
  for (const [position, id] of ids.entries()) {
    const { error } = await supabase.from("portfolio_sections").update({ position }).eq("user_id", userId).eq("id", id);
    if (error) throw new Error(error.message);
  }
  const { sections } = await listPortfolioSections(userId);
  return sections;
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

// ============================================================
// Certificados de trilha
// ============================================================

export type StoredCertificate = { code: string; trackSlug: string; holderName: string; labs: number; evidence: number; issuedAt: string };

type CertificateRow = { code: string; track_slug: string; holder_name: string; labs_completed: number | null; evidence_count: number | null; issued_at: string };

function toCertificate(row: CertificateRow): StoredCertificate {
  return { code: row.code, trackSlug: row.track_slug, holderName: row.holder_name, labs: row.labs_completed ?? 0, evidence: row.evidence_count ?? 0, issuedAt: row.issued_at };
}

const CERTIFICATE_COLUMNS = "code,track_slug,holder_name,labs_completed,evidence_count,issued_at";

/** Certificados já emitidos para o aluno. Tabela ausente devolve lista vazia. */
export async function listCertificates(userId: string): Promise<StoredCertificate[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("track_certificates").select(CERTIFICATE_COLUMNS).eq("user_id", userId).order("issued_at", { ascending: false });
  return error ? [] : (data ?? []).map(toCertificate);
}

/**
 * Emite ou atualiza o certificado da trilha. Reemitir mantém o código: o link
 * que o aluno já publicou no LinkedIn não pode deixar de resolver porque ele
 * entregou mais uma evidência depois.
 */
export async function issueCertificate(userId: string, input: { trackSlug: string; holderName: string; labs: number; evidence: number }): Promise<StoredCertificate> {
  const supabase = await createClient();

  const { data: existing } = await supabase.from("track_certificates").select(CERTIFICATE_COLUMNS).eq("user_id", userId).eq("track_slug", input.trackSlug).maybeSingle();
  if (existing) {
    const { data, error } = await supabase
      .from("track_certificates")
      .update({ labs_completed: input.labs, evidence_count: input.evidence, holder_name: input.holderName })
      .eq("user_id", userId)
      .eq("track_slug", input.trackSlug)
      .select(CERTIFICATE_COLUMNS)
      .single();
    if (error) throw new Error(error.message);
    return toCertificate(data);
  }

  // Colisão de código é improvável (32^8), mas o unique existe e uma segunda
  // tentativa custa menos que um erro na cara do aluno.
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const { data, error } = await supabase
      .from("track_certificates")
      .insert({ user_id: userId, track_slug: input.trackSlug, code: certificateCode(), holder_name: input.holderName, labs_completed: input.labs, evidence_count: input.evidence })
      .select(CERTIFICATE_COLUMNS)
      .single();
    if (!error && data) {
      await track(supabase, userId, "certificate_issued", { track: input.trackSlug, labs: input.labs });
      return toCertificate(data);
    }
    // 42P01 = tabela ausente: a migração 0009 ainda não foi aplicada no projeto.
    if (error?.code === "42P01") throw new Error("O certificado ainda não está disponível neste ambiente.");
    if (error && error.code !== "23505") throw new Error(error.message);
    // 23505 no par (user_id, track_slug) significa emissão concorrente: o
    // certificado do outro request já vale, então devolvemos ele.
    const { data: raced } = await supabase.from("track_certificates").select(CERTIFICATE_COLUMNS).eq("user_id", userId).eq("track_slug", input.trackSlug).maybeSingle();
    if (raced) return toCertificate(raced);
  }
  throw new Error("Não foi possível emitir o certificado. Tente novamente.");
}

/**
 * Verificação pública por código. Passa pela função `certificate_by_code`
 * (security definer) porque a tabela não abre select para anônimo — quem tem o
 * código lê aquele certificado, e ninguém consegue listar os demais.
 */
export async function getCertificateByCode(code: string): Promise<StoredCertificate | null> {
  if (!isCertificateCode(code)) return null;
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("certificate_by_code", { lookup_code: normalizeCode(code) });
  if (error || !data || data.length === 0) return null;
  return toCertificate(data[0] as CertificateRow);
}
