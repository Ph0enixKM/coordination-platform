/**
 * Podcast PNO: where it is published, and its cover as Apple's public lookup
 * API gives it.
 */

export const PODCAST_APPLE_ID = "1722037002";
export const PODCAST_SPOTIFY = "https://open.spotify.com/show/0dlekJRAAzprqI93yYABGf";
export const PODCAST_APPLE = `https://podcasts.apple.com/pl/podcast/podcast-pno-strategicznie-o-firmie/id${PODCAST_APPLE_ID}`;
export const PODCAST_YOUTUBE = "https://www.youtube.com/@szymon_pirko";

/** The show's cover, 1200 px square. */
export async function fetchPodcastArtwork(init?: RequestInit): Promise<string | null> {
  const response = await fetch(`https://itunes.apple.com/lookup?id=${PODCAST_APPLE_ID}&country=pl`, init);

  if (!response.ok) throw new Error(`Apple lookup answered ${response.status}`);

  const { results = [] } = (await response.json()) as { results?: { artworkUrl600?: string }[] };

  // Apple's image server scales on request: .../600x600bb.jpg names the size.
  return results[0]?.artworkUrl600?.replace(/\/\d+x\d+bb\.(jpg|png|webp)$/, "/1200x1200bb.$1") ?? null;
}

/** The show's cover, or null when Apple does not answer in time; a page renders without it. */
export async function podcastArtworkOrNull(): Promise<string | null> {
  try {
    return await fetchPodcastArtwork({ signal: AbortSignal.timeout(8000) });
  } catch (error) {
    console.error("Fetching the podcast cover failed:", error);

    return null;
  }
}
