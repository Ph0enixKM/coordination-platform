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
        <div><h3>Firma</h3><a href="#dla-kogo">Doradztwo dla firm</a><a href="#proces">Jak pracujemy</a><a href="#wsparcie">Obszary wsparcia</a><a href="#o-nas">Poznaj nas lepiej</a><a href="#kontakt">Kontakt</a></div>
        <div><h3>Zasoby</h3><a href="#wiedza">Baza wiedzy</a><a href="https://coordination.pl/spolecznosc/">Społeczność</a><a href="https://coordination.pl/podcast-pno/">Podcast</a><a href="https://coordination.pl/faq/">FAQ Hub</a></div>
        <div><h3>Szybki kontakt</h3><a href="mailto:kontakt@coordination.pl">kontakt@coordination.pl</a><a href="tel:+48790485873">+48 790 485 873</a></div>
      </div>
      <div className={styles.footerBottom}>Copyright © 2026 Coordination <span>|</span> <a href="https://coordination.pl/regulamin/">Regulamin</a> <span>|</span> <a href="https://coordination.pl/polityka-prywatnosci/">Polityka prywatności</a></div>
    </footer>
  );
}
