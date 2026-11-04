import type { Metadata } from "next";
import { MessageCircleQuestion } from "lucide-react";
import SubpageHeader from "@/components/SubpageHeader/SubpageHeader";
import SectionIntro from "@/components/SectionIntro/SectionIntro";
import FaqForm from "@/components/FaqForm/FaqForm";
import FaqAccordion, { type FaqEntry } from "@/components/FaqAccordion/FaqAccordion";
import CtaButton from "@/components/CtaButton/CtaButton";
import Footer from "@/components/Footer/Footer";
import SiteNav from "@/components/SiteNav/SiteNav";
import styles from "./faq.module.css";

export const metadata: Metadata = {
  title: "FAQ - najczęściej zadawane pytania",
  description:
    "Najczęściej zadawane pytania właścicieli firm. Znajdź odpowiedzi na kluczowe problemy biznesowe lub zadaj własne pytanie całkowicie anonimowo.",
  alternates: { canonical: "/faq" },
  openGraph: {
    title: "FAQ - najczęściej zadawane pytania | Coordination",
    description:
      "Najczęściej zadawane pytania właścicieli firm. Znajdź odpowiedzi na kluczowe problemy biznesowe lub zadaj własne pytanie całkowicie anonimowo.",
    url: "/faq",
  },
};

const entries: readonly FaqEntry[] = [
  {
    question: "Czy doradztwo to dobry wybór dla mojej firmy?",
    answer: [
      "Odpowiedź na to pytanie nie jest jednoznaczna. Trzeba przemyśleć parę rzeczy… doradztwo jest dobrym wyborem dla firmy wtedy, gdy nie traktuje się go jako zewnętrznej opinii ani gotowej recepty, lecz jako sposób uporządkowania decyzji, które dziś wpływają na sprzedaż, marżę, operacje i rozwój firmy. Doradztwo ma sens dla firmy, która po prostu trochę błądzi i nie wie w jakim kierunku iść albo sprzedaż nie zachowuje się tak jakby tego oczekiwał właściciel.",
      "Doradztwo nie jest natomiast dobrym wyborem, jeżeli firma szuka tylko potwierdzenia swoich wcześniejszych decyzji albo oczekuje, że ktoś z zewnątrz naprawi sprzedaż bez pracy nad ofertą, klientem, marżą i sposobem działania oraz bez zaangażowania zespołu jak i samego właściciela.",
      "Czyli podsumowując, doradztwo może być bardzo dobrym wyborem, ale tylko wtedy, gdy jego celem jest diagnoza i poprawa jakości decyzji w firmie, a nie samo wygenerowanie kolejnych pomysłów. Dobre doradztwo powinno pomóc zobaczyć, gdzie firma realnie zarabia, które działania tworzą tylko obrót, które decyzje obniżają marżę oraz jaki jest koszt dalszego działania bez zmiany.",
    ],
    cta: {
      label: "Masz podobny problem? Skontaktuj się z nami bezpośrednio",
      href: "/#kontakt",
    },
  },
];

export default function FaqPage() {
  return (
    <>
      <SiteNav variant="subpage" />
      <SubpageHeader
        title="FAQ"
        lead="Najczęściej zadawane pytania przez właścicieli firm. Znajdź odpowiedzi na kluczowe problemy biznesowe lub zadaj własne pytanie całkowicie anonimowo za pomocą formularza poniżej."
        crumbs={[{ label: "Strona główna", href: "/" }, { label: "FAQ" }]}
      />

      <section className={styles.section}>
        <div className={styles.inner}>
          <div className={styles.intro}>
            <SectionIntro title="Masz pytanie? Zadaj je anonimowo">
              Opisz swój problem biznesowy. Przeanalizujemy go, przygotujemy
              szczegółową odpowiedź i opublikujemy ją poniżej. Opublikowane wpisy
              są w 100% anonimowe.
            </SectionIntro>
          </div>

          <div className={styles.formCard}>
            <div className={styles.formHeader}>
              <span className={styles.formIcon}>
                <MessageCircleQuestion aria-hidden="true" />
              </span>
              <h2 className={styles.formTitle}>Formularz anonimowego pytania</h2>
            </div>
            <FaqForm />
          </div>
        </div>
      </section>

      <section className={styles.answers}>
        <div className={styles.inner}>
          <div className={styles.intro}>
            <SectionIntro title="Odpowiedzi na pytania" />
          </div>
          <FaqAccordion entries={entries} />
        </div>
      </section>

      <section className={styles.ctaSection}>
        <div className={styles.ctaInner}>
          <h2 className={styles.ctaTitle}>Nie znalazłeś odpowiedzi na swoje pytanie?</h2>
          <p className={styles.ctaText}>
            Umów się na bezpłatną konsultację, podczas której porozmawiamy o Twojej
            firmie i sprawdzimy, czy możemy realnie pomóc.
          </p>
          <CtaButton href="/#kontakt">Bezpłatna konsultacja</CtaButton>
        </div>
      </section>

      <Footer />
    </>
  );
}
