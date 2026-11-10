import { SITE_URL } from "@/content/site";

/** Garante URL absoluta: o LinkedIn não resolve caminhos relativos. */
export function absoluteUrl(pathOrUrl: string) {
  return new URL(pathOrUrl, `${SITE_URL}/`).toString();
}

/**
 * Link de compartilhamento no LinkedIn.
 *
 * Com texto, abre o composer já preenchido (`feed/?shareActive=true&text=`), e a
 * URL vai no fim do texto para o LinkedIn gerar o card. Sem texto, usa o
 * `share-offsite`, que só recebe a URL.
 */
export function linkedInShareUrl({ url, text }: { url: string; text?: string }) {
  const target = absoluteUrl(url);
  if (!text?.trim()) return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(target)}`;
  return `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(`${text.trim()}\n\n${target}`)}`;
}
