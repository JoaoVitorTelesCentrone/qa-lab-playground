// Links de perfil (LinkedIn e GitHub) que aparecem no topo do portfólio.
//
// O campo é texto livre e a pessoa digita de tudo: "github.com/joao",
// "@joao", a URL com rastreio do app. Como o link sai rotulado no header —
// quem clica em "GitHub" espera o GitHub —, normalizamos e conferimos o host
// antes de mostrar. O que não é reconhecido não vira link torto: some.
//
// Módulo puro: usado ao salvar o perfil (client) e ao ler o portfólio (server).

export type ProfileLinkKind = "linkedin" | "github";

const hosts: Record<ProfileLinkKind, string[]> = {
  linkedin: ["linkedin.com"],
  github: ["github.com"],
};

/**
 * Devolve a URL canônica (https, sem query nem barra final) ou "" quando o
 * texto não aponta para o serviço esperado. Aceita "usuario" e "@usuario" como
 * atalho — é como as pessoas escrevem o próprio perfil.
 */
export function normalizeProfileLink(value: string, kind: ProfileLinkKind): string {
  const raw = value.trim().replace(/^@/, "");
  if (!raw) return "";

  const host = hosts[kind][0];
  // Sem barra e sem ponto: é um nome de usuário, não uma URL. O LinkedIn ainda
  // precisa do /in/ para chegar a um perfil.
  const candidate = /^[a-zA-Z0-9][a-zA-Z0-9._-]*$/.test(raw)
    ? `https://${host}/${kind === "linkedin" ? "in/" : ""}${raw}`
    : /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;

  let url: URL;
  try {
    url = new URL(candidate);
  } catch {
    return "";
  }

  const hostname = url.hostname.toLowerCase();
  const allowed = hosts[kind].some((item) => hostname === item || hostname.endsWith(`.${item}`));
  if (!allowed) return "";
  if (url.pathname === "/" || url.pathname === "") return "";

  return `https://${hostname}${url.pathname.replace(/\/+$/, "")}`;
}

/** O que aparece embaixo do botão: "in/joao-centrone", "joao-centrone". */
export function profileLinkHandle(url: string): string {
  return url.replace(/^https?:\/\/(www\.)?[^/]+\//, "").replace(/\/+$/, "");
}
