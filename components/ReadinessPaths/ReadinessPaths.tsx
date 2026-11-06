import Link from "next/link";
import { CalendarCheck, MessageCircleQuestion, UsersRound } from "lucide-react";
import SectionIntro from "@/components/SectionIntro/SectionIntro";
import styles from "./ReadinessPaths.module.css";

const PATHS = [
  {
    Icon: MessageCircleQuestion,
    when: "Jeśli chcesz zadać nam anonimowe pytanie",
    title: "Zapytaj, nie podając nazwiska",
    text: "Przejdź do FAQ i zadaj pytanie anonimowo. Odpowiemy na nie i poinformujemy Cię o tym. Możesz pytać o wszystko związane z Twoją firmą.",
    cta: "Zadaj pytanie",
    href: "/faq",
  },
  {
    Icon: UsersRound,
    when: "Jeśli wiesz, że coś w firmie nie działa, ale potrzebujesz czasu",
    title: "Dołącz do naszej społeczności",
    text: "Zobaczysz, o czym rozmawiamy, jakie problemy poruszamy i jak myślimy o strategii, sprzedaży i produkcji. Odezwiesz się, kiedy uznasz, że to ma sens.",
    cta: "Dołącz do społeczności",
    href: "/spolecznosc",
  },
  {
    Icon: CalendarCheck,
    when: "Jeśli jesteś gotowy na rozmowę",
    title: "Umów bezpłatną konsultację",
    text: "Porozmawiasz z konkretną osobą, przejdziemy przez Twoją sytuację, a po rozmowie sam zdecydujesz, czy dalsza współpraca ma sens.",
    cta: "Umów konsultację",
    href: "#kontakt",
  },
] as const;

/**
 * "Firmy trafiają do nas na różnym etapie gotowości do współpracy": three
 * next steps, from the lightest to a call, set as steps that rise with the
 * visitor's readiness. A bar above them warms from grey to the brand's
 * orange, with a marker over each card, and each card warms with its marker.
 */
export default function ReadinessPaths() {
  return (
    <section className={styles.section} id="pierwszy-krok">
      <div className={styles.inner}>
        <SectionIntro title="Firmy trafiają do nas na różnym etapie gotowości do współpracy">
          Dlatego nie oczekujemy, że każdy od razu będzie gotowy na rozmowę czy decyzję. Wybierz krok, który pasuje do
          Ciebie dziś.
        </SectionIntro>

        <div className={styles.scale} aria-hidden="true">
          {PATHS.map(({ title }) => (
            <span key={title} className={styles.marker} />
          ))}
        </div>

        <ol className={styles.paths}>
          {PATHS.map(({ Icon, when, title, text, cta, href }) => (
            <li key={title} className={styles.path}>
              <span className={styles.icon} aria-hidden="true">
                <Icon />
              </span>
              <p className={styles.when}>{when}</p>
              <h3 className={styles.title}>{title}</h3>
              <p className={styles.text}>{text}</p>
              {/* The whole card is the link, through the link's stretched ::after. */}
              {href.startsWith("#") ? (
                <a className={styles.cta} href={href}>
                  {cta}
                </a>
              ) : (
                <Link className={styles.cta} href={href}>
                  {cta}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
