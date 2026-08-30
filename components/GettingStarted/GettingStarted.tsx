import SectionIntro from "@/components/SectionIntro/SectionIntro";
import styles from "./GettingStarted.module.css";

export default function GettingStarted() {
  return (
    <section className={styles.start}>
      <SectionIntro title="Jak zaczyna się doradztwo strategiczne dla małej firmy">
        Najpierw odbywamy trzy bezpłatne spotkania robocze, podczas których analizujemy firmę, sprzedaż, ofertę, klientów oraz miejsca utraty marży, czasu lub kontroli.
      </SectionIntro>
      <div className={styles.startGrid}>
        <article><b>01.</b><h3>Po pierwsze</h3><p>Sprawdzamy, czy Twoja firma jest właściwym miejscem do tego typu pracy i czy możemy realnie wnieść wartość.</p></article>
        <article><b>02.</b><h3>Po drugie</h3><p>Ty sprawdzasz, czy nasz sposób analizy, zadawania pytań i pracy nad decyzjami odpowiada temu, czego potrzebujesz.</p></article>
      </div>
      <p className={styles.centerNote}>Dopiero po tych spotkaniach podejmujemy decyzję, czy wchodzimy we właściwą współpracę. Jeżeli nie ma dopasowania - nie kontynuujemy.</p>
    </section>
  );
}
