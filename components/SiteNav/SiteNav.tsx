"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import styles from "./SiteNav.module.css";

const LINKS = [
  { href: "/dla-kogo", label: "Doradztwo dla firm" },
  { href: "/proces", label: "Jak pracujemy" },
  { href: "/wsparcie", label: "Obszary wsparcia" },
  { href: "/wiedza", label: "Baza wiedzy" },
  { href: "/podcast-pno", label: "Podcast" },
];

/** Past this point the hero's own logo is gone, so the bar shows a small one. */
const BRAND_AFTER = 320;

type SiteNavProps = {
  /**
   * "home" sits over the light home hero, which carries the big logo, so the
   * pill only grows its own once that has scrolled away. "subpage" sits over
   * a subpage's navy header, which has no logo of its own: the pill shows
   * its logo from the start, and while it rests on the navy its links are
   * white.
   */
  variant?: "home" | "subpage";
  /**
   * The colour of the "Kontakt" button, for a page with its own accent (the
   * community page is red). Defaults to the brand orange.
   */
  accent?: string;
};

/**
 * The site's top bar: a centred pill that floats over the page as it
 * scrolls. On narrow screens the links fold into a menu under it.
 */
export default function SiteNav({ variant = "home", accent }: SiteNavProps) {
  const subpage = variant === "subpage";
  const pathname = usePathname();
  const [top, setTop] = useState(true);
  // A subpage starts with the logo in, so nothing slides in on load.
  const [scrolled, setScrolled] = useState(subpage);
  const [open, setOpen] = useState(false);
  // "Kontakt" jumps to the contact section where the page has one; elsewhere
  // it leads to the one on the home page.
  const [contactHref, setContactHref] = useState("#kontakt");

  useEffect(() => {
    if (!document.getElementById("kontakt")) setContactHref("/#kontakt");
  }, []);

  useEffect(() => {
    const update = () => {
      setTop(window.scrollY <= 0);
      setScrolled(subpage || window.scrollY > BRAND_AFTER);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });

    return () => window.removeEventListener("scroll", update);
  }, [subpage]);

  useEffect(() => {
    if (!open) return;

    const close = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);

    window.addEventListener("keydown", close);

    return () => window.removeEventListener("keydown", close);
  }, [open]);

  return (
    <header
      className={styles.bar}
      data-variant={variant}
      style={accent ? ({ "--nav-accent": accent } as React.CSSProperties) : undefined}
      data-top={top || undefined}
      data-scrolled={scrolled || undefined}
      data-open={open || undefined}
    >
      {/* Narrow screens slide the pill along this track. */}
      <div className={styles.track}>
        <nav className={styles.inner} aria-label="Menu główne">
          <Link href="/" className={styles.brand} aria-label="Coordination - strona główna" tabIndex={scrolled || open ? 0 : -1}>
            <img src="/assets/logo.svg" alt="" width={26} height={20} />
            <span>Coordination</span>
          </Link>

          <ul id="site-menu" className={styles.links}>
            {LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={styles.link}
                  aria-current={pathname === link.href ? "page" : undefined}
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className={styles.contactItem}>
              <a href={contactHref} className={styles.contact} onClick={() => setOpen(false)}>
                Kontakt
              </a>
            </li>
          </ul>

          <button
            type="button"
            className={styles.toggle}
            aria-expanded={open}
            aria-controls="site-menu"
            onClick={() => setOpen((current) => !current)}
          >
            {open ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
            <span className={styles.toggleLabel}>{open ? "Zamknij" : "Menu"}</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
