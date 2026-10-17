const LOOPBACK_HOSTS = new Set(["127.0.0.1", "localhost", "[::1]"]);

function target() {
  return String(__ENV.PERF_TARGET || "http://127.0.0.1:3001").replace(/\/$/, "");
}

export function targetUrl(path = "") {
  const value = target();
  let url;
  try {
    url = new URL(value);
  } catch {
    throw new Error("PERF_TARGET precisa ser uma URL http(s) valida.");
  }
  if (url.protocol !== "http:") throw new Error("A trilha local aceita somente HTTP; nao aponte para HTTPS/producao.");
  if (!LOOPBACK_HOSTS.has(url.hostname)) throw new Error("Alvo bloqueado: use localhost/127.0.0.1. A carga da mentoria nunca roda em producao.");
  if (__ENV.PERF_TARGET_ACK !== "LOCAL_ONLY") throw new Error("Defina PERF_TARGET_ACK=LOCAL_ONLY para confirmar que o alvo e local.");
  return `${value}${path.startsWith("/") ? path : `/${path}`}`;
}

export const thresholds = {
  http_req_failed: ["rate<0.01"],
  http_req_duration: ["p(95)<500", "p(99)<1000"],
};
