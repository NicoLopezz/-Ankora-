"use client";

import { useEffect, useId, useRef } from "react";
import gsap from "gsap";

const SEAL_TEXT = "ARKARA  •  TOKENIZACIÓN  •  ACTIVOS REALES  •  ";
// DOM "nativo" grande — escalamos DOWN a 150px para máxima nitidez.
const SEAL_BIG_PX = 620;
const SEAL_SMALL_PX = 150;

const u = (v: number) => Math.max(0, Math.min(1, v));
const map = ([a, b]: readonly [number, number], p: number) => u((p - a) / (b - a));
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

const SEAL_TRAVEL = [0.25, 0.7] as const;

export function HeroSeal() {
  const pathId = useId().replace(/:/g, "-");
  const floatRef = useRef<HTMLDivElement | null>(null);
  const sealRef = useRef<HTMLDivElement | null>(null);
  const spinnerRef = useRef<HTMLDivElement | null>(null);
  const size = 600;
  const r = size / 2 - 40;
  const cx = size / 2;
  const cy = size / 2;

  useEffect(() => {
    const seal = sealRef.current;
    const spinner = spinnerRef.current;
    const floatEl = floatRef.current;
    if (!seal || !spinner || !floatEl) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const smallScale = SEAL_SMALL_PX / SEAL_BIG_PX;

    if (reduced) {
      gsap.set(seal, { x: 0, y: 0, scale: smallScale });
      return;
    }

    let initialX = 0;
    let initialY = 0;
    let pinDistance = window.innerHeight * 2.2;
    const recompute = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const margin = vw >= 1024 ? 48 : 32;
      const cornerCX = vw - margin - SEAL_BIG_PX / 2;
      const cornerCY = vh - margin - SEAL_BIG_PX / 2;
      initialX = vw / 2 - cornerCX;
      initialY = vh / 2 - cornerCY;
      pinDistance = vh * 2.2;
    };
    recompute();

    gsap.set(seal, {
      x: initialX,
      y: initialY,
      scale: 1,
      opacity: 1,
      transformOrigin: "50% 50%",
    });
    // revela el wrapper ahora que el seal ya está en posición correcta
    gsap.set(floatEl, { opacity: 1 });

    const spin = gsap.to(spinner, {
      rotation: 360,
      duration: 28,
      repeat: -1,
      ease: "none",
      transformOrigin: "50% 50%",
    });

    const float = gsap.to(floatEl, {
      y: -14,
      duration: 3.2,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });

    // Smoothing: lerp progress para que no se sienta 1:1 con el scroll crudo.
    let target = 0;
    let current = 0;
    let rafId = 0;
    const loop = () => {
      current += (target - current) * 0.12;
      const sp = easeOut(map(SEAL_TRAVEL, current));
      gsap.set(seal, {
        x: initialX * (1 - sp),
        y: initialY * (1 - sp),
        scale: 1 + sp * (smallScale - 1),
      });
      spin.timeScale(1 + sp * 2.5);
      if (Math.abs(target - current) > 0.0005) {
        rafId = requestAnimationFrame(loop);
      } else {
        rafId = 0;
      }
    };

    const onScroll = () => {
      const y = window.scrollY;
      target = Math.max(0, Math.min(1, y / pinDistance));
      if (!rafId) rafId = requestAnimationFrame(loop);
    };

    const onResize = () => {
      recompute();
      onScroll();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    // init
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(rafId);
      spin.kill();
      float.kill();
    };
  }, []);

  return (
    <div
      ref={floatRef}
      aria-hidden
      className="pointer-events-none fixed bottom-8 right-8 z-[60] hidden md:block lg:bottom-12 lg:right-12"
      style={{
        width: SEAL_BIG_PX,
        height: SEAL_BIG_PX,
        willChange: "transform",
        opacity: 0,
      }}
    >
      <div ref={sealRef} className="absolute inset-0" style={{ willChange: "transform" }}>
        <div
          ref={spinnerRef}
          className="absolute inset-0"
          style={{ willChange: "transform" }}
        >
          <svg viewBox={`0 0 ${size} ${size}`} className="h-full w-full">
            <defs>
              <path
                id={`hero-seal-${pathId}`}
                d={`M ${cx},${cy} m -${r},0 a ${r},${r} 0 1,1 ${r * 2},0 a ${r},${r} 0 1,1 -${r * 2},0`}
                fill="none"
              />
            </defs>
            <text
              className="fill-[var(--bronze)]"
              fontSize={44}
              style={{
                fontFamily: "var(--font-geist-mono)",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
              }}
            >
              <textPath href={`#hero-seal-${pathId}`} startOffset="0">
                {SEAL_TEXT.repeat(2)}
              </textPath>
            </text>
          </svg>
        </div>

        <svg viewBox={`0 0 ${size} ${size}`} className="absolute inset-0 h-full w-full">
          <circle
            cx={cx}
            cy={cy}
            r={r - 14}
            fill="none"
            className="stroke-[var(--bronze)]/30"
            strokeWidth="3"
          />
          <circle cx={cx} cy={cy} r="8" className="fill-[var(--bronze)]" />
        </svg>
      </div>
    </div>
  );
}
