"use client";

import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { LanguageSwitch } from "./LanguageSwitch";

const itemKeys = [
  { key: "projects", href: "#proyectos" },
  { key: "how", href: "#pasos" },
  { key: "structure", href: "#estructura" },
  { key: "contact", href: "#contacto" },
] as const;

export function Nav() {
  const pathname = usePathname();
  const t = useTranslations("nav");
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const lastYRef = useRef(0);

  useMotionValueEvent(scrollY, "change", (y) => {
    setScrolled(y > 80);

    const introEnd =
      typeof window !== "undefined" ? window.innerHeight * 1.55 : 0;
    const last = lastYRef.current;
    const dy = y - last;

    // Durante el intro del hero, siempre oculto
    if (y < introEnd) {
      setHidden(true);
    } else if (dy > 4) {
      // scrolling down → hide
      setHidden(true);
    } else if (dy < -4) {
      // scrolling up → show
      setHidden(false);
    }

    lastYRef.current = y;
  });

  // Hide landing nav on dashboard + admin routes (both have their own shell)
  if (pathname?.startsWith("/dashboard") || pathname?.startsWith("/admin")) return null;

  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: hidden ? -120 : 0, opacity: hidden ? 0 : 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-x-0 top-4 z-[80] flex justify-center px-4"
    >
      <nav
        className="flex w-full max-w-5xl items-center justify-between gap-4 rounded-[var(--radius-lg)] border px-5 py-3 transition-[background-color,border-color,box-shadow] duration-500 ease-out"
        style={{
          backgroundColor: scrolled
            ? "color-mix(in oklab, var(--night-bordeaux) 88%, transparent)"
            : "color-mix(in oklab, var(--pale-oak) 6%, transparent)",
          borderColor: scrolled
            ? "color-mix(in oklab, var(--pale-oak) 18%, transparent)"
            : "color-mix(in oklab, var(--pale-oak) 12%, transparent)",
          backdropFilter: "blur(20px) saturate(140%)",
          WebkitBackdropFilter: "blur(20px) saturate(140%)",
          boxShadow: scrolled
            ? "0 20px 40px -20px color-mix(in oklab, var(--night-bordeaux) 80%, transparent)"
            : "none",
        }}
      >
        <a href="#top" className="flex items-center gap-2" data-cursor="hover" aria-label={t("logoAria")}>
          <span
            role="img"
            aria-label="Ankora"
            className="block h-5 text-[var(--pale-oak)]/70 md:h-6"
            style={{
              aspectRatio: "940 / 180",
              backgroundColor: "currentColor",
              WebkitMaskImage: "url(/brand/ankora-logo.svg)",
              maskImage: "url(/brand/ankora-logo.svg)",
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat",
              WebkitMaskSize: "contain",
              maskSize: "contain",
              WebkitMaskPosition: "center",
              maskPosition: "center",
            }}
          />
        </a>
        <ul className="hidden items-center gap-7 md:flex">
          {itemKeys.map((it) => (
            <li key={it.href}>
              <a
                href={it.href}
                data-cursor="hover"
                className="text-sm text-[var(--pale-oak)]/80 transition-colors duration-300 hover:text-[var(--pale-oak)]"
              >
                {t(`items.${it.key}`)}
              </a>
            </li>
          ))}
        </ul>
        <LanguageSwitch />
      </nav>
    </motion.header>
  );
}
