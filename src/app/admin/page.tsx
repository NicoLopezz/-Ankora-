import Link from "next/link";
import {
  Wallet,
  Users,
  Activity,
  ShieldAlert,
  Coins,
  TrendingUp,
  ArrowRight,
  Clock,
  AlertTriangle,
  FileText,
} from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { PortfolioChart } from "@/components/dashboard/PortfolioChart";
import {
  getPlatformStats,
  formatUsdShort,
  dummyKycQueue,
  dummyAuditLog,
  dummyClients,
} from "@/lib/admin-data";
import { formatUsd, formatTimeAgo } from "@/lib/dummy-data";
import { cn } from "@/lib/utils";

export default function AdminOverviewPage() {
  const stats = getPlatformStats();

  // Top movers (by portfolio value)
  const topClients = [...dummyClients]
    .sort((a, b) => b.portfolioValueUsd - a.portfolioValueUsd)
    .slice(0, 5);

  return (
    <div className="space-y-6 md:space-y-8">
      <PageHeader
        eyebrow="Super Admin"
        title="Overview de plataforma"
        description="Estado operativo, compliance y tesorería · actualizado en vivo"
      />

      {/* Top KPIs */}
      <div className="grid grid-cols-2 gap-3 animate-fade-in-up animate-delay-100 md:grid-cols-4 md:gap-4">
        <AdminKpi
          icon={Wallet}
          label="AUM total"
          value={formatUsdShort(stats.totalAumUsd)}
          sub={`+${stats.platformReturnPct.toFixed(1)}% platform return`}
          accent="gold"
        />
        <AdminKpi
          icon={Users}
          label="Clientes activos"
          value={stats.activeClients.toString()}
          sub={`${stats.totalClients} totales`}
        />
        <AdminKpi
          icon={Activity}
          label="Volumen P2P 24h"
          value={formatUsdShort(stats.p2pVolume24h)}
          sub={`${stats.p2pOpenOrders} órdenes activas`}
          accent="gold"
        />
        <AdminKpi
          icon={Coins}
          label="Fees del mes"
          value={formatUsdShort(stats.feesCollectedMonthUsd)}
          sub="Marketplace + P2P"
        />
      </div>

      {/* Alerts row */}
      <div className="grid gap-3 animate-fade-in-up animate-delay-200 md:grid-cols-3 md:gap-4">
        <AlertCard
          icon={Clock}
          label="KYC pendientes"
          count={stats.kycPending}
          description="Esperando revisión"
          href="/admin/kyc"
          tone="gold"
        />
        <AlertCard
          icon={AlertTriangle}
          label="KYC vencidos"
          count={stats.kycExpired}
          description="Reverificación requerida"
          href="/admin/kyc"
          tone="warn"
        />
        <AlertCard
          icon={ShieldAlert}
          label="Cuentas flagged"
          count={stats.flagged}
          description="PEP o UIF review"
          href="/admin/compliance"
          tone="warn"
        />
      </div>

      {/* Chart + Treasury summary */}
      <div className="grid gap-4 animate-fade-in-up animate-delay-300 md:grid-cols-3 md:gap-6">
        <div className="md:col-span-2">
          <PortfolioChart />
        </div>
        <div className="rounded-2xl border border-[#ddcfc9]/[0.08] bg-[#4a1a16] p-5 md:p-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#D4A45A]/10 text-[#D4A45A]">
              <TrendingUp className="h-4 w-4" />
            </div>
            <h3 className="text-sm font-semibold text-[#ddcfc9]">Tesorería</h3>
          </div>
          <ul className="mt-4 space-y-3">
            <TreasuryRow label="Fees este mes" value={formatUsd(stats.feesCollectedMonthUsd)} accent />
            <TreasuryRow
              label="Dividendos a distribuir"
              value={formatUsd(stats.dividendsToDistributeUsd)}
            />
            <TreasuryRow label="Capital invertido total" value={formatUsdShort(stats.totalInvestedUsd)} />
            <TreasuryRow label="Transacciones totales" value={stats.totalTxs.toString()} />
          </ul>
          <Link
            href="/admin/finanzas"
            className="mt-5 inline-flex w-full items-center justify-center gap-1 rounded-full border border-[#ddcfc9]/20 px-4 py-2 text-xs font-medium text-[#ddcfc9] transition-colors hover:bg-[#ddcfc9]/[0.04]"
          >
            Ver tesorería <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* Bottom row: Top clients + KYC queue + Audit log */}
      <div className="grid gap-4 animate-fade-in-up animate-delay-400 md:grid-cols-3 md:gap-6">
        {/* Top clients */}
        <div className="rounded-2xl border border-[#ddcfc9]/[0.08] bg-[#4a1a16] p-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-[#ddcfc9]">Top clientes</h3>
              <p className="mt-0.5 text-xs text-[#b8a99e]">Por AUM</p>
            </div>
            <Link
              href="/admin/usuarios"
              className="text-[11px] font-medium text-[#D4A45A] hover:text-[#e0b76a]"
            >
              Ver todos
            </Link>
          </div>
          <ul className="mt-4 space-y-2">
            {topClients.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/admin/usuarios/${c.id}`}
                  className="flex items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-[#ddcfc9]/[0.04]"
                >
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#D4A45A]/20 to-[#a87a3a]/20 text-[10px] font-bold text-[#D4A45A]">
                    {c.name
                      .split(" ")
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("")}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-[#ddcfc9]">{c.name}</p>
                    <p className="text-[10px] uppercase tracking-wider text-[#b8a99e]">
                      {c.tier}
                    </p>
                  </div>
                  <span className="font-semibold tabular-nums text-[#ddcfc9]">
                    {formatUsdShort(c.portfolioValueUsd)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* KYC queue */}
        <div className="rounded-2xl border border-[#ddcfc9]/[0.08] bg-[#4a1a16] p-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-[#ddcfc9]">Cola KYC</h3>
              <p className="mt-0.5 text-xs text-[#b8a99e]">{dummyKycQueue.length} pendientes</p>
            </div>
            <Link
              href="/admin/kyc"
              className="text-[11px] font-medium text-[#D4A45A] hover:text-[#e0b76a]"
            >
              Revisar
            </Link>
          </div>
          <ul className="mt-4 space-y-2">
            {dummyKycQueue.map((k) => {
              const riskTone =
                k.riskScore === "high"
                  ? "bg-red-500/10 text-red-300"
                  : k.riskScore === "medium"
                    ? "bg-[#D4A45A]/10 text-[#D4A45A]"
                    : "bg-[#ddcfc9]/[0.04] text-[#b8a99e]";
              return (
                <li
                  key={k.id}
                  className="flex items-center gap-3 rounded-xl border border-[#ddcfc9]/[0.06] bg-[#ddcfc9]/[0.02] p-2.5"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-[#ddcfc9]">{k.clientName}</p>
                    <p className="text-[11px] text-[#b8a99e]">
                      {k.docsCount} docs · {k.pendingDays === 0 ? "hoy" : `${k.pendingDays}d pendiente`}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                      riskTone
                    )}
                  >
                    {k.riskScore}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Audit log */}
        <div className="rounded-2xl border border-[#ddcfc9]/[0.08] bg-[#4a1a16] p-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-[#ddcfc9]">Audit log</h3>
              <p className="mt-0.5 text-xs text-[#b8a99e]">Últimos eventos</p>
            </div>
            <Link
              href="/admin/compliance"
              className="text-[11px] font-medium text-[#D4A45A] hover:text-[#e0b76a]"
            >
              Ver completo
            </Link>
          </div>
          <ul className="mt-4 space-y-2">
            {dummyAuditLog.slice(0, 5).map((e) => (
              <li
                key={e.id}
                className="flex items-start gap-2.5 rounded-xl px-2 py-2 transition-colors hover:bg-[#ddcfc9]/[0.04]"
              >
                <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-[#ddcfc9]/[0.04] text-[#b8a99e]">
                  <FileText className="h-3.5 w-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-mono text-[11px] text-[#ddcfc9]">{e.action}</p>
                  <p className="truncate text-[10px] text-[#b8a99e]">
                    {e.actor} · {formatTimeAgo(e.timestamp)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function AdminKpi({
  icon: Icon,
  label,
  value,
  sub,
  accent,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  sub: string;
  accent?: "gold";
}) {
  return (
    <div className="rounded-2xl border border-[#ddcfc9]/[0.08] bg-[#4a1a16] p-5">
      <div
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-xl",
          accent === "gold" ? "bg-[#D4A45A]/10 text-[#D4A45A]" : "bg-[#ddcfc9]/[0.04] text-[#b8a99e]"
        )}
      >
        <Icon className="h-4 w-4" />
      </div>
      <p className="mt-3 text-[10px] font-medium uppercase tracking-wider text-[#b8a99e]">
        {label}
      </p>
      <p className="mt-0.5 text-2xl font-semibold tabular-nums text-[#ddcfc9]">{value}</p>
      <p className="mt-0.5 text-[11px] text-[#b8a99e]">{sub}</p>
    </div>
  );
}

function AlertCard({
  icon: Icon,
  label,
  count,
  description,
  href,
  tone,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  count: number;
  description: string;
  href: string;
  tone: "gold" | "warn";
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group flex items-center gap-4 rounded-2xl border p-4 transition-all duration-300 hover:-translate-y-[2px]",
        tone === "warn"
          ? "border-red-400/20 bg-red-400/[0.04] hover:border-red-400/40"
          : "border-[#D4A45A]/25 bg-[#D4A45A]/[0.04] hover:border-[#D4A45A]/50"
      )}
    >
      <div
        className={cn(
          "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl",
          tone === "warn" ? "bg-red-400/10 text-red-300" : "bg-[#D4A45A]/10 text-[#D4A45A]"
        )}
      >
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-medium uppercase tracking-wider text-[#b8a99e]">{label}</p>
        <p className="text-2xl font-semibold tabular-nums text-[#ddcfc9]">{count}</p>
        <p className="mt-0.5 text-[11px] text-[#b8a99e]">{description}</p>
      </div>
      <ArrowRight
        className={cn(
          "h-4 w-4 transition-all duration-300 group-hover:translate-x-1",
          tone === "warn" ? "text-red-300" : "text-[#D4A45A]"
        )}
      />
    </Link>
  );
}

function TreasuryRow({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <li className="flex items-center justify-between text-sm">
      <span className="text-[#b8a99e]">{label}</span>
      <span
        className={cn(
          "tabular-nums font-semibold",
          accent ? "text-[#D4A45A]" : "text-[#ddcfc9]"
        )}
      >
        {value}
      </span>
    </li>
  );
}
