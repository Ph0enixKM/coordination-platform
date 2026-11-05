import { Check, X, Warehouse, Store, Building2 } from "lucide-react";
import styles from "./StageMatrix.module.css";

type Stage = {
  name: string;
  description: string;
  /** Whether Coordination works with companies at this stage. */
  works: boolean;
  /** What the badge's check or cross means, read out by screen readers only. */
  badge: string;
  /** Icon representing this stage. */
  icon: typeof Warehouse | typeof Store | typeof Building2;
};

const STAGES: readonly Stage[] = [
  {
    name: "Startup przed pierwszym klientem",
    description:
      "Firma, która dopiero buduje ofertę, szuka pierwszych klientów i nie ma jeszcze powtarzalnych przychodów. To inny etap rozwoju, który wymaga innego rodzaju wsparcia.",
    works: false,
    badge: "Poza obszarem",
    icon: Warehouse,
  },
  {
    name: "Firma 3–15 osób, która działa - ale rośnie za ciężko",
    description:
      "Mikro i mała firma z klientami, zespołem i przychodami. Wszystko już działa, ale dotychczasowy sposób działania kosztuje coraz więcej czasu, marży i uwagi właściciela. To nasz obszar.",
    works: true,
    badge: "To nasz obszar",
    icon: Store,
  },
  {
    name: "Korporacja z rozbudowaną strukturą zarządzania",
    description:
      "Firma z gotowym zarządem, procesami decyzyjnymi i szczeblami kierowniczymi. Tu problemy, którymi się zajmujemy, mają inną naturę i wymagają innej skali pracy.",
    works: false,
    badge: "Poza obszarem",
    icon: Building2,
  },
];

export default function StageMatrix() {
  return (
    <div className={styles.matrix}>
      {STAGES.map((stage) => {
        const Icon = stage.icon;
        return (
          <article
            key={stage.name}
            className={styles.card}
            data-works={stage.works ? "true" : "false"}
          >
            <span className={styles.badge} role="img" aria-label={stage.badge}>
              {stage.works ? <Check aria-hidden="true" /> : <X aria-hidden="true" />}
            </span>

            <div className={styles.iconWrapper} aria-hidden="true">
              <Icon />
            </div>

            <h3 className={styles.name}>{stage.name}</h3>

            <p className={styles.description}>{stage.description}</p>
          </article>
        );
      })}
    </div>
  );
}
