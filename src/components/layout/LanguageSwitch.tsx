"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { setUserLocale } from "@/i18n/locale";
import { locales, type Locale } from "@/i18n/config";

export function LanguageSwitch() {
  const t = useTranslations("languageSwitch");
  const current = useLocale() as Locale;
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const change = (next: Locale) => {
    if (next === current || pending) return;
    startTransition(async () => {
      await setUserLocale(next);
      router.refresh();
    });
  };

  return (
    <div
      role="group"
      aria-label={t("label")}
      className="flex items-center gap-1 rounded-full border border-[var(--pale-oak)]/15 bg-[var(--pale-oak)]/5 p-[3px] font-mono text-[10px] uppercase tracking-[0.15em]"
    >
      {locales.map((loc) => {
        const active = loc === current;
        return (
          <button
            key={loc}
            type="button"
            onClick={() => change(loc)}
            data-cursor="hover"
            disabled={pending}
            aria-pressed={active}
            className={`rounded-full px-2 py-[3px] transition-colors duration-300 ${
              active
                ? "bg-[var(--bronze)]/90 text-[var(--night-bordeaux)]"
                : "text-[var(--pale-oak)]/70 hover:text-[var(--pale-oak)]"
            }`}
          >
            {t(loc)}
          </button>
        );
      })}
    </div>
  );
}
