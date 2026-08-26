// Limites dos anexos de evidência.
//
// Módulo puro e sem dependência de servidor: o formulário importa daqui para
// barrar o arquivo antes de gastar upload, e a rota importa daqui para barrar
// de verdade. Uma lista só, para as duas pontas não divergirem.

export const MAX_FILE_BYTES = 10 * 1024 * 1024;
export const MAX_FILES = 6;

export const ALLOWED_TYPES = [
  "image/png",
  "image/jpeg",
  "image/gif",
  "image/webp",
  "video/mp4",
  "video/webm",
  "application/pdf",
] as const;

/** `accept` do input de arquivo, na mesma fonte da validação. */
export const ACCEPT = ALLOWED_TYPES.join(",");

export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  const mb = bytes / (1024 * 1024);
  if (mb >= 1) return `${mb.toFixed(1).replace(".", ",")} MB`;
  return `${Math.round(bytes / 1024)} KB`;
}

/** Motivo pelo qual o arquivo não serve, ou null quando serve. */
export function rejectionReason(file: { size: number; type: string }): string | null {
  if (file.size === 0) return "O arquivo está vazio.";
  if (file.size > MAX_FILE_BYTES) return `Tem ${formatBytes(file.size)} e o limite é ${formatBytes(MAX_FILE_BYTES)}.`;
  if (!(ALLOWED_TYPES as readonly string[]).includes(file.type)) return "Formato não aceito: use imagem, vídeo (mp4/webm) ou PDF.";
  return null;
}
