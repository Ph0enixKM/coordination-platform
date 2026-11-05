"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PostCard from "@/components/PostCard/PostCard";
import RecencyNote from "@/components/RecencyNote/RecencyNote";
import type { PostSummary } from "@/lib/blog/types";
import styles from "./LatestPost.module.css";

/** A failed request is tried again after these pauses, in ms. */
const RETRIES = [400, 1200];

async function fetchLatestPost(signal: AbortSignal): Promise<PostSummary | null> {
  for (let attempt = 0; ; attempt++) {
    try {
      const response = await fetch("/api/latest-post", { cache: "no-store", signal });

      if (response.ok) return ((await response.json()) as { post: PostSummary | null }).post;
    } catch (error) {
      if (signal.aborted) throw error;
    }

    if (attempt === RETRIES.length) return null;

    await new Promise((resolve) => setTimeout(resolve, RETRIES[attempt]));
  }
}

/**
 * The newest blog post on the home page. The page itself is static, so the
 * browser asks for the post; the section stays hidden until it arrives, and
 * while nothing is published.
 */
export default function LatestPost() {
  const [post, setPost] = useState<PostSummary | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    fetchLatestPost(controller.signal)
      .then(setPost)
      .catch(() => {});

    return () => controller.abort();
  }, []);

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
