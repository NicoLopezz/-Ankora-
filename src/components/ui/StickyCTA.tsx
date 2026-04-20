"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { ArrowUpRight } from "lucide-react";

export function StickyCTA() {
  const { scrollY, scrollYProgress } = useScroll();
  // Aparece recién después de que termina el pin del Hero (~1 viewport de scroll).
  // Antes de eso estamos en la "bienvenida", nada debe distraer del sello.
  const opacity = useTransform(scrollY, (y) => {
    const vh = typeof window !== "undefined" ? window.innerHeight : 800;
    // El pin del Hero dura +220vh; StickyCTA aparece recién cuando termina
    const start = vh * 2.2;
    const full = vh * 2.4;
    if (y < start) return 0;
    if (y < full) return (y - start) / (full - start);
    return 1;
  });
  // Fade out al final de la página
  const fadeOut = useTransform(scrollYProgress, [0.95, 1], [1, 0]);
  const finalOpacity = useTransform(
    [opacity, fadeOut],
    ([a, b]: number[]) => a * b,
  );
  const y = useTransform(scrollY, (v) => {
    const vh = typeof window !== "undefined" ? window.innerHeight : 800;
    const start = vh * 2.2;
    const full = vh * 2.4;
    if (v < start) return 40;
    if (v < full) return 40 * (1 - (v - start) / (full - start));
    return 0;
  });

  return (
    <motion.div
      style={{ opacity: finalOpacity, y }}
      className="pointer-events-auto fixed bottom-6 right-6 z-[90] hidden md:block"
    >
      <a
        href="#contacto"
        className="btn-gold group text-sm"
        data-cursor="hover"
      >
        <span>Invertir ahora</span>
        <ArrowUpRight className="h-4 w-4 transition-transform duration-500 ease-out group-hover:rotate-45" />
      </a>
    </motion.div>
  );
}
