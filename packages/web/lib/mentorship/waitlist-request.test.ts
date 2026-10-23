import { expect, test } from "bun:test";
import { MAX_WAITLIST_BODY_BYTES, normalizeWaitlistAttribution, readWaitlistBody } from "./waitlist-request";

test("normaliza campanhas curtas sem aceitar dados pessoais ou URLs", () => {
  expect(normalizeWaitlistAttribution(" Newsletter_Q4 ")).toBe("newsletter_q4");
  expect(normalizeWaitlistAttribution("ana@example.com")).toBeNull();
  expect(normalizeWaitlistAttribution("https://example.com")).toBeNull();
  expect(normalizeWaitlistAttribution("x".repeat(81))).toBeNull();
});

test("reads a valid JSON body without Content-Length", async () => {
  const request = new Request("http://localhost/api/v1/mentorship/waitlist", {
    method: "POST",
    body: new ReadableStream({ start(controller) { controller.enqueue(new TextEncoder().encode('{"fullName":"Ana"}')); controller.close(); } }),
    duplex: "half",
  } as RequestInit);
  expect(await readWaitlistBody(request)).toEqual({ body: { fullName: "Ana" } });
});

test("rejects a streamed body beyond the byte limit", async () => {
  const request = new Request("http://localhost/api/v1/mentorship/waitlist", {
    method: "POST",
    body: "x".repeat(MAX_WAITLIST_BODY_BYTES + 1),
  });
  expect(await readWaitlistBody(request)).toEqual({ status: 413 });
});

test("rejects invalid JSON", async () => {
  const request = new Request("http://localhost/api/v1/mentorship/waitlist", { method: "POST", body: "{" });
  expect(await readWaitlistBody(request)).toEqual({ status: 400 });
});
