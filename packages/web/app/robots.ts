import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://qa-lab-playground.vercel.app";

  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/auth/", "/lab", "/perfil", "/login", "/cadastro", "/recuperar"] },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
