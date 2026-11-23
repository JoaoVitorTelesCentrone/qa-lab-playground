// Exporta cada peça em PNG 1080 × 1080 (Instagram) e cada carrossel em PDF (LinkedIn).
// Rode da raiz do repositório: node assets/social/divulgacao-dez-jan/render.mjs
// Para exportar só alguns posts: node assets/social/divulgacao-dez-jan/render.mjs p02 p05
import { createRequire } from "node:module";
import { mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const require = createRequire(import.meta.url);
const { chromium } = require("../../../packages/web/node_modules/@playwright/test");
const folder = dirname(fileURLToPath(import.meta.url));
const output = join(folder, "exports");
const index = pathToFileURL(join(folder, "index.html")).href;
const only = new Set(process.argv.slice(2));

await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1080, height: 1080 }, deviceScaleFactor: 1 });
  await page.goto(index);
  const cards = (await page.evaluate(() => window.__cards)).filter((card) => !only.size || only.has(card.post));

  for (const card of cards) {
    await page.goto(`${index}?export=${card.id}`);
    await page.locator(`#${card.id}`).screenshot({ path: join(output, `${card.id}.png`) });
    process.stdout.write(`PNG: ${card.id}\n`);
  }

  const carousels = [...new Set(cards.filter((card) => card.id !== card.post).map((card) => card.post))];
  for (const post of carousels) {
    await page.goto(`${index}?carousel=${post}`);
    await page.pdf({ path: join(output, `${post}-carrossel.pdf`), width: "1080px", height: "1080px", printBackground: true, margin: { top: 0, right: 0, bottom: 0, left: 0 } });
    process.stdout.write(`PDF: ${post}\n`);
  }

  if (!only.size) {
    await page.setViewportSize({ width: 1300, height: 1000 });
    await page.goto(index);
    await page.screenshot({ path: join(output, "overview.png"), fullPage: true });
    process.stdout.write("PNG: overview\n");
  }
} finally {
  await browser.close();
}
