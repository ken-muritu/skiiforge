import localFont from "next/font/local";

// Use locally-downloaded woff2 (from directed.dev forensic capture) so the
// build never depends on Google Fonts network access.
export const plusJakarta = localFont({
  src: "./public/fonts/5c285b27cdda1fe8-s.p.a62025f2.woff2",
  variable: "--font-plus-jakarta",
  weight: "400 700",
  display: "swap",
});

export const dmSans = localFont({
  src: "./public/fonts/83afe278b6a6bb3c-s.p.3a6ba036.woff2",
  variable: "--font-dm-sans",
  weight: "400 500",
  display: "swap",
});

export const inter = localFont({
  src: "./public/fonts/fba5a26ea33df6a3-s.p.1bbdebe6.woff2",
  variable: "--font-inter",
  weight: "400 500",
  display: "swap",
});

export const fontVars = `${plusJakarta.variable} ${dmSans.variable} ${inter.variable}`;
