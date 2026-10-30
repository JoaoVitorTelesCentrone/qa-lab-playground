// Acesso ao estado de produto do aluno (matrículas, evidências, cenários).
//
// Toda leitura e escrita de progresso passa por aqui, tanto os Server
// Components quanto os route handlers da API v1. O backend é a fonte de
// verdade: nenhuma dessas funções lê ou escreve em localStorage.

import { createClient } from "@/lib/supabase/server";
import { evidenceFilesExist, removeEvidenceFile, removeEvidenceFiles, reserveEvidenceUpload, signOwnAttachments } from "./evidence-storage";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { buildJourney, emptyJourney, toAttachments, type Attachment, type Enrollment, type Journey, type ScenarioRun, type Submission } from "./journey";
import { certificateCode, isCertificateCode, normalizeCode } from "./certificate";
import { normalizeUsername } from "./username";
import { isMissingTable, normalizeSectionBody, normalizeSectionTitle, sortSections, SECTION_LIMITS, type PortfolioSection } from "./portfolio-sections";
import { MAX_PORTFOLIO_PROJECT_IMAGE_BYTES, MAX_PORTFOLIO_PROJECT_MEDIA, MAX_PORTFOLIO_PROJECT_MEDIA_BYTES, MAX_PORTFOLIO_PROJECT_MEDIA_TOTAL_BYTES, normalizePortfolioProjectMedia, portfolioProjectMediaFolder, type PortfolioProjectDraft, type PortfolioProjectDraftInput, type PortfolioProjectMedia } from "./portfolio-projects";
import { isOwnEvidencePath } from "./evidence-attachments";

type SupabaseClient = Awaited<ReturnType<typeof createClient>>;

const SUBMISSION_COLUMNS = "id,lab_slug,evidence,attachments,published,created_at";

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
  if (error) return [];

  // O bucket é privado: o que está gravado é o caminho, e a URL vale por uma
  // hora. Uma assinatura em lote para a lista inteira, não uma por anexo.
  const submissions = toSubmissions(data);
  const files = submissions.flatMap((item) => item.attachments);
  if (files.length === 0) return submissions;

  const signed = await signOwnAttachments(files);
  let cursor = 0;
  return submissions.map((item) => ({
    ...item,
    attachments: item.attachments.map(() => signed[cursor++]),
  }));
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
  /** Texto livre da evidência. Pode vir vazio quando há anexo. */
  evidence: string;
  attachments: Attachment[];
};

/**
 * Salva a evidência e conclui o Lab na mesma operação. Regra de produto:
 * nenhum Lab é concluído sem evidência, por isso a conclusão só acontece
 * depois que a submissão existe e aponta para ela.
 */
export async function submitEvidence(input: EvidenceInput) {
  const supabase = await createClient();
  const { data: submission, error } = await supabase.rpc("complete_lab_submission", {
    p_lab_slug: input.labSlug,
    p_evidence: input.evidence,
    p_attachments: input.attachments,
  });
  if (error || !submission) throw new Error(error?.message ?? "Não foi possível salvar a evidência.");
  return toSubmissions([submission])[0];
}

export async function getSubmissionLabSlug(userId: string, submissionId: string): Promise<string | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("lab_submissions").select("lab_slug").eq("user_id", userId).eq("id", submissionId).maybeSingle();
  if (error) throw new Error(error.message);
  return data?.lab_slug ?? null;
}

/**
 * Corrige uma entrega já registrada. A evidência virou um campo livre grande
 * com arquivos: sem edição, um typo ou um print errado ficaria para sempre no
 * que o recrutador abre, e o aluno só teria a saída de empilhar outra entrega.
 *
 * Não mexe em `published` nem em `created_at` — corrigir não é republicar, e a
 * data continua sendo a de quando o trabalho foi feito.
 */
