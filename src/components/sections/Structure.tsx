"use client";

import { motion } from "motion/react";

type Pillar = {
  role: string;
  name: string;
  detail: string;
};

const pillars: Pillar[] = [
  {
    role: "Operador · PSAV",
    name: "AMG Capital Group S.A.",
    detail: "Inscripto en CNV como Proveedor de Servicios de Activos Virtuales — DI-2024-50276668. Opera el marketplace y custodia los tokens.",
  },
  {
    role: "Fiduciario · Colocador",
    name: "Allaria S.A.",
    detail: "ALyC top-tier. Administra los fideicomisos financieros que son el vehículo legal de cada emisión y coloca los tokens.",
  },
  {
    role: "Stack tecnológico",
    name: "Brickken",
    detail: "White-label de tokenización. Smart contracts estándar ERC-7943, desplegados en Polygon.",
  },
  {
    role: "Marco regulatorio",
    name: "CNV RG 1069/2025",
    detail: "Régimen de tokenización de activos reales en Argentina (con RG 1081 y 1087 modificatorias). Sandbox sancionado.",
  },
];

const EASE = [0.16, 1, 0.3, 1] as const;

export function Structure() {
  return (
    <section
      id="estructura"
      className="relative mx-auto w-full max-w-7xl scroll-mt-28 px-6 py-32 md:py-48"
    >
      <div className="mb-14 flex flex-col gap-6 md:mb-20 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-6 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.3em] text-[var(--pale-oak)]/60">
            <span className="inline-block h-px w-10 bg-[var(--bronze)]" />
            Cómo está estructurado
          </p>
          <h2
            className="font-display text-[clamp(2.5rem,6vw,5.5rem)] font-light leading-[0.95] tracking-[-0.02em] text-[var(--pale-oak)]"
            style={{ textShadow: "0 2px 24px rgba(0,0,0,0.45), 0 1px 2px rgba(0,0,0,0.35)" }}
          >
            Regulado. <span className="italic text-[var(--bronze)]">Custodiado.</span> Auditable.
          </h2>
        </div>
        <p className="max-w-md text-sm leading-relaxed text-[var(--pale-oak)]/65">
          Cada activo del marketplace se emite como fideicomiso financiero con
          oferta pública bajo supervisión de la CNV. Roles separados — operador,
          fiduciario, tecnología, legal — cada uno con responsabilidad propia.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-0 md:grid-cols-2 lg:grid-cols-4">
        {pillars.map((p, i) => (
          <motion.div
            key={p.role}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15% 0px" }}
            transition={{ duration: 0.9, ease: EASE, delay: i * 0.08 }}
            className="flex flex-col gap-4 border-t border-[var(--pale-oak)]/10 py-10 md:border-l md:border-t-0 md:px-8 md:py-4 md:first:border-l-0 lg:first:border-l-0 lg:[&:nth-child(3)]:border-l-0 md:[&:nth-child(3)]:border-l lg:[&:nth-child(3)]:border-l"
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--bronze)]">
              {p.role}
            </p>
            <p className="font-display text-[clamp(1.5rem,2.2vw,2rem)] font-light leading-[1.05] tracking-[-0.01em] text-[var(--pale-oak)]">
              {p.name}
            </p>
            <p className="text-sm leading-relaxed text-[var(--pale-oak)]/65">
              {p.detail}
            </p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={{ duration: 0.8, ease: EASE, delay: 0.4 }}
        className="mt-16 flex flex-col gap-4 border-t border-[var(--pale-oak)]/10 pt-10 md:mt-20 md:flex-row md:items-start md:gap-12"
      >
        <div className="flex-1">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--pale-oak)]/55">
            Asesoría legal
          </p>
          <p className="mt-2 font-display text-lg text-[var(--pale-oak)]">
            Estudio MB Partners
          </p>
          <p className="mt-1 text-sm text-[var(--pale-oak)]/55">
            Estructuración, compliance, representación ante CNV.
          </p>
        </div>
        <div className="flex-1">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--pale-oak)]/55">
            Procesamiento fiat
          </p>
          <p className="mt-2 font-display text-lg text-[var(--pale-oak)]">
            Mecaenpol S.R.L.
          </p>
          <p className="mt-1 text-sm text-[var(--pale-oak)]/55">
            PSPCP inscripto en BCRA. On-ramp en pesos argentinos.
          </p>
        </div>
        <div className="flex-1">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--pale-oak)]/55">
            Holding
          </p>
          <p className="mt-2 font-display text-lg text-[var(--pale-oak)]">
            Grupo Blex
          </p>
          <p className="mt-1 text-sm text-[var(--pale-oak)]/55">
            AMG Capital Group y Mecaenpol son parte del grupo.
          </p>
        </div>
      </motion.div>

      <p className="mt-12 max-w-3xl text-xs leading-relaxed text-[var(--pale-oak)]/45">
        Toda inversión en activos reales implica riesgo de pérdida parcial o
        total del capital invertido. Los rendimientos proyectados son
        estimaciones basadas en comparables del mercado y no constituyen
        garantía de rendimiento futuro. Ankora está en fase demo — la operatoria
        transaccional se habilita con la activación regulatoria final del stack.
      </p>
    </section>
  );
}
