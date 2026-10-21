import { randomUUID } from "node:crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { getDisplayName, trackEvent } from "@/lib/product/store";
import { findMentorshipAssignment, findMentorshipLesson, findMentorshipWeek, mentorshipTrackForWeek, mentorshipWeeks } from "./catalog";
import { findPathV2Assignment, findPathV2Lesson, pathV2Assignments, pathV2Chapters, pathV2LessonKeys, pathV2PracticeKeys } from "./path-v2";
import { assertStaffForCohort, getEnrollmentForUser, requireEnrollment, requireStaff, requireWritableEnrollment } from "./access";
import type { MentorshipReview, MentorshipSubmission } from "./types";
import { signAuthorizedAttachments, signOwnAttachments } from "@/lib/product/evidence-storage";
import { toAttachments, type Attachment } from "@/lib/product/journey";
import { isMissingTable } from "@/lib/product/portfolio-sections";

type MentorshipNotificationInput = {
  kind: "review" | "live_session" | "recording" | "system";
  title: string;
  body: string;
  href?: string;
};

export class MentorshipReviewValidationError extends Error {}
export class MentorshipSubmissionValidationError extends Error {}

export async function notifyMentorshipUsers(userIds: string[], input: MentorshipNotificationInput) {
  const ids = [...new Set(userIds)].filter(Boolean);
  if (ids.length === 0) return;
  try {
    const admin = createAdminClient();
    const { data: notifications, error } = await admin.from("mentorship_notifications").insert(ids.map((user_id) => ({
      user_id,
      kind: input.kind,
      title: input.title.slice(0, 180),
      body: input.body.slice(0, 1000),
      href: input.href ?? null,
    }))).select("id,user_id");
    if (error || !notifications?.length) return;
    await admin.from("mentorship_email_outbox").insert(notifications.map((notification) => ({
      notification_id: notification.id,
      user_id: notification.user_id,
      kind: input.kind,
      dedupe_key: `notification:${notification.id}`,
      subject: input.title.slice(0, 180),
      body: input.body.slice(0, 2000),
      href: input.href ?? null,
    })));
  } catch {
    // Notifications are additive; a missing/unapplied migration must not block the core flow.
  }
}

type SubmissionRow = {
  id: string;
  enrollment_id: string;
  assignment_key: string;
  attempt_number: number;
  level: string;
  content: unknown;
  repository_url: string | null;
  report_url: string | null;
  lab_submission_id: string | null;
  attachments: unknown;
  status: string;
  submitted_at: string | null;
  reviewed_at: string | null;
  created_at: string;
};

type MentorshipSessionRow = {
  id: string;
  week_number: number;
  title: string;
  agenda: string;
  starts_at: string;
  ends_at: string;
  meeting_url: string;
  recording_url: string | null;
  recording_available_until: string | null;
};

const submissionColumns = "id,enrollment_id,assignment_key,attempt_number,level,content,lab_submission_id,repository_url,report_url,attachments,status,submitted_at,reviewed_at,created_at";

function toSubmission(row: SubmissionRow): MentorshipSubmission {
  return {
    id: row.id,
    enrollmentId: row.enrollment_id,
    assignmentKey: row.assignment_key,
    attemptNumber: row.attempt_number,
    level: row.level as MentorshipSubmission["level"],
    content: row.content && typeof row.content === "object" ? row.content as Record<string, unknown> : {},
    repositoryUrl: row.repository_url,
    reportUrl: row.report_url,
    labSubmissionId: row.lab_submission_id,
    attachments: toAttachments(row.attachments),
    status: row.status as MentorshipSubmission["status"],
    submittedAt: row.submitted_at,
    reviewedAt: row.reviewed_at,
    createdAt: row.created_at,
  };
}

function toReview(row: Record<string, unknown>): MentorshipReview {
  return {
    id: String(row.id),
    submissionId: String(row.submission_id),
    reviewerId: String(row.reviewer_id),
    rubricVersion: String(row.rubric_version),
    scores: row.scores && typeof row.scores === "object" ? row.scores as Record<string, number> : {},
    strengths: String(row.strengths ?? ""),
    improvements: String(row.improvements ?? ""),
    nextAction: String(row.next_action ?? ""),
    decision: row.decision === "approved" ? "approved" : "changes_requested",
    createdAt: String(row.created_at),
  };
}

export async function getMentorshipDashboard(userId: string) {
  const enrollment = await getEnrollmentForUser(userId);
  if (!enrollment || enrollment.status === "invited" || enrollment.status === "cancelled") return null;
  const admin = createAdminClient();
  const [lessonsResult, submissionsResult, cohortResult, sessionsResult, commitmentsResult, notificationsResult, lessonContentResult] = await Promise.all([
    admin.from("mentorship_lesson_progress").select("lesson_key,status,completed_at").eq("enrollment_id", enrollment.id),
    admin.from("mentorship_submissions").select(submissionColumns).eq("enrollment_id", enrollment.id).order("created_at", { ascending: false }),
    admin.from("mentorship_cohorts").select("id,name,code,starts_on,ends_on,status").eq("id", enrollment.cohortId).maybeSingle(),
    admin.from("mentorship_live_sessions").select("id,week_number,title,agenda,starts_at,ends_at,meeting_url,recording_url,recording_available_until").eq("cohort_id", enrollment.cohortId).order("week_number"),
    admin.from("mentorship_weekly_commitments").select("id,week_number,commitment,visibility,check_in,created_at,updated_at").eq("enrollment_id", enrollment.id).order("week_number"),
    admin.from("mentorship_notifications").select("id,kind,title,body,href,read_at,created_at").eq("user_id", userId).order("created_at", { ascending: false }).limit(12),
    admin.from("mentorship_lesson_content").select("lesson_key,video_url,material_url,status,available_at").in("status", ["published", "scheduled"]),
  ]);

  const queryResults = [lessonsResult, submissionsResult, cohortResult, sessionsResult, commitmentsResult, notificationsResult, lessonContentResult];
  const failedQuery = queryResults.find((result) => result.error);
  if (failedQuery?.error) throw new Error(`Nao foi possivel carregar a jornada: ${failedQuery.error.message}`);
  const lessons = lessonsResult.data;
  const submissions = submissionsResult.data;
  const cohort = cohortResult.data;
  const sessions = sessionsResult.data;
  const commitments = commitmentsResult.data;
  const notifications = notificationsResult.data;
  const lessonContent = lessonContentResult.data;

  const latestByAssignment = new Map<string, SubmissionRow>();
  for (const row of (submissions ?? []) as SubmissionRow[]) {
    if (!latestByAssignment.has(row.assignment_key)) latestByAssignment.set(row.assignment_key, row);
  }
  const firstPending = [...Array(12)].findIndex((_, index) => {
    const latest = latestByAssignment.get(findMentorshipWeek(index + 1)?.assignment.key ?? "");
    return !latest || latest.status !== "approved";
  });
  const currentWeek = firstPending === -1 ? 12 : firstPending + 1;
  const completedWeeks = [...Array(12)].filter((_, index) => latestByAssignment.get(findMentorshipWeek(index + 1)?.assignment.key ?? "")?.status === "approved").length;
  const v2 = enrollment.programVersion === "v2";
  const v2Approved = pathV2Assignments.filter((assignment) => latestByAssignment.get(assignment.key)?.status === "approved").length;
  const currentV2 = pathV2Chapters.find(({ chapter }) => chapter.assignmentKey && latestByAssignment.get(chapter.assignmentKey)?.status !== "approved") ?? pathV2Chapters[pathV2Chapters.length - 1];
  const visibleSessions: MentorshipSessionRow[] = (sessions ?? []).map((session: MentorshipSessionRow) => {
    const expiresAt = session.recording_available_until ? new Date(session.recording_available_until).getTime() : null;
    if (session.recording_url && expiresAt !== null && Number.isFinite(expiresAt) && expiresAt <= Date.now()) {
      return { ...session, recording_url: null };
    }
    return session;
  });
  return {
    enrollment,
    cohort,
    lessons: lessons ?? [],
    submissions: await Promise.all((submissions ?? []).map(async (row) => {
      const submission = toSubmission(row as SubmissionRow);
      return { ...submission, attachments: await signOwnAttachments(submission.attachments) };
    })),
    sessions: visibleSessions,
    commitments: commitments ?? [],
    notifications: notifications ?? [],
    lessonContent: (lessonContent ?? []).filter((item) => item.status === "published" || (item.available_at && new Date(item.available_at) <= new Date())),
    currentChapterId: currentV2.chapter.id,
    currentWeek,
    completedWeeks: v2 ? v2Approved : completedWeeks,
    totalWeeks: v2 ? pathV2Assignments.length : 12,
    isComplete: v2 ? v2Approved === pathV2Assignments.length : completedWeeks === 12,
  };
}

