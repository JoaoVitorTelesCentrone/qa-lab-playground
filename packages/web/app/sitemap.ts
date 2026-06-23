import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://qa-lab-playground.vercel.app";

  return [
    { url: baseUrl, changeFrequency: "monthly", priority: 1 },
    { url: `${baseUrl}/playground`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/playground/expenseflow`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/playground/template-bug-report`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/playground/conclusao`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/waitlist`, changeFrequency: "monthly", priority: 0.7 },
  ];
}
