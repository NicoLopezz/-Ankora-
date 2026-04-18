import type { Metadata } from "next";
import { Fraunces, Inter_Tight, Geist_Mono, Geist } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/effects/SmoothScroll";
import { CustomCursor } from "@/components/effects/CustomCursor";
import { NoiseOverlay } from "@/components/effects/NoiseOverlay";
import { ScrollProgress } from "@/components/effects/ScrollProgress";
import { StickyCTA } from "@/components/ui/StickyCTA";
import { Nav } from "@/components/layout/Nav";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Arkara — Tokenización de activos reales",
  description:
    "Invertí en proyectos reales en cuatro pasos. Inmobiliario, agro e infraestructura tokenizados.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="es"
      className={cn("antialiased", fraunces.variable, interTight.variable, geistMono.variable, "font-sans", geist.variable)}
    >
      <body className="relative min-h-screen bg-[var(--background)] text-[var(--foreground)]">
        <SmoothScroll>
          <Nav />
          <ScrollProgress />
          {children}
          <StickyCTA />
        </SmoothScroll>
        <NoiseOverlay />
        <CustomCursor />
      </body>
    </html>
  );
}
