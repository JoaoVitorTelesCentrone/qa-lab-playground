import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://qa-lab-playground.vercel.app";

  return [
    { url: baseUrl, changeFrequency: "monthly", priority: 1 },
    { url: `${baseUrl}/datas`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/despesas`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/bdd`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/missoes`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/blog`, changeFrequency: "weekly", priority: 0.7 },
  ];
}
