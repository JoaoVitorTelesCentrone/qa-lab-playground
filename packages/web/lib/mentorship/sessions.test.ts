import { expect, test } from "bun:test";
import { orderSessions, visibleSession, sessionHref, type MentorshipSession } from "./sessions";

const session: MentorshipSession = { id: "session-a", week_number: 1, title: "Revisão", agenda: "Discussão", starts_at: "2026-10-20T12:00:00Z", ends_at: "2026-10-20T13:00:00Z", meeting_url: "https://meet.example.test/a", recording_url: "https://video.example.test/private", recording_available_until: "2026-10-24T12:00:00Z" };

test("retention removes a recording URL at the exact expiration boundary", () => {
  const expiry = Date.parse(session.recording_available_until!);
  expect(visibleSession(session, expiry - 1).recording_url).toBe(session.recording_url);
  expect(visibleSession(session, expiry).recording_url).toBeNull();
  expect(visibleSession({ ...session, recording_available_until: "invalid" }, expiry).recording_url).toBeNull();
  expect(visibleSession({ ...session, recording_available_until: null }, expiry).recording_url).toBe(session.recording_url);
});

test("keeps ongoing meetings in the agenda and orders past meetings by recency", () => {
  const now = Date.parse("2026-10-24T12:30:00Z");
  const ongoing = { ...session, id: "ongoing", starts_at: "2026-10-24T12:00:00Z", ends_at: "2026-10-24T13:00:00Z" };
  const result = orderSessions([session, ongoing, { ...session, id: "older", starts_at: "2026-10-19T12:00:00Z" }], now);
  expect(result.upcoming.map((item) => item.id)).toEqual(["ongoing"]);
  expect(result.past.map((item) => item.id)).toEqual(["session-a", "older"]);
  expect(result.past.every((item) => item.recording_url === null)).toBe(true);
  expect(sessionHref(session.id)).toBe("/mentoria/encontros#encontro-session-a");
});
