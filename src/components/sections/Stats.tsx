"use client";

import { motion } from "motion/react";
import { Counter } from "@/components/ui/Counter";

const stats = [
  { label: "Capital tokenizado", value: 12800000, prefix: "USD ", format: (n: number) => (n / 1_000_000).toFixed(1) + "M" },
  { label: "Inversores activos", value: 4200, suffix: "+" },
  { label: "Proyectos financiados", value: 27 },
  { label: "TIR promedio", value: 13.4, suffix: "%", format: (n: number) => n.toFixed(1) },
];

export function Stats() {
  return (
    <section className="relative border-y border-[var(--pale-oak)]/10 bg-[var(--surface)]/40">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-2 gap-0 px-6 py-16 md:grid-cols-4 md:py-20">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20% 0px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: i * 0.08 }}
            className="flex flex-col gap-2 border-[var(--pale-oak)]/10 px-2 py-6 md:border-l md:px-8 md:first:border-l-0"
          >
            <Counter
              to={s.value}
              prefix={s.prefix}
              suffix={s.suffix}
              format={s.format}
              className="font-display text-[clamp(2rem,4.5vw,3.75rem)] leading-none tracking-tight text-[var(--pale-oak)]"
            />
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--pale-oak)]/55">
              {s.label}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
