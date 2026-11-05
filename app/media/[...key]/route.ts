import { getObject } from "@/lib/media";
import { isMediaKey, mediaNotFound, mediaResponse } from "@/lib/media-response";

type Context = { params: Promise<{ key: string[] }> };

/**
 * Serves uploaded blog images under `next dev`. On Cloudflare `worker.ts`
 * answers /media/* from KV before a request ever reaches Next.js.
 */
export async function GET(_request: Request, { params }: Context) {
  const key = (await params).key.join("/");

  if (!isMediaKey(key)) return mediaNotFound();

  const object = await getObject(key);

  return object ? mediaResponse(object.body, object.type) : mediaNotFound();
}