export async function saveDiagnostic(userId: string, input: { level: "beginner" | "intermediate"; goal: string; score: Record<string, unknown> }) {
  const { enrollment } = await requireWritableEnrollment();
  if (enrollment.userId !== userId) throw new Error("Matricula invalida.");
  const admin = createAdminClient();
  const { data, error } = await admin.from("mentorship_enrollments").update({ level: input.level, goal: input.goal.trim().slice(0, 500), diagnostic_score: input.score, status: "active", joined_at: enrollment.joinedAt ?? new Date().toISOString() }).eq("id", enrollment.id).eq("user_id", userId).select("id,level,goal,diagnostic_score,status").single();
  if (error || !data) throw new Error(error?.message ?? "Nao foi possivel salvar o diagnostico.");
  await trackEvent(userId, "diagnostic_completed", { level: input.level, cohort: enrollment.cohortId });
  return data;
}

export async function markLessonComplete(userId: string, lessonKey: string) {
  const { enrollment } = await requireWritableEnrollment();
  const practice = enrollment.programVersion === "v2" && pathV2PracticeKeys.includes(lessonKey);
  const lesson = enrollment.programVersion === "v2" ? findPathV2Lesson(lessonKey) : findMentorshipLesson(lessonKey);
  if ((!lesson && !practice) || (enrollment.programVersion === "v2" && !practice && !pathV2LessonKeys.includes(lessonKey))) throw new Error("Atividade nao encontrada nesta versao da mentoria.");
  const admin = createAdminClient();
  const { error } = await admin.from("mentorship_lesson_progress").upsert({ enrollment_id: enrollment.id, lesson_key: lessonKey, status: "completed", completed_at: new Date().toISOString() }, { onConflict: "enrollment_id,lesson_key" });
  if (error) throw new Error(error.message);
  await trackEvent(userId, practice ? "practice_completed" : "lesson_completed", { lesson: lessonKey, cohort: enrollment.cohortId });
  return { lessonKey, status: "completed" as const };
}

type MentorshipSubmissionInput = { assignmentKey: string; content: Record<string, unknown>; repositoryUrl?: string; reportUrl?: string; labSubmissionId?: string; attachments?: Attachment[] };

async function validateSubmissionReferences(userId: string, input: MentorshipSubmissionInput, enrollmentId: string, requireFinalEvidence = false) {
  if ((input.attachments?.length ?? 0) > 6) throw new Error("A entrega aceita no maximo seis anexos.");
  const attachments = (input.attachments ?? []).map((file) => {
    if (!file || typeof file.path !== "string" || !file.path.startsWith(`${userId}/`)) throw new Error("Um dos anexos nao pertence a sua conta.");
    return { name: String(file.name).slice(0, 180), url: "", path: file.path, size: Number(file.size) || 0, type: String(file.type).slice(0, 120) };
  });
  if (input.labSubmissionId) {
    const { data, error } = await createAdminClient().from("lab_submissions").select("id").eq("id", input.labSubmissionId).eq("user_id", userId).maybeSingle();
    if (error || !data) throw new Error("A evidencia de Lab selecionada nao pertence a sua conta.");
  }
  if (input.assignmentKey === "mentoria.w12.assignment") {
    const tracks = ["manual", "automation", "cicd", "performance"] as const;
    const finalProject = input.content.finalProject && typeof input.content.finalProject === "object" ? input.content.finalProject as Record<string, unknown> : {};
    if (requireFinalEvidence && tracks.some((track) => typeof finalProject[track] !== "string" || String(finalProject[track]).trim().length < 20)) {
      throw new MentorshipSubmissionValidationError("Preencha uma evidência de pelo menos 20 caracteres para cada trilha do projeto final.");
    }
    if (requireFinalEvidence && (typeof finalProject.releaseDecision !== "string" || finalProject.releaseDecision.trim().length < 30)) {
      throw new MentorshipSubmissionValidationError("Explique a decisão de release e o risco residual em pelo menos 30 caracteres.");
    }
    const evidenceIds = input.content.evidenceSubmissionIds && typeof input.content.evidenceSubmissionIds === "object" && !Array.isArray(input.content.evidenceSubmissionIds)
      ? input.content.evidenceSubmissionIds as Record<string, unknown>
      : {};
    const selectedIds = tracks.map((track) => evidenceIds[track]).filter((value): value is string => typeof value === "string" && value.length > 0);
    if (requireFinalEvidence && (selectedIds.length !== tracks.length || new Set(selectedIds).size !== tracks.length)) {
      throw new MentorshipSubmissionValidationError("Vincule uma entrega aprovada diferente para cada uma das quatro trilhas.");
    }
    if (selectedIds.length > 0) {
      const { data: selected, error: selectedError } = await createAdminClient().from("mentorship_submissions").select("id,assignment_key,status").eq("enrollment_id", enrollmentId).in("id", selectedIds);
      if (selectedError) throw new Error(selectedError.message);
      const byId = new Map((selected ?? []).map((row) => [row.id, row]));
      for (const track of tracks) {
        const id = evidenceIds[track];
        if (typeof id !== "string" || id.length === 0) continue;
        const row = byId.get(id);
        const sourceWeek = row && mentorshipWeeks.find((week) => week.assignment.key === row.assignment_key);
        if (!row || row.status !== "approved" || !sourceWeek || mentorshipTrackForWeek(sourceWeek.number) !== track) {
          throw new MentorshipSubmissionValidationError(`A evidência vinculada para a trilha ${track} não pertence a uma entrega aprovada dessa trilha.`);
        }
      }
    }
  }
  return attachments;
}

export async function saveMentorshipDraft(userId: string, input: MentorshipSubmissionInput) {
  const { enrollment } = await requireWritableEnrollment();
  const assignment = enrollment.programVersion === "v2" ? findPathV2Assignment(input.assignmentKey) : findMentorshipAssignment(input.assignmentKey);
  if (!assignment) throw new Error("Entrega nao encontrada nesta versao da mentoria.");
  const admin = createAdminClient();
  const attachments = await validateSubmissionReferences(userId, input, enrollment.id);
  const { data: draft, error: draftError } = await admin.from("mentorship_submissions").select("id,attempt_number").eq("enrollment_id", enrollment.id).eq("assignment_key", assignment.key).eq("status", "draft").order("attempt_number", { ascending: false }).limit(1).maybeSingle();
  if (draftError) throw new Error(draftError.message);
  const values = { level: enrollment.level, content: input.content, repository_url: input.repositoryUrl?.trim() || null, report_url: input.reportUrl?.trim() || null, lab_submission_id: input.labSubmissionId || null, attachments };
  let data: SubmissionRow | null = null;
  let error: { message: string } | null = null;
  if (draft) {
    const result = await admin.from("mentorship_submissions").update(values).eq("id", draft.id).eq("enrollment_id", enrollment.id).select(submissionColumns).single();
    data = result.data as SubmissionRow | null;
    error = result.error;
  } else {
    const { data: previous, error: previousError } = await admin.from("mentorship_submissions").select("attempt_number").eq("enrollment_id", enrollment.id).eq("assignment_key", assignment.key).order("attempt_number", { ascending: false }).limit(1).maybeSingle();
    if (previousError) throw new Error(previousError.message);
    const result = await admin.from("mentorship_submissions").insert({ ...values, enrollment_id: enrollment.id, assignment_key: assignment.key, attempt_number: Number(previous?.attempt_number ?? 0) + 1, status: "draft" }).select(submissionColumns).single();
    data = result.data as SubmissionRow | null;
    error = result.error;
  }
  if (error || !data) throw new Error(error?.message ?? "Nao foi possivel salvar o rascunho.");
  return toSubmission(data as SubmissionRow);
}

