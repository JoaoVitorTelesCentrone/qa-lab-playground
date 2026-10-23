import { createRequire } from "node:module";
import { mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const require = createRequire(import.meta.url);
const { chromium } = require("../../../packages/web/node_modules/@playwright/test");
const folder = dirname(fileURLToPath(import.meta.url));
const output = join(folder, "exports");
const ids = [
  "carrossel-01-capa", "carrossel-01-meio", "carrossel-01-fecho",
  "carrossel-02-capa", "carrossel-02-meio", "carrossel-02-fecho",
  "carrossel-03-capa", "carrossel-03-meio", "carrossel-03-fecho",
  "post-01-provocacao", "post-02-comparacao", "post-03-convite",
];

await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1080, height: 1080 }, deviceScaleFactor: 1 });
  for (const id of ids) {
    await page.goto(`${pathToFileURL(join(folder, "index.html")).href}?export=${id}`);
    await page.locator(`#${id}`).screenshot({ path: join(output, `${id}-1080x1080.png`) });
    process.stdout.write(`Exportado: ${id}\n`);
  }
  await page.setViewportSize({ width: 1300, height: 1060 });
  await page.goto(pathToFileURL(join(folder, "overview.html")).href);
  await page.locator("body").screenshot({ path: join(output, "overview.png") });
  process.stdout.write("Exportado: overview\n");
} finally {
  await browser.close();
}
