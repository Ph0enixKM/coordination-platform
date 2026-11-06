import type { Metadata } from "next";
import SubpageHeader from "@/components/SubpageHeader/SubpageHeader";
import SectionIntro from "@/components/SectionIntro/SectionIntro";
import FeatureCards from "@/components/FeatureCards/FeatureCards";
import CtaButton from "@/components/CtaButton/CtaButton";
import Footer from "@/components/Footer/Footer";
import SiteNav from "@/components/SiteNav/SiteNav";
import { SUPPORT_AREAS } from "@/lib/content/support";
import styles from "./wsparcie.module.css";

export const metadata: Metadata = {
  title: "Obszary wsparcia",
  description:
    "W czym pomagamy właścicielom małych firm - strategia, model biznesowy, oferta, sprzedaż, marketing, decyzje właścicielskie, procesy i planowanie.",
  alternates: { canonical: "/wsparcie" },
};

const areas = SUPPORT_AREAS;

export default function WsparciePage() {
  return (
    <>
      <SiteNav variant="subpage" />
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
