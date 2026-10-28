"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Monitor, Smartphone, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { normalizePortfolioAppearance, PORTFOLIO_LAYOUTS, PORTFOLIO_PALETTES, type PortfolioAppearance } from "@/lib/product/portfolio-appearance";

export function PortfolioAppearanceEditor({ initialAppearance }: { initialAppearance: unknown }) {
  const router = useRouter();
  const [saved, setSaved] = useState(() => normalizePortfolioAppearance(initialAppearance));
  const [appearance, setAppearance] = useState(saved);
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [preview, setPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const dirty = appearance.layout !== saved.layout || appearance.palette !== saved.palette;
  const previewUrl = `/perfil/portfolio/preview?layout=${appearance.layout}&palette=${appearance.palette}`;

  function choose(next: PortfolioAppearance) {
    setAppearance(next); setError(""); setStatus("");
    if (preview) setLoading(true);
  }

  async function save() {
    setBusy(true); setError(""); setStatus("");
    try {
      const response = await fetch("/api/v1/portfolio/appearance", {
        method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify(appearance),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error?.message || "Não foi possível salvar. Tente novamente.");
      setSaved(normalizePortfolioAppearance(body.data));
      setStatus("Aparência salva. Seu portfólio já usa estas escolhas.");
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Verifique sua conexão e tente novamente.");
    } finally { setBusy(false); }
  }

  return <section className="min-w-0 rounded-xl border border-border bg-card p-5 sm:p-6" aria-labelledby="portfolio-appearance-title">
    <h2 id="portfolio-appearance-title" className="text-base font-semibold">Aparência do portfólio</h2>
    <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">Escolha um layout e uma paleta. Salvar atualiza a página pública.</p>
    <fieldset disabled={busy} className="mt-6">
      <legend className="text-sm font-medium">Composição da página</legend>
      <div className="mt-3 grid gap-3 sm:grid-cols-3">{PORTFOLIO_LAYOUTS.map((layout) => <label key={layout.id} className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 focus-within:outline-2 focus-within:outline-ring ${appearance.layout === layout.id ? "border-primary bg-primary/5" : "border-border"}`}>
        <input type="radio" name="portfolio-layout" value={layout.id} checked={appearance.layout === layout.id} onChange={() => choose({ ...appearance, layout: layout.id })} className="mt-1 accent-primary" />
        <span><span className="block text-sm font-medium">{layout.label}</span><span className="mt-1 block text-xs leading-5 text-muted-foreground">{layout.description}</span></span>
      </label>)}</div>
    </fieldset>
    <fieldset disabled={busy} className="mt-6">
      <legend className="text-sm font-medium">Paleta de cores</legend>
      <div className="mt-3 flex flex-wrap gap-3">{PORTFOLIO_PALETTES.map((palette) => <label key={palette.id} className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 focus-within:outline-2 focus-within:outline-ring ${appearance.palette === palette.id ? "border-primary" : "border-border"}`}>
        <input type="radio" name="portfolio-palette" value={palette.id} checked={appearance.palette === palette.id} onChange={() => choose({ ...appearance, palette: palette.id })} className="accent-primary" />
        <span aria-hidden="true" className="flex overflow-hidden rounded border border-border"><span className="size-5" style={{ background: palette.background }} /><span className="size-5" style={{ background: palette.accent }} /><span className="size-5" style={{ background: palette.foreground }} /></span>
        <span className="text-sm">{palette.label}</span>
      </label>)}</div>
    </fieldset>
    <div className="mt-6 flex flex-wrap items-center gap-3">
      <Button type="button" disabled={busy || !dirty} onClick={save}>{busy && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}{busy ? "Salvando…" : "Salvar aparência"}</Button>
      <Button type="button" variant="outline" aria-expanded={preview} aria-controls="portfolio-appearance-preview" onClick={() => { setPreview(!preview); setLoading(!preview); }}>{preview ? "Fechar prévia" : "Visualizar meu portfólio"}</Button>
      {dirty && <span className="text-xs text-muted-foreground">Alterações ainda não salvas</span>}
    </div>
    {error && <p role="alert" className="mt-3 text-sm text-destructive">{error}</p>}
    <p role="status" className="mt-3 text-sm text-muted-foreground">{status}</p>
    {preview && <div id="portfolio-appearance-preview" className="mt-6 min-w-0 border-t border-border pt-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-medium">Prévia privada</p>
        <div role="group" aria-label="Tamanho da prévia" className="flex gap-2">
          <Button type="button" size="sm" variant={device === "desktop" ? "default" : "outline"} aria-pressed={device === "desktop"} onClick={() => setDevice("desktop")}><Monitor className="size-4" aria-hidden="true" />Desktop</Button>
          <Button type="button" size="sm" variant={device === "mobile" ? "default" : "outline"} aria-pressed={device === "mobile"} onClick={() => setDevice("mobile")}><Smartphone className="size-4" aria-hidden="true" />Celular</Button>
        </div>
      </div>
      <p className="mt-2 text-xs leading-5 text-muted-foreground">Mostra os dados salvos do perfil e os trabalhos publicados, mesmo com o portfólio privado. As cores e a composição refletem sua seleção acima. A prévia desktop tem 1024 px; a de celular, 390 px.</p>
      <p role="status" className="mt-2 text-xs text-muted-foreground">{loading ? "Carregando prévia…" : "A prévia está pronta."}</p>
      <div className="mt-3 max-w-full overflow-x-auto rounded-lg border border-border bg-muted p-2" tabIndex={0} role="region" aria-label="Prévia do portfólio; role horizontalmente para ver toda a tela desktop">
        <iframe title={`Prévia ${device === "desktop" ? "desktop" : "celular"} do seu portfólio`} src={previewUrl} onLoad={() => setLoading(false)} className="mx-auto block h-[640px] border-0" style={{ width: device === "desktop" ? 1024 : 390 }} />
      </div>
    </div>}
  </section>;
}
