import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    const legacyRoutes = [
      "/alvos", "/api-playground", "/casos",
      "/cenarios", "/desafios", "/elementos", "/form-bugado",
      "/pdca", "/proximos-passos",
      "/roadmap", "/waitlist",
    ];

    return [
      { source: "/desafio", destination: "/despesas", permanent: true },
      ...legacyRoutes.map((source) => ({ source: `${source}/:path*`, destination: "/", permanent: false })),
    ];
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
