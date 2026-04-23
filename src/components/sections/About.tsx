"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTranslations } from "next-intl";

const valueKeys = ["real", "anclado", "regulado", "accesible", "global"] as const;
type ValueKey = (typeof valueKeys)[number];

const EASE = [0.16, 1, 0.3, 1] as const;

export function About() {
  const t = useTranslations("about");
  const [active, setActive] = useState<ValueKey>("real");
  const values = valueKeys.map((key) => ({
    key,
    label: t(`values.${key}.label`),
    tagline: t(`values.${key}.tagline`),
    body: t(`values.${key}.body`),
  }));
  const activeValue = values.find((v) => v.key === active) ?? values[0];
  const narrative = t.raw("narrative") as string[];
  const noSomos = t.raw("noSomos") as string[];
  const somos = t.raw("somos") as string[];

  return (
    <section
      id="nosotros"
      className="relative mx-auto w-full max-w-7xl scroll-mt-28 px-6 py-20 md:py-48"
    >
      {/* Kicker */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-15% 0px" }}
        transition={{ duration: 0.8, ease: EASE }}
        className="mb-12 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.3em] text-[var(--pale-oak)]/60 md:mb-16"
      >
        <span className="inline-block h-px w-10 bg-[var(--bronze)]" />
        {t("kicker")}
      </motion.p>

      {/* Editorial split: statement + narrativa */}
      <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ duration: 1, ease: EASE, delay: 0.1 }}
          className="md:col-span-7"
        >
          <h2
            className="font-display text-[clamp(2.25rem,5.5vw,5rem)] font-light leading-[1] tracking-[-0.025em] text-[var(--pale-oak)]"
            style={{ textShadow: "0 2px 24px rgba(0,0,0,0.45), 0 1px 2px rgba(0,0,0,0.35)" }}
          >
            {t("titleLine1Pre")}{" "}
            <span className="italic text-[var(--pale-oak)]/50">{t("titleLine1Em")}</span>
            <br />
            {t("titleLine2Pre")}{" "}
            <span className="italic text-[var(--bronze)]">{t("titleLine2Em")}</span>
          </h2>

          <div className="mt-10 space-y-5 text-base leading-relaxed text-[var(--pale-oak)]/80 md:text-lg">
            {narrative.map((p, i) => (
              <p key={i} className={i === narrative.length - 1 ? "text-[var(--pale-oak)]" : undefined}>
                {p}
              </p>
            ))}
          </div>
        </motion.div>

        <motion.aside
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ duration: 1, ease: EASE, delay: 0.25 }}
          className="md:col-span-5 md:pt-12"
        >
          <div className="flex flex-col gap-8 border-l border-[var(--bronze)]/30 pl-8">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--bronze)]">
                {t("purposeKicker")}
              </p>
              <p className="mt-3 text-base leading-relaxed text-[var(--pale-oak)]/85">
                {t("purposeBody")}
              </p>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--bronze)]">
                {t("promiseKicker")}
              </p>
              <p className="mt-3 font-display text-xl italic leading-tight text-[var(--pale-oak)] md:text-2xl">
                {t("promiseBody")}
              </p>
            </div>
          </div>
        </motion.aside>
      </div>

      {/* Strip de valores */}
      <div className="mt-32 md:mt-48">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.8, ease: EASE }}
          className="mb-10 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.3em] text-[var(--pale-oak)]/60"
        >
          <span className="inline-block h-px w-10 bg-[var(--bronze)]" />
          {t("principlesKicker")}
        </motion.p>

        {/* Row de labels grandes */}
        <div className="flex flex-col border-t border-[var(--pale-oak)]/10">
          {values.map((v, i) => {
            const isActive = v.key === active;
            return (
              <motion.button
                key={v.key}
                type="button"
                onMouseEnter={() => setActive(v.key)}
                onFocus={() => setActive(v.key)}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10% 0px" }}
                transition={{ duration: 0.7, ease: EASE, delay: i * 0.06 }}
                className="group grid grid-cols-12 items-center gap-6 border-b border-[var(--pale-oak)]/10 py-6 text-left transition-colors duration-500 md:min-h-[8.5rem] md:py-8"
                data-cursor="hover"
              >
                <span className="col-span-2 self-center font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--pale-oak)]/45 md:col-span-1">
                  0{i + 1}
                </span>
                <span
                  className={`col-span-10 self-center font-display text-[clamp(1.75rem,4.5vw,3.5rem)] font-light leading-[1] tracking-[-0.02em] transition-colors duration-500 md:col-span-5 ${
                    isActive ? "text-[var(--bronze)]" : "text-[var(--pale-oak)]/60 group-hover:text-[var(--pale-oak)]"
                  }`}
                >
                  {v.label}
                </span>
                {/* Detalle siempre renderizado — opacidad toggleada. Mantiene la altura
                    fija y evita el layout shift al hovear entre rows. */}
                <motion.span
                  animate={{ opacity: isActive ? 1 : 0, x: isActive ? 0 : -16 }}
                  transition={{ duration: 0.45, ease: EASE }}
                  className="hidden self-center leading-relaxed md:col-span-6 md:block"
                  aria-hidden={!isActive}
                >
                  <span className="block text-base text-[var(--pale-oak)]">
                    {v.tagline}
                  </span>
                  <span className="mt-1 block text-sm text-[var(--pale-oak)]/55">
                    {v.body}
                  </span>
                </motion.span>
              </motion.button>
            );
          })}
        </div>

        {/* Mobile — detalle del activo abajo */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeValue.key}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="mt-8 md:hidden"
          >
            <p className="text-base text-[var(--pale-oak)]">
              {activeValue.tagline}
            </p>
            <p className="mt-2 text-sm text-[var(--pale-oak)]/60">
              {activeValue.body}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Positioning: no es / es */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={{ duration: 1, ease: EASE }}
        className="mx-auto mt-32 grid max-w-5xl grid-cols-1 gap-8 md:mt-48 md:grid-cols-2 md:gap-10"
      >
        <div>
          <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--pale-oak)]/45">
            {t("noSomosKicker")}
          </p>
          <ul className="space-y-3 text-lg text-[var(--pale-oak)]/55 md:text-xl">
            {noSomos.map((item) => (
              <li key={item} className="line-through decoration-[var(--pale-oak)]/30 decoration-1">{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--bronze)]">
            {t("somosKicker")}
          </p>
          <ul className="space-y-3 text-lg text-[var(--pale-oak)] md:text-xl">
            {somos.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </motion.div>
    </section>
  );
}
