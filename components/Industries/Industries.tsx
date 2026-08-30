import SectionIntro from "@/components/SectionIntro/SectionIntro";
import styles from "./Industries.module.css";

const industries = [
  ["/assets/industry-services.png", "Firmy usługowe i eksperckie", "Pomagamy uporządkować ofertę, proces sprzedaży, komunikację i sposób pracy z klientami, aby rozwój nie zależał wyłącznie od właściciela i jego osobistego zaangażowania."],
  ["/assets/industry-production.png", "Firmy produkcyjne i techniczne", "Porządkujemy decyzje handlowe, priorytety, ofertowanie i współpracę sprzedaży z realizacją, aby firma nie przyjmowała zleceń, które generują obrót, ale niszczą marżę i planowanie."],
  ["/assets/industry-commerce.png", "Firmy handlowe i dystrybucyjne", "Pomagamy określić, na czym firma ma konkurować poza ceną, jakich klientów wybierać i jak zbudować bardziej przewidywalny proces sprzedaży."],
  ["/assets/industry-family.png", "Firmy rodzinne", "Pomagamy oddzielić relacje od zarządzania, uporządkować role, odpowiedzialności i sposób podejmowania decyzji, aby firma nie zależała od nieformalnych ustaleń i bieżących emocji."],
] as const;

export default function Industries() {
  return (
    <section className={styles.industries}>
      <SectionIntro title="Dla jakich firm jest ta współpraca">
        Pracujemy z właścicielami firm, które już działają, mają klientów, zespół i powtarzalne przychody, ale zaczynają odczuwać, że dalszy rozwój nie może opierać się wyłącznie na intuicji, osobistym zaangażowaniu właściciela i gaszeniu bieżących problemów.
      </SectionIntro>
      <div className={styles.industryGrid}>
        {industries.map(([image, title, copy], index) => (
          <article key={title}>
            <div className={styles.industryVisual}>
              <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              <img src={image} alt="" />
            </div>
            <div className={styles.industryCopy}><h3>{title}</h3><p>{copy}</p></div>
          </article>
        ))}
      </div>
    </section>
  );
}