export async function submitMentorshipAssignment(userId: string, input: MentorshipSubmissionInput) {
  const { enrollment } = await requireWritableEnrollment();
  const assignment = enrollment.programVersion === "v2" ? findPathV2Assignment(input.assignmentKey) : findMentorshipAssignment(input.assignmentKey);
  if (!assignment) throw new Error("Entrega nao encontrada nesta versao da mentoria.");
  const admin = createAdminClient();
  if (enrollment.programVersion === "v2" && input.assignmentKey === "mentoria.v2.case-final.assignment") {
    const response = String(input.content.response ?? "").trim();
    if (response.length < 120) throw new MentorshipSubmissionValidationError("Explique o case, as evidencias e a decisao em pelo menos 120 caracteres.");
    const previousKeys = pathV2Assignments.filter((item) => item.key !== input.assignmentKey).map((item) => item.key);
    const { data: previous, error: previousError } = await admin.from("mentorship_submissions").select("assignment_key,attempt_number,status").eq("enrollment_id", enrollment.id).in("assignment_key", previousKeys).order("attempt_number", { ascending: false });
    if (previousError) throw new Error(previousError.message);
    const latest = new Map<string, string>();
    for (const row of previous ?? []) if (!latest.has(row.assignment_key)) latest.set(row.assignment_key, row.status);
    if (previousKeys.some((key) => latest.get(key) !== "approved")) throw new MentorshipSubmissionValidationError("Conclua as entregas anteriores antes de enviar o case final.");
  }
  const attachments = await validateSubmissionReferences(userId, input, enrollment.id, input.assignmentKey === "mentoria.w12.assignment");
  const { data: draft, error: draftError } = await admin.from("mentorship_submissions").select("id,attempt_number").eq("enrollment_id", enrollment.id).eq("assignment_key", assignment.key).eq("status", "draft").order("attempt_number", { ascending: false }).limit(1).maybeSingle();
  if (draftError) throw new Error(draftError.message);
  const values = { level: enrollment.level, content: input.content, repository_url: input.repositoryUrl?.trim() || null, report_url: input.reportUrl?.trim() || null, lab_submission_id: input.labSubmissionId || null, attachments, status: "submitted", submitted_at: new Date().toISOString() };
  if (draft) {
    const { data, error } = await admin.from("mentorship_submissions").update(values).eq("id", draft.id).eq("enrollment_id", enrollment.id).eq("status", "draft").select(submissionColumns).single();
    if (error || !data) throw new Error(error?.message ?? "Nao foi possivel enviar a entrega.");
    await trackEvent(userId, "assignment_submitted", { assignment: assignment.key, attempt: draft.attempt_number, cohort: enrollment.cohortId });
    return toSubmission(data as SubmissionRow);
  }
  const { data: previous, error: previousError } = await admin.from("mentorship_submissions").select("attempt_number").eq("enrollment_id", enrollment.id).eq("assignment_key", assignment.key).order("attempt_number", { ascending: false }).limit(1).maybeSingle();
  if (previousError) throw new Error(previousError.message);
  const attemptNumber = Number(previous?.attempt_number ?? 0) + 1;
  const { data, error } = await admin.from("mentorship_submissions").insert({ ...values, enrollment_id: enrollment.id, assignment_key: assignment.key, attempt_number: attemptNumber }).select(submissionColumns).single();
  if (error || !data) throw new Error(error?.message ?? "Nao foi possivel enviar a entrega.");
  await trackEvent(userId, "assignment_submitted", { assignment: assignment.key, attempt: attemptNumber, cohort: enrollment.cohortId });
  return toSubmission(data as SubmissionRow);
}

export type MentorshipCertificate = {
  code: string;
  holder_name: string;
  cohort_name: string;
  approved_assignments: number;
  completed_lessons: number;
  issued_at: string;
};

export type MentorshipCertificateProgress = {
  eligible: boolean;
  approvedAssignments: number;
  requiredAssignments: number;
  completedLessons: number;
  requiredLessons: number;
  completedPractices: number;
  requiredPractices: number;
  certificate: MentorshipCertificate | null;
};

async function certificateProgress(userId: string) {
  const enrollment = await getEnrollmentForUser(userId);
  if (!enrollment) return { enrollment: null, approvedAssignments: 0, requiredAssignments: mentorshipWeeks.length, completedLessons: 0, requiredLessons: mentorshipWeeks.reduce((total, week) => total + week.lessons.length, 0), completedPractices: 0, requiredPractices: 0 };
  const admin = createAdminClient();
  const assignmentKeys = enrollment.programVersion === "v2" ? pathV2Assignments.map((item) => item.key) : mentorshipWeeks.map((week) => week.assignment.key);
  const lessonKeys = enrollment.programVersion === "v2" ? pathV2LessonKeys : mentorshipWeeks.flatMap((week) => week.lessons.map((lesson) => lesson.key));
  const practiceKeys = enrollment.programVersion === "v2" ? pathV2PracticeKeys : [];
  const [submissionsResult, lessonsResult] = await Promise.all([
    admin.from("mentorship_submissions").select("assignment_key,attempt_number,status").eq("enrollment_id", enrollment.id).in("assignment_key", assignmentKeys).order("attempt_number", { ascending: false }),
    admin.from("mentorship_lesson_progress").select("lesson_key,status").eq("enrollment_id", enrollment.id).in("lesson_key", [...lessonKeys, ...practiceKeys]),
  ]);
  if (submissionsResult.error) throw new Error(submissionsResult.error.message);
  if (lessonsResult.error) throw new Error(lessonsResult.error.message);
  const latest = new Map<string, string>();
  for (const submission of submissionsResult.data ?? []) if (!latest.has(submission.assignment_key)) latest.set(submission.assignment_key, submission.status);
  const approvedAssignments = assignmentKeys.filter((key) => latest.get(key) === "approved").length;
  const completedKeys = new Set((lessonsResult.data ?? []).filter((lesson) => lesson.status === "completed").map((lesson) => lesson.lesson_key));
  const completedLessons = lessonKeys.filter((key) => completedKeys.has(key)).length;
  const completedPractices = practiceKeys.filter((key) => completedKeys.has(key)).length;
  return { enrollment, approvedAssignments, requiredAssignments: assignmentKeys.length, completedLessons, requiredLessons: lessonKeys.length, completedPractices, requiredPractices: practiceKeys.length };
}

export async function getMentorshipCertificateProgress(userId: string): Promise<MentorshipCertificateProgress> {
  const progress = await certificateProgress(userId);
  const enrollmentId = progress.enrollment?.id;
  let certificate: MentorshipCertificate | null = null;
  if (enrollmentId) {
    const { data, error } = await createAdminClient().from("mentorship_certificates").select("code,holder_name,cohort_name,approved_assignments,completed_lessons,issued_at").eq("enrollment_id", enrollmentId).maybeSingle();
    if (error && !isMissingTable(error)) throw new Error(error.message);
    certificate = data as MentorshipCertificate | null;
  }
  const enrollmentCanGraduate = progress.enrollment && ["active", "completed"].includes(progress.enrollment.status);
  return { ...progress, eligible: Boolean(enrollmentCanGraduate) && progress.approvedAssignments === progress.requiredAssignments && progress.completedLessons === progress.requiredLessons && progress.completedPractices === progress.requiredPractices && progress.requiredAssignments > 0 && progress.requiredLessons > 0, certificate };
}

export async function issueMentorshipCertificate(userId: string) {
  const { user, enrollment } = await requireEnrollment();
  if (user.id !== userId) throw new Error("Matricula invalida.");
  const progress = await getMentorshipCertificateProgress(userId);
  if (progress.certificate) return progress;
  if (enrollment.status === "paused" || enrollment.status === "invited" || !progress.eligible) return progress;

  const admin = createAdminClient();
  const [{ data: profile, error: profileError }, { data: cohort, error: cohortError }] = await Promise.all([
    admin.from("profiles").select("full_name").eq("id", userId).maybeSingle(),
    admin.from("mentorship_cohorts").select("name").eq("id", enrollment.cohortId).maybeSingle(),
  ]);
  if (profileError) throw new Error(profileError.message);
  if (cohortError) throw new Error(cohortError.message);
  if (!cohort?.name) throw new Error("Nao foi possivel identificar a turma do certificado.");

  const certificateCode = `QAM-${randomUUID().slice(0, 8)}-${randomUUID().slice(0, 8)}`.toUpperCase();
  const holderName = profile?.full_name?.trim() || await getDisplayName(userId, user.email);
  const values = { enrollment_id: enrollment.id, user_id: userId, code: certificateCode, holder_name: holderName.slice(0, 180), cohort_name: cohort.name.slice(0, 180), approved_assignments: progress.approvedAssignments, completed_lessons: progress.completedLessons };
  const { data, error } = await admin.from("mentorship_certificates").insert(values).select("code,holder_name,cohort_name,approved_assignments,completed_lessons,issued_at").maybeSingle();
  if (error || !data) {
    const { data: raced, error: racedError } = await admin.from("mentorship_certificates").select("code,holder_name,cohort_name,approved_assignments,completed_lessons,issued_at").eq("enrollment_id", enrollment.id).maybeSingle();
    if (racedError || !raced) throw new Error(error?.message ?? "Nao foi possivel emitir o certificado.");
    return { ...progress, certificate: raced as MentorshipCertificate };
  }
  await trackEvent(userId, "mentorship_certificate_issued", { cohort: enrollment.cohortId });
  return { ...progress, certificate: data as MentorshipCertificate };
}

export async function getMentorshipCertificateByCode(code: string): Promise<MentorshipCertificate | null> {
  const normalized = code.trim().toUpperCase();
  if (!/^QAM-[A-F0-9]{8}-[A-F0-9]{8}$/.test(normalized)) return null;
  const { data, error } = await createAdminClient().from("mentorship_certificates").select("code,holder_name,cohort_name,approved_assignments,completed_lessons,issued_at").eq("code", normalized).maybeSingle();
  if (error) throw new Error(error.message);
  return data as MentorshipCertificate | null;
}

