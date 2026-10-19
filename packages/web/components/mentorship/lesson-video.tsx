"use client";

import { useState } from "react";
import { ExternalLink, Video } from "lucide-react";
import { resolveLessonMedia } from "@/lib/mentorship/lesson-media";

export function LessonVideo({ url, title }: { url: string; title: string }) {
  const media = resolveLessonMedia(url);
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  if (!media) return <p role="alert" className="text-sm text-coral">O link do vídeo é inválido. Confira a publicação desta aula.</p>;
  const fallback = media.kind === "external" || failedUrl === url;
  return <div>
    {fallback ? <div className="flex min-h-48 flex-col items-center justify-center gap-3 border border-white/15 bg-[#171B21] p-6 text-center">
      <Video aria-hidden="true" className="size-7 text-mint" />
      <p className="text-sm leading-6 text-[#C8CFD7]">{failedUrl === url ? "O vídeo não carregou aqui. Tente abrir na origem." : "Este vídeo está disponível no player da plataforma de origem."}</p>
      <a href={media.url} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-2 bg-mint px-4 text-sm font-bold text-[#101319] hover:bg-neon">Assistir vídeo<ExternalLink aria-hidden="true" className="size-4" /></a>
    </div> : media.kind === "embed" ? <iframe key={media.src} src={media.src} title={`Vídeo: ${title}`} className="aspect-video w-full border-0 bg-black" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" />
      : media.kind === "file" ? <video key={media.src} src={media.src} controls playsInline preload="metadata" aria-label={`Vídeo: ${title}`} onError={() => setFailedUrl(url)} className="aspect-video w-full bg-black">Seu navegador não reproduz este vídeo. <a href={media.url}>Abrir arquivo</a></video> : null}
    {!fallback && <a href={media.url} target="_blank" rel="noreferrer" className="mt-3 inline-flex min-h-10 items-center gap-1 text-xs font-semibold text-[#AAB2BC] hover:text-mint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint">Abrir na origem<ExternalLink aria-hidden="true" className="size-3" /></a>}
  </div>;
}
