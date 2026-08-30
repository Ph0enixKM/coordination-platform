import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // A second dev server (a preview running next to the main one) points this
  // at its own folder instead of corrupting the running server's .next.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
