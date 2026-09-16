import type { Metadata } from "next";
import SubpageHeader from "@/components/SubpageHeader/SubpageHeader";
import SectionIntro from "@/components/SectionIntro/SectionIntro";
import CtaButton from "@/components/CtaButton/CtaButton";
import Footer from "@/components/Footer/Footer";
import styles from "./o-nas.module.css";

export const metadata: Metadata = {
  title: "Poznaj nas lepiej",
  description:
    "Dlaczego właśnie Coordination. Pomagamy właścicielom małych firm zobaczyć firmę jako jeden system — strategia, sprzedaż, marketing i decyzje właścicielskie jako elementy jednego sposobu działania.",
  alternates: { canonical: "/o-nas" },
};

export default function ONasPage() {
  return (
    <>
      <SubpageHeader
        title="Poznaj nas lepiej"
        lead="Dlaczego właśnie Coordination."
        crumbs={[{ label: "Strona główna", href: "/" }, { label: "Poznaj nas lepiej" }]}
      />

      <section className={styles.prose}>
        <div className={styles.proseInner}>
          <div className={styles.intro}>
            <SectionIntro title="Dlaczego właśnie Coordination" />
          </div>
          <div className={styles.sheet}>
            <p className={styles.paragraph}>
              Zauważyliśmy, że w wielu małych firmach problem nie polega na tym, że brakuje pomysłów, narzędzi albo kolejnych działań marketingowych, ale na tym, że firma nie ma spójnego systemu podejmowania decyzji. Sprzedaż działa osobno, marketing osobno, realizacja osobno, a właściciel próbuje łączyć wszystko własną uwagą, czasem i energią. W takiej sytuacji dokładanie kolejnych działań często nie rozwiązuje problemu. Nowa kampania, nowy handlowiec, nowa strona internetowa albo kolejny proces mogą tylko zwiększyć chaos, jeżeli firma wcześniej nie wie, komu chce sprzedawać, na czym zarabia, jakich klientów nie powinna obsługiwać i według jakich zasad podejmuje decyzje.
            </p>
            <p className={styles.paragraph}>
              Coordination.pl powstało po to, aby pomagać właścicielom małych firm zobaczyć firmę jako jeden system. Pracujemy nad strategią, modelem biznesowym, sprzedażą, marketingiem, ofertą i decyzjami właścicielskimi nie jako osobnymi tematami, ale jako elementami jednego sposobu działania. Celem nie jest stworzenie kolejnego dokumentu, ale jest nim Twoja firma, która działa bardziej świadomie, podejmuje lepsze decyzje, wybiera właściwych klientów i przestaje tracić czas, marżę oraz kontrolę przez niespójne działania.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.testimonialSection}>
        <div className={styles.testimonialInner}>
          <figure className={styles.testimonial}>
            <span className={styles.quoteMark} aria-hidden="true">&ldquo;</span>
            <blockquote className={styles.quote}>
              Z ręką na sercu polecam usługi firmy. Szymon to niesamowicie kompetentna osoba z ogromną wiedzą w temacie przedsiębiorczości i rozwoju osobistego. Do klientów podchodzi z pełnym profesjonalizmem i zaangażowaniem. Super atmosfera, można się czuć swobodnie podczas konsultacji.
            </blockquote>
            <figcaption className={styles.author}>
              <span className={styles.authorName}>Adrian Mech</span>
              <span className={styles.authorRole}>CEO Inoveria</span>
            </figcaption>
          </figure>
        </div>
      </section>

      <section className={styles.ctaSection}>
        <div className={styles.ctaInner}>
          <h2 className={styles.ctaTitle}>To dobry czas, żeby porozmawiać o przyszłości</h2>
          <p className={styles.ctaText}>
            Umów bezpłatną konsultację, podczas której porozmawiamy o Twojej firmie, obecnych problemach i sprawdzimy, czy możemy realnie pomóc.
          </p>
          <CtaButton href="/#kontakt">Bezpłatna konsultacja</CtaButton>
        </div>
      </section>

      <Footer />
    </>
  );
}
