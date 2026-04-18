"use client";

import { motion } from "motion/react";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { ArrowUpRight } from "lucide-react";

export function CTA() {
  return (
    <section id="contacto" className="relative mx-auto w-full max-w-7xl px-6 py-32 md:py-48">
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="relative overflow-hidden rounded-[32px] border border-[var(--pale-oak)]/15 p-10 md:p-20"
        style={{
          background:
            "radial-gradient(ellipse at 20% 20%, color-mix(in oklab, var(--burnt-rose) 60%, transparent) 0%, transparent 55%), radial-gradient(ellipse at 80% 80%, color-mix(in oklab, var(--bronze) 30%, transparent) 0%, transparent 55%), var(--surface)",
        }}
      >
        <p className="mb-6 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.3em] text-[var(--pale-oak)]/60">
          <span className="inline-block h-px w-10 bg-[var(--bronze)]" />
          Empezá hoy
        </p>
        <h2 className="max-w-4xl font-display text-[clamp(2.5rem,8vw,7rem)] font-light leading-[0.95] tracking-[-0.03em] text-[var(--pale-oak)]">
          El próximo activo <span className="italic text-[var(--bronze)]">ya está tokenizado.</span>
        </h2>
        <p className="mt-8 max-w-xl text-[var(--pale-oak)]/75">
          Sumate a la lista de inversores y accedé a la próxima emisión 48hs antes que el público general.
        </p>
        <div className="mt-12 flex flex-wrap gap-4">
          <MagneticButton href="#registro" className="btn-gold group" strength={0.3}>
            Crear cuenta
            <ArrowUpRight className="h-4 w-4 transition-transform duration-500 ease-out group-hover:rotate-45" />
          </MagneticButton>
          <MagneticButton
            href="#contacto-directo"
            className="inline-flex items-center gap-2 rounded-full border border-[var(--pale-oak)]/30 px-6 py-[0.95rem] text-sm text-[var(--pale-oak)] transition-colors duration-300 hover:border-[var(--bronze)] hover:text-[var(--bronze)]"
          >
            Hablar con un asesor
          </MagneticButton>
        </div>
      </motion.div>
    </section>
  );
}
