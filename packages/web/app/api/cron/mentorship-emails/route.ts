import { enqueueMentorshipReminders, processMentorshipEmailQueue } from "@/lib/mentorship/email";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return Response.json({ error: "Cron nao configurado." }, { status: 503 });
  if (request.headers.get("authorization") !== `Bearer ${secret}`) return Response.json({ error: "Nao autorizado." }, { status: 401 });
  try {
    const reminders = await enqueueMentorshipReminders();
    const delivery = await processMentorshipEmailQueue(100);
    const unhealthy = !delivery.configured || (delivery.health && (delivery.health.failed > 0 || delivery.health.overdue > 0));
    return Response.json({ reminders, delivery }, { status: unhealthy ? 503 : 200 });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Falha no processamento de e-mails." }, { status: 500 });
  }
}
