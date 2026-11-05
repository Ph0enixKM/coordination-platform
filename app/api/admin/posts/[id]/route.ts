import { NextResponse } from "next/server";
import { adminRoute } from "@/lib/admin-auth";
import { deletePost, getPost, patchPost, PostError, updatePost } from "@/lib/blog/posts";

type Context = { params: Promise<{ id: string }> };

const notFound = () => NextResponse.json({ error: "Nie ma takiego wpisu." }, { status: 404 });

export const GET = adminRoute(async (_request, { params }: Context) => {
  const post = await getPost(Number((await params).id));

  return post ? NextResponse.json({ post }) : notFound();
});

export const PUT = adminRoute(async (request, { params }: Context) => {
  try {
    const post = await updatePost(Number((await params).id), await request.json());

    return post ? NextResponse.json({ post }) : notFound();
  } catch (error) {
    if (error instanceof PostError) return NextResponse.json({ error: error.message }, { status: error.status });
    throw error;
  }
});

export const PATCH = adminRoute(async (request, { params }: Context) => {
  try {
    const post = await patchPost(Number((await params).id), await request.json());

    return post ? NextResponse.json({ post }) : notFound();
  } catch (error) {
    if (error instanceof PostError) return NextResponse.json({ error: error.message }, { status: error.status });
    throw error;
  }
});

export const DELETE = adminRoute(async (_request, { params }: Context) =>
  (await deletePost(Number((await params).id))) ? NextResponse.json({ ok: true }) : notFound(),
);
