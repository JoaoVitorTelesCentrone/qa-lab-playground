import type { MetadataRoute } from "next";
import { posts } from "@/lib/blog-posts";
import { liveApps } from "@/lib/product/apps";
import { labs } from "@/lib/playground/catalog";
import { learningTracks, trackHasReleasedLab } from "@/lib/product/tracks";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://qa-lab-playground.vercel.app";

  // Superfície pública do produto: home, catálogo de Labs, ambientes de
  // prática e conteúdo. Rotas de conta e de progresso ficam de fora.
  return [
    { url: baseUrl, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/labs`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/labs/regressao`, changeFrequency: "monthly", priority: 0.6 },
    ...learningTracks.filter(trackHasReleasedLab).map((track) => ({ url: `${baseUrl}/trilhas/${track.slug}`, changeFrequency: "monthly" as const, priority: 0.8 })),
    { url: `${baseUrl}/blog`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/pesquisa`, changeFrequency: "weekly", priority: 0.8 },
    ...liveApps.map((app) => ({ url: `${baseUrl}${app.route}`, changeFrequency: "monthly" as const, priority: 0.8 })),
    ...labs.filter((lab) => lab.status === "liberado").map((lab) => ({ url: `${baseUrl}/labs/${lab.number}`, changeFrequency: "monthly" as const, priority: 0.6 })),
    ...posts.map((post) => ({ url: `${baseUrl}/blog/${post.slug}`, changeFrequency: "monthly" as const, priority: 0.7 })),
  ];
}
