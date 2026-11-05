import { NextResponse, type NextRequest } from "next/server";
import { revalidateLatestPost } from "@/lib/blog/latest";

export const dynamic = "force-dynamic";

const headers = { "Cache-Control": "no-store" };

/**
 * Asked by the home page when the post it was rendered with came from a copy
 * older than 12 hours (see lib/blog/latest.ts). `id` and `updated` name the
 * post the page shows, none when it shows none: 204 means it is still the
 * newest, otherwise the body is `{ post }`, `null` when no post is published.
 */
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;

  let post;
  try {
    post = await revalidateLatestPost();
  } catch (error) {
    console.error("Revalidating the latest post failed:", error);

    return new NextResponse(null, { status: 503, headers });
  }

  const unchanged = post
    ? params.get("id") === String(post.id) && params.get("updated") === post.updatedAt
    : !params.has("id");

  if (unchanged) return new NextResponse(null, { status: 204, headers });

  return NextResponse.json({ post }, { headers });
}
