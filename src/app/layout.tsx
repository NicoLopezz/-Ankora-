import type { Metadata, Viewport } from "next";
import { Fraunces, Inter_Tight, Geist_Mono } from "next/font/google";
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

export const metadata: Metadata = {
  title: "Ankora — Anchored to real assets",
  description:
    "Marketplace regulado de tokenización de activos reales. Viñedos, tierras, inmobiliario e infraestructura desde USD 500. Operado por AMG Capital Group S.A. bajo régimen CNV RG 1069/2025.",
};

export const viewport: Viewport = {
  themeColor: "#1a0306",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="es"
      className={`${fraunces.variable} ${interTight.variable} ${geistMono.variable} antialiased`}
    >
      <body className="relative min-h-screen bg-[var(--background)] text-[var(--foreground)]">
        <SmoothScroll>
          <Nav />
          <ScrollProgress />
          {children}
        </SmoothScroll>
        <NoiseOverlay />
        <ClientChrome />
      </body>
    </html>
  );
}
