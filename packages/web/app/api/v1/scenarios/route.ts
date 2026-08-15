import { FieldReader, fail, ok, readJson, validated, withUser } from "@/lib/product/api";
import { getJourney, recordScenarioRun } from "@/lib/product/store";
import { isPracticeAppId } from "@/lib/product/apps";
import { regressionPacks } from "@/lib/regression-packs";

export const dynamic = "force-dynamic";

const statuses = ["passou", "falhou", "bloqueado"] as const;

// GET /api/v1/scenarios — cobertura dos packs de regressão por ambiente.
export function GET() {
  return withUser(async (user) => ok((await getJourney(user.id)).coverage));
}

// POST /api/v1/scenarios — registra a execução de um cenário de regressão.
export function POST(request: Request) {
  return withUser((user) =>
    validated(async () => {
      const body = new FieldReader(await readJson(request));
      const appId = body.text("appId", { max: 40 });
      const scenarioId = body.text("scenarioId", { max: 40 });
      const notes = body.text("notes", { max: 2000, required: false });
      const status = body.oneOf("status", statuses);
      body.done();

      if (!isPracticeAppId(appId)) return fail("Ambiente de prática não encontrado.", 404);
      const pack = regressionPacks.find((item) => item.id === appId);
      if (!pack?.scenarios.some((scenario) => scenario.id === scenarioId)) return fail("Cenário não encontrado neste ambiente.", 404);

      await recordScenarioRun(user.id, { appId, scenarioId, status, notes });
      return ok({ appId, scenarioId, status }, 201);
    }),
  );
}
