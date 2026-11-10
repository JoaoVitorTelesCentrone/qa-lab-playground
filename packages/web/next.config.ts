import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Embute a flag no build para que servidor, proxy e componentes de cliente
  // leiam o mesmo valor (ver lib/product/features.ts).
  env: { FEATURE_MENTORSHIP: process.env.FEATURE_MENTORSHIP === "true" ? "true" : "false" },
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

export default nextConfig;
