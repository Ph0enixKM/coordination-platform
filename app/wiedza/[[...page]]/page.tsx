import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import SubpageHeader from "@/components/SubpageHeader/SubpageHeader";
import PostCard from "@/components/PostCard/PostCard";
import CtaButton from "@/components/CtaButton/CtaButton";
import Footer from "@/components/Footer/Footer";
import SiteNav from "@/components/SiteNav/SiteNav";
import { listPublishedPosts } from "@/lib/blog/posts";
import styles from "./wiedza.module.css";

// Each page of the list is rendered on its first visit, then served from the
// page cache until a change in /admin marks it stale (lib/blog/cache.ts). The
// build renders none: it has no database to read them from. Pages live in the
// path, not in "?strona=", because the cache is keyed by path.
export function generateStaticParams(): { page?: string[] }[] {
  return [];
}

const PER_PAGE = 12;
const DESCRIPTION =
  "Wpisy o strategii, sprzedaży i marketingu dla właścicieli małych firm. Klient docelowy, definicja idealnego klienta, plan pozyskiwania klientów i więcej.";

type Props = { params: Promise<{ page?: string[] }> };

/** Page 1 is /wiedza and page n is /wiedza/strona/n; any other path is not a page. */
async function readPage(params: Props["params"]) {
  const segments = (await params).page;

  if (!segments) return 1;

  const [prefix, number, ...rest] = segments;
  const value = Number(number);

  if (prefix !== "strona" || rest.length > 0 || !/^\d+$/.test(number ?? "")) notFound();
  if (value === 1) permanentRedirect("/wiedza");
  if (value < 1) notFound();

  return value;
}

const pageHref = (page: number) => (page === 1 ? "/wiedza" : `/wiedza/strona/${page}`);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = await readPage(params);

  return {
    title: page === 1 ? "Baza wiedzy" : `Baza wiedzy - strona ${page}`,
    description: DESCRIPTION,
    alternates: { canonical: pageHref(page) },
  };
}

export default async function WiedzaPage({ params }: Props) {
  const page = await readPage(params);
  const { posts, total } = await listPublishedPosts(page, PER_PAGE);
  const pages = Math.max(1, Math.ceil(total / PER_PAGE));

  if (page > pages) notFound();

  return (
    <>
      <SiteNav variant="subpage" />
      <SubpageHeader
        title="Baza wiedzy"
        crumbs={[{ label: "Strona główna", href: "/" }, { label: "Baza wiedzy" }]}
      />

      <section className={styles.section}>
        <div className={styles.inner}>
          {posts.length === 0 ? (
            <p className={styles.empty}>Wkrótce pojawią się tu pierwsze wpisy.</p>
          ) : (
            <ul className={styles.list}>
              {posts.map((post) => (
                <li key={post.id} className={styles.item}>
                  <PostCard post={post} />
                </li>
              ))}
            </ul>
          )}

          {pages > 1 && <Pagination page={page} pages={pages} />}
        </div>
      </section>

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
    </>
  );
}

/** First, last and the pages around the current one; gaps become an ellipsis. */
function pageNumbers(page: number, pages: number) {
  const shown = [...new Set([1, page - 1, page, page + 1, pages])].filter((n) => n >= 1 && n <= pages).sort((a, b) => a - b);

  return shown.flatMap((n, index) => (index > 0 && n - shown[index - 1] > 1 ? ["gap" as const, n] : [n]));
}

function Pagination({ page, pages }: { page: number; pages: number }) {
  return (
    <nav className={styles.pagination} aria-label="Strony wpisów">
      {page > 1 ? (
        <Link className={styles.step} href={pageHref(page - 1)} rel="prev">
          ← Nowsze
        </Link>
      ) : (
        <span className={styles.step} aria-hidden="true" />
      )}

      <ol className={styles.pages}>
        {pageNumbers(page, pages).map((item, index) =>
          item === "gap" ? (
            <li key={`gap-${index}`} className={styles.gap} aria-hidden="true">
              …
            </li>
          ) : (
            <li key={item}>
              <Link
                className={styles.page}
                href={pageHref(item)}
                aria-current={item === page ? "page" : undefined}
                aria-label={`Strona ${item}`}
              >
                {item}
              </Link>
            </li>
          ),
        )}
      </ol>

      {page < pages ? (
        <Link className={styles.step} href={pageHref(page + 1)} rel="next">
          Starsze →
        </Link>
      ) : (
        <span className={styles.step} aria-hidden="true" />
      )}
    </nav>
  );
}
