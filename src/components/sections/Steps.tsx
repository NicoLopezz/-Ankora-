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
    body: "Verificación en minutos. KYC digital, firma biométrica y listo para operar.",
  },
  {
    n: "02",
    Icon: CursorClickIcon,
    kicker: "Descubrimiento",
    title: "Elegí un proyecto",
    body: "Oportunidades curadas: inmobiliario, agro, infraestructura. Toda la due diligence, pública.",
  },
  {
    n: "03",
    Icon: DollarSignIcon,
    kicker: "Inversión",
    title: "Invertí desde bajo monto",
    body: "Comprá tokens fraccionales. Desde USD 100, sin comisiones ocultas.",
  },
  {
    n: "04",
    Icon: TrendingUpIcon,
    kicker: "Rendimiento",
    title: "Seguí en tiempo real",
    body: "Dashboard en vivo. Flujos, liquidez secundaria y reportes trimestrales.",
  },
];

const EASE = [0.16, 1, 0.3, 1] as const;

export function Steps() {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const fillRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !wrapRef.current || !stageRef.current) return;

    const total = steps.length;
    let idx = 0;
    let animating = false;
    let inside = false;
    let touchStartY = 0;
    let touchAccum = 0;
    let lastWheelT = 0;
    let acceptedGesture = false; // true = ya consumí un step, exigir silencio antes del próximo
    const QUIET_MS = 220; // silencio necesario para considerar "nuevo gesto"

    const progressProxy = { p: 0 };
    let progressTween: gsap.core.Tween | null = null;

    const setP = (p: number) => {
      progressProxy.p = p;
      setProgress(p);
      if (fillRef.current) fillRef.current.style.transform = `scaleX(${p})`;
    };

    const applyIdx = (i: number) => {
      idx = i;
      const p = total > 1 ? i / (total - 1) : 0;
      setActive(i);
      progressTween?.kill();
      setP(p);
    };

    const tweenTo = (targetP: number, duration: number) => {
      progressTween?.kill();
      progressTween = gsap.to(progressProxy, {
        p: targetP,
        duration,
        ease: "power2.inOut",
        onUpdate: () => setP(progressProxy.p),
      });
    };

    const sectionTopY = () => {
      const rect = wrapRef.current!.getBoundingClientRect();
      return window.scrollY + rect.top;
    };

    const goTo = (next: number) => {
      if (animating) return false;
      if (next < 0 || next > total - 1) return false;
      animating = true;
      const duration = 0.9;
      const targetP = total > 1 ? next / (total - 1) : 0;
      idx = next;
      setActive(next);
      tweenTo(targetP, duration);
      const y = sectionTopY() + next * window.innerHeight;
      const lenis = getLenis();
      const done = () => {
        animating = false;
        // dejamos ventana de silencio: exigimos QUIET_MS sin wheels antes del próximo step.
        // si el usuario todavía está empujando delta, lenis sigue stopped hasta que se calme.
      };
      if (lenis) {
        // hard-lock: frenamos por completo el scroll suavizado para que deltas acumulados
        // del usuario no empujen más allá del pin cuando termine el tween.
        lenis.stop();
        lenis.scrollTo(y, {
          duration,
          easing: (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2),
          lock: true,
          force: true,
          onComplete: () => {
            lenis.start();
            done();
          },
        });
      } else {
        window.scrollTo({ top: y, behavior: "smooth" });
        window.setTimeout(done, duration * 1000);
      }
      return true;
    };

    const tryStep = (dir: number) => {
      const next = idx + dir;
      if (next < 0 || next > total - 1) return false; // dejar que el scroll natural salga de la sección
      goTo(next);
      return true;
    };

    const onWheel = (e: WheelEvent) => {
      if (!inside) return;
      const now = performance.now();
      const dir = e.deltaY > 0 ? 1 : e.deltaY < 0 ? -1 : 0;
      if (!dir) return;
      // Si estamos en un extremo y el usuario scrollea hacia fuera, dejamos pasar
      if ((idx === 0 && dir < 0) || (idx === total - 1 && dir > 0)) return;
      e.preventDefault();
      e.stopPropagation();

      // mientras animamos, también frenamos lenis por si sigue procesando delta interno
      if (animating) {
        getLenis()?.stop();
        lastWheelT = now;
        return;
      }

      const quiet = now - lastWheelT > QUIET_MS;
      lastWheelT = now;

      // Si ya consumí un step, requiero un período de silencio (inercia trackpad termina) antes del próximo
      if (acceptedGesture && !quiet) return;

      acceptedGesture = true;
      tryStep(dir);
    };

    const onTouchStart = (e: TouchEvent) => {
      if (!inside) return;
      touchStartY = e.touches[0].clientY;
      touchAccum = 0;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!inside) return;
      const y = e.touches[0].clientY;
      const delta = touchStartY - y;
      touchAccum = delta;
      const dir = delta > 0 ? 1 : -1;
      if ((idx === 0 && dir < 0) || (idx === total - 1 && dir > 0)) return;
      e.preventDefault();
      if (animating) return;
      if (Math.abs(delta) < 45) return;
      touchStartY = y;
      tryStep(dir);
    };

    const onKey = (e: KeyboardEvent) => {
      if (!inside || animating) return;
      if (e.key === "ArrowDown" || e.key === "PageDown") {
        if (tryStep(1)) e.preventDefault();
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        if (tryStep(-1)) e.preventDefault();
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("keydown", onKey);

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: wrapRef.current!,
        start: "top top",
        end: "bottom bottom",
        pin: stageRef.current!,
        pinSpacing: false,
        onEnter: () => {
          inside = true;
          applyIdx(0);
        },
        onEnterBack: () => {
          inside = true;
          applyIdx(total - 1);
        },
        onLeave: () => {
          inside = false;
          acceptedGesture = false;
          lastWheelT = 0;
          // si salimos por abajo, garantizamos que el último step quede visualmente "completado"
          applyIdx(total - 1);
        },
        onLeaveBack: () => {
          inside = false;
          acceptedGesture = false;
          lastWheelT = 0;
          applyIdx(0);
        },
      });
    }, wrapRef);

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("keydown", onKey);
      ctx.revert();
    };
  }, []);

  const ActiveIcon = steps[active].Icon;
  const isLast = active === steps.length - 1 && progress > 0.92;

  return (
    <section
      id="pasos"
      ref={wrapRef}
      className="relative w-full"
      style={{ height: `${steps.length * 100}vh` }}
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
          <div className="mb-14 flex flex-col items-start gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-4 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.3em] text-[var(--pale-oak)]/60">
                <span className="inline-block h-px w-10 bg-[var(--bronze)]" />
                Cómo funciona
              </p>
              <h2 className="font-display text-[clamp(2rem,4.5vw,4rem)] font-light leading-[0.95] tracking-[-0.02em] text-[var(--pale-oak)]">
                Cuatro pasos. <span className="italic text-[var(--bronze)]">Cero fricción.</span>
              </h2>
            </div>
            <p className="max-w-sm text-sm text-[var(--pale-oak)]/60">
              Scrolleá para recorrer el proceso. Cada paso se activa a medida que avanzás.
            </p>
          </div>

          <div className="relative grid grid-cols-12 items-center gap-8">
            <div className="col-span-12 md:col-span-5">
              <div className="relative h-[240px] md:h-[380px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active}
                    initial={{ opacity: 0, y: 60, filter: "blur(12px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -40, filter: "blur(12px)" }}
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

          <div className="mt-16 flex items-center gap-6">
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
