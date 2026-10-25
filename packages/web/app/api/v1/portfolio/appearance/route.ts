import { fail, ok, readJson, withUser } from "@/lib/product/api";
import { isPortfolioAppearance } from "@/lib/product/portfolio-appearance";
import { createClient } from "@/lib/supabase/server";

export async function PUT(request: Request) {
  return withUser(async (user) => {
    const body = await readJson(request);
    if (!isPortfolioAppearance(body)) return fail("Escolha um layout e uma paleta disponíveis.", 422);
    const supabase = await createClient();
    const { data, error } = await supabase.from("profiles")
      .update({ portfolio_appearance: body }).eq("id", user.id)
      .select("portfolio_appearance").maybeSingle();
    if (error) {
      if (error.code === "42703" || error.code === "PGRST204") return fail("A personalização ainda não está disponível para salvar. Tente novamente mais tarde.", 503);
      return fail("Não foi possível salvar a aparência. Tente novamente.", 500);
    }
    if (!data) return fail("Perfil não encontrado. Atualize a página e tente novamente.", 404);
    return ok(data.portfolio_appearance);
  });
}
