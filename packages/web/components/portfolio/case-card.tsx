// Card do case em imagem, para postar no feed do LinkedIn.
//
// Post com imagem alcança muito mais que post com link, então o case precisa
// existir nos dois formatos: a página (profunda, auditável) e este card (raso,
// feito para parar o scroll e mandar a pessoa para a página).
//
// Segue o mesmo caminho do estúdio de carrossel: nó de tamanho fixo renderizado
// fora da tela e capturado com `html-to-image`. Toda cor vai em `style` inline,
// e não em classe do Tailwind — o capturador não resolve as variáveis CSS do
// tema, e o card sairia sem cor nenhuma.

import { forwardRef } from "react";
import { headline, severityLabels, type QaCase } from "@/lib/product/case";

const WIDTH = 1080;
const HEIGHT = 1350;

const INK = "#F8FBF9";
const GREEN = "#4CAF72";
const MUTED = "#CDD5D0";
const FAINT = "rgba(248,251,249,0.45)";
const LINE = "rgba(255,255,255,0.1)";

const severityColors: Record<string, string> = {
  critica: "#F87171",
  alta: "#FB923C",
  media: "#FBBF24",
  baixa: "#94A3B8",
};

/**
 * `steps` é limitado a 4 de propósito: o card é a chamada, não a entrega. Um
 * passo a passo completo em imagem fica ilegível no feed e tira o motivo de
 * clicar no link.
 */
export const CaseCardView = forwardRef<HTMLDivElement, { item: QaCase; author: string }>(
  function CaseCardView({ item, author }, ref) {
    const severityColor = severityColors[item.severity] ?? GREEN;
    const steps = item.steps.slice(0, 4);
    const rest = item.steps.length - steps.length;

    return (
      <div
        ref={ref}
        style={{ width: WIDTH, height: HEIGHT, background: "#111315", color: INK }}
        className="relative flex flex-col overflow-hidden"
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(76,175,114,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(76,175,114,.05) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        <div className="relative flex flex-1 flex-col justify-between p-20">
          <div className="flex items-center justify-between">
            <span style={{ color: GREEN, letterSpacing: "0.18em" }} className="text-[26px] font-bold uppercase">
              Lab {item.label} · {item.area}
            </span>
            <span
              style={{ color: severityColor, borderColor: severityColor, letterSpacing: "0.1em" }}
              className="rounded-full border-2 px-6 py-2 text-[22px] font-bold uppercase"
            >
              {severityLabels[item.severity]}
            </span>
          </div>

          <div className="flex flex-1 flex-col justify-center gap-12 py-12">
            <div>
              <p style={{ color: FAINT, letterSpacing: "0.14em" }} className="text-[22px] font-bold uppercase">
                O que eu encontrei
              </p>
              <h2 style={{ letterSpacing: "-0.03em", lineHeight: 1.08 }} className="mt-6 text-[62px] font-black">
                {headline(item, 130)}
              </h2>
            </div>

            <div>
              <p style={{ color: FAINT, letterSpacing: "0.14em" }} className="text-[22px] font-bold uppercase">
                Como reproduzir
              </p>
              <ul className="mt-6 grid gap-5">
                {steps.map((step, index) => (
                  <li key={index} className="flex gap-5 text-[30px]" style={{ lineHeight: 1.35 }}>
                    <span style={{ color: GREEN }} className="font-mono font-bold">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span style={{ color: MUTED }}>{clamp(step, 92)}</span>
                  </li>
                ))}
                {rest > 0 && (
                  <li style={{ color: FAINT }} className="text-[26px]">
                    +{rest} passo{rest > 1 ? "s" : ""} no case completo
                  </li>
                )}
              </ul>
            </div>
          </div>

          <div className="flex items-end justify-between border-t pt-10" style={{ borderColor: LINE }}>
            <div>
              <p style={{ color: INK }} className="text-[32px] font-bold">
                {author}
              </p>
              <p style={{ color: FAINT }} className="mt-2 text-[24px]">
                {item.criteria.length} critério(s) de aceite validados
              </p>
            </div>
            <span style={{ color: GREEN }} className="text-[30px] font-black italic">
              QA Lab
            </span>
          </div>
        </div>
      </div>
    );
  },
);

function clamp(value: string, max: number) {
  const text = value.replace(/\s+/g, " ").trim();
  return text.length <= max ? text : `${text.slice(0, max - 1).trimEnd()}…`;
}

export const CASE_CARD_SIZE = { width: WIDTH, height: HEIGHT };
