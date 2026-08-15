// Gera, para cada carrossel, uma pasta com 1 PNG por slide (1080x1080 @2x => 2160px)
// + um texto.md com a copy e a legenda sugerida.
//
// Uso:  bun carrosseis/_build/generate.mjs
//
// Requer Google Chrome instalado (modo headless usado p/ rasterizar o HTML).

import { carousels } from "./carousels.mjs";
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync, rmSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, ".."); // pasta carrosseis/
const TMP = join(__dirname, ".tmp");

// ---- localizar o Chrome ----
const CHROME_CANDIDATES = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
];
const CHROME = CHROME_CANDIDATES.find((p) => existsSync(p));
if (!CHROME) {
  console.error("Chrome/Edge não encontrado. Instale o Chrome ou ajuste CHROME_CANDIDATES.");
  process.exit(1);
}

// ---- design tokens (identidade-visual.json) ----
const C = {
  bg: "#0D1117",
  bg2: "#161B22",
  card: "#1A1D23",
  border: "#30363D",
  text: "#F0F6FC",
  muted: "#8B949E",
  mint: "#2DD4BF",
  neon: "#A3E635",
  coral: "#FB7185",
  amarelo: "#F0C040",
};
const accentHex = (a) => C[a] || C.mint;

const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap');
`;

function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function pageShell(inner, accent) {
  const a = accentHex(accent);
  return `<!doctype html><html><head><meta charset="utf-8"><style>
${FONTS}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1080px;height:1080px;background:${C.bg};overflow:hidden}
.slide{position:relative;width:1080px;height:1080px;background:
   radial-gradient(120% 90% at 12% 0%, ${a}14 0%, transparent 42%),
   linear-gradient(160deg, ${C.bg} 0%, ${C.bg2} 100%);
   font-family:'Inter',sans-serif;color:${C.text};overflow:hidden}
.wm{position:absolute;right:-60px;bottom:-200px;font-family:'Bebas Neue',sans-serif;
   font-size:760px;line-height:.8;font-style:italic;color:${a};opacity:.04;letter-spacing:-10px;user-select:none}
.frame{position:absolute;inset:0;padding:96px 90px 86px;display:flex;flex-direction:column;z-index:2}
.eyebrow{display:inline-flex;align-items:center;gap:14px;align-self:flex-start;
   font-size:20px;font-weight:700;letter-spacing:.28em;text-transform:uppercase;color:${a};
   padding:14px 22px;border:1px solid ${a}59;border-radius:999px;background:${a}14}
.dot{width:11px;height:11px;border-radius:999px;background:${a};box-shadow:0 0 14px ${a}}
.footer{width:100%;margin-top:auto;display:flex;align-items:center;justify-content:space-between;padding-top:30px;border-top:1px solid ${C.border}}
.brand{font-family:'Bebas Neue',sans-serif;font-style:italic;font-size:40px;letter-spacing:.06em}
.brand .qa{color:${C.mint}}
.brand .lab{color:${C.text}}
.num{font-family:'JetBrains Mono',monospace;font-weight:700;font-size:30px;color:${C.muted}}
.num b{color:${a}}
.flask{width:34px;height:34px;flex:0 0 auto}
.brandwrap{display:flex;align-items:center;gap:16px}
</style></head><body>${inner}</body></html>`;
}

const flask = (color) =>
  `<svg class="flask" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 2v7.31"/><path d="M14 9.3V2"/><path d="M8.5 2h7"/><path d="M14 9.3a6.5 6.5 0 1 1-4 0"/><path d="M5.52 16h12.96"/></svg>`;

function footer(accent, n, total) {
  return `<div class="footer">
    <div class="brandwrap">${flask(C.mint)}<div class="brand"><span class="qa">QA</span> <span class="lab">LAB</span></div></div>
    <div class="num">#<b>${String(n).padStart(2, "0")}</b> / ${String(total).padStart(2, "0")}</div>
  </div>`;
}

function renderCover(s, idx, total) {
  const a = accentHex(s.accent);
  return pageShell(
    `<div class="slide"><div class="wm">QA</div><div class="frame">
      <div class="eyebrow"><span class="dot"></span>${esc(s.eyebrow)}</div>
      <div style="margin-top:auto;margin-bottom:14px">
        <div style="font-family:'Bebas Neue',sans-serif;font-style:italic;font-size:128px;line-height:.95;letter-spacing:.01em;text-transform:uppercase">${esc(s.title)}</div>
        <div style="margin-top:34px;font-size:40px;font-weight:600;color:${C.muted}">${esc(s.subtitle)}</div>
        <div style="margin-top:40px;width:160px;height:8px;border-radius:8px;background:${a};box-shadow:0 0 26px ${a}99"></div>
      </div>
      ${footer(s.accent, idx, total)}
    </div></div>`,
    s.accent
  );
}

