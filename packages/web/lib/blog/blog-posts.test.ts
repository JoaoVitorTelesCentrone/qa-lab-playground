import { describe, expect, test } from "bun:test";
import { latestPost } from "@/lib/authority/content";
import { getSeriesPosts } from "@/lib/blog-posts";
import { PUBLIC_BLOG_SLUGS } from "@/lib/product/features";
import { allPosts } from "./all-posts";

describe("datas dos posts", () => {
  test("posts editoriais públicos têm data de publicação", () => {
    const editorialPosts = allPosts.filter((post) => post.editorial);
    expect(editorialPosts.length).toBeGreaterThan(0);
    for (const post of editorialPosts) {
      expect(post.publishedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  test("o último artigo usa a maior data de publicação", () => {
    const latest = latestPost(allPosts);
    const newestDate = allPosts
      .map((post) => post.publishedAt)
      .filter((date): date is string => Boolean(date))
      .sort()
      .at(-1);
    expect(latest?.publishedAt).toBe(newestDate);
  });
});

describe("trilogias públicas", () => {
  test("QA do Zero e Bug report estão completas", () => {
    for (const slug of [
      "qa-antes-de-executar-testes",
      "da-regra-ao-caso-de-teste",
      "primeiro-plano-de-testes-enxuto",
      "bug-report-reproduzivel",
      "investigando-bugs-intermitentes",
      "evidencia-util-em-bug-report",
    ]) {
      expect(PUBLIC_BLOG_SLUGS).toContain(slug);
      expect(allPosts.some((post) => post.slug === slug)).toBe(true);
    }

    expect(getSeriesPosts("qa-antes-de-executar-testes")).toHaveLength(3);
    expect(getSeriesPosts("bug-report-reproduzivel")).toHaveLength(3);
  });
});
