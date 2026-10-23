const { chromium } = require("../packages/web/node_modules/@playwright/test");
(async () => {
  const browser = await chromium.launch({ headless: true });
  for (const [name, path] of [["home", "/"], ["lab", "/playground"], ["product", "/playground/expenseflow"]]) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
    await page.goto(`http://localhost:3002${path}`, { waitUntil: "networkidle" });
    await page.screenshot({ path: `.tmp/brand-${name}.png` });
    await page.close();
  }
  await browser.close();
})().catch((error) => { console.error(error); process.exitCode = 1; });
