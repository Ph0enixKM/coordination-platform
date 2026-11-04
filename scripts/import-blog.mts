/**
 * Imports the WordPress export (`coordination wpisy/blog/posts`) through the
 * admin API, so images go through the same WebP conversion as uploads and the
 * same command fills the local SQLite file or production D1:
 *
 *   npm run blog:import                                   # http://localhost:3000, ADMIN_CODE from .env
 *   npm run blog:import -- --url https://coordination.pl --code <ADMIN_CODE>
 *   npm run blog:import -- --only <part of folder name>   # selected posts
 *
 * Post bodies come from content.html, not index.md: the Markdown export lost
 * list markers, nested lists and line breaks that the HTML still has. Front
 * matter in index.md gives the metadata. Re-running updates posts in place
 * (matched by WordPress id) and reuses images already uploaded.
 */
import fs from "node:fs";
import path from "node:path";
import { parseArgs } from "node:util";
import { parseHTML } from "linkedom";
import { parse as parseYaml } from "yaml";

const { values: args } = parseArgs({
  options: {
    url: { type: "string", default: "http://localhost:3000" },
    code: { type: "string", default: process.env.ADMIN_CODE },
    dir: { type: "string", default: "coordination wpisy/blog/posts" },
    only: { type: "string" },
  },
});

if (!args.code) {
  console.error("Brak kodu: ustaw ADMIN_CODE w .env albo podaj --code.");
  process.exit(1);
}

const base = args.url!.replace(/\/$/, "");
const auth = { Authorization: `Bearer ${args.code}` };

type ImageValue = { src: string; alt: string; width?: number; height?: number };
type Block = { id: string; type: "text"; html: string } | { id: string; type: "image"; image: ImageValue; href?: string };

type FrontMatter = {
  title: string;
  slug: string;
  date: string;
  status: string;
  author: string;
  wp_id: number;
  categories?: string[];
  featured_image?: string;
  seo_title?: string;
  seo_description?: string;
  focus_keyword?: string;
};

const AUTHORS: Record<string, string> = { szymonpirko: "Szymon Pirko" };

/** WordPress' "no category" placeholders, not real categories. */
const PLACEHOLDER_CATEGORIES = new Set(["Uncategorized", "Bez kategorii"]);

const ALLOWED = new Set([
  "p", "h2", "h3", "h4", "strong", "em", "code", "a", "ul", "ol", "li", "blockquote", "hr", "br",
  "table", "thead", "tbody", "tr", "th", "td",
]);
const RENAME: Record<string, string> = { b: "strong", i: "em", h1: "h2", h5: "h4", h6: "h4" };
const INLINE = new Set(["strong", "b", "em", "i", "code", "a", "span", "font", "br", "sup", "sub", "u"]);

let counter = 0;
const id = () => `i${(++counter).toString(36)}${Math.random().toString(36).slice(2, 6)}`;

const clean = (text: string) => text.replace(/\u200b/g, "");

/** WordPress dates are Warsaw wall-clock time without a zone. */
function warsawToIso(value: string) {
  const asUtc = new Date(`${value.replace(" ", "T")}Z`);
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone: "Europe/Warsaw",
      hourCycle: "h23",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
      .formatToParts(asUtc)
      .map((part) => [part.type, part.value]),
  );
  const shown = Date.UTC(+parts.year, +parts.month - 1, +parts.day, +parts.hour, +parts.minute, +parts.second);

  return new Date(asUtc.getTime() - (shown - asUtc.getTime())).toISOString();
}

