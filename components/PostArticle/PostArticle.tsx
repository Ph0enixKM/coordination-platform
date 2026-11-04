import SubpageHeader from "@/components/SubpageHeader/SubpageHeader";
import PostBody from "@/components/PostBody/PostBody";
import { postDate } from "@/components/PostCard/PostCard";
import TableOfContents from "@/components/TableOfContents/TableOfContents";
import { slugify, type ImageValue, type PostContent } from "@/lib/blog/content";
import type { Post } from "@/lib/blog/types";
import { anchorHeadings } from "@/lib/blog/toc";
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

/** The picture behind the post's header: its opening image, else the cover. */
export const heroImage = (post: ArticlePost) => leadImage(post.content) ?? post.cover;

/**
 * A post as readers see it: the header with its photo, title and meta, then
 * the body beside its table of contents. The public page and the editor's
 * preview both render it.
 */
export default function PostArticle({ post }: { post: ArticlePost }) {
  const lead = leadImage(post.content);
  const hero = lead ?? post.cover;
  const anchored = anchorHeadings(lead ? withoutFirstBlock(post.content) : post.content);
  // Some posts repeat their title as the first section heading; the list skips
  // it, and a list of one section is no table of contents.
  const headings = anchored.headings.filter((heading) => slugify(heading.text) !== slugify(post.title));
  const toc = headings.length > 1;

  // Nearly every post sits in "Baza wiedzy", which the breadcrumbs already say.
  const categories = post.categories.filter((category) => category !== "Baza wiedzy");

  return (
    <>
      <SubpageHeader
        title={post.title}
        variant="article"
        image={hero ?? undefined}
        crumbs={[{ label: "Strona główna", href: "/" }, { label: "Baza wiedzy", href: "/wiedza" }]}
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
