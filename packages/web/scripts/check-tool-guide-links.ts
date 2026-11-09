// Confere se os links dos guias de ferramenta (lib/tool-guides.ts) continuam de pé.
// - Vídeos e playlists: o oEmbed do YouTube precisa devolver título e canal.
// - Documentação e cursos: a página precisa responder 2xx depois dos redirecionamentos.
// Sites que bloqueiam acesso automatizado (403/429) viram aviso, não falha.
//
// Uso: bun run guides:check-links
import { toolGuides, youtubeUrl } from "../lib/tool-guides";

type Result = { guide: string; target: string; status: "ok" | "warn" | "fail"; detail: string };

const BLOCKED_BY_BOT_PROTECTION = new Set([403, 429]);
const CONCURRENCY = 6;

async function checkVideo(url: string): Promise<Pick<Result, "status" | "detail">> {
  const response = await fetch(`https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(url)}`, { signal: AbortSignal.timeout(20_000) });
  if (!response.ok) return { status: "fail", detail: `oEmbed ${response.status} (vídeo removido ou privado)` };
  const body = await response.json() as { title?: string; author_name?: string };
  return { status: "ok", detail: `${body.title ?? "?"} · ${body.author_name ?? "?"}` };
}

async function checkPage(url: string): Promise<Pick<Result, "status" | "detail">> {
  const response = await fetch(url, { redirect: "follow", headers: { "user-agent": "Mozilla/5.0 (link check)" }, signal: AbortSignal.timeout(20_000) });
  if (response.ok) return { status: "ok", detail: String(response.status) };
  if (BLOCKED_BY_BOT_PROTECTION.has(response.status)) return { status: "warn", detail: `${response.status}: o site bloqueia robôs; confira no navegador` };
  return { status: "fail", detail: String(response.status) };
}

const jobs = toolGuides.flatMap((guide) => [
  ...[...guide.docs, ...guide.courses].map((link) => ({ guide: guide.slug, target: link.url, run: () => checkPage(link.url) })),
  ...guide.videos.map((video) => ({ guide: guide.slug, target: youtubeUrl(video), run: () => checkVideo(youtubeUrl(video)) })),
]);

const results: Result[] = [];
for (let start = 0; start < jobs.length; start += CONCURRENCY) {
  const batch = jobs.slice(start, start + CONCURRENCY);
  results.push(...await Promise.all(batch.map(async (job) => {
    // Timeout e erro de rede são comuns em sites grandes: tenta de novo antes de reprovar.
    for (let attempt = 1; ; attempt++) {
      try {
        return { guide: job.guide, target: job.target, ...await job.run() };
      } catch (error) {
        if (attempt < 3) continue;
        return { guide: job.guide, target: job.target, status: "fail" as const, detail: error instanceof Error ? error.message : String(error) };
      }
    }
  })));
}

const failures = results.filter((item) => item.status === "fail");
const warnings = results.filter((item) => item.status === "warn");
for (const item of [...failures, ...warnings]) console.log(`${item.status === "fail" ? "FALHOU" : "AVISO "} [${item.guide}] ${item.target}\n        ${item.detail}`);
console.log(`\n${results.length} links conferidos: ${results.length - failures.length - warnings.length} ok, ${warnings.length} avisos, ${failures.length} falhas.`);
if (failures.length > 0) process.exit(1);
