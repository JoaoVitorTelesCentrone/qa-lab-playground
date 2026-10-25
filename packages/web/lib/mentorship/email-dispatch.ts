import { after } from "next/server";
import { processMentorshipEmailQueue } from "./email";

/** The outbox is durable before scheduling; cron recovers interrupted dispatches. */
export function scheduleMentorshipEmails(userIds: string[]) {
  if (process.env.MENTORSHIP_EMAIL_ENABLED !== "true") return;
  after(async () => {
    try {
      await processMentorshipEmailQueue(100, { userIds });
    } catch (error) {
      console.error("Mentorship email dispatch failed; messages remain in the outbox", { message: error instanceof Error ? error.message : "Unknown error" });
    }
  });
}
