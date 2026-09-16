import type { Metadata } from "next";
import { Users, MessageSquare, TrendingUp } from "lucide-react";
import SubpageHeader from "@/components/SubpageHeader/SubpageHeader";
import SectionIntro from "@/components/SectionIntro/SectionIntro";
import FeatureCards from "@/components/FeatureCards/FeatureCards";
import CtaButton from "@/components/CtaButton/CtaButton";
import Footer from "@/components/Footer/Footer";
import styles from "./spolecznosc.module.css";

export const metadata: Metadata = {
  title: "Społeczność — Strategicznie o firmie",
  description:
    "Darmowa, zamknięta społeczność na Facebooku dla właścicieli firm, którzy chcą myśleć o biznesie w sposób uporządkowany i długofalowy. Uczymy strategii, sprzedaży i marketingu.",
  alternates: { canonical: "/spolecznosc" },
  openGraph: {
    title: "Społeczność — Strategicznie o firmie | Coordination",
    description:
      "Darmowa, zamknięta społeczność na Facebooku dla właścicieli firm, którzy chcą myśleć o biznesie w sposób uporządkowany i długofalowy.",
    url: "/spolecznosc",
  },
};

const FACEBOOK_GROUP = "https://www.facebook.com/groups/804139875408843/";

const audience: readonly { title: string; description: string }[] = [
  {
    title: "Dla właścicieli firm odpowiedzialnych za rozwój",
    description:
      "Ta społeczność powstała z myślą o osobach, które realnie odpowiadają za kierunek i wyniki firmy. Jeśli to Ty podejmujesz kluczowe decyzje i ponosisz ich konsekwencje, znajdziesz tu rozmowy na właściwym poziomie.",
  },
  {
    title: "Dla tych, którzy chcą myśleć systemowo",
    description:
      "Strategicznie o firmie jest dla przedsiębiorców, którzy chcą rozumieć strategię, sprzedaż i marketing jako jeden spójny system. Skupiamy się na zależnościach między obszarami, a nie na oderwanych działaniach.",
  },
  {
    title: "Dla firm, które działają, ale nie są przewidywalne",
    description:
      "Jeśli firma funkcjonuje, ale trudno przewidzieć wyniki, planować rozwój lub podejmować spokojne decyzje, to sygnał braku spójności. W społeczności rozmawiamy o tym, jak przywracać logikę i przewidywalność w działaniu firmy.",
  },
  {
    title: "Dla przedsiębiorców zmęczonych reagowaniem",
    description:
      "Społeczność jest miejscem dla osób, które nie chcą już tylko reagować na bieżące problemy. Rozmawiamy o przechodzeniu z trybu gaszenia pożarów do trybu świadomego zarządzania firmą.",
  },
  {
    title: "Dla osób szukających zrozumienia, nie gotowych schematów",
    description:
      "To nie jest grupa z checklistami i uniwersalnymi rozwiązaniami. Jest to przestrzeń do myślenia, analizowania decyzji i rozumienia, dlaczego określone działania w firmie działają lub nie.",
  },
  {
    title: "Dla tych, którzy chcą podejmować lepsze decyzje",
    description:
      "Społeczność Strategicznie o firmie jest dla przedsiębiorców, którzy chcą lepiej rozumieć konsekwencje swoich decyzji. Celem nie jest szybsze działanie, ale lepsze działanie, spójne z długofalowym rozwojem firmy.",
  },
];

const topics: readonly { title: string; description: string }[] = [
  {
    title: "Strategia firmy jako narzędzie decyzyjne",
    description:
      "Rozmawiamy o strategii nie jako dokumencie, ale jako punkcie odniesienia do codziennych decyzji. Analizujemy, jak wyznaczać kierunek rozwoju firmy i eliminować sprzeczne działania.",
  },
  {
    title: "Sprzedaż jako proces, nie improwizacja",
    description:
      "Poruszamy tematy związane z budowaniem sprzedaży w sposób przewidywalny i spójny. Dyskutujemy o procesach sprzedażowych, ofercie i roli właściciela w sprzedaży.",
  },
  {
    title: "Marketing spójny ze strategią firmy",
    description:
      "Marketing traktujemy jako element systemu, a nie osobny byt. Rozmawiamy o komunikacji, kanałach i działaniach marketingowych, które realnie wspierają sprzedaż i cele biznesowe.",
  },
];

