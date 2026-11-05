import { getCloudflareContext } from "@opennextjs/cloudflare";

/**
 * Production runs on Cloudflare and talks to the Worker's bindings; everything
 * else (`next dev`) keeps its data in `.data/` on disk, so working on the site
 * needs neither a Cloudflare account nor a running Worker.
 *
 * Callers test `process.env.NODE_ENV === "production"` inline rather than
 * through a shared constant: the build replaces it with a literal, so the
 * Node-only branches (node:sqlite, sharp, the file system) drop out of the
 * Worker bundle instead of turning into imports it cannot resolve.
 */

// The few binding methods this app calls. Spelled out here because the full
// Workers runtime types replace the DOM ones the rest of the app relies on.

export type D1Result<T> = { results: T[]; meta: { changes: number; last_row_id: number } };

export interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  all<T>(): Promise<D1Result<T>>;
  first<T>(): Promise<T | null>;
  run(): Promise<D1Result<never>>;
}

export interface D1Database {
  prepare(sql: string): D1PreparedStatement;
}

export interface R2Object {
  body: ReadableStream;
  size: number;
  httpMetadata?: { contentType?: string };
}

export interface R2Bucket {
  get(key: string): Promise<R2Object | null>;
  put(key: string, value: ArrayBuffer | Uint8Array, options?: { httpMetadata?: { contentType?: string } }): Promise<unknown>;
  delete(key: string): Promise<void>;
}

export interface ImagesBinding {
  info(stream: ReadableStream): Promise<{ format: string; width?: number; height?: number }>;
  input(stream: ReadableStream): ImageTransformer;
}

interface ImageTransformer {
  transform(options: { width?: number; height?: number; fit?: "scale-down" }): ImageTransformer;
  output(options: { format: "image/webp"; quality?: number }): Promise<{ response(): Response }>;
}

type Bindings = { DB: D1Database; MEDIA: R2Bucket; IMAGES: ImagesBinding };

export async function bindings(): Promise<Bindings> {
  const { env } = await getCloudflareContext({ async: true });

  return env as unknown as Bindings;
}
