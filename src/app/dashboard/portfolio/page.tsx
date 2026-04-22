import { TrendingUp, Wallet, Coins, PieChart } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { PortfolioChart } from "@/components/dashboard/PortfolioChart";
import {
  dummyAssets,
  getPortfolioMetrics,
  formatUsd,
  categoryLabel,
  categoryEmoji,
} from "@/lib/dummy-data";
import type { AssetCategory } from "@/types/ankora";

export default function PortfolioPage() {
  const metrics = getPortfolioMetrics();

  // Allocation by category
  const byCategory = new Map<AssetCategory, { value: number; invested: number }>();
  for (const a of dummyAssets) {
    const cur = byCategory.get(a.category) ?? { value: 0, invested: 0 };
    byCategory.set(a.category, {
      value: cur.value + a.currentValueUsd,
      invested: cur.invested + a.investedUsd,
    });
  }
  const allocation = Array.from(byCategory.entries())
    .map(([cat, vals]) => ({
      category: cat,
      value: vals.value,
      invested: vals.invested,
      pct: (vals.value / metrics.totalValueUsd) * 100,
    }))
    .sort((a, b) => b.value - a.value);

  const palette = ["#D4A45A", "#e0b76a", "#b8794a", "#8f5a32", "#6b4220"];

  // Donut math
  let cumulative = 0;
  const donutSegments = allocation.map((a, i) => {
    const start = cumulative;
    cumulative += a.pct;
    return { ...a, start, end: cumulative, color: palette[i % palette.length] };
  });

  return (
    <div className="space-y-6 md:space-y-8">
      <PageHeader
        eyebrow="Análisis"
        title="Portfolio"
        description="Distribución, rendimiento histórico y composición de tu cartera."
      />

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3 animate-fade-in-up animate-delay-100 md:grid-cols-4 md:gap-4">
        <KpiCard
          title="Valor total"
          value={formatUsd(metrics.totalValueUsd)}
          icon={Wallet}
          trend={{ value: metrics.totalReturnPct }}
        />
        <KpiCard
          title="Total invertido"
          value={formatUsd(metrics.totalInvestedUsd)}
          subtitle="Capital aportado"
          icon={Coins}
          accent="cream"
        />
        <KpiCard
          title="Ganancia"
          value={formatUsd(metrics.totalValueUsd - metrics.totalInvestedUsd)}
          subtitle="No realizada + dividendos"
          icon={TrendingUp}
        />
        <KpiCard
          title="Categorías"
          value={allocation.length.toString()}
          subtitle={`${metrics.assetCount} activos`}
          icon={PieChart}
          accent="muted"
        />
      </div>

      {/* Performance chart */}
      <div className="animate-fade-in-up animate-delay-200">
        <PortfolioChart />
      </div>

      {/* Allocation */}
      <div className="grid gap-4 animate-fade-in-up animate-delay-300 lg:grid-cols-5 lg:gap-6">
        {/* Donut */}
        <div className="rounded-2xl border border-[#ddcfc9]/[0.08] bg-[#4a1a16] p-6 lg:col-span-2">
          <h3 className="text-sm font-semibold text-[#ddcfc9]">Distribución por categoría</h3>
          <p className="mt-0.5 text-xs text-[#b8a99e]">% sobre valor actual</p>

          <div className="mt-6 flex items-center justify-center">
            <Donut segments={donutSegments} />
          </div>

          <ul className="mt-6 space-y-2">
            {donutSegments.map((s) => (
              <li key={s.category} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-sm"
                    style={{ backgroundColor: s.color }}
                  />
                  <span className="text-[#ddcfc9]">
                    {categoryEmoji[s.category]} {categoryLabel[s.category]}
                  </span>
                </div>
                <span className="tabular-nums font-semibold text-[#ddcfc9]">
                  {s.pct.toFixed(1)}%
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Bars by asset */}
        <div className="rounded-2xl border border-[#ddcfc9]/[0.08] bg-[#4a1a16] p-6 lg:col-span-3">
          <h3 className="text-sm font-semibold text-[#ddcfc9]">Desempeño por activo</h3>
          <p className="mt-0.5 text-xs text-[#b8a99e]">YTD vs APY objetivo</p>

          <ul className="mt-6 space-y-5">
            {dummyAssets.map((a) => {
              const ratio = Math.min((a.ytdReturnPct / a.targetApyPct) * 100, 100);
              return (
                <li key={a.id}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#ddcfc9]">
                      <span className="mr-1">{categoryEmoji[a.category]}</span>
                      {a.shortName}
                    </span>
                    <span className="tabular-nums text-[#b8a99e]">
                      <span className="text-[#D4A45A] font-semibold">
                        {a.ytdReturnPct.toFixed(1)}%
                      </span>{" "}
                      / {a.targetApyPct.toFixed(1)}%
                    </span>
                  </div>
                  <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-[#ddcfc9]/[0.06]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#D4A45A] to-[#e0b76a]"
                      style={{ width: `${ratio}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

function Donut({
  segments,
}: {
  segments: { start: number; end: number; color: string; category: AssetCategory }[];
}) {
  const size = 180;
  const stroke = 24;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(221,207,201,0.06)"
          strokeWidth={stroke}
        />
        {segments.map((s, i) => {
          const dash = ((s.end - s.start) / 100) * c;
          const offset = -((s.start / 100) * c);
          return (
            <circle
              key={i}
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke={s.color}
              strokeWidth={stroke}
              strokeDasharray={`${dash} ${c - dash}`}
              strokeDashoffset={offset}
              strokeLinecap="butt"
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[10px] uppercase tracking-wider text-[#b8a99e]">Activos</span>
        <span className="text-2xl font-bold text-[#ddcfc9]">{segments.length}</span>
      </div>
    </div>
  );
}
