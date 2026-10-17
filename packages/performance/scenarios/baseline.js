import { sleep } from "k6";
import { getHealth, listProducts } from "../lib/checks.js";
import { targetUrl, thresholds } from "../lib/config.js";

export const options = {
  vus: 1,
  iterations: 10,
  thresholds,
  tags: { scenario: "baseline" },
};

export default function () {
  const baseUrl = targetUrl();
  getHealth(baseUrl);
  listProducts(baseUrl);
  sleep(1);
}
