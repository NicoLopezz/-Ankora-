"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";

type Category = "Liquidez" | "Riesgo" | "Legal" | "Tech" | "Fees";

const faqIds = [
  "salida",
  "sponsor-quiebra",
  "fees",
  "jurisdiccion",
  "fideicomiso",
  "polygon",
  "clima",
  "transfer",
] as const;

const EASE = [0.16, 1, 0.3, 1] as const;

const CATEGORY_STYLES: Record<Category, string> = {
  Liquidez: "text-[var(--bronze)]",
  Riesgo: "text-[#c4392a]",
  Legal: "text-[var(--pale-oak)]",
  Tech: "text-[var(--bronze)]",
  Fees: "text-[var(--pale-oak)]",
};

export function FAQ() {
  const t = useTranslations("faq");
  const [openId, setOpenId] = useState<string | null>(null);
  const faqs = faqIds.map((id) => ({
    id,
    category: t(`items.${id}.category`) as Category,
    question: t(`items.${id}.question`),
    answer: t(`items.${id}.answer`),
  }));

  return (
    <section
      id="faq"
      className="relative w-full scroll-mt-28 py-16 md:py-32"
    >
      {/* Glow de fondo sutil */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, color-mix(in oklab, var(--burnt-rose) 30%, transparent) 0%, transparent 55%)",
        }}
      />

      <div className="mx-auto w-full max-w-7xl px-6">
        <div className="mb-12 flex flex-col gap-6 md:mb-16 md:flex-row md:items-end md:justify-between">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-15% 0px" }}
              transition={{ duration: 0.8, ease: EASE }}
              className="mb-6 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.3em] text-[var(--pale-oak)]/60"
            >
              <span className="inline-block h-px w-10 bg-[var(--bronze)]" />
              {t("kicker")}
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-15% 0px" }}
              transition={{ duration: 1, ease: EASE, delay: 0.1 }}
              className="font-display text-[clamp(2rem,4.5vw,3.75rem)] font-light leading-[1] tracking-[-0.02em] text-[var(--pale-oak)]"
              style={{ textShadow: "0 2px 24px rgba(0,0,0,0.45), 0 1px 2px rgba(0,0,0,0.35)" }}
            >
              {t("titlePre")}{" "}
              <span className="italic text-[var(--bronze)]">{t("titleEm")}</span>{" "}
              {t("titlePost")}
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-15% 0px" }}
            transition={{ duration: 1, ease: EASE, delay: 0.3 }}
            className="max-w-sm text-sm leading-relaxed text-[var(--pale-oak)]/60"
          >
            {t("lead")}
          </motion.p>
        </div>

        {/* Accordion */}
        <div className="border-t border-[var(--pale-oak)]/15">
          {faqs.map((f, i) => {
            const isOpen = openId === f.id;
            return (
              <motion.div
                key={f.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-5% 0px" }}
                transition={{ duration: 0.7, ease: EASE, delay: i * 0.04 }}
                className="border-b border-[var(--pale-oak)]/15"
              >
                <button
                  type="button"
                  onClick={() => setOpenId(isOpen ? null : f.id)}
                  aria-expanded={isOpen}
                  data-cursor="hover"
                  className="flex w-full items-start gap-6 py-5 text-left md:gap-8 md:py-6"
                >
                  <span
                    className={`hidden shrink-0 pt-1.5 font-mono text-[10px] uppercase tracking-[0.3em] md:block md:w-[100px] ${CATEGORY_STYLES[f.category]}`}
                  >
                    {t(`categories.${f.category}`)}
                  </span>
                  <div className="flex-1">
                    <span className={`mb-2 block font-mono text-[10px] uppercase tracking-[0.3em] md:hidden ${CATEGORY_STYLES[f.category]}`}>
                      {t(`categories.${f.category}`)}
                    </span>
                    <h3
                      className={`font-display text-[clamp(1.125rem,1.8vw,1.5rem)] font-light leading-[1.25] tracking-[-0.005em] transition-colors duration-500 ${
                        isOpen ? "text-[var(--pale-oak)]" : "text-[var(--pale-oak)]/70"
                      }`}
                    >
                      {f.question}
                    </h3>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          key="answer"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.5, ease: EASE }}
                          className="overflow-hidden"
                        >
                          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-[var(--pale-oak)]/70 md:text-base">
                            {f.answer}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <motion.span
                    aria-hidden
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.4, ease: EASE }}
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-colors duration-500 md:h-9 md:w-9 ${
                      isOpen
                        ? "border-[var(--bronze)] bg-[var(--bronze)] text-[var(--night-bordeaux)]"
                        : "border-[var(--pale-oak)]/30 text-[var(--pale-oak)]/70"
                    }`}
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </motion.span>
                </button>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
