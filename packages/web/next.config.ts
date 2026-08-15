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
      // Old practice/challenge modules → current Playground.
      { source: "/desafio", destination: "/playground", permanent: true },
      { source: "/desafios/:path*", destination: "/playground", permanent: true },
      { source: "/missoes/:path*", destination: "/playground", permanent: true },
      { source: "/datas/:path*", destination: "/playground", permanent: true },
      { source: "/despesas", destination: "/playground/expenseflow", permanent: true },
      // BDD work now lives inside Test Design Studio.
      { source: "/bdd/:path*", destination: "/lab/studio", permanent: true },
      ...legacyRoutes.map((source) => ({ source: `${source}/:path*`, destination: "/", permanent: false })),
    ];
  },
};

export default nextConfig;
