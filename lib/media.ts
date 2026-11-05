import { bindings } from "@/lib/cloudflare";
import { getDb } from "@/lib/db";
import { slugify, type ImageValue } from "@/lib/blog/content";

/**
 * Longest edge of a stored image. Full HD is 1920 wide; capping the longest
 * edge rather than fitting a 1920x1080 box keeps tall screenshots and
 * infographics readable instead of shrinking them to 1080 high.
 */
export const MAX_EDGE = 1920;
export const WEBP_QUALITY = 80;
export const MAX_UPLOAD_BYTES = 25 * 1024 * 1024;

const RASTER = new Set(["image/png", "image/jpeg", "image/webp", "image/gif", "image/avif"]);
const SVG = "image/svg+xml";

export const acceptsType = (type: string) => RASTER.has(type) || type === SVG;

type Bytes = Uint8Array<ArrayBuffer>;

type MediaRow = { key: string; width: number | null; height: number | null };

export const mediaUrl = (key: string) => `/media/${key}`;

/** One stored image, as the admin's media library shows it. */
export type MediaItem = {
  src: string;
  name: string;
  width?: number;
  height?: number;
  size: number;
  createdAt: string;
};

/** Every stored image, newest first. */
export async function listMedia(): Promise<MediaItem[]> {
  const db = await getDb();
  const rows = await db.all<MediaRow & { original_name: string; size: number; created_at: string }>(
    "SELECT key, width, height, original_name, size, created_at FROM media ORDER BY created_at DESC, id DESC",
  );

  return rows.map((row) => ({
    src: mediaUrl(row.key),
    name: row.original_name || row.key.split("/").pop() || row.key,
    width: row.width ?? undefined,
    height: row.height ?? undefined,
    size: row.size,
    createdAt: row.created_at,
  }));
}

/**
 * Converts an uploaded image to WebP (scaled down to MAX_EDGE, never up) and
 * stores it. SVGs are stored as they are: they are already small and scale
 * without loss. The same file uploaded twice returns the first copy.
 */
export async function storeImage(bytes: Bytes, name: string, type: string, alt = ""): Promise<ImageValue> {
  const db = await getDb();
  const hash = await sha256(bytes);
  const existing = await db.first<MediaRow>("SELECT key, width, height FROM media WHERE hash = ?", hash);

  if (existing) return toImage(existing, alt);

  const converted = type === SVG ? { bytes, width: null, height: null } : await toWebp(bytes);
  const contentType = type === SVG ? SVG : "image/webp";
  const month = new Date().toISOString().slice(0, 7).replace("-", "/");
  const base = slugify(name.replace(/\.[a-z0-9]+$/i, ""), 60) || "obraz";
  const key = `${month}/${base}-${hash.slice(0, 10)}.${type === SVG ? "svg" : "webp"}`;

  await putObject(key, converted.bytes, contentType);
  await db.run(
    `INSERT INTO media (key, hash, content_type, original_name, width, height, size)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    key,
    hash,
    contentType,
    name,
    converted.width,
    converted.height,
    converted.bytes.byteLength,
  );

  return toImage({ key, width: converted.width, height: converted.height }, alt);
}

function toImage(row: MediaRow, alt: string): ImageValue {
  return { src: mediaUrl(row.key), alt, width: row.width ?? undefined, height: row.height ?? undefined };
}

type Converted = { bytes: Bytes; width: number | null; height: number | null };

async function toWebp(bytes: Bytes): Promise<Converted> {
  if (process.env.NODE_ENV === "production") {
    const { IMAGES } = await bindings();
    const info = await IMAGES.info(new Blob([bytes]).stream());
    const result = await IMAGES.input(new Blob([bytes]).stream())
      .transform({ width: MAX_EDGE, height: MAX_EDGE, fit: "scale-down" })
      .output({ format: "image/webp", quality: WEBP_QUALITY });
    const out = new Uint8Array(await result.response().arrayBuffer());

    if (!info.width || !info.height) return { bytes: out, width: null, height: null };

    const scale = Math.min(1, MAX_EDGE / Math.max(info.width, info.height));

    return { bytes: out, width: Math.round(info.width * scale), height: Math.round(info.height * scale) };
  }

  const { default: sharp }: typeof import("sharp") = await import(/* webpackIgnore: true */ "sharp");
  const { data, info } = await sharp(bytes)
    .rotate()
    .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: "inside", withoutEnlargement: true })
    .webp({ quality: WEBP_QUALITY })
    .toBuffer({ resolveWithObject: true });

  return { bytes: new Uint8Array(data), width: info.width, height: info.height };
}

export async function getObject(key: string): Promise<{ body: BodyInit; type: string } | null> {
  if (process.env.NODE_ENV === "production") {
    const { MEDIA } = await bindings();
    const object = await MEDIA.get(key);

    return object && { body: object.body, type: object.httpMetadata?.contentType ?? "application/octet-stream" };
  }

  const { path, fs } = await localStore();
  const file = path.join(process.cwd(), ".data", "media", key);

  try {
    const body = new Uint8Array(await fs.readFile(file));

    return { body, type: file.endsWith(".svg") ? SVG : "image/webp" };
  } catch {
    return null;
  }
}

async function putObject(key: string, bytes: Bytes, contentType: string) {
  if (process.env.NODE_ENV === "production") {
    const { MEDIA } = await bindings();
    await MEDIA.put(key, bytes, { httpMetadata: { contentType } });
    return;
  }

  const { path, fs } = await localStore();
  const file = path.join(process.cwd(), ".data", "media", key);
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, bytes);
}

async function localStore() {
  return { path: await import("node:path"), fs: await import("node:fs/promises") };
}

async function sha256(bytes: Bytes) {
  const digest = await crypto.subtle.digest("SHA-256", bytes);

  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}
