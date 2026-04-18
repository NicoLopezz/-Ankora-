export function Footer() {
  return (
    <footer className="border-t border-[var(--pale-oak)]/10 bg-[var(--surface)]/50">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-16 md:flex-row md:justify-between">
        <div className="max-w-sm">
          <span className="font-display text-3xl tracking-tight text-[var(--pale-oak)]">
            Ark<span className="text-[var(--bronze)]">ara</span>
          </span>
          <p className="mt-4 text-sm leading-relaxed text-[var(--pale-oak)]/60">
            Plataforma de tokenización de activos reales. Regulada bajo marco CNV (Argentina) y DFSA (Emiratos Árabes Unidos).
          </p>
        </div>
        <div className="grid grid-cols-2 gap-10 text-sm md:grid-cols-3">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--pale-oak)]/45">Plataforma</p>
            <ul className="mt-4 space-y-2 text-[var(--pale-oak)]/80">
              <li><a href="#proyectos" className="hover:text-[var(--bronze)]">Proyectos</a></li>
              <li><a href="#pasos" className="hover:text-[var(--bronze)]">Cómo funciona</a></li>
              <li><a href="#" className="hover:text-[var(--bronze)]">Mercado secundario</a></li>
            </ul>
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--pale-oak)]/45">Compañía</p>
            <ul className="mt-4 space-y-2 text-[var(--pale-oak)]/80">
              <li><a href="#" className="hover:text-[var(--bronze)]">Nosotros</a></li>
              <li><a href="#" className="hover:text-[var(--bronze)]">Carreras</a></li>
              <li><a href="#" className="hover:text-[var(--bronze)]">Prensa</a></li>
            </ul>
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--pale-oak)]/45">Legal</p>
            <ul className="mt-4 space-y-2 text-[var(--pale-oak)]/80">
              <li><a href="#" className="hover:text-[var(--bronze)]">Términos</a></li>
              <li><a href="#" className="hover:text-[var(--bronze)]">Privacidad</a></li>
              <li><a href="#" className="hover:text-[var(--bronze)]">Riesgos</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-[var(--pale-oak)]/10">
        <div className="mx-auto flex w-full max-w-7xl flex-col justify-between gap-2 px-6 py-6 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--pale-oak)]/45 md:flex-row">
          <span>© 2026 Arkara Capital</span>
          <span>Tokenización de activos reales · hecho con criterio</span>
        </div>
      </div>
    </footer>
  );
}
