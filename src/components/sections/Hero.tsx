"use client";

import { motion, type Variants } from "motion/react";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { RotatingSeal } from "@/components/ui/RotatingSeal";

const EASE = [0.16, 1, 0.3, 1] as const;

const reveal: Variants = {
  hidden: { y: "110%" },
  show: (i: number) => ({
    y: "0%",
    transition: { duration: 1.1, ease: EASE, delay: 0.1 + i * 0.08 },
  }),
};

const words = ["Tokenizá", "lo", "real."];
const words2 = ["Invertí", "en", "minutos."];

export function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-screen w-full flex-col justify-end overflow-hidden pb-16 pt-40"
    >
      {/* Gradient radial de fondo */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse at 50% 30%, color-mix(in oklab, var(--burnt-rose) 55%, transparent) 0%, transparent 55%), radial-gradient(ellipse at 80% 90%, color-mix(in oklab, var(--bronze) 25%, transparent) 0%, transparent 45%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.8 }}
        className="pointer-events-none absolute right-8 top-28 hidden md:block lg:right-20 lg:top-32"
      >
        <RotatingSeal size={180} />
      </motion.div>

      <div className="mx-auto w-full max-w-7xl px-6">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          className="mb-10 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.3em] text-[var(--pale-oak)]/60"
        >
          <span className="inline-block h-px w-10 bg-[var(--bronze)]" />
          Arkara — Tokenización de activos reales
        </motion.p>

        <h1 className="font-display text-[clamp(3rem,12vw,11rem)] font-light leading-[0.92] tracking-[-0.03em] text-[var(--pale-oak)]">
          <span className="mb-3 flex flex-wrap gap-x-[0.35em] overflow-hidden">
            {words.map((w, i) => (
              <span key={i} className="inline-block overflow-hidden pb-[0.12em]">
                <motion.span
                  custom={i}
                  initial="hidden"
                  animate="show"
                  variants={reveal}
                  className={`inline-block ${i === 1 ? "italic text-[var(--bronze)]" : ""}`}
                >
                  {w}
                </motion.span>
              </span>
            ))}
          </span>
          <span className="flex flex-wrap gap-x-[0.35em] overflow-hidden">
            {words2.map((w, i) => (
              <span key={i} className="inline-block overflow-hidden pb-[0.12em]">
                <motion.span
                  custom={i + words.length}
                  initial="hidden"
                  animate="show"
                  variants={reveal}
                  className={`inline-block ${i === 2 ? "gradient-text" : ""}`}
                >
                  {w}
                </motion.span>
              </span>
            ))}
          </span>
        </h1>

        <div className="mt-14 flex flex-col items-start justify-between gap-10 md:flex-row md:items-end">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 1.3 }}
            className="max-w-sm text-balance text-base leading-relaxed text-[var(--pale-oak)]/75"
          >
            Acceso fraccional a proyectos inmobiliarios, agrícolas y de infraestructura.
            Cuatro pasos, sin intermediarios.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 1.45 }}
            className="flex flex-wrap items-center gap-4"
          >
            <MagneticButton href="#proyectos" className="btn-gold group" strength={0.3}>
              Ver proyectos
              <ArrowUpRight className="h-4 w-4 transition-transform duration-500 ease-out group-hover:rotate-45" />
            </MagneticButton>
            <MagneticButton
              href="#pasos"
              className="inline-flex items-center gap-2 rounded-full border border-[var(--pale-oak)]/30 px-6 py-[0.95rem] text-sm text-[var(--pale-oak)] transition-colors duration-300 hover:border-[var(--bronze)] hover:text-[var(--bronze)]"
              strength={0.25}
            >
              Cómo funciona
              <ArrowDown className="h-4 w-4" />
            </MagneticButton>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 2 }}
          className="mt-20 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--pale-oak)]/50"
        >
          <span className="h-[6px] w-[6px] animate-pulse rounded-full bg-[var(--bronze)]" />
          Scroll
        </motion.div>
      </div>
    </section>
  );
}
