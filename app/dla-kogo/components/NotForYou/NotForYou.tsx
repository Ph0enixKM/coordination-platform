import { ArrowRight } from "lucide-react";
import styles from "./NotForYou.module.css";

type Redirection = {
  /** The situation that is not a fit. */
  situation: string;
  /** Where Coordination sends the owner instead. */
  redirect: string;
};

const REDIRECTIONS: readonly Redirection[] = [
  {
    situation:
      "Szukasz głównie wykonawcy kampanii reklamowej, nowej strony lub pozycjonowania",
    redirect: "Potrzebujesz agencji marketingowej, nie doradztwa strategicznego.",
  },
  {
    situation:
      "Potrzebujesz wsparcia finansowego, kredytu lub restrukturyzacji długów",
    redirect: "To problem finansowy, nie strategiczny - potrzebujesz doradcy finansowego.",
  },
  {
    situation:
      "Szukasz zewnętrznego dyrektora, który weźmie operacje na siebie",
    redirect: "Świadomie tego nie robimy - nie przejmujemy firmy od właściciela.",
  },
  {
    situation:
      "Twoja firma nie ma jeszcze powtarzalnych przychodów i stałych klientów",
    redirect: "To inny etap rozwoju, który wymaga innego rodzaju wsparcia.",
  },
];

export default function NotForYou() {
  return (
    <div className={styles.shell}>
      <ul className={styles.list}>
        {REDIRECTIONS.map((item) => (
          <li key={item.situation} className={styles.item}>
            <div className={styles.situationBlock}>
              <p className={styles.situation}>{item.situation}</p>
            </div>

            <div className={styles.arrow} aria-hidden="true">
              <ArrowRight />
            </div>

            <p className={styles.redirect}>{item.redirect}</p>
          </li>
        ))}
      </ul>

      <p className={styles.note}>
        Jeśli któryś z tych punktów lepiej opisuje Twoją sytuację, wciąż chętnie
        porozmawiamy - żeby pomóc Ci trafić do właściwego miejsca, nawet jeśli
        nie jest nim Coordination.
      </p>
    </div>
  );
}
