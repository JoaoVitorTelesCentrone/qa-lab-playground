import { forwardRef } from "react";
import type { CarouselSlide } from "@/lib/product/carousel";

const SLIDE_WIDTH = 1080;
const SLIDE_HEIGHT = 1350;

export const CarouselSlideView = forwardRef<HTMLDivElement, { slide: CarouselSlide; index: number; total: number }>(
  function CarouselSlideView({ slide, index, total }, ref) {
    return (
      <div
        ref={ref}
        style={{ width: SLIDE_WIDTH, height: SLIDE_HEIGHT, background: "#111315", color: "#F8FBF9" }}
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
            <span style={{ color: "#4CAF72", letterSpacing: "0.18em" }} className="text-[26px] font-bold uppercase">
              {slide.eyebrow}
            </span>
            <span style={{ color: "rgba(248,251,249,0.35)" }} className="text-[24px] font-mono">
              {String(index + 1).padStart(2, "0")}/{String(total).padStart(2, "0")}
            </span>
          </div>

          <div className="flex flex-1 flex-col justify-center gap-10 py-10">
            <h2
              style={{ letterSpacing: "-0.03em", lineHeight: 1.05 }}
              className={slide.kind === "cover" ? "text-[92px] font-black" : "text-[68px] font-black"}
            >
              {slide.title}
            </h2>
            {slide.body && (
              <p style={{ color: "#CDD5D0", lineHeight: 1.55 }} className="max-w-[880px] text-[36px]">
                {slide.body}
              </p>
            )}
            {slide.bullets && (
              <ul className="grid gap-6">
                {slide.bullets.map((bullet, i) => (
                  <li key={i} className="flex gap-5 text-[34px]" style={{ lineHeight: 1.4 }}>
                    <span style={{ color: "#4CAF72" }} className="font-mono font-bold">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span style={{ color: "#E2E8E4" }}>{bullet}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex items-center justify-between border-t pt-8" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
            <span style={{ color: "#4CAF72" }} className="text-[30px] font-black italic">
              QA Lab
            </span>
            {slide.footer && (
              <span style={{ color: "rgba(248,251,249,0.5)" }} className="text-[24px]">
                {slide.footer}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  },
);

export const CAROUSEL_SLIDE_SIZE = { width: SLIDE_WIDTH, height: SLIDE_HEIGHT };
