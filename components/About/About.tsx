import styles from "./About.module.css";

export default function About() {
  return (
    <section className={styles.about} id="o-nas">
      <div className={styles.aboutTitle}>
        <h2>Mała firma nie potrzebuje więcej chaosu. Potrzebuje spójnych decyzji.</h2>
      </div>
      <div className={styles.aboutCopy}>
        <p>W wielu małych firmach sprzedaż działa osobno, marketing osobno, realizacja osobno, a właściciel próbuje łączyć wszystko własnym czasem i energią. Nowa kampania, handlowiec czy proces mogą tylko zwiększyć chaos, jeśli firma nie wie, komu chce sprzedawać, na czym zarabia i według jakich zasad podejmuje decyzje.</p>
        <p>Coordination powstało po to, aby pomagać właścicielom zobaczyć firmę jako jeden system. Strategia, model biznesowy, sprzedaż, marketing, oferta i decyzje właścicielskie stają się elementami jednego sposobu działania.</p>
      </div>
    </section>
  );
}