export async function updateSubmission(userId: string, submissionId: string, input: { evidence: string; attachments: Attachment[] }) {
  const supabase = await createClient();

  // Os anexos que sumiram da lista saem do Storage junto: editar tirando um
  // print não pode deixar o arquivo pago para trás.
  const { data: current } = await supabase
    .from("lab_submissions")
    .select("attachments")
    .eq("user_id", userId)
    .eq("id", submissionId)
    .maybeSingle();
  if (!current) throw new Error("Evidência não encontrada.");

  const kept = new Set(input.attachments.map((file) => file.path));
  const dropped = toAttachments(current.attachments).filter((file) => file.path && !kept.has(file.path));

  const { data, error } = await supabase
    .from("lab_submissions")
    .update({ evidence: input.evidence, attachments: input.attachments })
    .eq("user_id", userId)
    .eq("id", submissionId)
    .select(SUBMISSION_COLUMNS)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Evidência não encontrada.");

  if (dropped.length > 0) await removeEvidenceFiles(dropped.map((file) => file.path));
  await track(supabase, userId, "evidence_updated", { submission: submissionId });
  return toSubmissions([data])[0];
}

/**
 * Apaga uma entrega e os arquivos dela.
 *
 * Se era a última daquele Lab, a matrícula volta para "started": a regra do
 * produto é que nenhum Lab fica concluído sem evidência, então deixar o status
 * em "completed" com zero entregas mentiria no progresso e no certificado.
 */
export async function deleteSubmission(userId: string, submissionId: string) {
  const supabase = await createClient();

  const { data: current } = await supabase
    .from("lab_submissions")
    .select("id,lab_slug,attachments")
    .eq("user_id", userId)
    .eq("id", submissionId)
    .maybeSingle();
  if (!current) throw new Error("Evidência não encontrada.");

  const { error } = await supabase.from("lab_submissions").delete().eq("user_id", userId).eq("id", submissionId);
  if (error) throw new Error(error.message);

  const files = toAttachments(current.attachments).map((file) => file.path).filter(Boolean);
  if (files.length > 0) await removeEvidenceFiles(files);

  const { count } = await supabase
    .from("lab_submissions")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("lab_slug", current.lab_slug);

  if ((count ?? 0) === 0) {
    await supabase
      .from("lab_enrollments")
      .update({ status: "started", completed_at: null, submission_id: null })
      .eq("user_id", userId)
      .eq("lab_slug", current.lab_slug);
  }

  await track(supabase, userId, "evidence_deleted", { lab: current.lab_slug });
  return { id: submissionId, labSlug: current.lab_slug as string, labReopened: (count ?? 0) === 0 };
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
  await track(supabase, userId, published ? "case_published" : "evidence_unpublished", { submission: submissionId });
  return data;
}

export async function getPortfolioCaseDraft(userId: string, submissionId: string): Promise<{ customization: Record<string, string>; hasUnpublishedChanges: boolean }> {
  const supabase = await createClient();
  const [draft, submission] = await Promise.all([
    supabase.from("portfolio_case_drafts").select("customization").eq("user_id", userId).eq("submission_id", submissionId).maybeSingle(),
    supabase.from("lab_submissions").select("published,published_portfolio_case").eq("user_id", userId).eq("id", submissionId).maybeSingle(),
  ]);
  const parse = (value: unknown) => value && typeof value === "object" && !Array.isArray(value)
    ? Object.fromEntries(Object.entries(value).filter((entry): entry is [string, string] => typeof entry[1] === "string"))
    : {};
  const customization = draft.error ? {} : parse(draft.data?.customization);
  const published = parse(submission.data?.published_portfolio_case);
  const fields = ["title", "context", "approach", "findings", "decision", "reflection"];
  const hasUnpublishedChanges = Boolean(submission.data?.published && fields.some((field) => customization[field] !== published[field]));
  return { customization, hasUnpublishedChanges };
}

export async function savePortfolioCaseDraft(userId: string, submissionId: string, customization: Record<string, string>) {
  const supabase = await createClient();
  const { error } = await supabase.from("portfolio_case_drafts").upsert({
    submission_id: submissionId,
    user_id: userId,
    customization,
    updated_at: new Date().toISOString(),
  }, { onConflict: "submission_id" });
  if (error) throw new Error(error.message);
}

const PROJECT_COLUMNS = "id,user_id,source,name,summary,role,period,links,media,case_submission_ids,sort_order,updated_at";

