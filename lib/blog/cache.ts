import { revalidatePath } from "next/cache";

/**
 * Posts and the /wiedza pages are rendered once and then served from the page
 * cache (KV, see open-next.config.ts) until this marks them stale; each is
 * rendered again on its next visit. Every post page lists the newest posts,
 * so a change to any visible post reaches all of them.
 *
 * Called after a change visitors can see, and by the cron in worker.ts when a
 * post scheduled for later comes out.
 */
export function revalidateBlog() {
  revalidatePath("/[slug]", "page");
  revalidatePath("/wiedza/[[...page]]", "page");
}
