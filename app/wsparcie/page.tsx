import type { Metadata } from "next";
import SubpageHeader from "@/components/SubpageHeader/SubpageHeader";
import SectionIntro from "@/components/SectionIntro/SectionIntro";
import FeatureCards from "@/components/FeatureCards/FeatureCards";
import CtaButton from "@/components/CtaButton/CtaButton";
import Footer from "@/components/Footer/Footer";
import styles from "./wsparcie.module.css";

export const metadata: Metadata = {
  title: "Obszary wsparcia",
  description:
    "W czym pomagamy właścicielom małych firm — strategia, model biznesowy, oferta, sprzedaż, marketing, decyzje właścicielskie, procesy i planowanie.",
  alternates: { canonical: "/wsparcie" },
};

const areas: readonly { title: string; description: string }[] = [
  {
    title: "Strategia firmy i kierunek rozwoju",
    description:
      "Porządkujemy kierunek działania firmy, priorytety i decyzje, które mają największy wpływ na wynik. Strategia nie zostaje dokumentem, tylko staje się filtrem do codziennych wyborów właściciela i zespołu.",
  },
  {
    title: "Model biznesowy i rentowność",
    description:
      "Sprawdzamy, na czym firma naprawdę zarabia, które zlecenia i klienci budują wynik, a które tylko generują obrót, chaos i przeciążenie. Dzięki temu łatwiej podejmować decyzje o ofercie, cenach i kierunku rozwoju.",
  },
  {
    title: "Oferta i propozycja wartości",
    description:
      "Porządkujemy sposób mówienia o tym, co firma robi, dla kogo jest właściwym wyborem i dlaczego klient miałby wybrać właśnie ją. Dzięki temu sprzedaż nie opiera się wyłącznie na cenie ani przypadkowych rozmowach.",
  },
  {
    title: "Proces sprzedaży i pozyskiwanie klientów",
    description:
      "Analizujemy lejek sprzedaży, źródła zapytań, sposób kwalifikacji klientów, argumentację i ofertowanie. Celem jest bardziej przewidywalny proces sprzedaży, a nie ciągłe liczenie na polecenia, przypadkowe zapytania lub aktywność jednego handlowca.",
  },
  {
    title: "Marketing wspierający sprzedaż",
    description:
      "Ustawiamy komunikację, treści i stronę internetową tak, aby wspierały realny proces zakupu klienta. Marketing ma wzmacniać sprzedaż i budować zaufanie do firmy, a nie być zbiorem przypadkowych publikacji.",
  },
  {
    title: "Decyzje właścicielskie i odciążenie właściciela",
    description:
      "Pomagamy właścicielowi przestać być jedynym punktem kontroli w firmie. Ustalamy zasady podejmowania decyzji, odpowiedzialności i priorytety, dzięki którym firma może działać bardziej przewidywalnie bez ciągłego angażowania właściciela w każdy temat.",
  },
  {
    title: "Procesy i organizacja pracy",
    description:
      "Porządkujemy sposób realizacji zleceń, przepływ informacji, odpowiedzialności i momenty decyzyjne. Chodzi nie o biurokrację, lecz o to, aby firma nie rozwiązywała tych samych problemów od nowa przy każdym kliencie.",
  },
  {
    title: "Współpraca sprzedaży, marketingu i realizacji",
    description:
      "Łączymy działania handlowe, marketingowe i operacyjne w jeden spójny sposób pracy. Dzięki temu firma nie obiecuje klientom rzeczy, których nie może dowieźć, a sprzedaż nie generuje problemów dla realizacji.",
  },
  {
    title: "Planowanie, kontrola i poprawianie działania firmy",
    description:
      "Wprowadzamy prosty rytm pracy nad firmą: diagnozę sytuacji, decyzje, wdrożenie, obserwację efektów i korektę. Dzięki temu firma uczy się działać na podstawie faktów, a nie tylko intuicji i reakcji na bieżące problemy.",
  },
];

export default function WsparciePage() {
  return (
    <>
      <SubpageHeader
        title="Obszary wsparcia"
        lead="Pomagamy uporządkować firmę jako system powiązanych decyzji."
        crumbs={[{ label: "Strona główna", href: "/" }, { label: "Obszary wsparcia" }]}
      />

      <section className={styles.leadSection}>
        <div className={styles.container}>
          <p className={styles.leadText}>
            Pomagamy uporządkować firmę jako system powiązanych decyzji. Pracujemy nad tym, komu firma sprzedaje, na czym naprawdę zarabia, jak wygląda oferta, jak działa sprzedaż i marketing oraz które decyzje powinny przestać wracać za każdym razem do właściciela.
          </p>
        </div>
      </section>

      <section className={styles.areasSection}>
        <div className={styles.container}>
          <div className={styles.intro}>
            <SectionIntro title="W czym pomagamy właścicielom małych firm" />
          </div>
          <FeatureCards cards={areas} columns={3} />
        </div>
      </section>

      <section className={styles.ctaSection}>
        <div className={styles.ctaInner}>
          <h2 className={styles.ctaTitle}>Czas porozmawiać o Twojej firmie</h2>
          <p className={styles.ctaText}>
            Ta rozmowa to Twój pierwszy krok do uporządkowania strategii, sprzedaży i marketingu w jeden spójny system.
          </p>
          <CtaButton href="/#kontakt">Bezpłatna konsultacja</CtaButton>
        </div>
      </section>

      <Footer />
    </>
  );
}
