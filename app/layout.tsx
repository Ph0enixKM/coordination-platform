import type { Metadata, Viewport } from "next";
import "./globals.css";
import { siteUrl } from "@/lib/site";

const title = "Coordination — rozwój firmy zaczyna się od dobrych decyzji";
const description =
  "Doradztwo strategiczne dla właścicieli małych firm usługowych, produkcyjnych i handlowych. Uporządkuj priorytety i podejmuj lepsze decyzje z Coordination.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: title, template: "%s | Coordination" },
  description,
  applicationName: "Coordination",
  authors: [{ name: "Coordination" }],
  creator: "Coordination",
  publisher: "Coordination",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pl_PL",
    url: "/",
    siteName: "Coordination",
    title,
    description,
    images: [{
      url: "/images/coordination-og.png",
      width: 1200,
      height: 630,
      type: "image/png",
      alt: "Coordination — Rozwój firmy zaczyna się od dobrych decyzji. Granatowe logo 3D na białym tle.",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [{ url: "/images/coordination-og.png", alt: "Coordination — rozwój firmy zaczyna się od dobrych decyzji" }],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  icons: {
    icon: [{ url: "/assets/logo.svg", type: "image/svg+xml" }, { url: "/images/icon-32.png", sizes: "32x32", type: "image/png" }],
    apple: [{ url: "/images/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = { themeColor: "#012141", colorScheme: "light" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pl">
      <body>{children}</body>
    </html>
  );
}
