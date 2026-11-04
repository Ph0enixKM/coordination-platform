import type { Metadata } from "next";
import { Compass, TrendingUp, Megaphone, ArrowRight, type LucideIcon } from "lucide-react";
import SubpageHeader from "@/components/SubpageHeader/SubpageHeader";
import SectionIntro from "@/components/SectionIntro/SectionIntro";
import Footer from "@/components/Footer/Footer";
import SiteNav from "@/components/SiteNav/SiteNav";
import CommunityLogo from "@/components/CommunityLogo/CommunityLogo";
import CommunityEmblem from "./components/CommunityEmblem/CommunityEmblem";
import FacebookJoinCard from "./components/FacebookJoinCard/FacebookJoinCard";
import styles from "./spolecznosc.module.css";

export const metadata: Metadata = {
  title: "Społeczność - Strategicznie o firmie",
  description:
    "Darmowa, zamknięta społeczność na Facebooku dla właścicieli firm, którzy chcą myśleć o biznesie w sposób uporządkowany i długofalowy. Uczymy strategii, sprzedaży i marketingu.",
  alternates: { canonical: "/spolecznosc" },
  openGraph: {
    title: "Społeczność - Strategicznie o firmie | Coordination",
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

const topics: readonly { pillar: string; icon: LucideIcon; title: string; description: string }[] = [
  {
    pillar: "Strategia",
    icon: Compass,
    title: "Strategia firmy jako narzędzie decyzyjne",
    description:
      "Rozmawiamy o strategii nie jako dokumencie, ale jako punkcie odniesienia do codziennych decyzji. Analizujemy, jak wyznaczać kierunek rozwoju firmy i eliminować sprzeczne działania.",
  },
  {
    pillar: "Sprzedaż",
    icon: TrendingUp,
    title: "Sprzedaż jako proces, nie improwizacja",
    description:
      "Poruszamy tematy związane z budowaniem sprzedaży w sposób przewidywalny i spójny. Dyskutujemy o procesach sprzedażowych, ofercie i roli właściciela w sprzedaży.",
  },
  {
    pillar: "Marketing",
    icon: Megaphone,
    title: "Marketing spójny ze strategią firmy",
    description:
      "Marketing traktujemy jako element systemu, a nie osobny byt. Rozmawiamy o komunikacji, kanałach i działaniach marketingowych, które realnie wspierają sprzedaż i cele biznesowe.",
  },
];

/* The long paragraphs carried their lists inline ("W środku znajdziesz: a, b, c");
   they are split out here so each list reads as one. */
const mechanics: readonly {
  title: string;
  intro: string;
  points?: readonly string[];
  outro?: string;
}[] = [
  {
    title: "Zamknięta grupa na Facebooku",
    intro: "Społeczność działa w formie zamkniętej grupy na Facebooku. W środku znajdziesz:",
    points: [
      "regularne treści edukacyjne o strategii, sprzedaży i marketingu",
      "analizy realnych problemów firmowych",
      "merytoryczne dyskusje między przedsiębiorcami",
      "przestrzeń do zadawania pytań i konfrontowania własnych decyzji",
    ],
    outro:
      "Nie jest to grupa autopromocyjna ani feed z linkami. Stawiamy na jakość rozmów i realną wartość merytoryczną.",
  },
  {
    title: "Po co ta społeczność istnieje",
    intro:
      "Społeczność powstała z potrzeby stworzenia miejsca, w którym przedsiębiorcy mogą zatrzymać się i pomyśleć strategicznie o swojej firmie. Celem społeczności jest:",
    points: [
      "rozwijanie myślenia systemowego o firmie",
      "lepsze zrozumienie relacji między strategią, sprzedażą i marketingiem",
      "budowanie firm, które rosną w rytmie, a nie w chaosie",
    ],
  },
  {
    title: "Społeczność jako element systemu",
    intro:
      "Dla wielu przedsiębiorców społeczność Strategicznie o firmie jest pierwszym kontaktem z takim sposobem myślenia o biznesie. To bezpieczna przestrzeń, aby sprawdzić, czy strategia, sprzedaż i marketing jako system są dla Ciebie właściwym kierunkiem. Jeśli z czasem pojawi się potrzeba uporządkowania tych obszarów w kontekście własnej firmy, naturalnym kolejnym krokiem jest rozmowa diagnostyczna lub indywidualna współpraca.",
  },
];

/* Where the community sits in the wider offer, drawn under the last mechanics row. */
const path = ["Społeczność", "Rozmowa diagnostyczna", "Indywidualna współpraca"] as const;

export default function SpolecznoscPage() {
  return (
    <>
      {/* The community's own red, the colour of its emblem below. */}
      <SiteNav variant="subpage" accent="#e30b17" />
      <SubpageHeader
        title="Strategicznie o firmie"
        lead="Społeczność świadomych przedsiębiorców: darmowa, zamknięta grupa na Facebooku, w której łączymy strategię, sprzedaż i marketing w spójną całość."
        crumbs={[{ label: "Strona główna", href: "/" }, { label: "Społeczność" }]}
        aside={<CommunityEmblem />}
        glow={<CommunityLogo />}
      >
        <ul className={styles.pillars} aria-label="Tematy społeczności">
          <li>Strategia</li>
          <li>Sprzedaż</li>
          <li>Marketing</li>
        </ul>
      </SubpageHeader>

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
            <FacebookJoinCard href={FACEBOOK_GROUP} />
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.audience}>
          <div className={styles.audienceAside}>
            <h2 className={styles.audienceTitle}>Dla kogo jest ta społeczność</h2>
            <p className={styles.audienceLead}>
              Ta społeczność jest dla Ciebie, jeśli rozpoznajesz się w którymś z tych opisów.
            </p>
          </div>
          <ol className={styles.audienceList}>
            {audience.map((item, index) => (
              <li key={item.title} className={styles.audienceItem}>
                <span className={styles.audienceNumber} aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className={styles.audienceItemTitle}>{item.title}</h3>
                  <p className={styles.audienceItemText}>{item.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className={styles.system}>
        <div className={styles.inner}>
          <div className={styles.systemIntro}>
            <SectionIntro title="O czym rozmawiamy w społeczności">
              Jeden system, nie trzy osobne działy.
            </SectionIntro>
          </div>
          <ol className={styles.pillarsGrid}>
            {topics.map(({ pillar, icon: Icon, title, description }) => (
              <li key={title} className={styles.pillar}>
                <span className={styles.pillarNode} aria-hidden="true">
                  <Icon />
                </span>
                <span className={styles.pillarName}>{pillar}</span>
                <h3 className={styles.pillarTitle}>{title}</h3>
                <p className={styles.pillarText}>{description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.inner}>
          <div className={styles.intro}>
            <SectionIntro title="Jak działa społeczność" />
          </div>
          <div className={styles.rows}>
            {mechanics.map((row, rowIndex) => (
              <article key={row.title} className={styles.row}>
                <h3 className={styles.rowTitle}>{row.title}</h3>
                <div className={styles.rowBody}>
                  <p>{row.intro}</p>
                  {row.points && (
                    <ul className={styles.rowPoints}>
                      {row.points.map((point) => (
                        <li key={point}>{point}</li>
                      ))}
                    </ul>
                  )}
                  {row.outro && <p>{row.outro}</p>}
                  {rowIndex === mechanics.length - 1 && (
                    <ol className={styles.path} aria-label="Kolejne kroki">
                {path.map((step, index) => (
                  <li key={step} className={styles.pathStep} data-current={index === 0 || undefined}>
                    <span className={styles.pathIndex}>{index + 1}</span>
                    {step}
                    {index < path.length - 1 && <ArrowRight className={styles.pathArrow} aria-hidden="true" />}
                  </li>
                ))}
              </ol>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.ctaSection}>
        <div className={styles.ctaInner}>
          <h2 className={styles.ctaTitle}>Czas do nas dołączyć!</h2>
          <p className={styles.ctaText}>
            Zamknięta, darmowa społeczność dla właścicieli firm, którzy chcą uczyć się
            strategii, sprzedaży i marketingu w sposób uporządkowany i świadomy.
          </p>
          <FacebookJoinCard href={FACEBOOK_GROUP} />
        </div>
      </section>

      <Footer />
    </>
  );
}
