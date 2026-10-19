import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  testMatch: "**/*.e2e.ts",
  timeout: 30_000,
  expect: { timeout: 8_000 },
  use: {
    // O script de desenvolvimento sobe o Next em 3000 por padrão. Manter a
    // mesma porta evita uma suíte verde só quando alguém lembra de exportar
    // uma variável local antes de rodá-la.
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: process.env.PLAYWRIGHT_BASE_URL ? undefined : {
    command: "bun run start",
    cwd: __dirname,
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
