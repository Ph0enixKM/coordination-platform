import type { Metadata } from "next";
import SubpageHeader from "@/components/SubpageHeader/SubpageHeader";
import CtaButton from "@/components/CtaButton/CtaButton";
import Footer from "@/components/Footer/Footer";
import styles from "./wiedza.module.css";

export const metadata: Metadata = {
  title: "Baza wiedzy",
  description:
    "Wpisy o strategii, sprzedaży i marketingu dla właścicieli małych firm. Klient docelowy, definicja idealnego klienta, plan pozyskiwania klientów i więcej.",
  alternates: { canonical: "/wiedza" },
};

type Post = {
  date: string;
  author: string;
  title: string;
  excerpt: string;
};

const posts: readonly Post[] = [
  {
    date: "15 września, 2026",
    author: "autorstwa Szymon Pirko",
    title: "Klient docelowy małej firmy: jak go określić?",
    excerpt:
      "Klient docelowy małej firmy to nie każdy odbiorca, który może kupić, ale taki, którego warto świadomie pozyskiwać ze względu na…",
  },
  {
    date: "14 września, 2026",
    author: "autorstwa Szymon Pirko",
    title: "Definicja idealnego klienta: przewodnik dla małych firm",
    excerpt:
      "Definicja idealnego klienta powinna wskazywać nie tylko, kto może kupić ofertę firmy, ale przede wszystkim z kim współpraca jest najbardziej…",
  },
  {
    date: "12 września, 2026",
    author: "autorstwa Szymon Pirko",
    title:
      "Plan pozyskiwania klientów krok po kroku. Jak zbudować przewidywalny system sprzedaży",
    excerpt:
      "Plan pozyskiwania klientów powinien zaczynać się od określenia, jakiego wyniku biznesowego firma potrzebuje i jaki typ klienta realnie ten wynik…",
  },
];

export default function WiedzaPage() {
  return (
    <>
      <SubpageHeader
        title="Baza wiedzy"
        lead="Wpisy o strategii, sprzedaży i marketingu dla właścicieli małych firm."
        crumbs={[{ label: "Strona główna", href: "/" }, { label: "Baza wiedzy" }]}
      />

      <section className={styles.section}>
        <div className={styles.inner}>
          <ul className={styles.list}>
            {posts.map((post) => (
              <li key={post.title} className={styles.item}>
                <article className={styles.card}>
                  <div className={styles.meta}>
                    <time>{post.date}</time>
                    <span className={styles.dot} aria-hidden="true">·</span>
                    <span>{post.author}</span>
                  </div>
                  <h3 className={styles.title}>{post.title}</h3>
                  <p className={styles.excerpt}>{post.excerpt}</p>
                  <span className={styles.read}>
                    Czytaj
                    <span className={styles.arrow} aria-hidden="true">→</span>
                  </span>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className={styles.ctaSection}>
        <div className={styles.ctaInner}>
          <h2 className={styles.ctaTitle}>Chcesz porozmawiać o swojej firmie?</h2>
          <p className={styles.ctaText}>
            Umów bezpłatną konsultację, podczas której porozmawiamy o Twojej firmie i sprawdzimy, czy możemy realnie pomóc.
          </p>
          <CtaButton href="/#kontakt">Bezpłatna konsultacja</CtaButton>
        </div>
      </section>

      <Footer />
    </>
  );
}
