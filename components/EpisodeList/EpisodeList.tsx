import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { postDate } from "@/components/PostCard/PostCard";
import type { PostSummary } from "@/lib/blog/types";
import styles from "./EpisodeList.module.css";

/**
 * Podcast entries one under another, the way a podcast app lists episodes:
 * cover, date, title and the opening lines. There is no play button: a row
 * opens the entry, which has the player.
 */
export default function EpisodeList({ posts, headingLevel = 3 }: { posts: PostSummary[]; headingLevel?: 2 | 3 }) {
  const Heading = `h${headingLevel}` as const;

  return (
    <ol className={styles.list}>
      {posts.map((post) => (
        <li key={post.id} className={styles.row}>
          {post.cover && (
            <img
              className={styles.cover}
              src={post.cover.src}
              alt=""
              width={post.cover.width}
              height={post.cover.height}
              loading="lazy"
              decoding="async"
            />
          )}
          <div className={styles.body}>
            {post.publishedAt && (
              <time className={styles.date} dateTime={post.publishedAt}>
                {postDate.format(new Date(post.publishedAt))}
              </time>
            )}
            <Heading className={styles.title}>
              {/* The whole row is clickable through the link's stretched ::after. */}
              <Link href={`/${post.slug}`} className={styles.link}>
                {post.title}
              </Link>
            </Heading>
            {post.summary && <p className={styles.summary}>{post.summary}</p>}
          </div>
          <ChevronRight className={styles.arrow} aria-hidden="true" />
        </li>
      ))}
    </ol>
  );
}
