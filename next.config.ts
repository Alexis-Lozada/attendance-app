import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // Ignora errores de ESLint en Vercel
  },
  typescript: {
    ignoreBuildErrors: true, // Ignora errores TS (como 'any') en el build
  },
};

export default nextConfig;
