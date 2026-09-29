import type { MetadataRoute } from "next";
import { LAUNCH_ENVIRONMENT, LAUNCH_LAB } from "@/lib/product/launch";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://qa-lab-playground.vercel.app";
  return [
    { url: baseUrl, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}${LAUNCH_LAB.route}`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}${LAUNCH_ENVIRONMENT.route}`, changeFrequency: "weekly", priority: 0.8 },
  ];
}
