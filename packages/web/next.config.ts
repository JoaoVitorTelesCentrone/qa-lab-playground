import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  // Embute a flag no build para que servidor, proxy e componentes de cliente
  // leiam o mesmo valor (ver lib/product/features.ts).
  env: {
    FEATURE_MENTORSHIP: process.env.FEATURE_MENTORSHIP === "true" ? "true" : "false",
    FEATURE_ACCOUNTS: process.env.FEATURE_ACCOUNTS === "true" ? "true" : "false",
    FEATURE_LABS: process.env.FEATURE_LABS === "true" ? "true" : "false",
    FEATURE_FULL_BLOG: process.env.FEATURE_FULL_BLOG === "true" ? "true" : "false",
  },
  // Os posts em MDX são lidos do disco (metadados e tempo de leitura): garante
  // que content/blog vá junto para as funções serverless.
  outputFileTracingIncludes: { "/**": ["./content/blog/**/*"] },
  async redirects() {
    // Legacy routes from earlier phases of the product — sent to "/" since they
    // have no direct equivalent in the current app.
    const legacyRoutes = [
      "/alvos", "/casos",
      "/cenarios", "/elementos", "/form-bugado",
      "/pdca", "/proximos-passos",
      "/roadmap",
    ];

    return [
      // Conteúdo tem uma área própria; links legados da mentoria continuam válidos.
      { source: "/mentoria/conteudo", destination: "/conteudo", permanent: true },
      { source: "/mentoria/conteudo/:path*", destination: "/conteudo/:path*", permanent: true },
      // Legacy practice URLs go to the current Lab entry point.
      // /desafio deixou de ser rota legada: agora é o desafio da semana.
      { source: "/desafios/:path*", destination: "/lab", permanent: true },
      { source: "/missoes/:path*", destination: "/lab", permanent: true },
      { source: "/datas/:path*", destination: "/lab", permanent: true },
      { source: "/despesas", destination: "/conteudo/broto", permanent: true },
      { source: "/financas/:path*", destination: "/conteudo/broto", permanent: false },
      { source: "/trilhas/financas-do-zero", destination: "/trilhas/broto-na-pratica", permanent: false },
      { source: "/playground/expenseflow/:path*", destination: "/conteudo/broto", permanent: true },
      { source: "/playground/entregas/:path*", destination: "/lab", permanent: true },
      { source: "/playground/conclusao/:path*", destination: "/lab", permanent: true },
      { source: "/portfolio/:username/expenseflow", destination: "/portfolio/:username", permanent: true },
      ...legacyRoutes.map((source) => ({ source: `${source}/:path*`, destination: "/", permanent: false })),
    ];
  },
};

// Posts em content/blog/<slug>/<lang>.mdx. Plugins por nome (string) para
// funcionar com o Turbopack: frontmatter sai do corpo, gfm traz tabelas.
const withMDX = createMDX({
  options: { remarkPlugins: ["remark-frontmatter", "remark-gfm"] },
});

export default withMDX(nextConfig);
