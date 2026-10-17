import { createAdminClient } from "@/lib/supabase/admin";
import { requireEnrollment } from "./access";

export type MentorshipPortfolioCase = {
  id: string;
  submissionId: string;
  userId: string;
  title: string;
  summary: string;
  evidence: string;
  repositoryUrl: string | null;
  reportUrl: string | null;
  published: boolean;
  createdAt: string;
  updatedAt: string;
};

const columns = "id,submission_id,user_id,title,summary,evidence,repository_url,report_url,published,created_at,updated_at";

function toCase(row: Record<string, unknown>): MentorshipPortfolioCase {
  return {
    id: String(row.id), submissionId: String(row.submission_id), userId: String(row.user_id), title: String(row.title), summary: String(row.summary ?? ""), evidence: String(row.evidence ?? ""), repositoryUrl: typeof row.repository_url === "string" ? row.repository_url : null, reportUrl: typeof row.report_url === "string" ? row.report_url : null, published: Boolean(row.published), createdAt: String(row.created_at), updatedAt: String(row.updated_at),
  };
}

export async function getOwnMentorshipCase(submissionId: string) {
  try {
    const { enrollment } = await requireEnrollment();
    const admin = createAdminClient();
    const { data } = await admin.from("mentorship_portfolio_cases").select(columns).eq("submission_id", submissionId).eq("user_id", enrollment.userId).maybeSingle();
    return data ? toCase(data as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

export async function publishMentorshipCase(userId: string, input: { submissionId: string; title: string; summary: string; published: boolean }) {
  const { enrollment } = await requireEnrollment();
  if (enrollment.userId !== userId) throw new Error("Matricula invalida.");
  const admin = createAdminClient();
  const { data: submission, error: submissionError } = await admin.from("mentorship_submissions").select("id,enrollment_id,assignment_key,status,content,repository_url,report_url").eq("id", input.submissionId).eq("enrollment_id", enrollment.id).maybeSingle();
  if (submissionError || !submission) throw new Error("Entrega final nao encontrada.");
  if (submission.assignment_key !== "mentoria.w12.assignment") throw new Error("Somente a entrega final da semana 12 pode virar case.");
  if (submission.status !== "approved") throw new Error("O case so pode ser publicado depois da aprovacao do mentor.");
  const title = input.title.trim().slice(0, 160);
  const summary = input.summary.trim().slice(0, 2000);
  if (title.length < 3) throw new Error("Informe um titulo para o case.");
  if (summary.length < 20) throw new Error("Escreva um resumo de pelo menos 20 caracteres.");
  const content = submission.content && typeof submission.content === "object" ? submission.content as Record<string, unknown> : {};
  const response = typeof content.response === "string" ? content.response : JSON.stringify(content);
  const { data, error } = await admin.from("mentorship_portfolio_cases").upsert({ submission_id: submission.id, user_id: userId, title, summary, evidence: response.slice(0, 12000), repository_url: submission.repository_url, report_url: submission.report_url, published: input.published }, { onConflict: "submission_id" }).select(columns).single();
  if (error || !data) throw new Error(error?.message ?? "Nao foi possivel salvar o case.");
  return toCase(data as Record<string, unknown>);
}
