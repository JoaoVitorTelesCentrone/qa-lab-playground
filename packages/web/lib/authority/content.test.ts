import { describe, expect, test } from "bun:test";
import type { BlogPost } from "@/lib/blog-posts";
import { featuredLabs, latestPost, projects } from "./content";

describe("conteúdo da home", () => {
  test("rascunhos de projeto não aparecem", () => {
    expect(projects.every((project) => !project.draft)).toBe(true);
    expect(projects.some((project) => project.slug === "qa-lab-playground")).toBe(true);
  });

  test("labs em destaque apontam para rotas internas e o modo bugado usa ?bug=", () => {
    expect(featuredLabs.length).toBeGreaterThan(0);
    for (const lab of featuredLabs) {
      expect(lab.href.startsWith("/")).toBe(true);
      if (lab.bugHref) expect(lab.bugHref).toMatch(/[?&]bug=/);
    }
  });

  test("último post é o de data mais recente", () => {
    const make = (slug: string, publishedAt?: string) => ({ slug, publishedAt } as BlogPost);
    expect(latestPost([make("a", "2026-01-01"), make("b"), make("c", "2026-03-01")])?.slug).toBe("c");
  });
});
