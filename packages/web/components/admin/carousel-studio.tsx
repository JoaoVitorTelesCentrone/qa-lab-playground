"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { toPng } from "html-to-image";
import { Check, Copy, Download, FileText, Loader2, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CarouselSlideView, CAROUSEL_SLIDE_SIZE, CAROUSEL_STYLES, type CarouselStyle } from "./carousel-slide";
import { buildCarouselDeck, listCarouselSources, type CarouselSlide, type CarouselSourceKind } from "@/lib/product/carousel";

const KIND_LABEL: Record<CarouselSourceKind, string> = {
  tema: "Temas prontos",
  blog: "Artigos",
  desafio: "Desafios",
  referencia: "Pesquisas",
};

function slugify(value: string) {
  return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "carrossel-qa-lab";
}

function suggestedCaption(deck: CarouselSlide[]) {
  const cover = deck[0];
  const closing = deck.at(-1);
  return `${cover?.title ?? "Um tema de QA para discutir"}\n\n${cover?.body ?? ""}\n\n${closing?.body ?? "Explore o QA Lab."}\n\n#QA #QualidadeDeSoftware #TestesDeSoftware`;
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
}

export function CarouselStudio() {
  const sources = useMemo(() => listCarouselSources(), []);
  const [kind, setKind] = useState<CarouselSourceKind>("tema");
  const [sourceId, setSourceId] = useState("ia-e-julgamento");
  const [design, setDesign] = useState<CarouselStyle>("dossie");
  const [deck, setDeck] = useState<CarouselSlide[]>(() => buildCarouselDeck("tema", "ia-e-julgamento") ?? []);
  const [activeIndex, setActiveIndex] = useState(0);
  const [caption, setCaption] = useState(() => suggestedCaption(buildCarouselDeck("tema", "ia-e-julgamento") ?? []));
  const [previewWidth, setPreviewWidth] = useState(520);
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const options = useMemo(() => sources.filter((option) => option.kind === kind), [sources, kind]);
  const current = deck[activeIndex];
  const topicLabel = sources.find((source) => source.kind === kind && source.id === sourceId)?.label ?? "QA Lab";
  const baseName = `qa-lab-${slugify(topicLabel)}-${design}`;

  useEffect(() => {
    const node = previewRef.current;
    if (!node) return;
    const observer = new ResizeObserver(([entry]) => setPreviewWidth(entry.contentRect.width));
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  function loadTopic(nextKind: CarouselSourceKind, nextId: string) {
    const nextDeck = buildCarouselDeck(nextKind, nextId) ?? [];
    setKind(nextKind);
    setSourceId(nextId);
    setDeck(nextDeck);
    setActiveIndex(0);
    setCaption(suggestedCaption(nextDeck));
    setMessage(null);
  }

  function updateSlide(patch: Partial<CarouselSlide>) {
    if (!current) return;
    setDeck((slides) => slides.map((slide) => slide.id === current.id ? { ...slide, ...patch } : slide));
    setMessage(null);
  }

  async function captureSlide(slide: CarouselSlide, index: number) {
    const node = slideRefs.current.get(slide.id);
    if (!node) throw new Error(`O slide ${index + 1} ainda não está pronto. Tente novamente.`);
    const content = node.querySelector<HTMLElement>("[data-carousel-content]");
    if (content && content.scrollHeight > content.clientHeight + 2) {
      throw new Error(`O texto do slide ${index + 1} ficou grande demais. Encurte o texto antes de baixar.`);
    }
    return toPng(node, {
      width: CAROUSEL_SLIDE_SIZE.width,
      height: CAROUSEL_SLIDE_SIZE.height,
      pixelRatio: 1,
      cacheBust: true,
    });
  }

  async function exportPdf() {
    if (!deck.length || busy) return;
    setBusy("pdf");
    setMessage(null);
    try {
      await document.fonts.ready;
      const { PDFDocument } = await import("pdf-lib");
      const pdf = await PDFDocument.create();
      pdf.setTitle(topicLabel);
      pdf.setAuthor("QA Lab");
      for (let index = 0; index < deck.length; index++) {
        setBusy(`pdf-${index + 1}`);
        const png = await captureSlide(deck[index], index);
        const image = await pdf.embedPng(await (await fetch(png)).arrayBuffer());
        const page = pdf.addPage([CAROUSEL_SLIDE_SIZE.width, CAROUSEL_SLIDE_SIZE.height]);
        page.drawImage(image, { x: 0, y: 0, width: CAROUSEL_SLIDE_SIZE.width, height: CAROUSEL_SLIDE_SIZE.height });
      }
      const bytes = await pdf.save();
      downloadBlob(new Blob([new Uint8Array(bytes)], { type: "application/pdf" }), `${baseName}.pdf`);
      setMessage(`PDF com ${deck.length} páginas baixado. No LinkedIn, escolha “Adicionar documento” para publicar.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Não foi possível gerar o PDF. Tente novamente.");
    } finally {
      setBusy(null);
    }
  }

  async function exportPng() {
    if (!current || busy) return;
    setBusy("png");
    setMessage(null);
    try {
      await document.fonts.ready;
      const png = await captureSlide(current, activeIndex);
      const bytes = await (await fetch(png)).blob();
      downloadBlob(bytes, `${baseName}-${String(activeIndex + 1).padStart(2, "0")}.png`);
      setMessage(`PNG do slide ${activeIndex + 1} baixado.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Não foi possível gerar o PNG. Tente novamente.");
    } finally {
      setBusy(null);
    }
  }

  async function copyCaption() {
    try {
      await navigator.clipboard.writeText(caption);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setMessage("Não foi possível copiar. Selecione o texto da legenda e copie manualmente.");
    }
  }

  return (
    <div className="grid items-start gap-7 xl:grid-cols-[360px_minmax(0,1fr)]">
      <aside className="space-y-6 rounded-2xl border border-white/10 bg-[#16201d] p-5 xl:sticky xl:top-6" aria-label="Configuração do carrossel">
        <section>
          <div className="flex items-center gap-3"><span className="font-mono text-xs text-mint">01</span><h2 className="text-lg font-black text-off-white">Escolha o tema</h2></div>
          <p className="mt-2 text-xs leading-5 text-[#AEBBB4]">Os temas prontos já vêm com uma sequência de cinco slides. Outras fontes geram um rascunho editável.</p>
          <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Tipo de tema">
            {(Object.keys(KIND_LABEL) as CarouselSourceKind[]).map((option) => (
              <button key={option} type="button" onClick={() => loadTopic(option, sources.find((source) => source.kind === option)?.id ?? "")} aria-pressed={kind === option}
                className={`rounded-full border px-3 py-2 text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint ${kind === option ? "border-mint bg-mint text-[#102019]" : "border-white/15 text-[#D7E0D9] hover:border-mint/50"}`}>
                {KIND_LABEL[option]}
              </button>
            ))}
          </div>
          <label className="mt-5 block text-xs font-bold text-[#D7E0D9]" htmlFor="carousel-topic">Tema</label>
          <select id="carousel-topic" value={sourceId} onChange={(event) => loadTopic(kind, event.target.value)} className="mt-2 h-11 w-full rounded-lg border border-white/20 bg-[#0D1714] px-3 text-sm text-off-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint">
            {options.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}
          </select>
          <p className="mt-2 text-xs text-[#AEBBB4]">{options.find((option) => option.id === sourceId)?.hint}</p>
        </section>

        <section className="border-t border-white/10 pt-5">
          <div className="flex items-center gap-3"><span className="font-mono text-xs text-mint">02</span><h2 className="text-lg font-black text-off-white">Escolha o estilo</h2></div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {CAROUSEL_STYLES.map((item) => (
              <button key={item.id} type="button" onClick={() => { setDesign(item.id); setMessage(null); }} aria-pressed={design === item.id}
                className={`min-h-20 rounded-lg border p-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint ${design === item.id ? "border-mint bg-mint/10" : "border-white/10 bg-[#101916] hover:border-white/30"}`}>
                <span className="mb-2 block h-2 w-12" style={{ background: item.color }} aria-hidden="true" />
                <strong className="block text-sm text-off-white">{item.label}</strong>
                <span className="mt-1 block text-[11px] leading-4 text-[#AEBBB4]">{item.description}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="border-t border-white/10 pt-5">
          <div className="flex items-center gap-3"><span className="font-mono text-xs text-mint">03</span><h2 className="text-lg font-black text-off-white">Baixe e publique</h2></div>
          <Button type="button" onClick={exportPdf} disabled={!deck.length || Boolean(busy)} className="mt-4 h-12 w-full gap-2 bg-mint font-black text-[#102019] hover:bg-mint/90">
            {busy?.startsWith("pdf") ? <Loader2 className="size-4 animate-spin" /> : <FileText className="size-4" />}
            {busy?.startsWith("pdf-") ? `Gerando página ${busy.slice(4)}/${deck.length}` : "Baixar PDF para LinkedIn"}
          </Button>
          <p className="mt-2 text-xs leading-5 text-[#AEBBB4]">Um arquivo com todas as páginas na ordem. Publique como documento no LinkedIn.</p>
          <Button type="button" variant="outline" onClick={() => loadTopic(kind, sourceId)} disabled={Boolean(busy)} className="mt-4 w-full gap-2 border-white/20 text-off-white"><RefreshCcw className="size-4" /> Restaurar texto do tema</Button>
          {message ? <p role="status" className="mt-4 rounded-lg border border-mint/25 bg-mint/10 p-3 text-xs leading-5 text-off-white">{message}</p> : null}
        </section>
      </aside>

      <div className="min-w-0 space-y-6">
        <section className="rounded-2xl border border-white/10 bg-[#16201d] p-4 sm:p-6" aria-label="Prévia do carrossel">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div><p className="font-mono text-xs font-bold text-mint">PRÉVIA AO VIVO</p><h2 className="mt-1 text-xl font-black text-off-white">{topicLabel}</h2></div>
            <span className="rounded-full border border-white/15 px-3 py-1.5 text-xs font-bold text-[#D7E0D9]">{CAROUSEL_STYLES.find((item) => item.id === design)?.label} · {deck.length} slides</span>
          </div>
          {current ? (
            <div ref={previewRef} className="mx-auto aspect-square w-full max-w-[540px] overflow-hidden border border-white/20 shadow-2xl shadow-black/40">
              <div style={{ width: CAROUSEL_SLIDE_SIZE.width, height: CAROUSEL_SLIDE_SIZE.height, transform: `scale(${previewWidth / CAROUSEL_SLIDE_SIZE.width})`, transformOrigin: "top left" }}>
                <CarouselSlideView slide={current} index={activeIndex} total={deck.length} design={design} />
              </div>
            </div>
          ) : <p className="py-24 text-center text-sm text-[#AEBBB4]">Escolha um tema para começar.</p>}
          <div className="mt-5 flex gap-2 overflow-x-auto pb-2" role="group" aria-label="Selecionar slide para prévia">
            {deck.map((slide, index) => (
              <button key={slide.id} type="button" onClick={() => setActiveIndex(index)} aria-label={`Ver slide ${index + 1}: ${slide.title}`} aria-pressed={activeIndex === index}
                className={`flex min-w-0 flex-[0_0_122px] flex-col items-start gap-1 rounded-lg border p-2 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint ${activeIndex === index ? "border-mint bg-mint/10" : "border-white/15 hover:border-white/40"}`}>
                <span className="font-mono text-[11px] font-bold text-mint">{String(index + 1).padStart(2, "0")}</span>
                <span className="line-clamp-2 text-xs font-semibold leading-4 text-off-white">{slide.title}</span>
              </button>
            ))}
          </div>
        </section>

        {current ? <section className="rounded-2xl border border-white/10 bg-[#16201d] p-4 sm:p-6" aria-label="Editar slide">
          <div className="flex flex-wrap items-center justify-between gap-3"><div><p className="font-mono text-xs font-bold text-mint">AJUSTES OPCIONAIS</p><h2 className="mt-1 text-lg font-black text-off-white">Texto do slide {activeIndex + 1}</h2></div><Button type="button" variant="outline" onClick={exportPng} disabled={Boolean(busy)} className="gap-2 border-white/20 text-off-white">{busy === "png" ? <Loader2 className="size-4 animate-spin" /> : <Download className="size-4" />} PNG deste slide</Button></div>
          <div className="mt-5 grid gap-4"><label className="text-xs font-bold text-[#D7E0D9]">Chamada curta<Input className="mt-2" value={current.eyebrow} onChange={(event) => updateSlide({ eyebrow: event.target.value })} maxLength={75} /></label><label className="text-xs font-bold text-[#D7E0D9]">Título<Input className="mt-2" value={current.title} onChange={(event) => updateSlide({ title: event.target.value })} maxLength={110} /></label><label className="text-xs font-bold text-[#D7E0D9]">Texto<Textarea className="mt-2" value={current.body ?? ""} onChange={(event) => updateSlide({ body: event.target.value })} rows={3} maxLength={350} /></label>{current.bullets ? <label className="text-xs font-bold text-[#D7E0D9]">Pontos (um por linha)<Textarea className="mt-2" value={current.bullets.join("\n")} onChange={(event) => updateSlide({ bullets: event.target.value.split("\n").filter(Boolean).slice(0, 6) })} rows={5} /></label> : null}</div>
        </section> : null}

        <section className="rounded-2xl border border-white/10 bg-[#16201d] p-4 sm:p-6" aria-label="Texto para a publicação">
          <div className="flex flex-wrap items-center justify-between gap-3"><div><p className="font-mono text-xs font-bold text-mint">PUBLICAÇÃO</p><h2 className="mt-1 text-lg font-black text-off-white">Legenda sugerida</h2></div><Button type="button" variant="outline" onClick={copyCaption} className="gap-2 border-white/20 text-off-white">{copied ? <Check className="size-4" /> : <Copy className="size-4" />}{copied ? "Copiada" : "Copiar texto"}</Button></div>
          <Textarea className="mt-4 min-h-44" value={caption} onChange={(event) => setCaption(event.target.value)} aria-label="Legenda sugerida para o post" />
          <p className="mt-3 text-xs leading-5 text-[#AEBBB4]">Revise fatos e links antes de publicar. O PDF e a legenda são gerados aqui no navegador.</p>
        </section>
      </div>

      <div aria-hidden="true" style={{ position: "fixed", left: -20000, top: 0, width: CAROUSEL_SLIDE_SIZE.width, pointerEvents: "none" }}>
        {deck.map((slide, index) => <CarouselSlideView key={`${design}-${slide.id}`} ref={(node) => { if (node) slideRefs.current.set(slide.id, node); else slideRefs.current.delete(slide.id); }} slide={slide} index={index} total={deck.length} design={design} />)}
      </div>
    </div>
  );
}
