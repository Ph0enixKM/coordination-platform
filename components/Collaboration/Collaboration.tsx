import SectionIntro from "@/components/SectionIntro/SectionIntro";
import styles from "./Collaboration.module.css";

const steps = [
  ["01", "Projektowanie", "Analizujemy klientów, ofertę, sprzedaż, marketing i miejsca, w których firma traci czas, marżę lub kontrolę."],
  ["02", "Wdrażanie", "Ustalone zasady przekładamy na realne decyzje, oferty, priorytety i sposób pracy zespołu."],
  ["03", "Utrzymanie", "Regularnie sprawdzamy efekty i korygujemy sposób działania, aby firma nie wracała do dawnych nawyków."],
] as const;

export default function Collaboration() {
  return (
    <section className={styles.collaboration}>
      <SectionIntro title="Projektujemy, wdrażamy i utrzymujemy zmianę" />
      <img className={styles.collaborationLine} src="/assets/collaboration-line.png" alt="Schemat współpracy" />
      <div className={styles.threeColumns}>
        {steps.map(([number, title, copy]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{copy}</p></article>)}
      </div>
    </section>
  );
}
