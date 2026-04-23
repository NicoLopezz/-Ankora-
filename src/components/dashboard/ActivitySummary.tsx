import Link from "next/link";
import { Coins, CalendarClock, ArrowRight, Sparkles, Clock3 } from "lucide-react";
import {
  dummyTransactions,
  dummyAssets,
  formatUsd,
  formatDateAr,
  getPortfolioMetrics,
} from "@/lib/dummy-data";

export function ActivitySummary() {
  const metrics = getPortfolioMetrics();

  // YTD dividends (all dividendo txs of current year — mock uses 2026)
  const ytdDividends = dummyTransactions
    .filter((t) => t.type === "dividendo" && t.date.startsWith("2026"))
    .reduce((s, t) => s + t.amountUsd, 0);
  const ytdCount = dummyTransactions.filter(
    (t) => t.type === "dividendo" && t.date.startsWith("2026")
  ).length;

  // Last 3 dividend liquidations
  const lastDividends = dummyTransactions
    .filter((t) => t.type === "dividendo")
    .slice(0, 3);

  // Upcoming milestone — nearest non-completed across all owned assets
  const upcomingMilestones = dummyAssets
    .flatMap((a) =>
      a.milestones
        .filter((m) => !m.completed)
        .map((m) => ({ ...m, assetName: a.shortName, assetSlug: a.slug }))
    )
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const nextMilestone = upcomingMilestones[0];

  // Days until next payment
  const daysToNextPayment = Math.max(
    0,
    Math.ceil((new Date(metrics.nextPaymentDate).getTime() - Date.now()) / 86400000)
  );
  const nextPaymentAsset =
    dummyAssets.find((a) => a.nextDividendDate === metrics.nextPaymentDate)?.shortName ??
    "Solar San Juan";

  return (
    <section className="relative overflow-hidden rounded-3xl border border-[#ddcfc9]/[0.08] bg-[#4a1a16] p-5 animate-fade-in-up animate-delay-100 md:p-8">
      {/* Ambient */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,164,90,0.1),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-20" />

      <div className="relative grid gap-6 md:grid-cols-3 md:gap-8">
        {/* Left: big stat — dividends YTD */}
        <div className="md:col-span-1">
          <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-[#b8a99e]">
            <Coins className="h-3 w-3" />
            Cobrado en 2026
          </div>
          <p className="mt-2 text-4xl font-bold tabular-nums text-[#ddcfc9] md:text-5xl">
            {formatUsd(ytdDividends, { decimals: 2 })}
          </p>
          <p className="mt-1.5 text-xs text-[#b8a99e]">
            {ytdCount} {ytdCount === 1 ? "pago recibido" : "pagos recibidos"} ·{" "}
            <span className="text-[#D4A45A]">+23%</span> vs 2025
          </p>

          <div className="mt-5 rounded-xl border border-[#D4A45A]/25 bg-[#D4A45A]/[0.05] p-3">
            <div className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-[#D4A45A]">
              <CalendarClock className="h-3 w-3" />
              Próximo pago
            </div>
            <div className="mt-1.5 flex items-baseline gap-2">
              <span className="text-xl font-bold tabular-nums text-[#ddcfc9]">
                {formatUsd(metrics.nextPaymentUsd, { decimals: 2 })}
              </span>
              <span className="flex items-center gap-1 text-[11px] text-[#b8a99e]">
                <Clock3 className="h-3 w-3" />
                en {daysToNextPayment} días
              </span>
            </div>
            <p className="mt-1 text-[11px] text-[#b8a99e]">
              {nextPaymentAsset} · {formatDateAr(metrics.nextPaymentDate)}
            </p>
          </div>
        </div>

        {/* Middle: last liquidations */}
        <div className="md:col-span-2">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-medium uppercase tracking-wider text-[#b8a99e]">
              Últimas liquidaciones
            </p>
            <Link
              href="/dashboard/transacciones"
              className="inline-flex items-center gap-1 text-[11px] font-medium text-[#D4A45A] transition-colors hover:text-[#e0b76a]"
            >
              Ver historial <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <ul className="mt-3 space-y-2">
            {lastDividends.map((tx) => (
              <li key={tx.id}>
                <Link
                  href={tx.assetSlug ? `/dashboard/activos/${tx.assetSlug}` : "/dashboard/transacciones"}
                  className="group flex items-center gap-3 rounded-xl border border-[#ddcfc9]/[0.06] bg-[#ddcfc9]/[0.02] px-3 py-2.5 transition-all hover:border-[#D4A45A]/30 hover:bg-[#ddcfc9]/[0.04]"
                >
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-[#D4A45A]/10 text-[#D4A45A]">
                    <Coins className="h-3.5 w-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-[#ddcfc9]">{tx.assetName}</p>
                    <p className="text-[11px] text-[#b8a99e]">Dividendo · {formatDateAr(tx.date)}</p>
                  </div>
                  <span className="font-semibold tabular-nums text-[#D4A45A]">
                    +{formatUsd(tx.amountUsd, { decimals: 2 })}
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          {/* Upcoming milestone */}
          {nextMilestone && (
            <div className="mt-4 flex items-start gap-3 rounded-xl border border-[#ddcfc9]/[0.06] bg-[#ddcfc9]/[0.02] px-3 py-2.5">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-[#ddcfc9]/[0.04] text-[#D4A45A]">
                <Sparkles className="h-3.5 w-3.5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-medium uppercase tracking-wider text-[#b8a99e]">
                  Próximo hito
                </p>
                <Link
                  href={`/dashboard/activos/${nextMilestone.assetSlug}`}
                  className="mt-0.5 block text-sm text-[#ddcfc9] transition-colors hover:text-[#D4A45A]"
                >
                  <span className="font-medium">{nextMilestone.title}</span>
                  <span className="text-[#b8a99e]">
                    {" "}
                    · {nextMilestone.assetName} · {formatDateAr(nextMilestone.date)}
                  </span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
