import type { Metadata } from "next";
import SubpageHeader from "@/components/SubpageHeader/SubpageHeader";
import SectionIntro from "@/components/SectionIntro/SectionIntro";
import FeatureCards, { type FeatureCard } from "@/components/FeatureCards/FeatureCards";
import CtaButton from "@/components/CtaButton/CtaButton";
import Footer from "@/components/Footer/Footer";
import styles from "./dla-kogo.module.css";

export const metadata: Metadata = {
  title: "Doradztwo dla firm",
  description:
    "Doradztwo strategiczne dla małych firm usługowych, produkcyjnych i handlowych. Uporządkuj strategię, sprzedaż i marketing w jeden spójny system.",
  alternates: { canonical: "/dla-kogo" },
};

type FirmTypeCard = {
  title: string;
  description: string;
  pricingNote: string;
};

const firmTypeCards: readonly FirmTypeCard[] = [
  {
    title: "Firmy produkcyjne",
    description:
      "W firmach produkcyjnych najczęściej pracujemy nad relacją między strategią, sprzedażą, decyzjami handlowymi, realizacją i rentownością. Problemem bardzo często nie jest sam brak sprzedaży, tylko to, że firma przyjmuje zlecenia, które generują obrót, ale nie zawsze budują wynik. Część decyzji sprzedażowych może obciążać realizację, obniżać marżę albo powodować napięcia między tym, co zostało obiecane klientowi, a tym, co firma może wykonać w zdrowy sposób. Dlatego w takich firmach porządkujemy zasady wyboru klientów, kwalifikacji zapytań, wyceny, sprzedaży i podejmowania decyzji, które mają bezpośredni wpływ na wynik firmy.",
    pricingNote: "Firmy produkcyjne przeważnie zostawiają u nas 2300–4000 zł netto miesięcznie.",
  },
  {
    title: "Firmy usługowe i eksperckie",
    description:
      "W firmach usługowych i eksperckich najczęściej pracujemy nad strategią, ofertą, sprzedażą, zakresem współpracy z klientem i sposobem komunikowania wartości. Problemem często nie jest brak kompetencji, tylko to, że firma obsługuje zbyt szeroki zakres klientów, przyjmuje zbyt indywidualne projekty albo nie ma jasnych zasad, gdzie kończy się opłacalna współpraca, a gdzie zaczyna się praca, która pochłania czas i nie przekłada się proporcjonalnie na wynik. W takich firmach pomagamy uporządkować, dla kogo firma jest właściwym wyborem, jaki problem rozwiązuje, jak powinna sprzedawać swoją wartość i jakich warunków współpracy nie powinna przyjmować.",
    pricingNote: "Firmy usługowe przeważnie zaczynają współpracę od około 1800 zł netto miesięcznie.",
  },
  {
    title: "Firmy handlowe, techniczne i projektowe",
    description:
      "W firmach handlowych, technicznych i projektowych najczęściej pracujemy nad tym, żeby sprzedaż, oferta, marketing i decyzje operacyjne zaczęły wynikać z jednej logiki. Często firma ma klientów i zapytania, ale działa zbyt reaktywnie: sprzedaje to, co akurat da się sprzedać, konkuruje ceną albo nie ma jasno określonego segmentu, na którym chce budować przewagę. W takich firmach porządkujemy strategię, propozycję wartości, proces sprzedaży, sposób kwalifikacji klientów i zasady podejmowania decyzji, żeby firma nie generowała jedynie obrotu, ale świadomie budowała rentowny model działania.",
    pricingNote:
      "Firmy tego typu przeważnie zostawiają u nas kwoty zbliżone do podstawowego zakresu współpracy, czyli 2300–4000 zł netto miesięcznie.",
  },
];

