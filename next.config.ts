import type { NextConfig } from "next";
import bundleAnalyzer from "@next/bundle-analyzer";
import createNextIntlPlugin from "next-intl/plugin";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["lucide-react", "motion"],
  },
  images: {
    formats: ["image/avif", "image/webp"],
    // Ajustado a los tamaños reales que renderizamos (mobile 100vw ~ 640, desktop panel ~ 800-1600).
    deviceSizes: [640, 828, 1080, 1280, 1600, 1920],
    imageSizes: [160, 240, 384, 640],
  },
};

export default withNextIntl(withBundleAnalyzer(nextConfig));
