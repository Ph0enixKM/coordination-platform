/**
 * How a stored image is answered. Shared by the Worker entry (`worker.ts`,
 * production: straight from KV, without starting Next.js) and
 * `app/media/[...key]/route.ts` (`next dev`: from `.data/media`).
 *
 * Imports nothing at runtime, so the Worker entry can bundle it on its own.
 */

export type MediaMetadata = { contentType: string };

/** The slice of a KV namespace binding that reading an image needs. */
export interface MediaStore {
  getWithMetadata<M>(
    key: string,
    options: { type: "stream"; cacheTtl?: number },
  ): Promise<{ value: ReadableStream | null; metadata: M | null }>;
}

/**
 * How long KV keeps an image cached at the edge, in seconds (a week). Worker
 * responses skip the CDN cache, so this is what keeps hot keys close; keys
 * carry a content hash and never change.
 */
const EDGE_CACHE_TTL = 7 * 24 * 60 * 60;

/** Keys look like `2026/11/name-0123456789.webp`; anything climbing out of that is refused. */
export const isMediaKey = (key: string) => key !== "" && !key.includes("..");

export async function readMedia(store: MediaStore, key: string): Promise<{ body: ReadableStream; type: string } | null> {
  const { value, metadata } = await store.getWithMetadata<MediaMetadata>(key, {
    type: "stream",
    cacheTtl: EDGE_CACHE_TTL,
  });

  return value && { body: value, type: metadata?.contentType ?? "application/octet-stream" };
}

export function mediaResponse(body: BodyInit | null, type: string) {
  return new Response(body, {
    headers: {
      "Content-Type": type,
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
      // An SVG opened on its own must not run scripts on our origin.
      "Content-Security-Policy": "default-src 'none'; img-src 'self' data:; style-src 'unsafe-inline'; sandbox",
    },
  });
}

export const mediaNotFound = () => new Response("Not found", { status: 404 });
