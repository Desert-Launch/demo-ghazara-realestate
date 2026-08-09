import type { Metadata, Viewport } from "next";
import {
  IBM_Plex_Mono,
  IBM_Plex_Sans_Arabic,
  Inter,
  Manrope,
  Tajawal,
} from "next/font/google";

import { Providers } from "./providers";
import "./globals.css";

/* Two scripts, one voice.
   Display: Manrope for Latin, Tajawal for Arabic — both are humanist and
   square-shouldered, so a heading reads the same in either language.
   Body: Inter with IBM Plex Sans Arabic under it.
   Data: IBM Plex Mono for every price, area and reference.
   tokens.css picks the whole set from `lang` on the root — see the note there
   for why per-glyph fallback is not good enough. */
const displayLatin = Manrope({
  subsets: ["latin"],
  variable: "--font-gz-display-latin",
  display: "swap",
});

const displayArabic = Tajawal({
  subsets: ["arabic"],
  weight: ["400", "500", "700", "800"],
  variable: "--font-gz-display-ar",
  display: "swap",
});

const bodyLatin = Inter({
  subsets: ["latin"],
  variable: "--font-gz-body-latin",
  display: "swap",
});

const bodyArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-gz-body-ar",
  display: "swap",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-gz-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "غزارة العقارية — عقارات شمال الرياض",
    template: "%s · غزارة العقارية",
  },
  description:
    "وساطة عقارية في النرجس، شمال الرياض. شقق وأدوار وفلل وأراضٍ للبيع والإيجار في النرجس والياسمين والملقا والعارض.",
};

export const viewport: Viewport = {
  // The one literal colour in the app. It is serialised into a meta tag before
  // any stylesheet loads, so it cannot reference --gz-petrol-700; keep the two
  // in step by hand.
  themeColor: "#245c6b",
};

/**
 * Arabic and RTL are the defaults, on the server, before any JavaScript runs.
 * `DirectionSync` (in providers) is the only thing allowed to change these two
 * attributes afterwards.
 */
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // The font variables go on <html>, not <body>: tokens.css builds the family
    // stacks in `:root`, and a `var()` that resolves nowhere makes the whole
    // font-family declaration invalid — which silently drops the page to the
    // browser's default serif.
    <html
      lang="ar"
      dir="rtl"
      className={`${displayLatin.variable} ${displayArabic.variable} ${bodyLatin.variable} ${bodyArabic.variable} ${mono.variable}`}
    >
      <body className="min-h-dvh bg-background text-foreground">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
