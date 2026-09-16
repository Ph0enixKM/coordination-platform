import Link from "next/link";
import styles from "./SubpageHeader.module.css";

type SubpageHeaderProps = {
  /** The page title, shown as the large headline. */
  title: string;
  /** A short supporting line under the title. */
  lead?: string;
  /** Breadcrumbs back to the home page. */
  crumbs?: { label: string; href?: string }[];
};

export default function SubpageHeader({ title, lead, crumbs }: SubpageHeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.brand} aria-label="Coordination — strona główna">
          <img src="/assets/logo.svg" alt="" className={styles.logo} />
          <span className={styles.wordmark}>Coordination</span>
        </Link>

        {crumbs && crumbs.length > 0 && (
          <nav className={styles.crumbs} aria-label="Ścieżka okruszków">
            {crumbs.map((crumb, index) => (
              <span key={index} className={styles.crumb}>
                {crumb.href ? (
                  <Link href={crumb.href}>{crumb.label}</Link>
                ) : (
                  <span aria-current="page">{crumb.label}</span>
                )}
                {index < crumbs.length - 1 && <span className={styles.separator} aria-hidden="true">/</span>}
              </span>
            ))}
          </nav>
        )}

        <h1 className={styles.title}>{title}</h1>
        {lead && <p className={styles.lead}>{lead}</p>}
      </div>
    </header>
  );
}
