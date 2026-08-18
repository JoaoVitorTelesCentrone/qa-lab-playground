// Capa dos links compartilhados (OG image).
//
// É o que o LinkedIn mostra no feed antes de alguém decidir clicar. Sem isso o
// case do aluno vira um retângulo cinza com uma URL — que é exatamente o que
// ninguém abre. Layout só com flexbox: o renderizador (satori) não suporta
// grid nem a maior parte do CSS moderno.

import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

const ink = "#F4F6F5";
const muted = "#AAB2AE";
const green = "#4CAF72";

export type OgCard = {
  /** Linha de cima, em maiúsculas: o tipo de artefato. */
  kicker: string;
  title: string;
  subtitle?: string;
  /** Até 3 pares label/valor na régua inferior. */
  stats?: Array<{ label: string; value: string }>;
  /** Assinatura no rodapé — normalmente o nome de quem produziu. */
  author?: string;
};

export function ogImage({ kicker, title, subtitle, stats = [], author }: OgCard) {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, backgroundColor: "#16181C", color: ink, fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ width: 34, height: 3, backgroundColor: green, marginRight: 14 }} />
            <div style={{ fontSize: 22, letterSpacing: 4, color: green, textTransform: "uppercase", fontWeight: 700 }}>{kicker}</div>
          </div>
          <div style={{ marginTop: 30, fontSize: title.length > 70 ? 54 : 66, lineHeight: 1.08, letterSpacing: -2, fontWeight: 700, display: "flex" }}>{clamp(title, 110)}</div>
          {subtitle && <div style={{ marginTop: 24, fontSize: 28, lineHeight: 1.4, color: muted, display: "flex" }}>{clamp(subtitle, 150)}</div>}
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          {stats.length > 0 && <div style={{ display: "flex", borderTop: `1px solid #343941`, paddingTop: 26 }}>
            {stats.slice(0, 3).map((stat) => (
              <div key={stat.label} style={{ display: "flex", flexDirection: "column", marginRight: 64 }}>
                <div style={{ fontSize: 34, fontWeight: 700 }}>{stat.value}</div>
                <div style={{ fontSize: 20, color: muted, marginTop: 6 }}>{stat.label}</div>
              </div>
            ))}
          </div>}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 30, fontSize: 22, color: muted }}>
            <div style={{ display: "flex" }}>{author ?? ""}</div>
            <div style={{ display: "flex", color: ink, fontWeight: 700 }}>QA Lab Playground</div>
          </div>
        </div>
      </div>
    ),
    ogSize,
  );
}

function clamp(value: string, max: number) {
  const text = value.replace(/\s+/g, " ").trim();
  return text.length <= max ? text : `${text.slice(0, max - 1).trimEnd()}…`;
}
