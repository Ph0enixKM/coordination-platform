import Image from "next/image";
import { ArrowUpRight, Podcast } from "lucide-react";
import styles from "./SocialMedia.module.css";

function SpotifyIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <circle cx="12" cy="12" r="12" />
      <g fill="none" stroke="var(--navy)" strokeLinecap="round">
        <path d="M5.2 8.6c4.5-1.3 9.4-.9 13.5 1.4" strokeWidth="2" />
        <path d="M6 12c3.8-1.1 7.8-.6 11.3 1.2" strokeWidth="1.7" />
        <path d="M6.8 15.3c3.1-.8 6.2-.5 9.2 1" strokeWidth="1.5" />
      </g>
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8Z" />
      <path d="m9.6 15.6 6.2-3.6-6.2-3.6Z" fill="var(--navy)" />
    </svg>
  );
}

const platforms = [
  {
    name: "Spotify",
    href: "https://open.spotify.com/show/0dlekJRAAzprqI93yYABGf",
    icon: SpotifyIcon,
    color: "spotify",
  },
  {
    name: "YouTube",
    href: "https://www.youtube.com/@szymon_pirko",
    icon: YouTubeIcon,
    color: "youtube",
  },
  {
    name: "Apple Podcasts",
    href: "https://podcasts.apple.com/us/podcast/podcast-pno-strategicznie-o-firmie/id1722037002",
    icon: Podcast,
    color: "apple",
  },
] as const;

export default function SocialMedia() {
  return (
    <section className={styles.section} id="podcast" aria-labelledby="podcast-title">
      <div className={styles.panel}>
        <div className={styles.content}>
          <h2 id="podcast-title" className={styles.title}>Posłuchaj nas <span>na</span></h2>
          <p className={styles.description}>
            O strategii, sprzedaży i marketingu. Dołącz do rozmów
            Szymona i znajdź inspirację do rozwoju swojej firmy.
          </p>
          <ul className={styles.platforms} aria-label="Platformy z naszymi rozmowami">
            {platforms.map(({ name, href, icon: Icon, color }) => (
              <li key={name}>
                <a className={styles.platform} href={href} target="_blank" rel="noopener noreferrer">
                  <span className={`${styles.icon} ${styles[color]}`}><Icon aria-hidden="true" /></span>
                  <span className={styles.platformName}>{name}</span>
                  <ArrowUpRight className={styles.arrow} aria-hidden="true" />
                  <span className={styles.srOnly}> (otwiera się w nowej karcie)</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
        <figure className={styles.portrait}>
          <div className={styles.halo} aria-hidden="true" />
          <Image
            className={styles.photo}
            src="/assets/szymon.png"
            alt="Szymon Pirko wskazujący na platformy z rozmowami"
            width={2560}
            height={1707}
            sizes="(max-width: 760px) 800px, (max-width: 1100px) 75vw, 850px"
          />
          <figcaption className={styles.caption}>
            <span className={styles.captionLine} aria-hidden="true" />
            <span><strong>Szymon Pirko</strong><span>Doradca ds. strategii,<br />sprzedaży i marketingu</span></span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