export async function listOwnLabEvidence(userId: string) {
  const admin = createAdminClient();
  const { data, error } = await admin.from("lab_submissions").select("id,lab_slug,result,notes,attachments,created_at").eq("user_id", userId).order("created_at", { ascending: false }).limit(30);
  if (error) throw new Error(error.message);
  return Promise.all((data ?? []).map(async (row) => ({
    id: String(row.id), labSlug: String(row.lab_slug), evidence: [row.result, row.notes].filter(Boolean).join(" · "), createdAt: String(row.created_at),
    attachments: await signOwnAttachments(toAttachments(row.attachments)),
  })));
}

export async function listReviews(userId: string, submissionId: string) {
  const { enrollment } = await requireEnrollment();
  const admin = createAdminClient();
  const { data: submission } = await admin.from("mentorship_submissions").select("id").eq("id", submissionId).eq("enrollment_id", enrollment.id).maybeSingle();
  if (!submission) return [];
  const { data } = await admin.from("mentorship_reviews").select("id,submission_id,reviewer_id,rubric_version,scores,strengths,improvements,next_action,decision,created_at").eq("submission_id", submissionId).order("created_at", { ascending: false });
  return (data ?? []).map((row) => toReview(row as Record<string, unknown>));
}

export async function listReviewsForSubmissions(userId: string, submissionIds: string[]) {
  if (submissionIds.length === 0) return new Map<string, MentorshipReview[]>();
  const { enrollment } = await requireEnrollment();
  const admin = createAdminClient();
  const { data: owned, error: ownershipError } = await admin.from("mentorship_submissions").select("id").eq("enrollment_id", enrollment.id).in("id", submissionIds);
  if (ownershipError) throw new Error(ownershipError.message);
  const ids = (owned ?? []).map((item) => String(item.id));
  if (ids.length === 0) return new Map<string, MentorshipReview[]>();
  const { data, error } = await admin.from("mentorship_reviews").select("id,submission_id,reviewer_id,rubric_version,scores,strengths,improvements,next_action,decision,created_at").in("submission_id", ids).order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  const grouped = new Map<string, MentorshipReview[]>();
  for (const row of data ?? []) {
    const review = toReview(row as Record<string, unknown>);
    grouped.set(review.submissionId, [...(grouped.get(review.submissionId) ?? []), review]);
  }
  return grouped;
}

const REVIEW_SLA_HOURS = 72;

function withReviewSla<T extends { submittedAt: string | null }>(submission: T) {
  if (!submission.submittedAt) return { ...submission, sla: { dueAt: null, hoursRemaining: null, state: "unknown" as const } };
  const dueAt = new Date(new Date(submission.submittedAt).getTime() + REVIEW_SLA_HOURS * 60 * 60 * 1000);
  const hoursRemaining = Math.ceil((dueAt.getTime() - Date.now()) / (60 * 60 * 1000));
  return {
    ...submission,
    sla: {
      dueAt: dueAt.toISOString(),
      hoursRemaining,
      state: hoursRemaining < 0 ? "overdue" as const : hoursRemaining <= 24 ? "due_soon" as const : "on_track" as const,
    },
  };
}

export async function mentorQueue() {
  const { user, staff } = await requireStaff();
  const admin = createAdminClient();
  const { data: assignments, error } = await admin.from("mentorship_submissions").select(submissionColumns).in("status", ["submitted", "in_review"]).order("submitted_at", { ascending: true }).limit(500);
  if (error) throw new Error(error.message);
  const rows = (assignments ?? []).map((row) => toSubmission(row as SubmissionRow));
  const enrollmentIds = [...new Set(rows.map((row) => row.enrollmentId))];
  if (enrollmentIds.length === 0) return { user, staff, submissions: [] };
  const { data: enrollments, error: enrollmentError } = await admin.from("mentorship_enrollments").select("id,cohort_id,user_id").in("id", enrollmentIds);
  if (enrollmentError) throw new Error(enrollmentError.message);
  const cohortIds = [...new Set((enrollments ?? []).map((row) => row.cohort_id))];
  let visibleRows = rows;
  if (staff.role !== "admin") {
    const { data: memberships, error: membershipError } = await admin.from("mentorship_cohort_staff").select("cohort_id").eq("staff_user_id", user.id).in("cohort_id", cohortIds);
    if (membershipError) throw new Error(membershipError.message);
    const allowed = new Set((memberships ?? []).map((row) => row.cohort_id));
    const allowedEnrollments = new Set((enrollments ?? []).filter((row) => allowed.has(row.cohort_id)).map((row) => row.id));
    visibleRows = rows.filter((row) => allowedEnrollments.has(row.enrollmentId));
  }
  const visibleEnrollmentIds = new Set(visibleRows.map((row) => row.enrollmentId));
  const visibleEnrollments = (enrollments ?? []).filter((row) => visibleEnrollmentIds.has(row.id));
  const studentIds = [...new Set(visibleEnrollments.map((row) => row.user_id))];
  const visibleCohortIds = [...new Set(visibleEnrollments.map((row) => row.cohort_id))];
  const [profileResult, cohortResult] = await Promise.all([
    studentIds.length ? admin.from("profiles").select("id,full_name,username").in("id", studentIds) : Promise.resolve({ data: [], error: null }),
    visibleCohortIds.length ? admin.from("mentorship_cohorts").select("id,name").in("id", visibleCohortIds) : Promise.resolve({ data: [], error: null }),
  ]);
  const detailError = profileResult.error ?? cohortResult.error;
  if (detailError) throw new Error(detailError.message);
  const enrollmentById = new Map(visibleEnrollments.map((row) => [row.id, row]));
  const profileById = new Map((profileResult.data ?? []).map((row) => [row.id, row]));
  const cohortById = new Map((cohortResult.data ?? []).map((row) => [row.id, row.name]));
  return { user, staff, submissions: await Promise.all(visibleRows.map(async (row) => {
    const enrollment = enrollmentById.get(row.enrollmentId);
    const profile = enrollment ? profileById.get(enrollment.user_id) : null;
    const week = [...Array(12)].map((_, index) => findMentorshipWeek(index + 1)).find((item) => item?.assignment.key === row.assignmentKey);
    return withReviewSla({
      ...row,
      studentName: profile?.full_name?.trim() || profile?.username || "Aluno",
      cohortName: enrollment ? cohortById.get(enrollment.cohort_id) ?? "Turma" : "Turma",
      weekTitle: week?.title ?? findPathV2Assignment(row.assignmentKey)?.title ?? row.assignmentKey,
      attachments: await signAuthorizedAttachments(row.attachments),
    });
  })) };
}

export async function getMentorSubmission(submissionId: string) {
  const { user, staff } = await requireStaff();
  const admin = createAdminClient();
  const { data: row, error } = await admin.from("mentorship_submissions").select(submissionColumns).eq("id", submissionId).maybeSingle();
  if (error || !row) return null;
  const { data: enrollment } = await admin.from("mentorship_enrollments").select("id,cohort_id,user_id,level,status").eq("id", row.enrollment_id).maybeSingle();
  if (!enrollment) return null;
  await assertStaffForCohort(user.id, staff.role, enrollment.cohort_id);
  let currentRow = row as SubmissionRow;
  if (currentRow.status === "submitted") {
    const { data: opened, error: openError } = await admin.from("mentorship_submissions").update({ status: "in_review" }).eq("id", submissionId).eq("status", "submitted").select(submissionColumns).maybeSingle();
    if (openError) throw new Error(openError.message);
    if (opened) currentRow = opened as SubmissionRow;
    else {
      const { data: latest, error: latestError } = await admin.from("mentorship_submissions").select(submissionColumns).eq("id", submissionId).maybeSingle();
      if (latestError) throw new Error(latestError.message);
      if (!latest) return null;
      currentRow = latest as SubmissionRow;
    }
  }
  const { data: reviews } = await admin.from("mentorship_reviews").select("id,submission_id,reviewer_id,rubric_version,scores,strengths,improvements,next_action,decision,created_at").eq("submission_id", submissionId).order("created_at", { ascending: false });
  const submission = toSubmission(currentRow);
  submission.attachments = await signAuthorizedAttachments(submission.attachments);
  let linkedLabEvidence: { id: string; labSlug: string; result: string; reproduction: string; severity: string; notes: string; createdAt: string; attachments: Attachment[] } | null = null;
  if (submission.labSubmissionId) {
    const { data: labEvidence } = await admin.from("lab_submissions").select("id,lab_slug,result,reproduction,severity,notes,attachments,created_at").eq("id", submission.labSubmissionId).eq("user_id", enrollment.user_id).maybeSingle();
    if (labEvidence) linkedLabEvidence = {
      id: String(labEvidence.id), labSlug: String(labEvidence.lab_slug), result: String(labEvidence.result ?? ""), reproduction: String(labEvidence.reproduction ?? ""), severity: String(labEvidence.severity ?? ""), notes: String(labEvidence.notes ?? ""), createdAt: String(labEvidence.created_at),
      attachments: await signAuthorizedAttachments(toAttachments(labEvidence.attachments)),
    };
  }
  return { submission, enrollment, linkedLabEvidence, reviews: (reviews ?? []).map((review) => toReview(review as Record<string, unknown>)) };
}

