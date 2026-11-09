import { describe, expect, test } from "bun:test";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { mentorshipPathV2 } from "./mentorship/path-v2";
import { findToolGuide, guidesForModule, toolGuideCategories, toolGuides } from "./tool-guides";

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

  test("guias por módulo resolvem e apontam para módulos que existem", () => {
    const moduleIds = new Set(mentorshipPathV2.map((item) => item.id));
    for (const moduleId of moduleIds) {
      for (const guide of guidesForModule(moduleId)) expect(findToolGuide(guide.slug)).toBe(guide);
    }
    const covered = [...moduleIds].flatMap((id) => guidesForModule(id).map((guide) => guide.slug));
    expect(new Set(covered).size).toBe(toolGuides.length);
  });

  test("curso interno aponta para uma rota que existe no app", () => {
    for (const guide of toolGuides) {
      if (!guide.internalCourse) continue;
      const dir = join(import.meta.dir, "..", "app", ...guide.internalCourse.href.split("/").filter(Boolean));
      expect(existsSync(join(dir, "page.tsx"))).toBe(true);
    }
  });

  test("links externos usam https", () => {
    for (const link of toolGuides.flatMap((guide) => [...guide.docs, ...guide.courses])) {
      expect(link.url.startsWith("https://")).toBe(true);
    }
  });
});
