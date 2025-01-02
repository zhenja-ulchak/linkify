import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // Вимикає ESLint під час зборки
  },
  async headers() {
    return [
      {
        // matching all API routes
        source: "/api/:path*", // Усі маршрути API
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" }, // Змініть на конкретний домен за необхідності
          { key: "Access-Control-Allow-Methods", value: "GET, OPTIONS, PATCH, DELETE, POST, PUT" },
          { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
