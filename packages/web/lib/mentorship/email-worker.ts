export type EmailJob = {
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

export type EmailQueueStore = {
  claim: (job: EmailJob, lockedAt: string) => Promise<boolean>;
  recipient: (userId: string) => Promise<string>;
  sent: (id: string, lockedAt: string) => Promise<void>;
  retry: (id: string, lockedAt: string, values: { status: "queued" | "failed"; available_at: string; last_error: string }) => Promise<void>;
};

/** A durable claim plus provider idempotency makes overlapping runs safe. */
export async function runEmailBatch(jobs: EmailJob[], store: EmailQueueStore, send: (job: EmailJob, recipient: string) => Promise<void>, options: { budgetMs?: number; now?: () => number; pause?: (ms: number) => Promise<void> } = {}) {
  const now = options.now ?? Date.now;
  const pause = options.pause ?? ((ms) => new Promise<void>((resolve) => setTimeout(resolve, ms)));
  const deadline = now() + (options.budgetMs ?? 40_000);
  let sent = 0;
  let failed = 0;
  let previousSendAt: number | null = null;
  for (const job of jobs) {
    // Leave time for the provider timeout and persistence before the route ends.
    if (now() + 14_000 >= deadline) break;
    const lockedAt = new Date(now()).toISOString();
    if (!await store.claim(job, lockedAt)) continue;
    try {
      const recipient = await store.recipient(job.user_id);
      // Resend's default throughput is two requests/second. Also handle 429s below.
      if (previousSendAt !== null) await pause(Math.max(0, 600 - (now() - previousSendAt)));
      previousSendAt = now();
      await send(job, recipient);
      await store.sent(job.id, lockedAt);
      sent += 1;
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : "UNKNOWN_EMAIL_ERROR";
      const attempts = job.attempts + 1;
      const permanent = attempts >= 5 || message === "RECIPIENT_EMAIL_UNAVAILABLE";
      const delayMinutes = Math.min(360, 5 * 2 ** Math.max(0, attempts - 1));
      await store.retry(job.id, lockedAt, { status: permanent ? "failed" : "queued", available_at: new Date(now() + delayMinutes * 60_000).toISOString(), last_error: message.slice(0, 500) });
      failed += 1;
    }
  }
  return { sent, failed };
}
