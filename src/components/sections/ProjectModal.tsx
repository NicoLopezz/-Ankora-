"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X, ArrowUpRight, MapPin, Calendar, ShieldCheck, Layers, ChevronLeft, ChevronRight } from "lucide-react";

export type ProjectDetail = {
  slug: string;
  tag: string;
  name: string;
  location: string;
  tir: string;
  min: string;
  status: string;
  mediaSrc: string;
  mediaType: "image" | "video";
  mediaAlt?: string;
  description: string;
  bullets: string[];
  timeline: string;
  emitter: string;
  totalRaise: string;
  soldPct: number;
  gallery?: { src: string; alt: string; caption?: string }[];
};

type Props = {
  project: ProjectDetail;
  onClose: () => void;
};

const EASE = [0.16, 1, 0.3, 1] as const;

export function ProjectModal({ project, onClose }: Props) {
  // ESC + lock scroll
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <motion.div
      key="modal"
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8"
      initial="hidden"
      animate="show"
      exit="hidden"
    >
      {/* Backdrop */}
      <motion.button
        aria-label="Cerrar"
        onClick={onClose}
        variants={{
          hidden: { opacity: 0, backdropFilter: "blur(0px)" },
          show: { opacity: 1, backdropFilter: "blur(18px)" },
        }}
        transition={{ duration: 0.5, ease: EASE }}
        className="absolute inset-0 bg-black/55 cursor-zoom-out"
        style={{ WebkitBackdropFilter: "blur(18px)" }}
      />

      {/* Modal shell */}
      <motion.div
        role="dialog"
        aria-modal
        aria-label={project.name}
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.97 }}
        transition={{ duration: 0.45, ease: EASE }}
        className="relative z-[1] flex w-full max-w-[1200px] max-h-[92vh] overflow-hidden rounded-[28px] border border-[var(--pale-oak)]/15 bg-[var(--surface)] shadow-[0_40px_120px_-40px_rgba(0,0,0,0.8)]"
      >
        {/* Close */}
        <button
          onClick={onClose}
          data-cursor="hover"
          aria-label="Cerrar"
          className="absolute right-5 top-5 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-[var(--pale-oak)]/25 bg-black/40 text-[var(--pale-oak)] backdrop-blur-md transition-colors duration-300 hover:border-[var(--bronze)] hover:bg-[var(--bronze)] hover:text-[var(--night-bordeaux)]"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Scroll container */}
        <div className="flex w-full flex-col overflow-y-auto" data-lenis-prevent>
          {/* Hero estático */}
          <div className="relative aspect-[16/9] w-full shrink-0 overflow-hidden md:aspect-[21/9]">
            {project.mediaType === "video" ? (
              <video
                src={project.mediaSrc}
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <Image
                src={project.mediaSrc}
                alt={project.mediaAlt ?? project.name}
                fill
                sizes="100vw"
                className="object-cover"
                priority
              />
            )}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, transparent 40%, color-mix(in oklab, var(--night-bordeaux) 92%, transparent) 100%)",
              }}
            />

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.2 }}
              className="absolute bottom-6 left-6 right-6 z-10 md:bottom-10 md:left-10"
            >
              <div className="mb-4 flex items-center gap-2">
                <span className="rounded-full border border-[var(--pale-oak)]/30 bg-black/40 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--pale-oak)] backdrop-blur-md">
                  {project.tag}
                </span>
                <span className="rounded-full bg-[var(--bronze)]/95 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--night-bordeaux)]">
                  {project.status}
                </span>
              </div>
              <h2 className="font-display text-[clamp(2.5rem,5.5vw,4.75rem)] font-light leading-[0.95] tracking-[-0.02em] text-[var(--pale-oak)]">
                {project.name}
              </h2>
              <p className="mt-2 flex items-center gap-2 text-sm text-[var(--pale-oak)]/80">
                <MapPin className="h-3.5 w-3.5" /> {project.location}
              </p>
            </motion.div>
          </div>

          {/* Contenido */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.3 }}
            className="grid grid-cols-1 gap-10 p-6 md:grid-cols-5 md:gap-14 md:p-10"
          >
            <div className="md:col-span-3">
              <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--pale-oak)]/55">
                Sobre el proyecto
              </p>
              <p className="text-lg leading-relaxed text-[var(--pale-oak)]/85">
                {project.description}
              </p>

              <ul className="mt-8 space-y-3">
                {project.bullets.map((b, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, ease: EASE, delay: 0.4 + i * 0.05 }}
                    className="flex items-start gap-3 text-[var(--pale-oak)]/80"
                  >
                    <span className="mt-2 h-[3px] w-4 shrink-0 bg-[var(--bronze)]" />
                    {b}
                  </motion.li>
                ))}
              </ul>

              {project.gallery && project.gallery.length > 0 && (
                <div className="mt-12">
                  <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--pale-oak)]/55">
                    Galería
                  </p>
                  <GalleryStrip gallery={project.gallery} />
                </div>
              )}
            </div>

            <aside className="md:col-span-2">
              <div className="glass-card flex flex-col gap-5 p-6">
                <Stat label="TIR estimada" value={project.tir} accent />
                <Stat label="Ticket mínimo" value={project.min} />
                <div className="h-px bg-[var(--pale-oak)]/15" />
                <Stat label="Emisor" value={project.emitter} icon={<ShieldCheck className="h-3.5 w-3.5" />} />
                <Stat label="Cronograma" value={project.timeline} icon={<Calendar className="h-3.5 w-3.5" />} />
                <Stat label="Monto objetivo" value={project.totalRaise} icon={<Layers className="h-3.5 w-3.5" />} />

                <div>
                  <div className="mb-2 flex justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--pale-oak)]/60">
                    <span>Colocado</span>
                    <span>{project.soldPct}%</span>
                  </div>
                  <div className="relative h-1 overflow-hidden rounded-full bg-[var(--pale-oak)]/10">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${project.soldPct}%` }}
                      transition={{ duration: 1.2, ease: EASE, delay: 0.5 }}
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-[var(--burnt-rose)] via-[var(--bronze)] to-[var(--pale-oak)]"
                    />
                  </div>
                </div>

                <a
                  href={`#invertir-${project.slug}`}
                  data-cursor="hover"
                  className="btn-gold group/btn mt-2 text-sm"
                >
                  Invertir ahora
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-500 ease-out group-hover/btn:rotate-45" />
                </a>
              </div>
            </aside>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function GalleryStrip({ gallery }: { gallery: NonNullable<ProjectDetail["gallery"]> }) {
  const [lightbox, setLightbox] = useState<number | null>(null);

  // ESC cierra sólo el lightbox (frena al parent) + flechas para navegar
  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopImmediatePropagation();
        setLightbox(null);
        return;
      }
      if (e.key === "ArrowRight") setLightbox((i) => (i === null ? 0 : (i + 1) % gallery.length));
      if (e.key === "ArrowLeft") setLightbox((i) => (i === null ? 0 : (i - 1 + gallery.length) % gallery.length));
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [lightbox, gallery.length]);

  const current = lightbox !== null ? gallery[lightbox] : null;

  return (
    <>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {gallery.map((g, i) => (
          <motion.figure
            key={g.src}
            layoutId={`gallery-${g.src}`}
            onClick={() => setLightbox(i)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setLightbox(i);
              }
            }}
            tabIndex={0}
            role="button"
            aria-label={`Ampliar ${g.alt}`}
            data-cursor="hover"
            className="group relative cursor-zoom-in overflow-hidden rounded-2xl border border-[var(--pale-oak)]/10 bg-black/20 outline-none focus-visible:ring-2 focus-visible:ring-[var(--bronze)]"
          >
            <div className="relative aspect-[4/3] w-full">
              <Image
                src={g.src}
                alt={g.alt}
                fill
                sizes="(max-width: 640px) 100vw, 33vw"
                className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.05]"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, transparent 55%, color-mix(in oklab, var(--night-bordeaux) 85%, transparent) 100%)",
                }}
              />
            </div>
            {g.caption && (
              <figcaption className="absolute bottom-3 left-3 right-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--pale-oak)]/90">
                {g.caption}
              </figcaption>
            )}
          </motion.figure>
        ))}
      </div>

      <AnimatePresence>
        {current && lightbox !== null && (
          <motion.div
            key="lightbox"
            className="fixed inset-0 z-[210] flex items-center justify-center p-4 md:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
          >
            <motion.button
              aria-label="Cerrar vista ampliada"
              onClick={() => setLightbox(null)}
              data-cursor="hover"
              className="absolute inset-0 cursor-zoom-out bg-black/80 backdrop-blur-xl"
              style={{ WebkitBackdropFilter: "blur(24px)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: EASE }}
            />

            <motion.figure
              layoutId={`gallery-${current.src}`}
              className="relative z-[1] flex max-h-full w-full max-w-[1100px] flex-col overflow-hidden rounded-[20px] border border-[var(--pale-oak)]/15 bg-black/40 shadow-[0_40px_120px_-40px_rgba(0,0,0,0.9)]"
            >
              <div className="relative aspect-[16/10] w-full">
                <Image
                  src={current.src}
                  alt={current.alt}
                  fill
                  sizes="90vw"
                  className="object-cover"
                  priority
                />
              </div>
              {current.caption && (
                <figcaption className="flex items-center justify-between gap-4 px-5 py-4 font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--pale-oak)]/85">
                  <span>{current.caption}</span>
                  <span className="text-[var(--pale-oak)]/50">
                    {lightbox + 1} / {gallery.length}
                  </span>
                </figcaption>
              )}
            </motion.figure>

            {/* Controles */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setLightbox((i) => (i === null ? 0 : (i - 1 + gallery.length) % gallery.length));
              }}
              data-cursor="hover"
              aria-label="Imagen anterior"
              className="absolute left-3 top-1/2 z-[2] flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--pale-oak)]/25 bg-black/50 text-[var(--pale-oak)] backdrop-blur-md transition-colors hover:border-[var(--bronze)] hover:text-[var(--bronze)] md:left-6"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setLightbox((i) => (i === null ? 0 : (i + 1) % gallery.length));
              }}
              data-cursor="hover"
              aria-label="Imagen siguiente"
              className="absolute right-3 top-1/2 z-[2] flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--pale-oak)]/25 bg-black/50 text-[var(--pale-oak)] backdrop-blur-md transition-colors hover:border-[var(--bronze)] hover:text-[var(--bronze)] md:right-6"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setLightbox(null);
              }}
              data-cursor="hover"
              aria-label="Cerrar"
              className="absolute right-3 top-3 z-[2] flex h-10 w-10 items-center justify-center rounded-full border border-[var(--pale-oak)]/25 bg-black/50 text-[var(--pale-oak)] backdrop-blur-md transition-colors hover:border-[var(--bronze)] hover:text-[var(--bronze)] md:right-6 md:top-6"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Stat({
  label,
  value,
  accent,
  icon,
}: {
  label: string;
  value: string;
  accent?: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <div>
      <p className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--pale-oak)]/55">
        {icon}
        {label}
      </p>
      <p
        className={`mt-1 font-display text-2xl leading-none ${
          accent ? "text-[var(--bronze)]" : "text-[var(--pale-oak)]"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
