import { createAdminClient } from "@/lib/supabase/admin";
import { getSessionUser, type SessionUser } from "@/lib/product/store";
import { isAdmin } from "@/lib/product/metrics-store";
import type { MentorshipEnrollment } from "./types";

export class MentorshipAccessError extends Error {
  constructor(readonly status: 401 | 403 | 404, message: string) {
    super(message);
  }
}

type StaffRow = { user_id: string; role: "mentor" | "admin"; active: boolean };
type EnrollmentRow = {
  id: string;
  cohort_id: string;
  user_id: string;
  status: string;
  level: string;
  goal: string | null;
  diagnostic_score: unknown;
  joined_at: string | null;
  completed_at: string | null;
};

function toEnrollment(row: EnrollmentRow, programVersion: "v1" | "v2"): MentorshipEnrollment {
  return {
    id: row.id,
    cohortId: row.cohort_id,
    userId: row.user_id,
    status: row.status as MentorshipEnrollment["status"],
    level: row.level as MentorshipEnrollment["level"],
    goal: row.goal,
    diagnosticScore: row.diagnostic_score && typeof row.diagnostic_score === "object" ? row.diagnostic_score as Record<string, unknown> : {},
    joinedAt: row.joined_at,
    completedAt: row.completed_at,
    programVersion,
  };
}

export async function requireSession() {
  const user = await getSessionUser();
  if (!user) throw new MentorshipAccessError(401, "Entre na sua conta para acessar a mentoria.");
  return user;
}

export async function getStaff(user: SessionUser): Promise<StaffRow | null> {
  // O allowlist legado continua sendo uma ponte segura para o primeiro admin.
  if (isAdmin(user.email)) return { user_id: user.id, role: "admin", active: true };
  try {
    const admin = createAdminClient();
    const { data } = await admin.from("mentorship_staff").select("user_id,role,active").eq("user_id", user.id).eq("active", true).maybeSingle();
    return (data as StaffRow | null) ?? null;
  } catch {
    return null;
  }
}

export async function requireStaff(role?: "mentor" | "admin") {
  const user = await requireSession();
  const staff = await getStaff(user);
  if (!staff || (role === "admin" && staff.role !== "admin")) {
    throw new MentorshipAccessError(403, "Esta area e restrita a equipe da mentoria.");
  }
  return { user, staff };
}

export async function getEnrollmentForUser(userId: string, enrollmentId?: string) {
  try {
    const admin = createAdminClient();
    let query = admin
      .from("mentorship_enrollments")
      .select("id,cohort_id,user_id,status,level,goal,diagnostic_score,joined_at,completed_at")
      .eq("user_id", userId)
      .in("status", ["invited", "active", "paused", "completed"])
      .order("created_at", { ascending: false })
      .limit(1);
    if (enrollmentId) query = query.eq("id", enrollmentId);
    const { data, error } = await query.maybeSingle();
    if (error) throw new Error(`Nao foi possivel carregar sua matricula: ${error.message}`);
    if (!data) return null;
    const { data: cohort, error: cohortError } = await admin.from("mentorship_cohorts").select("program_version").eq("id", data.cohort_id).maybeSingle();
    if (cohortError || !cohort) throw new Error(`Nao foi possivel carregar sua matricula: ${cohortError?.message ?? "turma nao encontrada"}`);
    return toEnrollment(data as EnrollmentRow, cohort.program_version === "v2" ? "v2" : "v1");
  } catch (error) {
    if (error instanceof Error && error.message.startsWith("Nao foi possivel carregar sua matricula:")) throw error;
    throw new Error(error instanceof Error ? error.message : "Nao foi possivel carregar sua matricula.");
  }
}

export async function requireEnrollment(enrollmentId?: string) {
  const user = await requireSession();
  const enrollment = await getEnrollmentForUser(user.id, enrollmentId);
  if (!enrollment) throw new MentorshipAccessError(403, "Sua conta ainda nao esta matriculada em uma turma ativa.");
  if (enrollment.status === "invited") throw new MentorshipAccessError(403, "Sua vaga foi reservada. A equipe precisa confirmar sua matrícula antes do início da jornada.");
  return { user, enrollment };
}

export async function requireWritableEnrollment(enrollmentId?: string) {
  const result = await requireEnrollment(enrollmentId);
  if (result.enrollment.status === "paused") throw new MentorshipAccessError(403, "Sua matricula esta pausada. Fale com a equipe da mentoria para retomar o acesso.");
  if (result.enrollment.status !== "active") throw new MentorshipAccessError(403, "Sua jornada de mentoria já foi concluída.");
  return result;
}

export async function assertStaffForCohort(userId: string, role: "mentor" | "admin", cohortId: string) {
  const admin = createAdminClient();
  if (role === "admin") return;
  const { data } = await admin.from("mentorship_cohort_staff").select("cohort_id").eq("cohort_id", cohortId).eq("staff_user_id", userId).maybeSingle();
  if (!data) throw new MentorshipAccessError(403, "Voce nao esta associado a esta turma.");
}
