import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // Вимикає ESLint під час зборки
  },
};

export default nextConfig;
