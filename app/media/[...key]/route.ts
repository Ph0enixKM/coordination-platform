import { getObject } from "@/lib/media";

type Context = { params: Promise<{ key: string[] }> };

/** Serves uploaded blog images. Keys carry a content hash, so they never change. */
export async function GET(_request: Request, { params }: Context) {
  const key = (await params).key.join("/");

  if (key.includes("..")) return new Response("Not found", { status: 404 });

  const object = await getObject(key);

  if (!object) return new Response("Not found", { status: 404 });

  return new Response(object.body, {
    headers: {
      "Content-Type": object.type,
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
      // An SVG opened on its own must not run scripts on our origin.
      "Content-Security-Policy": "default-src 'none'; img-src 'self' data:; style-src 'unsafe-inline'; sandbox",
    },
  });
}
