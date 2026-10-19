export type LessonMedia =
  | { kind: "embed"; src: string; url: string; provider: "YouTube" | "Vimeo" }
  | { kind: "file"; src: string; url: string; provider: "Arquivo de vídeo" }
  | { kind: "external"; url: string; provider: "Player externo" };

/** Only known providers become iframes. Other web URLs remain ordinary links. */
export function resolveLessonMedia(value?: string | null): LessonMedia | null {
  if (!value?.trim()) return null;
  let url: URL;
  try { url = new URL(value.trim()); } catch { return null; }
  if (!["https:", "http:"].includes(url.protocol) || url.username || url.password) return null;
  const host = url.hostname.toLowerCase();
  const path = url.pathname.split("/").filter(Boolean);
  if (["youtube.com", "www.youtube.com", "m.youtube.com", "youtube-nocookie.com", "www.youtube-nocookie.com", "youtu.be", "www.youtu.be"].includes(host)) {
    const id = host.endsWith("youtu.be") ? path[0] : url.searchParams.get("v") ?? (["embed", "shorts", "live"].includes(path[0]) ? path[1] : null);
    if (id && /^[a-zA-Z0-9_-]{11}$/.test(id)) return { kind: "embed", src: `https://www.youtube-nocookie.com/embed/${id}`, url: url.href, provider: "YouTube" };
  }
  if (["vimeo.com", "www.vimeo.com", "player.vimeo.com"].includes(host)) {
    const id = path[0] === "video" ? path[1] : path[0];
    if (id && /^\d+$/.test(id)) {
      const embed = new URL(`https://player.vimeo.com/video/${id}`);
      const hash = url.searchParams.get("h") ?? (path[0] !== "video" ? path[1] : undefined);
      if (hash && /^[a-zA-Z0-9]+$/.test(hash)) embed.searchParams.set("h", hash);
      return { kind: "embed", src: embed.href, url: url.href, provider: "Vimeo" };
    }
  }
  if (/\.(mp4|webm|ogv)$/i.test(url.pathname)) return { kind: "file", src: url.href, url: url.href, provider: "Arquivo de vídeo" };
  return { kind: "external", url: url.href, provider: "Player externo" };
}
