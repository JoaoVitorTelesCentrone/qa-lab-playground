import { describe, expect, test } from "bun:test";
import { buildTestSuiteTree, defaultTestFileContent, descendantIds, normalizeNodeName, normalizeSuiteName } from "./domain";
import { isTestSuiteProductPath } from "./access";
import type { TestSuiteNode } from "./types";

const node = (id: string, parentId: string | null, nodeType: "folder" | "file", position: number): TestSuiteNode => ({
  id, suiteId: "suite", parentId, nodeType, name: id, language: nodeType === "file" ? "typescript" : null,
  fileType: nodeType === "file" ? "spec" : null, content: "", position, version: 1, createdAt: "", updatedAt: "",
});

describe("Test Suite pessoal", () => {
  test("normaliza nomes sem permitir separadores de caminho", () => {
    expect(normalizeSuiteName("  Minha   suíte  ")).toBe("Minha suíte");
    expect(normalizeNodeName(" e2e/login\\auth.spec.ts ")).toBe("e2e-login-auth.spec.ts");
  });

  test("monta a árvore com pastas antes dos arquivos e ordem persistida", () => {
    const tree = buildTestSuiteTree([node("file", null, "file", 1), node("folder", null, "folder", 2), node("nested", "folder", "file", 1)]);
    expect(tree.map((item) => item.id)).toEqual(["folder", "file"]);
    expect(tree[0].children.map((item) => item.id)).toEqual(["nested"]);
  });

  test("calcula descendentes para mover e arquivar pastas com segurança", () => {
    const nodes = [node("a", null, "folder", 1), node("b", "a", "folder", 1), node("c", "b", "file", 1), node("d", null, "file", 2)];
    expect([...descendantIds(nodes, "a")]).toEqual(["b", "c"]);
  });

  test("gera templates úteis para arquivos de automação", () => {
    expect(defaultTestFileContent("typescript", "spec")).toContain("@playwright/test");
    expect(defaultTestFileContent("gherkin", "spec")).toContain("Scenario:");
    expect(defaultTestFileContent("python", "spec")).toContain("def test_");
  });

  test("protege páginas e APIs da Test Suite", () => {
    expect(isTestSuiteProductPath("/test-suite")).toBe(true);
    expect(isTestSuiteProductPath("/api/v1/test-suite/nodes/1")).toBe(true);
    expect(isTestSuiteProductPath("/labs")).toBe(false);
  });
});
