import { Wallet, Coins, TrendingUp, CalendarClock } from "lucide-react";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { PortfolioChart } from "@/components/dashboard/PortfolioChart";
import { HoldingsTable } from "@/components/dashboard/HoldingsTable";
import { OpportunitiesCard } from "@/components/dashboard/OpportunitiesCard";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { ActivitySummary } from "@/components/dashboard/ActivitySummary";
import { OnboardingChecklist } from "@/components/dashboard/OnboardingChecklist";
import { dummyUser, getPortfolioMetrics, formatUsd, formatDateAr } from "@/lib/dummy-data";

export default function DashboardPage() {
  const metrics = getPortfolioMetrics();
  const firstName = dummyUser.name.split(" ")[0];

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

      {/* Onboarding checklist — aparece hasta completar todos los pasos, dismissible */}
      <OnboardingChecklist />

      {/* Activity summary — dividendos, próximo pago, últimas liquidaciones, hitos */}
      <ActivitySummary />

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
        <span>Fiduciario: <span className="text-[#ddcfc9]">ALyC regulado</span></span>
        <span className="hidden md:inline">·</span>
        <span>PSAV: <span className="text-[#ddcfc9]">AMG</span></span>
        <span className="hidden md:inline">·</span>
        <span>Infraestructura: <span className="text-[#ddcfc9]">Polygon · ERC-7943</span></span>
      </div>
    </div>
  );
}
