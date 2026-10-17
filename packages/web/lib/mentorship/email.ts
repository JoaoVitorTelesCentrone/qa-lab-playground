import { createAdminClient } from "@/lib/supabase/admin";

type EmailJob = {
  id: string;
  notification_id: string | null;
  user_id: string;
  kind: string;
  dedupe_key: string;
  subject: string;
  body: string;
  href: string | null;
  attempts: number;
};

const configured = () => process.env.MENTORSHIP_EMAIL_ENABLED === "true" && Boolean(process.env.RESEND_API_KEY && process.env.MENTORSHIP_FROM_EMAIL);
const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]!);

export async function sendMentorshipEmail(job: EmailJob, recipient: string) {
  if (!configured()) throw new Error("MENTORSHIP_EMAIL_NOT_CONFIGURED");
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
  const path = job.href && job.href.startsWith("/") && !job.href.startsWith("//") ? job.href : "/mentoria/app";
  const url = `${baseUrl}${path}`;
  const response = await fetch("https://api.resend.com/emails", {
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
  if (!notification) return false;
  const { error } = await admin.from("mentorship_email_outbox").upsert({ notification_id: notification.id, user_id: input.userId, kind: input.kind, dedupe_key: input.dedupeKey, subject: input.subject, body: input.body, href: input.href }, { onConflict: "dedupe_key", ignoreDuplicates: true });
  if (error) throw new Error(error.message);
  return true;
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
    for (const enrollment of recipients) queued += Number(await queueReminder(admin, { userId: enrollment.user_id, kind: "reminder", dedupeKey: `session-reminder:${session.id}:${enrollment.user_id}`, subject: `Encontro da Mentoria se aproxima · semana ${session.week_number}`, body: `${session.title} começa em breve. Confira a pauta e o link no painel da Mentoria.`, href: `/mentoria/semanas/${session.week_number}` }));
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

export async function processMentorshipEmailQueue(limit = 30) {
  if (!configured()) return { configured: false, sent: 0, failed: 0, pending: 0 };
  const admin = createAdminClient();
  const now = new Date();
  const staleBefore = new Date(now.getTime() - 15 * 60 * 1000).toISOString();
  await admin.from("mentorship_email_outbox").update({ status: "queued", locked_at: null }).eq("status", "sending").lt("locked_at", staleBefore);
  const { data: jobs, error } = await admin.from("mentorship_email_outbox").select("id,notification_id,user_id,kind,dedupe_key,subject,body,href,attempts").eq("status", "queued").lte("available_at", now.toISOString()).order("created_at", { ascending: true }).limit(Math.max(1, Math.min(limit, 100)));
  if (error) throw new Error(error.message);
  let sent = 0;
  let failed = 0;
  for (const job of (jobs ?? []) as EmailJob[]) {
    const claim = await admin.from("mentorship_email_outbox").update({ status: "sending", locked_at: new Date().toISOString(), attempts: job.attempts + 1 }).eq("id", job.id).eq("status", "queued").select("id").maybeSingle();
    if (claim.error || !claim.data) continue;
    const { data: authResult, error: authError } = await admin.auth.admin.getUserById(job.user_id);
    const recipient = authResult.user?.email;
    try {
      if (authError || !recipient) throw new Error("RECIPIENT_EMAIL_UNAVAILABLE");
      await sendMentorshipEmail(job, recipient);
      await admin.from("mentorship_email_outbox").update({ status: "sent", sent_at: new Date().toISOString(), locked_at: null, last_error: null }).eq("id", job.id);
      sent += 1;
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : "UNKNOWN_EMAIL_ERROR";
      const attempts = job.attempts + 1;
      const permanentlyFailed = attempts >= 5 || message === "RECIPIENT_EMAIL_UNAVAILABLE";
      const delayMinutes = Math.min(6 * 60, 5 * (2 ** Math.max(0, attempts - 1)));
      await admin.from("mentorship_email_outbox").update({ status: permanentlyFailed ? "failed" : "queued", locked_at: null, available_at: new Date(Date.now() + delayMinutes * 60_000).toISOString(), last_error: message.slice(0, 500) }).eq("id", job.id);
      failed += 1;
    }
  }
  const { count } = await admin.from("mentorship_email_outbox").select("id", { count: "exact", head: true }).eq("status", "queued");
  return { configured: true, sent, failed, pending: count ?? 0 };
}
