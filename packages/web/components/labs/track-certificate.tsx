"use client";

// Emissão do certificado no fim da trilha.
//
// Client component isolado só por causa do botão: o resto da página da trilha
// continua sendo Server Component com o progresso já resolvido.

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Award, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function TrackCertificate({ trackSlug, eligible, missing, code }: {
  trackSlug: string;
  eligible: boolean;
  missing: number;
  code: string | null;
}) {
  const [issued, setIssued] = useState(code);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function issue() {
    setBusy(true);
    setError("");
    const response = await fetch("/api/v1/certificates", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ track: trackSlug }) });
    const body = await response.json().catch(() => null);
    setBusy(false);
    if (!response.ok) {
      setError(body?.error?.message ?? "Não foi possível emitir o certificado.");
      return;
    }
    setIssued(body.data.code);
  }

  if (issued) {
    return <section className="mt-6 rounded-xl border border-primary/30 bg-primary/[0.04] p-5">
      <h2 className="flex items-center gap-2 text-sm font-medium"><Award className="size-4 text-primary" aria-hidden="true" /> Certificado emitido</h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">Código <span className="font-mono text-foreground">{issued}</span> — verificável por qualquer pessoa com o link, e pronto para o campo &ldquo;ID da credencial&rdquo; do LinkedIn.</p>
      <Button asChild size="sm" className="mt-3"><Link href={`/certificado/${issued}`}>Ver certificado <ArrowRight className="size-3.5" /></Link></Button>
    </section>;
  }

  if (!eligible) {
    return <p className="mt-6 rounded-xl border border-border bg-muted/40 p-4 text-sm leading-6 text-muted-foreground">
      <Award className="mr-2 inline size-4" aria-hidden="true" />
      Faltam {missing} Lab(s) para o certificado desta trilha. Ele é público, verificável por código e lista as evidências que você produziu.
    </p>;
  }

  return <section className="mt-6 rounded-xl border border-primary/30 bg-primary/[0.04] p-5">
    <h2 className="flex items-center gap-2 text-sm font-medium"><Award className="size-4 text-primary" aria-hidden="true" /> Certificado disponível</h2>
    <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">Você fechou todos os Labs liberados desta trilha, cada um com evidência aceita. O certificado é uma página pública com código de verificação.</p>
    <Button type="button" className="mt-3" disabled={busy} onClick={issue}>
      {busy ? <Loader2 className="size-4 animate-spin" /> : <Award className="size-4" />} Emitir certificado
    </Button>
    {error && <p role="alert" className="mt-3 text-xs text-destructive">{error}</p>}
  </section>;
}
