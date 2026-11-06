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

/**
 * Posts in this category are written from podcast episodes: they are listed
 * at /podcasty instead of /wiedza. Their address stays /<slug> like any post.
 */
export const PODCAST_CATEGORY = "Podcast";

/** Where a post is listed: the knowledge base or the podcast entries. */
export type Section = "blog" | "podcast";

const IN_PODCAST = `EXISTS (SELECT 1 FROM json_each(posts.categories) WHERE value = '${PODCAST_CATEGORY}')`;

/** SQL condition matching the posts of a section. */
export const IN_SECTION: Record<Section, string> = { blog: `NOT ${IN_PODCAST}`, podcast: IN_PODCAST };

export const sectionOf = (post: { categories: string[] }): Section =>
  post.categories.includes(PODCAST_CATEGORY) ? "podcast" : "blog";

/** The newest visible knowledge-base post, for the home page. Takes the current time as an ISO string. */
export const LATEST_POST_SQL = `SELECT ${SUMMARY_COLUMNS} FROM posts WHERE ${VISIBLE} AND ${IN_SECTION.blog} ORDER BY published_at DESC, id DESC LIMIT 1`;

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
