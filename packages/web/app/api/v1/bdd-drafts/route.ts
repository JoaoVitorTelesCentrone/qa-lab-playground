import { createClient } from "@/lib/supabase/server";
import { fail, ok, readJson, withUser } from "@/lib/product/api";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = await readJson(request);
  return withUser(async (user) => {
    const title = typeof body.title === "string" ? body.title.trim() : "";
    const content = typeof body.content === "string" ? body.content.trim() : "";
    const id = typeof body.id === "string" ? body.id : null;
    if (!title || title.length > 120) return fail("Informe um título com até 120 caracteres.", 422);
    if (!content || content.length > 20000) return fail("Gere um cenário com até 20.000 caracteres.", 422);
    if (id && !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) return fail("Rascunho inválido.", 422);
    const supabase = await createClient();
    const values = { title, content, kind: "gherkin" as const };
    const query = id
      ? supabase.from("drafts").update(values).eq("id", id).eq("user_id", user.id).eq("kind", "gherkin")
      : supabase.from("drafts").insert({ ...values, user_id: user.id });
    const { data, error } = await query.select("id,title,content,updated_at").maybeSingle();
    if (error) return fail("Não foi possível salvar o cenário.", 500);
    if (!data) return fail("Rascunho não encontrado.", 404);
    return ok(data, id ? 200 : 201);
  });
}
