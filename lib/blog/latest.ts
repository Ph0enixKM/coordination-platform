import { after } from "next/server";
import { getLatestPublishedPost } from "@/lib/blog/posts";
import type { PostSummary } from "@/lib/blog/types";

/**
 * The newest post, kept in memory so the home page renders without waiting
 * for D1.
 *
 * On Cloudflare every Worker isolate has its own copy. A save in /admin
 * reloads it at once only in the isolate that handled the save; the others
 * catch up within TTL, reloading in the background while they keep serving
 * what they have. An isolate that sat idle for longer than CHECK_AFTER would
 * hand its first visitor a post that old, so the page then asks the browser
 * to fetch /api/latest-post, which loads the post from D1 again.
 */

const TTL = 15 * 60_000;
const CHECK_AFTER = 12 * 60 * 60_000;

type Entry = { post: PostSummary | null; fetchedAt: number };

type State = {
  entry?: Entry;
  /** The load in flight, which concurrent requests share. */
  pending?: Promise<Entry>;
  /** Only the latest load may store its result: an older one may predate a save. */
  generation: number;
};

// On globalThis so every route bundle and `next dev` reload share one copy.
const globalState = globalThis as typeof globalThis & { __latestPost?: State };
const state = (globalState.__latestPost ??= { generation: 0 });

function load(): Promise<Entry> {
  const generation = ++state.generation;
  const promise = getLatestPublishedPost()
    .then((post) => {
      const entry = { post, fetchedAt: Date.now() };

      if (generation === state.generation) state.entry = entry;

      return entry;
    })
    .finally(() => {
      if (state.pending === promise) state.pending = undefined;
    });

  state.pending = promise;

  return promise;
}

/** Keeps the Worker alive until the reload finishes, after the response has gone out. */
function inBackground(promise: Promise<unknown>) {
  const logged = promise.catch((error) => console.error("Reloading the latest post failed:", error));

  try {
    after(logged);
  } catch {
    // Outside a request there is nothing to keep alive.
  }
}

/**
 * The post for the home page. `check` tells the browser to ask
 * /api/latest-post for a fresh one, because this isolate's copy is older than
 * CHECK_AFTER.
 */
export async function readLatestPost(): Promise<{ post: PostSummary | null; check: boolean }> {
  const { entry } = state;

  if (!entry) {
    try {
      return { post: (await (state.pending ?? load())).post, check: false };
    } catch (error) {
      // The page still renders, only without the section; the next visit tries again.
      console.error("Loading the latest post failed:", error);

      return { post: null, check: false };
    }
  }

  const age = Date.now() - entry.fetchedAt;

  if (age > TTL && !state.pending) inBackground(load());

  return { post: entry.post, check: age > CHECK_AFTER };
}

/**
 * For /api/latest-post. Goes to D1 only when this isolate's copy is older than
 * CHECK_AFTER, so visitors cannot make it query the database at will.
 */
export async function revalidateLatestPost(): Promise<PostSummary | null> {
  const { entry, pending } = state;

  if (pending) return (await pending).post;
  if (!entry || Date.now() - entry.fetchedAt > CHECK_AFTER) return (await load()).post;

  return entry.post;
}

/** Called after every save or delete in /admin, so this isolate shows the change at once. */
export async function refreshLatestPost() {
  try {
    await load();
  } catch (error) {
    // The save itself succeeded; forget the copy so the next visit loads it again.
    console.error("Reloading the latest post failed:", error);
    state.entry = undefined;
  }
}
