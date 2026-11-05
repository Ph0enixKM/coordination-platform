import styles from "./Prose.module.css";

/**
 * A typographic wrapper for long-form, article-style content - the legal pages
 * and anything else that reads as prose. Mirrors the paper-and-navy palette of
 * the landing page while keeping the text itself legible and uncluttered.
 */
export default function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.prose}>
      <div className={styles.sheet}>{children}</div>
    </div>
  );
}
