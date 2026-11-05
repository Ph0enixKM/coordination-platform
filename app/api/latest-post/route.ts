import { NextResponse } from "next/server";
import { getLatestPublishedPost } from "@/lib/blog/posts";

export const dynamic = "force-dynamic";

/**
 * The newest post for the home page, which is static and asks for it in the
 * browser: `{ post }`, `null` while nothing is published. Answers under
 * `next dev`; on Cloudflare worker.ts answers this route itself.
 */
export async function GET() {
  return NextResponse.json({ post: await getLatestPublishedPost() }, { headers: { "Cache-Control": "no-store" } });
}
