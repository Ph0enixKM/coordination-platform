/**
 * A post body, as the admin editor builds it: rows laid out in columns, each
 * column a stack of blocks. Stored as JSON in `posts.content`.
 */

export type ImageValue = { src: string; alt: string; width?: number; height?: number };

export type TextBlock = { id: string; type: "text"; html: string };
export type ImageBlock = { id: string; type: "image"; image: ImageValue | null; href?: string };
/** A YouTube video, kept as the link pasted in; see lib/blog/embed.ts. */
export type VideoBlock = { id: string; type: "video"; url: string };
/** One podcast (episode or show) on up to two platforms; readers pick the player. */
export type PodcastBlock = { id: string; type: "podcast"; spotify: string; apple: string };
export type Block = TextBlock | ImageBlock | VideoBlock | PodcastBlock;

export type Column = { id: string; blocks: Block[] };

/** Column widths as fractions of the row, e.g. "1-2" is one third then two thirds. */
export const LAYOUTS = ["1", "1-1", "1-2", "2-1", "1-1-1"] as const;
export type Layout = (typeof LAYOUTS)[number];

export type Row = { id: string; layout: Layout; columns: Column[] };

export type PostContent = { version: 1; rows: Row[] };

export const layoutParts = (layout: Layout) => layout.split("-").map(Number);

export const newId = () => crypto.randomUUID().slice(0, 8);

export const textBlock = (html = ""): TextBlock => ({ id: newId(), type: "text", html });
export const imageBlock = (image: ImageValue | null = null, href?: string): ImageBlock => ({
  id: newId(),
  type: "image",
  image,
  ...(href ? { href } : {}),
});

export const videoBlock = (url = ""): VideoBlock => ({ id: newId(), type: "video", url });
export const podcastBlock = (spotify = "", apple = ""): PodcastBlock => ({ id: newId(), type: "podcast", spotify, apple });

export const row = (blocks: Block[] = [], layout: Layout = "1"): Row => ({
  id: newId(),
  layout,
  columns: layoutParts(layout).map((_, index) => ({ id: newId(), blocks: index === 0 ? blocks : [] })),
});

export const emptyContent = (): PostContent => ({ version: 1, rows: [] });

/**
 * Changing a row's layout keeps every block: columns that no longer fit hand
 * their blocks to the last remaining one.
 */
export function relayout(target: Row, layout: Layout): Row {
  const count = layoutParts(layout).length;
  const columns = target.columns.slice(0, count).map((column) => ({ ...column, blocks: [...column.blocks] }));

  for (const dropped of target.columns.slice(count)) columns[columns.length - 1].blocks.push(...dropped.blocks);
  while (columns.length < count) columns.push({ id: newId(), blocks: [] });

  return { ...target, layout, columns };
}

export function parseContent(json: string | null | undefined): PostContent {
  try {
    const value = JSON.parse(json ?? "") as PostContent;

    return value && Array.isArray(value.rows) ? value : emptyContent();
  } catch {
    return emptyContent();
  }
}

export function slugify(text: string, max = 120) {
  return text
    .replace(/ł/g, "l")
    .replace(/Ł/g, "L")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, max)
    .replace(/-+$/, "");
}

const ENTITIES: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', "#39": "'", nbsp: " " };

/** Editor HTML as plain text: tags dropped, common entities decoded, whitespace collapsed. */
export const htmlToText = (html: string) =>
  html
    .replace(/<[^>]+>/g, "")
    .replace(/&(amp|lt|gt|quot|#39|nbsp);/g, (_, name: string) => ENTITIES[name])
    .replace(/\s+/g, " ")
    .trim();

/**
 * A plain-text teaser for listings: the excerpt if there is one, otherwise the
 * opening paragraphs of the body, cut at a word boundary.
 */
export function summarize(content: PostContent, excerpt: string, max = 220) {
  let text = excerpt.trim();

  if (!text) {
    const paragraphs: string[] = [];

    for (const row of content.rows) {
      for (const column of row.columns) {
        for (const block of column.blocks) {
          if (block.type !== "text") continue;

          for (const match of block.html.matchAll(/<p>([\s\S]*?)<\/p>/g)) paragraphs.push(match[1]);
        }
      }
    }

    text = htmlToText(paragraphs.join(" "));
  }

  if (text.length <= max) return text;

  const cut = text.slice(0, max);

  return `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[\s,.;:–-]+$/, "")}…`;
}
