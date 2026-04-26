import type { Metadata } from "next";
import { Fraunces, Inter_Tight, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { PageTransition } from "@/components/PageTransition";
import { CustomCursor } from "@/components/CustomCursor";
import { ScrollProgress } from "@/components/ScrollProgress";
import { EasterEgg } from "@/components/EasterEgg";
import { CursorTrail } from "@/components/CursorTrail";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  // Variable font — weight and style are handled via CSS font-variation-settings
  weight: "variable",
  style: ["normal", "italic"],
  display: "swap",
});

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://saikiran.dev"),
  title: {
    default: "Saikiran — Frontend Engineer",
    template: "%s · Saikiran",
  },
  description:
    "Frontend engineer in Delhi building interfaces for healthcare. Specialising in React, Redux, and TypeScript.",
  authors: [{ name: "Saikiran" }],
  creator: "Saikiran",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://saikiran.dev",
    siteName: "Saikiran",
    title: "Saikiran — Frontend Engineer",
    description:
      "Frontend engineer in Delhi building interfaces for healthcare. Specialising in React, Redux, and TypeScript.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Saikiran — Frontend Engineer",
    description:
      "Frontend engineer in Delhi building interfaces for healthcare.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Saikiran",
  url: "https://saikiran.dev",
  jobTitle: "Software Engineer II",
  worksFor: {
    "@type": "Organization",
    name: "Carelon Global Solutions (Elevance Health)",
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Delhi",
    addressCountry: "IN",
  },
  sameAs: [
    "https://github.com/SaikiranIvaturi",
    "https://www.linkedin.com/in/saikiran-ivaturi/",
  ],
};

// Inline script to prevent theme flash before hydration
const themeScript = `
(function() {
  try {
    var stored = localStorage.getItem('theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var isDark = stored ? stored === 'dark' : true;
    if (isDark) document.documentElement.classList.add('dark');
  } catch(e) {
    document.documentElement.classList.add('dark');
  }
})();
`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${fraunces.variable} ${interTight.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body className="min-h-screen flex flex-col relative z-0">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[var(--surface)] focus:text-[var(--ink)] focus:text-sm focus:rounded focus:shadow-lg"
        >
          Skip to content
        </a>
        <Nav />
        <ScrollProgress />
        <main id="main" className="flex-1">
          <PageTransition>{children}</PageTransition>
        </main>
        <Footer />
        <CustomCursor />
        <CursorTrail />
        <EasterEgg />
      </body>
    </html>
  );
}