const cooperationCards: readonly FeatureCard[] = [
  {
    title: "Firmy usługowe i eksperckie",
    description:
      "Pomagamy uporządkować ofertę, proces sprzedaży, komunikację i sposób pracy z klientami, aby rozwój nie zależał wyłącznie od właściciela i jego osobistego zaangażowania.",
  },
  {
    title: "Firmy produkcyjne i techniczne",
    description:
      "Porządkujemy decyzje handlowe, priorytety, ofertowanie i współpracę sprzedaży z realizacją, aby firma nie przyjmowała zleceń, które generują obrót, ale niszczą marżę i planowanie.",
  },
  {
    title: "Firmy handlowe i dystrybucyjne",
    description:
      "Pomagamy określić, na czym firma ma konkurować poza ceną, jakich klientów wybierać i jak zbudować bardziej przewidywalny proces sprzedaży.",
  },
  {
    title: "Firmy rodzinne",
    description:
      "Pomagamy oddzielić relacje od zarządzania, uporządkować role, odpowiedzialności i sposób podejmowania decyzji, aby firma nie zależała od nieformalnych ustaleń i bieżących emocji.",
  },
];

export default function DlaKogoPage() {
  return (
    <>
      <SubpageHeader
        title="Doradztwo dla firm"
        lead="Dla właścicieli małych firm usługowych, produkcyjnych i handlowych, które chcą rosnąć w sposób świadomy i uporządkowany."
        crumbs={[{ label: "Strona główna", href: "/" }, { label: "Doradztwo dla firm" }]}
      />

      <section className={styles.lead}>
        <div className={styles.leadInner}>
          <p className={styles.leadText}>
            Pracujemy z mikro i małymi firmami, które już działają, mają klientów, zespół i przychody,
            ale zaczynają widzieć, że dalszy rozwój wymaga uporządkowania strategii, sprzedaży,
            marketingu i sposobu podejmowania decyzji. Najczęściej są to firmy zatrudniające od 3 do 15
            osób, ponieważ właśnie na tym etapie firma nie jest już prostą działalnością opartą
            wyłącznie na pracy właściciela, ale też nie ma jeszcze rozbudowanej struktury zarządzania.
            Nie ograniczamy się wyłącznie do jednej branży, ponieważ problem, którym się zajmujemy,
            najczęściej nie wynika z samego rodzaju działalności, lecz z tego, że firma przestaje
            działać jako spójny system.
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.inner}>
          <div className={styles.intro}>
            <SectionIntro title="Dla jakich firm jesteśmy właściwym wyborem?" />
          </div>

          <div className={styles.firmTypes}>
            {firmTypeCards.map((card) => (
              <article key={card.title} className={styles.firmCard}>
                <h3 className={styles.firmTitle}>{card.title}</h3>
                <p className={styles.firmDescription}>{card.description}</p>
                <p className={styles.pricingNote}>{card.pricingNote}</p>
              </article>
            ))}
          </div>

          <p className={styles.pricingDisclaimer}>
            Podane kwoty nie są sztywnym cennikiem pakietów. Pokazują raczej, ile przeważnie
            zostawiają u nas firmy podobnej wielkości i o podobnym poziomie złożoności. Dokładny zakres
            współpracy ustalamy dopiero po poznaniu firmy, ponieważ najpierw musimy zrozumieć, czy
            problem dotyczy głównie strategii, sprzedaży, marketingu, decyzji właściciela, czy całego
            modelu działania firmy.
          </p>
        </div>
      </section>

      <section className={styles.cooperation}>
        <div className={styles.inner}>
          <div className={styles.intro}>
            <SectionIntro title="Dla jakich firm jest ta współpraca">
              Pracujemy z właścicielami firm, które już działają, mają klientów, zespół i powtarzalne
              przychody, ale zaczynają odczuwać, że dalszy rozwój nie może opierać się wyłącznie na
              intuicji, osobistym zaangażowaniu właściciela i gaszeniu bieżących problemów.
            </SectionIntro>
          </div>

          <FeatureCards cards={cooperationCards} columns={2} />
        </div>
      </section>

      <section className={styles.ctaSection}>
        <div className={styles.ctaInner}>
          <h2 className={styles.ctaTitle}>Czas porozmawiać o Twojej firmie</h2>
          <p className={styles.ctaText}>
            Ta rozmowa to Twój pierwszy krok do uporządkowania strategii, sprzedaży i marketingu w
            jeden spójny system.
          </p>
          <CtaButton href="/#kontakt">Bezpłatna konsultacja</CtaButton>
        </div>
      </section>

      <Footer />
    </>
  );
}
