import Link from "next/link";
import type { PostSummary } from "@/lib/blog/types";
import styles from "./PostCard.module.css";

export const postDate = new Intl.DateTimeFormat("pl-PL", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "Europe/Warsaw",
});

/** A blog post teaser linking to the post at /<slug>. */
export default function PostCard({ post, headingLevel = 2 }: { post: PostSummary; headingLevel?: 2 | 3 }) {
  const Heading = `h${headingLevel}` as const;

  return (
    <article className={styles.card}>
      {post.cover && (
        <div className={styles.cover}>
          <img src={post.cover.src} alt="" width={post.cover.width} height={post.cover.height} loading="lazy" decoding="async" />
        </div>
      )}
      <div className={styles.content}>
        <div className={styles.meta}>
          {post.publishedAt && <time dateTime={post.publishedAt}>{postDate.format(new Date(post.publishedAt))}</time>}
          {post.publishedAt && post.author && (
            <span className={styles.dot} aria-hidden="true">
              ·
            </span>
          )}
          {post.author && <span><span className={styles.authorLabel}>autor</span> {post.author}</span>}
        </div>
        <Heading className={styles.title}>
          {/* The whole card is clickable through the link's stretched ::after. */}
          <Link href={`/${post.slug}`} className={styles.link}>
            {post.title}
          </Link>
        </Heading>
        {post.summary && <p className={styles.excerpt}>{post.summary}</p>}
        <span className={styles.read} aria-hidden="true">
          Czytaj więcej
        </span>
      </div>
    </article>
  );
}
