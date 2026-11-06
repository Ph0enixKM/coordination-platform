import type { Metadata } from "next";
import SubpageHeader from "@/components/SubpageHeader/SubpageHeader";
import SectionIntro from "@/components/SectionIntro/SectionIntro";
import ContactMail from "@/components/ContactMail/ContactMail";
import Footer from "@/components/Footer/Footer";
import SiteNav from "@/components/SiteNav/SiteNav";
import SituationCards from "./components/SituationCards/SituationCards";
import StageMatrix from "./components/StageMatrix/StageMatrix";
import NotForYou from "./components/NotForYou/NotForYou";
import FirmTypes from "./components/FirmTypes/FirmTypes";
import Approach from "./components/Approach/Approach";
import AfterChange from "./components/AfterChange/AfterChange";
import styles from "./dla-kogo.module.css";

export const metadata: Metadata = {
  title: "Dla kogo jest doradztwo",
  description:
    "Doradztwo strategiczne dla małych firm, które już działają, ale rosną za ciężko. Rozpoznaj swoją sytuację i sprawdź, czy jesteś na właściwym etapie.",
  alternates: { canonical: "/dla-kogo" },
};

export default function DlaKogoPage() {
  return (
    <>
      <SiteNav variant="subpage" />
      <SubpageHeader
        title="Dla kogo jest doradztwo"
        lead="Nie pracujemy z każdą firmą. Ta strona pomoże Ci sprawdzić, czy jesteś w grupie, z którą pracujemy - po sytuacji i po etapie."
        crumbs={[{ label: "Strona główna", href: "/" }, { label: "Dla kogo jest doradztwo" }]}
      />

      <section className={styles.lead}>
        <div className={styles.leadInner}>
          <p className={styles.leadText}>
            Pracujemy z firmami, które już działają - mają klientów, zespół i przychody - ale{" "}
            <mark className={styles.mark}>rosną za ciężko</mark>. Najczęściej są to{" "}
            <strong className={styles.strong}>mikro i małe firmy od 3 do 15 osób</strong>. Nie
            ograniczamy się do branży, bo problem rzadko leży w rodzaju działalności, lecz w tym,
            że firma <mark className={styles.mark}>przestaje działać jako spójny system</mark>.
          </p>
        </div>
      </section>

      <section className={styles.approach}>
        <div className={styles.inner}>
          <div className={styles.intro}>
            <SectionIntro title="Na czym polega doradztwo dla małych firm">
              To wspólna praca z właścicielem nad tym, jak firma podejmuje decyzje, komu i co
              sprzedaje oraz jak łączy strategię, sprzedaż, marketing i codzienną realizację. Nie
              przynosimy gotowego szablonu ani raportu do szuflady - pracujemy na Twojej firmie i
              Twoich decyzjach.
            </SectionIntro>
          </div>

          <Approach />
        </div>
      </section>

      <section className={styles.situations}>
        <div className={styles.inner}>
          <div className={styles.intro}>
            <SectionIntro title="Rozpoznajesz swoją firmę?">
              To sytuacje, z którymi najczęściej przychodzą właściciele. Jeśli któraś brzmi
              znajomo, prawdopodobnie jesteś w miejscu, w którym pracujemy.
            </SectionIntro>
          </div>

          <SituationCards />
        </div>
      </section>

      <section className={styles.stages}>
        <div className={styles.inner}>
          <div className={styles.intro}>
            <SectionIntro title="Na jakim etapie pracujemy">
              Nie każda firma pasuje do tego rodzaju pracy. Poniżej widać, gdzie pracujemy, a gdzie
              świadomie odsyłamy.
            </SectionIntro>
          </div>

          <StageMatrix />
        </div>
      </section>

      <section className={styles.notForYou}>
        <div className={styles.inner}>
          <div className={styles.intro}>
            <SectionIntro title="Kiedy nie jesteśmy właściwym wyborem">
              Mówimy to jawnie, bo oszczędza to Twój czas i nasz. Jeżeli któregoś z poniższych
              punktów dotyczy Twoja sytuacja, prawdopodobnie potrzebujesz czegoś innego.
            </SectionIntro>
          </div>

          <NotForYou />
        </div>
      </section>

      <section className={styles.firmTypes}>
        <div className={styles.inner}>
          <div className={styles.intro}>
            <SectionIntro title="Jak to wygląda w różnych branżach">
              Problem jest ten sam, ale objawia się różnie w zależności od rodzaju działalności.
              Poniżej najczęstsze konfiguracje, z którymi pracujemy.
            </SectionIntro>
          </div>

          <FirmTypes />
        </div>
      </section>

      <section className={styles.afterChange}>
        <div className={styles.inner}>
          <div className={styles.intro}>
            <SectionIntro title="Co ma się zmienić po doradztwie?">
              Te same sytuacje, od których zaczynaliśmy, po zakończonej pracy. Doradztwo nie kończy
              się na rekomendacjach - jego efekt ma być widoczny w tym, jak firma działa na co
              dzień.
            </SectionIntro>
          </div>

          <AfterChange />
        </div>
      </section>

      <ContactMail />
      <Footer />
    </>
  );
}
