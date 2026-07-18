"use client";

import { useRef } from "react";
import styles from "./page.module.css";

export default function Header() {
  const mobileMenu = useRef<HTMLDetailsElement>(null);
  const closeMobileMenu = () => mobileMenu.current?.removeAttribute("open");

  return (
    <header className={styles.header}>
      <a className={styles.logoLink} href="#top" aria-label="Coordination — strona główna">
        <img src="/assets/logo.svg" alt="" />
      </a>
      <nav className={styles.desktopNav} aria-label="Główna nawigacja">
        <a href="#dla-kogo">Doradztwo dla firm</a>
        <a href="#proces">Jak pracujemy</a>
        <a href="#wsparcie">Obszary wsparcia</a>
        <a href="#wiedza">Zasoby</a>
        <a href="#o-nas">Poznaj nas lepiej</a>
      </nav>
      <a className={styles.headerCta} href="#kontakt">Bezpłatna konsultacja</a>
      <details className={styles.mobileMenu} ref={mobileMenu}>
        <summary aria-label="Otwórz menu"><span /><span /><span /></summary>
        <nav>
          <a href="#dla-kogo" onClick={closeMobileMenu}>Doradztwo dla firm</a>
          <a href="#proces" onClick={closeMobileMenu}>Jak pracujemy</a>
          <a href="#wsparcie" onClick={closeMobileMenu}>Obszary wsparcia</a>
          <a href="#wiedza" onClick={closeMobileMenu}>Zasoby</a>
          <a href="#kontakt" onClick={closeMobileMenu}>Kontakt</a>
        </nav>
      </details>
    </header>
  );
}
