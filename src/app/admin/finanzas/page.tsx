import { PageHeader } from "@/components/dashboard/PageHeader";
import { getPlatformStats, formatUsdShort } from "@/lib/admin-data";
import { formatUsd } from "@/lib/dummy-data";
import { Wallet, Coins, TrendingUp } from "lucide-react";

export default function AdminFinanzasPage() {
  const s = getPlatformStats();
  return (
    <div className="space-y-6 md:space-y-8">
      <PageHeader
        eyebrow="Admin"
        title="Tesorería"
        description="Fees, escrow, dividendos pendientes · conciliación Allaria"
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        <Kpi icon={Wallet} label="AUM total" value={formatUsdShort(s.totalAumUsd)} accent />
        <Kpi icon={Coins} label="Fees mes actual" value={formatUsd(s.feesCollectedMonthUsd)} />
        <Kpi
          icon={TrendingUp}
          label="Dividendos a distribuir"
          value={formatUsd(s.dividendsToDistributeUsd)}
        />
        <Kpi icon={Coins} label="Capital invertido" value={formatUsdShort(s.totalInvestedUsd)} />
      </div>

      <div className="flex h-64 items-center justify-center rounded-2xl border border-dashed border-[#ddcfc9]/10 text-sm text-[#b8a99e]">
        Breakdown mensual + conciliación fiduciario (próximamente)
      </div>
    </div>
  );
}

function Kpi({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-[#ddcfc9]/[0.08] bg-[#4a1a16] p-5">
      <div
        className={
          accent
            ? "flex h-9 w-9 items-center justify-center rounded-xl bg-[#D4A45A]/10 text-[#D4A45A]"
            : "flex h-9 w-9 items-center justify-center rounded-xl bg-[#ddcfc9]/[0.04] text-[#b8a99e]"
        }
      >
        <Icon className="h-4 w-4" />
      </div>
      <p className="mt-3 text-[10px] font-medium uppercase tracking-wider text-[#b8a99e]">
        {label}
      </p>
      <p className="mt-0.5 text-xl font-semibold tabular-nums text-[#ddcfc9]">{value}</p>
    </div>
  );
}
