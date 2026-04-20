"use client";

import { useEffect, useRef, useState } from "react";

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (fine && !reduced) setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%)`;
    };

    const onDown = () => ring.classList.add("is-active");
    const onUp = () => ring.classList.remove("is-active");

    let lastHoverEl: Element | null = null;
    let isHover = false;
    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      if (t === lastHoverEl) return; // mismo target, skip query
      lastHoverEl = t;
      const nextHover = !!t?.closest("a, button, [data-cursor='hover']");
      if (nextHover === isHover) return; // estado no cambió
      isHover = nextHover;
      ring.classList.toggle("is-hover", nextHover);
    };

    const tick = () => {
      rx += (mx - rx) * 0.15;
      ry += (my - ry) * 0.15;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    raf = requestAnimationFrame(tick);
    document.documentElement.style.cursor = "none";

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.documentElement.style.cursor = "";
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-1.5 w-1.5 rounded-full bg-[var(--bronze)] mix-blend-difference"
      />
      <div
        ref={ringRef}
        aria-hidden
        className="custom-cursor-ring pointer-events-none fixed left-0 top-0 z-[9998] h-9 w-9 rounded-full border border-[var(--pale-oak)]/60 mix-blend-difference transition-[width,height,opacity,border-color] duration-300 ease-out"
      />
      <style jsx>{`
        .custom-cursor-ring.is-hover {
          width: 64px;
          height: 64px;
          border-color: var(--bronze);
        }
        .custom-cursor-ring.is-active {
          width: 24px;
          height: 24px;
        }
      `}</style>
    </>
  );
}
