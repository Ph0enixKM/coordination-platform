import { NextResponse } from "next/server";
import { adminRoute } from "@/lib/admin-auth";
import { createPost, listPosts, PostError } from "@/lib/blog/posts";

export const GET = adminRoute(async () => NextResponse.json({ posts: await listPosts() }));

export const POST = adminRoute(async (request) => {
  try {
    return NextResponse.json({ post: await createPost(await request.json()) }, { status: 201 });
  } catch (error) {
    if (error instanceof PostError) return NextResponse.json({ error: error.message }, { status: error.status });
    throw error;
  }
});
