"use client";

import { useMemo, useRef, useState } from "react";
import { toPng } from "html-to-image";
import { Download, Loader2, RefreshCcw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { CarouselSlideView, CAROUSEL_SLIDE_SIZE } from "./carousel-slide";
import { buildCarouselDeck, listCarouselSources, type CarouselSlide, type CarouselSourceKind } from "@/lib/product/carousel";

const KIND_LABEL: Record<CarouselSourceKind, string> = { blog: "Artigos do blog", desafio: "Desafios", referencia: "Referências" };

function slugify(value: string) {
  return value.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function CarouselStudio() {
  const sources = useMemo(() => listCarouselSources(), []);
  const [kind, setKind] = useState<CarouselSourceKind>("blog");
  const optionsForKind = useMemo(() => sources.filter((option) => option.kind === kind), [sources, kind]);
  const [sourceId, setSourceId] = useState(optionsForKind[0]?.id ?? "");
  const [deck, setDeck] = useState<CarouselSlide[] | null>(null);
  const [exportingId, setExportingId] = useState<string | null>(null);
  const [exportingAll, setExportingAll] = useState(false);
  const slideRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  function selectKind(next: CarouselSourceKind) {
    setKind(next);
    const first = sources.find((option) => option.kind === next);
    setSourceId(first?.id ?? "");
    setDeck(null);
  }

  function generate(id = sourceId) {
    if (!id) return;
    setDeck(buildCarouselDeck(kind, id));
  }

  function updateSlide(id: string, patch: Partial<CarouselSlide>) {
    setDeck((current) => current?.map((slide) => (slide.id === id ? { ...slide, ...patch } : slide)) ?? current);
  }

  async function exportSlide(slide: CarouselSlide, index: number, baseName: string) {
    const node = slideRefs.current.get(slide.id);
    if (!node) return;
    setExportingId(slide.id);
    try {
      const dataUrl = await toPng(node, { width: CAROUSEL_SLIDE_SIZE.width, height: CAROUSEL_SLIDE_SIZE.height, pixelRatio: 1 });
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `${baseName}-${String(index + 1).padStart(2, "0")}.png`;
      link.click();
    } finally {
      setExportingId(null);
    }
  }

  async function exportAll() {
    if (!deck) return;
    setExportingAll(true);
    const baseName = slugify(sources.find((option) => option.id === sourceId)?.label ?? "carrossel") || "carrossel";
    for (let i = 0; i < deck.length; i++) {
      await exportSlide(deck[i], i, baseName);
      await new Promise((resolve) => setTimeout(resolve, 180));
    }
    setExportingAll(false);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
      <Card>
        <CardContent className="grid gap-5 p-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Fonte</p>
            <div className="mt-2 flex gap-2">
              {(Object.keys(KIND_LABEL) as CarouselSourceKind[]).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => selectKind(option)}
                  className={`rounded-md border px-3 py-1.5 text-xs font-semibold transition-colors ${
                    kind === option ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/40"
                  }`}
                >
                  {KIND_LABEL[option]}
                </button>
              ))}
            </div>
          </div>

          <label className="grid gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Item
            <select
              value={sourceId}
              onChange={(event) => setSourceId(event.target.value)}
              className="field text-sm font-normal normal-case text-foreground"
            >
              <option value="" disabled>Escolha um item</option>
              {optionsForKind.map((option) => (
                <option key={option.id} value={option.id}>{option.label}</option>
              ))}
            </select>
          </label>

          <Button onClick={() => generate()} disabled={!sourceId} className="gap-2">
            <Sparkles className="size-4" /> Gerar carrossel
          </Button>

          {deck && (
            <>
              <Button variant="outline" onClick={() => generate()} className="gap-2">
                <RefreshCcw className="size-4" /> Regenerar do zero
              </Button>
              <Button onClick={exportAll} disabled={exportingAll} className="gap-2">
                {exportingAll ? <Loader2 className="size-4 animate-spin" /> : <Download className="size-4" />}
                Exportar todas as {deck.length} imagens
              </Button>
              <p className="text-xs text-muted-foreground">
                Formato 1080×1350 (4:5), pronto para carrossel do LinkedIn. Edite o texto de cada slide antes de exportar.
              </p>
            </>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-8">
        {!deck && <p className="text-sm text-muted-foreground">Escolha uma fonte e um item, depois clique em &quot;Gerar carrossel&quot;.</p>}
        {deck?.map((slide, index) => (
          <div key={slide.id} className="grid gap-4 md:grid-cols-[minmax(0,320px)_1fr]">
            <div
              className="overflow-hidden rounded-lg border border-border"
              style={{ width: CAROUSEL_SLIDE_SIZE.width * 0.28, height: CAROUSEL_SLIDE_SIZE.height * 0.28 }}
            >
              <div style={{ transform: "scale(0.28)", transformOrigin: "top left" }}>
                <CarouselSlideView
                  ref={(node) => {
                    if (node) slideRefs.current.set(slide.id, node);
                  }}
                  slide={slide}
                  index={index}
                  total={deck.length}
                />
              </div>
            </div>
            <Card>
              <CardContent className="grid gap-3 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Slide {index + 1} de {deck.length} · {slide.kind}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => exportSlide(slide, index, slugify(sources.find((option) => option.id === sourceId)?.label ?? "carrossel"))}
                    disabled={exportingId === slide.id}
                    className="gap-2"
                  >
                    {exportingId === slide.id ? <Loader2 className="size-3.5 animate-spin" /> : <Download className="size-3.5" />}
                    PNG
                  </Button>
                </div>
                <Input value={slide.eyebrow} onChange={(event) => updateSlide(slide.id, { eyebrow: event.target.value })} placeholder="Eyebrow" />
                <Input value={slide.title} onChange={(event) => updateSlide(slide.id, { title: event.target.value })} placeholder="Título" />
                <Textarea value={slide.body ?? ""} onChange={(event) => updateSlide(slide.id, { body: event.target.value })} placeholder="Corpo (opcional)" rows={2} />
                {slide.bullets && (
                  <Textarea
                    value={slide.bullets.join("\n")}
                    onChange={(event) => updateSlide(slide.id, { bullets: event.target.value.split("\n").filter(Boolean) })}
                    placeholder="Um item por linha"
                    rows={4}
                  />
                )}
                <Input value={slide.footer ?? ""} onChange={(event) => updateSlide(slide.id, { footer: event.target.value })} placeholder="Rodapé (opcional)" />
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
