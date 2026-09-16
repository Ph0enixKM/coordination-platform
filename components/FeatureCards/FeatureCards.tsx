import styles from "./FeatureCards.module.css";

export type FeatureCard = {
  title: string;
  description: string;
};

/**
 * A grid of plain cards — title over a paragraph — used by the content subpages
 * (społeczność, podcast) for their "dla kogo" and "o czym" sections.
 */
export default function FeatureCards({
  cards,
  columns = 3,
  variant = "grid",
}: {
  cards: readonly FeatureCard[];
  columns?: 2 | 3;
  variant?: "grid" | "stacked";
}) {
  return (
    <div
      className={styles.cards}
      data-columns={columns}
      data-variant={variant}
    >
      {cards.map((card) => (
        <article key={card.title} className={styles.card}>
          <h3 className={styles.title}>{card.title}</h3>
          <p className={styles.description}>{card.description}</p>
        </article>
      ))}
    </div>
  );
}
