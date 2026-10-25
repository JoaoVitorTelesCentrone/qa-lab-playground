export type MentorshipSession = {
  id: string;
  week_number: number;
  title: string;
  agenda: string;
  starts_at: string;
  ends_at: string;
  meeting_url: string;
  recording_url: string | null;
  recording_available_until: string | null;
};

export const sessionHref = (id: string) => `/mentoria/encontros#encontro-${encodeURIComponent(id)}`;

/** Apply retention on the server before a recording URL reaches the browser. */
export function visibleSession(session: MentorshipSession, now = Date.now()): MentorshipSession {
  if (!session.recording_url || !session.recording_available_until) return session;
  const expiry = Date.parse(session.recording_available_until);
  return Number.isFinite(expiry) && expiry > now ? session : { ...session, recording_url: null };
}

export function orderSessions(sessions: MentorshipSession[], now: number) {
  const visible = sessions.map((session) => visibleSession(session, now));
  return {
    upcoming: visible.filter((session) => Date.parse(session.ends_at) > now).sort((a, b) => Date.parse(a.starts_at) - Date.parse(b.starts_at)),
    past: visible.filter((session) => Date.parse(session.ends_at) <= now).sort((a, b) => Date.parse(b.starts_at) - Date.parse(a.starts_at)),
  };
}
