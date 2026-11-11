import type { MetadataRoute } from "next";
import { allPosts as posts } from "@/lib/blog/all-posts";
import { qaTools } from "@/lib/qa-tools";
import { toolGuides } from "@/lib/tool-guides";
import { isMentorshipPath, MENTORSHIP_ENABLED } from "@/lib/product/features";

// Cursos que os guias de ferramenta recomendam; sem repetir a mesma trilha.
const trackHrefs = [...new Set(toolGuides.flatMap((guide) => guide.internalCourse ? [guide.internalCourse.href] : []))];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://qa-lab-playground.vercel.app";
  const entries: MetadataRoute.Sitemap = [
    { url: baseUrl, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/lab`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/lab/refinamento`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/mentoria`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/mentoria/labs/requisitos`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/mentoria/labs/oraculo`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/mentoria/labs/incidente`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/sobre`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/desafio`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/blog`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/conteudo`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/labs`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/trilhas`, changeFrequency: "monthly", priority: 0.7 },
    ...trackHrefs.map((href) => ({ url: `${baseUrl}${href}`, changeFrequency: "monthly" as const, priority: 0.6 })),
    { url: `${baseUrl}/ferramentas`, changeFrequency: "monthly", priority: 0.7 },
    ...toolGuides.map((guide) => ({ url: `${baseUrl}/ferramentas/${guide.slug}`, changeFrequency: "monthly" as const, priority: 0.6 })),
    { url: `${baseUrl}/lab/ferramentas`, changeFrequency: "monthly", priority: 0.7 },
    ...qaTools.map((tool) => ({ url: `${baseUrl}/lab/ferramentas/${tool.id}`, changeFrequency: "monthly" as const, priority: 0.5 })),
    // Versões de um post MDX em outro idioma: /blog/<slug>/<lang>.
    ...posts.flatMap((post) => (post.mdx?.langs ?? []).filter((lang) => lang !== post.mdx?.defaultLang)
      .map((lang) => ({ url: `${baseUrl}/blog/${post.slug}/${lang}`, changeFrequency: "monthly" as const, priority: 0.6 }))),
    ...posts.map((post) => {
      const lastModified = post.updatedAt;
      return {
        url: `${baseUrl}/blog/${post.slug}`,
        ...(lastModified ? { lastModified: new Date(`${lastModified}T00:00:00Z`) } : {}),
        changeFrequency: "monthly" as const,
        priority: 0.6,
      };
    }),
  ];
  // Com a mentoria desligada, o sitemap não anuncia rotas que respondem 404.
  return MENTORSHIP_ENABLED ? entries : entries.filter((entry) => !isMentorshipPath(new URL(entry.url).pathname));
}
