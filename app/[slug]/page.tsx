import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PostArticle, { heroImage } from "@/components/PostArticle/PostArticle";
import PostCard from "@/components/PostCard/PostCard";
import CtaButton from "@/components/CtaButton/CtaButton";
import Footer from "@/components/Footer/Footer";
import SiteNav from "@/components/SiteNav/SiteNav";
import CommunityTeaser from "@/components/CommunityTeaser/CommunityTeaser";
import { getPublishedPost, listPublishedPosts } from "@/lib/blog/posts";
import { siteUrl } from "@/lib/site";
import styles from "./post.module.css";

// Posts come from the database on every request: an edit in /admin shows up
// at once, with no rebuild.
export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

const DEFAULT_IMAGE = { url: "/images/coordination-og.png", width: 1200, height: 630, alt: "Coordination" };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPublishedPost((await params).slug);

  if (!post) return {};

  const title = post.seoTitle || post.title;
  const description = post.seoDescription || post.summary;
  const images = post.cover
    ? [{ url: post.cover.src, width: post.cover.width, height: post.cover.height, alt: post.cover.alt || post.title }]
    : [DEFAULT_IMAGE];

  return {
    title,
    description,
    keywords: post.focusKeyword || undefined,
    authors: post.author ? [{ name: post.author }] : undefined,
    alternates: { canonical: `/${post.slug}` },
    openGraph: {
      type: "article",
      locale: "pl_PL",
      siteName: "Coordination",
      url: `/${post.slug}`,
      title,
      description,
      publishedTime: post.publishedAt ?? undefined,
      modifiedTime: post.updatedAt,
      authors: post.author ? [post.author] : undefined,
      section: post.categories[0],
      images,
    },
    twitter: { card: "summary_large_image", title, description, images },
  };
}

export default async function PostPage({ params }: Props) {
  const post = await getPublishedPost((await params).slug);

  if (!post) notFound();

  const { posts: latest } = await listPublishedPosts(1, 4);
  const related = latest.filter((item) => item.id !== post.id).slice(0, 3);

  const hero = heroImage(post);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.seoDescription || post.summary,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: post.author ? { "@type": "Person", name: post.author } : undefined,
    publisher: { "@type": "Organization", name: "Coordination", logo: `${siteUrl}/images/apple-touch-icon.png` },
    image: hero ? `${siteUrl}${hero.src}` : undefined,
    mainEntityOfPage: `${siteUrl}/${post.slug}`,
  };

  return (
    <>
      <SiteNav variant="subpage" />
      <PostArticle post={post} />

      <div className={styles.community}>
        <div className={styles.communityInner}>
          <CommunityTeaser />
        </div>
      </div>

      {related.length > 0 && (
        <section className={styles.related} aria-labelledby="related-title">
          <div className={styles.relatedInner}>
            <h2 id="related-title" className={styles.relatedTitle}>
              Najnowsze wpisy
            </h2>
            <ul className={styles.relatedList}>
              {related.map((item) => (
                <li key={item.id} className={styles.relatedItem}>
                  <PostCard post={item} headingLevel={3} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className={styles.ctaSection}>
        <div className={styles.ctaInner}>
          <h2 className={styles.ctaTitle}>Chcesz porozmawiać o swojej firmie?</h2>
          <p className={styles.ctaText}>
            Umów bezpłatną konsultację, podczas której porozmawiamy o Twojej firmie i sprawdzimy, czy możemy realnie pomóc.
          </p>
          <CtaButton href="/#kontakt">Bezpłatna konsultacja</CtaButton>
        </div>
      </section>

      <Footer />

      <script
        type="application/ld+json"
        // "<" never closes the script tag early, whatever a title contains.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
      />
    </>
  );
}

