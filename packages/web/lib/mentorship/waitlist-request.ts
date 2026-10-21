export const MAX_WAITLIST_BODY_BYTES = 4096;

export async function readWaitlistBody(request: Request): Promise<{ body: Record<string, unknown> } | { status: 400 | 413 }> {
  const reader = request.body?.getReader();
  if (!reader) return { status: 400 };

  const bytes = new Uint8Array(MAX_WAITLIST_BODY_BYTES);
  let length = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (length + value.byteLength > MAX_WAITLIST_BODY_BYTES) {
        void reader.cancel().catch(() => {});
        return { status: 413 };
      }
      bytes.set(value, length);
      length += value.byteLength;
    }
  } catch {
    return { status: 400 };
  } finally {
    reader.releaseLock();
  }

  try {
    const body: unknown = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes.subarray(0, length)));
    return body && typeof body === "object" && !Array.isArray(body) ? { body: body as Record<string, unknown> } : { status: 400 };
  } catch {
    return { status: 400 };
  }
}
