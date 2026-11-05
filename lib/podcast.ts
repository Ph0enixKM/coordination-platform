/**
 * Podcast PNO: where it is published, and its cover as Apple's public lookup
 * API gives it.
 */

export const PODCAST_APPLE_ID = "1722037002";
export const PODCAST_SPOTIFY = "https://open.spotify.com/show/0dlekJRAAzprqI93yYABGf";
export const PODCAST_APPLE = `https://podcasts.apple.com/pl/podcast/podcast-pno-strategicznie-o-firmie/id${PODCAST_APPLE_ID}`;
export const PODCAST_YOUTUBE = "https://www.youtube.com/@szymon_pirko";

/**
 * Spreaker, which hosts the episodes, plays every one of them in its own
 * player: the whole show as the playlist, newest on top, back to the first.
 * The same player the old coordination.pl embedded, without its loader
 * script, which only swaps a link for this iframe.
 */
export const PODCAST_SPREAKER_PLAYER = `https://widget.spreaker.com/player?${new URLSearchParams({
  show_id: "5938738",
  theme: "light",
  playlist: "show",
  "playlist-continuous": "false",
  "chapters-image": "true",
  episode_image_position: "right",
  "hide-download": "true",
})}`;

/** The show's cover, 1200 px square. */
export async function fetchPodcastArtwork(init?: RequestInit): Promise<string | null> {
  const response = await fetch(`https://itunes.apple.com/lookup?id=${PODCAST_APPLE_ID}&country=pl`, init);

  if (!response.ok) throw new Error(`Apple lookup answered ${response.status}`);

  const { results = [] } = (await response.json()) as { results?: { artworkUrl600?: string }[] };

  // Apple's image server scales on request: .../600x600bb.jpg names the size.
  return results[0]?.artworkUrl600?.replace(/\/\d+x\d+bb\.(jpg|png|webp)$/, "/1200x1200bb.$1") ?? null;
}
