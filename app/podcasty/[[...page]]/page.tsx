import type { Metadata } from "next";
import SubpageHeader from "@/components/SubpageHeader/SubpageHeader";
import PostIndex, { POSTS_PER_PAGE, pageHref, readPage } from "@/components/PostIndex/PostIndex";
import Footer from "@/components/Footer/Footer";
import SiteNav from "@/components/SiteNav/SiteNav";
import { listPublishedPosts } from "@/lib/blog/posts";

// Rendered on first visit and cached like /wiedza (lib/blog/cache.ts).
export function generateStaticParams(): { page?: string[] }[] {
  return [];
}

const BASE_PATH = "/podcasty";
const TITLE = "Odcinki podcastu";
const DESCRIPTION =
  "Odcinki Podcastu PNO w formie wpisów: strategia, sprzedaż i marketing w małej firmie do przeczytania i odsłuchania.";

type Props = { params: Promise<{ page?: string[] }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = readPage((await params).page, BASE_PATH);

  return {
    title: page === 1 ? `${TITLE} PNO` : `${TITLE} PNO - strona ${page}`,
    description: DESCRIPTION,
    alternates: { canonical: pageHref(BASE_PATH, page) },
  };
}

/** Posts in the "Podcast" category: entries written from the show's episodes. */
export default async function PodcastyPage({ params }: Props) {
  const page = readPage((await params).page, BASE_PATH);
  const { posts, total } = await listPublishedPosts(page, POSTS_PER_PAGE, "podcast");
  // Entries carry the show's cover; the header shows it like /podcast-pno does.
  const cover = posts.find((post) => post.cover)?.cover;

  return (
    <>
      <SiteNav variant="subpage" />
      <SubpageHeader
        title={TITLE}
        lead="Odcinki Podcastu PNO rozpisane na wpisy, do przeczytania i odsłuchania."
        crumbs={[{ label: "Strona główna", href: "/" }, { label: "Podcast PNO", href: "/podcast-pno" }, { label: TITLE }]}
        artwork={cover ? { src: cover.src, alt: "Okładka podcastu PNO" } : undefined}
        torn
        compact
      />
      <PostIndex
        posts={posts}
        page={page}
        total={total}
        basePath={BASE_PATH}
        empty="Wkrótce pojawią się tu pierwsze odcinki."
        label="Strony odcinków"
        layout="episodes"
      />
      <Footer />
    </>
  );
}
