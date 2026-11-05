"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PostCard from "@/components/PostCard/PostCard";
import RecencyNote from "@/components/RecencyNote/RecencyNote";
import type { PostSummary } from "@/lib/blog/types";
import styles from "./LatestPost.module.css";

type Props = {
  post: PostSummary | null;
  /** The server's copy was over 12 hours old: ask /api/latest-post for a fresh one. */
  check: boolean;
};

/** The newest blog post on the home page; hidden while nothing is published. */
export default function LatestPost({ post: rendered, check }: Props) {
  const [post, setPost] = useState(rendered);

  useEffect(() => {
    if (!check) return;

    const params = new URLSearchParams();
    if (rendered) {
      params.set("id", String(rendered.id));
      params.set("updated", rendered.updatedAt);
    }

    const controller = new AbortController();

    fetch(`/api/latest-post?${params}`, { cache: "no-store", signal: controller.signal })
      .then(async (response) => {
        // 204: still the newest. Anything but 200: keep what the page has.
        if (response.status === 200) setPost(((await response.json()) as { post: PostSummary | null }).post);
      })
      .catch(() => {});

    return () => controller.abort();
  }, [check, rendered]);

  if (!post) return null;

  return (
    <section className={styles.section} aria-labelledby="latest-post-title">
      <div className={styles.inner}>
        <div>
          <h2 id="latest-post-title" className={styles.title}>
            Najnowszy wpis
          </h2>
          <RecencyNote date={post.publishedAt} tone="light" gap="top" />
        </div>
        <div className={styles.card}>
          <PostCard post={post} headingLevel={3} />
        </div>
        <Link className={styles.all} href="/wiedza">
          Zobacz wszystkie wpisy
        </Link>
      </div>
    </section>
  );
}
