"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { MagneticButton } from "@/components/ui/MagneticButton";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Rangos de progress (0..1) para cada elemento de texto. El seal se maneja
// aparte en <HeroSeal />, pero ambos responden al mismo trigger (#top + 220%).
const R = {
  kicker:     [0.35, 0.5] as const,
  title1:     [0.42, 0.62] as const,
  title2:     [0.48, 0.68] as const,
  description:[0.72, 0.88] as const,
  buttons:    [0.78, 0.92] as const,
  scrollHint: [0.9, 1.0] as const,
};

const u = (v: number) => Math.max(0, Math.min(1, v));
const map = ([a, b]: readonly [number, number], p: number) => u((p - a) / (b - a));
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

export function Hero() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const kickerRef = useRef<HTMLParagraphElement | null>(null);
  const title1Ref = useRef<HTMLDivElement | null>(null);
  const title2Ref = useRef<HTMLDivElement | null>(null);
  const descRef = useRef<HTMLParagraphElement | null>(null);
  const buttonsRef = useRef<HTMLDivElement | null>(null);
  const scrollHintRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      gsap.set([kickerRef.current, descRef.current, buttonsRef.current, scrollHintRef.current], {
        opacity: 1,
        y: 0,
      });
      gsap.set([title1Ref.current, title2Ref.current], { opacity: 1, y: 0 });
      return;
    }

    // Estado inicial: texto oculto (baja desde arriba)
    gsap.set([kickerRef.current, descRef.current, buttonsRef.current, scrollHintRef.current], {
      opacity: 0,
      y: -40,
    });
    gsap.set([title1Ref.current, title2Ref.current], { opacity: 0, y: -80 });

    const applyProgress = (p: number) => {
      const kp = easeOut(map(R.kicker, p));
      gsap.set(kickerRef.current, { opacity: kp, y: -40 * (1 - kp) });

      const t1 = easeOut(map(R.title1, p));
      gsap.set(title1Ref.current, { opacity: t1, y: -80 * (1 - t1) });

      const t2 = easeOut(map(R.title2, p));
      gsap.set(title2Ref.current, { opacity: t2, y: -80 * (1 - t2) });

      const dp = easeOut(map(R.description, p));
      gsap.set(descRef.current, { opacity: dp, y: -40 * (1 - dp) });

      const bp = easeOut(map(R.buttons, p));
      gsap.set(buttonsRef.current, { opacity: bp, y: -40 * (1 - bp) });

      const shp = easeOut(map(R.scrollHint, p));
      gsap.set(scrollHintRef.current, { opacity: shp });
    };

    const st = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "+=220%",
      pin: true,
      pinSpacing: true,
      scrub: 1.0,
      onUpdate: (self) => applyProgress(self.progress),
      onRefresh: (self) => applyProgress(self.progress),
    });

    return () => {
      st.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="top"
      className="relative flex min-h-screen w-full flex-col justify-center overflow-hidden py-24"
    >
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse at 50% 30%, color-mix(in oklab, var(--burnt-rose) 55%, transparent) 0%, transparent 55%), radial-gradient(ellipse at 80% 90%, color-mix(in oklab, var(--bronze) 25%, transparent) 0%, transparent 45%)",
        }}
      />

      <div className="mx-auto w-full max-w-7xl px-6">
        <p
          ref={kickerRef}
          className="mb-10 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.3em] text-[var(--pale-oak)]/60"
          style={{ opacity: 0 }}
        >
          <span className="inline-block h-px w-10 bg-[var(--bronze)]" />
          Arkara — Tokenización de activos reales
        </p>

        <h1 className="font-display text-[clamp(2.25rem,7vw,6.5rem)] font-light leading-[1] tracking-[-0.03em] text-[var(--pale-oak)]">
          <div ref={title1Ref} style={{ opacity: 0 }}>
            Tokenizá <span className="italic text-[var(--bronze)]">lo</span> real.
          </div>
          <div ref={title2Ref} style={{ opacity: 0 }}>
            Invertí en <span className="gradient-text">minutos.</span>
          </div>
        </h1>

        <div className="mt-14 flex flex-col items-start justify-between gap-10 md:flex-row md:items-end">
          <p
            ref={descRef}
            className="max-w-sm text-balance text-base leading-relaxed text-[var(--pale-oak)]/75"
            style={{ opacity: 0 }}
          >
            Acceso fraccional a proyectos inmobiliarios, agrícolas y de infraestructura.
            Cuatro pasos, sin intermediarios.
          </p>

          <div
            ref={buttonsRef}
            className="flex flex-wrap items-center gap-4"
            style={{ opacity: 0 }}
          >
            <MagneticButton href="#proyectos" className="btn-gold group" strength={0.3}>
              Ver proyectos
              <ArrowUpRight className="h-4 w-4 transition-transform duration-500 ease-out group-hover:rotate-45" />
            </MagneticButton>
            <MagneticButton
              href="#pasos"
              className="inline-flex items-center gap-2 rounded-full border border-[var(--pale-oak)]/30 px-6 py-[0.95rem] text-sm text-[var(--pale-oak)] transition-colors duration-300 hover:border-[var(--bronze)] hover:text-[var(--bronze)]"
              strength={0.25}
            >
              Cómo funciona
              <ArrowDown className="h-4 w-4" />
            </MagneticButton>
          </div>
        </div>
      </div>

      <div
        ref={scrollHintRef}
        className="absolute bottom-8 left-6 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--pale-oak)]/50 lg:bottom-12 lg:left-12"
        style={{ opacity: 0 }}
      >
        <span className="h-[6px] w-[6px] animate-pulse rounded-full bg-[var(--bronze)]" />
        Scroll
      </div>
    </section>
  );
}
