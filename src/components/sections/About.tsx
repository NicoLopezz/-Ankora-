"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

const values = [
  {
    key: "real",
    label: "Real",
    tagline: "Si no se puede ver, tocar o visitar, no entra.",
    body: "Cero activos sintéticos. Cero derivados. Cada token tiene atrás una hectárea, un metro cuadrado, una cosecha.",
  },
  {
    key: "anclado",
    label: "Anclado",
    tagline: "El yield viene del mundo físico.",
    body: "No staking, no farming. Viene de un viñedo en producción, una propiedad rentada, una infraestructura energética.",
  },
  {
    key: "regulado",
    label: "Regulado",
    tagline: "La regulación es parte del producto.",
    body: "Operamos bajo CNV RG 1069/1081/1087 porque la regulación es una promesa al inversor, no un obstáculo.",
  },
  {
    key: "accesible",
    label: "Accesible",
    tagline: "Tickets desde USD 500. Calidad premium.",
    body: "No competimos con plataformas que venden tokens de USD 5. Accesibilidad de entry, calidad de selección.",
  },
  {
    key: "global",
    label: "Global",
    tagline: "Un inversor en Miami, con la misma facilidad que uno en Buenos Aires.",
    body: "Pesos argentinos, dólares, transferencias internacionales desde el día uno. La fricción cambiaria histórica termina acá.",
  },
];

const EASE = [0.16, 1, 0.3, 1] as const;

export function About() {
  const [active, setActive] = useState<string>("real");
  const activeValue = values.find((v) => v.key === active) ?? values[0];

  return (
    <section
      id="nosotros"
      className="relative mx-auto w-full max-w-7xl scroll-mt-28 px-6 py-32 md:py-48"
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
        Sobre Ankora
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
            No tokenizamos{" "}
            <span className="italic text-[var(--pale-oak)]/50">pixels.</span>
            <br />
            Tokenizamos{" "}
            <span className="italic text-[var(--bronze)]">hectáreas.</span>
          </h2>

          <div className="mt-10 space-y-5 text-base leading-relaxed text-[var(--pale-oak)]/80 md:text-lg">
            <p>
              El patrimonio real estuvo reservado durante siglos para los que ya
              lo tenían. Comprar un campo, una finca, un viñedo: requería
              capital que la mayoría de las personas nunca iba a tener.
            </p>
            <p>
              Mientras, el dinero pierde valor en pesos. Y el mundo cripto, con
              toda su promesa, terminó siendo un casino donde los activos no
              existen fuera de una pantalla.
            </p>
            <p className="text-[var(--pale-oak)]">
              Hay un camino distinto. Traer el patrimonio real al mundo digital.
              Hacerlo divisible, comprable, vendible. Sin perder lo que lo hace
              real.
            </p>
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
                Propósito
              </p>
              <p className="mt-3 text-base leading-relaxed text-[var(--pale-oak)]/85">
                Hacer del patrimonio físico real algo accesible, líquido y
                transferible para cualquier persona — no solo para los que ya
                lo tienen.
              </p>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--bronze)]">
                Promesa
              </p>
              <p className="mt-3 font-display text-xl italic leading-tight text-[var(--pale-oak)] md:text-2xl">
                Comprá un pedazo de algo real. Cobrá renta. Vendé cuando
                quieras.
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
          Cinco principios no negociables
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
            No somos
          </p>
          <ul className="space-y-3 text-lg text-[var(--pale-oak)]/55 md:text-xl">
            <li className="line-through decoration-[var(--pale-oak)]/30 decoration-1">Un exchange de cripto</li>
            <li className="line-through decoration-[var(--pale-oak)]/30 decoration-1">Una billetera</li>
            <li className="line-through decoration-[var(--pale-oak)]/30 decoration-1">Un fondo común de inversión</li>
            <li className="line-through decoration-[var(--pale-oak)]/30 decoration-1">DeFi puro</li>
          </ul>
        </div>
        <div>
          <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--bronze)]">
            Somos
          </p>
          <ul className="space-y-3 text-lg text-[var(--pale-oak)] md:text-xl">
            <li>Un marketplace regulado de RWA</li>
            <li>Fideicomisos financieros con oferta pública</li>
            <li>Custodia de tokens bajo PSAV CNV</li>
            <li>Blockchain como infraestructura, no como ideología</li>
          </ul>
        </div>
      </motion.div>
    </section>
  );
}
