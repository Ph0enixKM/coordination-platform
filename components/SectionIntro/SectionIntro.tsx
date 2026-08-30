import styles from "./SectionIntro.module.css";

type SectionIntroProps = {
  title: string;
  children?: React.ReactNode;
};

export default function SectionIntro({ title, children }: SectionIntroProps) {
  return (
    <div className={styles.sectionIntro}>
      <h2>{title}</h2>
      {children && <p className={styles.description}>{children}</p>}
    </div>
  );
}
