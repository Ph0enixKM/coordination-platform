import SubpageHeader from "@/components/SubpageHeader/SubpageHeader";
import PostBody from "@/components/PostBody/PostBody";
import { postDate } from "@/components/PostCard/PostCard";
import TableOfContents from "@/components/TableOfContents/TableOfContents";
import { slugify, type ImageValue, type PostContent } from "@/lib/blog/content";
import type { Post } from "@/lib/blog/types";
import { anchorHeadings } from "@/lib/blog/toc";
import { PODCAST_CATEGORY, sectionOf } from "@/lib/blog/rows";
import styles from "./PostArticle.module.css";

type ArticlePost = Pick<Post, "title" | "author" | "publishedAt" | "categories" | "cover" | "content">;

/**
 * The post's opening picture becomes the header background instead of the
 * first thing in the body. Older posts open with one of their own (often a
 * copy of the cover); linked banners stay where they are.
 */
function leadImage(content: PostContent): ImageValue | null {
  const first = content.rows[0]?.columns[0]?.blocks[0];

  return first?.type === "image" && !first.href ? first.image : null;
}

/**
 * The post's main picture: its opening image, else the cover. Podcast entries
 * show their cover as the podcast's tile instead, so only the cover counts.
 */
export const heroImage = (post: ArticlePost) =>
  sectionOf(post) === "podcast" ? post.cover : (leadImage(post.content) ?? post.cover);

type Props = {
  post: ArticlePost;
  /** The show's cover, for a podcast entry that has none of its own. */
  showArtwork?: string | null;
};

/**
 * A post as readers see it: the header with its photo, title and meta, then
 * the body beside its table of contents. The public page and the editor's
 * preview both render it.
 *
 * Podcast entries get the header of /podcast-pno instead of a photo behind
 * the title: the cover as a tile beside it, the header washed in its colours.
 */
export default function PostArticle({ post, showArtwork }: Props) {
  const podcast = sectionOf(post) === "podcast";
  const lead = podcast ? null : leadImage(post.content);
  const hero = podcast ? null : (lead ?? post.cover);
  const artwork = podcast ? (post.cover?.src ?? showArtwork) : null;
  const anchored = anchorHeadings(lead ? withoutFirstBlock(post.content) : post.content);
  // Some posts repeat their title as the first section heading; the list skips
  // it, and a list of one section is no table of contents.
  const headings = anchored.headings.filter((heading) => slugify(heading.text) !== slugify(post.title));
  const toc = headings.length > 1;

  // Nearly every post sits in "Baza wiedzy", and podcast entries in "Podcast",
  // which the breadcrumbs already say.
  const categories = post.categories.filter((category) => category !== "Baza wiedzy" && category !== PODCAST_CATEGORY);
  const crumbs = podcast
    ? [
        { label: "Strona główna", href: "/" },
        { label: "Podcast PNO", href: "/podcast-pno" },
        { label: "Odcinki podcastu", href: "/podcasty" },
      ]
    : [{ label: "Strona główna", href: "/" }, { label: "Baza wiedzy", href: "/wiedza" }];

  return (
    <>
      <SubpageHeader
        title={post.title}
        variant="article"
        image={hero ?? undefined}
        artwork={artwork ? { src: artwork, alt: "Okładka podcastu PNO" } : undefined}
        torn={podcast}
        compact={podcast}
        crumbs={crumbs}
      >
        <div className={styles.meta}>
          {post.publishedAt && <time dateTime={post.publishedAt}>{postDate.format(new Date(post.publishedAt))}</time>}
          {post.author && (
            <span>
              <span className={styles.authorLabel}>autor</span> {post.author}
            </span>
          )}
          {categories.map((category) => (
            <span key={category} className={styles.category}>
              {category}
            </span>
          ))}
        </div>
      </SubpageHeader>

      <section className={styles.section}>
        <div className={styles.layout} data-toc={toc || undefined}>
          {toc && <TableOfContents headings={headings} />}
          <article className={styles.sheet}>
            <PostBody content={anchored.content} />
          </article>
        </div>
      </section>
    </>
  );
}

function withoutFirstBlock(content: PostContent): PostContent {
  const [first, ...rest] = content.rows;
  const columns = first.columns.map((column, index) => (index === 0 ? { ...column, blocks: column.blocks.slice(1) } : column));

  return { ...content, rows: [{ ...first, columns }, ...rest] };
}
