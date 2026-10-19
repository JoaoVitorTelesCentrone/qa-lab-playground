import { fail, ok, readJson, withUser } from "@/lib/product/api";
import { CHALLENGE_KIND, validChallengeDeliverables } from "@/lib/challenge-account";
import { isChallengeReady } from "@/lib/challenge-deliverables";
import { validChallengeCaseInput } from "@/lib/challenge-case";
import { normalizeUsername, savePortfolioSettings } from "@/lib/product/store";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const columns = "title,summary,snapshot,published,updated_at,source_deliverable_id";
const missingTable = (error: { code?: string }) => error.code === "42P01" || error.code === "PGRST205";

export function GET() {
  return withUser(async (user) => {
    const supabase = await createClient();
    const [profile, stored] = await Promise.all([
      supabase.from("profiles").select("username,portfolio_public").eq("id", user.id).maybeSingle(),
      supabase.from("expenseflow_portfolio_cases").select(columns).eq("user_id", user.id).maybeSingle(),
    ]);
    if (profile.error) throw profile.error;
    if (stored.error) return fail(missingTable(stored.error) ? "A publicação ainda não está disponível: aplique a migração do case ExpenseFlow." : stored.error.message, missingTable(stored.error) ? 409 : 500);
    return ok({ profile: { username: profile.data?.username ?? "", portfolioPublic: Boolean(profile.data?.portfolio_public) }, case: stored.data });
  });
}

export async function POST(request: Request) {
  return withUser(async (user) => {
    const body = await readJson(request);
    if (typeof body.sourceId !== "string" || !/^[0-9a-f-]{36}$/i.test(body.sourceId)) return fail("Salve a entrega na conta antes de publicar.", 422);
    if (!validChallengeCaseInput(body.title, body.summary)) return fail("Informe um título e um resumo de 40 a 1000 caracteres.", 422);
    const supabase = await createClient();
    const [source, profile] = await Promise.all([
      supabase.from("deliverables").select("id,payload").eq("user_id", user.id).eq("kind", CHALLENGE_KIND).order("created_at", { ascending: false }).limit(1).maybeSingle(),
      supabase.from("profiles").select("username,portfolio_public").eq("id", user.id).maybeSingle(),
    ]);
    if (source.error || profile.error) throw source.error ?? profile.error;
    if (!source.data || source.data.id !== body.sourceId) return fail("Esta versão não é a mais recente. Salve e revise novamente antes de publicar.", 409);
    if (!validChallengeDeliverables(source.data.payload) || !isChallengeReady(source.data.payload)) return fail("Complete os critérios do desafio antes de publicar o case.", 422);
    if (!profile.data) return fail("Perfil não encontrado.", 404);
    const requestedUsername = normalizeUsername(typeof body.username === "string" ? body.username : "");
    if (profile.data.username && requestedUsername !== profile.data.username) return fail("O endereço do portfólio já está definido e não pode ser alterado nesta publicação.", 422);
    const username = profile.data.username ?? requestedUsername;
    if (username.length < 3) return fail("Escolha um endereço de portfólio com pelo menos 3 caracteres.", 422);

    // A cópia só fica visível quando o aluno publica o case E o portfólio.
    // Escrevemos o case primeiro: se a atualização do perfil falhar, um perfil
    // ainda privado não expõe o novo conteúdo.
    const { error } = await supabase.from("expenseflow_portfolio_cases").upsert({
      user_id: user.id,
      source_deliverable_id: source.data.id,
      title: (body.title as string).trim(),
      summary: (body.summary as string).trim(),
      snapshot: source.data.payload,
      published: true,
      updated_at: new Date().toISOString(),
    }, { onConflict: "user_id" });
    if (error) return fail(missingTable(error) ? "A publicação ainda não está disponível: aplique a migração do case ExpenseFlow." : error.message, missingTable(error) ? 409 : 500);

    try {
      if (!profile.data.portfolio_public || !profile.data.username) await savePortfolioSettings(user.id, { username, portfolioPublic: true });
    } catch (profileError) {
      return fail(profileError instanceof Error ? profileError.message : "Não foi possível tornar o portfólio público.", 409);
    }
    return ok({ published: true, url: `/portfolio/${username}/expenseflow` });
  });
}

export async function PATCH(request: Request) {
  return withUser(async (user) => {
    const body = await readJson(request);
    if (body.published !== false) return fail("Informe a opção de despublicar.", 422);
    const supabase = await createClient();
    const { data, error } = await supabase.from("expenseflow_portfolio_cases").update({ published: false, updated_at: new Date().toISOString() }).eq("user_id", user.id).select("user_id").maybeSingle();
    if (error) return fail(error.message, 500);
    if (!data) return fail("Case não encontrado.", 404);
    return ok({ published: false });
  });
}
