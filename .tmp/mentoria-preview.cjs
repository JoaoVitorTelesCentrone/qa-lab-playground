const { chromium } = require("../packages/web/node_modules/@playwright/test");

(async () => {
  const browser = await chromium.launch({ headless: true });
  for (const [name, viewport] of [
    ["desktop", { width: 1440, height: 900 }],
    ["mobile", { width: 390, height: 844 }],
  ]) {
    const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
    await page.goto("http://localhost:3002/mentoria", { waitUntil: "networkidle" });
    await page.screenshot({ path: `.tmp/mentoria-${name}-preview.png`, fullPage: true });
    console.log(`${name}: ${await page.title()}`);
    await page.close();
  }
  await browser.close();
})().catch((error) => { console.error(error); process.exitCode = 1; });
