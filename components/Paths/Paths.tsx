import SectionIntro from "@/components/SectionIntro/SectionIntro";
import { ArrowUpRight } from "lucide-react";
import styles from "./Paths.module.css";

const paths = [
  ["/assets/path-question.svg", "Chcesz zadać anonimowe pytanie", "Przejdź do FAQ. Możesz zapytać o wszystko związane z Twoją firmą - to bezpieczny pierwszy krok.", "Przejdź do FAQ", "https://coordination.pl/faq/"],
  ["/assets/path-time.svg", "Wiesz, że coś nie działa, ale potrzebujesz czasu", "Dołącz do zamkniętej społeczności i zobacz, jak rozmawiamy o strategii, sprzedaży i produkcji.", "Dołącz do społeczności", "https://coordination.pl/spolecznosc/"],
  ["/assets/path-conversation.svg", "Jesteś gotowy na rozmowę", "Umów bezpłatną konsultację. Poznamy Twoją sytuację i wspólnie sprawdzimy, czy dalsza współpraca ma sens.", "Umów rozmowę", "#kontakt"],
] as const;

export default function Paths() {
  return (
    <section className={styles.paths}>
      <SectionIntro title="Nie oczekujemy, że każdy od razu będzie gotowy na rozmowę" />
      <div className={styles.pathGrid}>
        {paths.map(([image, title, copy, label, href]) => (
          <article key={title}>
            <img className={styles.pathIcon} src={image} alt="" />
            <h3>{title}</h3>
            <p>{copy}</p>
            <a href={href}>{label} <ArrowUpRight aria-hidden="true" /></a>
          </article>
        ))}
      </div>
    </section>
  );
}
