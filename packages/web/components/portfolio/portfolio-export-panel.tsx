"use client";

import { useId, useRef, useState } from "react";
import { Check, Copy, Download, Github, Linkedin, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LINKEDIN_POST_LIMIT, type PortfolioExport } from "@/lib/product/portfolio-export";

type Preview = { github: string; linkedin: string; portfolio: PortfolioExport };

function download(filename: string, content: string, type: string) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function PortfolioExportPanel({ username, enabled = true }: { username: string; enabled?: boolean }) {
  const id = useId();
  const [preview, setPreview] = useState<Preview | null>(null);
  const [format, setFormat] = useState<"github" | "linkedin">("github");
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [open, setOpen] = useState(false);
  const textarea = useRef<HTMLTextAreaElement>(null);
  const endpoint = `/api/v1/portfolio/${encodeURIComponent(username)}/export`;
  const count = Array.from(text).length;
  const tooLong = format === "linkedin" && count > LINKEDIN_POST_LIMIT;

  async function load() {
    setBusy(true); setError(""); setStatus("");
    try {
      const response = await fetch(endpoint, { cache: "no-store" });
      const result = await response.json();
      if (!response.ok || !result.data) throw new Error(result.error?.message || "Não foi possível carregar o portfólio.");
      setPreview(result.data);
      setText(result.data[format]);
      setOpen(true);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Não foi possível carregar. Tente novamente.");
    } finally { setBusy(false); }
  }

  async function copy() {
    setStatus("");
    try {
      await navigator.clipboard.writeText(text);
      setStatus("Texto copiado.");
    } catch {
      textarea.current?.focus();
      textarea.current?.select();
      setStatus("Selecionei o texto. Use Ctrl+C ou o comando Copiar do seu dispositivo.");
    }
  }

  return <section className="min-w-0 border-t border-border pt-5" aria-labelledby={`${id}-title`}>
    <h3 id={`${id}-title`} className="text-sm font-semibold">Levar para LinkedIn e GitHub</h3>
    <p className="mt-2 text-sm leading-6 text-muted-foreground">
      Exporte seu perfil, projetos e cases publicados. Revise o texto antes de compartilhar.
    </p>
    {!enabled && <p className="mt-2 text-sm text-muted-foreground">Defina seu endereço e publique o portfólio para gerar os materiais da versão pública.</p>}
    <Button type="button" variant="outline" size="sm" className="mt-3" disabled={!enabled || busy} aria-expanded={enabled && open} aria-controls={`${id}-content`}
      onClick={() => { if (open) setOpen(false); else void load(); }}>
      {busy ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <Download className="size-4" aria-hidden="true" />}
      {busy ? "Preparando exportação…" : open ? "Fechar exportação" : "Preparar exportação"}
    </Button>
    {error && <p role="alert" className="mt-3 text-sm text-destructive">{error}</p>}
    {enabled && open && preview && <div id={`${id}-content`} className="mt-5 min-w-0">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Formato de exportação">
        {(["github", "linkedin"] as const).map((value) => <Button key={value} type="button" size="sm" variant={format === value ? "default" : "outline"} aria-pressed={format === value}
          onClick={() => { setFormat(value); setText(preview[value]); setStatus(""); }}>
          {value === "github" ? <Github className="size-4" aria-hidden="true" /> : <Linkedin className="size-4" aria-hidden="true" />}
          {value === "github" ? "GitHub README" : "Post para LinkedIn"}
        </Button>)}
      </div>
      <p id={`${id}-help`} className="mt-3 text-sm leading-6 text-muted-foreground">
        {format === "github"
          ? "Baixe o README.md e adicione ao repositório do seu portfólio. Para exibir no perfil do GitHub, use um repositório público com o mesmo nome do seu usuário e coloque o README.md na raiz."
          : "Edite o post abaixo, copie o texto e cole em uma nova publicação no LinkedIn. Você também pode adicionar o link do portfólio à seção Destaques do seu perfil."}
      </p>
      <label htmlFor={`${id}-text`} className="mt-4 block text-xs font-medium">{format === "github" ? "Conteúdo do README" : "Texto da publicação"}</label>
      <textarea ref={textarea} id={`${id}-text`} aria-describedby={`${id}-help${tooLong ? ` ${id}-limit` : ""}`} aria-invalid={tooLong}
        value={text} readOnly={format === "github"} onChange={(event) => { setText(event.target.value); setStatus(""); }}
        className="field mt-2 min-h-64 w-full min-w-0 resize-y text-sm leading-6" rows={12} />
      {format === "linkedin" && <p id={`${id}-limit`} className={`mt-1 text-xs ${tooLong ? "text-destructive" : "text-muted-foreground"}`}>
        {count}/{LINKEDIN_POST_LIMIT} caracteres recomendados{tooLong ? ". Reduza o texto antes de copiar ou baixar." : ""}
      </p>}
      <div className="mt-3 flex flex-wrap gap-2">
        <Button type="button" size="sm" variant="outline" disabled={tooLong || !text.trim()} onClick={copy}><Copy className="size-4" aria-hidden="true" /> Copiar texto</Button>
        <Button type="button" size="sm" disabled={tooLong || !text.trim()} onClick={() => {
          download(format === "github" ? "README.md" : "linkedin.txt", text, format === "github" ? "text/markdown;charset=utf-8" : "text/plain;charset=utf-8");
          setStatus("Arquivo preparado para download.");
        }}><Download className="size-4" aria-hidden="true" /> {format === "github" ? "Baixar README.md" : "Baixar texto"}</Button>
      </div>
      <p role="status" className="mt-2 min-h-5 text-xs text-muted-foreground">{status && <span className="inline-flex items-center gap-1"><Check className="size-3" aria-hidden="true" />{status}</span>}</p>
      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-3 text-sm">
        <button type="button" className="underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-ring" onClick={() => {
          download("portfolio.json", JSON.stringify(preview.portfolio, null, 2), "application/json;charset=utf-8"); setStatus("JSON preparado para download.");
        }}>Baixar portfólio em JSON</button>
        <a href={`${endpoint}?format=html`} className="underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-ring">Baixar versão para impressão</a>
      </div>
      <p className="mt-3 text-xs leading-5 text-muted-foreground">Abra o arquivo HTML no navegador e use Imprimir → Salvar como PDF. Os links de cases e projetos abrem os anexos atualizados enquanto a publicação estiver disponível.</p>
    </div>}
  </section>;
}
