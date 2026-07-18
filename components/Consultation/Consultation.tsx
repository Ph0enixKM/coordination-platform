import styles from "./Consultation.module.css";

export default function Consultation() {
  return (
    <section className={styles.consultation} id="kontakt">
      <div className={styles.consultationInner}>
        <div className={styles.consultationCopy}>
          <h2>Czas porozmawiać o Twojej firmie</h2>
          <p>Ta rozmowa to Twój pierwszy krok do uporządkowania strategii, sprzedaży i marketingu w jeden spójny system.</p>
          <a className={styles.primaryButton} href="mailto:kontakt@coordination.pl?subject=Bezpłatna konsultacja">Umów bezpłatną konsultację</a>
        </div>
        <img src="/assets/testimonial.png" alt="Szymon Pirko wskazujący na treść konsultacji" />
      </div>
    </section>
  );
}
