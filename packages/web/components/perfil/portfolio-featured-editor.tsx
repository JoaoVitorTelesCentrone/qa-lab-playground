"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Submission } from "@/lib/product/journey";
import { labs } from "@/lib/playground/catalog";

export function PortfolioFeaturedEditor({ submissions, initialSelection }: {
  submissions: Submission[];
  initialSelection: string[];
}) {
  const router = useRouter();
  const available = useMemo(() => submissions.filter((item) => item.published), [submissions]);
  const [selected, setSelected] = useState(() => initialSelection.filter((id) => available.some((item) => item.id === id)).slice(0, 3));
  const [savedSelection, setSavedSelection] = useState(() => initialSelection.filter((id) => available.some((item) => item.id === id)).slice(0, 3));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const dirty = selected.join("|") !== savedSelection.join("|");

  function toggle(id: string) {
    setError("");
    setSelected((current) => current.includes(id)
      ? current.filter((item) => item !== id)
      : current.length < 3 ? [...current, id] : current);
  }

  async function save() {
    setBusy(true); setError("");
    try {
      const response = await fetch("/api/v1/portfolio/featured", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ submissionIds: selected }),
      });
      const body = await response.json().catch(() => null);
      if (!response.ok) {
        const message = body?.error?.message ?? "Não foi possível salvar os destaques.";
        setError(message.includes("portfolio_featured_submission_ids")
          ? "Destaques ainda indisponíveis: aplique a migração portfolio_featured_work no Supabase."
          : message);
        return;
      }
      setSavedSelection(body.data.submissionIds);
      router.refresh();
    } catch {
      setError("Não foi possível salvar agora. Verifique sua conexão e tente novamente.");
    } finally {
      setBusy(false);
    }
  }

  return <section className="rounded-xl border border-border bg-card p-5 sm:p-6" aria-labelledby="portfolio-featured-title">
    <div className="flex items-center gap-2.5"><Sparkles className="size-4 text-primary" aria-hidden="true" /><h2 id="portfolio-featured-title" className="text-base font-semibold">Trabalhos em destaque</h2></div>
    <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">Escolha até três cases publicados. A ordem de seleção define a ordem no portfólio.</p>

    {available.length === 0
      ? <p className="mt-4 rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">Quando você publicar um case, poderá escolhê-lo para destaque aqui.</p>
      : <div className="mt-4 grid max-h-72 gap-1 overflow-y-auto rounded-lg border border-border p-2">{available.map((item) => {
          const lab = labs.find((candidate) => candidate.slug === item.labSlug);
          const order = selected.indexOf(item.id);
          const disabled = order < 0 && selected.length === 3;
          return <label key={item.id} className={`flex items-start gap-3 rounded-md p-3 text-sm ${disabled ? "opacity-50" : "hover:bg-muted/50"}`}>
            <input type="checkbox" checked={order >= 0} disabled={disabled || busy} onChange={() => toggle(item.id)} className="mt-0.5 accent-primary" />
            <span className="min-w-0 flex-1"><strong className="block truncate font-medium">{lab?.title ?? item.labSlug}</strong><span className="mt-1 block line-clamp-2 text-xs leading-5 text-muted-foreground">{item.evidence || `${item.attachments.length} anexo(s)`}</span></span>
            {order >= 0 && <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">{order + 1}</span>}
          </label>;
        })}</div>}

    {error && <p role="alert" className="mt-3 text-sm text-destructive">{error}</p>}
    <div className="mt-4 flex items-center justify-between gap-3 border-t border-border pt-4">
      <span className="text-xs text-muted-foreground">{selected.length} de 3 selecionados</span>
      <Button type="button" size="sm" disabled={!dirty || busy} onClick={save}>{busy ? <Loader2 className="size-3.5 animate-spin" /> : <Save className="size-3.5" />} Salvar destaques</Button>
    </div>
  </section>;
}
