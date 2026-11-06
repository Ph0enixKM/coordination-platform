/**
 * Imports the podcast entries from a WordPress export (WXR) of the "podcast"
 * post type through the admin API, the way import-blog.mts imports posts:
 *
 *   npm run podcasts:import                                   # http://localhost:3000, ADMIN_CODE from .env
 *   npm run podcasts:import -- --url https://coordination.pl --code <ADMIN_CODE>
 *   npm run podcasts:import -- --only pno-152                 # selected entries
 *
 * Each entry becomes a post in the "Podcast" category, so it is listed at
 * /podcasty: the episode's player (Spotify and Apple Podcasts) on top, the
 * article, then its FAQ. Re-running updates the posts in place (matched by
 * WordPress id).
 */
import fs from "node:fs";
import { parseArgs } from "node:util";
import { AUTHORS, adminClient, clean, id, readBody, stack, type Block, type ImageValue } from "./wordpress.mts";

const { values: args } = parseArgs({
  options: {
    url: { type: "string", default: "http://localhost:3000" },
    code: { type: "string", default: process.env.ADMIN_CODE },
    file: { type: "string", default: "coordination wpisy/coordination.WordPress.2026-11-06-podcasty.xml" },
    only: { type: "string" },
  },
});

if (!args.code) {
  console.error("Brak kodu: ustaw ADMIN_CODE w .env albo podaj --code.");
  process.exit(1);
}

/** Must match PODCAST_CATEGORY in lib/blog/rows.ts. */
const PODCAST_CATEGORY = "Podcast";

const api = adminClient(args.url!, args.code);

// A WXR file is RSS with every value in CDATA, so its fields are read as text.
const cdata = (value: string) => value.replace(/^<!\[CDATA\[([\s\S]*)\]\]>$/, "$1");

