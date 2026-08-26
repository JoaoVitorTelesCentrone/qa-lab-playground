import { FieldReader, fail, ok, readJson, validated, withUser } from "@/lib/product/api";
import { findRoadmapChallenge } from "@/lib/roadmap/catalog";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

async function proClient(userId: string) {
  const supabase = await createClient();
  const { data: profile } = await supabase.from("profiles").select("plan").eq("id", userId).maybeSingle();
  return profile?.plan === "pro" || profile?.plan === "team" ? supabase : null;
}

export function GET(request: Request) {
  return withUser(async (user) => {
    const challengeId = new URL(request.url).searchParams.get("challengeId");
    if (!challengeId || !findRoadmapChallenge(challengeId)) return fail("Desafio não encontrado.", 404);
    const supabase = await proClient(user.id); if (!supabase) return fail("Este desafio requer QA Lab Pro.", 403);
    const { data, error } = await supabase.from("roadmap_attempts").select("id,response,created_at").eq("user_id", user.id).eq("challenge_id", challengeId).order("created_at", { ascending: false });
    if (error) return fail("Não foi possível carregar as tentativas.", 500);
    return ok(data ?? []);
  });
}

export function POST(request: Request) {
  return withUser((user) => validated(async () => {
    const body = new FieldReader(await readJson(request));
    const challengeId = body.text("challengeId", { max: 80 }); const response = body.text("response", { max: 12000 }); body.done();
    if (response.length < 80) return fail("Escreva pelo menos 80 caracteres para registrar seu raciocínio.", 422);
    if (!findRoadmapChallenge(challengeId)) return fail("Desafio não encontrado.", 404);
    const supabase = await proClient(user.id); if (!supabase) return fail("Este desafio requer QA Lab Pro.", 403);
    const { data, error } = await supabase.from("roadmap_attempts").insert({ user_id: user.id, challenge_id: challengeId, response }).select("id,response,created_at").single();
    if (error || !data) return fail("Não foi possível salvar sua tentativa.", 500);
    return ok(data, 201);
  }));
}
