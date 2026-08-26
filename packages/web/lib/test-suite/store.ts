import { createClient } from "@/lib/supabase/server";
import type { CreateTestSuiteNodeInput, PersonalTestSuite, TestSuiteNode, TestSuiteSnapshot } from "./types";

type Row = Record<string, unknown>;
type DbError = { message?: string; code?: string } | null;

export class TestSuiteError extends Error {
  constructor(message: string, readonly status = 500, readonly code = "TEST_SUITE_ERROR") {
    super(message);
  }
}

const text = (value: unknown) => typeof value === "string" ? value : "";
const nullableText = (value: unknown) => typeof value === "string" ? value : null;
const number = (value: unknown, fallback = 0) => typeof value === "number" ? value : Number(value) || fallback;

function mapSuite(row: Row): PersonalTestSuite {
  return {
    id: text(row.id),
    name: text(row.name),
    version: number(row.version, 1),
    createdAt: text(row.created_at),
    updatedAt: text(row.updated_at),
  };
}

function mapNode(row: Row): TestSuiteNode {
  return {
    id: text(row.id),
    suiteId: text(row.suite_id),
    parentId: nullableText(row.parent_id),
    nodeType: row.node_type === "folder" ? "folder" : "file",
    name: text(row.name),
    language: nullableText(row.language) as TestSuiteNode["language"],
    fileType: nullableText(row.file_type) as TestSuiteNode["fileType"],
    content: text(row.content),
    position: number(row.position),
    version: number(row.version, 1),
    createdAt: text(row.created_at),
    updatedAt: text(row.updated_at),
  };
}

function fromDbError(error: DbError): TestSuiteError {
  const raw = `${error?.code ?? ""} ${error?.message ?? ""}`;
  if (raw.includes("VERSION_CONFLICT")) return new TestSuiteError("Este item mudou em outra sessão. Atualize a suíte e tente novamente.", 409, "VERSION_CONFLICT");
  if (raw.includes("23505")) return new TestSuiteError("Já existe um item com este nome nesta pasta.", 409, "SIBLING_NAME_TAKEN");
  if (raw.includes("TEST_SUITE_CYCLE")) return new TestSuiteError("Uma pasta não pode ser movida para dentro dela mesma.", 422, "TREE_CYCLE");
  if (raw.includes("INVALID_TEST_SUITE_PARENT")) return new TestSuiteError("A pasta de destino não pertence a esta suíte.", 422, "INVALID_PARENT");
  if (raw.includes("NOT_FOUND")) return new TestSuiteError("Pasta ou arquivo não encontrado.", 404, "NOT_FOUND");
  if (raw.includes("INVALID_")) return new TestSuiteError("Os dados não atendem às regras da Test Suite.", 422, "VALIDATION_ERROR");
  if (raw.includes("42P01") || raw.includes("PGRST202") || raw.includes("schema cache")) {
    return new TestSuiteError("A Test Suite ainda não está disponível: aplique a migration 0022.", 503, "TEST_SUITE_UNAVAILABLE");
  }
  return new TestSuiteError(error?.message ?? "Não foi possível concluir a operação na Test Suite.");
}

function rpcRow(data: unknown) {
  return (data && typeof data === "object" ? data : {}) as Row;
}

export async function getPersonalTestSuite(): Promise<TestSuiteSnapshot> {
  const supabase = await createClient();
  const suiteResult = await supabase.rpc("ensure_personal_test_suite");
  if (suiteResult.error) throw fromDbError(suiteResult.error);
  const suite = mapSuite(rpcRow(suiteResult.data));

  const nodesResult = await supabase
    .from("test_suite_nodes")
    .select("id,suite_id,parent_id,node_type,name,language,file_type,content,position,version,created_at,updated_at")
    .eq("suite_id", suite.id)
    .is("archived_at", null)
    .order("position");
  if (nodesResult.error) throw fromDbError(nodesResult.error);
  return { suite, nodes: (nodesResult.data ?? []).map((row) => mapNode(row as Row)) };
}

export async function renamePersonalTestSuite(name: string, expectedVersion: number) {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("rename_personal_test_suite", { p_name: name, p_expected_version: expectedVersion });
  if (error) throw fromDbError(error);
  return mapSuite(rpcRow(data));
}

export async function createTestSuiteNode(input: CreateTestSuiteNodeInput) {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("create_test_suite_node", {
    p_parent_id: input.parentId,
    p_node_type: input.nodeType,
    p_name: input.name,
    p_language: input.nodeType === "file" ? input.language ?? "typescript" : null,
    p_file_type: input.nodeType === "file" ? input.fileType ?? "spec" : null,
    p_content: input.nodeType === "file" ? input.content ?? "" : "",
  });
  if (error) throw fromDbError(error);
  return mapNode(rpcRow(data));
}

export async function updateTestSuiteNode(nodeId: string, input: { name: string; language: TestSuiteNode["language"]; fileType: TestSuiteNode["fileType"]; content: string; expectedVersion: number }) {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("update_test_suite_node", {
    p_node_id: nodeId,
    p_name: input.name,
    p_language: input.language,
    p_file_type: input.fileType,
    p_content: input.content,
    p_expected_version: input.expectedVersion,
  });
  if (error) throw fromDbError(error);
  return mapNode(rpcRow(data));
}

export async function moveTestSuiteNode(nodeId: string, parentId: string | null, expectedVersion: number) {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("move_test_suite_node", { p_node_id: nodeId, p_parent_id: parentId, p_expected_version: expectedVersion });
  if (error) throw fromDbError(error);
  return mapNode(rpcRow(data));
}

export async function archiveTestSuiteNode(nodeId: string, expectedVersion: number) {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("archive_test_suite_node", { p_node_id: nodeId, p_expected_version: expectedVersion });
  if (error) throw fromDbError(error);
  return data as { id: string; archivedCount: number };
}
