import Link from "next/link";
import LogoMark from "@/components/LogoMark/LogoMark";
import { FacebookIcon, InstagramIcon, LinkedInIcon } from "./SocialIcons";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerGrid}>
        <div className={styles.footerBrand}>
          <div className={styles.mark} role="img" aria-label="Coordination">
            <LogoMark tone="light" />
          </div>
          <p>Firmy rosną szybciej, gdy strategia, sprzedaż i marketing działają jako jeden system. My ten system projektujemy i wdrażamy.</p>
          <div className={styles.socials}>
            <a href="https://www.facebook.com/groups/804139875408843/" target="_blank" rel="noreferrer noopener" aria-label="Facebook"><FacebookIcon /></a>
            <a href="https://www.instagram.com/coordination.pl/" target="_blank" rel="noreferrer noopener" aria-label="Instagram"><InstagramIcon /></a>
            <a href="https://www.linkedin.com/in/szymon-pirko-bb00271b1/" target="_blank" rel="noreferrer noopener" aria-label="LinkedIn"><LinkedInIcon /></a>
          </div>
        </div>
        <div><h3>Firma</h3><Link href="/dla-kogo">Doradztwo dla firm</Link><Link href="/proces">Jak pracujemy</Link><Link href="/wsparcie">Obszary wsparcia</Link><Link href="/#kontakt">Kontakt</Link></div>
        <div><h3>Zasoby</h3><Link href="/wiedza">Baza wiedzy</Link><Link href="/spolecznosc">Społeczność</Link><Link href="/podcast-pno">Podcast</Link><Link href="/faq">FAQ Hub</Link></div>
        <div><h3>Szybki kontakt</h3><a href="mailto:kontakt@coordination.pl">kontakt@coordination.pl</a><a href="tel:+48790485873">+48 790 485 873</a></div>
      </div>
      <div className={styles.footerBottom}>Copyright © 2026 Coordination <span>|</span> <Link href="/regulamin">Regulamin</Link> <span>|</span> <Link href="/polityka-prywatnosci">Polityka prywatności</Link></div>
    </footer>
  );
}
