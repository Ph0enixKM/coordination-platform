import type { Metadata } from "next";
import SubpageHeader from "@/components/SubpageHeader/SubpageHeader";
import PostIndex, { POSTS_PER_PAGE, pageHref, readPage } from "@/components/PostIndex/PostIndex";
import Footer from "@/components/Footer/Footer";
import SiteNav from "@/components/SiteNav/SiteNav";
import { listPublishedPosts } from "@/lib/blog/posts";

// Each page of the list is rendered on its first visit, then served from the
// page cache until a change in /admin marks it stale (lib/blog/cache.ts). The
// build renders none: it has no database to read them from.
export function generateStaticParams(): { page?: string[] }[] {
  return [];
}

const BASE_PATH = "/wiedza";
const DESCRIPTION =
  "Wpisy o strategii, sprzedaży i marketingu dla właścicieli małych firm. Klient docelowy, definicja idealnego klienta, plan pozyskiwania klientów i więcej.";

type Props = { params: Promise<{ page?: string[] }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = readPage((await params).page, BASE_PATH);

  return {
    title: page === 1 ? "Baza wiedzy" : `Baza wiedzy - strona ${page}`,
    description: DESCRIPTION,
    alternates: { canonical: pageHref(BASE_PATH, page) },
  };
}

export default async function WiedzaPage({ params }: Props) {
  const page = readPage((await params).page, BASE_PATH);
  const { posts, total } = await listPublishedPosts(page, POSTS_PER_PAGE, "blog");

  return (
    <>
      <SiteNav variant="subpage" />
      <SubpageHeader
        title="Baza wiedzy"
        crumbs={[{ label: "Strona główna", href: "/" }, { label: "Baza wiedzy" }]}
      />
      <PostIndex
        posts={posts}
        page={page}
        total={total}
        basePath={BASE_PATH}
        empty="Wkrótce pojawią się tu pierwsze wpisy."
        label="Strony wpisów"
      />
      <Footer />
    </>
  );
}
