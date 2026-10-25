import { createAdminClient } from "@/lib/supabase/admin";
import { runEmailBatch, type EmailJob, type EmailQueueStore } from "./email-worker";
import { sessionHref } from "./sessions";
import { providerUrl } from "@/lib/test-provider";

const configured = () => process.env.MENTORSHIP_EMAIL_ENABLED === "true" && Boolean(process.env.RESEND_API_KEY && process.env.MENTORSHIP_FROM_EMAIL);
const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]!);

export async function sendMentorshipEmail(job: EmailJob, recipient: string) {
  if (!configured()) throw new Error("MENTORSHIP_EMAIL_NOT_CONFIGURED");
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
  const path = job.href && job.href.startsWith("/") && !job.href.startsWith("//") ? job.href : "/mentoria/app";
  const url = `${baseUrl}${path}`;
  const response = await fetch(`${providerUrl("https://api.resend.com", process.env.QALAB_TEST_RESEND_URL)}/emails`, {
    method: "POST",
    headers: { authorization: `Bearer ${process.env.RESEND_API_KEY}`, "content-type": "application/json", "Idempotency-Key": job.dedupe_key },
    body: JSON.stringify({
      from: process.env.MENTORSHIP_FROM_EMAIL,
      to: [recipient],
      subject: job.subject,
      html: `<div style="font-family:Arial,sans-serif;color:#20252b;line-height:1.6"><p>${escapeHtml(job.body)}</p><p><a href="${escapeHtml(url)}" style="display:inline-block;background:#9fe870;color:#101319;padding:12px 18px;border-radius:8px;text-decoration:none;font-weight:700">Abrir Mentoria QA Lab</a></p><p style="font-size:12px;color:#68727e">Você recebeu este aviso por participar da Mentoria QA Lab.</p></div>`,
      tags: [{ name: "product", value: "mentoria" }, { name: "kind", value: job.kind.replace(/[^a-z0-9_-]/gi, "_").slice(0, 40) }],
    }),
    signal: AbortSignal.timeout(12_000),
  });
  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`RESEND_${response.status}: ${detail.slice(0, 350)}`);
  }
}

async function queueReminder(admin: ReturnType<typeof createAdminClient>, input: { userId: string; kind: string; dedupeKey: string; subject: string; body: string; href: string }) {
  const { data: notification, error: notificationError } = await admin.from("mentorship_notifications").upsert({ user_id: input.userId, kind: "system", dedupe_key: input.dedupeKey, title: input.subject, body: input.body, href: input.href }, { onConflict: "dedupe_key", ignoreDuplicates: true }).select("id").maybeSingle();
  if (notificationError) throw new Error(notificationError.message);
  // Recover when the previous run persisted a notification but not its outbox row.
  const existing = notification ?? (await admin.from("mentorship_notifications").select("id").eq("dedupe_key", input.dedupeKey).single()).data;
  if (!existing) throw new Error("REMINDER_NOTIFICATION_UNAVAILABLE");
  const { error } = await admin.from("mentorship_email_outbox").upsert({ notification_id: existing.id, user_id: input.userId, kind: input.kind, dedupe_key: input.dedupeKey, subject: input.subject, body: input.body, href: input.href }, { onConflict: "dedupe_key", ignoreDuplicates: true });
  if (error) throw new Error(error.message);
  return Boolean(notification);
}

export async function enqueueMentorshipReminders(now = new Date()) {
  const admin = createAdminClient();
  const upperBound = new Date(now.getTime() + 36 * 60 * 60 * 1000).toISOString();
  const [{ data: sessions, error: sessionError }, { data: enrollments, error: enrollmentError }, { data: pendingReviews, error: reviewError }, { data: staffAssignments, error: staffError }] = await Promise.all([
    admin.from("mentorship_live_sessions").select("id,cohort_id,week_number,starts_at,title").gte("starts_at", now.toISOString()).lte("starts_at", upperBound),
    admin.from("mentorship_enrollments").select("id,user_id,cohort_id").eq("status", "active"),
    admin.from("mentorship_submissions").select("id,enrollment_id,submitted_at,status").in("status", ["submitted", "in_review"]).lt("submitted_at", new Date(now.getTime() - 48 * 60 * 60 * 1000).toISOString()).limit(500),
    admin.from("mentorship_cohort_staff").select("cohort_id,staff_user_id"),
  ]);
  const queryError = sessionError ?? enrollmentError ?? reviewError ?? staffError;
  if (queryError) throw new Error(queryError.message);

  const enrollmentById = new Map((enrollments ?? []).map((enrollment) => [enrollment.id, enrollment]));
  let queued = 0;
  for (const session of sessions ?? []) {
    const recipients = (enrollments ?? []).filter((enrollment) => enrollment.cohort_id === session.cohort_id);
    for (const enrollment of recipients) queued += Number(await queueReminder(admin, { userId: enrollment.user_id, kind: "reminder", dedupeKey: `session-reminder:${session.id}:${enrollment.user_id}`, subject: `Encontro da Mentoria se aproxima · semana ${session.week_number}`, body: `${session.title} começa em breve. Confira a pauta e o link nos encontros da turma.`, href: sessionHref(session.id) }));
  }
  const staffByCohort = new Map<string, string[]>();
  for (const assignment of staffAssignments ?? []) staffByCohort.set(assignment.cohort_id, [...(staffByCohort.get(assignment.cohort_id) ?? []), assignment.staff_user_id]);
  for (const submission of pendingReviews ?? []) {
    const enrollment = enrollmentById.get(submission.enrollment_id);
    if (!enrollment) continue;
    for (const staffUserId of staffByCohort.get(enrollment.cohort_id) ?? []) queued += Number(await queueReminder(admin, { userId: staffUserId, kind: "reminder", dedupeKey: `review-reminder:${submission.id}:${staffUserId}`, subject: "Entrega de mentoria aguardando revisão", body: "Há uma entrega na fila há mais de 48 horas. Confira o prazo de revisão e o contexto da turma.", href: "/mentoria/mentor" }));
  }
  return { queued };
}