function toPortfolioProjectDraft(row: Record<string, unknown>, publishedIds: Set<string>): PortfolioProjectDraft {
  return {
    id: String(row.id),
    sortOrder: Number.isFinite(Number(row.sort_order)) ? Number(row.sort_order) : 0,
    source: row.source === "profissional" ? "profissional" : "pessoal",
    name: String(row.name ?? ""),
    summary: String(row.summary ?? ""),
    role: String(row.role ?? ""),
    period: String(row.period ?? ""),
    links: Array.isArray(row.links) ? row.links.filter((value): value is string => typeof value === "string") : [],
    media: normalizePortfolioProjectMedia(row.media, String(row.user_id ?? ""), String(row.id)) ?? [],
    caseSubmissionIds: Array.isArray(row.case_submission_ids) ? row.case_submission_ids.map(String) : [],
    published: publishedIds.has(String(row.id)),
    updatedAt: String(row.updated_at ?? ""),
  };
}

export async function listPortfolioProjects(userId: string): Promise<PortfolioProjectDraft[]> {
  const supabase = await createClient();
  const [projects, publications] = await Promise.all([
    supabase.from("portfolio_projects").select(PROJECT_COLUMNS).eq("user_id", userId).order("sort_order", { ascending: true }).order("updated_at", { ascending: false }),
    supabase.from("portfolio_project_publications").select("project_id").eq("user_id", userId),
  ]);
  if (projects.error) return [];
  const publishedIds = new Set((publications.data ?? []).map((row) => String(row.project_id)));
  const drafts = (projects.data ?? []).map((row) => toPortfolioProjectDraft(row as Record<string, unknown>, publishedIds));
  const media = drafts.flatMap((project) => project.media);
  if (media.length === 0) return drafts;
  const signed = await signOwnAttachments(media);
  let cursor = 0;
  return drafts.map((project) => ({ ...project, media: project.media.map((file) => ({ ...file, ...signed[cursor++] })) }));
}

export type PortfolioProjectInput = PortfolioProjectDraftInput;

export async function reorderPortfolioProjects(projectIds: string[]) {
  const supabase = await createClient();
  const { error } = await supabase.rpc("reorder_portfolio_projects", { project_ids: projectIds });
  if (error) throw new Error(error.message);
  return { projectIds };
}

export async function createPortfolioProject(userId: string, input: PortfolioProjectInput): Promise<PortfolioProjectDraft> {
  const supabase = await createClient();
  const { data: existing, error: existingError } = await supabase.from("portfolio_projects").select("sort_order").eq("user_id", userId).order("sort_order", { ascending: false }).limit(1).maybeSingle();
  if (existingError) throw new Error(existingError.message);
  const { data, error } = await supabase.from("portfolio_projects").insert({
    user_id: userId,
    source: input.source,
    name: input.name,
    summary: input.summary,
    role: input.role,
    period: input.period,
    links: input.links,
    case_submission_ids: input.caseSubmissionIds,
    sort_order: Number(existing?.sort_order ?? -1) + 1,
  }).select(PROJECT_COLUMNS).single();
  if (error || !data) throw new Error(error?.message ?? "Não foi possível criar o projeto.");
  return toPortfolioProjectDraft(data as Record<string, unknown>, new Set());
}

const PROJECT_MEDIA_EXTENSIONS: Record<string, string> = {
  "image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp", "video/mp4": ".mp4", "video/webm": ".webm",
};

function checkProjectMediaLimits(current: PortfolioProjectMedia[], size: number, type: string) {
  if (current.length >= MAX_PORTFOLIO_PROJECT_MEDIA) throw new Error(`Cada projeto pode ter até ${MAX_PORTFOLIO_PROJECT_MEDIA} mídias.`);
  if (!Number.isSafeInteger(size) || size <= 0) throw new Error("O arquivo está vazio ou tem tamanho inválido.");
  if (size > MAX_PORTFOLIO_PROJECT_MEDIA_BYTES) throw new Error("O arquivo passou do limite de 10 MB.");
  if (!PROJECT_MEDIA_EXTENSIONS[type]) throw new Error("Use uma imagem JPG, PNG ou WebP, ou um vídeo MP4 ou WebM.");
  if (type.startsWith("image/") && size > MAX_PORTFOLIO_PROJECT_IMAGE_BYTES) throw new Error("A imagem precisa ficar abaixo de 3 MB. Reduza as dimensões ou exporte em WebP.");
  if (current.reduce((total, item) => total + item.size, size) > MAX_PORTFOLIO_PROJECT_MEDIA_TOTAL_BYTES) throw new Error("O projeto pode armazenar até 20 MB de mídia no total.");
}

