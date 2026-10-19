import { toAttachments, type Attachment } from "./journey";

const FILE_NAME = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}(?:\.[a-z0-9]{1,8})?$/i;

export function isOwnEvidencePath(path: string, userId: string, labSlug: string) {
  const prefix = `${userId}/${labSlug}/`;
  return path.startsWith(prefix) && FILE_NAME.test(path.slice(prefix.length));
}

/** The browser can send display data, but only an upload in this user's Lab may be stored. */
export function validateEvidenceAttachments(raw: unknown, userId: string, labSlug: string): Attachment[] | null {
  if (raw == null) return [];
  if (!Array.isArray(raw)) return null;
  const attachments = toAttachments(raw);
  if (attachments.length !== raw.length || attachments.some((file) => !isOwnEvidencePath(file.path, userId, labSlug))) return null;
  return attachments.map((file) => ({ ...file, url: "" }));
}
