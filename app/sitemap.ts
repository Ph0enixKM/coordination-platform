import { siteUrl } from "@/lib/site";
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${siteUrl}/` },
    { url: `${siteUrl}/dla-kogo` },
    { url: `${siteUrl}/proces` },
    { url: `${siteUrl}/wsparcie` },
    { url: `${siteUrl}/o-nas` },
    { url: `${siteUrl}/wiedza` },
    { url: `${siteUrl}/spolecznosc` },
    { url: `${siteUrl}/podcast-pno` },
    { url: `${siteUrl}/faq` },
    { url: `${siteUrl}/regulamin` },
    { url: `${siteUrl}/polityka-prywatnosci` },
  ];
}
