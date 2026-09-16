import type { Metadata } from "next";
import { Podcast, Headphones, Radio } from "lucide-react";
import SubpageHeader from "@/components/SubpageHeader/SubpageHeader";
import SectionIntro from "@/components/SectionIntro/SectionIntro";
import FeatureCards from "@/components/FeatureCards/FeatureCards";
import CtaButton from "@/components/CtaButton/CtaButton";
import Footer from "@/components/Footer/Footer";
import styles from "./podcast-pno.module.css";

export const metadata: Metadata = {
  title: "Podcast PNO — Pozytywny Networking Online",
  description:
    "Podcast dla przedsiębiorców i właścicieli firm, którzy chcą rozwijać biznes w sposób świadomy, uporządkowany i długofalowy. Strategia, sprzedaż i marketing jako jeden system.",
  alternates: { canonical: "/podcast-pno" },
  openGraph: {
    title: "Podcast PNO — Pozytywny Networking Online | Coordination",
    description:
      "Podcast dla przedsiębiorców i właścicieli firm, którzy chcą rozwijać biznes w sposób świadomy, uporządkowany i długofalowy.",
    url: "/podcast-pno",
  },
};

const SPOTIFY = "https://open.spotify.com/show/0dlekJRAAzprqI93yYABGf";
const YOUTUBE = "https://www.youtube.com/@szymon_pirko";
const APPLE = "https://podcasts.apple.com/us/podcast/podcast-pno-strategicznie-o-firmie/id1722037002";

const audience: readonly { title: string; description: string }[] = [
  {
    title: "Dla właścicieli firm w trakcie rozwoju",
    description:
      "Podcast PNO jest skierowany do osób, które prowadzą własne firmy i są bezpośrednio zaangażowane w ich rozwój. Nie mówimy tu o pomysłach na biznes, lecz o realnych decyzjach podejmowanych w działających organizacjach.",
  },
  {
    title: "Dla tych, którzy czują brak spójności",
    description:
      "Jeśli firma działa, ale trudno powiedzieć, dlaczego coś działa, a coś nie, ten podcast jest dla Ciebie. Poruszamy tematy spójności między strategią, sprzedażą i marketingiem, które w MŚP najczęściej się rozjeżdżają.",
  },
  {
    title: "Dla przedsiębiorców zmęczonych chaosem",
    description:
      "Podcast powstał z myślą o osobach, które czują, że firma zaczęła ich przerastać operacyjnie i decyzyjnie. Rozmawiamy o porządkowaniu sposobu myślenia o biznesie, a nie o dokładaniu kolejnych działań.",
  },
  {
    title: "Dla osób myślących systemowo",
    description:
      "PNO jest dla tych, którzy chcą zrozumieć firmę jako system naczyń połączonych. Pokazujemy zależności między decyzjami właściciela, sprzedażą, marketingiem i codziennym funkcjonowaniem firmy.",
  },
  {
    title: "Dla praktyków, nie dla teoretyków",
    description:
      "Nie znajdziesz tu gotowych recept ani uniwersalnych schematów. Podcast opiera się na doświadczeniach przedsiębiorców, realnych sytuacjach biznesowych i konsekwencjach podejmowanych decyzji.",
  },
  {
    title: "Dla tych, którzy chcą rozwijać firmę świadomie",
    description:
      "Podcast PNO jest dla osób, które chcą budować firmę dającą stabilność, przewidywalność i większą decyzyjność. Nie chodzi wyłącznie o wzrost, ale o rozwój, który ma sens na danym etapie biznesu.",
  },
];

const topics: readonly { title: string; description: string }[] = [
  {
    title: "Strategia firmy w praktyce",
    description:
      "Odcinki poświęcone są strategii rozumianej jako narzędziu do podejmowania decyzji, a nie dokumentowi. Analizuję, jak firmy wyznaczają kierunek, ustalają priorytety i dlaczego brak spójnej strategii prowadzi do chaosu operacyjnego.",
  },
  {
    title: "Sprzedaż jako proces",
    description:
      "Poruszam tematy związane z budowaniem sprzedaży w sposób przewidywalny i skalowalny. Mówię o procesach sprzedażowych, ofercie, argumentacji i błędach, które sprawiają, że sprzedaż opiera się wyłącznie na intuicji właściciela.",
  },
  {
    title: "Marketing wspierający cele biznesowe",
    description:
      "Podcast dotyka marketingu jako elementu systemu, a nie osobnego bytu. Analizuję, jak komunikacja, kanały i działania marketingowe powinny wspierać sprzedaż i strategię firmy, zamiast generować chaos i przepalać budżet.",
  },
];

