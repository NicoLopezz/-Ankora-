"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AnimatePresence, motion } from "motion/react";
import { getLenis } from "@/components/effects/SmoothScroll";
import { UserIcon, type UserIconHandle } from "@/components/ui/user";
import { CursorClickIcon, type CursorClickIconHandle } from "@/components/ui/cursor-click";
import { DollarSignIcon, type DollarSignIconHandle } from "@/components/ui/dollar-sign";
import { TrendingUpIcon, type TrendingUpIconHandle } from "@/components/ui/trending-up";
import { CheckIcon, type CheckIconHandle } from "@/components/ui/check";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type IconHandle =
  | UserIconHandle
  | CursorClickIconHandle
  | DollarSignIconHandle
  | TrendingUpIconHandle
  | CheckIconHandle;

/** Wrapper que dispara startAnimation al montar (y re-dispara cada N ms si querés loop sutil). */
function AutoIcon({
  Icon,
  size = 56,
  loopMs,
}: {
  Icon: React.ForwardRefExoticComponent<
    { size?: number } & React.RefAttributes<IconHandle>
  >;
  size?: number;
  loopMs?: number;
}) {
  const ref = useRef<IconHandle | null>(null);

  useEffect(() => {
    const t0 = setTimeout(() => ref.current?.startAnimation(), 80);
    if (!loopMs) return () => clearTimeout(t0);
    const iv = setInterval(() => ref.current?.startAnimation(), loopMs);
    return () => {
      clearTimeout(t0);
      clearInterval(iv);
    };
  }, [loopMs]);

  return <Icon ref={ref} size={size} />;
}

const steps = [
  {
    n: "01",
    Icon: UserIcon,
    kicker: "Onboarding",
    title: "Creá tu cuenta",
    body: "KYC digital con perfil de inversor y jurisdicción. Verificación en minutos — sin papeles, sin sucursales.",
  },
  {
    n: "02",
    Icon: CursorClickIcon,
    kicker: "Descubrimiento",
    title: "Elegí un proyecto",
    body: "Marketplace curado: viñedos, tierras, inmobiliario, livestock. Cada ficha publica prospectus, fideicomiso y fees upfront.",
  },
  {
    n: "03",
    Icon: DollarSignIcon,
    kicker: "Inversión",
    title: "Invertí desde USD 500",
    body: "Pagá en pesos (on-ramp local) o USD/USDC. Recibís tokens en Polygon que representan tu participación en el fideicomiso.",
  },
  {
    n: "04",
    Icon: TrendingUpIcon,
    kicker: "Hold & track",
    title: "Seguí tu activo en vivo",
    body: "Valuación, distribuciones y reportes trimestrales. Salida por secundario (cuando se habilite) o vencimiento del fideicomiso.",
  },
];

const EASE = [0.16, 1, 0.3, 1] as const;

