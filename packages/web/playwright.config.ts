import { defineConfig, devices } from "@playwright/test";

const localPort = process.env.PLAYWRIGHT_LOCAL_PORT;
const localUrl = localPort ? `http://127.0.0.1:${localPort}` : "http://localhost:3000";

export default defineConfig({
  testDir: "./tests/e2e",
  testMatch: "**/*.e2e.ts",
  timeout: 30_000,
  expect: { timeout: 8_000 },
  use: {
    // O script de desenvolvimento sobe o Next em 3000 por padrão. Manter a
    // mesma porta evita uma suíte verde só quando alguém lembra de exportar
    // uma variável local antes de rodá-la.
    baseURL: process.env.PLAYWRIGHT_BASE_URL || localUrl,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    actionTimeout: 15_000,
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: process.env.PLAYWRIGHT_BASE_URL ? undefined : {
    command: localPort ? `bun run start --port ${Number(localPort)}` : "bun run start",
    cwd: __dirname,
    url: localUrl,
    reuseExistingServer: !process.env.CI && !localPort,
    timeout: 120_000,
  },
});
