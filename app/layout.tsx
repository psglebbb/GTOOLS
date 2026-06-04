import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GTOOLS — The Graphic Tools Museum",
  description:
    "An online archive of graphic-design tools curated as a series of links. Based in Linz, Austria.",
  openGraph: {
    title: "GTOOLS — The Graphic Tools Museum",
    description:
      "An online archive of graphic-design tools curated as a series of links.",
    siteName: "GTOOLS",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
