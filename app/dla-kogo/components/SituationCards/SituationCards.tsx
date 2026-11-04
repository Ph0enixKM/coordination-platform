import type { ComponentType } from "react";
import {
  TrendingUp,
  UserRoundArrowLeft,
  Clover,
  Unlink,
  Percent,
  RotateCcw,
  type LucideProps,
} from "lucide-react";
import styles from "./SituationCards.module.css";

type Situation = {
  Icon: ComponentType<LucideProps>;
  title: string;
  description: string;
};

const SITUATIONS: readonly Situation[] = [
  {
    Icon: TrendingUp,
    title: "Firma rośnie przychodowo, ale nie poprawia wyniku",
    description:
      "Przyjmujesz zlecenia, które generują obrót, a nie marżę. Po miesiącu zostaje poczucie, że firma więcej pracuje, a nie więcej zarabia.",
  },
  {
    Icon: UserRoundArrowLeft,
    title: "Wszystkie decyzje wracają do właściciela",
    description:
      "Firma nie ruszy bez Twojego udziału w każdym temacie. Zespół czeka na zgodę, klienci na odpowiedź, a dzień składa się z gaszenia pożarów.",
  },
  {
    Icon: Clover,
    title: "Sprzedaż obiecuje to, co realizacja ledwo dowiezie",
    description:
      "Napięcie między działami. Klient dostaje mniej niż usłyszał, realizacja pracuje pod presją, a marża znika w poprawkach i pośpiechu.",
  },
  {
    Icon: Unlink,
    title: "Marketing i sprzedaż żyją osobno",
    description:
      "Kampanie generują leady, ale niewłaściwych. Sprzedaż liczy na przypadkowe zapytania. Działania marketingowe nie wspierają realnego procesu zakupu klienta.",
  },
  {
    Icon: Percent,
    title: "Firma konkuruje głównie ceną",
    description:
      "Brak jasnej propozycji wartości. Rabat to domyślna odpowiedź na wątpliwości klienta, a każda rozmowa o cenie kończy się ustępstwem.",
  },
  {
    Icon: RotateCcw,
    title: "Te same problemy rozwiązujesz od nowa",
    description:
      "Brak zasad. Wszystko przez indywidualne ustalenia, bieżące emocje i decyzje podejmowane od przypadku do przypadku - przy każdym nowym kliencie.",
  },
];

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
