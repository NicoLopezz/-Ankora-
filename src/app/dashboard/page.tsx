import Link from "next/link";
import { Wallet, Coins, TrendingUp, CalendarClock, ArrowRight, MapPin } from "lucide-react";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { PortfolioChart } from "@/components/dashboard/PortfolioChart";
import { HoldingsTable } from "@/components/dashboard/HoldingsTable";
import { OpportunitiesCard } from "@/components/dashboard/OpportunitiesCard";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { PlanetDecor } from "@/components/dashboard/PlanetDecor";
import {
  dummyUser,
  dummyAssets,
  getPortfolioMetrics,
  formatUsd,
  formatDateAr,
} from "@/lib/dummy-data";

export default function DashboardPage() {
  const metrics = getPortfolioMetrics();
  const firstName = dummyUser.name.split(" ")[0];
  const featured = dummyAssets[0];

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Greeting */}
      <div className="animate-fade-in-up">
        <p className="text-xs font-medium uppercase tracking-wider text-[#b8a99e]">Panel</p>
        <h1 className="mt-1 text-2xl font-semibold text-[#ddcfc9] md:text-3xl">
          Hola, <span className="gradient-text-gold">{firstName}</span>
        </h1>
        <p className="mt-1.5 text-sm text-[#b8a99e]">
          Tu portfolio viene rindiendo{" "}
          <span className="font-semibold text-[#D4A45A]">
            +{metrics.totalReturnPct.toFixed(1)}%
          </span>{" "}
          desde que empezaste.
        </p>
      </div>

      {/* Featured project (Cafayate) — with planet decor */}
      <Link
        href={`/dashboard/activos/${featured.slug}`}
        className="group relative block overflow-hidden rounded-3xl border border-[#ddcfc9]/[0.08] transition-all duration-500 ease-in-out hover:border-[#D4A45A]/40 animate-fade-in-up animate-delay-100"
        style={{ background: `linear-gradient(135deg, ${featured.heroColor}, #3a1410 85%)` }}
      >
        {/* Grid pattern layer */}
        <div className="absolute inset-0 bg-grid-pattern opacity-60" />
        {/* Ambient gold glow */}
        <div className="pointer-events-none absolute -top-20 -right-20 h-[400px] w-[400px] rounded-full bg-[#D4A45A] opacity-[0.12] blur-[140px]" />
        <div className="pointer-events-none absolute -bottom-24 left-1/3 h-[300px] w-[300px] rounded-full bg-[#6d2721] opacity-50 blur-[120px]" />

        {/* Planet in corner */}
        <PlanetDecor
          size={300}
          className="-right-12 -top-14 hidden md:block"
          opacity={0.55}
        />
        <PlanetDecor size={180} className="-right-8 -top-6 md:hidden" opacity={0.35} />

        <div className="relative flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between md:p-10">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#D4A45A]/30 bg-[#D4A45A]/10 px-3 py-1 text-[11px] font-medium text-[#D4A45A] backdrop-blur-sm">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-[#D4A45A] opacity-75 animate-ping" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#D4A45A]" />
              </span>
              Proyecto destacado · Cosecha {featured.vintage}
            </span>
            <h2 className="mt-4 text-3xl font-bold leading-tight text-[#ddcfc9] md:text-4xl">
              Comprá un pedazo del <span className="gradient-text-gold">Valle Calchaquí</span>
            </h2>
            <p className="mt-2 flex items-center gap-1.5 text-sm text-[#ddcfc9]/70">
              <MapPin className="h-4 w-4" />
              {featured.location} · {featured.shortName}
            </p>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-[#ddcfc9]/75">
              {featured.description}
            </p>
          </div>
          <div className="flex flex-shrink-0 flex-col gap-4 md:items-end">
            <div className="flex gap-6 md:flex-col md:items-end md:gap-3">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-[#ddcfc9]/50">Tu posición</p>
                <p className="mt-0.5 text-2xl font-bold text-[#ddcfc9] tabular-nums">
                  {formatUsd(featured.currentValueUsd)}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-[#ddcfc9]/50">YTD</p>
                <p className="mt-0.5 text-2xl font-bold text-[#D4A45A] tabular-nums">
                  +{featured.ytdReturnPct.toFixed(1)}%
                </p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ddcfc9] px-5 py-2.5 text-sm font-semibold text-[#3a1410] transition-all duration-300 ease-in-out group-hover:scale-105 group-hover:bg-white">
              Ver proyecto
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </div>
        </div>
      </Link>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3 animate-fade-in-up animate-delay-200 md:grid-cols-4 md:gap-4">
        <KpiCard
          title="Valor del portfolio"
          value={formatUsd(metrics.totalValueUsd)}
          subtitle={`Invertido ${formatUsd(metrics.totalInvestedUsd)}`}
          icon={Wallet}
          trend={{ value: metrics.totalReturnPct }}
          accent="gold"
        />
        <KpiCard
          title="Activos"
          value={metrics.assetCount.toString()}
          subtitle="Posiciones tokenizadas"
          icon={Coins}
          accent="cream"
        />
        <KpiCard
          title="Rendimiento mensual"
          value={formatUsd(metrics.monthlyYieldUsd, { decimals: 2 })}
          subtitle="Dividendos abril"
          icon={TrendingUp}
          accent="gold"
        />
        <KpiCard
          title="Próximo pago"
          value={formatUsd(metrics.nextPaymentUsd, { decimals: 2 })}
          subtitle={formatDateAr(metrics.nextPaymentDate)}
          icon={CalendarClock}
          accent="muted"
        />
      </div>

      {/* Chart + Activity */}
      <div className="grid gap-4 animate-fade-in-up animate-delay-300 md:grid-cols-3 md:gap-6">
        <div className="md:col-span-2">
          <PortfolioChart />
        </div>
        <RecentActivity />
      </div>

      {/* Holdings + Opportunities */}
      <div className="grid gap-4 animate-fade-in-up animate-delay-400 md:grid-cols-3 md:gap-6">
        <div className="md:col-span-2">
          <HoldingsTable />
        </div>
        <OpportunitiesCard />
      </div>

      {/* Regulatory footer */}
      <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-[#ddcfc9]/[0.06] bg-[#ddcfc9]/[0.02] px-5 py-4 text-center text-xs text-[#b8a99e] animate-fade-in-up animate-delay-500 md:flex-row md:gap-6">
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-[#D4A45A] animate-pulse-gold" />
          Regulado por <span className="text-[#D4A45A] font-medium">CNV</span>
        </span>
        <span className="hidden md:inline">·</span>
        <span>Fiduciario: <span className="text-[#ddcfc9]">Allaria SA</span></span>
        <span className="hidden md:inline">·</span>
        <span>PSAV: <span className="text-[#ddcfc9]">AMG</span></span>
        <span className="hidden md:inline">·</span>
        <span>Infraestructura: <span className="text-[#ddcfc9]">Brickken · Polygon</span></span>
      </div>
    </div>
  );
}
