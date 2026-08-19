"use client";

// Campo de evidência: um texto livre e os arquivos que provam o que ele diz.
//
// O upload acontece na hora em que o arquivo é escolhido, não no envio do
// formulário. Assim o aluno vê o que já subiu, remove o que errou e não fica
// olhando para uma barra parada no momento em que clica em "Entregar" — que é
// justamente quando um upload de vídeo travaria a entrega inteira.
//
// Cada arquivo tem estado próprio: subindo, pronto ou falhou. Um erro em um
// anexo não derruba os outros nem o texto já escrito.

import { useId, useRef, useState } from "react";
import { FileText, Loader2, Paperclip, Upload, X } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { ACCEPT, MAX_FILE_BYTES, MAX_FILES, formatBytes, rejectionReason } from "@/lib/product/evidence-limits";
import type { Attachment } from "@/lib/product/journey";

type Pending = { key: string; name: string; size: number; error?: string };

export function EvidenceField({
  labSlug,
  value,
  attachments,
  onValueChange,
  onAttachmentsChange,
  error,
  disabled,
}: {
  labSlug: string;
  value: string;
  attachments: Attachment[];
  onValueChange: (value: string) => void;
  onAttachmentsChange: (attachments: Attachment[]) => void;
  error?: string;
  disabled?: boolean;
}) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState<Pending[]>([]);
  const [dragging, setDragging] = useState(false);

  const total = attachments.length + pending.filter((item) => !item.error).length;
  const full = total >= MAX_FILES;

  async function upload(files: File[], current: Attachment[]) {
    let saved = current;
    const room = MAX_FILES - total;
    if (room <= 0) return;

    for (const file of files.slice(0, room)) {
      const key = `${file.name}-${file.size}-${Math.random()}`;
      // Barra aqui o que a rota também barra: evita gastar o upload de um vídeo
      // de 40MB só para receber 413 no fim.
      const reason = rejectionReason(file);
      if (reason) {
        setPending((items) => [...items, { key, name: file.name, size: file.size, error: reason }]);
        continue;
      }

      setPending((items) => [...items, { key, name: file.name, size: file.size }]);
      const body = new FormData();
      body.append("file", file);
      body.append("labSlug", labSlug);

      try {
        const response = await fetch("/api/v1/evidence/upload", { method: "POST", body });
        const payload = await response.json().catch(() => null);
        if (!response.ok) {
          const message = payload?.error?.message ?? "Falha no upload.";
          setPending((items) => items.map((item) => (item.key === key ? { ...item, error: message } : item)));
          continue;
        }
        setPending((items) => items.filter((item) => item.key !== key));
        // Acumula na lista local: dois arquivos soltos ao mesmo tempo subiriam
        // em sequência e o segundo sobrescreveria o primeiro se lesse a prop.
        saved = [...saved, payload.data as Attachment];
        onAttachmentsChange(saved);
      } catch {
        setPending((items) => items.map((item) => (item.key === key ? { ...item, error: "Sem conexão com o servidor." } : item)));
      }
    }
  }

  async function remove(file: Attachment) {
    onAttachmentsChange(attachments.filter((item) => item.path !== file.path));
    // O arquivo já está no Storage, então some de lá também — senão cada troca
    // de anexo deixaria lixo pago no bucket.
    await fetch(`/api/v1/evidence/upload?path=${encodeURIComponent(file.path)}`, { method: "DELETE" }).catch(() => null);
  }

  return (
    <div className="grid gap-3">
      <Textarea
        value={value}
        onChange={(event) => onValueChange(event.target.value)}
        disabled={disabled}
        aria-invalid={Boolean(error)}
        aria-describedby={`${inputId}-hint`}
        placeholder={"O que você testou, o que aconteceu e como reproduzir.\nCole links, escreva passos, anexe print ou vídeo — do jeito que ficar claro."}
        className="min-h-40"
      />

      <div
        onDragOver={(event) => { event.preventDefault(); if (!disabled && !full) setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          if (disabled || full) return;
          void upload([...event.dataTransfer.files], attachments);
        }}
        className={`rounded-md border border-dashed p-4 text-center transition ${dragging ? "border-primary bg-primary/[0.04]" : "border-border"} ${full ? "opacity-60" : ""}`}
      >
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          multiple
          accept={ACCEPT}
          className="sr-only"
          disabled={disabled || full}
          onChange={(event) => {
            void upload([...(event.target.files ?? [])], attachments);
            // Zera para que escolher o mesmo arquivo de novo dispare o change.
            event.target.value = "";
          }}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={disabled || full}
          className="inline-flex items-center gap-2 rounded-md px-2 py-1 text-sm font-medium text-primary hover:underline focus-visible:ring-2 focus-visible:ring-ring/40 disabled:cursor-not-allowed disabled:text-muted-foreground disabled:no-underline"
        >
          <Upload className="size-4" aria-hidden="true" />
          {full ? `Limite de ${MAX_FILES} arquivos atingido` : "Escolher arquivos"}
        </button>
        <p id={`${inputId}-hint`} className="mt-1 text-xs text-muted-foreground">
          ou arraste aqui · imagem, vídeo (mp4/webm) ou PDF · até {formatBytes(MAX_FILE_BYTES)} cada
        </p>
      </div>

      {(attachments.length > 0 || pending.length > 0) && (
        <ul className="grid gap-2" aria-label="Anexos da evidência">
          {attachments.map((file) => (
            <li key={file.path} className="flex items-center gap-3 rounded-md border border-border p-2.5">
              <Preview file={file} />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm">{file.name}</span>
                <span className="block text-xs text-muted-foreground">{formatBytes(file.size)}</span>
              </span>
              <button
                type="button"
                onClick={() => void remove(file)}
                disabled={disabled}
                aria-label={`Remover ${file.name}`}
                className="rounded-md p-1.5 text-muted-foreground transition hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/40"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </li>
          ))}

          {pending.map((item) => (
            <li key={item.key} className={`flex items-center gap-3 rounded-md border p-2.5 ${item.error ? "border-destructive/40" : "border-border"}`}>
              {item.error
                ? <Paperclip className="size-4 shrink-0 text-destructive" aria-hidden="true" />
                : <Loader2 className="size-4 shrink-0 animate-spin text-muted-foreground" aria-hidden="true" />}
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm">{item.name}</span>
                <span className={`block text-xs ${item.error ? "text-destructive" : "text-muted-foreground"}`}>
                  {item.error ?? `Enviando… ${formatBytes(item.size)}`}
                </span>
              </span>
              {item.error && (
                <button
                  type="button"
                  onClick={() => setPending((items) => items.filter((entry) => entry.key !== item.key))}
                  aria-label={`Descartar ${item.name}`}
                  className="rounded-md p-1.5 text-muted-foreground transition hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/40"
                >
                  <X className="size-4" aria-hidden="true" />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* aria-live para o leitor de tela receber o erro sem precisar reencontrar o campo. */}
      <p role="alert" aria-live="polite" className="min-h-4 text-xs text-destructive">{error ?? ""}</p>
    </div>
  );
}

function Preview({ file }: { file: Attachment }) {
  if (file.type.startsWith("image/")) {
    // eslint-disable-next-line @next/next/no-img-element -- anexo do aluno, fora do domínio otimizado
    return <img src={file.url} alt="" className="size-10 shrink-0 rounded object-cover" />;
  }
  if (file.type.startsWith("video/")) {
    return <video src={file.url} className="size-10 shrink-0 rounded object-cover" muted playsInline preload="metadata" />;
  }
  return <FileText className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />;
}
