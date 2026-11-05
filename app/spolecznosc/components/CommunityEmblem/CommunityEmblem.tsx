import CommunityLogo from "@/components/CommunityLogo/CommunityLogo";
import styles from "./CommunityEmblem.module.css";

/* Where the members sit on the two orbits, in degrees from the top. */
const inner = [20, 140, 250];
const outer = [70, 175, 300, 345];

/**
 * The community's S on a red glow, circled by two thin orbits with a few
 * members on them, turning slowly in opposite directions: the people around
 * the idea. Decorative; the title beside it names the community.
 */
export default function CommunityEmblem() {
  return (
    <div className={styles.emblem} aria-hidden="true">
      <span className={styles.glow} />
      <span className={styles.orbit} data-orbit="outer">
        {outer.map((angle) => (
          <span key={angle} className={styles.member} style={{ "--angle": `${angle}deg` } as React.CSSProperties} />
        ))}
      </span>
      <span className={styles.orbit} data-orbit="inner">
        {inner.map((angle) => (
          <span key={angle} className={styles.member} style={{ "--angle": `${angle}deg` } as React.CSSProperties} />
        ))}
      </span>
      <CommunityLogo className={styles.logo} />
    </div>
  );
}