function renderContent(s, idx, total) {
  const a = accentHex(s.accent);
  return pageShell(
    `<div class="slide"><div class="wm">QA</div><div class="frame">
      <div style="display:flex;align-items:center;gap:22px">
        <div style="font-family:'JetBrains Mono',monospace;font-weight:700;font-size:34px;color:${a};border:1px solid ${a}59;background:${a}14;padding:10px 20px;border-radius:14px">${esc(s.label)}</div>
      </div>
      <div style="margin-top:auto">
        <div style="font-family:'Bebas Neue',sans-serif;font-style:italic;font-size:104px;line-height:.98;text-transform:uppercase;color:${a}">${esc(s.heading)}</div>
        <div style="margin-top:36px;font-size:46px;line-height:1.32;font-weight:500;color:${C.text};max-width:880px">${esc(s.body)}</div>
      </div>
      ${footer(s.accent, idx, total)}
    </div></div>`,
    s.accent
  );
}

function renderCta(s, idx, total) {
  const a = accentHex(s.accent);
  return pageShell(
    `<div class="slide"><div class="wm">QA</div><div class="frame" style="align-items:center;text-align:center">
      <div class="eyebrow" style="align-self:center"><span class="dot"></span>QA LAB PLAYGROUND</div>
      <div style="margin-top:auto;display:flex;flex-direction:column;align-items:center;gap:38px">
        <div style="font-family:'Bebas Neue',sans-serif;font-style:italic;font-size:116px;line-height:.98;text-transform:uppercase;max-width:920px">${esc(s.title)}</div>
        <div style="font-size:44px;font-weight:500;color:${C.muted};max-width:820px">${esc(s.body)}</div>
        <div style="margin-top:14px;display:inline-flex;align-items:center;gap:18px;background:${a};color:${C.bg};font-weight:800;font-size:42px;padding:26px 52px;border-radius:18px;box-shadow:0 18px 50px ${a}40">
          ${flask(C.bg)}<span>${esc(s.cta)}</span>
        </div>
        <div style="font-family:'JetBrains Mono',monospace;font-size:30px;color:${C.muted}">linkedin.com/company/qa-lab-oficial</div>
      </div>
      ${footer(s.accent, idx, total)}
    </div></div>`,
    s.accent
  );
}

function renderSlide(s, idx, total) {
  if (s.kind === "cover") return renderCover(s, idx, total);
  if (s.kind === "cta") return renderCta(s, idx, total);
  return renderContent(s, idx, total);
}

function shoot(htmlPath, outPath) {
  execFileSync(
    CHROME,
    [
      "--headless=new",
      "--disable-gpu",
      "--hide-scrollbars",
      "--no-sandbox",
      "--force-device-scale-factor=2",
      "--default-background-color=00000000",
      "--window-size=1080,1080",
      "--virtual-time-budget=2500",
      `--screenshot=${outPath}`,
      `file://${htmlPath.replace(/\\/g, "/")}`,
    ],
    { stdio: "ignore" }
  );
}

function slideText(s) {
  if (s.kind === "cover") return `**Capa** — ${s.eyebrow}\n# ${s.title}\n${s.subtitle}`;
  if (s.kind === "cta") return `**CTA** — ${s.title}\n${s.body}\n→ ${s.cta} · linkedin.com/company/qa-lab-oficial`;
  return `**${s.label}** — ${s.heading}\n${s.body}`;
}

// ---- run ----
rmSync(TMP, { recursive: true, force: true });
mkdirSync(TMP, { recursive: true });

let totalImgs = 0;
for (const car of carousels) {
  const folder = join(ROOT, `${String(car.n).padStart(2, "0")}-${car.slug}`);
  mkdirSync(folder, { recursive: true });
  const total = car.slides.length;

  car.slides.forEach((s, i) => {
    const idx = i + 1;
    const html = renderSlide(s, idx, total);
    const htmlPath = join(TMP, `c${car.n}-s${idx}.html`);
    writeFileSync(htmlPath, html, "utf8");
    const out = join(folder, `slide-${String(idx).padStart(2, "0")}.png`);
    shoot(htmlPath, out);
    totalImgs++;
    process.stdout.write(`  [${car.n}/${carousels.length}] ${car.slug} slide ${idx}/${total}\r`);
  });

  // texto.md
  const md =
    `# Carrossel ${car.n} — ${car.pilar}\n\n` +
    car.slides.map((s, i) => `### Slide ${i + 1}\n${slideText(s)}`).join("\n\n") +
    `\n\n---\n\n## Legenda sugerida (LinkedIn)\n\n${car.caption}\n\n${car.hashtags.join(" ")}\n`;
  writeFileSync(join(folder, "texto.md"), md, "utf8");

  console.log(`\n✓ ${folder}  (${total} slides)`);
}

rmSync(TMP, { recursive: true, force: true });
console.log(`\nPronto: ${totalImgs} PNGs em ${carousels.length} pastas dentro de /carrosseis`);
