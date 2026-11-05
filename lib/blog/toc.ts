import { htmlToText, slugify, type PostContent } from "@/lib/blog/content";

export type Heading = { id: string; text: string };

/**
 * Gives the post's section headings ids to link to and lists them for the
 * table of contents. Sections are the H2s; the odd post without any is split
 * by its H3s instead. Deeper headings (FAQ questions, mostly) would make the
 * list too long to scan.
 */
export function anchorHeadings(content: PostContent): { content: PostContent; headings: Heading[] } {
  const texts = content.rows
    .flatMap((row) => row.columns.flatMap((column) => column.blocks))
    .flatMap((block) => (block.type === "text" ? [block.html] : []));
  const level = texts.some((html) => /<h2[\s>]/.test(html)) ? 2 : 3;
  const pattern = new RegExp(`<h${level}([^>]*)>([\\s\\S]*?)</h${level}>`, "g");
  const headings: Heading[] = [];
  const used = new Set<string>();

  const anchor = (text: string) =>
    text.replace(pattern, (tag, attributes: string, inner: string) => {
      const label = htmlToText(inner);

      if (!label || attributes.includes("id=")) return tag;

      const base = slugify(label, 80) || "sekcja";
      let id = base;

      for (let n = 2; used.has(id); n++) id = `${base}-${n}`;

      used.add(id);
      headings.push({ id, text: label });

      return `<h${level}${attributes} id="${id}">${inner}</h${level}>`;
    });

  const rows = content.rows.map((row) => ({
    ...row,
    columns: row.columns.map((column) => ({
      ...column,
      blocks: column.blocks.map((block) => (block.type === "text" ? { ...block, html: anchor(block.html) } : block)),
    })),
  }));

  return { content: { ...content, rows }, headings };
}
