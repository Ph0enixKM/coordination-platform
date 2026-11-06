import { getDb } from "@/lib/db";
import { revalidateBlog } from "@/lib/blog/cache";
import { parseContent, slugify, summarize, type ImageValue, type PostContent } from "@/lib/blog/content";
import {
  IN_SECTION,
  LATEST_POST_SQL,
  SUMMARY_COLUMNS,
  VISIBLE,
  isVisible,
  parseJson,
  toSummary,
  type PostRow,
  type Section,
} from "@/lib/blog/rows";
import type { Post, PostInput, PostStatus, PostSummary } from "@/lib/blog/types";

function toPost(row: PostRow): Post {
  return {
    ...toSummary(row),
    excerpt: row.excerpt,
    tags: parseJson<string[]>(row.tags, []),
    seoTitle: row.seo_title,
    seoDescription: row.seo_description,
    focusKeyword: row.focus_keyword,
    content: parseContent(row.content),
  };
}

export async function listPosts(): Promise<PostSummary[]> {
  const db = await getDb();
  const rows = await db.all<PostRow>(
    `SELECT ${SUMMARY_COLUMNS} FROM posts ORDER BY COALESCE(published_at, created_at) DESC, id DESC`,
  );

  return rows.map(toSummary);
}

export async function getPost(id: number): Promise<Post | null> {
  const db = await getDb();
  const row = await db.first<PostRow>("SELECT * FROM posts WHERE id = ?", id);

  return row && toPost(row);
}

export class PostError extends Error {
  constructor(
    message: string,
    readonly status = 400,
  ) {
    super(message);
  }
}

/**
 * Posts live at /<slug>, next to the site's own pages, which would win over a
 * post with the same address.
 */
const RESERVED_SLUGS = new Set([
  "admin", "api", "media", "wiedza", "faq", "o-nas", "dla-kogo", "proces", "wsparcie", "spolecznosc",
  "podcast-pno", "podcasty", "odcinek-podcastu", "regulamin", "polityka-prywatnosci", "assets", "fonts", "images",
]);

const text = (value: unknown, max = 1000) => (typeof value === "string" ? value.trim().slice(0, max) : "");

const strings = (value: unknown) =>
  Array.isArray(value) ? [...new Set(value.map((item) => text(item, 120)).filter(Boolean))] : [];

function image(value: unknown): ImageValue | null {
  if (typeof value !== "object" || value === null) return null;

  const { src, alt, width, height } = value as Record<string, unknown>;

  if (typeof src !== "string" || !src) return null;

  return {
    src,
    alt: text(alt, 300),
    width: typeof width === "number" ? width : undefined,
    height: typeof height === "number" ? height : undefined,
  };
}

function content(value: unknown): PostContent {
  const rows = (value as PostContent | null)?.rows;

  if (!Array.isArray(rows)) throw new PostError("Treść wpisu ma nieprawidłowy format.");

  return { version: 1, rows };
}

function date(value: unknown) {
  if (typeof value !== "string" || !value) return null;

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) throw new PostError("Nieprawidłowa data publikacji.");

  return parsed.toISOString();
}

/** Checks and normalises what a client sent before it reaches the database. */
function normalise(input: Partial<PostInput>) {
  const title = text(input.title, 300);
  const slug = slugify(text(input.slug, 200) || title);

  if (!title) throw new PostError("Wpis musi mieć tytuł.");
  if (!slug) throw new PostError("Wpis musi mieć adres (slug).");
  if (RESERVED_SLUGS.has(slug)) throw new PostError(`Adres „/${slug}” zajmuje już inna strona serwisu.`);

  const status: PostStatus = input.status === "publish" ? "publish" : "draft";
  const publishedAt = date(input.publishedAt) ?? (status === "publish" ? new Date().toISOString() : null);
  const cover = image(input.cover);
  const body = content(input.content);
  const excerpt = text(input.excerpt, 1000);

  return {
    slug,
    title,
    status,
    excerpt,
    author: text(input.author, 120),
    categories: JSON.stringify(strings(input.categories)),
    tags: JSON.stringify(strings(input.tags)),
    cover: cover && JSON.stringify(cover),
    seo_title: text(input.seoTitle, 300),
    seo_description: text(input.seoDescription, 500),
    focus_keyword: text(input.focusKeyword, 200),
    content: JSON.stringify(body),
    summary: summarize(body, excerpt),
    published_at: publishedAt,
    wp_id: typeof input.wpId === "number" ? input.wpId : null,
  };
}

