export function Footer() {
  return (
    <footer className="relative z-10 border-t border-[var(--pale-oak)]/10 bg-[var(--surface)]/50">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-16 md:flex-row md:justify-between">
        <div className="max-w-sm">
          <span className="font-display text-3xl tracking-[0.08em] text-[var(--pale-oak)]">
            AN<span className="text-[var(--bronze)]">K</span>ORA
          </span>
          <p className="mt-4 text-sm leading-relaxed text-[var(--pale-oak)]/60">
            Marketplace regulado de tokenización de activos reales. Operado por AMG Capital Group S.A., inscripto en CNV como Proveedor de Servicios de Activos Virtuales bajo régimen RG 1069/2025. Fiduciario: Allaria S.A. · Stack: Brickken.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-10 text-sm md:grid-cols-3">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--pale-oak)]/45">Plataforma</p>
            <ul className="mt-4 space-y-2 text-[var(--pale-oak)]/80">
              <li><a href="#proyectos" className="hover:text-[var(--bronze)]">Proyectos</a></li>
              <li><a href="#pasos" className="hover:text-[var(--bronze)]">Cómo funciona</a></li>
              <li><a href="#contacto" className="hover:text-[var(--bronze)]">Acceso anticipado</a></li>
            </ul>
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--pale-oak)]/45">Compañía</p>
            <ul className="mt-4 space-y-2 text-[var(--pale-oak)]/80">
              <li><a href="#" className="hover:text-[var(--bronze)]">AMG Capital Group</a></li>
              <li><a href="mailto:hola@ankora.io" className="hover:text-[var(--bronze)]">Contacto</a></li>
              <li><a href="#" className="hover:text-[var(--bronze)]">Prensa</a></li>
            </ul>
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--pale-oak)]/45">Legal</p>
            <ul className="mt-4 space-y-2 text-[var(--pale-oak)]/80">
              <li><a href="#" className="hover:text-[var(--bronze)]">Términos</a></li>
              <li><a href="#" className="hover:text-[var(--bronze)]">Privacidad</a></li>
              <li><a href="#" className="hover:text-[var(--bronze)]">Advertencia de riesgos</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-[var(--pale-oak)]/10">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-6 py-8 md:flex-row md:gap-10">
          <p className="shrink-0 font-mono text-[10px] uppercase tracking-[0.3em] text-[#c4392a]/85 md:w-[140px] md:pt-0.5">
            Advertencia de riesgos
          </p>
          <p className="max-w-4xl text-xs leading-relaxed text-[var(--pale-oak)]/45">
            Toda inversión en activos reales implica riesgo de pérdida parcial o
            total del capital invertido. Los rendimientos proyectados son
            estimaciones basadas en comparables del mercado y no constituyen
            garantía de rendimiento futuro. Ankora está en fase demo — la
            operatoria transaccional se habilita con la activación regulatoria
            final del stack. No ofrecemos asesoramiento financiero personalizado;
            consultá a tu asesor antes de invertir.
          </p>
        </div>
      </div>
      <div className="border-t border-[var(--pale-oak)]/10">
        <div className="mx-auto flex w-full max-w-7xl flex-col justify-between gap-2 px-6 py-6 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--pale-oak)]/45 md:flex-row">
          <span>© 2026 AMG Capital Group S.A. · PSAV CNV DI-2024-50276668</span>
          <span>Ankora — Anchored to real assets</span>
        </div>
      </div>
    </footer>
  );
}
