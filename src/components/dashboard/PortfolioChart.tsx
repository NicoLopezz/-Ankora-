"use client";

const points = [100, 103, 102, 107, 110, 108, 112, 115, 114, 118, 121, 124];
const labels = ["May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic", "Ene", "Feb", "Mar", "Abr"];

export function PortfolioChart() {
  const width = 560;
  const height = 180;
  const padding = 16;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;

  const xStep = (width - padding * 2) / (points.length - 1);
  const pathD = points
    .map((p, i) => {
      const x = padding + i * xStep;
      const y = height - padding - ((p - min) / range) * (height - padding * 2);
      return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");

  const areaD = `${pathD} L ${padding + (points.length - 1) * xStep} ${height - padding} L ${padding} ${height - padding} Z`;

  return (
    <div className="rounded-2xl border border-[#ddcfc9]/[0.08] bg-[#4a1a16] p-5 md:p-6">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-semibold text-[#ddcfc9]">Performance del portfolio</h3>
          <p className="mt-0.5 text-xs text-[#b8a99e]">Últimos 12 meses · rendimiento acumulado</p>
        </div>
        <div className="inline-flex items-center gap-1 rounded-full bg-[#D4A45A]/10 px-2.5 py-1 text-xs font-semibold text-[#D4A45A]">
          +24.0%
        </div>
      </div>

      <div className="mt-5">
        <svg viewBox={`0 0 ${width} ${height}`} className="h-44 w-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="ankora-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#D4A45A" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#D4A45A" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={areaD} fill="url(#ankora-gradient)" />
          <path d={pathD} fill="none" stroke="#D4A45A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          {points.map((p, i) => {
            const x = padding + i * xStep;
            const y = height - padding - ((p - min) / range) * (height - padding * 2);
            return <circle key={i} cx={x} cy={y} r={i === points.length - 1 ? 3.5 : 0} fill="#D4A45A" />;
          })}
        </svg>
        <div className="mt-2 flex justify-between text-[10px] uppercase tracking-wider text-[#b8a99e]">
          {labels.map((l) => (
            <span key={l}>{l}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
