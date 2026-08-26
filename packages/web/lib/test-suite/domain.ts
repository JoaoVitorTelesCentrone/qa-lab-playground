import type { TestSuiteFileType, TestSuiteLanguage, TestSuiteNode, TestSuiteTreeNode } from "./types";

export function normalizeSuiteName(value: unknown) {
  return typeof value === "string" ? value.trim().replace(/\s+/g, " ").slice(0, 100) : "";
}

export function normalizeNodeName(value: unknown) {
  if (typeof value !== "string") return "";
  return value.trim().replace(/\s+/g, " ").replace(/[\\/]/g, "-").slice(0, 120);
}

export function normalizeFileContent(value: unknown) {
  return typeof value === "string" ? value.slice(0, 500_000) : "";
}

export function buildTestSuiteTree(nodes: TestSuiteNode[]): TestSuiteTreeNode[] {
  const byId = new Map<string, TestSuiteTreeNode>();
  for (const node of nodes) byId.set(node.id, { ...node, children: [] });

  const roots: TestSuiteTreeNode[] = [];
  for (const node of byId.values()) {
    const parent = node.parentId ? byId.get(node.parentId) : undefined;
    if (parent && parent.nodeType === "folder") parent.children.push(node);
    else roots.push(node);
  }

  const sort = (entries: TestSuiteTreeNode[]) => {
    entries.sort((a, b) => {
      if (a.nodeType !== b.nodeType) return a.nodeType === "folder" ? -1 : 1;
      return a.position - b.position || a.name.localeCompare(b.name, "pt-BR");
    });
    entries.forEach((entry) => sort(entry.children));
  };
  sort(roots);
  return roots;
}

export function descendantIds(nodes: TestSuiteNode[], nodeId: string) {
  const result = new Set<string>();
  const visit = (parentId: string) => {
    for (const node of nodes) {
      if (node.parentId !== parentId || result.has(node.id)) continue;
      result.add(node.id);
      visit(node.id);
    }
  };
  visit(nodeId);
  return result;
}

export function defaultTestFileContent(language: TestSuiteLanguage, fileType: TestSuiteFileType) {
  if (language === "gherkin") return "Feature: Descreva o comportamento\n\n  Scenario: Fluxo principal\n    Given uma pré-condição\n    When uma ação acontece\n    Then o resultado esperado é observado\n";
  if (language === "python") return "def test_fluxo_principal():\n    # Arrange\n\n    # Act\n\n    # Assert\n    assert True\n";
  if (language === "json") return "{\n  \"scenario\": \"fluxo-principal\"\n}\n";
  if (language === "yaml") return "name: fluxo-principal\nsteps:\n  - action: descreva a ação\n    expected: descreva o resultado\n";
  if (language === "markdown") return "# Cenário de teste\n\n## Pré-condições\n\n## Passos\n\n## Resultado esperado\n";
  if (fileType === "fixture") return "export const testData = {\n  user: \"standard_user\",\n};\n";
  if (fileType === "page_object") return "export class PageObject {\n  // Centralize seletores e ações da página aqui.\n}\n";
  return "import { test, expect } from \"@playwright/test\";\n\ntest(\"fluxo principal\", async ({ page }) => {\n  // Arrange\n\n  // Act\n\n  // Assert\n  await expect(page).toHaveTitle(/.+/);\n});\n";
}