export function Steps() {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const fillRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !wrapRef.current || !stageRef.current) return;

    // En mobile, damos "linger" al paso 4: la sección es más alta, pero el progreso
    // se mapea para completar antes del final, dejando scroll extra para ver el halo.
    const mobile = window.matchMedia("(max-width: 767px)").matches;
    const lingerRatio = mobile ? 0.78 : 1;

    const total = steps.length;
    let lastIdx = -1;
    let hasCompleted = false; // true una vez que el user pasó por los 4 estados al menos una vez

    // Progreso visual "queued": al bajar, sigue al scroll pero no puede adelantarse más de
    // STEP_SPEED por frame — garantiza que se vean los 4 estados aunque el scroll fulmine
    // la sección. Una vez completado el primer traversal, subir (o moverse) queda libre.
    let visualP = 0;
    let targetP = 0;
    let rafId: number | null = null;
    const STEP_SPEED = 1 / 35; // fracción del progreso total avanzada por frame

    const setP = (p: number) => {
      if (fillRef.current) fillRef.current.style.transform = `scaleX(${p})`;
      setProgress(p);
      const i = Math.min(total - 1, Math.round(p * (total - 1)));
      if (i !== lastIdx) {
        lastIdx = i;
        setActive(i);
      }
      if (!hasCompleted && p >= 0.999) hasCompleted = true;
    };

    const tick = () => {
      const diff = targetP - visualP;
      if (Math.abs(diff) < 0.0005) {
        visualP = targetP;
        setP(visualP);
        rafId = null;
        return;
      }
      const dir = Math.sign(diff);
      // Cap solo mientras no se completó el primer descenso Y el usuario avanza (dir > 0).
      // Al subir o después de completar, libre.
      const capped = !hasCompleted && dir > 0;
      const advance = capped ? Math.min(Math.abs(diff), STEP_SPEED) : Math.abs(diff);
      visualP += dir * advance;
      setP(visualP);
      if (capped && Math.abs(targetP - visualP) > 0.0005) {
        rafId = requestAnimationFrame(tick);
      } else {
        rafId = null;
      }
    };

    const kickRaf = () => {
      if (rafId == null) rafId = requestAnimationFrame(tick);
    };

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: wrapRef.current!,
        start: "top top",
        end: "bottom bottom",
        pin: stageRef.current!,
        pinSpacing: false,
        scrub: false,
        onUpdate: (self) => {
          targetP = Math.min(1, self.progress / lingerRatio);
          kickRaf();
        },
        onLeave: () => {
          targetP = 1;
          kickRaf();
        },
        onLeaveBack: () => {
          targetP = 0;
          kickRaf();
        },
      });
    }, wrapRef);

    return () => {
      if (rafId != null) cancelAnimationFrame(rafId);
      ctx.revert();
    };
  }, []);

  const ActiveIcon = steps[active].Icon;
  const isLast = active === steps.length - 1 && progress > 0.92;

  return (
    <section
      id="pasos"
      ref={wrapRef}
      className="relative w-full scroll-mt-28"
      style={{ height: `${steps.length * 100 + (isMobile ? 120 : 0)}vh` }}
    >
      <div
        ref={stageRef}
        className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden px-6"
      >
        <motion.div
          aria-hidden
          className="absolute inset-0 -z-10"
          animate={{
            background: [
              "radial-gradient(ellipse at 20% 30%, color-mix(in oklab, var(--burnt-rose) 45%, transparent) 0%, transparent 55%)",
              "radial-gradient(ellipse at 80% 30%, color-mix(in oklab, var(--bronze) 30%, transparent) 0%, transparent 55%)",
              "radial-gradient(ellipse at 50% 70%, color-mix(in oklab, var(--burnt-rose) 50%, transparent) 0%, transparent 55%)",
              "radial-gradient(ellipse at 50% 50%, color-mix(in oklab, var(--bronze) 55%, transparent) 0%, transparent 60%)",
            ][active],
          }}
          transition={{ duration: 1.2, ease: EASE }}
        />

        <AnimatePresence>
          {isLast && (
            <motion.div
              key="halo"
              aria-hidden
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: 1.2, ease: EASE }}
              className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[140vmin] w-[140vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                background:
                  "radial-gradient(circle, color-mix(in oklab, var(--bronze) 55%, transparent) 0%, color-mix(in oklab, var(--bronze) 10%, transparent) 30%, transparent 60%)",
                animation: "pulse-glow 2.4s ease-in-out infinite",
              }}
            />
          )}
        </AnimatePresence>

        <div className="mx-auto w-full max-w-7xl">
          <div className="mb-8 flex flex-col items-start gap-4 md:mb-14 md:flex-row md:items-end md:justify-between md:gap-6">
            <div>
              <p className="mb-4 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.3em] text-[var(--pale-oak)]/60">
                <span className="inline-block h-px w-10 bg-[var(--bronze)]" />
                Cómo funciona
              </p>
              <h2
                className="font-display text-[clamp(2rem,4.5vw,4rem)] font-light leading-[0.95] tracking-[-0.02em] text-[var(--pale-oak)]"
                style={{ textShadow: "0 2px 24px rgba(0,0,0,0.45), 0 1px 2px rgba(0,0,0,0.35)" }}
              >
                Cuatro pasos. <span className="italic text-[var(--bronze)]">Cero fricción.</span>
              </h2>
            </div>
            <p className="max-w-sm text-sm text-[var(--pale-oak)]/60">
              Scrolleá para recorrer el proceso. Cada paso se activa a medida que avanzás.
            </p>
          </div>

          <div className="relative grid grid-cols-12 items-center gap-2 md:gap-8">
            <div className="col-span-12 md:col-span-5">
              <div className="relative h-[160px] md:h-[380px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active}
                    initial={{ opacity: 0, y: 60 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -40 }}
                    transition={{ duration: 0.9, ease: EASE }}
                    className="absolute inset-0 flex items-center"
                  >
                    <span
                      className="font-display font-light leading-none tracking-[-0.06em] text-transparent"
                      style={{
                        fontSize: "clamp(10rem, 24vw, 22rem)",
                        WebkitTextStroke: "1.5px color-mix(in oklab, var(--bronze) 70%, transparent)",
                      }}
                    >
                      {steps[active].n}
                    </span>
                  </motion.div>
                </AnimatePresence>

                {/* Icono animado — cambia y se dispara en cada paso */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`icon-${active}`}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{
                      opacity: { duration: 0.5, ease: EASE },
                      scale: { duration: 0.7, ease: EASE },
                    }}
                    className="absolute bottom-6 right-6 flex h-20 w-20 items-center justify-center rounded-full border border-[var(--bronze)]/60 bg-[var(--surface)]/60 text-[var(--bronze)] backdrop-blur-md md:bottom-10 md:right-10 md:h-28 md:w-28"
                  >
                    {isLast ? (
                      <AutoIcon Icon={CheckIcon as never} size={44} />
                    ) : (
                      <AutoIcon Icon={ActiveIcon as never} size={44} loopMs={3200} />
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            <div className="col-span-12 md:col-span-7">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`text-${active}`}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
                  className="flex flex-col gap-6"
                >
                  <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[var(--bronze)]">
                    {steps[active].kicker}
                  </p>
                  <h3 className="font-display text-[clamp(2.5rem,6vw,5.5rem)] font-light leading-[0.95] tracking-[-0.02em] text-[var(--pale-oak)]">
                    {steps[active].title}
                  </h3>
                  <p className="max-w-lg text-lg leading-relaxed text-[var(--pale-oak)]/75">
                    {steps[active].body}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div className="mt-10 flex items-center gap-6 md:mt-16">
            <div className="flex-1">
              <div className="relative h-px w-full bg-[var(--pale-oak)]/15">
                <div
                  ref={fillRef}
                  className="absolute inset-0 h-px origin-left bg-gradient-to-r from-[var(--burnt-rose)] via-[var(--bronze)] to-[var(--pale-oak)]"
                  style={{ transform: "scaleX(0)" }}
                />
                <div className="absolute inset-0 flex items-center justify-between">
                  {steps.map((s, i) => (
                    <motion.div
                      key={s.n}
                      animate={{
                        scale: i <= active ? 1.15 : 0.9,
                        backgroundColor:
                          i < active
                            ? "var(--bronze)"
                            : i === active
                              ? "var(--pale-oak)"
                              : "var(--dusty-taupe)",
                        boxShadow:
                          i === active
                            ? "0 0 0 6px color-mix(in oklab, var(--bronze) 25%, transparent)"
                            : "0 0 0 0px transparent",
                      }}
                      transition={{ duration: 0.5, ease: EASE }}
                      className="h-2 w-2 rounded-full"
                    />
                  ))}
                </div>
              </div>
              <div className="mt-3 flex justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--pale-oak)]/45">
                {steps.map((s) => (
                  <span key={s.n}>{s.n}</span>
                ))}
              </div>
            </div>
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--pale-oak)]/60">
              {String(active + 1).padStart(2, "0")} / {String(steps.length).padStart(2, "0")}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
