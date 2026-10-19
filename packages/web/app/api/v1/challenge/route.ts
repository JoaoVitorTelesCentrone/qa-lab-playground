import { fail, ok, readJson, withUser } from "@/lib/product/api";
import { CHALLENGE_KIND, validChallengeDeliverables } from "@/lib/challenge-account";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export function GET() {
  return withUser(async (user) => {
    const supabase = await createClient();
    const { data, error } = await supabase.from("deliverables").select("id,payload,created_at").eq("user_id", user.id).eq("kind", CHALLENGE_KIND).order("created_at", { ascending: false }).limit(1).maybeSingle();
    if (error) throw error;
    if (data && !validChallengeDeliverables(data.payload)) return fail("A cópia da conta está inválida. Seu rascunho local não foi alterado.", 409);
    return ok(data ? { id: data.id, savedAt: data.created_at, deliverables: data.payload } : null);
  });
}

// Versões são append-only: salvar em uma aba não destrói a entrega anterior.
export async function POST(request: Request) {
  return withUser(async (user) => {
    const raw = await readJson(request);
    if (!validChallengeDeliverables(raw.deliverables)) return fail("Entrega inválida. Revise os registros antes de salvar.", 422);
    const supabase = await createClient();
    const { data, error } = await supabase.from("deliverables").insert({ user_id: user.id, kind: CHALLENGE_KIND, payload: raw.deliverables }).select("id,created_at").single();
    if (error) throw error;
    return ok({ id: data.id, savedAt: data.created_at }, 201);
  });
}
