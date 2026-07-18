import SectionIntro from "@/components/SectionIntro/SectionIntro";
import styles from "./Media.module.css";

const mediaLinks = [
  ["https://open.spotify.com/show/0dlekJRAAzprqI93yYABGf", "/assets/spotify.webp", "Spotify"],
  ["https://www.youtube.com/@szymon_pirko", "/assets/youtube.webp", "YouTube"],
  ["https://podcasts.apple.com/us/podcast/podcast-pno-pozytywny-networking-online/id1722037002", "/assets/apple-podcasts.webp", "Apple Podcasts"],
] as const;

export default function Media() {
  return (
    <section className={styles.media}>
      <SectionIntro kicker="Materiały bezpłatne" title="Posłuchaj nas" />
      <div className={styles.mediaGrid}>
        {mediaLinks.map(([href, image, label]) => (
          <a key={label} href={href} target="_blank" rel="noreferrer"><img src={image} alt={label} /></a>
        ))}
      </div>
    </section>
  );
}
