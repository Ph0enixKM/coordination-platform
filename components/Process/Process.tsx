import SectionIntro from "@/components/SectionIntro/SectionIntro";
import styles from "./Process.module.css";

const process = [
  ["01", "Diagnoza i wspólne zrozumienie sytuacji", "Analizujemy, jak firma działa dziś na poziomie strategii, sprzedaży, marketingu i decyzji właścicielskich. Porządkujemy fakty i oddzielamy przyczyny od objawów.", "/assets/process-diagnosis.png"],
  ["02", "Ustalenie kierunku i priorytetów", "Na podstawie diagnozy wyznaczamy kierunek działania i priorytety o największym wpływie na stabilność sprzedaży, produkcji i finansów.", "/assets/process-priorities.png"],
  ["03", "Strategia na sprzedaż i marketing", "Decyzje strategiczne przekładamy na spójny sposób działania sprzedaży i marketingu. Oferta i komunikacja zaczynają wspierać ten sam cel.", "/assets/process-marketing.png"],
  ["04", "Wsparcie we wdrożeniu decyzji", "Pomagamy właścicielowi i zespołowi wdrażać ustalone kierunki w codziennym działaniu bez zatrzymywania bieżącej pracy.", "/assets/process-implementation.png"],
  ["05", "Uporządkowanie i poprawianie", "Wypracowane rozwiązania układamy w jasny model działania. Efektem jest firma, która działa przewidywalnie, a nie reaktywnie.", "/assets/process-finish.png"],
] as const;

export default function Process() {
  return (
    <section className={styles.process} id="proces">
      <SectionIntro title="Jeden spójny proces zmiany" />
      <div className={styles.processList}>
        {process.map(([number, title, copy, image], index) => (
          <article key={number} className={index % 2 ? styles.processReverse : undefined}>
            <div className={styles.processImage}><img src={image} alt="" /></div>
            <div className={styles.processCopy}><span>{number}.</span><h3>{title}</h3><p>{copy}</p></div>
          </article>
        ))}
      </div>
    </section>
  );
}
