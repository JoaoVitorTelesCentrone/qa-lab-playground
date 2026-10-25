import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
      { source: "/desafio", destination: "/lab", permanent: true },
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
