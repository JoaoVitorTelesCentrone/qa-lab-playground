import { describe, expect, test } from "bun:test";
import { toolGuideCategories, toolGuides } from "./tool-guides";

describe("guias de ferramentas", () => {
  test("slugs são únicos e seguros para URL", () => {
    const slugs = toolGuides.map((guide) => guide.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) expect(slug).toMatch(/^[a-z0-9-]+$/);
  });

  test("toda ferramenta tem documentação e vídeo, e a categoria existe", () => {
    for (const guide of toolGuides) {
      expect(guide.docs.length).toBeGreaterThan(0);
      expect(guide.videos.length).toBeGreaterThan(0);
      expect(toolGuideCategories[guide.category]).toBeDefined();
    }
  });

  test("ids do YouTube têm o formato certo para o tipo", () => {
    for (const video of toolGuides.flatMap((guide) => guide.videos)) {
      if (video.kind === "video") expect(video.youtubeId).toMatch(/^[A-Za-z0-9_-]{11}$/);
      else expect(video.youtubeId).toMatch(/^PL[A-Za-z0-9_-]+$/);
    }
  });

  test("links externos usam https", () => {
    for (const link of toolGuides.flatMap((guide) => [...guide.docs, ...guide.courses])) {
      expect(link.url.startsWith("https://")).toBe(true);
    }
  });
});