export async function processMentorshipEmailQueue(limit = 100, options: { userIds?: string[]; budgetMs?: number } = {}) {
  if (!configured()) return { configured: false, sent: 0, failed: 0, pending: 0, health: null };
  const admin = createAdminClient();
  const now = new Date();
  const staleBefore = new Date(now.getTime() - 15 * 60 * 1000).toISOString();
  const { error: recoveryError } = await admin.from("mentorship_email_outbox").update({ status: "queued", locked_at: null }).eq("status", "sending").lt("locked_at", staleBefore);
  if (recoveryError) throw new Error(recoveryError.message);
  let query = admin.from("mentorship_email_outbox").select("id,notification_id,user_id,kind,dedupe_key,subject,body,href,attempts").eq("status", "queued").lte("available_at", now.toISOString()).order("created_at", { ascending: true }).limit(Math.max(1, Math.min(limit, 200)));
  if (options.userIds) {
    if (!options.userIds.length) return { configured: true, sent: 0, failed: 0, pending: 0, health: null };
    query = query.in("user_id", options.userIds);
  }
  const { data: jobs, error } = await query;
  if (error) throw new Error(error.message);
  const store: EmailQueueStore = {
    async claim(job, lockedAt) {
      const result = await admin.from("mentorship_email_outbox").update({ status: "sending", locked_at: lockedAt, attempts: job.attempts + 1 }).eq("id", job.id).eq("status", "queued").eq("attempts", job.attempts).select("id").maybeSingle();
      if (result.error) throw new Error(result.error.message);
      return Boolean(result.data);
    },
    async recipient(userId) {
      const { data, error } = await admin.auth.admin.getUserById(userId);
      if (error) throw new Error("RECIPIENT_LOOKUP_FAILED");
      if (!data.user?.email) throw new Error("RECIPIENT_EMAIL_UNAVAILABLE");
      return data.user.email;
    },
    async sent(id, lockedAt) {
      const result = await admin.from("mentorship_email_outbox").update({ status: "sent", sent_at: new Date().toISOString(), locked_at: null, last_error: null }).eq("id", id).eq("status", "sending").eq("locked_at", lockedAt).select("id").single();
      if (result.error) throw new Error("EMAIL_DELIVERY_PERSIST_FAILED");
    },
    async retry(id, lockedAt, values) {
      const result = await admin.from("mentorship_email_outbox").update({ ...values, locked_at: null }).eq("id", id).eq("status", "sending").eq("locked_at", lockedAt).select("id").single();
      if (result.error) throw new Error("EMAIL_RETRY_PERSIST_FAILED");
    },
  };
  const delivery = await runEmailBatch((jobs ?? []) as EmailJob[], store, sendMentorshipEmail, options);
  const health = await getMentorshipEmailHealth();
  if (health.failed || health.overdue) console.error("Mentorship email queue needs attention", health);
  return { configured: true, ...delivery, pending: health.queued, health };
}

export async function getMentorshipEmailHealth() {
  const admin = createAdminClient();
  const [pending, failed, oldest, overdue] = await Promise.all([
    admin.from("mentorship_email_outbox").select("id", { count: "exact", head: true }).in("status", ["queued", "sending"]),
    admin.from("mentorship_email_outbox").select("id", { count: "exact", head: true }).eq("status", "failed"),
    admin.from("mentorship_email_outbox").select("created_at").in("status", ["queued", "sending"]).order("created_at").limit(1).maybeSingle(),
    admin.from("mentorship_email_outbox").select("id", { count: "exact", head: true }).in("status", ["queued", "sending"]).lt("created_at", new Date(Date.now() - 15 * 60_000).toISOString()),
  ]);
  const error = pending.error ?? failed.error ?? oldest.error ?? overdue.error;
  if (error) throw new Error(error.message);
  return { queued: pending.count ?? 0, failed: failed.count ?? 0, overdue: overdue.count ?? 0, oldestQueuedAt: oldest.data?.created_at ?? null };
}
