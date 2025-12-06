import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Local dev with Supabase on 127.0.0.1 uses a private IP,
    // so we disable optimization to avoid the private IP restriction.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "54321",
        pathname: "/storage/v1/object/public/club-logos/**",
      },
    ],
  },
};

export default nextConfig;
