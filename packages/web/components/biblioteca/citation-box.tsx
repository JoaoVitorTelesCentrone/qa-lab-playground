"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Citation = { id: string; label: string; text: string };

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);
  return <button
    type="button"
    onClick={async () => {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // Sem permissão de clipboard o texto continua selecionável no bloco.
      }
    }}
    className="inline-flex min-h-10 items-center gap-2 border border-border px-3 text-sm font-semibold transition-colors hover:border-brand-accent/60 hover:text-brand-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
  >
    {copied ? <Check className="size-4" aria-hidden="true" /> : <Copy className="size-4" aria-hidden="true" />}
    <span aria-live="polite">{copied ? "Copiado" : `Copiar ${label}`}</span>
  </button>;
}

export function CitationBox({ items }: { items: readonly Citation[] }) {
  return <Tabs defaultValue={items[0]?.id} className="gap-3">
    <TabsList variant="line" aria-label="Formato da citação">
      {items.map((item) => <TabsTrigger key={item.id} value={item.id}>{item.label}</TabsTrigger>)}
    </TabsList>
    {items.map((item) => <TabsContent key={item.id} value={item.id} className="grid gap-3">
      <pre className="overflow-x-auto whitespace-pre-wrap break-words border border-border bg-muted p-4 font-mono text-xs leading-6 text-foreground">{item.text}</pre>
      <div><CopyButton text={item.text} label={item.label} /></div>
    </TabsContent>)}
  </Tabs>;
}
