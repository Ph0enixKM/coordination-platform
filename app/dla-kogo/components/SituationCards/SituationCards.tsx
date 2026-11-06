import { SITUATIONS } from "@/lib/content/situations";
import styles from "./SituationCards.module.css";

export default function SituationCards() {
  return (
    <div className={styles.cloud}>
      {SITUATIONS.map(({ Icon, title, description }) => (
        <article key={title} className={styles.card}>
          <div className={styles.drift}>
            <span className={styles.icon} aria-hidden="true">
              <Icon />
            </span>
            <h3 className={styles.title}>{title}</h3>
            <p className={styles.description}>{description}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
