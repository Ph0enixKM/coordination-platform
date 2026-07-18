import styles from "./SectionIntro.module.css";

type SectionIntroProps = {
  kicker: string;
  title: string;
  children?: React.ReactNode;
};

export default function SectionIntro({ kicker, title, children }: SectionIntroProps) {
  return (
    <div className={styles.sectionIntro}>
      <p className={styles.kicker}>{kicker}</p>
      <h2>{title}</h2>
      {children && <p className={styles.description}>{children}</p>}
    </div>
  );
}
