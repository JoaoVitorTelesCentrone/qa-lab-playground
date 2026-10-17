import { sleep } from "k6";
import { getHealth, listProducts } from "../lib/checks.js";
import { targetUrl, thresholds } from "../lib/config.js";

export const options = {
  stages: [
    { duration: "5s", target: 1 },
    { duration: "5s", target: 20 },
    { duration: "15s", target: 20 },
    { duration: "5s", target: 1 },
  ],
  thresholds,
  tags: { scenario: "spike" },
};

export default function () {
  const baseUrl = targetUrl();
  getHealth(baseUrl);
  listProducts(baseUrl);
  sleep(1);
}
