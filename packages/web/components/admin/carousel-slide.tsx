import { forwardRef } from "react";
import type { CarouselSlide } from "@/lib/product/carousel";
import styles from "./carousel-slide.module.css";

export const CAROUSEL_SLIDE_SIZE = { width: 1080, height: 1080 } as const;

export const CAROUSEL_STYLES = [
  { id: "dossie", label: "Dossiê", description: "Investigação e evidência", color: "#b9ef63" },
  { id: "radar", label: "Radar", description: "Risco e sinais", color: "#c4f46a" },
  { id: "caderno", label: "Caderno", description: "Notas de campo", color: "#c85843" },
  { id: "terminal", label: "Terminal", description: "API e automação", color: "#78ead7" },
  { id: "cartaz", label: "Cartaz", description: "Opinião e manifesto", color: "#f07862" },
] as const;

export type CarouselStyle = (typeof CAROUSEL_STYLES)[number]["id"];

function titleSize(title: string, kind: CarouselSlide["kind"]) {
  const length = title.length;
  const base = kind === "content" || kind === "list" ? 91 : 106;
  if (length > 75) return 57;
  if (length > 58) return 65;
  if (length > 44) return 73;
  if (length > 32) return 84;
  return base;
}

export const CarouselSlideView = forwardRef<HTMLDivElement, { slide: CarouselSlide; index: number; total: number; design: CarouselStyle }>(
  function CarouselSlideView({ slide, index, total, design }, ref) {
    const alternating = (design === "dossie" || design === "cartaz") && (index === 1 || index === 3);
    const className = [styles.canvas, styles[design], styles[slide.kind], alternating ? styles.alternate : ""].join(" ");

    return (
      <div ref={ref} className={className} data-carousel-slide data-carousel-style={design}>
        <div className={styles.texture} aria-hidden="true" />
        <div className={styles.motif} aria-hidden="true"><span /><span /><span /></div>
        <div className={styles.header}>
          <div className={styles.logo}>QA <span>LAB</span></div>
          <div className={styles.series}>{design === "terminal" ? "SESSION: QA_LAB" : design === "caderno" ? "CADERNO DE CAMPO" : design === "radar" ? "RADAR DE RISCO" : design === "cartaz" ? "MANIFESTO QA" : "DOSSIÊ QA"}</div>
        </div>

        <div className={styles.main} data-carousel-content>
          <div className={styles.eyebrow}>{slide.eyebrow || "QA LAB"}</div>
          <h2 className={styles.title} style={{ fontSize: titleSize(slide.title, slide.kind) }}>{slide.title}</h2>
          {slide.body ? <div className={styles.bodyBox}><p className={styles.body}>{slide.body}</p></div> : null}
          {slide.bullets?.length ? (
            <ol className={styles.bullets}>
              {slide.bullets.map((bullet, bulletIndex) => (
                <li key={`${slide.id}-${bulletIndex}`}>
                  <span className={styles.bulletNumber}>{String(bulletIndex + 1).padStart(2, "0")}</span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ol>
          ) : null}
        </div>

        <div className={styles.footer}>
          <span>{slide.footer || "QA LAB · PRÁTICA COM EVIDÊNCIA"}</span>
          <span>{String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</span>
        </div>
      </div>
    );
  },
);
