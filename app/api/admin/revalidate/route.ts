import { adminRoute } from "@/lib/admin-auth";
import { revalidateBlog } from "@/lib/blog/cache";

/**
 * Marks the cached blog pages stale. Called by the cron in worker.ts when a
 * post scheduled for later comes out; saves in the panel do this themselves.
 */
export const POST = adminRoute(async () => {
  revalidateBlog();

  return new Response(null, { status: 204 });
});
