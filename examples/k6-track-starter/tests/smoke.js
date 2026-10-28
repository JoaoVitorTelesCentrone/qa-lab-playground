import http from "k6/http";
import { check } from "k6";

const BASE_URL = (__ENV.BASE_URL || "http://localhost:3000").replace(/\/$/, "");

export const options = {
  vus: 1,
  iterations: 1,
  thresholds: {
    http_req_failed: ["rate<0.01"],
    http_req_duration: ["p(95)<2000"],
    checks: ["rate>0.99"],
  },
};

export default function () {
  const response = http.get(`${BASE_URL}/shop/products`, {
    tags: { route: "shop-products" },
  });

  check(response, {
    "a loja respondeu com sucesso": (res) => res.status === 200,
    "a resposta tem conteúdo": (res) => Boolean(res.body && res.body.length > 0),
  });
}
