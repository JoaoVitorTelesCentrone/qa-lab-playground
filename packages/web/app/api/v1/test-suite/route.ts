import { fail, readJson, withUser } from "@/lib/product/api";
import { normalizeSuiteName } from "@/lib/test-suite/domain";
import { runTestSuite } from "@/lib/test-suite/http";
import { getPersonalTestSuite, renamePersonalTestSuite } from "@/lib/test-suite/store";

const positiveVersion = (value: unknown) => Number.isInteger(Number(value)) && Number(value) > 0 ? Number(value) : null;

export async function GET() {
  return withUser(() => runTestSuite(getPersonalTestSuite));
}

export async function PATCH(request: Request) {
  const body = await readJson(request);
  return withUser(async () => {
    const name = normalizeSuiteName(body.name);
    const expectedVersion = positiveVersion(body.expectedVersion);
    if (!name) return fail("Informe um nome para a Test Suite.", 422);
    if (!expectedVersion) return fail("A versão da Test Suite é inválida.", 422);
    return runTestSuite(() => renamePersonalTestSuite(name, expectedVersion));
  });
}
