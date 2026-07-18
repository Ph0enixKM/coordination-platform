import SectionIntro from "@/components/SectionIntro/SectionIntro";
import { ArrowRight, ChartPie, Gem, RefreshCw, Repeat2, Sparkles, TrendingUp, UserCog, Workflow } from "lucide-react";
import styles from "./SupportAreas.module.css";

const supportAreas = [
  [TrendingUp, "Strategia firmy i kierunek rozwoju", "Porządkujemy kierunek działania firmy, priorytety i decyzje, które mają największy wpływ na wynik."],
  [ChartPie, "Model biznesowy i rentowność", "Sprawdzamy, na czym firma naprawdę zarabia, a które zlecenia generują tylko obrót i przeciążenie."],
  [Gem, "Oferta i propozycja wartości", "Ustalamy, dla kogo firma jest właściwym wyborem i dlaczego klient miałby wybrać właśnie ją."],
  [ArrowRight, "Proces sprzedaży i pozyskiwanie klientów", "Analizujemy lejek, źródła zapytań, kwalifikację klientów, argumentację i ofertowanie."],
  [Sparkles, "Marketing wspierający sprzedaż", "Ustawiamy komunikację, treści i stronę tak, aby wspierały realny proces zakupu klienta."],
  [UserCog, "Decyzje właścicielskie", "Pomagamy właścicielowi przestać być jedynym punktem kontroli i ustalić jasne odpowiedzialności."],
  [Workflow, "Procesy i organizacja pracy", "Porządkujemy realizację zleceń, przepływ informacji i momenty decyzyjne bez zbędnej biurokracji."],
  [Repeat2, "Sprzedaż, marketing i realizacja", "Łączymy działania handlowe, marketingowe i operacyjne w jeden spójny sposób pracy."],
  [RefreshCw, "Planowanie i poprawianie", "Wprowadzamy prosty rytm: diagnoza, decyzje, wdrożenie, obserwacja efektów i korekta."],
] as const;

export default function SupportAreas() {
  return (
    <section className={styles.support} id="wsparcie">
      <SectionIntro kicker="Firma jako system" title="W czym pomagamy właścicielom małych firm">
        Pracujemy nad tym, komu firma sprzedaje, na czym naprawdę zarabia, jak działa oferta, sprzedaż i marketing oraz które decyzje powinny przestać wracać do właściciela.
      </SectionIntro>
      <div className={styles.supportGrid}>
        {supportAreas.map(([Icon, title, copy]) => (
          <article key={title}>
            <Icon className={styles.lineIcon} aria-hidden="true" />
            <h3>{title}</h3>
            <p>{copy}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
