const PRODUCTION_URL = "https://coordination.pl";

// Na Vercelu (preview i deploymenty przed przepięciem domeny) coordination.pl
// wciąż serwuje starą stronę, więc bezwzględne URL-e z metadanych — m.in. OG
// image — kończyłyby się tam 404. VERCEL_URL wskazuje na aktualny deployment.
function resolveSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_ENV === "production") return PRODUCTION_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return PRODUCTION_URL;
}

export const siteUrl = resolveSiteUrl();
