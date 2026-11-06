import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, Podcast } from "lucide-react";
import SubpageHeader from "@/components/SubpageHeader/SubpageHeader";
import SectionIntro from "@/components/SectionIntro/SectionIntro";
import FeatureCards from "@/components/FeatureCards/FeatureCards";
import CtaButton from "@/components/CtaButton/CtaButton";
import Footer from "@/components/Footer/Footer";
import SiteNav from "@/components/SiteNav/SiteNav";
import { ApplePodcastsLogo, PodcastPlayer, SpotifyLogo } from "@/components/Embed/Embed";
import EpisodeRecency from "@/components/EpisodeRecency/EpisodeRecency";
import EpisodeList from "@/components/EpisodeList/EpisodeList";
import { listPublishedPosts } from "@/lib/blog/posts";
import {
  PODCAST_APPLE,
  PODCAST_APPLE_ID,
  PODCAST_SPOTIFY,
  PODCAST_YOUTUBE,
  podcastArtworkOrNull,
} from "@/lib/podcast";
import styles from "./podcast-pno.module.css";

// The newest podcast entries come from the database, which the build cannot
// read, so the page is rendered on its first visit and then served from the
// page cache until a change in /admin marks it stale (lib/blog/cache.ts), as
// /wiedza is. Only /podcast-pno itself is a page: the catch-all exists for
// that and nothing else.
export function generateStaticParams(): { rest?: string[] }[] {
  return [];
}

/** Episode entries shown on the page; /podcasty lists them all. */
const LATEST_EPISODES = 6;

export const metadata: Metadata = {
  title: "Podcast PNO - Pozytywny Networking Online",
  description:
    "Podcast dla przedsiębiorców i właścicieli firm, którzy chcą rozwijać biznes w sposób świadomy, uporządkowany i długofalowy. Strategia, sprzedaż i marketing jako jeden system.",
  alternates: { canonical: "/podcast-pno" },
  openGraph: {
    title: "Podcast PNO - Pozytywny Networking Online | Coordination",
    description:
      "Podcast dla przedsiębiorców i właścicieli firm, którzy chcą rozwijać biznes w sposób świadomy, uporządkowany i długofalowy.",
    url: "/podcast-pno",
  },
};

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

function YouTubeLogo() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.2 3.6Z"
      />
    </svg>
  );
}

const platforms = [
  { name: "Spotify", href: PODCAST_SPOTIFY, logo: SpotifyLogo, tone: "spotify" },
  { name: "Apple Podcasts", href: PODCAST_APPLE, logo: ApplePodcastsLogo, tone: "apple" },
  { name: "YouTube", href: PODCAST_YOUTUBE, logo: YouTubeLogo, tone: "youtube" },
] as const;

type Props = { params: Promise<{ rest?: string[] }> };

export default async function PodcastPage({ params }: Props) {
  if ((await params).rest) notFound();

  const [fetched, { posts: episodes }] = await Promise.all([
    podcastArtworkOrNull(),
    listPublishedPosts(1, LATEST_EPISODES, "podcast"),
  ]);
  // Without Apple's answer the banner shows the entries' cover, or none.
  const artwork = fetched ?? episodes.find((post) => post.cover)?.cover?.src;

  return (
    <>
      <SiteNav variant="subpage" />
      <SubpageHeader
        title="Podcast PNO"
        lead="Pozytywny Networking Online - podcast o budowaniu firmy, która działa jako jeden system."
        crumbs={[{ label: "Strona główna", href: "/" }, { label: "Podcast PNO" }]}
        artwork={artwork ? { src: artwork, alt: "Okładka podcastu PNO z Szymonem Pirko" } : undefined}
        torn
      />

      <section className={styles.listen} aria-labelledby="listen-title">
        <div className={styles.listenInner}>
          <div className={styles.listenCopy}>
            <h2 id="listen-title" className={styles.listenTitle}>
              Strategia, sprzedaż i marketing <span>jako jeden system</span>
            </h2>
            <p className={styles.listenText}>
              <strong>PNO Pozytywny Networking Online</strong> to podcast dla przedsiębiorców i
              właścicieli firm, którzy są już w biznesie, mają za sobą pierwsze doświadczenia,
              również te trudne, i szukają sensownych decyzji zamiast kolejnych szybkich rozwiązań.
            </p>
            <p className={styles.listenText}>
              Nauczysz się, jak budować zdrową, przemyślaną ścieżkę dla swojej firmy i jak
              zaprojektować skuteczną strategię, sprzedaż i marketing.
            </p>

            <ul className={styles.platforms} aria-label="Słuchaj podcastu na">
              {platforms.map(({ name, href, logo: Logo, tone }) => (
                <li key={name}>
                  <a className={styles.platform} href={href} target="_blank" rel="noopener noreferrer">
                    <span className={styles.platformLogo} data-tone={tone}><Logo /></span>
                    {name}
                    <ArrowUpRight className={styles.platformArrow} aria-hidden="true" />
                    <span className={styles.srOnly}> (otwiera się w nowej karcie)</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* The whole show, so the player always opens on the newest episode;
              compact, the height Apple's show player draws itself at, so
              Spotify's matches it. */}
          <div className={styles.listenPlayer}>
            <EpisodeRecency appleId={PODCAST_APPLE_ID} tone="light" />
            <PodcastPlayer spotify={PODCAST_SPOTIFY} apple={PODCAST_APPLE} height={175} />
          </div>
        </div>
      </section>

      {episodes.length > 0 && (
        <section className={styles.sectionAlt} aria-labelledby="episodes-title">
          <div className={styles.inner}>
            <h2 id="episodes-title" className={styles.episodesTitle}>Najnowsze odcinki</h2>
            <EpisodeList posts={episodes} />
            <p className={styles.episodesMore}>
              <Link className={styles.entriesLink} href="/podcasty">
                Wszystkie odcinki
              </Link>
            </p>
          </div>
        </section>
      )}

      <section className={styles.section}>
        <div className={styles.inner}>
          <div className={styles.intro}>
            <SectionIntro title="Dla kogo jest ten podcast" />
          </div>
          <FeatureCards cards={audience} columns={3} />
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
          <CtaButton href={PODCAST_SPOTIFY}>Wyedukuj się z nami</CtaButton>
        </div>
      </section>

      <Footer />
    </>
  );
}
