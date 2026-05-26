import type { NextConfig } from "next";
import withPWA from "next-pwa";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
    ],
  },
  turbopack: {},
};

export default withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  scope: "/",
  disable: process.env.NODE_ENV === "development",
  publicExclusions: ["/api/*"],
  fallbacks: {
    document: "/offline.html",
  },
})(nextConfig);