function cleanHref(href: string) {
  try {
    const url = new URL(href.trim().replace(/^["']|["']$/g, ""));

    // Left behind by pasting answers from ChatGPT.
    if (url.searchParams.get("utm_source") === "chatgpt.com") url.searchParams.delete("utm_source");

    return url.toString();
  } catch {
    return href.trim();
  }
}

/** WordPress swaps emoji for Twemoji SVGs named after their code points. */
function emojiOf(img: Element) {
  const src = img.getAttribute("src") ?? "";
  const match = /(?:^|\/)([0-9a-f]{4,5}(?:-[0-9a-f]{4,5})*)\.svg$/i.exec(src);

  if (!match) return null;

  return img.getAttribute("alt") || String.fromCodePoint(...match[1].split("-").map((hex) => parseInt(hex, 16)));
}

/** Rebuilds an element with only the tags and attributes the editor knows. */
function sanitize(node: Node, document: Document): Node[] {
  if (node.nodeType === 3) {
    const text = clean(node.textContent ?? "");

    return text ? [document.createTextNode(text)] : [];
  }

  if (node.nodeType !== 1) return [];

  const element = node as Element;
  const tag = element.tagName.toLowerCase();

  if (tag === "img") {
    const emoji = emojiOf(element);

    return emoji ? [document.createTextNode(emoji)] : [];
  }

  const children = Array.from(element.childNodes).flatMap((child) => sanitize(child, document));
  const name = RENAME[tag] ?? tag;

  if (!ALLOWED.has(name)) return children;

  const out = document.createElement(name);

  if (name === "a") {
    const href = element.getAttribute("href");

    // Anchors without an address are plain text.
    if (!href) return children;

    out.setAttribute("href", cleanHref(href));
    if (element.getAttribute("target") === "_blank") out.setAttribute("target", "_blank");
  }

  for (const attribute of ["colspan", "rowspan"]) {
    const value = element.getAttribute(attribute);
    if (value && (name === "td" || name === "th")) out.setAttribute(attribute, value);
  }

  // Line breaks inside headings come from manual wrapping, not meaning.
  if (/^h[2-4]$/.test(name)) {
    for (const child of children) {
      if (child.nodeType === 1 && (child as Element).tagName.toLowerCase() === "br") out.append(" ");
      else out.append(child);
    }
  } else out.append(...children);

  const empty = !out.textContent?.replace(/[\s ]/g, "") && !out.querySelector("hr, br, td, th");

  if (empty && name !== "hr" && name !== "br" && name !== "td" && name !== "th") return [];

  return [out];
}

/** The one content image an element stands for (`img`, `a > img`, `p > a > img`), if that is all it holds. */
function standaloneImage(element: Element) {
  const images = Array.from(element.querySelectorAll("img")).filter((img) => !emojiOf(img));
  const self = element.tagName.toLowerCase() === "img" ? element : null;
  const img = self ?? (images.length === 1 ? images[0] : null);

  if (!img) return null;
  if (!self && element.textContent?.replace(/[\s ]/g, "")) return null;

  const link = img.closest("a");

  return { src: img.getAttribute("src") ?? "", alt: clean(img.getAttribute("alt") ?? "").trim(), href: link?.getAttribute("href") ?? undefined };
}

type Piece = { kind: "html"; html: string } | { kind: "image"; src: string; alt: string; href?: string };

function readBody(html: string, title: string): Piece[] {
  const { document } = parseHTML(html);
  const article = document.querySelector("article") ?? document.body;
  const pieces: Piece[] = [];
  let text: string[] = [];
  let inline: Node[] = [];

  const flushInline = () => {
    if (!inline.length) return;

    const paragraph = document.createElement("p");
    paragraph.append(...inline);
    inline = [];
    text.push(...sanitize(paragraph, document).map((node) => (node as Element).outerHTML));
  };

  const flushText = () => {
    flushInline();
    // An AI citation marker pasted into a post as literal text. linkedom splits
    // text at entities, so it is only whole in the serialised HTML.
    if (text.length) pieces.push({ kind: "html", html: text.join("").replace(/\s?&lt;Cite\b.*?\/&gt;/g, "") });
    text = [];
  };

  const walk = (nodes: Node[]) => {
    for (const node of nodes) {
      if (node.nodeType === 3) {
        if (node.textContent?.trim() || inline.length) inline.push(node);
        continue;
      }

      if (node.nodeType !== 1) continue;

      const element = node as Element;
      const tag = element.tagName.toLowerCase();
      const image = standaloneImage(element);

      if (image) {
        flushText();
        pieces.push({ kind: "image", ...image });
        continue;
      }

      if (tag === "section" || tag === "div") {
        flushInline();
        walk(Array.from(element.childNodes));
        continue;
      }

      if (INLINE.has(tag)) {
        inline.push(element);
        continue;
      }

      flushInline();

      // An H1 repeating the title (some posts put it after the intro) duplicates
      // the page's own heading and would open the table of contents.
      if (tag === "h1") {
        const heading = clean(element.textContent ?? "").trim();

        if (!heading || title.startsWith(heading.slice(0, 20))) continue;
      }

      const html = sanitize(element, document).map((out) => (out as Element).outerHTML).join("");

      if (html) text.push(html);
    }
  };

  walk(Array.from(article.childNodes));
  flushText();

  return pieces;
}

const uploaded = new Map<string, ImageValue>();

async function upload(file: string, alt: string): Promise<ImageValue> {
  const cached = uploaded.get(file);

  if (cached) return { ...cached, alt };

  const ext = path.extname(file).slice(1).toLowerCase();
  const type = ext === "svg" ? "image/svg+xml" : ext === "jpg" ? "image/jpeg" : `image/${ext}`;
  const form = new FormData();
  form.append("file", new Blob([fs.readFileSync(file)], { type }), path.basename(file));

  const response = await fetch(`${base}/api/admin/media`, { method: "POST", headers: auth, body: form });
  const data = (await response.json()) as { image?: ImageValue; error?: string };

  if (!response.ok || !data.image) throw new Error(`${path.basename(file)}: ${data.error ?? response.status}`);

  uploaded.set(file, data.image);

  return { ...data.image, alt };
}

async function importPost(folder: string) {
  const markdown = fs.readFileSync(path.join(folder, "index.md"), "utf8");
  const front = parseYaml(markdown.split(/^---$/m)[1]) as FrontMatter;
  const title = clean(front.title).trim();
  const pieces = readBody(fs.readFileSync(path.join(folder, "content.html"), "utf8"), title);

  const blocks: Block[] = [];

  for (const piece of pieces) {
    if (piece.kind === "html") {
      blocks.push({ id: id(), type: "text", html: piece.html });
      continue;
    }

    const file = path.join(folder, piece.src);

    if (!fs.existsSync(file)) {
      console.warn(`  ! brak pliku ${piece.src}`);
      continue;
    }

    const image = await upload(file, piece.alt);
    blocks.push({ id: id(), type: "image", image, ...(piece.href ? { href: cleanHref(piece.href) } : {}) });
  }

  const featured = front.featured_image && path.join(folder, front.featured_image);
  const cover = featured && fs.existsSync(featured) ? await upload(featured, title) : null;

  const post = {
    wpId: front.wp_id,
    title,
    slug: front.slug,
    status: front.status === "publish" ? "publish" : "draft",
    publishedAt: warsawToIso(front.date),
    author: AUTHORS[front.author] ?? front.author,
    categories: (front.categories ?? []).filter((name) => !PLACEHOLDER_CATEGORIES.has(name)),
    tags: [],
    cover,
    excerpt: "",
    seoTitle: front.seo_title ?? "",
    seoDescription: front.seo_description ?? "",
    focusKeyword: front.focus_keyword ?? "",
    // Elementor kept every widget in its own container: one row per block.
    content: {
      version: 1,
      rows: blocks.map((block) => ({ id: id(), layout: "1", columns: [{ id: id(), blocks: [block] }] })),
    },
  };

  const response = await fetch(`${base}/api/admin/import`, {
    method: "PUT",
    headers: { ...auth, "Content-Type": "application/json" },
    body: JSON.stringify(post),
  });
  const data = (await response.json()) as { error?: string };

  if (!response.ok) throw new Error(data.error ?? `HTTP ${response.status}`);

  return blocks.length;
}

const folders = fs
  .readdirSync(args.dir!)
  .flatMap((year) => fs.readdirSync(path.join(args.dir!, year)).map((name) => path.join(args.dir!, year, name)))
  .filter((folder) => fs.existsSync(path.join(folder, "index.md")))
  .filter((folder) => !args.only || path.basename(folder).includes(args.only))
  .sort();

console.log(`Import ${folders.length} wpisów do ${base}`);

let failed = 0;

for (const [index, folder] of folders.entries()) {
  try {
    const blocks = await importPost(folder);
    console.log(`${String(index + 1).padStart(3)}. ${path.basename(folder)} (${blocks} bloków)`);
  } catch (error) {
    failed++;
    console.error(`${String(index + 1).padStart(3)}. ${path.basename(folder)}: ${(error as Error).message}`);
  }
}

console.log(failed ? `Gotowe, ${failed} z błędem.` : "Gotowe.");
process.exitCode = failed ? 1 : 0;
