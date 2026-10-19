import { describe, expect, it } from "bun:test";
import { resolveLessonMedia } from "./lesson-media";

describe("vídeo das aulas", () => {
  it("converte URLs de compartilhamento do YouTube em embed", () => {
    for (const url of ["https://youtu.be/abcdefghijk?t=20", "https://www.youtube.com/watch?v=abcdefghijk", "https://www.youtube.com/shorts/abcdefghijk", "https://www.youtube.com/embed/abcdefghijk"]) {
      expect(resolveLessonMedia(url)?.kind).toBe("embed");
      expect(resolveLessonMedia(url)).toHaveProperty("src", "https://www.youtube-nocookie.com/embed/abcdefghijk");
    }
  });
  it("preserva o hash dos vídeos privados do Vimeo", () => {
    expect(resolveLessonMedia("https://vimeo.com/123456789/abc123")).toHaveProperty("src", "https://player.vimeo.com/video/123456789?h=abc123");
    expect(resolveLessonMedia("https://player.vimeo.com/video/123456789?h=abc123")).toHaveProperty("src", "https://player.vimeo.com/video/123456789?h=abc123");
  });
  it("preserva parâmetros de arquivos assinados e mantém players desconhecidos como links", () => {
    const url = "https://media.example.com/aula.mp4?token=123";
    expect(resolveLessonMedia(url)).toMatchObject({ kind: "file", src: url });
    expect(resolveLessonMedia("https://youtube.com.example.org/watch?v=abcdefghijk")?.kind).toBe("external");
    expect(resolveLessonMedia("https://example.org/player/123")?.kind).toBe("external");
  });
  it("rejeita links vazios, malformados, com credenciais ou protocolos executáveis", () => {
    for (const value of [null, "", "texto", "javascript:alert(1)", "data:text/html,hi", "https://user:pass@example.org/video.mp4"]) expect(resolveLessonMedia(value)).toBeNull();
  });
});
