import type { NextConfig } from "next";
import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

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

export default withBundleAnalyzer(nextConfig);
