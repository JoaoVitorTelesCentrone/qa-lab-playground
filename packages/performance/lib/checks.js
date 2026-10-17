import http from "k6/http";
import { check } from "k6";

export function getHealth(baseUrl) {
  const response = http.get(`${baseUrl}/api/health`, { redirects: 0, tags: { endpoint: "health" } });
  check(response, { "health responde 2xx": (item) => item.status >= 200 && item.status < 300 });
  return response;
}

export function listProducts(baseUrl) {
  const response = http.get(`${baseUrl}/api/products`, { redirects: 0, tags: { endpoint: "products" } });
  check(response, { "produtos respondem 2xx": (item) => item.status >= 200 && item.status < 300 });
  return response;
}
