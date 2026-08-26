import { fail, readJson, withUser } from "@/lib/product/api";
import { normalizeFileContent, normalizeNodeName } from "@/lib/test-suite/domain";
import { runTestSuite } from "@/lib/test-suite/http";
import { archiveTestSuiteNode, moveTestSuiteNode, updateTestSuiteNode } from "@/lib/test-suite/store";
import { testSuiteFileTypes, testSuiteLanguages, type TestSuiteFileType, type TestSuiteLanguage } from "@/lib/test-suite/types";

type Context = { params: Promise<{ nodeId: string }> };
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const positiveVersion = (value: unknown) => Number.isInteger(Number(value)) && Number(value) > 0 ? Number(value) : null;

export async function PATCH(request: Request, context: Context) {
  const { nodeId } = await context.params;
  const body = await readJson(request);
  return withUser(async () => {
    if (!uuid.test(nodeId)) return fail("O item informado é inválido.", 422);
    const expectedVersion = positiveVersion(body.expectedVersion);
    if (!expectedVersion) return fail("A versão do item é inválida.", 422);

    if (body.action === "move") {
      const parentId = body.parentId === null || body.parentId === undefined || body.parentId === "" ? null : String(body.parentId);
      if (parentId && !uuid.test(parentId)) return fail("A pasta de destino é inválida.", 422);
      return runTestSuite(() => moveTestSuiteNode(nodeId, parentId, expectedVersion));
    }

    const name = normalizeNodeName(body.name);
    if (!name) return fail("Informe o nome do item.", 422);
    const language = testSuiteLanguages.includes(body.language as TestSuiteLanguage) ? body.language as TestSuiteLanguage : null;
    const fileType = testSuiteFileTypes.includes(body.fileType as TestSuiteFileType) ? body.fileType as TestSuiteFileType : null;
    return runTestSuite(() => updateTestSuiteNode(nodeId, {
      name,
      language,
      fileType,
      content: normalizeFileContent(body.content),
      expectedVersion,
    }));
  });
}

export async function DELETE(request: Request, context: Context) {
  const { nodeId } = await context.params;
  const body = await readJson(request);
  return withUser(async () => {
    if (!uuid.test(nodeId)) return fail("O item informado é inválido.", 422);
    const expectedVersion = positiveVersion(body.expectedVersion);
    if (!expectedVersion) return fail("A versão do item é inválida.", 422);
    return runTestSuite(() => archiveTestSuiteNode(nodeId, expectedVersion));
  });
}
