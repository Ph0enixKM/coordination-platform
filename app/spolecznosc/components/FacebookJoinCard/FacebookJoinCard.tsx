import { ArrowUpRight } from "lucide-react";
import { FacebookIcon } from "@/components/Footer/SocialIcons";
import styles from "./FacebookJoinCard.module.css";

/** The join link as a card in Facebook's own blue, so the destination is obvious at a glance. */
export default function FacebookJoinCard({ href }: { href: string }) {
  return (
    <a className={styles.card} href={href} target="_blank" rel="noreferrer noopener">
      <span className={styles.label}>Dołącz do nas na</span>
      <span className={styles.brand}>
        <FacebookIcon className={styles.logo} />
        facebooku
      </span>
      <ArrowUpRight className={styles.arrow} aria-hidden="true" />
    </a>
  );
}