const mechanics: readonly { title: string; description: string }[] = [
  {
    title: "Jak działa społeczność",
    description:
      "Społeczność działa w formie zamkniętej grupy na Facebooku. W środku znajdziesz: regularne treści edukacyjne o strategii, sprzedaży i marketingu, analizy realnych problemów firmowych, merytoryczne dyskusje między przedsiębiorcami, przestrzeń do zadawania pytań i konfrontowania własnych decyzji. Nie jest to grupa autopromocyjna ani feed z linkami. Stawiamy na jakość rozmów i realną wartość merytoryczną.",
  },
  {
    title: "Po co ta społeczność istnieje",
    description:
      "Społeczność powstała z potrzeby stworzenia miejsca, w którym przedsiębiorcy mogą zatrzymać się i pomyśleć strategicznie o swojej firmie. Celem społeczności jest: rozwijanie myślenia systemowego o firmie, lepsze zrozumienie relacji między strategią, sprzedażą i marketingiem, budowanie firm, które rosną w rytmie, a nie w chaosie.",
  },
  {
    title: "Społeczność jako element systemu",
    description:
      "Dla wielu przedsiębiorców społeczność Strategicznie o firmie jest pierwszym kontaktem z takim sposobem myślenia o biznesie. To bezpieczna przestrzeń, aby sprawdzić, czy strategia, sprzedaż i marketing jako system są dla Ciebie właściwym kierunkiem. Jeśli z czasem pojawi się potrzeba uporządkowania tych obszarów w kontekście własnej firmy, naturalnym kolejnym krokiem jest rozmowa diagnostyczna lub indywidualna współpraca.",
  },
];

export default function SpolecznoscPage() {
  return (
    <>
      <SubpageHeader
        title="Strategicznie o firmie"
        lead="Darmowa, zamknięta społeczność na Facebooku. Uczymy strategii, sprzedaży i marketingu."
        crumbs={[{ label: "Strona główna", href: "/" }, { label: "Społeczność" }]}
      />

      <section className={styles.lead}>
        <div className={styles.leadInner}>
          <div className={styles.leadCopy}>
            <p className={styles.leadText}>
              <strong>Strategicznie o firmie</strong> to zamknięta, darmowa społeczność
              dla właścicieli firm, którzy chcą myśleć o biznesie w sposób uporządkowany
              i długofalowy. To miejsce dla osób, które nie chcą działać reaktywnie, lecz
              budować spójne strategie sprzedaży i marketingu osadzone w realiach
              prowadzenia firmy.
            </p>
            <p className={styles.leadText}>
              Społeczność powstała jako przestrzeń do rozmów o decyzjach, priorytetach i
              konsekwencjach, nie o trikach i doraźnych rozwiązaniach.
            </p>
          </div>
          <div className={styles.leadCta}>
            <CtaButton href={FACEBOOK_GROUP}>Dołącz do nas na Facebooku</CtaButton>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.inner}>
          <div className={styles.intro}>
            <SectionIntro title="Dla kogo jest ta społeczność" />
          </div>
          <FeatureCards cards={audience} columns={3} />
        </div>
      </section>

      <section className={styles.sectionAlt}>
        <div className={styles.inner}>
          <div className={styles.intro}>
            <SectionIntro title="O czym rozmawiamy w społeczności" />
          </div>
          <div className={styles.topics}>
            {topics.map((topic) => (
              <article key={topic.title} className={styles.topic}>
                <span className={styles.topicIcon}><MessageSquare aria-hidden="true" /></span>
                <h3 className={styles.topicTitle}>{topic.title}</h3>
                <p className={styles.topicText}>{topic.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.inner}>
          <div className={styles.intro}>
            <SectionIntro title="Jak działa społeczność" />
          </div>
          <FeatureCards cards={mechanics} columns={3} />
        </div>
      </section>

      <section className={styles.ctaSection}>
        <div className={styles.ctaInner}>
          <span className={styles.ctaIcon}><Users aria-hidden="true" /></span>
          <h2 className={styles.ctaTitle}>Czas do nas dołączyć!</h2>
          <p className={styles.ctaText}>
            Zamknięta, darmowa społeczność dla właścicieli firm, którzy chcą uczyć się
            strategii, sprzedaży i marketingu w sposób uporządkowany i świadomy.
          </p>
          <CtaButton href={FACEBOOK_GROUP}>Dołącz do społeczności na Facebooku</CtaButton>
        </div>
      </section>

      <Footer />
    </>
  );
}
