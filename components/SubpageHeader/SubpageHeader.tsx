import Link from "next/link";
import TornEdge from "@/components/TornEdge/TornEdge";
import styles from "./SubpageHeader.module.css";

type SubpageHeaderProps = {
  /** The page title, shown as the large headline. */
  title: string;
  /** A short supporting line under the title. */
  lead?: string;
  /** Breadcrumbs back to the home page. */
  crumbs?: { label: string; href?: string }[];
  /** "article" sets long headlines, like blog post titles, smaller and wider. */
  variant?: "page" | "article";
  /** Extra lines under the title, e.g. a post's date and author. */
  children?: React.ReactNode;
  /** A photo behind the header, fading out of the navy so the title stays legible. */
  image?: { src: string };
  /** A square cover, e.g. a podcast's, shown whole as a tile beside the title,
      the header behind it tinted with the cover's own colours. */
  artwork?: { src: string; alt: string };
  /** Ends the header in the torn paper from the podcast cover's corner. */
  torn?: boolean;
  /** Something of the page's own beside the title, e.g. an emblem. */
  aside?: React.ReactNode;
  /** A mark blurred into a soft glow in the header's corner, the way the
      podcast cover washes its header; decorative only. */
  glow?: React.ReactNode;
};

export default function SubpageHeader({ title, lead, crumbs, variant = "page", children, image, artwork, torn, aside, glow }: SubpageHeaderProps) {
  const content = (
    <>
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
      {children}
    </>
  );

  return (
    <header className={styles.header} data-variant={variant} data-image={image ? "" : undefined} data-artwork={artwork ? "" : undefined} data-torn={torn ? "" : undefined}>
      {artwork && (
        <>
          {/* The cover blurred into a wash of its own colours, as Apple Music
              does behind an album; decorative, the tile below is the image. */}
          <img className={styles.wash} src={artwork.src} alt="" decoding="async" />
          <span className={styles.washShade} aria-hidden="true" />
        </>
      )}
      {glow && (
        <span className={styles.glow} aria-hidden="true">
          {glow}
        </span>
      )}
      {image && (
        <>
          {/* Decorative: the title right above it says what the page is about. */}
          <img className={styles.backdrop} src={image.src} alt="" fetchPriority="high" decoding="async" />
          <span className={styles.shade} aria-hidden="true" />
        </>
      )}
      {artwork || aside ? (
        <div className={styles.inner} data-aside="">
          <div className={styles.copy}>{content}</div>
          {artwork ? (
            <figure className={styles.artwork}>
              <img src={artwork.src} alt={artwork.alt} width={1200} height={1200} fetchPriority="high" decoding="async" />
            </figure>
          ) : (
            aside
          )}
        </div>
      ) : (
        <div className={styles.inner}>{content}</div>
      )}
      {torn && <TornEdge />}
    </header>
  );
}
