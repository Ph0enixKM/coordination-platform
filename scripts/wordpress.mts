/**
 * What the WordPress imports share: turning WordPress HTML into the editor's
 * blocks, and the admin API that uploads images and saves posts. Used by
 * import-blog.mts and import-podcasts.mts.
 */
import { parseHTML } from "linkedom";

export type ImageValue = { src: string; alt: string; width?: number; height?: number };
export type Block =
  | { id: string; type: "text"; html: string }
  | { id: string; type: "image"; image: ImageValue; href?: string }
  | { id: string; type: "video"; url: string }
  | { id: string; type: "podcast"; spotify: string; apple: string };

export const AUTHORS: Record<string, string> = { szymonpirko: "Szymon Pirko" };

const ALLOWED = new Set([
  "p", "h2", "h3", "h4", "strong", "em", "code", "a", "ul", "ol", "li", "blockquote", "hr", "br",
  "table", "thead", "tbody", "tr", "th", "td",
]);
const RENAME: Record<string, string> = { b: "strong", i: "em", h1: "h2", h5: "h4", h6: "h4" };
const INLINE = new Set(["strong", "b", "em", "i", "code", "a", "span", "font", "br", "sup", "sub", "u"]);

let counter = 0;
export const id = () => `i${(++counter).toString(36)}${Math.random().toString(36).slice(2, 6)}`;

export const clean = (text: string) => text.replace(/​/g, "");

/** WordPress dates are Warsaw wall-clock time without a zone. */
export function warsawToIso(value: string) {
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

export function cleanHref(href: string) {
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

  const empty = !out.textContent?.replace(/[\s ]/g, "") && !out.querySelector("hr, br, td, th");

  if (empty && name !== "hr" && name !== "br" && name !== "td" && name !== "th") return [];

  return [out];
}

/** The one content image an element stands for (`img`, `a > img`, `p > a > img`), if that is all it holds. */
function standaloneImage(element: Element) {
  const images = Array.from(element.querySelectorAll("img")).filter((img) => !emojiOf(img));
  const self = element.tagName.toLowerCase() === "img" ? element : null;
  const img = self ?? (images.length === 1 ? images[0] : null);

  if (!img) return null;
  if (!self && element.textContent?.replace(/[\s ]/g, "")) return null;

  const link = img.closest("a");

  return { src: img.getAttribute("src") ?? "", alt: clean(img.getAttribute("alt") ?? "").trim(), href: link?.getAttribute("href") ?? undefined };
}

export type Piece = { kind: "html"; html: string } | { kind: "image"; src: string; alt: string; href?: string };

/** A post's HTML as runs of editor-safe text and the images between them. */
export function readBody(html: string, title: string): Piece[] {
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

/** Each block in a row of its own, as Elementor and Gutenberg stack them. */
export const stack = (blocks: Block[]) => ({
  version: 1,
  rows: blocks.map((block) => ({ id: id(), layout: "1", columns: [{ id: id(), blocks: [block] }] })),
});

const IMAGE_TYPES: Record<string, string> = { jpg: "image/jpeg", jpeg: "image/jpeg", svg: "image/svg+xml" };

/** The admin API of a running site, local or production. */
export function adminClient(url: string, code: string) {
  const base = url.replace(/\/$/, "");
  const auth = { Authorization: `Bearer ${code}` };
  const uploaded = new Map<string, ImageValue>();

  return {
    base,

    /** Uploads an image once per `key`; the same image again only gets its own alt text. */
    async upload(bytes: Uint8Array, name: string, alt: string, key = name): Promise<ImageValue> {
      const cached = uploaded.get(key);

      if (cached) return { ...cached, alt };

      const ext = name.split(".").pop()!.toLowerCase();
      const form = new FormData();
      // A Buffer from fs is typed over ArrayBufferLike, which Blob does not take.
      form.append("file", new Blob([bytes as Uint8Array<ArrayBuffer>], { type: IMAGE_TYPES[ext] ?? `image/${ext}` }), name);

      const response = await fetch(`${base}/api/admin/media`, { method: "POST", headers: auth, body: form });
      const data = (await response.json()) as { image?: ImageValue; error?: string };

      if (!response.ok || !data.image) throw new Error(`${name}: ${data.error ?? response.status}`);

      uploaded.set(key, data.image);

      return { ...data.image, alt };
    },

    /** Creates the post, or updates the one imported earlier from the same WordPress post (`wpId`). */
    async savePost(post: Record<string, unknown> & { wpId: number }) {
      const response = await fetch(`${base}/api/admin/import`, {
        method: "PUT",
        headers: { ...auth, "Content-Type": "application/json" },
        body: JSON.stringify(post),
      });
      const data = (await response.json()) as { error?: string };

      if (!response.ok) throw new Error(data.error ?? `HTTP ${response.status}`);
    },
  };
}
