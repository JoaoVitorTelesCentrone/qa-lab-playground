"use client";

// Zona de perigo, separada do resto das configurações e com confirmação
// explícita em dois passos — a exclusão apaga perfil, evidências e progresso.

import { useState } from "react";
import { Loader2, Trash2, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DangerZone({ onDelete }: { onDelete: () => Promise<string | null> }) {
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function confirm() {
    setBusy(true); setError("");
    const message = await onDelete();
    setBusy(false);
    // Em caso de sucesso a página é trocada por /; só erro volta pra cá.
    if (message) { setError(message); setConfirming(false); }
  }

  return (
    <section className="rounded-xl border border-destructive/25 bg-destructive/[0.035] p-5 sm:p-6" aria-labelledby="perigo-title">
      <div className="flex items-center gap-2.5">
        <TriangleAlert className="size-4 text-destructive" aria-hidden="true" />
        <h2 id="perigo-title" className="text-base font-semibold">Excluir conta</h2>
      </div>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
        Remove permanentemente perfil, projetos, rascunhos, favoritos, evidências e progresso sincronizado.
      </p>

      {confirming ? (
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <p role="alert" className="text-sm font-medium text-destructive">
            Tem certeza? Esta ação não pode ser desfeita.
          </p>
          <div className="flex gap-2">
            <Button type="button" size="sm" variant="outline" disabled={busy} onClick={confirm} className="border-destructive/40 text-destructive hover:bg-destructive/10">
              {busy ? <Loader2 className="size-3.5 animate-spin" /> : <Trash2 className="size-3.5" />}
              {busy ? "Excluindo..." : "Confirmar exclusão"}
            </Button>
            <Button type="button" size="sm" variant="ghost" disabled={busy} onClick={() => setConfirming(false)}>Cancelar</Button>
          </div>
        </div>
      ) : (
        <Button type="button" size="sm" variant="outline" onClick={() => setConfirming(true)} className="mt-4 border-destructive/30 bg-transparent text-destructive hover:bg-destructive/10">
          <Trash2 className="size-3.5" /> Excluir minha conta
        </Button>
      )}

      {error && <p role="alert" className="mt-3 text-xs text-destructive">{error}</p>}
    </section>
  );
}
