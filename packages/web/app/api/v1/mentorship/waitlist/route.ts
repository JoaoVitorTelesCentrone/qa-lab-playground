import { createHash } from "node:crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { fail, ok } from "@/lib/product/api";
import { MAX_WAITLIST_BODY_BYTES, readWaitlistBody } from "@/lib/mentorship/waitlist-request";

export const dynamic = "force-dynamic";

function clientKey(request: Request) {
  const forwarded = request.headers.get("x-vercel-forwarded-for")
    ?? request.headers.get("x-forwarded-for")
    ?? request.headers.get("x-real-ip")
    ?? "unknown";
  return createHash("sha256").update(forwarded.split(",")[0].trim().slice(0, 128)).digest("hex");
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) return fail("Origem não permitida.", 403);
  if (!request.headers.get("content-type")?.includes("application/json")) return fail("Envie os dados em JSON.", 415);
  if (Number(request.headers.get("content-length") ?? 0) > MAX_WAITLIST_BODY_BYTES) return fail("Dados muito longos.", 413);

  let admin: ReturnType<typeof createAdminClient>;
  try {
    admin = createAdminClient();
    const { data: rate, error } = await admin.rpc("consume_mentorship_waitlist_rate_limit", { p_client_key: clientKey(request) });
    if (error || !rate || typeof rate.allowed !== "boolean") throw new Error("Rate limit indisponivel.");
    if (!rate.allowed) {
      const response = fail("Muitas tentativas. Tente novamente mais tarde.", 429);
      response.headers.set("Retry-After", String(rate.retry_after_seconds ?? 3600));
      return response;
    }
  } catch {
    return fail("A lista de interesse está indisponível no momento. Tente novamente.", 503);
  }

  const parsed = await readWaitlistBody(request);
  if ("status" in parsed) return fail(parsed.status === 413 ? "Dados muito longos." : "Envie um JSON válido.", parsed.status);
  const body = parsed.body;
  const fullName = typeof body.fullName === "string" ? body.fullName.trim().replace(/\s+/g, " ") : "";
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  if (fullName.length < 2 || fullName.length > 80) return fail("Informe seu nome com 2 a 80 caracteres.", 422);
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return fail("Informe um e-mail válido.", 422);
  if (body.acceptedContact !== true) return fail("Autorize o contato para entrar na lista.", 422);

  try {
    const { error } = await admin.from("mentorship_waitlist_leads").insert({
      full_name: fullName,
      email,
      contact_consent_at: new Date().toISOString(),
      source: "mentoria",
    });
    if (error && error.code !== "23505") {
      console.error("Falha ao registrar lead da mentoria:", error.code);
      return fail("Não foi possível registrar seu interesse agora. Tente novamente.", 503);
    }
    return ok({ registered: true }, error ? 200 : 201);
  } catch {
    return fail("A lista de interesse está indisponível no momento. Tente novamente.", 503);
  }
}
