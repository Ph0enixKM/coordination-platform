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
import { parse as parseYaml } from "yaml";
import { AUTHORS, adminClient, clean, cleanHref, id, readBody, stack, warsawToIso, type Block, type ImageValue } from "./wordpress.mts";

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

const api = adminClient(args.url!, args.code);

const upload = (file: string, alt: string): Promise<ImageValue> =>
  api.upload(fs.readFileSync(file), path.basename(file), alt, file);

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

/** WordPress' "no category" placeholders, not real categories. */
const PLACEHOLDER_CATEGORIES = new Set(["Uncategorized", "Bez kategorii"]);

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
    content: stack(blocks),
  };

  await api.savePost(post);

  return blocks.length;
}

const folders = fs
  .readdirSync(args.dir!)
  .flatMap((year) => fs.readdirSync(path.join(args.dir!, year)).map((name) => path.join(args.dir!, year, name)))
  .filter((folder) => fs.existsSync(path.join(folder, "index.md")))
  .filter((folder) => !args.only || path.basename(folder).includes(args.only))
  .sort();

console.log(`Import ${folders.length} wpisów do ${api.base}`);

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
