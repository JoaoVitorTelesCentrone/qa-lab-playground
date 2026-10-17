import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const scenarios = new Set(["baseline", "load", "spike"]);
const scenario = process.argv[2];
if (!scenarios.has(scenario)) {
  console.error("Escolha um cenário permitido: baseline, load ou spike.");
  process.exit(2);
}

if (process.env.PERF_TARGET_ACK !== "LOCAL_ONLY") {
  console.error("Defina PERF_TARGET_ACK=LOCAL_ONLY para confirmar o uso de um alvo local.");
  process.exit(2);
}

const rawTarget = process.env.PERF_TARGET || "http://127.0.0.1:3001";
let target;
try { target = new URL(rawTarget); } catch {
  console.error("PERF_TARGET precisa ser uma URL local http(s) válida.");
  process.exit(2);
}

const loopbackHosts = new Set(["localhost", "127.0.0.1", "[::1]"]);
if (target.protocol !== "http:" || !loopbackHosts.has(target.hostname) || target.username || target.password || target.search || target.hash) {
  console.error("Alvo bloqueado: use somente uma URL HTTP em localhost, 127.0.0.1 ou ::1, sem credenciais.");
  process.exit(2);
}

const scriptPath = fileURLToPath(new URL(`../scenarios/${scenario}.js`, import.meta.url));
const result = spawnSync("k6", ["run", scriptPath], { stdio: "inherit", env: process.env, shell: false });
if (result.error) {
  console.error(`Não foi possível iniciar o k6: ${result.error.message}`);
  process.exit(1);
}
process.exit(result.status ?? 1);