async function projectMediaDraft(userId: string, projectId: string) {
  const supabase = await createClient();
  const { data: project, error: projectError } = await supabase.from("portfolio_projects").select("id,media").eq("user_id", userId).eq("id", projectId).maybeSingle();
  if (projectError || !project) throw new Error("Projeto não encontrado.");
  const current = normalizePortfolioProjectMedia(project.media, userId, projectId);
  if (!current) throw new Error("A lista de mídias deste projeto precisa ser revisada.");
  return { supabase, current };
}

export async function preparePortfolioProjectMediaUpload(userId: string, projectId: string, size: number, type: string) {
  const { current } = await projectMediaDraft(userId, projectId);
  checkProjectMediaLimits(current, size, type);
  const path = `${userId}/${portfolioProjectMediaFolder(projectId)}/${crypto.randomUUID()}${PROJECT_MEDIA_EXTENSIONS[type]}`;
  await reserveEvidenceUpload(userId, path, size, type);
  return { path };
}

export async function finalizePortfolioProjectMediaUpload(userId: string, projectId: string, path: string, name: string) {
  if (!isOwnEvidencePath(path, userId, portfolioProjectMediaFolder(projectId))) throw new Error("Caminho da mídia inválido.");
  if (!name.trim() || name.length > 180) throw new Error("Nome da mídia inválido.");
  const { supabase, current } = await projectMediaDraft(userId, projectId);
  if (current.some((file) => file.path === path)) throw new Error("Esta mídia já foi adicionada.");
  const { data: stored, error: storageError } = await supabase.storage.from("lab-evidence").info(path);
  if (storageError || !stored) throw new Error("Arquivo não encontrado no Storage. Envie novamente.");
  if (typeof stored.size !== "number" || typeof stored.contentType !== "string") throw new Error("Não foi possível conferir tamanho e tipo do arquivo.");
  checkProjectMediaLimits(current, stored.size, stored.contentType);
  if (!path.endsWith(PROJECT_MEDIA_EXTENSIONS[stored.contentType])) throw new Error("O tipo do arquivo não corresponde ao caminho enviado.");
  const attachment = { name: name.trim(), url: "", path, size: stored.size, type: stored.contentType };
  const next: PortfolioProjectMedia[] = [...current, { ...attachment, url: "", visibility: "private", isCover: false }];
  const { error } = await supabase.from("portfolio_projects").update({ media: next, updated_at: new Date().toISOString() }).eq("user_id", userId).eq("id", projectId);
  if (error) throw new Error(error.message);
  const [signed] = await signOwnAttachments([attachment]);
  return { ...signed, visibility: "private" as const, isCover: false };
}

export async function setPortfolioProjectMediaVisibility(userId: string, projectId: string, path: string, visibility: "private" | "public") {
  const supabase = await createClient();
  const { data: project, error } = await supabase.from("portfolio_projects").select("id,media").eq("user_id", userId).eq("id", projectId).maybeSingle();
  if (error || !project) throw new Error("Projeto não encontrado.");
  const current = normalizePortfolioProjectMedia(project.media, userId, projectId);
  if (!current) throw new Error("A lista de mídias deste projeto precisa ser revisada.");
  if (!current.some((file) => file.path === path)) throw new Error("Mídia não encontrada.");
  const next = current.map((file) => file.path === path ? { ...file, visibility, isCover: visibility === "private" ? false : file.isCover } : file);

  // Tornar privado tira o arquivo da publicação imediatamente, mesmo que a
  // pessoa ainda não tenha atualizado o projeto. Tornar público exige publicar
  // um novo snapshot.
  if (visibility === "private") {
    const { data: publication, error: publicationError } = await supabase.from("portfolio_project_publications").select("media").eq("user_id", userId).eq("project_id", projectId).maybeSingle();
    if (publicationError) throw new Error(publicationError.message);
    const publishedMedia = normalizePortfolioProjectMedia(publication?.media, userId, projectId);
    if (publishedMedia?.some((file) => file.path === path)) {
      const { error: publicationUpdateError } = await supabase.from("portfolio_project_publications").update({ media: publishedMedia.filter((file) => file.path !== path) }).eq("user_id", userId).eq("project_id", projectId);
      if (publicationUpdateError) throw new Error(publicationUpdateError.message);
    }
  }
  const { error: updateError } = await supabase.from("portfolio_projects").update({ media: next, updated_at: new Date().toISOString() }).eq("user_id", userId).eq("id", projectId);
  if (updateError) throw new Error(updateError.message);
  return { media: next };
}

