import { describe, expect, test } from "bun:test";
import { runEmailBatch, type EmailJob, type EmailQueueStore } from "./email-worker";

const job = (id: number, attempts = 0): EmailJob => ({ id: String(id), attempts, notification_id: null, user_id: "student", kind: "review", dedupe_key: `notification:${id}`, subject: "Feedback", body: "Revise sua entrega", href: "/mentoria/app" });

function queue() {
  const claimed = new Set<string>();
  const delivered: string[] = [];
  const retries: Array<{ id: string; status: string; available_at: string; last_error: string }> = [];
  const store: EmailQueueStore = {
    claim: async (item) => { if (claimed.has(item.id)) return false; claimed.add(item.id); return true; },
    recipient: async () => "student@example.test",
    sent: async (id) => { delivered.push(id); },
    retry: async (id, _lock, values) => { retries.push({ id, ...values }); },
  };
  return { store, delivered, retries };
}

describe("durable mentorship email worker", () => {
  test("delivers forty notices instead of leaving ten behind at the old batch limit", async () => {
    const q = queue();
    const ids: string[] = [];
    const result = await runEmailBatch(Array.from({ length: 40 }, (_, i) => job(i)), q.store, async (item) => { ids.push(item.dedupe_key); }, { now: () => 1000, pause: async () => {} });
    expect(result).toEqual({ sent: 40, failed: 0 });
    expect(new Set(ids).size).toBe(40);
    expect(q.delivered.length).toBe(40);
  });

  test("overlapping workers only send a claimed message once", async () => {
    const q = queue();
    let sends = 0;
    await Promise.all([1, 2].map(() => runEmailBatch([job(1)], q.store, async () => { sends++; }, { now: () => 1000 })));
    expect(sends).toBe(1);
    expect(q.delivered).toEqual(["1"]);
  });

  test("provider failure retries in five minutes, then becomes terminal on attempt five", async () => {
    const q = queue();
    const now = Date.parse("2026-10-24T12:00:00Z");
    const result = await runEmailBatch([job(1), job(2, 4)], q.store, async () => { throw new Error("RESEND_429"); }, { now: () => now, pause: async () => {} });
    expect(result).toEqual({ sent: 0, failed: 2 });
    expect(q.retries[0]).toMatchObject({ status: "queued", available_at: "2026-10-24T12:05:00.000Z", last_error: "RESEND_429" });
    expect(q.retries[1].status).toBe("failed");
  });

  test("leaves unclaimed work durable when the request time budget is exhausted", async () => {
    const q = queue();
    let time = 0;
    const result = await runEmailBatch([job(1), job(2)], q.store, async () => { time += 30_000; }, { now: () => time, pause: async () => {} });
    expect(result.sent).toBe(1);
    expect(q.delivered).toEqual(["1"]);
  });

  test("a transient Auth outage retries instead of permanently dropping the notice", async () => {
    const q = queue();
    q.store.recipient = async () => { throw new Error("RECIPIENT_LOOKUP_FAILED"); };
    await runEmailBatch([job(1)], q.store, async () => { throw new Error("must not send"); }, { now: () => 1000 });
    expect(q.retries[0].status).toBe("queued");
    expect(q.delivered).toHaveLength(0);
  });
});
