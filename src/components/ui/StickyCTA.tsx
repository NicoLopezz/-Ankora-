"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { ArrowUpRight } from "lucide-react";

export function StickyCTA() {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.08, 0.95, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.08], [40, 0]);

  return (
    <motion.div
      style={{ opacity, y }}
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
