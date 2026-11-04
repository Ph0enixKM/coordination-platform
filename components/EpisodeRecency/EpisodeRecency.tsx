"use client";

import { useEffect, useState } from "react";
import RecencyNote from "@/components/RecencyNote/RecencyNote";

type Lookup = { results?: { wrapperType?: string; releaseDate?: string }[] };

/**
 * How long ago the newest episode came out, above the podcast player. The
 * browser asks Apple's public lookup API, the one podcast directory that
 * answers pages on other sites; if that fails, nothing is shown.
 */
export default function EpisodeRecency({
  appleId,
  tone,
}: {
  appleId: string;
  /** As RecencyNote's: "dark" on navy (the default), "light" on the page background. */
  tone?: "dark" | "light";
}) {
  const [released, setReleased] = useState<number | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    fetch(`https://itunes.apple.com/lookup?id=${appleId}&entity=podcastEpisode&limit=3`, { signal: controller.signal })
      .then((response) => (response.ok ? (response.json() as Promise<Lookup>) : null))
      .then((data) => {
        // The first result is the podcast itself, the episodes follow it.
        const dates = (data?.results ?? [])
          .filter((result) => result.wrapperType === "podcastEpisode")
          .map((result) => Date.parse(result.releaseDate ?? ""))
          .filter(Number.isFinite);

        if (dates.length > 0) setReleased(Math.max(...dates));
      })
      .catch(() => {});

    return () => controller.abort();
  }, [appleId]);

  return <RecencyNote date={released} prefix="Nowy odcinek" tone={tone} />;
}
