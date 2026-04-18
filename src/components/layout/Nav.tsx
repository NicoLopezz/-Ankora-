"use client";

import { useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { MagneticButton } from "@/components/ui/MagneticButton";

const items = [
  { label: "Proyectos", href: "#proyectos" },
  { label: "Cómo funciona", href: "#pasos" },
  { label: "Nosotros", href: "#nosotros" },
];

export function Nav() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    const delta = y - prev;
    if (y < 80) {
      setHidden(false);
      return;
    }
    if (delta > 6) setHidden(true);
    else if (delta < -6) setHidden(false);
  });

  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: hidden ? -120 : 0, opacity: hidden ? 0 : 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-x-0 top-4 z-[80] flex justify-center px-4"
    >
      <nav className="glass-card flex w-full max-w-5xl items-center justify-between gap-4 px-5 py-3">
        <a href="#top" className="flex items-center gap-2" data-cursor="hover">
          <span className="font-display text-xl tracking-tight text-[var(--pale-oak)]">
            Ark<span className="text-[var(--bronze)]">ara</span>
          </span>
        </a>
        <ul className="hidden items-center gap-7 md:flex">
          {items.map((it) => (
            <li key={it.href}>
              <a
                href={it.href}
                data-cursor="hover"
                className="text-sm text-[var(--pale-oak)]/80 transition-colors duration-300 hover:text-[var(--pale-oak)]"
              >
                {it.label}
              </a>
            </li>
          ))}
        </ul>
        <MagneticButton href="#contacto" className="btn-gold text-sm" strength={0.35}>
          Invertir
        </MagneticButton>
      </nav>
    </motion.header>
  );
}