export async function reviewMentorshipSubmission(submissionId: string, input: { decision: "changes_requested" | "approved"; scores: Record<string, number>; strengths: string; improvements: string; nextAction: string }) {
  const { user, staff } = await requireStaff();
  const admin = createAdminClient();
  const { data: submission, error } = await admin.from("mentorship_submissions").select("id,enrollment_id,assignment_key,status").eq("id", submissionId).maybeSingle();
  if (error || !submission) throw new Error("Entrega nao encontrada.");
  if (submission.status !== "submitted" && submission.status !== "in_review") throw new Error("Esta entrega nao esta aguardando revisao.");
  const assignment = findPathV2Assignment(submission.assignment_key) ?? findMentorshipAssignment(submission.assignment_key);
  if (!assignment) throw new Error("A rubrica desta entrega nao foi encontrada.");
  const rubricKeys = assignment.rubric;
  const scoreKeys = Object.keys(input.scores);
  if (scoreKeys.length !== rubricKeys.length || rubricKeys.some((criterion) => !Number.isInteger(input.scores[criterion]) || input.scores[criterion] < 1 || input.scores[criterion] > 4)) {
    throw new MentorshipReviewValidationError("Avalie todos os critérios da rubrica com uma nota de 1 a 4.");
  }
  const { data: enrollment } = await admin.from("mentorship_enrollments").select("cohort_id").eq("id", submission.enrollment_id).maybeSingle();
  if (!enrollment) throw new Error("Matricula nao encontrada.");
  await assertStaffForCohort(user.id, staff.role, enrollment.cohort_id);
  const decision = input.decision;
  const reviewedAt = new Date().toISOString();
  const { data: claimed, error: claimError } = await admin.from("mentorship_submissions").update({ status: decision, reviewed_at: reviewedAt }).eq("id", submissionId).in("status", ["submitted", "in_review"]).select("id").maybeSingle();
  if (claimError || !claimed) throw new Error(claimError?.message ?? "Esta entrega acabou de ser revisada por outra pessoa.");
  const { data: review, error: reviewError } = await admin.from("mentorship_reviews").insert({ submission_id: submissionId, reviewer_id: user.id, rubric_version: findPathV2Assignment(submission.assignment_key) ? "mentoria-v2" : "mentoria-v1", scores: input.scores, strengths: input.strengths.trim().slice(0, 3000), improvements: input.improvements.trim().slice(0, 3000), next_action: input.nextAction.trim().slice(0, 1000), decision }).select("id,submission_id,reviewer_id,rubric_version,scores,strengths,improvements,next_action,decision,created_at").single();
  if (reviewError || !review) {
    await admin.from("mentorship_submissions").update({ status: "in_review", reviewed_at: null }).eq("id", submissionId).eq("reviewed_at", reviewedAt);
    throw new Error(reviewError?.message ?? "Nao foi possivel salvar a revisao.");
  }
  await trackEvent(user.id, "review_completed", { submission: submissionId, decision, cohort: enrollment.cohort_id });
  const { data: student } = await admin.from("mentorship_enrollments").select("user_id").eq("id", submission.enrollment_id).maybeSingle();
  if (student?.user_id) {
    const weekNumber = [...Array(12)].findIndex((_, index) => findMentorshipWeek(index + 1)?.assignment.key === submission.assignment_key) + 1;
    await notifyMentorshipUsers([student.user_id], {
      kind: "review",
      title: decision === "approved" ? "Entrega aprovada" : "Feedback do mentor disponivel",
      body: decision === "approved" ? "Sua entrega foi aprovada. Confira a proxima missao da jornada." : `Seu mentor revisou a entrega. Ajustes: ${input.improvements.trim().slice(0, 700) || input.nextAction.trim().slice(0, 700)}`,
      href: weekNumber > 0 ? `/mentoria/semanas/${weekNumber}` : "/mentoria/app",
    });
  }
  return toReview(review as Record<string, unknown>);
}

export async function createCohort(input: { code: string; name: string; startsOn: string; endsOn: string; capacity?: number }) {
  const { user } = await requireStaff("admin");
  const admin = createAdminClient();
  const { data, error } = await admin.from("mentorship_cohorts").insert({ code: input.code.trim().toLowerCase(), name: input.name.trim(), starts_on: input.startsOn, ends_on: input.endsOn, capacity: input.capacity ?? 20, status: "draft", program_version: "v2", created_by: user.id }).select("id,code,name,starts_on,ends_on,capacity,status,program_version").single();
  if (error || !data) throw new Error(error?.message ?? "Nao foi possivel criar a turma.");
  return data;
}

export async function enrollStudent(input: { cohortId: string; userId: string; level?: "beginner" | "intermediate" }) {
  await requireStaff("admin");
  const admin = createAdminClient();
  const { data, error } = await admin.rpc("create_mentorship_invitation", { target_cohort_id: input.cohortId, target_user_id: input.userId, target_level: input.level ?? "beginner" });
  if (error || !data) throw new Error(error?.message ?? "Nao foi possivel matricular o aluno.");
  return data;
}

export async function createLiveSession(input: {
  cohortId: string;
  weekNumber: number;
  title: string;
  agenda: string;
  startsAt: string;
  endsAt: string;
  meetingUrl: string;
  recordingUrl?: string;
  recordingAvailableUntil?: string;
}) {
  const { user } = await requireStaff("admin");
  if (!Number.isInteger(input.weekNumber) || input.weekNumber < 1 || input.weekNumber > 12) throw new Error("A semana deve estar entre 1 e 12.");
  const startsAt = new Date(input.startsAt);
  const endsAt = new Date(input.endsAt);
  if (Number.isNaN(startsAt.getTime()) || Number.isNaN(endsAt.getTime()) || endsAt <= startsAt) throw new Error("O horario do encontro e invalido.");
  const meetingUrl = input.meetingUrl.trim();
  if (!/^https?:\/\//i.test(meetingUrl)) throw new Error("O link do encontro deve ser uma URL HTTP ou HTTPS.");
  const recordingUrl = input.recordingUrl?.trim() || null;
  if (recordingUrl && !/^https?:\/\//i.test(recordingUrl)) throw new Error("O link da gravacao deve ser uma URL HTTP ou HTTPS.");
  const recordingAvailableUntil = input.recordingAvailableUntil?.trim() || null;
  if (recordingAvailableUntil && !recordingUrl) throw new Error("Informe o link da gravacao antes de definir a validade.");
  if (recordingAvailableUntil && Number.isNaN(new Date(recordingAvailableUntil).getTime())) throw new Error("A validade da gravacao e invalida.");
  const admin = createAdminClient();
  const { data, error } = await admin.from("mentorship_live_sessions").upsert({
    cohort_id: input.cohortId,
    week_number: input.weekNumber,
    title: input.title.trim().slice(0, 180),
    agenda: input.agenda.trim().slice(0, 4000),
    starts_at: startsAt.toISOString(),
    ends_at: endsAt.toISOString(),
    meeting_url: meetingUrl,
    ...(recordingUrl ? { recording_url: recordingUrl } : {}),
    ...(recordingAvailableUntil ? { recording_available_until: new Date(recordingAvailableUntil).toISOString() } : {}),
    created_by: user.id,
  }, { onConflict: "cohort_id,week_number" }).select("id,cohort_id,week_number,title,agenda,starts_at,ends_at,meeting_url,recording_url,recording_available_until").single();
  if (error || !data) throw new Error(error?.message ?? "Nao foi possivel publicar o encontro.");
  const { data: students } = await admin.from("mentorship_enrollments").select("user_id").eq("cohort_id", input.cohortId).in("status", ["invited", "active", "paused"]);
  await notifyMentorshipUsers((students ?? []).map((student) => student.user_id), {
    kind: recordingUrl ? "recording" : "live_session",
    title: recordingUrl ? "Gravacao liberada" : "Novo encontro ao vivo publicado",
    body: recordingUrl ? `A gravacao da semana ${input.weekNumber} ja esta disponivel.` : `O encontro da semana ${input.weekNumber} foi publicado. Confira data, pauta e link.`,
    href: "/mentoria/app",
  });
  return data;
}

const cohortStatuses = ["draft", "enrollment", "active", "completed", "archived"] as const;
const enrollmentStatuses = ["invited", "active", "paused", "completed", "cancelled"] as const;
const cohortStaffRoles = ["lead", "reviewer", "facilitator"] as const;
const lessonContentStatuses = ["draft", "published", "scheduled"] as const;

function isHttpUrl(value: string) {
  return /^https?:\/\//i.test(value);
}

export async function updateCohortAdmin(cohortId: string, input: { name: string; startsOn: string; endsOn: string; capacity: number; status: typeof cohortStatuses[number] }) {
  await requireStaff("admin");
  if (!cohortStatuses.includes(input.status)) throw new Error("Status da turma invalido.");
  if (!input.name.trim()) throw new Error("Informe o nome da turma.");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.startsOn) || !/^\d{4}-\d{2}-\d{2}$/.test(input.endsOn) || input.endsOn < input.startsOn) throw new Error("O periodo da turma e invalido.");
  if (!Number.isInteger(input.capacity) || input.capacity < 1 || input.capacity > 200) throw new Error("A capacidade deve estar entre 1 e 200.");
  const admin = createAdminClient();
  const { error: capacityError } = await admin.rpc("set_mentorship_cohort_capacity", { target_cohort_id: cohortId, target_capacity: input.capacity });
  if (capacityError) throw new Error(capacityError.message.includes("CAPACITY_BELOW_OCCUPIED") ? "A capacidade não pode ficar abaixo das vagas ocupadas ou reservadas." : "Não foi possível atualizar a capacidade.");
  const { data, error } = await admin.from("mentorship_cohorts").update({ name: input.name.trim().slice(0, 180), starts_on: input.startsOn, ends_on: input.endsOn, status: input.status }).eq("id", cohortId).select("id,code,name,starts_on,ends_on,capacity,status").maybeSingle();
  if (error || !data) throw new Error(error?.message ?? "Turma nao encontrada.");
  return data;
}

