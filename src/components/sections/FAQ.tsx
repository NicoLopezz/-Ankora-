"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus } from "lucide-react";

type Category = "Liquidez" | "Riesgo" | "Legal" | "Tech" | "Fees";

type QA = {
  id: string;
  category: Category;
  question: string;
  answer: string;
};

const faqs: QA[] = [
  {
    id: "salida",
    category: "Liquidez",
    question: "¿Cómo salgo de una inversión antes del vencimiento?",
    answer:
      "Cuando el mercado secundario esté habilitado, vas a poder listar tus tokens para la venta dentro de la plataforma. Hasta ese momento, la salida natural es el vencimiento del fideicomiso de cada proyecto (cronograma publicado en la ficha). La activación del secundario depende de hitos regulatorios y del contrato final con el stack tecnológico.",
  },
  {
    id: "sponsor-quiebra",
    category: "Riesgo",
    question: "¿Qué pasa si quiebra el sponsor del proyecto?",
    answer:
      "El activo subyacente (tierra, inmueble, ganado) está en un fideicomiso financiero administrado por Allaria S.A. — un patrimonio separado del sponsor. Si el sponsor quiebra, el fideicomiso no cae con él: el activo sigue a nombre del fideicomiso y se liquida según el contrato, devolviendo a los tokenholders su participación proporcional. Es la misma lógica que protege a los inversores institucionales de los fondos globales.",
  },
  {
    id: "fees",
    category: "Fees",
    question: "¿Cuáles son los fees?",
    answer:
      "Cada proyecto publica sus fees upfront en la ficha: fee de emisión (one-time), fee de administración del fideicomiso (anual, típicamente 1-2%), y fee de mercado secundario cuando se habilite. Nada oculto. Brand-dna de Ankora: transparencia total de fees en cada listing.",
  },
  {
    id: "jurisdiccion",
    category: "Legal",
    question: "¿Desde qué jurisdicción puedo invertir?",
    answer:
      "El onboarding incluye chequeo de jurisdicción y perfil de inversor. Hoy operamos con inversores argentinos y LATAM; el plan incluye cross-border para USA y Europa. La ficha de cada proyecto indica las jurisdicciones habilitadas para esa emisión puntual.",
  },
  {
    id: "fideicomiso",
    category: "Legal",
    question: "¿Qué es un fideicomiso financiero y por qué importa?",
    answer:
      "Es el vehículo legal (Ley 24.441 + CCCN 1666-1676) que separa el patrimonio del activo del patrimonio del sponsor. Tiene oferta pública registrada en CNV bajo el régimen RG 1069/2025. Cada token que comprás representa una participación proporcional en ese fideicomiso. Es la misma arquitectura legal que usan los fondos institucionales globales.",
  },
  {
    id: "polygon",
    category: "Tech",
    question: "¿Por qué Polygon y qué es ERC-7943?",
    answer:
      "Usamos el stack de Brickken, que emite los tokens en Polygon (L2 de Ethereum, fees bajos, settlement rápido) con el estándar ERC-7943 — diseñado específicamente para RWA con hooks de compliance (KYC, restricciones de transferencia, whitelists) compatibles con fideicomisos financieros regulados.",
  },
  {
    id: "clima",
    category: "Riesgo",
    question: "¿Qué pasa si el clima arruina una cosecha o hay un problema operativo?",
    answer:
      "Cada proyecto publica sus riesgos específicos y las coberturas correspondientes (seguros climáticos, contratos forward, coberturas de construcción). Los rendimientos proyectados son estimaciones, no garantías. Toda inversión en activos reales implica riesgo de pérdida parcial o total del capital — lo decimos sin minimizarlo.",
  },
  {
    id: "transfer",
    category: "Tech",
    question: "¿Mi token se puede transferir a otra wallet?",
    answer:
      "Sí, pero solo a wallets verificadas con el mismo perfil de compliance (KYC aprobado, jurisdicción habilitada). Es una restricción del estándar ERC-7943 para cumplir con el régimen CNV. No es una wallet cripto pública abierta; es una infraestructura regulada.",
  },
];

const EASE = [0.16, 1, 0.3, 1] as const;

const CATEGORY_STYLES: Record<Category, string> = {
  Liquidez: "text-[var(--bronze)]",
  Riesgo: "text-[#c4392a]",
  Legal: "text-[var(--pale-oak)]",
  Tech: "text-[var(--bronze)]",
  Fees: "text-[var(--pale-oak)]",
};

export function FAQ() {
  const [openId, setOpenId] = useState<string | null>(null);

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
              Preguntas frecuentes
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-15% 0px" }}
              transition={{ duration: 1, ease: EASE, delay: 0.1 }}
              className="font-display text-[clamp(2rem,4.5vw,3.75rem)] font-light leading-[1] tracking-[-0.02em] text-[var(--pale-oak)]"
              style={{ textShadow: "0 2px 24px rgba(0,0,0,0.45), 0 1px 2px rgba(0,0,0,0.35)" }}
            >
              Todo lo que{" "}
              <span className="italic text-[var(--bronze)]">tenés</span> que saber
              antes.
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-15% 0px" }}
            transition={{ duration: 1, ease: EASE, delay: 0.3 }}
            className="max-w-sm text-sm leading-relaxed text-[var(--pale-oak)]/60"
          >
            No promesas vacías: explicamos cómo funciona la liquidez, qué pasa
            si algo sale mal, y bajo qué marco legal operamos.
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
                    {f.category}
                  </span>
                  <div className="flex-1">
                    <span className={`mb-2 block font-mono text-[10px] uppercase tracking-[0.3em] md:hidden ${CATEGORY_STYLES[f.category]}`}>
                      {f.category}
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
