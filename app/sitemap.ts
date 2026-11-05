import { siteUrl } from "@/lib/site";
import { listPublishedSlugs } from "@/lib/blog/posts";
import type { MetadataRoute } from "next";

// Built per request so newly published posts are listed without a rebuild.
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await listPublishedSlugs();

  return [
    { url: `${siteUrl}/` },
    { url: `${siteUrl}/dla-kogo` },
    { url: `${siteUrl}/proces` },
    { url: `${siteUrl}/wsparcie` },
    { url: `${siteUrl}/wiedza` },
    { url: `${siteUrl}/spolecznosc` },
    { url: `${siteUrl}/podcast-pno` },
    { url: `${siteUrl}/faq` },
    { url: `${siteUrl}/regulamin` },
    { url: `${siteUrl}/polityka-prywatnosci` },
    ...posts.map((post) => ({ url: `${siteUrl}/${post.slug}`, lastModified: post.updated_at })),
  ];
}