export async function updateEnrollmentAdmin(enrollmentId: string, input: { status: typeof enrollmentStatuses[number]; level: "beginner" | "intermediate" }) {
  await requireStaff("admin");
  if (!enrollmentStatuses.includes(input.status)) throw new Error("Status da matricula invalido.");
  if (!["beginner", "intermediate"].includes(input.level)) throw new Error("Nivel da matricula invalido.");
  const { data, error } = await createAdminClient().rpc("set_mentorship_enrollment_status", { target_enrollment_id: enrollmentId, target_status: input.status, target_level: input.level });
  if (error || !data) throw new Error(error?.message ?? "Matricula nao encontrada.");
  return data;
}

export async function assignMentorToCohort(input: { cohortId: string; userId: string; role: typeof cohortStaffRoles[number] }) {
  await requireStaff("admin");
  if (!cohortStaffRoles.includes(input.role)) throw new Error("Papel do mentor invalido.");
  const admin = createAdminClient();
  const { data: existingStaff, error: lookupError } = await admin.from("mentorship_staff").select("role").eq("user_id", input.userId).maybeSingle();
  if (lookupError) throw new Error(lookupError.message);
  const { error: staffError } = await admin.from("mentorship_staff").upsert({ user_id: input.userId, role: existingStaff?.role === "admin" ? "admin" : "mentor", active: true }, { onConflict: "user_id" });
  if (staffError) throw new Error(staffError.message);
  const { data, error } = await admin.from("mentorship_cohort_staff").upsert({ cohort_id: input.cohortId, staff_user_id: input.userId, role: input.role }, { onConflict: "cohort_id,staff_user_id" }).select("cohort_id,staff_user_id,role").single();
  if (error || !data) throw new Error(error?.message ?? "Nao foi possivel associar o mentor.");
  return data;
}

export async function removeMentorFromCohort(cohortId: string, userId: string) {
  await requireStaff("admin");
  const { error } = await createAdminClient().from("mentorship_cohort_staff").delete().eq("cohort_id", cohortId).eq("staff_user_id", userId);
  if (error) throw new Error(error.message);
  return { cohortId, userId };
}

export async function updateLiveSessionAdmin(sessionId: string, input: { title: string; agenda: string; startsAt: string; endsAt: string; meetingUrl: string; recordingUrl?: string; recordingAvailableUntil?: string }) {
  await requireStaff("admin");
  const startsAt = new Date(input.startsAt);
  const endsAt = new Date(input.endsAt);
  if (!input.title.trim() || Number.isNaN(startsAt.getTime()) || Number.isNaN(endsAt.getTime()) || endsAt <= startsAt) throw new Error("Os dados do encontro sao invalidos.");
  const meetingUrl = input.meetingUrl.trim();
  const recordingUrl = input.recordingUrl?.trim() || null;
  const recordingAvailableUntil = input.recordingAvailableUntil?.trim() || null;
  if (!isHttpUrl(meetingUrl)) throw new Error("O link da sala deve ser uma URL HTTP ou HTTPS.");
  if (recordingUrl && !isHttpUrl(recordingUrl)) throw new Error("O link da gravacao deve ser uma URL HTTP ou HTTPS.");
  if (recordingAvailableUntil && !recordingUrl) throw new Error("Informe a gravacao antes de definir sua validade.");
  if (recordingAvailableUntil && Number.isNaN(new Date(recordingAvailableUntil).getTime())) throw new Error("A validade da gravacao e invalida.");
  const { data, error } = await createAdminClient().from("mentorship_live_sessions").update({ title: input.title.trim().slice(0, 180), agenda: input.agenda.trim().slice(0, 4000), starts_at: startsAt.toISOString(), ends_at: endsAt.toISOString(), meeting_url: meetingUrl, recording_url: recordingUrl, recording_available_until: recordingAvailableUntil ? new Date(recordingAvailableUntil).toISOString() : null }).eq("id", sessionId).select("id,cohort_id,week_number,title,agenda,starts_at,ends_at,meeting_url,recording_url,recording_available_until").maybeSingle();
  if (error || !data) throw new Error(error?.message ?? "Encontro nao encontrado.");
  return data;
}

export async function saveLessonContentAdmin(lessonKey: string, input: { videoUrl?: string; materialUrl?: string; status: typeof lessonContentStatuses[number]; availableAt?: string }) {
  const { user } = await requireStaff("admin");
  if (!findMentorshipLesson(lessonKey) && !findPathV2Lesson(lessonKey)) throw new Error("Aula nao encontrada no catalogo.");
  if (!lessonContentStatuses.includes(input.status)) throw new Error("Status do conteudo invalido.");
  const videoUrl = input.videoUrl?.trim() || null;
  const materialUrl = input.materialUrl?.trim() || null;
  const availableAt = input.availableAt?.trim() || null;
  if (videoUrl && !isHttpUrl(videoUrl)) throw new Error("O video deve usar uma URL HTTP ou HTTPS.");
  if (materialUrl && !isHttpUrl(materialUrl)) throw new Error("O material deve usar uma URL HTTP ou HTTPS.");
  if (input.status === "scheduled" && (!availableAt || Number.isNaN(new Date(availableAt).getTime()))) throw new Error("Defina uma data valida para agendar a aula.");
  const { data, error } = await createAdminClient().from("mentorship_lesson_content").upsert({ lesson_key: lessonKey, video_url: videoUrl, material_url: materialUrl, status: input.status, available_at: availableAt ? new Date(availableAt).toISOString() : null, updated_by: user.id }, { onConflict: "lesson_key" }).select("lesson_key,video_url,material_url,status,available_at,updated_at").single();
  if (error || !data) throw new Error(error?.message ?? "Nao foi possivel salvar o conteudo da aula.");
  return data;
}

export async function saveWeeklyCommitment(userId: string, input: { weekNumber: number; commitment: string }) {
  const { enrollment } = await requireWritableEnrollment();
  if (enrollment.userId !== userId) throw new Error("Matricula invalida.");
  if (!Number.isInteger(input.weekNumber) || input.weekNumber < 1 || input.weekNumber > 12) throw new Error("A semana deve estar entre 1 e 12.");
  const commitment = input.commitment.trim().slice(0, 500);
  if (commitment.length < 1) throw new Error("Escreva um compromisso para esta semana.");
  const admin = createAdminClient();
  const { data, error } = await admin.from("mentorship_weekly_commitments").upsert({ enrollment_id: enrollment.id, week_number: input.weekNumber, commitment, visibility: "mentor" }, { onConflict: "enrollment_id,week_number" }).select("id,week_number,commitment,visibility,check_in,created_at,updated_at").single();
  if (error || !data) throw new Error(error?.message ?? "Nao foi possivel salvar o compromisso.");
  await trackEvent(userId, "weekly_commitment_saved", { week: input.weekNumber, cohort: enrollment.cohortId });
  return data;
}

export async function updateWeeklyCommitmentCheckIn(commitmentId: string, checkInInput: string) {
  const { user, staff } = await requireStaff();
  const admin = createAdminClient();
  const { data: commitment, error: commitmentError } = await admin.from("mentorship_weekly_commitments").select("id,enrollment_id,week_number").eq("id", commitmentId).maybeSingle();
  if (commitmentError || !commitment) throw new Error("Compromisso semanal nao encontrado.");
  const { data: enrollment, error: enrollmentError } = await admin.from("mentorship_enrollments").select("id,cohort_id").eq("id", commitment.enrollment_id).maybeSingle();
  if (enrollmentError || !enrollment) throw new Error("Matricula nao encontrada.");
  await assertStaffForCohort(user.id, staff.role, enrollment.cohort_id);
  const checkIn = checkInInput.trim().slice(0, 1000);
  if (!checkIn) throw new Error("Escreva o retorno do encontro.");
  const { data, error } = await admin.from("mentorship_weekly_commitments").update({ check_in: checkIn }).eq("id", commitment.id).eq("enrollment_id", enrollment.id).select("id,week_number,check_in,updated_at").single();
  if (error || !data) throw new Error(error?.message ?? "Nao foi possivel salvar o retorno.");
  return data;
}

