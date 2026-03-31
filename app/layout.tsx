import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { DM_Sans, JetBrains_Mono, Playfair_Display } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const siteUrl = "https://arnavmabrukar.vercel.app";
const siteTitle = "Arnav's Portfolio";
const siteDescription =
  "AI and full-stack engineer building real products across software, machine learning, and modern web development.";

const sans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const serif = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteTitle,
    template: `%s | ${siteTitle}`,
  },
  description: siteDescription,
  applicationName: siteTitle,
  icons: {
    icon: "/pokeball-pixel.svg",
    shortcut: "/pokeball-pixel.svg",
    apple: "/pokeball-pixel.svg",
  },
  alternates: {
    canonical: "/",
  },
  keywords: [
    "Arnav Mabrukar",
    "AI engineer",
    "full-stack engineer",
    "Rutgers computer science",
    "Rutgers data science",
    "Next.js portfolio",
    "software engineer portfolio",
  ],
  authors: [{ name: siteTitle, url: siteUrl }],
  creator: siteTitle,
  publisher: siteTitle,
  category: "technology",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    title: siteTitle,
    description: siteDescription,
    siteName: siteTitle,
    images: [
      {
        url: "/arnav-portrait.png",
        width: 1200,
        height: 1600,
        alt: "Portrait of Arnav Mabrukar",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: ["/arnav-portrait.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script id="theme-init" strategy="beforeInteractive">
          {`
            (() => {
              const storedTheme = localStorage.getItem("theme");
              const storedAccent = localStorage.getItem("accent");
              const theme = storedTheme || "dark";
              const accent = storedAccent || "peach";
              document.documentElement.dataset.theme = theme;
              document.documentElement.dataset.accent = accent;
            })();
          `}
        </Script>
      </head>
      <body className={`${sans.variable} ${serif.variable} ${mono.variable}`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
