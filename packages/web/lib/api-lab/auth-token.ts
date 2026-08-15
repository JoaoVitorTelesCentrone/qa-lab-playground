import { createHmac, timingSafeEqual } from "crypto";

type TokenPayload = {
  sub: string;
  exp?: number;
};

function secret() {
  const value = process.env.QALAB_TOKEN_SECRET;
  if (value) return value;
  if (process.env.NODE_ENV === "production") throw new Error("QALAB_TOKEN_SECRET is required in production");
  return "dev-only-qalab-token-secret";
}

function encode(value: string) {
  return Buffer.from(value).toString("base64url");
}

function sign(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

export function createToken(username: string, ttlSeconds?: number) {
  const payload: TokenPayload = { sub: username };
  if (ttlSeconds) payload.exp = Math.floor(Date.now() / 1000) + ttlSeconds;
  const encodedPayload = encode(JSON.stringify(payload));
  return `qalab.${encodedPayload}.${sign(encodedPayload)}`;
}

export function validateToken(auth: string | null) {
  if (!auth?.startsWith("Bearer qalab.")) return null;
  const [, payload, signature] = auth.replace("Bearer ", "").split(".");
  if (!payload || !signature) return null;
  const expected = sign(payload);
  const receivedBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (receivedBuffer.length !== expectedBuffer.length || !timingSafeEqual(receivedBuffer, expectedBuffer)) return null;
  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as TokenPayload;
    if (!parsed.sub) return null;
    if (parsed.exp && parsed.exp <= Math.floor(Date.now() / 1000)) return null;
    return parsed.sub;
  } catch {
    return null;
  }
}