export async function attendanceOptions() {
  const { user, staff } = await requireStaff();
  const admin = createAdminClient();
  let cohortIds: string[] | null = null;
  if (staff.role !== "admin") {
    const { data: memberships, error } = await admin.from("mentorship_cohort_staff").select("cohort_id").eq("staff_user_id", user.id);
    if (error) throw new Error(error.message);
    cohortIds = (memberships ?? []).map((row) => row.cohort_id);
    if (cohortIds.length === 0) return { sessions: [], enrollments: [] };
  }
  let sessionsQuery = admin.from("mentorship_live_sessions").select("id,cohort_id,week_number,title,starts_at").order("starts_at", { ascending: false }).limit(100);
  let enrollmentsQuery = admin.from("mentorship_enrollments").select("id,cohort_id,user_id,level,status").in("status", ["invited", "active", "paused"]).limit(500);
  if (cohortIds) {
    sessionsQuery = sessionsQuery.in("cohort_id", cohortIds);
    enrollmentsQuery = enrollmentsQuery.in("cohort_id", cohortIds);
  }
  const [{ data: sessions, error: sessionsError }, { data: enrollments, error: enrollmentsError }] = await Promise.all([sessionsQuery, enrollmentsQuery]);
  if (sessionsError) throw new Error(sessionsError.message);
  if (enrollmentsError) throw new Error(enrollmentsError.message);
  const userIds = [...new Set((enrollments ?? []).map((enrollment) => enrollment.user_id))];
  const { data: profiles, error: profileError } = userIds.length ? await admin.from("profiles").select("id,full_name,username").in("id", userIds) : { data: [], error: null };
  if (profileError) throw new Error(profileError.message);
  const profilesById = new Map((profiles ?? []).map((profile) => [profile.id, profile]));
  return { sessions: sessions ?? [], enrollments: (enrollments ?? []).map((enrollment) => ({ ...enrollment, full_name: profilesById.get(enrollment.user_id)?.full_name || profilesById.get(enrollment.user_id)?.username || enrollment.user_id })) };
}

export async function markAttendance(input: { sessionId: string; enrollmentId: string; status: "present" | "absent" | "excused" | "watched_recording" }) {
  const { user, staff } = await requireStaff();
  const admin = createAdminClient();
  const { data: session, error: sessionError } = await admin.from("mentorship_live_sessions").select("id,cohort_id").eq("id", input.sessionId).maybeSingle();
  if (sessionError || !session) throw new Error("Encontro nao encontrado.");
  await assertStaffForCohort(user.id, staff.role, session.cohort_id);
  const { data: enrollment, error: enrollmentError } = await admin.from("mentorship_enrollments").select("id,cohort_id").eq("id", input.enrollmentId).maybeSingle();
  if (enrollmentError || !enrollment || enrollment.cohort_id !== session.cohort_id) throw new Error("Aluno nao pertence a turma deste encontro.");
  const { data, error } = await admin.from("mentorship_attendance").upsert({ session_id: input.sessionId, enrollment_id: input.enrollmentId, status: input.status, marked_by: user.id }, { onConflict: "session_id,enrollment_id" }).select("session_id,enrollment_id,status,marked_by,updated_at").single();
  if (error || !data) throw new Error(error?.message ?? "Nao foi possivel registrar a presenca.");
  await trackEvent(user.id, "live_attendance_marked", { session: input.sessionId, enrollment: input.enrollmentId, status: input.status });
  return data;
}

