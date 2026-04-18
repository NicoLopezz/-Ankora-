"use client";

import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";

const projects = [
  {
    slug: "costa-norte",
    tag: "Inmobiliario",
    name: "Costa Norte Residences",
    location: "Punta del Este, UY",
    tir: "12,4%",
    min: "USD 250",
    status: "En emisión",
    gradient:
      "radial-gradient(ellipse at 30% 30%, #bc8034 0%, #5e0b15 45%, #2a050a 100%)",
  },
  {
    slug: "agro-pampa",
    tag: "Agro",
    name: "Pampa Fértil — Soja 25/26",
    location: "Buenos Aires, AR",
    tir: "18,7%",
    min: "USD 100",
    status: "Abierto",
    gradient:
      "radial-gradient(ellipse at 70% 40%, #d9cab3 0%, #90323d 45%, #3d070e 100%)",
  },
  {
    slug: "solar-atacama",
    tag: "Infraestructura",
    name: "Solar Atacama 120MW",
    location: "Antofagasta, CL",
    tir: "9,8%",
    min: "USD 500",
    status: "Próximamente",
    gradient:
      "radial-gradient(ellipse at 50% 70%, #bc8034 0%, #8c7a6b 40%, #5e0b15 100%)",
  },
  {
    slug: "viñedo-mendoza",
    tag: "Agro · Vitivinícola",
    name: "Viñedo Valle de Uco",
    location: "Mendoza, AR",
    tir: "14,2%",
    min: "USD 300",
    status: "En emisión",
    gradient:
      "radial-gradient(ellipse at 40% 60%, #90323d 0%, #bc8034 40%, #2a050a 100%)",
  },
];

export function Projects() {
  return (
    <section id="proyectos" className="relative mx-auto w-full max-w-7xl px-6 py-32 md:py-48">
      <div className="mb-20 flex flex-col items-start gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-6 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.3em] text-[var(--pale-oak)]/60">
            <span className="inline-block h-px w-10 bg-[var(--bronze)]" />
            Oportunidades activas
          </p>
          <h2 className="font-display text-[clamp(2.5rem,6vw,5.5rem)] font-light leading-[0.95] tracking-[-0.02em] text-[var(--pale-oak)]">
            Activos <span className="italic text-[var(--bronze)]">tangibles,</span>
            <br />
            rendimientos medibles.
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {projects.map((p, i) => (
          <motion.a
            key={p.slug}
            href={`#proyecto-${p.slug}`}
            data-cursor="hover"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15% 0px" }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: i * 0.08 }}
            className="group relative flex flex-col overflow-hidden rounded-[28px] border border-[var(--pale-oak)]/10 bg-[var(--surface)]"
          >
            <div className="hover-zoom relative aspect-[16/10] w-full overflow-hidden">
              <div
                className="h-full w-full"
                style={{ background: p.gradient }}
              />
              <div className="absolute left-5 top-5 flex items-center gap-2">
                <span className="rounded-full border border-[var(--pale-oak)]/20 bg-black/20 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--pale-oak)] backdrop-blur-md">
                  {p.tag}
                </span>
                {p.status === "En emisión" && (
                  <span className="flex items-center gap-1.5 rounded-full bg-[var(--bronze)]/90 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--night-bordeaux)]">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--night-bordeaux)]" />
                    Live
                  </span>
                )}
              </div>
              <div className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full border border-[var(--pale-oak)]/20 bg-black/30 text-[var(--pale-oak)] backdrop-blur-md transition-all duration-500 group-hover:rotate-45 group-hover:bg-[var(--bronze)] group-hover:text-[var(--night-bordeaux)]">
                <ArrowUpRight className="h-5 w-5" />
              </div>
            </div>

            <div className="flex flex-col gap-5 p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-display text-3xl leading-tight tracking-tight text-[var(--pale-oak)]">
                    {p.name}
                  </h3>
                  <p className="mt-1 text-sm text-[var(--pale-oak)]/60">{p.location}</p>
                </div>
                <span className="whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--pale-oak)]/60">
                  {p.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-[var(--pale-oak)]/10 pt-5">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--pale-oak)]/50">TIR estimada</p>
                  <p className="mt-1 font-display text-2xl text-[var(--bronze)]">{p.tir}</p>
                </div>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--pale-oak)]/50">Ticket mínimo</p>
                  <p className="mt-1 font-display text-2xl text-[var(--pale-oak)]">{p.min}</p>
                </div>
              </div>
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
}
