import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Vercel will check types separately
    ignoreBuildErrors: false,
  },
  eslint: {
    // Vercel will lint separately
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;
