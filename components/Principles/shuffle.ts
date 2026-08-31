/**
 * A new order for the same values, never the one that is already on screen.
 *
 * Two of the drawings deal their values out again on every turn of their loop,
 * so that neither of them ends up claiming that the interesting one is always
 * in the same place.
 */
export function reshuffled<T>(values: readonly T[], previous: readonly T[]): T[] {
  const next = [...values];

  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));

    [next[i], next[j]] = [next[j], next[i]];
  }

  return next.every((value, index) => value === previous[index])
    ? reshuffled(values, previous)
    : next;
}
