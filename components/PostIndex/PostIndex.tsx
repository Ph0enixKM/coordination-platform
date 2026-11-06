import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { notFound, permanentRedirect } from "next/navigation";
import PostCard from "@/components/PostCard/PostCard";
import EpisodeList from "@/components/EpisodeList/EpisodeList";
import CtaButton from "@/components/CtaButton/CtaButton";
import type { PostSummary } from "@/lib/blog/types";
import styles from "./PostIndex.module.css";

export const POSTS_PER_PAGE = 12;

/** Page 1 is the list's own path and page n is <path>/strona/n. */
export const pageHref = (basePath: string, page: number) => (page === 1 ? basePath : `${basePath}/strona/${page}`);

/**
 * Reads the page number from a list's optional catch-all segments; any other
 * path is not a page. Pages live in the path, not in "?strona=", because the
 * page cache is keyed by path.
 */
export function readPage(segments: string[] | undefined, basePath: string) {
  if (!segments) return 1;

  const [prefix, number, ...rest] = segments;
  const value = Number(number);

  if (prefix !== "strona" || rest.length > 0 || !/^\d+$/.test(number ?? "")) notFound();
  if (value === 1) permanentRedirect(basePath);
  if (value < 1) notFound();

  return value;
}

type Props = {
  posts: PostSummary[];
  page: number;
  total: number;
  basePath: string;
  /** Shown while the list has no posts yet. */
  empty: string;
  /** Labels the page links for screen readers. */
  label: string;
  /** "episodes" lists the posts in rows, as podcast apps list episodes. */
  layout?: "cards" | "episodes";
};

/**
 * A page of post cards with its pagination above and below, then the consultation call to
 * action: the body of /wiedza and /podcasty.
 */
export default function PostIndex({ posts, page, total, basePath, empty, label, layout = "cards" }: Props) {
  const pages = Math.max(1, Math.ceil(total / POSTS_PER_PAGE));

  if (page > pages) notFound();

  return (
    <>
      <section className={styles.section}>
        <div className={styles.inner}>
          {pages > 1 && <Pagination page={page} pages={pages} basePath={basePath} label={`${label}, nad listą`} position="top" />}

          {posts.length === 0 ? (
            <p className={styles.empty}>{empty}</p>
          ) : layout === "episodes" ? (
            <EpisodeList posts={posts} headingLevel={2} />
          ) : (
            <PostGrid posts={posts} />
          )}

          {pages > 1 && <Pagination page={page} pages={pages} basePath={basePath} label={`${label}, pod listą`} position="bottom" />}
        </div>
      </section>

      <section className={styles.ctaSection}>
        <div className={styles.ctaInner}>
          <h2 className={styles.ctaTitle}>Chcesz porozmawiać o swojej firmie?</h2>
          <p className={styles.ctaText}>
            Umów bezpłatną konsultację, podczas której porozmawiamy o Twojej firmie i sprawdzimy, czy możemy realnie pomóc.
          </p>
          <CtaButton href="/#kontakt">Bezpłatna konsultacja</CtaButton>
        </div>
      </section>
    </>
  );
}

/** Post cards, three to a row on wide screens. */
function PostGrid({ posts, headingLevel = 2 }: { posts: PostSummary[]; headingLevel?: 2 | 3 }) {
  return (
    <ul className={styles.list}>
      {posts.map((post) => (
        <li key={post.id} className={styles.item}>
          <PostCard post={post} headingLevel={headingLevel} />
        </li>
      ))}
    </ul>
  );
}

/** First, last and the pages around the current one; gaps become an ellipsis. */
function pageNumbers(page: number, pages: number) {
  const shown = [...new Set([1, page - 1, page, page + 1, pages])].filter((n) => n >= 1 && n <= pages).sort((a, b) => a - b);

  return shown.flatMap((n, index) => (index > 0 && n - shown[index - 1] > 1 ? ["gap" as const, n] : [n]));
}

type PaginationProps = { page: number; pages: number; basePath: string; label: string; position: "top" | "bottom" };

function Pagination({ page, pages, basePath, label, position }: PaginationProps) {
  const href = (n: number) => pageHref(basePath, n);

  return (
    <nav className={styles.pagination} data-position={position} aria-label={label}>
      {page > 1 ? (
        <Link className={styles.step} href={href(page - 1)} rel="prev">
          <ChevronLeft aria-hidden="true" /> Nowsze
        </Link>
      ) : (
        <span className={styles.step} aria-hidden="true" />
      )}

      <ol className={styles.pages}>
        {pageNumbers(page, pages).map((item, index) =>
          item === "gap" ? (
            <li key={`gap-${index}`} className={styles.gap} aria-hidden="true">
              …
            </li>
          ) : (
            <li key={item}>
              <Link
                className={styles.page}
                href={href(item)}
                aria-current={item === page ? "page" : undefined}
                aria-label={`Strona ${item}`}
              >
                {item}
              </Link>
            </li>
          ),
        )}
      </ol>

      {page < pages ? (
        <Link className={styles.step} href={href(page + 1)} rel="next">
          Starsze <ChevronRight aria-hidden="true" />
        </Link>
      ) : (
        <span className={styles.step} aria-hidden="true" />
      )}
    </nav>
  );
}