export async function setPortfolioProjectMediaCover(userId: string, projectId: string, path: string, isCover: boolean) {
  const supabase = await createClient();
  const { data: project, error } = await supabase.from("portfolio_projects").select("id,media").eq("user_id", userId).eq("id", projectId).maybeSingle();
  if (error || !project) throw new Error("Projeto não encontrado.");
  const current = normalizePortfolioProjectMedia(project.media, userId, projectId);
  if (!current) throw new Error("A lista de mídias deste projeto precisa ser revisada.");
  const selected = current.find((file) => file.path === path);
  if (!selected) throw new Error("Mídia não encontrada.");
  if (isCover && !selected.type.startsWith("image/")) throw new Error("Escolha uma imagem pública para a capa.");
  if (isCover && selected.visibility !== "public") throw new Error("Torne a imagem pública antes de usá-la como capa.");
  const next = current.map((file) => ({ ...file, isCover: isCover && file.path === path }));
  const { error: updateError } = await supabase.from("portfolio_projects").update({ media: next, updated_at: new Date().toISOString() }).eq("user_id", userId).eq("id", projectId);
  if (updateError) throw new Error(updateError.message);
  return { media: next };
}

export async function removePortfolioProjectMedia(userId: string, projectId: string, path: string) {
  const supabase = await createClient();
  const { data: project, error } = await supabase.from("portfolio_projects").select("id,media").eq("user_id", userId).eq("id", projectId).maybeSingle();
  if (error || !project) throw new Error("Projeto não encontrado.");
  const current = normalizePortfolioProjectMedia(project.media, userId, projectId);
  if (!current) throw new Error("A lista de mídias deste projeto precisa ser revisada.");
  if (!current.some((file) => file.path === path)) throw new Error("Mídia não encontrada.");
  const next = current.filter((file) => file.path !== path);
  const { error: updateError } = await supabase.from("portfolio_projects").update({ media: next, updated_at: new Date().toISOString() }).eq("user_id", userId).eq("id", projectId);
  if (updateError) throw new Error(updateError.message);

  const { data: publication, error: publicationError } = await supabase.from("portfolio_project_publications").select("media").eq("user_id", userId).eq("project_id", projectId).maybeSingle();
  const publishedMedia = normalizePortfolioProjectMedia(publication?.media, userId, projectId) ?? [];
  if (!publicationError && !publishedMedia.some((file) => file.path === path)) await removeEvidenceFile(path);
  return { media: next };
}

export async function updatePortfolioProject(userId: string, projectId: string, input: PortfolioProjectInput): Promise<PortfolioProjectDraft> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("portfolio_projects").update({
    source: input.source,
    name: input.name,
    summary: input.summary,
    role: input.role,
    period: input.period,
    links: input.links,
    case_submission_ids: input.caseSubmissionIds,
    updated_at: new Date().toISOString(),
  }).eq("user_id", userId).eq("id", projectId).select(PROJECT_COLUMNS).maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Projeto não encontrado.");
  return toPortfolioProjectDraft(data as Record<string, unknown>, new Set());
}

