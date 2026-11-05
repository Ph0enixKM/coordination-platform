import type { ImageValue } from "@/lib/blog/content";
import type { PostStatus, PostSummary } from "@/lib/blog/types";

/**
 * How posts are stored and read back. Shared by `lib/blog/posts.ts` and the
 * Worker entry (`worker.ts`), which answers /api/latest-post without starting
 * Next.js, so this file imports nothing at runtime.
 */

export type PostRow = {
  id: number;
  slug: string;
  title: string;
  status: PostStatus;
  excerpt: string;
  author: string;
  categories: string;
  tags: string;
  cover: string | null;
  summary: string;
  seo_title: string;
  seo_description: string;
  focus_keyword: string;
  content: string;
  published_at: string | null;
  updated_at: string;
};

export const SUMMARY_COLUMNS = "id, slug, title, status, author, categories, cover, summary, published_at, updated_at";

/** Published and not scheduled for later: what visitors may see. Takes the current time as an ISO string. */
export const VISIBLE = "status = 'publish' AND published_at IS NOT NULL AND published_at <= ?";

/** The newest visible post, for the home page. Takes the current time as an ISO string. */
export const LATEST_POST_SQL = `SELECT ${SUMMARY_COLUMNS} FROM posts WHERE ${VISIBLE} ORDER BY published_at DESC, id DESC LIMIT 1`;

/** Whether visitors can see a post with these values right now. */
export const isVisible = (row: { status: PostStatus; published_at: string | null } | null | undefined) =>
  row?.status === "publish" && row.published_at !== null && row.published_at <= new Date().toISOString();

export function parseJson<T>(json: string | null, fallback: T): T {
  try {
    return json ? (JSON.parse(json) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function toSummary(row: PostRow): PostSummary {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    status: row.status,
    author: row.author,
    categories: parseJson<string[]>(row.categories, []),
    cover: parseJson<ImageValue | null>(row.cover, null),
    summary: row.summary,
    publishedAt: row.published_at,
    updatedAt: row.updated_at,
  };
}
