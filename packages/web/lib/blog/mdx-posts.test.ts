import { describe, expect, test } from "bun:test";
import { allPosts as posts } from "./all-posts";
import { findMdxPost, loadMdxPosts, toBlogPost } from "./mdx-posts";

describe("posts em MDX", () => {
  test("lê as duas versões do mesmo post e escolhe PT como principal", () => {
    const post = findMdxPost("modo-bugado")!;
    expect(post.defaultLang).toBe("pt");
    expect(Object.keys(post.versions).sort()).toEqual(["en", "pt"]);
    expect(post.versions.en!.title).toStartWith("Bug mode");
    expect(post.versions.pt!.readingMinutes).toBeGreaterThan(0);
  });

  test("todo post tem título, data válida e tags", () => {
    for (const post of loadMdxPosts()) for (const version of Object.values(post.versions)) {
      expect(version!.title.length).toBeGreaterThan(0);
      expect(version!.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(Array.isArray(version!.tags)).toBe(true);
    }
  });

  test("rascunho não entra na lista pública, mas continua acessível pelo carregador", () => {
    const draft = loadMdxPosts().find((post) => post.draft);
    if (!draft) return;
    expect(posts.some((post) => post.slug === draft.slug)).toBe(false);
    expect(toBlogPost(draft).mdx).toEqual({ defaultLang: draft.defaultLang, langs: expect.any(Array), draft: true });
  });
});
