import { ok, withUser } from "@/lib/product/api";
import { getJourney } from "@/lib/product/store";

export const dynamic = "force-dynamic";

// GET /api/v1/me — identidade e resumo da jornada do aluno logado.
export function GET() {
  return withUser(async (user) => ok({ user, journey: await getJourney(user.id) }));
}
