import { fail, readJson, withUser } from "@/lib/product/api";
import { defaultTestFileContent, normalizeFileContent, normalizeNodeName } from "@/lib/test-suite/domain";
import { runTestSuite } from "@/lib/test-suite/http";
import { createTestSuiteNode } from "@/lib/test-suite/store";
import { testSuiteFileTypes, testSuiteLanguages, type TestSuiteFileType, type TestSuiteLanguage } from "@/lib/test-suite/types";

const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function POST(request: Request) {
  const body = await readJson(request);
  return withUser(async () => {
    const nodeType = body.nodeType === "folder" ? "folder" : body.nodeType === "file" ? "file" : null;
    const name = normalizeNodeName(body.name);
    const parentId = body.parentId === null || body.parentId === undefined || body.parentId === "" ? null : String(body.parentId);
    if (!nodeType) return fail("Escolha pasta ou arquivo.", 422);
    if (!name) return fail("Informe o nome do item.", 422);
    if (parentId && !uuid.test(parentId)) return fail("A pasta de destino é inválida.", 422);

    const language = testSuiteLanguages.includes(body.language as TestSuiteLanguage) ? body.language as TestSuiteLanguage : "typescript";
    const fileType = testSuiteFileTypes.includes(body.fileType as TestSuiteFileType) ? body.fileType as TestSuiteFileType : "spec";
    const suppliedContent = normalizeFileContent(body.content);
    const content = nodeType === "file" ? suppliedContent || defaultTestFileContent(language, fileType) : "";

    return runTestSuite(() => createTestSuiteNode({ parentId, nodeType, name, language, fileType, content }), 201);
  });
}