export async function setPortfolioProjectPublished(userId: string, projectId: string, published: boolean) {
  const supabase = await createClient();
  if (!published) {
    const { error } = await supabase.from("portfolio_project_publications").delete().eq("user_id", userId).eq("project_id", projectId);
    if (error) throw new Error(error.message);
    return { published: false };
  }

  const { data: project, error: projectError } = await supabase.from("portfolio_projects").select(PROJECT_COLUMNS).eq("user_id", userId).eq("id", projectId).maybeSingle();
  if (projectError || !project) throw new Error("Projeto não encontrado.");
  const ids = Array.isArray(project.case_submission_ids) ? project.case_submission_ids.map(String) : [];
  if (ids.length > 0) {
    const { data: cases, error: casesError } = await supabase.from("lab_submissions").select("id").eq("user_id", userId).eq("published", true).in("id", ids);
    if (casesError || (cases ?? []).length !== new Set(ids).size) throw new Error("Todos os cases vinculados precisam estar publicados no seu portfólio.");
  }
  const media = normalizePortfolioProjectMedia(project.media, userId, projectId);
  if (!media) throw new Error("A lista de mídias deste projeto precisa ser revisada.");
  if (!(await evidenceFilesExist(media))) throw new Error("Uma mídia não está mais disponível no Storage. Remova e envie o arquivo novamente.");
  const publicMedia = media.filter((file) => file.visibility === "public");
  const { data: previousPublication } = await supabase.from("portfolio_project_publications").select("media").eq("user_id", userId).eq("project_id", projectId).maybeSingle();
  const previousMedia = normalizePortfolioProjectMedia(previousPublication?.media, userId, projectId) ?? [];
  const snapshot = {
    project_id: project.id,
    user_id: userId,
    source: project.source,
    name: project.name,
    summary: project.summary,
    role: project.role,
    period: project.period,
    links: project.links,
    sort_order: project.sort_order,
    media: publicMedia,
    case_submission_ids: ids,
    published_at: new Date().toISOString(),
  };
  const { error } = await supabase.from("portfolio_project_publications").upsert(snapshot, { onConflict: "project_id" });
  if (error) throw new Error(error.message);
  if (!previousPublication) await track(supabase, userId, "case_published", { project: projectId });
  const keep = new Set(media.map((file) => file.path));
  await removeEvidenceFiles(previousMedia.filter((file) => !keep.has(file.path)).map((file) => file.path));
  return { published: true };
}

export async function deletePortfolioProject(userId: string, projectId: string) {
  const supabase = await createClient();
  const [{ data: project }, { data: publication }] = await Promise.all([
    supabase.from("portfolio_projects").select("media").eq("user_id", userId).eq("id", projectId).maybeSingle(),
    supabase.from("portfolio_project_publications").select("media").eq("user_id", userId).eq("project_id", projectId).maybeSingle(),
  ]);
  if (!project) throw new Error("Projeto não encontrado.");
  const media = [
    ...(normalizePortfolioProjectMedia(project.media, userId, projectId) ?? []),
    ...(normalizePortfolioProjectMedia(publication?.media, userId, projectId) ?? []),
  ];
  const { data, error } = await supabase.from("portfolio_projects").delete().eq("user_id", userId).eq("id", projectId).select("id").maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Projeto não encontrado.");
  await removeEvidenceFiles([...new Set(media.map((file) => file.path))]);
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

/** Salva até três cases publicados, preservando a ordem escolhida pela pessoa. */
export async function saveFeaturedPortfolioCases(userId: string, submissionIds: string[]) {
  const supabase = await createClient();
  if (submissionIds.length > 0) {
    const { data, error } = await supabase.from("lab_submissions").select("id").eq("user_id", userId).eq("published", true).in("id", submissionIds);
    if (error) throw new Error(error.message);
    if ((data ?? []).length !== submissionIds.length) throw new Error("Escolha apenas cases publicados no seu portfólio.");
  }

  const { data, error } = await supabase.from("profiles").update({ portfolio_featured_submission_ids: submissionIds }).eq("id", userId).select("portfolio_featured_submission_ids").maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Perfil não encontrado.");
  return { submissionIds: data.portfolio_featured_submission_ids as string[] };
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
type SubmissionRow = { id: string; lab_slug: string; evidence: string | null; attachments: unknown; published?: boolean | null; created_at: string };
type RunRow = { app_id: string; scenario_id: string; status: string };

function toEnrollments(rows: EnrollmentRow[] | null): Enrollment[] {
  return (rows ?? []).map((row) => ({ labSlug: row.lab_slug, status: row.status as Enrollment["status"], startedAt: row.started_at, completedAt: row.completed_at, updatedAt: row.updated_at }));
}

function toSubmissions(rows: SubmissionRow[] | null): Submission[] {
  return (rows ?? []).map((row) => ({ id: row.id, labSlug: row.lab_slug, evidence: row.evidence ?? "", attachments: toAttachments(row.attachments), createdAt: row.created_at, published: Boolean(row.published) }));
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
