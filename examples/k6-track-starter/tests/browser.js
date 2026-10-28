import { browser } from "k6/browser";

const BASE_URL = (__ENV.BASE_URL || "http://localhost:3000").replace(/\/$/, "");

export const options = {
  scenarios: {
    browser_smoke: {
      executor: "shared-iterations",
      vus: 1,
      iterations: 1,
      options: { browser: { type: "chromium" } },
    },
  },
  thresholds: {
    browser_web_vital_lcp: ["p(90)<2500"],
  },
};

export default async function () {
  const page = await browser.newPage();
  try {
    await page.goto(`${BASE_URL}/shop/products`);
  } finally {
    await page.close();
  }
}
