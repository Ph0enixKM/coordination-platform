import type { ImageValue, PostContent } from "@/lib/blog/content";

export type PostStatus = "draft" | "publish";

/** A post as the admin list shows it. */
export type PostSummary = {
  id: number;
  slug: string;
  title: string;
  status: PostStatus;
  author: string;
  categories: string[];
  cover: ImageValue | null;
  /** Plain-text teaser, see `summarize`. */
  summary: string;
  publishedAt: string | null;
  updatedAt: string;
};

export type Post = PostSummary & {
  excerpt: string;
  tags: string[];
  seoTitle: string;
  seoDescription: string;
  focusKeyword: string;
  content: PostContent;
};

/** What the editor sends when it saves; the server fills in the rest. */
export type PostInput = Omit<Post, "id" | "updatedAt"> & { wpId?: number };
