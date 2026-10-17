import { sleep } from "k6";
import { getHealth, listProducts } from "../lib/checks.js";
import { targetUrl, thresholds } from "../lib/config.js";

export const options = {
  stages: [
    { duration: "10s", target: 5 },
    { duration: "30s", target: 5 },
    { duration: "10s", target: 0 },
  ],
  thresholds,
  tags: { scenario: "load" },
};

export default function () {
  const baseUrl = targetUrl();
  getHealth(baseUrl);
  listProducts(baseUrl);
  sleep(1);
}
