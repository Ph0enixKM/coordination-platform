import { ArrowUpRight } from "lucide-react";
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.heroInner}>
        <p className={styles.eyebrow}>coordination.pl</p>
        <p className={styles.heroTag}>Strategia operacyjna <i /> Przemysł 4.0</p>
        <h1>Rozwój firmy zaczyna się od dobrych decyzji</h1>
        <p className={styles.lead}><strong>Dla właścicieli małych firm usługowych, produkcyjnych i handlowych</strong></p>
        <p className={styles.heroCopy}>Codziennie wspieramy rozwój małych, polskich biznesów B2C oraz B2B, które chcą rosnąć w sposób świadomy i uporządkowany. Pomagamy projektować strategie, model biznesowy, sprzedaż oraz decyzje, które wzmacniają firmę.</p>
        <a className={styles.primaryButton} href="#dla-kogo">Dowiedz się więcej <ArrowUpRight aria-hidden="true" /></a>
      </div>
    </section>
  );
}
