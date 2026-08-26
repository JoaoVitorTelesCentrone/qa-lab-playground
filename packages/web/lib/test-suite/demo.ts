import type { TestSuiteSnapshot } from "./types";

const now = "2026-08-25T12:00:00.000Z";

export const demoTestSuite: TestSuiteSnapshot = {
  suite: { id: "demo-suite", name: "QA Lab Test Suite", version: 1, createdAt: now, updatedAt: now },
  nodes: [
    { id: "demo-e2e", suiteId: "demo-suite", parentId: null, nodeType: "folder", name: "e2e", language: null, fileType: null, content: "", position: 1000, version: 1, createdAt: now, updatedAt: now },
    { id: "demo-login", suiteId: "demo-suite", parentId: "demo-e2e", nodeType: "file", name: "login.spec.ts", language: "typescript", fileType: "spec", content: "import { test, expect } from '@playwright/test';\n\ntest('usuário entra com credenciais válidas', async ({ page }) => {\n  await page.goto('/labs/login');\n  await page.getByLabel('Usuário').fill('standard_user');\n  await page.getByLabel('Senha').fill('qa_lab_secret');\n  await page.getByRole('button', { name: 'Entrar' }).click();\n  await expect(page).toHaveURL(/dashboard/);\n});\n", position: 1000, version: 1, createdAt: now, updatedAt: now },
    { id: "demo-fixtures", suiteId: "demo-suite", parentId: null, nodeType: "folder", name: "fixtures", language: null, fileType: null, content: "", position: 2000, version: 1, createdAt: now, updatedAt: now },
    { id: "demo-users", suiteId: "demo-suite", parentId: "demo-fixtures", nodeType: "file", name: "users.json", language: "json", fileType: "fixture", content: "{\n  \"valid\": { \"username\": \"standard_user\", \"password\": \"qa_lab_secret\" }\n}\n", position: 1000, version: 1, createdAt: now, updatedAt: now },
  ],
};
