import type { MetadataRoute } from "next";
import { SITE_URL } from "@/content/site";
import { LABS_ENABLED } from "@/lib/product/features";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/auth/", "/perfil", "/login", "/cadastro", "/recuperar", ...(LABS_ENABLED ? [] : ["/labs", "/lab", "/trilhas", "/desafio", "/playground", "/conteudo", "/mentoria/labs", "/mentoria/performance", "/boards", "/test-suite", "/api-playground"]) ] },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
