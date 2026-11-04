
import type { Metadata } from "next";
import ContactMail from "@/components/ContactMail/ContactMail";
import SubpageHeader from "@/components/SubpageHeader/SubpageHeader";
import SectionIntro from "@/components/SectionIntro/SectionIntro";
import PhasePipeline from "@/components/PhasePipeline/PhasePipeline";
import Checklist, { type ChecklistEntry } from "@/components/Checklist/Checklist";
import CtaButton from "@/components/CtaButton/CtaButton";
import Footer from "@/components/Footer/Footer";
import SiteNav from "@/components/SiteNav/SiteNav";
import styles from "./proces.module.css";

export const metadata: Metadata = {
  title: "Jak pracujemy",
  description:
    "Proces pracy z Coordination - od diagnozy, przez ustalenie kierunku i strategii sprzedaży, po wdrożenie i utrzymanie. Z nami przejdziesz cały proces.",
  alternates: { canonical: "/proces" },
};

const phases: readonly { name: string; description: string }[] = [
  {
    name: "Projektowanie",
    description:
      "Na początku porządkujemy sposób działania firmy. Analizujemy klientów, ofertę, sprzedaż, marketing, decyzje właściciela i miejsca, w których firma traci czas, marżę lub kontrolę. Celem tego etapu jest ustalenie zasad, według których firma ma działać.",
  },
  {
    name: "Wdrażanie",
    description:
      "Ustalone zasady przekładamy na realne decyzje i codzienną pracę. Pracujemy na konkretnych sytuacjach: zapytaniach od klientów, ofertach, priorytetach, problemach w sprzedaży i napięciach organizacyjnych. Dzięki temu zmiana nie zostaje na poziomie rozmowy.",
  },
  {
    name: "Utrzymanie",
    description:
      "Firma zmienia się w czasie, dlatego zasady trzeba regularnie sprawdzać i korygować. Na tym etapie pilnujemy, aby firma nie wracała do dawnych nawyków, przypadkowych decyzji i działań, które wcześniej generowały chaos.",
  },
];

const checkpoints: readonly ChecklistEntry[] = [
  {
    id: "fit",
    text: "Sprawdzamy, czy Twoja firma jest właściwym miejscem do tego typu pracy i czy możemy realnie wnieść wartość.",
  },
  {
    id: "you",
    text: "Oceniasz, czy nasz sposób pracy, analizy i podejście do rozwiązywania problemów odpowiadają Twoim potrzebom.",
  },
];

const steps: readonly { number: string; title: string; description: string }[] = [
  {
    number: "01.",
    title: "Diagnoza i wspólne zrozumienie sytuacji",
    description:
      "Współpracę zaczynamy od uporządkowania faktów. Analizujemy, jak firma działa dziś na poziomie strategii, sprzedaży, marketingu i decyzji właścicielskich. Celem nie jest szybka ocena, lecz wspólne zrozumienie realnych przyczyn problemów. To etap, w którym porządkujemy obraz firmy i ustalamy, co naprawdę wymaga zmiany, a co jest tylko objawem.",
  },
  {
    number: "02.",
    title: "Ustalenie kierunku i priorytetów",
    description:
      "Na podstawie diagnozy wyznaczamy jasny kierunek działania firmy. Określamy priorytety, które mają największy wpływ na stabilność sprzedaży, produkcji i finansów. Eliminujemy działania poboczne. Właściciel zyskuje punkt odniesienia do każdej decyzji.",
  },
  {
    number: "03.",
    title: "Strategia na sprzedaż i marketing",
    description:
      "Ustalone decyzje strategiczne przekładamy na spójny sposób działania sprzedaży i marketingu. Sprawdzamy, czy oferta i komunikacja wspierają ten sam cel biznesowy. Porządkujemy to, co już funkcjonuje, tak aby zaczęło pracować jako jeden system.",
  },
  {
    number: "04.",
    title: "Wsparcie we wdrożeniu decyzji",
    description:
      "Pomagamy właścicielowi i zespołowi wdrażać ustalone kierunki w codziennym działaniu, bez zatrzymywania operacji bieżących. Celem jest realna zmiana sposobu działania, a nie stosy dokumentów.",
  },
  {
    number: "05.",
    title: "Uporządkowanie i poprawianie",
    description:
      "Porządkujemy wypracowane rozwiązania w jasny model działania firmy. Właściciel otrzymuje system, który może dalej rozwijać samodzielnie. Efektem jest firma, która działa przewidywalnie, a nie reaktywnie.",
  },
];

export default function ProcesPage() {
  return (
    <>
      <SiteNav variant="subpage" />
      <SubpageHeader
        title="Jak pracujemy"
        lead="Z nami przejdziesz cały proces - od zaprojektowania zasad działania, przez wdrożenie, po utrzymanie."
        crumbs={[{ label: "Strona główna", href: "/" }, { label: "Jak pracujemy" }]}
      />

      <section className={styles.phasesSection}>
        <div className={styles.container}>
          <PhasePipeline phases={phases}>
            <SectionIntro title="Z nami przejdziesz cały proces" />
          </PhasePipeline>
        </div>
      </section>

      <section className={styles.doradztwoSection}>
        <div className={styles.container}>
          <div className={styles.intro}>
            <SectionIntro title="Jak zaczyna się doradztwo strategiczne dla małej firmy">
              Nie zaczynamy od gotowej oferty ani deklaracji długoterminowej współpracy. Najpierw odbywamy trzy bezpłatne spotkania robocze, podczas których analizujemy Twoją firmę, sposób podejmowania decyzji, sprzedaż, ofertę, klientów i miejsca, w których pojawia się utrata marży, czasu lub kontroli.
            </SectionIntro>
          </div>
          <Checklist items={checkpoints} />
          <p className={styles.closingNote}>
            Dopiero po tych spotkaniach podejmujemy decyzję, czy wchodzimy we właściwą współpracę. Jeżeli nie ma dopasowania, nie kontynuujemy.
          </p>
        </div>
      </section>

      <section className={styles.stepsSection}>
        <div className={styles.stepsContainer}>
          <div className={styles.intro}>
            <SectionIntro title="Jak wygląda proces pracy z nami?" />
          </div>
          <ol className={styles.steps}>
            {steps.map((step) => (
              <li key={step.number} className={styles.step}>
                <span className={styles.stepNumber} aria-hidden="true">
                  {step.number}
                </span>
                <div className={styles.stepBody}>
                  <h3 className={styles.stepTitle}>{step.title}</h3>
                  <p className={styles.stepText}>{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <ContactMail />
      <Footer />
    </>
  );
}
