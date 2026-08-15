import { spawn } from "node:child_process";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const webDir = resolve(fileURLToPath(new URL(".", import.meta.url)), "..");
const bistDir = resolve(webDir, "..", "BDD-GENERATOR");

const backend = spawn("python", ["-m", "uvicorn", "backend.main:app", "--reload", "--port", "8000"], {
  cwd: bistDir,
  stdio: "inherit",
  shell: false,
});

const web = spawn("bunx", ["next", "dev", "-p", process.env.PORT ?? "3002"], {
  cwd: webDir,
  stdio: "inherit",
  shell: process.platform === "win32",
});

function stop() {
  backend.kill();
  web.kill();
}

process.on("SIGINT", stop);
process.on("SIGTERM", stop);

web.on("exit", (code) => {
  backend.kill();
  process.exit(code ?? 0);
});
