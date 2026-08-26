import { spawn } from "node:child_process";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const webDir = resolve(fileURLToPath(new URL(".", import.meta.url)), "..");

const web = spawn("bunx", ["next", "dev", "-p", process.env.PORT ?? "3002"], {
  cwd: webDir,
  stdio: "inherit",
  shell: process.platform === "win32",
});

function stop() {
  web.kill();
}

process.on("SIGINT", stop);
process.on("SIGTERM", stop);

web.on("exit", (code) => {
  process.exit(code ?? 0);
});
