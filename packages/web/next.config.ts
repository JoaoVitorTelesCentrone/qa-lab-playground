import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    const legacyRoutes = [
      "/alvos", "/casos",
      "/cenarios", "/desafios", "/elementos", "/form-bugado",
      "/pdca", "/proximos-passos",
      "/roadmap",
    ];

    return [
      { source: "/desafio", destination: "/playground", permanent: true },
      { source: "/despesas", destination: "/playground/expenseflow", permanent: true },
      ...legacyRoutes.map((source) => ({ source: `${source}/:path*`, destination: "/", permanent: false })),
    ];
  },
};

export default nextConfig;
