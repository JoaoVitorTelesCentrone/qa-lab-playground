const { chromium } = require("../packages/web/node_modules/@playwright/test");

(async () => {
  const browser = await chromium.launch({ headless: true });
  for (const [name, url] of [
    ["broto", "https://www.brotospace.com/"],
    ["mentoria-content", "http://localhost:3002/mentoria/conteudo"],
    ["lab-deliverables", "http://localhost:3002/playground/entregas"],
  ]) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
    try {
      const response = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 25000 });
      if (name === "broto") {
        await page.waitForTimeout(7000);
        console.log("broto headings:", (await page.locator("h1,h2,h3").allTextContents()).map((text) => text.trim()).filter(Boolean).slice(0, 25));
        console.log("broto images:", await page.locator("img").evaluateAll((images) => images.map((image) => ({ alt: image.alt, src: image.currentSrc })).slice(0, 20)));
        for (const y of [900, 1700, 2600]) {
          await page.evaluate((position) => window.scrollTo(0, position), y);
          await page.waitForTimeout(500);
          await page.screenshot({ path: `.tmp/asset-broto-${y}.png`, fullPage: false });
        }
        await page.evaluate(() => window.scrollTo(0, 0));
      }
      await page.screenshot({ path: `.tmp/asset-${name}.png`, fullPage: name === "lab-deliverables" });
      console.log(`${name}: ${response?.status()} ${page.url()} ${await page.title()} ${(await page.locator("body").innerText()).slice(0, 140).replace(/\s+/g, " ")}`);
    } catch (error) {
      console.log(`${name}: ${String(error).split("\n")[0]}`);
    }
    await page.close();
  }
  await browser.close();
})().catch((error) => { console.error(error); process.exitCode = 1; });
