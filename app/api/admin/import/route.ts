import { NextResponse } from "next/server";
import { adminRoute } from "@/lib/admin-auth";
import { PostError, upsertImportedPost } from "@/lib/blog/posts";

/**
 * Used by `npm run blog:import`: creates the post, or updates the one imported
 * earlier from the same WordPress post (`wpId`), so the import can be re-run.
 */
export const PUT = adminRoute(async (request) => {
  const input = await request.json();

  if (typeof input?.wpId !== "number") {
    return NextResponse.json({ error: "Import wymaga pola wpId." }, { status: 400 });
  }

  try {
    return NextResponse.json({ post: await upsertImportedPost(input) });
  } catch (error) {
    if (error instanceof PostError) return NextResponse.json({ error: error.message }, { status: error.status });
    throw error;
  }
});
