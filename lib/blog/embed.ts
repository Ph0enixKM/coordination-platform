/**
 * Turns links pasted in the editor into player addresses. Only the ids read
 * from a link make it into the address, so a post can embed nothing but
 * these players, whatever was typed.
 */

export type Embed = { src: string; title: string; height?: number };

function parse(value: string) {
  const text = value.trim();

  if (!text) return null;

  try {
    return new URL(/^[a-z]+:/i.test(text) ? text : `https://${text}`);
  } catch {
    return null;
  }
}

const YOUTUBE_ID = /^[\w-]{11}$/;

/** "90", "90s" or "1h2m3s" as seconds. */
function seconds(value: string | null) {
  if (!value) return 0;
  if (/^\d+s?$/.test(value)) return parseInt(value, 10);

  const match = /^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/.exec(value);

  return match ? Number(match[1] ?? 0) * 3600 + Number(match[2] ?? 0) * 60 + Number(match[3] ?? 0) : 0;
}

/** A YouTube video, short or playlist, played from youtube-nocookie.com. */
export function youtubeEmbed(link: string): Embed | null {
  const url = parse(link);

  if (!url) return null;

  const host = url.hostname.replace(/^(www|m|music)\./, "");
  const [first, second] = url.pathname.split("/").filter(Boolean);
  let id: string | undefined;

  if (host === "youtu.be") id = first;
  else if (host === "youtube.com" || host === "youtube-nocookie.com") {
    id = first === "watch" ? (url.searchParams.get("v") ?? undefined) : ["shorts", "embed", "live", "v"].includes(first) ? second : undefined;
  } else return null;

  const start = seconds(url.searchParams.get("t") ?? url.searchParams.get("start"));

  if (id && YOUTUBE_ID.test(id)) {
    return {
      src: `https://www.youtube-nocookie.com/embed/${id}${start ? `?start=${start}` : ""}`,
      title: "Film w serwisie YouTube",
    };
  }

  const list = url.searchParams.get("list");

  if (list && /^[\w-]+$/.test(list)) {
    return { src: `https://www.youtube-nocookie.com/embed/videoseries?list=${list}`, title: "Playlista w serwisie YouTube" };
  }

  return null;
}

const SPOTIFY_TYPES = new Set(["episode", "show", "track", "album", "playlist", "artist"]);

/** An episode or a whole show (or any other Spotify page) in Spotify's player. */
export function spotifyEmbed(link: string): Embed | null {
  const text = link.trim();
  let parts: string[];

  // Spotify's "copy URI": spotify:episode:<id>
  if (text.startsWith("spotify:")) parts = text.split(":").slice(1);
  else {
    const url = parse(text);

    if (!url || url.hostname !== "open.spotify.com") return null;

    // Localised links read /intl-pl/episode/<id>.
    parts = url.pathname.split("/").filter((part) => part && part !== "embed" && !part.startsWith("intl-"));
  }

  const [type, id] = parts;

  if (!SPOTIFY_TYPES.has(type) || !/^[A-Za-z0-9]{22}$/.test(id ?? "")) return null;

  return {
    src: `https://open.spotify.com/embed/${type}/${id}`,
    title: "Odtwarzacz Spotify",
    height: type === "episode" || type === "track" ? 152 : 352,
  };
}

/** A podcast, or one episode of it (?i=), in Apple's player. */
export function applePodcastsEmbed(link: string): Embed | null {
  const url = parse(link);

  if (!url || url.hostname !== "podcasts.apple.com") return null;

  // /pl/podcast/<name>/id<number>, the name being optional.
  const match = /^\/([a-z]{2})\/podcast\/(?:([^/]+)\/)?id(\d+)\/?$/.exec(url.pathname);

  if (!match) return null;

  const [, country, name, show] = match;
  const episode = url.searchParams.get("i");
  const path = `/${country}/podcast/${name ? `${encodeURIComponent(decodeURIComponent(name))}/` : ""}id${show}`;
  const query = episode && /^\d+$/.test(episode) ? `?i=${episode}` : "";

  return {
    src: `https://embed.podcasts.apple.com${path}${query}`,
    title: "Odtwarzacz Apple Podcasts",
    height: query ? 175 : 450,
  };
}
