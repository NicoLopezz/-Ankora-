"use client";

import { useEffect, useId, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { GlobeCanvas } from "@/components/ui/GlobeCanvas";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const SEAL_TEXT = "ANKORA  •  ANCHORED TO REAL ASSETS  •  RWA  •  ";
// DOM "nativo" grande — en el estado minimizado se posiciona con centro en la esquina
// inferior derecha del viewport: sólo se ve el cuadrante superior-izquierdo (~1/4 del círculo).
const SEAL_BIG_PX = 620;
// Tamaño visible cuando está minimizado (el doble de lo que quedará visible como "gajo").
const SEAL_SMALL_PX = 360;

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

    let bigPx = SEAL_BIG_PX;
    let smallPx = SEAL_SMALL_PX;
    let smallScale = smallPx / bigPx;

    let initialX = 0;
    let initialY = 0;
    let targetX = 0;
    let targetY = 0;
    let pinDistance = window.innerHeight * 2.2;
    const recompute = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const isMobile = vw < 768;
      // En mobile: el sello escala al viewport (≈88% del ancho) para que entre completo en centro.
      bigPx = isMobile ? Math.min(vw * 0.88, 420) : SEAL_BIG_PX;
      smallPx = isMobile ? bigPx * 0.58 : SEAL_SMALL_PX;
      smallScale = smallPx / bigPx;
      floatEl.style.width = `${bigPx}px`;
      floatEl.style.height = `${bigPx}px`;
      const wrapperCX = vw - bigPx / 2;
      const wrapperCY = vh - bigPx / 2;
      initialX = vw / 2 - wrapperCX;
      initialY = vh / 2 - wrapperCY;
      targetX = bigPx / 2;
      targetY = bigPx / 2;
      pinDistance = vh * 2.2;
    };
    recompute();

    if (reduced) {
      gsap.set(seal, { x: targetX, y: targetY, scale: smallScale, transformOrigin: "50% 50%" });
      gsap.set(floatEl, { opacity: 1 });
      return;
    }

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
        x: initialX * (1 - sp) + targetX * sp,
        y: initialY * (1 - sp) + targetY * sp,
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

    // Atenuación contextual: en Steps/Contacto el sello baja opacidad + grayscale
    // para no pisar texto. #proyectos queda excluido porque el globo hace sync
    // con el panel activo; el dim específico de Caravan Tech va por evento abajo.
    const dimSections = Array.from(
      document.querySelectorAll<HTMLElement>("#pasos, #contacto"),
    );
    const dimTriggers = dimSections.map((el) =>
      ScrollTrigger.create({
        trigger: el,
        start: "top 75%",
        end: "bottom 25%",
        onToggle: (self) => {
          gsap.to(floatEl, {
            opacity: self.isActive ? 0.35 : 1,
            filter: self.isActive ? "grayscale(1)" : "grayscale(0)",
            duration: 0.6,
            ease: "power2.out",
            overwrite: "auto",
          });
        },
      }),
    );

    // Hover sobre Caravan Tech (proyecto 4): apagar el sello. El globo del sello
    // no tiene visual útil para ese proyecto (Brasil fuera del foco argentino)
    // y compite con la imagen del panel.
    const onGlobeFocus = (e: Event) => {
      const detail = (e as CustomEvent<{ slug: string | null }>).detail;
      const isCaravan = detail?.slug === "caravan-tech";
      gsap.to(floatEl, {
        opacity: isCaravan ? 0.08 : 1,
        filter: isCaravan ? "grayscale(1)" : "grayscale(0)",
        duration: 0.5,
        ease: "power2.out",
        overwrite: "auto",
      });
    };
    window.addEventListener("globe:focus", onGlobeFocus);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("globe:focus", onGlobeFocus);
      cancelAnimationFrame(rafId);
      spin.kill();
      float.kill();
      dimTriggers.forEach((t) => t.kill());
    };
  }, []);

  return (
    <div
      ref={floatRef}
      aria-hidden
      className="pointer-events-none fixed bottom-0 right-0 z-[60] overflow-visible"
      style={{
        width: SEAL_BIG_PX,
        height: SEAL_BIG_PX,
        maxWidth: "100vw",
        maxHeight: "100vh",
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
                {SEAL_TEXT}
              </textPath>
            </text>
          </svg>
        </div>

        {/* Aro interno como borde del globo */}
        <svg viewBox={`0 0 ${size} ${size}`} className="pointer-events-none absolute inset-0 h-full w-full">
          <circle
            cx={cx}
            cy={cy}
            r={r - 14}
            fill="none"
            className="stroke-[var(--bronze)]/25"
            strokeWidth="2"
          />
        </svg>

        {/* Globo dentro del seal — no rota con el texto (está fuera del spinnerRef) */}
        <GlobeCanvas
          pointCount={1400}
          density={0.82}
          className="absolute left-1/2 top-1/2 aspect-square w-[72%] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full"
        />
      </div>
    </div>
  );
}
