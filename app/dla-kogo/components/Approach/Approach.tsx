import type { ComponentType } from "react";
import { Compass, MessagesSquare, Network, ScanSearch, type LucideProps } from "lucide-react";
import styles from "./Approach.module.css";

type Pillar = {
  Icon: ComponentType<LucideProps>;
  title: string;
  description: string;
};

/** What the work itself consists of, as „Na czym polega doradztwo” lays it out. */
const PILLARS: readonly Pillar[] = [
  {
    Icon: Network,
    title: "Patrzymy na firmę jako całość",
    description:
      "Strategia, sprzedaż, marketing, realizacja i decyzje właściciela są ze sobą powiązane. Zamiast poprawiać jeden dział, sprawdzamy, jak zmiana w jednym miejscu wpłynie na resztę firmy.",
  },
  {
    Icon: ScanSearch,
    title: "Najpierw szukamy przyczyn",
    description:
      "Spadająca marża, przeciążony właściciel czy nierówna sprzedaż to zwykle objawy. Zanim cokolwiek zmienimy, ustalamy, skąd naprawdę się biorą.",
  },
  {
    Icon: MessagesSquare,
    title: "Pracujemy na realnych sytuacjach",
    description:
      "Zapytania od klientów, oferty, rabaty, priorytety, decyzje o zatrudnieniu. Omawiamy konkretne przypadki z Twojej firmy, a nie przykłady z podręcznika.",
  },
  {
    Icon: Compass,
    title: "Ty zostajesz u steru",
    description:
      "Nie przejmujemy zarządzania. Pomagamy podejmować lepsze decyzje i z każdej wyprowadzamy zasadę, której firma użyje następnym razem - także bez nas.",
  },
];

export default function Approach() {
  return (
    <div className={styles.grid}>
      {PILLARS.map(({ Icon, title, description }) => (
        <article key={title} className={styles.card}>
          <span className={styles.icon} aria-hidden="true">
            <Icon />
          </span>
          <div className={styles.body}>
            <h3 className={styles.title}>{title}</h3>
            <p className={styles.description}>{description}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
