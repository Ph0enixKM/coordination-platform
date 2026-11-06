import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import kvIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/kv-incremental-cache";
import d1NextTagCache from "@opennextjs/cloudflare/overrides/tag-cache/d1-next-tag-cache";

// The free Workers plan gives a request 10 ms of CPU and rendering a page
// with React takes 20-80 ms, so visitors are served rendered pages from KV:
// - static pages are rendered by the build and put in KV on deploy;
// - posts and the /wiedza, /podcasty and /podcast-pno pages are rendered on their first visit and kept
//   until a save in /admin marks them stale (lib/blog/cache.ts), which is
//   recorded in D1 so every location sees it at once.
// Nothing revalidates on a timer, so no queue is needed.
export default defineCloudflareConfig({
  incrementalCache: kvIncrementalCache,
  tagCache: d1NextTagCache,
  enableCacheInterception: true,
});
