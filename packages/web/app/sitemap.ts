import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://qa-lab-playground.vercel.app";
  return [
    { url: baseUrl, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/lab`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/lab/refinamento`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/mentoria`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/mentoria/labs/requisitos`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/mentoria/labs/oraculo`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/mentoria/labs/incidente`, changeFrequency: "monthly", priority: 0.7 },
  ];
}