const episodes: readonly { number: string; title: string }[] = [
  { number: "PNO 154", title: "Jak zarządzać małą firmą, żeby dobrze się rozwijała?" },
  { number: "PNO 153", title: "Jak zbudować proces sprzedaży w małej firmie krok po kroku" },
  { number: "PNO 152", title: "Jak napisać dobrą ofertę krok po kroku" },
  { number: "PNO 151", title: "Co zrobić, gdy dobry pracownik odchodzi z mojej firmy" },
  { number: "PNO 150", title: "Nowy handlowiec w firmie, dlaczego nie sprzedaje" },
  { number: "PNO 149", title: "Uporządkuj obsługę klienta w swojej małej firmie raz na zawsze" },
];

const platforms = [
  { name: "Spotify", href: SPOTIFY },
  { name: "YouTube", href: YOUTUBE },
  { name: "Apple Podcasts", href: APPLE },
];

export default function PodcastPage() {
  return (
    <>
      <SubpageHeader
        title="Podcast PNO"
        lead="Pozytywny Networking Online — podcast o budowaniu firmy, która działa jako jeden system."
        crumbs={[{ label: "Strona główna", href: "/" }, { label: "Podcast PNO" }]}
      />

      <section className={styles.lead}>
        <div className={styles.leadInner}>
          <div className={styles.leadCopy}>
            <p className={styles.leadText}>
              <strong>PNO Pozytywny Networking Online</strong> to podcast dla
              przedsiębiorców i właścicieli firm, którzy chcą rozwijać biznes w
              sposób świadomy, uporządkowany i długofalowy.
            </p>
            <p className={styles.leadText}>
              Podcast powstał z myślą o osobach, które są już w biznesie, mają za
              sobą pierwsze doświadczenia, również te trudne i szukają sensownych
              decyzji zamiast kolejnych szybkich rozwiązań.
            </p>
            <p className={styles.leadText}>
              Nauczysz się jak budować zdrową, przemyślaną ścieżkę dla swojej firmy.
              Zaprojektujesz skuteczną strategię, sprzedaż i marketing.
            </p>
          </div>
          <div className={styles.leadCta}>
            <CtaButton href={SPOTIFY}>Posłuchaj na Spotify</CtaButton>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.inner}>
          <div className={styles.intro}>
            <SectionIntro title="Dla kogo jest ten podcast" />
          </div>
          <FeatureCards cards={audience} columns={3} />
        </div>
      </section>

      <section className={styles.sectionAlt}>
        <div className={styles.inner}>
          <div className={styles.intro}>
            <SectionIntro title="O czym są odcinki podcastu" />
          </div>
          <div className={styles.topics}>
            {topics.map((topic) => (
              <article key={topic.title} className={styles.topic}>
                <span className={styles.topicIcon}><Radio aria-hidden="true" /></span>
                <h3 className={styles.topicTitle}>{topic.title}</h3>
                <p className={styles.topicText}>{topic.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.firstStep}>
        <div className={styles.firstStepInner}>
          <span className={styles.firstStepIcon}><Podcast aria-hidden="true" /></span>
          <h2 className={styles.firstStepTitle}>Podcast to Twój pierwszy krok</h2>
          <p className={styles.firstStepText}>
            Dla wielu osób podcast jest pierwszym kontaktem z naszym sposobem myślenia
            o firmie. To bezpieczna przestrzeń, żeby sprawdzić, czy ten sposób patrzenia
            na biznes jest Ci bliski.
          </p>
          <CtaButton href={SPOTIFY}>Wyedukuj się z nami</CtaButton>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.inner}>
          <div className={styles.intro}>
            <SectionIntro title="Odcinki podcastu" />
          </div>
          <ul className={styles.episodes}>
            {episodes.map((episode) => (
              <li key={episode.number}>
                <a className={styles.episode} href={SPOTIFY} target="_blank" rel="noopener noreferrer">
                  <span className={styles.episodeNumber}>{episode.number}</span>
                  <span className={styles.episodeTitle}>{episode.title}</span>
                  <span className={styles.episodeAction}>
                    <Headphones aria-hidden="true" />
                    Słuchaj odcinka
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className={styles.platformsSection}>
        <div className={styles.platformsInner}>
          <h2 className={styles.platformsTitle}>Posłuchaj podcastu na</h2>
          <ul className={styles.platforms}>
            {platforms.map((platform) => (
              <li key={platform.name}>
                <a
                  className={styles.platform}
                  href={platform.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {platform.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Footer />
    </>
  );
}
