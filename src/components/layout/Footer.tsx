import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations("footer");
  return (
    <footer className="relative z-10 border-t border-[var(--pale-oak)]/10 bg-[var(--surface)]/50">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-16 md:flex-row md:justify-between">
        <div className="max-w-sm">
          <span
            role="img"
            aria-label="Ankora — Tokenization Platform"
            className="block h-16 text-[var(--pale-oak)]/70 md:h-20"
            style={{
              aspectRatio: "940 / 234",
              backgroundColor: "currentColor",
              WebkitMaskImage: "url(/brand/ankora-logo-full.svg)",
              maskImage: "url(/brand/ankora-logo-full.svg)",
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat",
              WebkitMaskSize: "contain",
              maskSize: "contain",
              WebkitMaskPosition: "left center",
              maskPosition: "left center",
            }}
          />
          <p className="mt-6 text-sm leading-relaxed text-[var(--pale-oak)]/60">
            {t("description")}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-10 text-sm md:grid-cols-3">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--pale-oak)]/45">{t("platformTitle")}</p>
            <ul className="mt-4 space-y-2 text-[var(--pale-oak)]/80">
              <li><a href="#proyectos" className="hover:text-[var(--bronze)]">{t("platform.projects")}</a></li>
              <li><a href="#pasos" className="hover:text-[var(--bronze)]">{t("platform.how")}</a></li>
              <li><a href="#contacto" className="hover:text-[var(--bronze)]">{t("platform.earlyAccess")}</a></li>
            </ul>
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--pale-oak)]/45">{t("companyTitle")}</p>
            <ul className="mt-4 space-y-2 text-[var(--pale-oak)]/80">
              <li><a href="#" className="hover:text-[var(--bronze)]">{t("company.amg")}</a></li>
              <li><a href="mailto:hola@ankora.io" className="hover:text-[var(--bronze)]">{t("company.contact")}</a></li>
              <li><a href="#" className="hover:text-[var(--bronze)]">{t("company.press")}</a></li>
            </ul>
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--pale-oak)]/45">{t("legalTitle")}</p>
            <ul className="mt-4 space-y-2 text-[var(--pale-oak)]/80">
              <li><a href="#" className="hover:text-[var(--bronze)]">{t("legal.terms")}</a></li>
              <li><a href="#" className="hover:text-[var(--bronze)]">{t("legal.privacy")}</a></li>
              <li><a href="#" className="hover:text-[var(--bronze)]">{t("legal.risk")}</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-[var(--pale-oak)]/10">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-6 py-8 md:flex-row md:gap-10">
          <p className="shrink-0 font-mono text-[10px] uppercase tracking-[0.3em] text-[#c4392a]/85 md:w-[140px] md:pt-0.5">
            {t("riskHeading")}
          </p>
          <p className="max-w-4xl text-xs leading-relaxed text-[var(--pale-oak)]/45">
            {t("riskBody")}
          </p>
        </div>
      </div>
      <div className="border-t border-[var(--pale-oak)]/10">
        <div className="mx-auto flex w-full max-w-7xl flex-col justify-between gap-2 px-6 py-6 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--pale-oak)]/45 md:flex-row">
          <span>{t("copyright")}</span>
          <span>{t("tagline")}</span>
        </div>
      </div>
    </footer>
  );
}
