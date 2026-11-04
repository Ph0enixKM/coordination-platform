import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

// Static pages are prerendered at build time; the blog (/wiedza, posts, the
// sitemap) renders on every request from D1 and is never cached, and the home
// page on every request from the in-memory copy in lib/blog/latest.ts. Nothing
// revalidates, so the cache can live in the Worker's static assets. Adding ISR
// (`revalidate`) later means switching this to an R2 cache.
export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
  enableCacheInterception: true,
});
