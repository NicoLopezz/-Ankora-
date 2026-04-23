"use client";

import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { Counter } from "@/components/ui/Counter";

type StatItem = { key: string; value: number; format?: (n: number) => string };

const stats: StatItem[] = [
  { key: "ticket", value: 500 },
  { key: "projects", value: 4 },
  { key: "hectares", value: 500 },
  { key: "raise", value: 2820000, format: (n: number) => (n / 1_000_000).toFixed(2) },
];

export function Stats() {
  const t = useTranslations("stats");
  return (
    <section className="relative border-y border-[var(--pale-oak)]/10 bg-[var(--surface)]/40">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-2 gap-0 px-6 py-16 md:grid-cols-4 md:py-20">
        {stats.map((s, i) => (
          <motion.div
            key={s.key}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20% 0px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: i * 0.08 }}
            className="flex flex-col gap-2 border-[var(--pale-oak)]/10 px-2 py-6 md:border-l md:px-8 md:first:border-l-0"
          >
            <Counter
              to={s.value}
              format={s.format}
              className="font-display text-[clamp(2rem,4.5vw,3.75rem)] leading-none tracking-tight text-[var(--pale-oak)]"
            />
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--pale-oak)]/55">
              {t(`items.${s.key}`)}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
