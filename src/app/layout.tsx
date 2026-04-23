import type { Metadata, Viewport } from "next";
import { Fraunces, Inter_Tight, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import "./globals.css";
import { SmoothScroll } from "@/components/effects/SmoothScroll";
import { NoiseOverlay } from "@/components/effects/NoiseOverlay";
import { ScrollProgress } from "@/components/effects/ScrollProgress";
import { ClientChrome } from "@/components/effects/ClientChrome";
import { Nav } from "@/components/layout/Nav";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400"],
  style: ["normal", "italic"],
});

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["400"],
});

const siteUrl = "https://ankora.blexgroup.com";
const siteDescription =
  "Regulated marketplace for tokenized real-world assets. Vineyards, land, real estate and infrastructure from USD 500. Operated by AMG Capital Group S.A. under CNV regime RG 1069/2025.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Ankora — Anchored to real assets",
  description: siteDescription,
  openGraph: {
    title: "Ankora — Anchored to real assets",
    description: siteDescription,
    url: siteUrl,
    siteName: "Ankora",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ankora — Anchored to real assets",
    description: siteDescription,
  },
};

export const viewport: Viewport = {
  themeColor: "#1a0306",
  colorScheme: "dark",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const locale = await getLocale();
  const messages = await getMessages();
  return (
    <html
      lang={locale}
      className={`${fraunces.variable} ${interTight.variable} ${geistMono.variable} antialiased`}
    >
      <body className="relative min-h-screen bg-[var(--background)] text-[var(--foreground)]">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <SmoothScroll>
            <Nav />
            <ScrollProgress />
            {children}
          </SmoothScroll>
          <NoiseOverlay />
          <ClientChrome />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
