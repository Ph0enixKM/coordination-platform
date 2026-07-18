import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Coordination — rozwój firmy zaczyna się od dobrych decyzji",
  description:
    "Doradztwo strategiczne dla właścicieli małych firm usługowych, produkcyjnych i handlowych.",
  icons: { icon: "/assets/logo.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pl">
      <body>{children}</body>
    </html>
  );
}