type Visibility = Pick<PostRow, "status" | "published_at">;

const isUniqueSlug = (error: unknown) => String(error).includes("UNIQUE constraint failed: posts.slug");

const now = () => new Date().toISOString();

export async function createPost(input: Partial<PostInput>): Promise<Post> {
  const values = normalise(input);
  const db = await getDb();

  try {
    const columns = Object.keys(values);
    const { lastRowId } = await db.run(
      `INSERT INTO posts (${columns.join(", ")}) VALUES (${columns.map(() => "?").join(", ")})`,
      ...Object.values(values),
    );

    // A post dated in the future reaches the pages through the cron in worker.ts.
    if (isVisible(values)) revalidateBlog();

    return (await getPost(lastRowId))!;
  } catch (error) {
    if (isUniqueSlug(error)) throw new PostError("Wpis o takim adresie (slug) już istnieje.", 409);
    throw error;
  }
}

export async function updatePost(id: number, input: Partial<PostInput>): Promise<Post | null> {
  const { wp_id: _, ...values } = normalise(input);
  const db = await getDb();
  const columns = Object.keys(values);
  const before = await db.first<Visibility>("SELECT status, published_at FROM posts WHERE id = ?", id);

  try {
    const { changes } = await db.run(
      `UPDATE posts SET ${columns.map((column) => `${column} = ?`).join(", ")}, updated_at = ? WHERE id = ?`,
      ...Object.values(values),
      now(),
      id,
    );

    if (!changes) return null;

    // Edits to a draft or a post scheduled for later change nothing visitors see.
    if (isVisible(before) || isVisible(values)) revalidateBlog();

    return getPost(id);
  } catch (error) {
    if (isUniqueSlug(error)) throw new PostError("Wpis o takim adresie (slug) już istnieje.", 409);
    throw error;
  }
}

/** Changes only the given fields, e.g. the title or status from the post list. */
export async function patchPost(id: number, patch: Partial<PostInput>) {
  const current = await getPost(id);

  return current && updatePost(id, { ...current, ...patch });
}

/** Creates the post, or updates the one imported earlier from the same WordPress post. */
export async function upsertImportedPost(input: Partial<PostInput> & { wpId: number }) {
  const db = await getDb();
  const existing = await db.first<{ id: number }>("SELECT id FROM posts WHERE wp_id = ?", input.wpId);

  return existing ? updatePost(existing.id, input) : createPost(input);
}

export async function deletePost(id: number) {
  const db = await getDb();
  const before = await db.first<Visibility>("SELECT status, published_at FROM posts WHERE id = ?", id);
  const { changes } = await db.run("DELETE FROM posts WHERE id = ?", id);

  if (!changes) return false;

  if (isVisible(before)) revalidateBlog();

  return true;
}

/** A page of one section's visible posts, newest first: /wiedza lists the blog, /podcasty the podcast entries. */
export async function listPublishedPosts(page: number, perPage: number, section: Section = "blog") {
  const db = await getDb();
  const now = new Date().toISOString();
  const where = `${VISIBLE} AND ${IN_SECTION[section]}`;
  const [rows, count] = await Promise.all([
    db.all<PostRow>(
      `SELECT ${SUMMARY_COLUMNS} FROM posts WHERE ${where} ORDER BY published_at DESC, id DESC LIMIT ? OFFSET ?`,
      now,
      perPage,
      (page - 1) * perPage,
    ),
    db.first<{ total: number }>(`SELECT COUNT(*) AS total FROM posts WHERE ${where}`, now),
  ]);

  return { posts: rows.map(toSummary), total: count?.total ?? 0 };
}

/**
 * The newest visible post, for /api/latest-post under `next dev`. On
 * Cloudflare worker.ts answers that route with the same query.
 */
export async function getLatestPublishedPost(): Promise<PostSummary | null> {
  const db = await getDb();
  const row = await db.first<PostRow>(LATEST_POST_SQL, new Date().toISOString());

  return row && toSummary(row);
}

export async function getPublishedPost(slug: string): Promise<Post | null> {
  const db = await getDb();
  const row = await db.first<PostRow>(`SELECT * FROM posts WHERE slug = ? AND ${VISIBLE}`, slug, new Date().toISOString());

  return row && toPost(row);
}

export async function listPublishedSlugs() {
  const db = await getDb();

  return db.all<{ slug: string; updated_at: string }>(
    `SELECT slug, updated_at FROM posts WHERE ${VISIBLE} ORDER BY published_at DESC`,
    new Date().toISOString(),
  );
}
