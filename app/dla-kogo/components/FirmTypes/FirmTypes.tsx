import { FIRM_TYPES } from "@/lib/content/firms";
import styles from "./FirmTypes.module.css";

export default function FirmTypes() {
  return (
    <div className={styles.grid}>
      {FIRM_TYPES.map((firm) => (
        <article key={firm.title} className={styles.card}>
          <h3 className={styles.title}>{firm.title}</h3>

          <p className={styles.symptom}>{firm.symptom}</p>

          <p className={styles.description}>{firm.description}</p>
        </article>
      ))}
    </div>
  );
}
