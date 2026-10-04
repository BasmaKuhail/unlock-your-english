import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    authInterrupts: true,
    cpus: 1,
  },
};

export default nextConfig;