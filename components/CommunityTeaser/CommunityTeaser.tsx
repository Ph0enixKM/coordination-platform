import Link from "next/link";
import { ArrowRight } from "lucide-react";
import CommunityLogo from "@/components/CommunityLogo/CommunityLogo";
import styles from "./CommunityTeaser.module.css";

/**
 * A pointer to the community page, set under a blog post: someone who read
 * to the end is the reader most likely to want to keep talking about it.
 * Dressed in the community's own navy and red, like its page header, so it
 * reads as a door into that page. The whole card is the link.
 */
export default function CommunityTeaser() {
  return (
    <aside className={styles.teaser} aria-labelledby="community-teaser-title">
      <span className={styles.glow} aria-hidden="true">
        <CommunityLogo />
      </span>

      <span className={styles.mark}>
        <CommunityLogo />
      </span>

      <div className={styles.copy}>
        <h2 id="community-teaser-title" className={styles.title}>
          Strategicznie o firmie
        </h2>
        <p className={styles.text}>
          Darmowa, zamknięta grupa dla właścicieli firm, w której łączymy strategię, sprzedaż i
          marketing w spójną całość.
        </p>
        <Link href="/spolecznosc" className={styles.link}>
          Dowiedz się więcej o naszej społeczności
          <ArrowRight size={18} aria-hidden="true" />
        </Link>
      </div>
    </aside>
  );
}
