import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
  // A second dev server (a preview running next to the main one) points this
  // at its own folder instead of corrupting the running server's .next.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // Pages the old coordination.pl had that this site no longer does: their
  // addresses are indexed, so they lead somewhere instead of a 404.
  async redirects() {
    return [{ source: "/o-nas", destination: "/", permanent: true }];
  },
};

export default nextConfig;

// Gives `next dev` local versions of the Cloudflare bindings from wrangler.jsonc.
// Kept in memory: Next loads this config twice at startup, and two emulators
// sharing .wrangler/state race over its SQLite files ("database is locked").
// `next dev` keeps the blog in .data/ anyway, not in the emulated D1 or R2.
initOpenNextCloudflareForDev({ persist: false });
