"use client";

import { useId, useState } from "react";
import { applePodcastsEmbed, spotifyEmbed, youtubeEmbed } from "@/lib/blog/embed";
import styles from "./Embed.module.css";

/** A YouTube video at 16:9; nothing for a link that is not one. */
export function VideoEmbed({ url }: { url: string }) {
  const embed = youtubeEmbed(url);

  if (!embed) return null;

  return (
    <div className={styles.video}>
      <iframe
        src={embed.src}
        title={embed.title}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    </div>
  );
}

/* Single-colour marks in currentColor: Spotify's circle with its arcs cut out,
   Apple Podcasts' symbol without its tile. */

export function SpotifyLogo() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
      <mask id="spotify-arcs">
        <rect width="24" height="24" fill="#fff" />
        <g fill="none" stroke="#000" strokeLinecap="round">
          <path d="M6.4 9.3c3.6-1.2 8.2-.9 11.4 1" strokeWidth="1.9" />
          <path d="M7 12.5c3-.9 6.6-.6 9.3 1" strokeWidth="1.6" />
          <path d="M7.5 15.5c2.5-.6 5.1-.4 7.3.8" strokeWidth="1.3" />
        </g>
      </mask>
      <circle cx="12" cy="12" r="12" fill="currentColor" mask="url(#spotify-arcs)" />
    </svg>
  );
}

export function ApplePodcastsLogo() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round">
        <path d="M5.49 15.96a8.5 8.5 0 1 1 13.02 0" />
        <path d="M7.94 13.91a5.3 5.3 0 1 1 8.12 0" />
      </g>
      <circle cx="12" cy="10.5" r="2.4" fill="currentColor" />
      <path d="M10.6 14.3h2.8l-.55 7.2h-1.7z" fill="currentColor" />
    </svg>
  );
}

const PLATFORMS = [
  { key: "spotify", label: "Spotify", logo: SpotifyLogo, parse: spotifyEmbed },
  { key: "apple", label: "Apple Podcasts", logo: ApplePodcastsLogo, parse: applePodcastsEmbed },
] as const;

/**
 * A podcast player. With both links the reader picks the platform they
 * listen on from the logos beside it; with one, its player stands alone.
 * Every player stays mounted and the switch only hides the others, so going
 * back to one does not load it again (or restart what it was playing). The
 * hidden ones stay on the page, transparent, so they lazy-load together with
 * the one shown instead of only on the first switch.
 */
export function PodcastPlayer({
  spotify,
  apple,
  height: fixedHeight,
}: {
  spotify: string;
  apple: string;
  /** Overrides the platforms' own heights, e.g. a compact player for a whole show. */
  height?: number;
}) {
  const links = { spotify, apple };
  const players = PLATFORMS.flatMap((platform) => {
    const embed = platform.parse(links[platform.key]);

    return embed ? [{ ...platform, embed }] : [];
  });
  const [chosen, setChosen] = useState<string>(players[0]?.key ?? "spotify");
  const id = useId();

  if (players.length === 0) return null;

  const player = players.find((item) => item.key === chosen) ?? players[0];
  // Every player takes the tallest one's height, so the switch does not move
  // the page: Spotify's player stretches to fit, Apple's would be cut short.
  const height = fixedHeight ?? (Math.max(...players.map((item) => item.embed.height ?? 0)) || undefined);

  return (
    <div className={styles.podcast}>
      {players.length > 1 && (
        <div className={styles.tabs} role="tablist" aria-label="Słuchaj w" aria-orientation="vertical">
          {players.map((item) => (
            <button
              key={item.key}
              type="button"
              role="tab"
              className={styles.tab}
              aria-selected={item.key === player.key}
              aria-controls={`${id}-${item.key}`}
              aria-label={item.label}
              title={item.label}
              onClick={() => setChosen(item.key)}
            >
              <item.logo />
            </button>
          ))}
        </div>
      )}
      <div className={styles.players}>
        {players.map((item) => (
          <iframe
            key={item.key}
            id={`${id}-${item.key}`}
            className={styles.player}
            data-active={item.key === player.key ? "" : undefined}
            // Out of reach for the keyboard and screen readers while hidden.
            inert={item.key !== player.key}
            src={item.embed.src}
            title={item.embed.title}
            height={height}
            loading="lazy"
            allow="autoplay *; clipboard-write; encrypted-media *; fullscreen *; picture-in-picture"
            // The sandbox Apple's own embed code comes with.
            sandbox={
              item.key === "apple"
                ? "allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation"
                : undefined
            }
          />
        ))}
      </div>
    </div>
  );
}
