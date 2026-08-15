import { fail, ok, readJson, withUser } from "@/lib/product/api";
import { getSettings, PracticeError, saveSettings, seedApps } from "@/lib/product/practice/store";
import { sanitizeBugIds } from "@/lib/product/practice/bugs";
import { personas } from "@/lib/product/practice/personas";
import { seedAppIds } from "@/lib/product/practice/seed";
import { isPracticeAppId, type PracticeAppId } from "@/lib/product/apps";

export const dynamic = "force-dynamic";

// GET /api/v1/practice/settings — perfil ativo, bugs ligados e modo instrutor.
export function GET() {
  return withUser(async (user) => ok(await getSettings(user.id)));
}

// PATCH /api/v1/practice/settings { personaId?, activeBugs?, instructor? }
export async function PATCH(request: Request) {
  const body = await readJson(request);
  return withUser(async (user) => {
    if (body.personaId !== undefined && !personas.some((persona) => persona.id === body.personaId)) return fail("Perfil de teste não encontrado.", 404);
    try {
      return ok(await saveSettings(user.id, {
        personaId: typeof body.personaId === "string" ? body.personaId : undefined,
        activeBugs: body.activeBugs === undefined ? undefined : sanitizeBugIds(body.activeBugs),
        instructor: typeof body.instructor === "boolean" ? body.instructor : undefined,
      }));
    } catch (error) {
      if (error instanceof PracticeError) return fail(error.message, error.status, error.details);
      throw error;
    }
  });
}

// POST /api/v1/practice/settings { apps?: [...] } — restaura a massa de teste.
// Repetível de propósito: é a garantia de que dá para refazer um cenário.
export async function POST(request: Request) {
  const body = await readJson(request);
  return withUser(async (user) => {
    const requested = Array.isArray(body.apps) ? body.apps.filter((id): id is PracticeAppId => typeof id === "string" && isPracticeAppId(id)) : [];
    const apps = requested.length > 0 ? requested : seedAppIds;
    try {
      await seedApps(user.id, apps);
    } catch (error) {
      if (error instanceof PracticeError) return fail(error.message, error.status);
      throw error;
    }
    return ok({ restored: apps, settings: await getSettings(user.id) });
  });
}
