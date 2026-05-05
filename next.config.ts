import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Image optimization for listing photos
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
      {
        protocol: "https",
        hostname: "*.vercel-storage.com",
      },
    ],
  },

  // Server external packages for Prisma and bcrypt
  serverExternalPackages: ["@prisma/client", "bcryptjs"],

  // Production optimizations
  poweredByHeader: false,

  // Headers handled by middleware and vercel.json
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-DNS-Prefetch-Control", value: "on" },
        ],
      },
    ];
  },
};

export default nextConfig;