function field(item: string, tag: string) {
  const match = new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`).exec(item);

  return match ? cdata(match[1].trim()) : "";
}

function meta(item: string) {
  const values = new Map<string, string>();

  for (const [, key, value] of item.matchAll(
    /<wp:meta_key><!\[CDATA\[([\s\S]*?)\]\]><\/wp:meta_key>\s*<wp:meta_value><!\[CDATA\[([\s\S]*?)\]\]><\/wp:meta_value>/g,
  )) {
    values.set(key, value);
  }

  return values;
}

const xml = fs.readFileSync(args.file!, "utf8");
const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map((match) => match[1]);
const attachments = new Map(
  items
    .filter((item) => field(item, "wp:post_type") === "attachment")
    // Their alt text in WordPress is the file name, so it is not kept.
    .map((item) => [field(item, "wp:post_id"), field(item, "wp:attachment_url")]),
);

const escape = (text: string) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/**
 * The plain-text FAQ field as question and answer pairs. Entries write it two
 * ways: blank lines between every question and answer, or a question with its
 * answer on the next line and blank lines between the pairs.
 */
function readFaq(text: string) {
  const paragraphs = text
    .replace(/\r\n/g, "\n")
    .split(/\n\s*\n/)
    .map((part) => part.trim())
    .filter(Boolean);
  const pairs: { question: string; answer: string }[] = [];

  for (let index = 0; index < paragraphs.length; index++) {
    const [first, ...rest] = paragraphs[index].split("\n");
    const question = first.replace(/^❓\s*/, "").trim();
    const answer = rest.length ? rest.join(" ") : (paragraphs[++index] ?? "");

    if (question && answer.trim()) pairs.push({ question, answer: answer.trim() });
  }

  return pairs;
}

const faqHtml = (pairs: { question: string; answer: string }[]) =>
  `<h2>Często zadawane pytania</h2>${pairs.map(({ question, answer }) => `<h3>${escape(question)}</h3><p>${escape(answer)}</p>`).join("")}`;

/** Gutenberg's YouTube embeds hold nothing but the link: they become video blocks. */
const YOUTUBE_EMBED = /<figure class="wp-block-embed[^"]*is-provider-youtube[^"]*">[\s\S]*?(https:\/\/\S+?)\s*<\/div><\/figure>/g;

function bodyBlocks(html: string, title: string): Block[] {
  const blocks: Block[] = [];
  let at = 0;

  const text = (chunk: string) => {
    for (const piece of readBody(`<!doctype html><html><body>${chunk}</body></html>`, title)) {
      // The podcast bodies hold no pictures of their own.
      if (piece.kind === "html") blocks.push({ id: id(), type: "text", html: piece.html });
    }
  };

  for (const match of html.matchAll(YOUTUBE_EMBED)) {
    text(html.slice(at, match.index));
    blocks.push({ id: id(), type: "video", url: match[1] });
    at = match.index + match[0].length;
  }

  text(html.slice(at));

  return blocks;
}

const covers = new Map<string, ImageValue | null>();

/** The entry's featured image (every one has the show's cover), uploaded once. */
async function cover(thumbnailId: string | undefined, alt: string) {
  const url = thumbnailId ? attachments.get(thumbnailId) : undefined;

  if (!url) return null;

  if (!covers.has(url)) {
    const response = await fetch(url);

    if (!response.ok) throw new Error(`okładka ${url}: HTTP ${response.status}`);

    covers.set(url, await api.upload(new Uint8Array(await response.arrayBuffer()), url.split("/").pop()!, alt, url));
  }

  const image = covers.get(url);

  return image ? { ...image, alt } : null;
}

async function importEntry(item: string) {
  const values = meta(item);
  const title = clean(field(item, "title")).replace(/\s+/g, " ").trim();
  const value = (...keys: string[]) => keys.map((key) => values.get(key)?.trim()).find(Boolean) ?? "";

  const blocks: Block[] = [];
  const spotify = value("link_spotify");
  const apple = value("link_apple");

  if (spotify || apple) blocks.push({ id: id(), type: "podcast", spotify, apple });

  blocks.push(...bodyBlocks(field(item, "content:encoded"), title));

  const faq = readFaq(value("podcast_faq_simple"));

  if (faq.length) blocks.push({ id: id(), type: "text", html: faqHtml(faq) });

  const post = {
    wpId: Number(field(item, "wp:post_id")),
    title,
    slug: field(item, "wp:post_name"),
    status: field(item, "wp:status") === "publish" ? "publish" : "draft",
    publishedAt: new Date(`${field(item, "wp:post_date_gmt").replace(" ", "T")}Z`).toISOString(),
    author: AUTHORS[field(item, "dc:creator")] ?? field(item, "dc:creator"),
    categories: [PODCAST_CATEGORY],
    tags: [],
    cover: await cover(values.get("_thumbnail_id"), "Okładka podcastu PNO"),
    excerpt: "",
    // Yoast is the SEO plugin the site uses; some entries also kept Rank Math's.
    seoTitle: value("_yoast_wpseo_title", "rank_math_title"),
    seoDescription: value("_yoast_wpseo_metadesc", "rank_math_description"),
    focusKeyword: value("_yoast_wpseo_focuskw", "rank_math_focus_keyword"),
    content: stack(blocks),
  };

  await api.savePost(post);

  return { slug: post.slug, blocks: blocks.length, faq: faq.length };
}

const entries = items
  .filter((item) => field(item, "wp:post_type") === "podcast")
  .filter((item) => !args.only || field(item, "wp:post_name").includes(args.only))
  .sort((a, b) => field(a, "wp:post_date_gmt").localeCompare(field(b, "wp:post_date_gmt")));

console.log(`Import ${entries.length} odcinków do ${api.base}`);

let failed = 0;

for (const [index, item] of entries.entries()) {
  const number = String(index + 1).padStart(3);

  try {
    const { slug, blocks, faq } = await importEntry(item);
    console.log(`${number}. ${slug} (${blocks} bloków, ${faq} pytań FAQ)`);
  } catch (error) {
    failed++;
    console.error(`${number}. ${field(item, "wp:post_name")}: ${(error as Error).message}`);
  }
}

console.log(failed ? `Gotowe, ${failed} z błędem.` : "Gotowe.");
process.exitCode = failed ? 1 : 0;
