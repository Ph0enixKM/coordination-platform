import { ArrowUpRight } from "lucide-react";
import styles from "./Knowledge.module.css";

const articles = [
  ["/assets/article-notion.png", "17 lipca, 2026", "Czy Notion nadaje się do prowadzenia małej firmy? Zalety, wady i praktyczne zastosowania"],
  ["/assets/article-planning.png", "15 lipca, 2026", "Jakie narzędzie wybrać do planowania pracy małego zespołu? Praktyczny przewodnik dla właścicieli MŚP"],
  ["/assets/article-crm.png", "13 lipca, 2026", "CRM dla małej firmy usługowej – jaki system wybrać i na co zwrócić uwagę?"],
] as const;

export default function Knowledge() {
  return (
    <section className={styles.knowledge} id="wiedza">
      <div className={styles.sectionHeaderRow}>
        <div><p className={styles.kicker}>Baza wiedzy</p><h2>Najnowsze wpisy</h2></div>
        <a href="https://coordination.pl/blog-coordination/">Zobacz wszystkie <ArrowUpRight aria-hidden="true" /></a>
      </div>
      <div className={styles.articleGrid}>
        {articles.map(([image, date, title]) => (
          <article key={title}>
            <img src={image} alt="" />
            <p>{date} <i /> autorstwa Szymon Pirko</p>
            <h3>{title}</h3>
            <a href="https://coordination.pl/blog-coordination/">Czytaj <ArrowUpRight aria-hidden="true" /></a>
          </article>
        ))}
      </div>
    </section>
  );
}
