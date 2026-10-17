"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function CareerTemplate({ label, text }: { label: string; text: string }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }
  return <div className="mt-4 border border-white/10 bg-[#101319] p-4"><div className="flex flex-wrap items-center justify-between gap-3"><p className="text-xs font-bold uppercase tracking-[.12em] text-neon">{label}</p><button type="button" onClick={() => void copy()} className="inline-flex items-center gap-2 text-xs font-bold text-mint hover:text-neon" aria-label={`Copiar ${label}`}>{copied ? <Check className="size-4" /> : <Copy className="size-4" />}{copied ? "Copiado" : "Copiar modelo"}</button></div><pre className="mt-3 whitespace-pre-wrap font-sans text-sm leading-6 text-[#C8CFD7]">{text}</pre></div>;
}