export async function mentorCohorts() {
  const { user, staff } = await requireStaff();
  const admin = createAdminClient();
  if (staff.role === "admin") {
    const { data, error } = await admin.from("mentorship_cohorts").select("id,name,code,starts_on,ends_on,status").order("starts_on", { ascending: false }).limit(50);
    if (error) throw new Error(error.message);
    return data ?? [];
  }
  const { data: memberships, error: membershipError } = await admin.from("mentorship_cohort_staff").select("cohort_id").eq("staff_user_id", user.id);
  if (membershipError) throw new Error(membershipError.message);
  const ids = (memberships ?? []).map((row) => row.cohort_id);
  if (ids.length === 0) return [];
  const { data, error } = await admin.from("mentorship_cohorts").select("id,name,code,starts_on,ends_on,status").in("id", ids).order("starts_on", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getMentorshipAdminOverview() {
  await requireStaff("admin");
  const admin = createAdminClient();
  const [cohortResult, enrollmentResult, sessionResult, submissionResult, profileResult, staffResult, cohortStaffResult, lessonContentResult, authResult, attendanceResult, lessonProgressResult, activityResult, emailQueueResult, failedEmailCountResult] = await Promise.all([
    admin.from("mentorship_cohorts").select("id,name,code,starts_on,ends_on,status,capacity,program_version,created_at").order("starts_on", { ascending: false }).limit(100),
    admin.from("mentorship_enrollments").select("id,cohort_id,user_id,level,status,goal,diagnostic_score,joined_at,created_at").order("created_at", { ascending: false }).limit(1000),
    admin.from("mentorship_live_sessions").select("id,cohort_id,week_number,title,agenda,starts_at,ends_at,meeting_url,recording_url,recording_available_until").order("starts_at", { ascending: false }).limit(200),
    admin.from("mentorship_submissions").select("id,enrollment_id,assignment_key,status,attempt_number,submitted_at,reviewed_at,created_at").order("created_at", { ascending: false }).limit(500),
    admin.from("profiles").select("id,full_name,username").limit(1000),
    admin.from("mentorship_staff").select("user_id,role,active").limit(500),
    admin.from("mentorship_cohort_staff").select("cohort_id,staff_user_id,role").limit(1000),
    admin.from("mentorship_lesson_content").select("lesson_key,video_url,material_url,status,available_at,updated_at").order("lesson_key"),
    admin.auth.admin.listUsers({ page: 1, perPage: 1000 }),
    admin.from("mentorship_attendance").select("session_id,enrollment_id,status,updated_at").limit(10000),
    admin.from("mentorship_lesson_progress").select("enrollment_id,lesson_key,status,completed_at").limit(10000),
    admin.from("activity_events").select("name,props,created_at").in("name", ["diagnostic_completed", "lesson_completed", "assignment_submitted", "review_completed", "live_attendance_marked", "weekly_commitment_saved", "mentorship_certificate_issued"]).gte("created_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()).limit(10000),
    admin.from("mentorship_email_outbox").select("id", { count: "exact", head: true }).in("status", ["queued", "sending"]),
    admin.from("mentorship_email_outbox").select("id", { count: "exact", head: true }).eq("status", "failed"),
  ]);
  const firstError = cohortResult.error ?? enrollmentResult.error ?? sessionResult.error ?? submissionResult.error ?? profileResult.error ?? staffResult.error ?? cohortStaffResult.error ?? authResult.error ?? attendanceResult.error ?? lessonProgressResult.error ?? activityResult.error ?? emailQueueResult.error ?? failedEmailCountResult.error;
  if (firstError) throw new Error(firstError.message);
  const profileById = new Map((profileResult.data ?? []).map((profile) => [profile.id, profile]));
  const people = (authResult.data?.users ?? []).map((authUser) => {
    const profile = profileById.get(authUser.id);
    const metadataName = typeof authUser.user_metadata?.full_name === "string" ? authUser.user_metadata.full_name.trim() : "";
    return { id: authUser.id, email: authUser.email ?? "", fullName: profile?.full_name?.trim() || metadataName || authUser.email?.split("@")[0] || "Usuario", username: profile?.username ?? null, lastSignInAt: authUser.last_sign_in_at ?? null, createdAt: authUser.created_at };
  });
  const cohorts = cohortResult.data ?? [];
  const enrollments = enrollmentResult.data ?? [];
  const sessions = sessionResult.data ?? [];
  const submissions = submissionResult.data ?? [];
  const latestAttemptByAssignment = new Map<string, { attempt: number; status: string }>();
  for (const row of submissions) {
    const key = `${row.enrollment_id}:${row.assignment_key}`;
    const current = latestAttemptByAssignment.get(key);
    if (!current || Number(row.attempt_number) > current.attempt) latestAttemptByAssignment.set(key, { attempt: Number(row.attempt_number), status: row.status });
  }
  const attendanceByKey = new Map((attendanceResult.data ?? []).map((row) => [`${row.session_id}:${row.enrollment_id}`, row.status]));
  const activityCounts = new Map<string, number>();
  for (const event of activityResult.data ?? []) {
    const props = event.props && typeof event.props === "object" ? event.props as Record<string, unknown> : {};
    const cohortId = typeof props.cohort === "string" ? props.cohort : typeof props.cohortId === "string" ? props.cohortId : "";
    if (cohortId) activityCounts.set(cohortId, (activityCounts.get(cohortId) ?? 0) + 1);
  }
  const nowMs = Date.now();
  const cohortMetrics = cohorts.map((cohort) => {
    const assignmentKeys = cohort.program_version === "v2" ? pathV2Assignments.map((item) => item.key) : mentorshipWeeks.map((week) => week.assignment.key);
    const lessonKeys = cohort.program_version === "v2" ? pathV2LessonKeys : mentorshipWeeks.flatMap((week) => week.lessons.map((lesson) => lesson.key));
    const roster = enrollments.filter((row) => row.cohort_id === cohort.id && ["active", "completed"].includes(row.status));
    const rosterIds = new Set(roster.map((row) => row.id));
    const completedAssignmentCount = roster.reduce((sum, row) => sum + assignmentKeys.filter((key) => latestAttemptByAssignment.get(`${row.id}:${key}`)?.status === "approved").length, 0);
    const progressPercent = roster.length ? Math.round(completedAssignmentCount / (roster.length * assignmentKeys.length) * 100) : 0;
    const completedLessonCount = (lessonProgressResult.data ?? []).filter((row) => rosterIds.has(row.enrollment_id) && lessonKeys.includes(row.lesson_key) && row.status === "completed").length;
    const lessonPercent = roster.length ? Math.round(completedLessonCount / (roster.length * lessonKeys.length) * 100) : 0;
    const cohortSessions = sessions.filter((session) => session.cohort_id === cohort.id);
    const pastSessions = cohortSessions.filter((session) => new Date(session.ends_at).getTime() <= nowMs);
    const expectedAttendances = roster.length * pastSessions.length;
    const presentCount = pastSessions.reduce((sum, session) => sum + roster.filter((row) => ["present", "watched_recording"].includes(String(attendanceByKey.get(`${session.id}:${row.id}`)))).length, 0);
    const pendingOverSla = submissions.filter((row) => rosterIds.has(row.enrollment_id) && ["submitted", "in_review"].includes(row.status) && row.submitted_at && nowMs - new Date(row.submitted_at).getTime() > 72 * 60 * 60 * 1000).length;
    return { cohortId: cohort.id, cohortName: cohort.name, activeStudents: roster.filter((row) => row.status === "active").length, progressPercent, lessonPercent, attendancePercent: expectedAttendances ? Math.round(presentCount / expectedAttendances * 100) : null, pendingOverSla, recentEvents: activityCounts.get(cohort.id) ?? 0 };
  });
  const emailQueue = { queued: emailQueueResult.count ?? 0, failed: failedEmailCountResult.count ?? 0 };
  return { cohorts, enrollments, sessions, submissions, people, staff: staffResult.data ?? [], cohortStaff: cohortStaffResult.data ?? [], lessonContent: lessonContentResult.error ? [] : lessonContentResult.data ?? [], cohortMetrics, emailQueue };
}

export async function getMentorCohortOverview(cohortId: string) {
  const { user, staff } = await requireStaff();
  const admin = createAdminClient();
  await assertStaffForCohort(user.id, staff.role, cohortId);
  const [cohortResult, enrollmentResult, sessionResult] = await Promise.all([
    admin.from("mentorship_cohorts").select("id,name,code,starts_on,ends_on,status,program_version").eq("id", cohortId).maybeSingle(),
    admin.from("mentorship_enrollments").select("id,user_id,level,status,diagnostic_score,joined_at").eq("cohort_id", cohortId).in("status", ["invited", "active", "paused", "completed"]).order("created_at"),
    admin.from("mentorship_live_sessions").select("id,week_number,title,agenda,starts_at,ends_at,meeting_url").eq("cohort_id", cohortId).order("week_number"),
  ]);
  const cohort = cohortResult.data;
  const enrollments = enrollmentResult.data;
  const sessions = sessionResult.data;
  const firstError = cohortResult.error ?? enrollmentResult.error ?? sessionResult.error;
  if (firstError) throw new Error(firstError.message);
  if (!cohort) return null;
  const enrollmentIds = (enrollments ?? []).map((row) => row.id);
  const userIds = [...new Set((enrollments ?? []).map((row) => row.user_id))];
  const sessionIds = (sessions ?? []).map((row) => row.id);
  const [submissionResult, lessonResult, attendanceResult, profileResult] = await Promise.all([
    enrollmentIds.length ? admin.from("mentorship_submissions").select("id,enrollment_id,assignment_key,status,attempt_number,submitted_at,reviewed_at").in("enrollment_id", enrollmentIds) : Promise.resolve({ data: [], error: null }),
    enrollmentIds.length ? admin.from("mentorship_lesson_progress").select("enrollment_id,lesson_key,status,completed_at").in("enrollment_id", enrollmentIds) : Promise.resolve({ data: [], error: null }),
    sessionIds.length ? admin.from("mentorship_attendance").select("session_id,enrollment_id,status,updated_at").in("session_id", sessionIds) : Promise.resolve({ data: [], error: null }),
    userIds.length ? admin.from("profiles").select("id,full_name,username").in("id", userIds) : Promise.resolve({ data: [], error: null }),
  ]);
  const detailsError = submissionResult.error ?? lessonResult.error ?? attendanceResult.error ?? profileResult.error;
  if (detailsError) throw new Error(detailsError.message);
  const profilesById = new Map((profileResult.data ?? []).map((profile) => [profile.id, profile]));
  return {
    cohort,
    enrollments: (enrollments ?? []).map((enrollment) => ({ ...enrollment, full_name: profilesById.get(enrollment.user_id)?.full_name || profilesById.get(enrollment.user_id)?.username || enrollment.user_id })),
    submissions: submissionResult.data ?? [], lessons: lessonResult.data ?? [], sessions: sessions ?? [], attendance: attendanceResult.data ?? [],
  };
}

export async function getMentorStudentOverview(enrollmentId: string) {
  const { user, staff } = await requireStaff();
  const admin = createAdminClient();
  const { data: enrollment, error: enrollmentError } = await admin.from("mentorship_enrollments").select("id,cohort_id,user_id,level,status,goal,diagnostic_score,joined_at,created_at").eq("id", enrollmentId).maybeSingle();
  if (enrollmentError) throw new Error(enrollmentError.message);
  if (!enrollment) return null;
  await assertStaffForCohort(user.id, staff.role, enrollment.cohort_id);
  const [{ data: cohort, error: cohortError }, { data: profile, error: profileError }, { data: submissions, error: submissionsError }, { data: lessons, error: lessonsError }, { data: sessions, error: sessionsError }, { data: commitments, error: commitmentsError }] = await Promise.all([
    admin.from("mentorship_cohorts").select("id,name,code,program_version").eq("id", enrollment.cohort_id).maybeSingle(),
    admin.from("profiles").select("id,full_name,username").eq("id", enrollment.user_id).maybeSingle(),
    admin.from("mentorship_submissions").select("id,assignment_key,status,attempt_number,submitted_at,reviewed_at,created_at").eq("enrollment_id", enrollment.id).order("created_at", { ascending: false }),
    admin.from("mentorship_lesson_progress").select("lesson_key,status,completed_at").eq("enrollment_id", enrollment.id),
    admin.from("mentorship_live_sessions").select("id,week_number,title,agenda,starts_at,ends_at,meeting_url").eq("cohort_id", enrollment.cohort_id).order("week_number"),
    admin.from("mentorship_weekly_commitments").select("id,week_number,commitment,check_in,visibility,updated_at").eq("enrollment_id", enrollment.id).order("week_number"),
  ]);
  const readError = cohortError ?? profileError ?? submissionsError ?? lessonsError ?? sessionsError ?? commitmentsError;
  if (readError) throw new Error(readError.message);
  const sessionIds = (sessions ?? []).map((session) => session.id);
  const { data: attendance, error: attendanceError } = sessionIds.length
    ? await admin.from("mentorship_attendance").select("session_id,status,updated_at").eq("enrollment_id", enrollment.id).in("session_id", sessionIds)
    : { data: [], error: null };
  if (attendanceError) throw new Error(attendanceError.message);
  return {
    enrollment,
    cohort,
    studentName: profile?.full_name?.trim() || profile?.username || enrollment.user_id,
    submissions: submissions ?? [], lessons: lessons ?? [], sessions: sessions ?? [], attendance: attendance ?? [], commitments: commitments ?? [],
  };
}

export async function markMentorshipNotificationRead(userId: string, notificationId: string) {
  const admin = createAdminClient();
  const { data, error } = await admin.from("mentorship_notifications").update({ read_at: new Date().toISOString() }).eq("id", notificationId).eq("user_id", userId).select("id,read_at").maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Notificacao nao encontrada.");
  return data;
}
